const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" }, // Featured image
    gallery: [{ type: String }],          // Gallery images
    price: { type: String, default: "" }, // Standard price / regular price
    regularPrice: { type: String, default: "" },
    salePrice: { type: String, default: "" },
    saleStart: { type: Date, default: null },
    saleEnd: { type: Date, default: null },
    currencyOverrides: {
      INR: {
        price: { type: String, default: "" },
        regularPrice: { type: String, default: "" },
        salePrice: { type: String, default: "" }
      },
      EUR: {
        price: { type: String, default: "" },
        regularPrice: { type: String, default: "" },
        salePrice: { type: String, default: "" }
      }
    },

    category: { type: String, default: "" }, // Category slug
    categoryName: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    brand: { type: String, default: "" },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    isBestSeller: { type: Boolean, default: false },
    badge: { type: String, default: "" },

    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },

    specifications: [
      {
        label: String,
        value: String,
      },
    ],

    aboutItems: [String],

    brandDescription: { type: String, default: "" },
    moreAbout: { type: String, default: "" },

    // WooCommerce elements
    sku: { type: String, default: "" },
    barcode: { type: String, default: "" }, // GTIN, UPC, EAN, or ISBN
    manageStock: { type: Boolean, default: false },
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "On Backorder"],
      default: "In Stock"
    },
    soldIndividually: { type: Boolean, default: false },
    isVirtual: { type: Boolean, default: false },
    isDownloadable: { type: Boolean, default: false },
    externalUrl: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    productType: {
      type: String,
      enum: ["Simple", "Variable", "Grouped", "External", "Digital"],
      default: "Simple"
    },
    digitalFile: { type: String, default: "" }, // File link if downloadable

    // Shipping
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    shippingClass: { type: String, default: "" },

    // Linked Products
    upsells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    crossSells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    groupedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    attributes: [
      {
        name: String, // e.g., Color, Size
        values: [String], // e.g., ["Red", "Blue"], ["S", "M"]
        visibleOnProductPage: { type: Boolean, default: true },
        usedForVariations: { type: Boolean, default: false }
      }
    ],

    variations: [
      {
        combination: { type: Map, of: String }, // e.g. { Color: "Red", Size: "S" }
        image: { type: String, default: "" },
        sku: { type: String, default: "" },
        price: { type: String, default: "" },
        salePrice: { type: String, default: "" },
        stock: { type: Number, default: 0 },
        weight: { type: Number, default: 0 }
      }
    ],

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: [{ type: String }],
      canonicalUrl: { type: String, default: "" }
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Scheduled"],
      default: "Published"
    },
    publishDate: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Video/Iframe media support
    videoType: { type: String, enum: ["url", "iframe", ""], default: "" },
    videoUrl: { type: String, default: "" },
    videoIframe: { type: String, default: "" },

    // Vendor Approval Workflow
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",  // existing/superadmin products auto-approved
    },
    approvalNote: { type: String, default: "" },  // rejection reason from superadmin
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);