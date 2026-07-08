const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const brandRoutes = require("./routes/brands");
const orderRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customers");
const couponRoutes = require("./routes/coupons");
const reviewRoutes = require("./routes/reviews");
const bannerRoutes = require("./routes/banners");
const blogRoutes = require("./routes/blogs");
const pageRoutes = require("./routes/pages");
const settingRoutes = require("./routes/settings");
const reportRoutes = require("./routes/reports");
const inventoryRoutes = require("./routes/inventory");
const uploadRoutes = require("./routes/uploads");
const adminUserRoutes = require("./routes/admins");
const notificationRoutes = require("./routes/notifications");
const storefrontUserRoutes = require("./routes/users");
const roleRoutes = require("./routes/roles");
const trashRoutes = require("./routes/trash");
const newsletterRoutes = require("./routes/newsletter");
const approvalRoutes = require("./routes/approvals");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
routerBanners = app.use("/api/banners", bannerRoutes);
routerBlogs = app.use("/api/blogs", blogRoutes);
routerPages = app.use("/api/pages", pageRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admins", adminUserRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", storefrontUserRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/approvals", approvalRoutes);

// Serve admin panel static files
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));

// Serve storefront static files
app.use(express.static(path.join(__dirname, "../dist")));

// Admin SPA routing fallback
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// Storefront SPA routing fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});