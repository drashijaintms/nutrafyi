require("dotenv").config();

const connectDB = require("../config/db");
const Category = require("../models/Category");
const categories = require("../data/categories");

const importData = async () => {
  try {
    await connectDB();

    await Category.deleteMany();

    await Category.insertMany(categories);

    console.log("✅ Categories Imported");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();