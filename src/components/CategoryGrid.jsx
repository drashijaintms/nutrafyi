import headingLeaf from "../assets/heading-leaf.png";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { categoryImages } from "../data/categoryImages";

function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
            categories.map((category) => (
              <CategoryCard
                key={category._id}
                image={categoryImages[category.image]}
                title={category.title}
                description={category.description}
                slug={category.slug}
              />
            ))
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