import { useEffect, useState } from "react";
import { getProducts, deleteProduct,} from "../../services/productService";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
function Products() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await deleteProduct(id);

    await fetchProducts();

    alert("Product Deleted Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to delete product");
  }
};
  return (
    <div>
      
<div className="flex justify-between items-center mb-6">

  <h1 className="text-3xl font-bold">
    Manage Products
  </h1>

  <Link
  to="/admin/products/add"
  className="
    bg-[#147a3f]
    text-white
    px-5
    py-2
    rounded-lg
  "
>
  Add Product
</Link>
</div>
      <p className="mb-4">
        Total Products: {products.length}
      </p>

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-100">

              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Price
              </th>
<th className="p-3 text-left">
  Actions
</th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t"
              >
                <td className="p-3">
                  {product.title}
                </td>

                <td className="p-3">
                  {product.categoryName}
                </td>

                <td className="p-3">
                  {product.price}
                </td>
                <td className="p-3">
  <div className="flex items-center gap-4">

    <button
      className="
        text-blue-600
        hover:text-blue-800
        text-lg
      "
      title="Edit Product"
    >
      <FaEdit />
    </button>

<button
  onClick={() => handleDelete(product._id)}
  className="
    text-red-600
    hover:text-red-800
    text-lg
  "
  title="Delete Product"
>
  <FaTrash />
</button>

  </div>
</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Products;