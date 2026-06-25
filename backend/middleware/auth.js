const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_jwt_secret_key_123"
      );

      // Get admin from token, excluding password
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found, unauthorized" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Superadmin role required" });
  }
};

const checkPermission = (resource) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (req.admin.role === "superadmin") {
      return next();
    }
    if (req.admin.permissions && req.admin.permissions[resource]) {
      return next();
    }
    res.status(403).json({ message: `Access denied. Lacking ${resource} permission.` });
  };
};

const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_jwt_secret_key_123"
      );

      const Customer = require("../models/Customer");
      req.user = await Customer.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Customer account not found, unauthorized" });
      }

      next();
    } catch (error) {
      console.error("Storefront JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Session expired, login required" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Login required to access this feature" });
  }
};

module.exports = { protect, superAdminOnly, checkPermission, protectUser };
