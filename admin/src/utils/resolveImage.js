import fieraVitaminCSerum from "../../../src/assets/products/fiera-vitamin-c-serum.png";
import fifthAndGlowCyabags from "../../../src/assets/products/fifth-and-glow-cyabags.png";
import gluco24 from "../../../src/assets/products/gluco24.png";
import maleEnhancement from "../../../src/assets/products/male-enhancement.png";
import aristosTrim from "../../../src/assets/products/aristos-trim.png";
import nativeGreensSuperfoodPowder from "../../../src/assets/products/native-greens-superfood-powder.png";

// Categories
import energyPerformance from "../../../src/assets/category/energy-performance.png";
import weightManagement from "../../../src/assets/category/weight-management.jpg";
import immuneSupport from "../../../src/assets/category/immune-support.jpg";
import herbalNatural from "../../../src/assets/category/herbal-natural.png";
import vitaminsNutrition from "../../../src/assets/category/energy-performance.png";
import beautySkin from "../../../src/assets/category/weight-management.jpg";
import healthyLiving from "../../../src/assets/category/immune-support.jpg";

export const productImages = {
  "fiera-vitamin-c-serum": fieraVitaminCSerum,
  "fifth-and-glow-cyabags": fifthAndGlowCyabags,
  "gluco24": gluco24,
  "male-enhancement": maleEnhancement,
  "aristos-trim": aristosTrim,
  "native-greens-superfood-powder": nativeGreensSuperfoodPowder,
};

export const categoryImages = {
  "energy-performance": energyPerformance,
  "weight-management": weightManagement,
  "immune-support": immuneSupport,
  "herbal-natural": herbalNatural,
  "vitamins-nutrition": vitaminsNutrition,
  "beauty-skin": beautySkin,
  "healthy-living": healthyLiving,
};

export const resolveProductImage = (img, slug) => {
  if (!img) return null;
  if (img.trim().startsWith("<iframe") || img.trim().startsWith("<div") || img.includes("</iframe>")) {
    return null;
  }
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

export const resolveCategoryImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return categoryImages[img] || categoryImages[slug] || img;
};
