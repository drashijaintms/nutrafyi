import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import headingLeaf from "../assets/heading-leaf.png";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";

const resolveProductImage = (img, slug) => {
  if (!img) return null;
  if (img.trim().startsWith("<iframe") || img.trim().startsWith("<div") || img.includes("</iframe>")) {
    return null;
  }
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) {
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
  const [searchParams] = useSearchParams();

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

  const selectedForms = searchParams.get("form")
    ? searchParams.get("form").split(",")
    : [];

  const selectedDietary = searchParams.get("dietary")
    ? searchParams.get("dietary").split(",")
    : [];

  const selectedBrands = searchParams.get("brand")
    ? searchParams.get("brand").split(",")
    : [];

  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"), 10)
    : 0;

  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"), 10)
    : 2000;

  const getProductItemForm = (product) => {
    const spec = product.specifications?.find((s) => s.label === "ITEM FORM");
    if (!spec) return "";
    const val = spec.value.toLowerCase();
    if (val.includes("capsule")) return "Capsules";
    if (val.includes("tablet")) return "Tablets";
    if (val.includes("powder")) return "Powder";
    if (val.includes("gummi") || val.includes("gummy")) return "Gummies";
    if (val.includes("liquid")) return "Liquid";
    return spec.value;
  };

  const getProductDietType = (product) => {
    const spec = product.specifications?.find((s) => s.label === "DIET TYPE");
    if (!spec) return "";
    const val = spec.value.toLowerCase();
    if (val.includes("vegetarian")) return "Vegetarian";
    if (val.includes("vegan")) return "Vegan";
    if (val.includes("gluten")) return "Gluten Free";
    if (val.includes("non-gmo") || val.includes("nongmo") || val.includes("non gmo")) return "Non-GMO";
    if (val.includes("sugar")) return "Sugar Free";
    return spec.value;
  };

  const filteredProducts = products.filter((product) => {
    // 1. Search term filter
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Form filter
    if (selectedForms.length > 0) {
      const form = getProductItemForm(product);
      if (!selectedForms.includes(form)) return false;
    }

    // 3. Dietary preference filter
    if (selectedDietary.length > 0) {
      const diet = getProductDietType(product);
      if (!selectedDietary.includes(diet)) return false;
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      const productBrand = product.brand || "";
      const matchesBrand = selectedBrands.some((b) => {
        const searchVal = b.toLowerCase();
        const pBrand = productBrand.toLowerCase();
        return (
          pBrand === searchVal ||
          pBrand.replace(/\s+/g, "-") === searchVal ||
          searchVal.replace(/\s+/g, "-") === pBrand
        );
      });
      if (!matchesBrand) return false;
    }

    // 4. Price range filter
    const priceNum = toNum(product.regularPrice || product.price);
    if (priceNum < minPrice || priceNum > maxPrice) return false;

    return true;
  });

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
        <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold leading-none">
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
  className="w-[220px] h-[48px] border border-[#ddd] rounded-lg pl-4 pr-10"
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
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={resolveProductImage(product.image, product.slug)}
                imageAltText={product.imageAltText}
                name={product.title}
                price={product.price}
                regularPrice={product.regularPrice}
                salePrice={product.salePrice}
                slug={product.slug}
                isBestSeller={product.isBestSeller}
                badge={product.badge}
                rating={product.rating}
                reviews={product.reviews}
                currencyOverrides={product.currencyOverrides}
                productType={product.productType}
                externalUrl={product.externalUrl}
                buttonText={product.buttonText}
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