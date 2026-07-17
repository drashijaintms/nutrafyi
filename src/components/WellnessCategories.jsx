import { useState, useEffect } from "react";
import headingLeaf from "../assets/heading-leaf.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { categoryImages } from "../data/categoryImages";

const resolveCategoryImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return categoryImages[img] || categoryImages[slug] || img;
};

function WellnessCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Error fetching categories for home section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-transparent flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#137b3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="section-header-container mb-2">
          <div className="section-header-title-wrap">
            <img
              src={headingLeaf}
              alt="Leaf"
              className="section-header-leaf"
            />
            <h2 className="section-header-title">
              Nature Wellness Products Designed For Every Lifestyle
            </h2>
            <img
              src={headingLeaf}
              alt="Leaf"
              className="section-header-leaf flipped"
            />
          </div>
        </div>
        {/* Cards */}
        <div className="flex flex-wrap -mx-3">

          {categories.slice(0, 6).map((item, index) => (
            <Link
              key={item._id || index}
              to={`/category/${item.slug}`}
              className="w-full md:w-1/2 lg:w-1/6 px-3 mb-6 block"
            >
              <div
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border
                  border-gray-200
                  shadow-sm
                  h-full
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-lg
                "
              >

                <img
                  src={resolveCategoryImage(item.image, item.slug)}
                  alt={item.imageAltText || item.title}
                  className="w-full h-[170px] object-cover"
                />

                <div className="p-5 text-center">

                  <h3 className="text-[#137b3a] font-bold text-[19px] leading-[24px] uppercase min-h-[60px] flex items-center justify-center">
                    {item.title}
                  </h3>

                  <button className="mt-4 bg-[#7BC043] hover:bg-[#6bb33a] text-white font-semibold px-4 py-2 rounded-md transition text-xs">
                    SHOP NOW
                  </button>

                </div>

              </div>
            </Link>
          ))}

        </div>

        {/* View All Link - right-aligned at the bottom of the last card */}
        <div className="w-full text-right px-3">
          <Link
            to="/category"
            className="font-['Noto_Sans'] font-bold text-[13px] uppercase tracking-wider text-[#111111] hover:text-[#147a3f] transition-colors duration-200"
          >
            View All Categories &gt;
          </Link>
        </div>

      </div>
    </section>
  );
}

export default WellnessCategories;