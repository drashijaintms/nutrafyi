import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/productService";

function AddProduct() {
    const navigate = useNavigate();
const [formData, setFormData] = useState({
  title: "",
  slug: "",
  price: "",
  category: "",
  description: "",
  brandDescription: "",
  moreAbout: "",

  rating: 5,
  reviews: 0,
  isBestSeller: false,
  badge: "",
  image: "",
});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const categoryNames = {
      "beauty-skin": "Beauty & Personal Care",
      "immune-support": "Immune Support",
      "energy-performance": "Energy & Performance",
      "weight-management": "Weight Management",
      "healthy-living": "Healthy Living Essentials",
    };

    const productData = {
      ...formData,
      categoryName: categoryNames[formData.category] || "",
    };

    await addProduct(productData);

    alert("Product Added Successfully!");

    navigate("/admin/products");
  } catch (error) {
    console.error(error);
    alert("Failed to add product");
  }
};
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* Slug */}
        <input
          type="text"
          name="slug"
          placeholder="Product Slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* Price */}
        <input
          type="text"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
<select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
>
  <option value="">
    Select Category
  </option>

  <option value="beauty-skin">
    Beauty & Personal Care
  </option>

  <option value="immune-support">
    Immune Support
  </option>

  <option value="energy-performance">
    Energy & Performance
  </option>

  <option value="weight-management">
    Weight Management
  </option>

  <option value="healthy-living">
    Healthy Living Essentials
  </option>
</select>
<textarea
  name="description"
  placeholder="Product Description"
  value={formData.description}
  onChange={handleChange}
  rows="4"
  className="w-full border p-3 rounded-lg"
/>
<textarea
  name="brandDescription"
  placeholder="Brand Description"
  value={formData.brandDescription}
  onChange={handleChange}
  rows="4"
  className="w-full border p-3 rounded-lg"
/>
<textarea
  name="moreAbout"
  placeholder="More About Product"
  value={formData.moreAbout}
  onChange={handleChange}
  rows="4"
  className="w-full border p-3 rounded-lg"
/>
<input
  type="number"
  name="rating"
  placeholder="Rating"
  value={formData.rating}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
/>  
<input
  type="number"
  name="reviews"
  placeholder="Reviews Count"
  value={formData.reviews}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
/><div className="flex gap-8">

  {/* Best Seller */}
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={formData.isBestSeller}
      onChange={(e) =>
        setFormData({
          ...formData,
          isBestSeller: e.target.checked,
        })
      }
    />
    <span>Best Seller Product</span>
  </label>

  {/* Sale */}
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={formData.badge === "Sale"}
      onChange={(e) =>
        setFormData({
          ...formData,
          badge: e.target.checked ? "Sale" : "",
        })
      }
    />
    <span>Sale Product</span>
  </label>

</div>
<select
  name="image"
  value={formData.image}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
>
  <option value="">
    Select Product Image
  </option>

  <option value="fiera-vitamin-c-serum">
    Fièra Vitamin C Serum
  </option>

  <option value="fifth-and-glow-cyabags">
    5th & Glow Cyabags
  </option>

  <option value="gluco24">
    Gluco24
  </option>

  <option value="male-enhancement">
    Male Enhancement
  </option>

  <option value="aristos-trim">
    Aristos Trim
  </option>

  <option value="native-greens-superfood-powder">
    Native Greens Superfood Powder
  </option>
</select>
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
  Save Product
</button>
      </div>
    </div>
  );
}

export default AddProduct;