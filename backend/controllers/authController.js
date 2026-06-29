const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { resolveAdminPermissions } = require("../middleware/auth");

const generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_123",
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_key_456",
    { expiresIn: "7d" }
  );
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      const accessToken = generateAccessToken(admin._id);
      const refreshToken = generateRefreshToken(admin._id);

      // Save refresh token to db
      admin.refreshToken = refreshToken;

      // Track login history
      admin.loginHistory.push({
        ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
      });

      await admin.save();
      await admin.populate("roleId");

      // Set refresh token in HttpOnly cookie if rememberMe is true, or handle token exchange
      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        roleId: admin.roleId,
        permissions: resolveAdminPermissions(admin),
        accessToken,
        refreshToken: rememberMe ? refreshToken : undefined, // client can store if rememberMe
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh Admin JWT Token
// @route   POST /api/admin/refresh
// @access  Public
const refreshToken = async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.adminRefreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_key_456"
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(admin._id);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Refresh token failed/expired" });
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      admin.refreshToken = "";
      await admin.save();
    }

    res.clearCookie("adminRefreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password").populate("roleId");
    if (admin) {
      const resolvedAdmin = admin.toObject();
      resolvedAdmin.permissions = resolveAdminPermissions(admin);
      res.json(resolvedAdmin);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  getProfile,
};
