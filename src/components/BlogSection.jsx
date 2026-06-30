import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BlogSection({ category }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        if (res.data) {
          // Filter only published blogs
          let filtered = res.data.filter(blog => blog.status === "Published");
          
          // Filter by category if specified (case-insensitive), fallback to latest blogs if empty
          if (category) {
            const categoryFiltered = filtered.filter(blog => 
              blog.categories && 
              blog.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
            );
            
            if (categoryFiltered.length > 0) {
              filtered = categoryFiltered;
            }
          }
          
          setBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load latest blogs for section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, [category]);

  const getExcerpt = (blog) => {
    if (blog.seo && blog.seo.metaDescription) {
      return blog.seo.metaDescription;
    }
    if (!blog.content) return "";
    const cleanText = blog.content.replace(/<[^>]*>/g, "");
    return cleanText.length > 120 ? cleanText.substring(0, 117) + "..." : cleanText;
  };

  if (loading) {
    return (
      <div className="py-20 bg-[#f4f2e8] flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#137b3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    // If no blogs belong to this category, return null so it is hidden
    return null;
  }

  return (
    <section className="py-20 bg-[#f4f2e8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Left Content */}
          <div className="w-full lg:w-5/12 mb-10 lg:mb-0">
            <h2 className="text-[32px] lg:text-[54px] font-bold leading-[1.15] mb-6">
              Health Tips, Nutrition
              <br />
              & Lifestyle Insights
            </h2>
            <p className="text-[#333] text-[17px] leading-8 max-w-[500px] mb-8">
              Stay informed with wellness articles, healthy living guides,
              nutrition tips, fitness insights, and supplement education
              designed to support your health goals.
            </p>
            <Link
              to="/blog"
              className="inline-block bg-[#137b3a] hover:bg-[#0f6630] text-white px-10 py-4 rounded-lg font-medium transition"
            >
              Explore Wellness Blog
            </Link>
          </div>

          {/* Right Cards */}
          <div className="w-full lg:w-7/12">
            <div className="flex items-center">
              {/* Left Arrow */}
              <button className="hidden lg:flex w-12 h-12 items-center justify-center text-[#137b3a] text-[40px] mr-5 select-none">
                ‹
              </button>

              {/* Cards */}
              <div className="flex flex-wrap lg:flex-nowrap gap-4 flex-1">
                {blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="w-full md:w-[48%] lg:w-[33.33%] bg-white rounded-[18px] overflow-hidden border border-[#dcdcdc] shadow-sm block transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                  >
                    <img
                      src={blog.featuredImage || "https://placehold.co/600x400/e8f1e5/137b3a?text=Nutrafyi"}
                      alt={blog.title}
                      className="w-full h-[180px] object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-[#137b3a] text-[18px] font-bold mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[#777] text-[13px] leading-6 line-clamp-3">
                        {getExcerpt(blog)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button className="hidden lg:flex w-12 h-12 items-center justify-center text-[#137b3a] text-[40px] ml-5 select-none">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;