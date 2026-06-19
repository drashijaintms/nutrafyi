import { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function Categories() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);

      await fetchCategories();

      alert("Category Deleted Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Manage Categories
        </h1>

        <Link
          to="/admin/categories/add"
          className="
            bg-[#147a3f]
            text-white
            px-5
            py-2
            rounded-lg
            font-medium
          "
        >
          + Add Category
        </Link>
      </div>

      <p className="mb-4">
        Total Categories: {categories.length}
      </p>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Slug
              </th>

              <th className="p-3 text-left">
                Count
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-t"
              >
                <td className="p-3">
                  {category.title}
                </td>

                <td className="p-3">
                  {category.slug}
                </td>

                <td className="p-3">
                  {category.count || 0}
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <Link
  to={`/admin/categories/edit/${category._id}`}
  className="
    text-blue-600
    hover:text-blue-800
    text-lg
  "
  title="Edit Category"
>
  <FaEdit />
</Link>

                    <button
                      onClick={() =>
                        handleDelete(category._id)
                      }
                      className="
                        text-red-600
                        hover:text-red-800
                        text-lg
                      "
                      title="Delete Category"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center"
                >
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;