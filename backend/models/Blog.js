const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featuredImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Admin",
    },
    views: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    displayBadge: {
      type: String,
      default: "No Badge",
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: [{ type: String }],
      focusKeyword: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      indexing: {
        index: { type: Boolean, default: true },
        follow: { type: Boolean, default: true },
        noArchive: { type: Boolean, default: false },
        noSnippet: { type: Boolean, default: false }
      }
    },
    social: {
      ogTitle: { type: String, default: "" },
      ogDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      twitterTitle: { type: String, default: "" },
      twitterDescription: { type: String, default: "" },
      twitterCardType: { type: String, default: "Summary Large Image" }
    },
    schemaOverride: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
