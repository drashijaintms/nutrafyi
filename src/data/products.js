import fieraVitaminCSerum from "../assets/products/fiera-vitamin-c-serum.png";
import fifthAndGlowCyabags from "../assets/products/fifth-and-glow-cyabags.png";
import gluco24 from "../assets/products/gluco24.png";
import maleEnhancement from "../assets/products/male-enhancement.png";
import aristosTrim from "../assets/products/aristos-trim.png";
import nativeGreensSuperfoodPowder from "../assets/products/native-greens-superfood-powder.png";

export const products = [
  {
    id: 1,
    title: "Fièra Vitamin C Serum",
    slug: "fiera-vitamin-c-serum",
    image: fieraVitaminCSerum,
    price: "$44.10",
    category: "beauty-skin",
    categoryName: "Beauty & Personal Care",
    rating: 5,
    reviews: 2415,
    isBestSeller: false,
    badge: "",
    description:
      "A premium Vitamin C serum designed to brighten skin, reduce fine lines, and support a healthy youthful glow.",

    specifications: [
      { label: "BRAND", value: "Fièra" },
      { label: "ITEM FORM", value: "Serum" },
      { label: "DIET TYPE", value: "Cruelty Free" },
    ],

    aboutItems: [
      "Brightens dull-looking skin.",
      "Helps reduce dark spots and discoloration.",
      "Hydrates and smooths skin texture.",
      "Suitable for daily use."
    ],

    brandDescription:
      "Fièra creates premium beauty products designed to support healthy and radiant skin.",

      moreAbout:
  "Aqua/Water/Eau, Sodium Ascorbyl Phosphate, Glycerin, Butylene Glycol, Citrus Aurantium Dulcis Oil, Saccharide Isomerate, Phenoxyethanol, Polysorbate 20, Xanthan Gum, Carrageenan and other premium ingredients designed to support healthy skin and wellness."
  },

  {
    id: 2,
    title: "5th & Glow Cyabags",
    slug: "fifth-and-glow-cyabags",
    image: fifthAndGlowCyabags,
    price: "$49.95",
    category: "beauty-skin",
    categoryName: "Beauty & Personal Care",
    rating: 5,
    reviews: 2415,
    isBestSeller: true,
    badge: "",
    description:
      "Advanced under-eye support formulated to help reduce puffiness, dark circles and signs of fatigue.",

    specifications: [
      { label: "BRAND", value: "5th & Glow" },
      { label: "ITEM FORM", value: "Capsule" },
      { label: "DIET TYPE", value: "Vegetarian" },
    ],

    aboutItems: [
      "Supports healthier-looking skin.",
      "Helps reduce dark circles.",
      "Promotes a refreshed appearance.",
      "Made with quality ingredients."
    ],

    brandDescription:
      "5th & Glow focuses on beauty supplements that support confidence and wellness from within."
  },

  {
    id: 3,
    title: "Gluco24",
    slug: "gluco24",
    image: gluco24,
    price: "$34.10",
    category: "immune-support",
    categoryName: "Immune Support",
    rating: 5,
    reviews: 2415,
    isBestSeller: true,
    badge: "",
    description:
      "Daily wellness support designed to help maintain healthy blood sugar levels and metabolic balance.",

    specifications: [
      { label: "BRAND", value: "Gluco24" },
      { label: "ITEM FORM", value: "Capsule" },
      { label: "DIET TYPE", value: "Vegetarian" },
    ],

    aboutItems: [
      "Supports healthy glucose metabolism.",
      "Helps maintain energy levels.",
      "Contains plant-based ingredients.",
      "Easy-to-take daily formula."
    ],

    brandDescription:
      "Gluco24 provides daily nutritional support for balanced wellness and metabolic health."
  },

  {
    id: 4,
    title: "Male Enhancement",
    slug: "male-enhancement",
    image: maleEnhancement,
    price: "$50.00",
    category: "energy-performance",
    categoryName: "Energy & Performance",
    rating: 5,
    reviews: 2415,
    isBestSeller: false,
    badge: "Sale",
    description:
      "A performance-focused formula designed to support stamina, confidence and vitality.",

    specifications: [
      { label: "BRAND", value: "Male Enhancement" },
      { label: "ITEM FORM", value: "Capsule" },
      { label: "DIET TYPE", value: "Non-GMO" },
    ],

    aboutItems: [
      "Supports performance and stamina.",
      "Designed for active lifestyles.",
      "Daily wellness support.",
      "Made with premium ingredients."
    ],

    brandDescription:
      "Focused on performance and vitality, this formula helps support everyday confidence."
  },

  {
    id: 5,
    title: "Aristos Trim",
    slug: "aristos-trim",
    image: aristosTrim,
    price: "$79.00",
    category: "weight-management",
    categoryName: "Weight Management",
    rating: 5,
    reviews: 2415,
    isBestSeller: true,
    badge: "",
    description:
      "Weight management support designed to complement healthy nutrition and exercise habits.",

    specifications: [
      { label: "BRAND", value: "Aristos" },
      { label: "ITEM FORM", value: "Capsule" },
      { label: "DIET TYPE", value: "Vegetarian" },
    ],

    aboutItems: [
      "Supports healthy weight goals.",
      "Complements active lifestyles.",
      "Daily nutritional support.",
      "Easy-to-use formula."
    ],

    brandDescription:
      "Aristos develops wellness products designed to support healthy lifestyle goals."
  },

  {
    id: 6,
    title: "Native Greens Superfood Powder",
    slug: "native-greens-superfood-powder",
    image: nativeGreensSuperfoodPowder,
    price: "$44.10",
    category: "healthy-living",
    categoryName: "Healthy Living Essentials",
    rating: 5,
    reviews: 2415,
    isBestSeller: false,
    badge: "",
    description:
      "A nutrient-rich superfood blend packed with greens, antioxidants and plant-based nutrition.",

    specifications: [
      { label: "BRAND", value: "Native Greens" },
      { label: "ITEM FORM", value: "Powder" },
      { label: "DIET TYPE", value: "Vegan" },
    ],

    aboutItems: [
      "Packed with superfoods and greens.",
      "Supports daily nutrition.",
      "Rich in antioxidants.",
      "Easy to mix with water or smoothies."
    ],

    brandDescription:
      "Native Greens delivers plant-powered nutrition to support everyday wellness."
  }
];