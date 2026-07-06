import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import nutritionTipsImg from "../assets/blog/nutrition-tips.png";
import healthyLifestyleImg from "../assets/blog/healthy-lifestyle-guides.png";
import fitnessRecoveryImg from "../assets/blog/fitness-and-recovery.png";

function BlogSection({ category }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Predefined exact blog data matching the mockups + additional items for carousel sliding
  const defaultBlogs = [
    {
      _id: "blog-1",
      slug: "nutrition-tips",
      title: "Nutrition Tips",
      featuredImage: nutritionTipsImg,
      excerpt: "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New...."
    },
    {
      _id: "blog-2",
      slug: "healthy-lifestyle-guides",
      title: "Healthy Lifestyle Guides",
      featuredImage: healthyLifestyleImg,
      excerpt: "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New...."
    },
    {
      _id: "blog-3",
      slug: "fitness-and-recovery",
      title: "Fitness & Recovery",
      featuredImage: fitnessRecoveryImg,
      excerpt: "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New...."
    },
    {
      _id: "blog-4",
      slug: "nutrition-for-longevity",
      title: "Nutrition for Longevity",
      featuredImage: nutritionTipsImg,
      excerpt: "Explore the top antioxidant-rich superfoods and vitamins that help support cell health and healthy aging...."
    },
    {
      _id: "blog-5",
      slug: "stress-management-sleep",
      title: "Stress Management & Sleep",
      featuredImage: healthyLifestyleImg,
      excerpt: "Discover daily mindfulness practices, dietary nutrients, and simple routines to lower cortisol and sleep better...."
    }
  ];

  // Get backend blogs, and pad them with default blogs if there are fewer than 6 items to guarantee carousel slideability
  const getCombinedBlogs = () => {
    if (blogs.length === 0) return defaultBlogs;
    
    // Start with backend blogs, formatted properly
    const list = blogs.map((blog, idx) => {
      const fallbacks = [
        { title: "Nutrition Tips", image: nutritionTipsImg },
        { title: "Healthy Lifestyle Guides", image: healthyLifestyleImg },
        { title: "Fitness & Recovery", image: fitnessRecoveryImg }
      ];
      const fallback = fallbacks[idx % 3];
      return {
        ...blog,
        title: blog.title || fallback.title,
        featuredImage: blog.featuredImage || fallback.image,
        excerpt: blog.excerpt || "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New...."
      };
    });

    // If less than 6, append default blogs to make it interactive
    if (list.length < 6) {
      const toAdd = 6 - list.length;
      for (let i = 0; i < toAdd; i++) {
        const defaultBlog = defaultBlogs[i % defaultBlogs.length];
        list.push({
          ...defaultBlog,
          _id: `padded-${i}-${defaultBlog._id}`
        });
      }
    }
    return list;
  };

  const allBlogs = getCombinedBlogs();

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
          
          setBlogs(filtered);
        }
      } catch (err) {
        console.error("Failed to load latest blogs for section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, [category]);

  // Auto-play effect (shifts carousel index one-by-one every 4 seconds, pauses on mouse hover)
  useEffect(() => {
    if (allBlogs.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allBlogs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [allBlogs.length, isPaused]);

  // Carousel navigation handlers
  const handleNext = () => {
    if (allBlogs.length <= 1) return;
    setStartIndex((prev) => (prev + 1) % allBlogs.length);
  };

  const handlePrev = () => {
    if (allBlogs.length <= 1) return;
    setStartIndex((prev) => (prev - 1 + allBlogs.length) % allBlogs.length);
  };

  // Get exactly 3 visible blogs starting from startIndex in a circular wrap-around fashion
  const getDisplayBlogs = () => {
    const result = [];
    const countToShow = Math.min(3, allBlogs.length);
    for (let i = 0; i < countToShow; i++) {
      const index = (startIndex + i) % allBlogs.length;
      result.push(allBlogs[index]);
    }
    return result;
  };

  const displayBlogs = getDisplayBlogs();

  if (loading) {
    return (
      <div className="py-20 bg-[#f4f2e8] flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#137b3a] border-t-transparent rounded-full animate-spin font-['Poppins']"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-[#f4f2e8]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-5/12 mb-10 lg:mb-0 pr-0 lg:pr-8">
            <h2 className="font-['Noto_Sans'] text-[28px] lg:text-[38px] font-bold leading-[1.25] mb-5 text-[#111111]">
              Health Tips, Nutrition
              <br />
              & Lifestyle Insights
            </h2>
            
            <p className="font-['Poppins'] text-[#333333] text-[13.5px] leading-[22px] max-w-[480px] mb-8">
              Stay informed with wellness articles, healthy living guides,
              nutrition tips, fitness insights, and supplement education
              designed to support your health goals.
            </p>
            
            <Link
              to="/blog"
              className="font-['Poppins'] inline-block bg-[#137b3a] hover:bg-[#0f6630] text-white px-8 py-3.5 rounded-lg font-semibold text-[14px] transition"
            >
              Explore Wellness Blog
            </Link>
          </div>

          {/* Right Cards */}
          <div className="w-full lg:w-7/12">
            <div className="flex items-center">
              
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="hidden lg:flex w-10 h-10 items-center justify-center text-[#137b3a] hover:text-[#0f6630] text-[48px] font-light mr-4 select-none cursor-pointer transition-colors"
              >
                ‹
              </button>

              {/* Cards */}
              <div 
                className="flex flex-wrap lg:flex-nowrap gap-4 flex-1"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {displayBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="w-full md:w-[48%] lg:w-[33.33%] bg-white rounded-[18px] overflow-hidden border border-[#dcdcdc]/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] block transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
                  >
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-[135px] object-cover"
                    />
                    
                    <div className="p-3.5">
                      <h3 className="font-['Noto_Sans'] text-[#137b3a] text-[15px] font-bold mb-2 line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                      
                      <p className="font-['Poppins'] text-[#666666] text-[11px] leading-[16px] line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="hidden lg:flex w-10 h-10 items-center justify-center text-[#137b3a] hover:text-[#0f6630] text-[48px] font-light ml-4 select-none cursor-pointer transition-colors"
              >
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