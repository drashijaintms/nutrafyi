import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// GET ALL PRODUCTS
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (slug) => {
  try {
    const response = await axios.get(
      `${API_URL}/${slug}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// ADD PRODUCT
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(
      API_URL,
      productData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  id,
  productData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      productData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};