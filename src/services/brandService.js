import axios from "axios";

const API_URL = "/api/brands";

// GET ALL BRANDS (public storefront)
export const getBrands = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// GET BRAND BY SLUG
export const getBrandBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
};
