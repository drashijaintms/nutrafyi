import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { FaBoxOpen, FaTags, FaStar, FaFire,} from "react-icons/fa";
function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    bestSellers: 0,
    saleProducts: 0,
  });
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const products = await getProducts();
      const categories = await getCategories();

      setStats({
        products: products.length,
        categories: categories.length,
        bestSellers: products.filter(
          (p) => p.isBestSeller
        ).length,
        saleProducts: products.filter(
          (p) => p.badge === "Sale"
        ).length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  fetchDashboardData();
}, []);
  return (
  <div className="p-10">
    <h1 className="text-4xl font-bold mb-8">
      Admin Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">

  <div className="flex justify-between items-center">

    <div>
      <h3 className="text-sm opacity-90">
        Total Products
      </h3>

      <h2 className="text-4xl font-bold mt-2">
        {stats.products}
      </h2>
    </div>

    <FaBoxOpen className="text-5xl opacity-80" />

  </div>

</div>

<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">

  <div className="flex justify-between items-center">

    <div>
      <h3 className="text-sm opacity-90">
        Total Categories
      </h3>

      <h2 className="text-4xl font-bold mt-2">
        {stats.categories}
      </h2>
    </div>

    <FaTags className="text-5xl opacity-80" />

  </div>

</div>

<div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-lg p-6">

  <div className="flex justify-between items-center">

    <div>
      <h3 className="text-sm opacity-90">
        Best Sellers
      </h3>

      <h2 className="text-4xl font-bold mt-2">
        {stats.bestSellers}
      </h2>
    </div>

    <FaStar className="text-5xl opacity-80" />

  </div>

</div>

<div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg p-6">

  <div className="flex justify-between items-center">

    <div>
      <h3 className="text-sm opacity-90">
        Sale Products
      </h3>

      <h2 className="text-4xl font-bold mt-2">
        {stats.saleProducts}
      </h2>
    </div>

    <FaFire className="text-5xl opacity-80" />

  </div>

</div>

    </div>
  </div>
);
}

export default Dashboard;