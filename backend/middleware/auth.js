const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const resolveAdminPermissions = (admin) => {
  if (admin.role === "superadmin" || admin.role === "Administrator" || admin.role === "Admin") {
    return {
      products: true,
      categories: true,
      brands: true,
      orders: true,
      customers: true,
      users_view: true,
      users_create: true,
      users_edit: true,
      users_delete: true,
      coupons: true,
      reviews: true,
      inventory: true,
      pages: true,
      blogs: true,
      settings: true,
      admins: true
    };
  }
  if (!admin.roleId || !admin.roleId.permissions) {
    return admin.permissions || {};
  }
  const rp = admin.roleId.permissions;
  return {
    products: !!(rp.products?.view || rp.products?.edit || rp.products?.delete),
    categories: !!(rp.categories?.view || rp.categories?.edit || rp.categories?.delete),
    brands: !!(rp.brands?.view || rp.brands?.edit || rp.brands?.delete),
    orders: !!(rp.orders?.view || rp.orders?.edit || rp.orders?.delete),
    customers: !!(rp.customers?.view || rp.customers?.edit || rp.customers?.delete),
    coupons: !!(rp.coupons?.view || rp.coupons?.edit || rp.coupons?.delete),
    reviews: !!(rp.reviews?.view || rp.reviews?.edit || rp.reviews?.delete),
    inventory: !!(rp.inventory?.view || rp.inventory?.edit || rp.inventory?.delete),
    pages: !!(rp.cmsPages?.view || rp.cmsPages?.edit || rp.cmsPages?.delete),
    blogs: !!(rp.cmsBlogs?.view || rp.cmsBlogs?.edit || rp.cmsBlogs?.delete),
    settings: !!(rp.settings?.view || rp.settings?.edit || rp.settings?.delete),
    admins: !!(rp.roles?.view || rp.roles?.edit || rp.roles?.delete),
    users_view: !!(rp.customers?.view),
    users_create: !!(rp.customers?.edit),
    users_edit: !!(rp.customers?.edit),
    users_delete: !!(rp.customers?.delete),
    roles_view: !!(rp.roles?.view),
    roles_create: !!(rp.roles?.edit),
    roles_edit: !!(rp.roles?.edit),
    roles_delete: !!(rp.roles?.delete)
  };
};

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
      req.admin = await Admin.findById(decoded.id).select("-password").populate("roleId");
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
  if (req.admin && (req.admin.role === "superadmin" || req.admin.role === "Administrator")) {
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
    if (req.admin.role === "superadmin" || req.admin.role === "Administrator") {
      return next();
    }
    const perms = resolveAdminPermissions(req.admin);
    if (perms && perms[resource] === true) {
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

module.exports = { protect, superAdminOnly, checkPermission, protectUser, resolveAdminPermissions };
