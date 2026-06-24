/**
 * Migration: Strip currency symbols from all product price fields
 * Run once with: node backend/scripts/fixPrices.js
 *
 * Cleans price, regularPrice, salePrice fields on every product in the DB.
 * e.g. "$79.00" → "79.00"  |  "₹79" → "79"  |  "79" → "79"
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/nutrafyi";

// Strip any non-numeric chars except the decimal point
const clean = (val) => {
  if (!val || typeof val !== "string") return val;
  const stripped = val.replace(/[^\d.]/g, "").trim();
  return stripped || val; // fallback to original if nothing left
};

async function migrate() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.");

  const products = await Product.find({});
  console.log(`Found ${products.length} products.\n`);

  let updated = 0;

  for (const product of products) {
    const oldPrice        = product.price;
    const oldRegular      = product.regularPrice;
    const oldSale         = product.salePrice;

    const newPrice        = clean(product.price);
    const newRegular      = clean(product.regularPrice);
    const newSale         = clean(product.salePrice);

    // Also clean variation prices
    let variationsChanged = false;
    const newVariations = (product.variations || []).map((v) => {
      const vOldPrice = v.price;
      const vOldSale  = v.salePrice;
      const vNewPrice = clean(v.price);
      const vNewSale  = clean(v.salePrice);
      if (vOldPrice !== vNewPrice || vOldSale !== vNewSale) {
        variationsChanged = true;
        return { ...v._doc, price: vNewPrice, salePrice: vNewSale };
      }
      return v._doc;
    });

    const needsUpdate =
      oldPrice   !== newPrice   ||
      oldRegular !== newRegular ||
      oldSale    !== newSale    ||
      variationsChanged;

    if (needsUpdate) {
      console.log(`  [${product.slug}]`);
      if (oldPrice   !== newPrice)   console.log(`    price:        "${oldPrice}" → "${newPrice}"`);
      if (oldRegular !== newRegular) console.log(`    regularPrice: "${oldRegular}" → "${newRegular}"`);
      if (oldSale    !== newSale)    console.log(`    salePrice:    "${oldSale}" → "${newSale}"`);

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            price:        newPrice,
            regularPrice: newRegular,
            salePrice:    newSale,
            variations:   variationsChanged ? newVariations : product.variations,
          },
        }
      );
      updated++;
    }
  }

  console.log(`\nDone. ${updated} products updated.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
