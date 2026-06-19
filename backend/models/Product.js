const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    image: String,
    price: String,

    category: String,
    categoryName: String,

    rating: Number,
    reviews: Number,

    isBestSeller: Boolean,
    badge: String,

    description: String,

    specifications: [
      {
        label: String,
        value: String,
      },
    ],

    aboutItems: [String],

    brandDescription: String,
    moreAbout: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  ProductSchema
);