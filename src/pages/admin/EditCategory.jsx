import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategory,
  updateCategory,
} from "../../services/categoryService";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getCategory(id);

      if (category) {
        setFormData({
          title: category.title || "",
          slug: category.slug || "",
          image: category.image || "",
          description: category.description || "",
        });
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCategory(id, formData);

      alert("Category Updated Successfully");

      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Edit Category
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Category Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="slug"
          placeholder="Category Slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <select
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">
            Select Category Image
          </option>

          <option value="energy-performance">
            Energy & Performance
          </option>

          <option value="weight-management">
            Weight Management
          </option>

          <option value="immune-support">
            Immune Support
          </option>

          <option value="herbal-natural">
            Herbal & Natural
          </option>

          <option value="vitamins-nutrition">
            Daily Vitamins & Nutrition
          </option>

          <option value="beauty-skin">
            Beauty & Skin Wellness
          </option>

          <option value="healthy-living">
            Healthy Living Essentials
          </option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className="w-full border p-3 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="
            bg-[#147a3f]
            text-white
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Update Category
        </button>

      </div>
    </div>
  );
}

export default EditCategory;