import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    category: "",
    categoryName: "",
    description: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);

      if (product) {
        setFormData({
          title: product.title || "",
          slug: product.slug || "",
          price: product.price || "",
          category: product.category || "",
          categoryName:
            product.categoryName || "",
          description:
            product.description || "",
        });
      }
    };

    fetchProduct();
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
      await updateProduct(id, formData);

      alert(
        "Product Updated Successfully"
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed To Update Product");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="slug"
          placeholder="Product Slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
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
          "
        >
          Update Product
        </button>

      </div>
    </div>
  );
}

export default EditProduct;