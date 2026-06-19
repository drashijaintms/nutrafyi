import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

// GET ALL CATEGORIES
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ADD CATEGORY
export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      API_URL,
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// UPDATE CATEGORY
export const updateCategory = async (
  id,
  categoryData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// DELETE CATEGORY
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};