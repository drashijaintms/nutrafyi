import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import nutritionTipsImg from "../assets/blog/nutrition-tips.png";
import healthyLifestyleImg from "../assets/blog/healthy-lifestyle-guides.png";
import fitnessRecoveryImg from "../assets/blog/fitness-and-recovery.png";

// Reusable individual slider card to manage its own image error state
// and match the clean green title-case layout (with no category or date)
function BlogSliderCard({ blog, visibleCards }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/blog/${blog.slug}`}
      style={{
        width: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
        flexShrink: 0,
      }}
      className="bg-white rounded-[18px] overflow-hidden border border-[#dcdcdc]/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col h-[310px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
    >
      {!imgError && blog.featuredImage ? (
        <img
          src={blog.featuredImage}
          alt={blog.featuredImageAltText || blog.title}
          onError={() => setImgError(true)}
          className="w-full h-[150px] object-cover"
        />
      ) : (
        <div className="w-full h-[150px] bg-[#f0f0f0] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1">
        <h3 
          className="font-poppins text-[#137b3a] text-[16px] lg:text-[17px] font-bold mb-2.5 line-clamp-2 leading-snug"
        >
          {blog.title}
        </h3>
        
        {blog.excerpt && (
          <p 
            className="font-poppins text-[#555555] text-[12px] leading-[18px] font-normal line-clamp-3 mb-0"
          >
            {blog.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

function BlogSection({ category }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
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
        excerpt: (() => {
          const raw = blog.excerpt || blog.content || "";
          if (!raw) return "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New....";
          const clean = raw.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
          
          // Check if excerpt is empty, matches title, or is too short (test blogs like newblog2)
          const isDummy = !clean || clean.toLowerCase() === (blog.title || "").toLowerCase() || clean.length < 15;
          if (isDummy) {
            return "Upgrade To Transform Your Uploaded Files And Images With More Precision, Consistency, And Detail With The New....";
          }
          return clean.length > 120 ? clean.substring(0, 120) + "..." : clean;
        })()
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

  // Sync list state with combined blogs
  useEffect(() => {
    setList(allBlogs);
  }, [blogs]);

  // Fetch blogs
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

  // Resize handler for responsive visible cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay loop navigation triggers handleNext
  useEffect(() => {
    if (list.length <= 3 || isPaused || animating) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [list.length, isPaused, animating, visibleCards]);

  const handleNext = () => {
    if (animating || list.length <= 3) return;
    setAnimating(true);
    setIsTransitioning(true);
    setTranslateX(-(100 / visibleCards));

    setTimeout(() => {
      setList((prev) => {
        const nextList = [...prev];
        const first = nextList.shift();
        nextList.push(first);
        return nextList;
      });
      setIsTransitioning(false);
      setTranslateX(0);
      setAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (animating || list.length <= 3) return;
    setAnimating(true);
    setIsTransitioning(false);
    setTranslateX(-(100 / visibleCards));

    setList((prev) => {
      const nextList = [...prev];
      const last = nextList.pop();
      nextList.unshift(last);
      return nextList;
    });

    setTimeout(() => {
      setIsTransitioning(true);
      setTranslateX(0);
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 50);
  };

  if (loading) {
    return (
      <div className="py-20 bg-[#f4f2e8] flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#137b3a] border-t-transparent rounded-full animate-spin font-['Poppins']"></div>
      </div>
    );
  }

  return (
    <section className="py-[60px] bg-[#f4f2e8] overflow-hidden">
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

              {/* Slider Viewport */}
              <div className="overflow-hidden flex-1">
                {/* Sliding Track */}
                <div
                  className="flex gap-6 select-none"
                  style={{
                    transform: `translate3d(${translateX}%, 0, 0)`,
                    transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                   {list.map((blog, idx) => (
                    <BlogSliderCard
                      key={`${blog._id}-${idx}`}
                      blog={blog}
                      visibleCards={visibleCards}
                    />
                  ))}
                </div>
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