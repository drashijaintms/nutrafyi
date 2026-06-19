const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});