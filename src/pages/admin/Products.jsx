import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Link } from "react-router-dom";
function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

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
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Products;