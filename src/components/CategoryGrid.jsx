import headingLeaf from "../assets/heading-leaf.png";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { categoryImages } from "../data/categoryImages";

const resolveCategoryImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return categoryImages[img] || categoryImages[slug] || img;
};

function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, prodsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(Array.isArray(catsData) ? catsData : []);
        setProducts(Array.isArray(prodsData) ? prodsData : []);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Heading */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[52px] font-bold leading-none">
          All Categories
        </h2>

        <img
          src={headingLeaf}
          alt=""
          className="w-14"
        />
      </div>

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <p className="font-semibold text-[20px]">
          Showing 1-{categories.length} Of {categories.length} Results
        </p>

        <div className="flex gap-4 mt-4 lg:mt-0">
          <input
            type="text"
            placeholder="Search By Categories"
            className="
              w-[260px]
              h-[48px]
              border
              border-[#ddd]
              rounded-lg
              px-4
              outline-none
              focus:border-[#147a3f]
            "
          />

          <select
            className="
              w-[220px]
              h-[48px]
              border
              border-[#ddd]
              rounded-lg
              px-4
              outline-none
              focus:border-[#147a3f]
            "
          >
            <option>Sort By: Best Selling</option>
            <option>Newest</option>
            <option>Popular</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-10">
          Loading Categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => {
              const count = products.filter(
                (p) => p.category === category.slug
              ).length;
              return (
                <CategoryCard
                  key={category._id}
                  image={resolveCategoryImage(category.image, category.slug)}
                  title={category.title}
                  description={category.description}
                  slug={category.slug}
                  productCount={count}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              No categories found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryGrid;