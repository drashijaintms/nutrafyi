import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import BreadcrumbBar from "../components/BreadcrumbBar";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import BlogSection from "../components/BlogSection";
import { categories } from "../data/categories";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";
import headingLeaf from "../assets/heading-leaf.png";

const resolveProductImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function CategoryDetail() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("best-selling");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoadingCategory(true);
      try {
        // Fetch products
        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Fetch categories and find by slug
        const catRes = await axios.get("/api/categories");
        if (catRes.data) {
          const found = catRes.data.find((item) => item.slug === slug);
          setCategory(found || null);
        }
      } catch (error) {
        console.error("Error fetching category/products:", error);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  const selectedForms = searchParams.get("form")
    ? searchParams.get("form").split(",")
    : [];

  const selectedDietary = searchParams.get("dietary")
    ? searchParams.get("dietary").split(",")
    : [];

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

  const filteredProducts = categoryProducts.filter((product) => {
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

    // 4. Max price filter
    const priceNum = toNum(product.regularPrice || product.price);
    if (priceNum > maxPrice) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts];

if (sortBy === "price-low") {
  sortedProducts.sort((a, b) => toNum(a.regularPrice || a.price) - toNum(b.regularPrice || b.price));
}

if (sortBy === "price-high") {
  sortedProducts.sort((a, b) => toNum(b.regularPrice || b.price) - toNum(a.regularPrice || a.price));
}

if (sortBy === "a-z") {
  sortedProducts.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

if (sortBy === "z-a") {
  sortedProducts.sort((a, b) =>
    b.title.localeCompare(a.title)
  );
}
  if (loadingCategory) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh] bg-[#fdfdfc]">
        <div className="w-10 h-10 border-4 border-[#147a3f] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-sm font-bold text-[#147a3f]">Loading category...</span>
      </div>
    );
  }

  if (!category) {
    return (
    <div className="py-20 text-center">
      Category Not Found
    </div>
  );
}
  return (
    <>
      <BreadcrumbBar title={category.title} />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex gap-8">

            {/* Sidebar */}
            <div className="w-[280px] shrink-0">
              <CategorySidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">

              {/* Heading */}
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-[30px] md:text-[40px] lg:text-[48px] font-bold">
                  {category.title}
                </h1>

                <img
                  src={headingLeaf}
                  alt=""
                  className="w-12"
                />
              </div>

              {/* Top Bar */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">

                <p className="font-semibold text-lg">
                  Shop Best-Selling Products For {category.title}
                </p>
<input
  type="text"
  placeholder="Search Products"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    border
    border-[#ddd]
    rounded-lg
    px-4
    py-3
    min-w-[250px]
    outline-none
    focus:border-[#147a3f]
  "
/>
               <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="
    border
    border-[#ddd]
    rounded-lg
    px-4
    py-3
    min-w-[220px]
  "
>
  <option value="best-selling">
    Sort By: Best Selling
  </option>

  <option value="a-z">
    Name A-Z
  </option>

  <option value="z-a">
    Name Z-A
  </option>

  <option value="price-low">
    Price Low To High
  </option>

  <option value="price-high">
    Price High To Low
  </option>
</select>

              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {sortedProducts.length > 0 ? (
  sortedProducts.map((product) => (
    <ProductCard
      key={product._id}
      id={product._id}
      image={resolveProductImage(product.image, product.slug)}
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
  <div className="col-span-4 text-center py-12">
    No products found in this category.
  </div>
)}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Dynamic latest blogs belonging to this category */}
      <BlogSection category={category.title} />
    </>
  );
}

export default CategoryDetail;