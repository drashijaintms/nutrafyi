import { useEffect, useState } from "react";
import { getProducts, deleteProduct,} from "../../services/productService";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { productImages } from "../../data/productImages";

function Products() {
  const [products, setProducts] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] =  useState("");
const [sortBy, setSortBy] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 4;
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
const filteredProducts = products
  .filter((product) => {
    const matchesSearch =
      product.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesCategory =
      selectedCategory === "" ||
      product.categoryName ===
        selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );
  })
  .sort((a, b) => {
    if (sortBy === "az") {
      return a.title.localeCompare(
        b.title
      );
    }

    if (sortBy === "za") {
      return b.title.localeCompare(
        a.title
      );
    }

    if (sortBy === "priceLow") {
      return (
        parseFloat(
          a.price.replace("$", "")
        ) -
        parseFloat(
          b.price.replace("$", "")
        )
      );
    }

    if (sortBy === "priceHigh") {
      return (
        parseFloat(
          b.price.replace("$", "")
        ) -
        parseFloat(
          a.price.replace("$", "")
        )
      );
    }

    return 0;
  });
const indexOfLastProduct =
  currentPage * productsPerPage;

const indexOfFirstProduct =
  indexOfLastProduct - productsPerPage;

const currentProducts =
  filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

const totalPages = Math.ceil(
  filteredProducts.length /
    productsPerPage
);
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
<div className="flex justify-between items-center mb-4">

  <p>
  Showing {indexOfFirstProduct + 1}-
  {Math.min(
    indexOfLastProduct,
    filteredProducts.length
  )} of {filteredProducts.length} Products
</p>

  <div className="flex gap-3">

    <input
      type="text"
      placeholder="Search Products..."
      value={searchTerm}
      onChange={(e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);
}}
      className="
        border
        rounded-lg
        px-4
        py-2
        w-[250px]
      "
    />

    <select
  value={selectedCategory}
  onChange={(e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  }}
      className="
        border
        rounded-lg
        px-4
        py-2
      "
    >
      <option value="">
        All Categories
      </option>

      {[...new Set(
        products.map(
          (product) => product.categoryName
        )
      )].map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </select>
<select
  value={sortBy}
  onChange={(e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }}
  className="
    border
    rounded-lg
    px-4
    py-2
  "
>
  <option value="">
    Sort Products
  </option>

  <option value="az">
    Name A-Z
  </option>

  <option value="za">
    Name Z-A
  </option>

  <option value="priceLow">
    Price Low-High
  </option>

  <option value="priceHigh">
    Price High-Low
  </option>
</select>
  </div>

</div>

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-100">
<th className="p-3 text-left">
  Image
</th> 
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

            {currentProducts.map((product) => (
              <tr
                key={product._id}
                className="border-t"
              >
                <td className="p-3">
  <img
    src={productImages[product.slug]}
    alt={product.title}
    className="w-14 h-14 object-contain"
  />
</td>

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

    <Link
  to={`/admin/products/edit/${product._id}`}
  className="
    text-blue-600
    hover:text-blue-800
    text-lg
  "
  title="Edit Product"
>
  <FaEdit />
</Link>

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
<div className="flex justify-center items-center gap-2 mt-6">

  <button
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
    disabled={currentPage === 1}
    className="
      px-4 py-2
      border
      rounded-lg
      disabled:opacity-50
    "
  >
    Previous
  </button>

  {Array.from(
    { length: totalPages },
    (_, index) => (
      <button
        key={index}
        onClick={() =>
          setCurrentPage(index + 1)
        }
        className={`
          px-4 py-2 rounded-lg border
          ${
            currentPage === index + 1
              ? "bg-[#147a3f] text-white"
              : ""
          }
        `}
      >
        {index + 1}
      </button>
    )
  )}

  <button
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
    disabled={
      currentPage === totalPages
    }
    className="
      px-4 py-2
      border
      rounded-lg
      disabled:opacity-50
    "
  >
    Next
  </button>

</div>
    </div>
  );
}

export default Products;