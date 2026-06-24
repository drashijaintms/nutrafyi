import { useEffect, useState } from "react";
import headingLeaf from "../assets/heading-leaf.png";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";

const resolveProductImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

// Strip any currency symbol and return a clean number string
const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [sortBy, setSortBy] = useState("best-selling");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
const filteredProducts = products.filter((product) =>
  product.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
const sortedProducts = [...filteredProducts];

if (sortBy === "low-high") {
  sortedProducts.sort((a, b) => toNum(a.regularPrice || a.price) - toNum(b.regularPrice || b.price));
}

if (sortBy === "high-low") {
  sortedProducts.sort((a, b) => toNum(b.regularPrice || b.price) - toNum(a.regularPrice || a.price));
}

if (sortBy === "newest") {
  sortedProducts.reverse();
}
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[52px] font-bold leading-none">
          All Products
        </h2>

        <img
          src={headingLeaf}
          alt="Leaf"
          className="w-14"
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <p className="font-semibold text-[20px]">
          Showing {sortedProducts.length} Products
        </p>

        <div className="flex gap-4 mt-4 lg:mt-0">
          <input
  type="text"
  placeholder="Search Products"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-[260px] h-[48px] border border-[#ddd] rounded-lg px-4 outline-none"
/>

          <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="w-[220px] h-[48px] border border-[#ddd] rounded-lg px-4"
>
            <option value="best-selling">Sort By: Best Selling</option>
            <option value="newest">Newest</option>
            <option value="low-high">Price Low To High</option>
            <option value="high-low">Price High To Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading products...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
  key={product._id}
  image={resolveProductImage(product.image, product.slug)}
  name={product.title}
  price={`$${toNum(product.regularPrice || product.price).toFixed(2)}`}
  slug={product.slug}
  isBestSeller={product.isBestSeller}
  badge={product.badge}
  rating={product.rating}
  reviews={product.reviews}
/>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsGrid;