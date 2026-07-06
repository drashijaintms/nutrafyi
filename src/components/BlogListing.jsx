import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import CategoriesWidget from "./CategoriesWidget";
import headingLeaf from "../assets/heading-leaf.png";
import BlogCard from "./BlogCard";
import { blogs as staticBlogs } from "../data/blogs";
import beautySkin from "../assets/category/herbal-natural.png";
import nutrition from "../assets/category/weight-management.jpg";
import fitness from "../assets/category/energy-performance.png";
import wellness from "../assets/category/immune-support.jpg";

function BlogListing() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const [searchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
  };

  const filteredBlogs = activeCategorySlug
    ? blogs.filter((b) => slugify(b.category) === activeCategorySlug)
    : blogs;

  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategorySlug]);

  // Scroll to top of viewport on page change or category change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeCategorySlug]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / blogsPerPage));
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Dynamic category counts from the full blogs list
  const categoryCounts = blogs.reduce((acc, blog) => {
    const catName = blog.category || "General";
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const dynamicCategories = Object.keys(categoryCounts)
    .map((catName) => ({
      name: catName,
      count: categoryCounts[catName],
      slug: slugify(catName),
    }))
    .sort((a, b) => b.count - a.count);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        if (res.data && res.data.length > 0) {
          setBlogs(res.data.map(b => ({
            id: b._id,
            title: b.title,
            slug: b.slug,
            category: b.categories && b.categories.length > 0 ? b.categories[0] : "General",
            image: b.featuredImage || "", // do not add default feature image
            date: new Date(b.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            }),
            author: b.author || "Admin",
            excerpt: (() => {
              const raw = b.excerpt || b.content || "";
              const clean = raw.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
              return clean.length > 120 ? clean.substring(0, 120) + "..." : clean;
            })()
          })));
        } else {
          setBlogs(staticBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs(staticBlogs);
      }
    };
    fetchBlogs();
  }, []);

const popularPosts = [
  {
    image: beautySkin,
    title: "10 Essential Nutrients For Healthy, Glowing Skin",
    date: "May 12, 2024",
  },
  {
    image: nutrition,
    title: "A Beginner's Guide To Balanced Nutrition",
    date: "May 08, 2024",
  },
  {
    image: fitness,
    title: "How Supplements Can Support Your Fitness Goals",
    date: "May 02, 2024",
  },
];
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-12 gap-8">

          {/* Left Content */}
          <div className="col-span-8">

            {/* Heading Row */}
            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <h2 
                  className="text-[42px] font-bold"
                  style={{ fontFamily: "'Kreon', serif" }}
                >
                  Latest Articles
                </h2>

                <img
                  src={headingLeaf}
                  alt=""
                  className="w-10"
                />

              </div>

              <select
                className="
                  border
                  border-[#ddd]
                  rounded-lg
                  px-4
                  py-3
                  min-w-[180px]
                "
              >
                <option>
                  Sort By: Latest
                </option>

                <option>
                  Popular
                </option>

              </select>

            </div>

            {/* Active Category Badge — only shown when filtering */}
            {activeCategorySlug && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#444] text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Showing:
                </span>
                <span
                  className="inline-flex items-center gap-2 bg-[#147a3f] text-white text-[13px] font-semibold px-4 py-1.5 rounded-full"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {dynamicCategories.find(c => c.slug === activeCategorySlug)?.name || activeCategorySlug}
                  <Link
                    to="/blog"
                    className="ml-1 w-4 h-4 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white leading-none transition"
                    title="Clear filter"
                  >
                    ×
                  </Link>
                </span>
                <span className="text-[#888] text-[13px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ({filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"})
                </span>
              </div>
            )}

            {/* Bottom margin when no filter badge */}
            {!activeCategorySlug && <div className="mb-4" />}

            {/* Blog Grid */}
            <div className="">

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {currentBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    image={blog.image}
                    category={blog.category}
                    title={blog.title}
                    date={blog.date}
                    slug={blog.slug}
                    excerpt={blog.excerpt}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-12">
                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`
                      w-10
                      h-10
                      rounded-full
                      border
                      border-[#ddd]
                      hover:border-[#147a3f]
                      transition
                      flex
                      items-center
                      justify-center
                      ${currentPage === 1 ? "opacity-40 cursor-not-allowed hover:border-[#ddd]" : "cursor-pointer"}
                    `}
                  >
                    ←
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        w-10
                        h-10
                        rounded-full
                        font-semibold
                        transition
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                        border
                        ${isActive 
                          ? "bg-[#147a3f] border-[#147a3f] text-white" 
                          : "border-[#ddd] hover:border-[#147a3f] text-[#333]"
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`
                      w-10
                      h-10
                      rounded-full
                      border
                      border-[#ddd]
                      hover:border-[#147a3f]
                      transition
                      flex
                      items-center
                      justify-center
                      ${currentPage === totalPages ? "opacity-40 cursor-not-allowed hover:border-[#ddd]" : "cursor-pointer"}
                    `}
                  >
                    →
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="col-span-4">

            <div className="">

              <div className="space-y-6">

  {/* About Blog */}
  <div
    className="
      bg-[#f7f7f7]
      rounded-[18px]
      p-8
    "
  >

    <h3
      className="
        text-[#147a3f]
        font-bold
        text-[22px]
        mb-5
      "
    >
      About Our Blog
    </h3>

    <p className="text-[#444] leading-8 mb-6">
      We share wellness insights,
      nutrition tips, and healthy
      living guides to help you make
      informed choices and live
      better every day.
    </p>

    <button
      className="
        bg-[#147a3f]
        hover:bg-[#0f6630]
        text-white
        px-5
        py-3
        rounded-lg
        font-semibold
        text-sm
      "
    >
      Learn More About Us →
    </button>

  </div>

    {/* Blog Categories */}
    <CategoriesWidget
      categories={dynamicCategories}
      activeCategorySlug={activeCategorySlug}
      title="Blog Categories"
    />

{/* Popular Posts */}
<div
  className="
    bg-[#f7f7f7]
    rounded-[18px]
    p-8
  "
>

  <h3
    className="
      text-[#147a3f]
      font-bold
      text-[22px]
      mb-6
    "
  >
    Popular Posts
  </h3>

  <div className="space-y-6">

    <div className="flex gap-4">

      <img
        src={beautySkin}
        alt=""
        className="
          w-[90px]
          h-[90px]
          rounded-lg
          object-cover
        "
      />

      <div>

        <h4
          className="
            text-[14px]
            font-semibold
            leading-6
            mb-2
          "
        >
          10 Essential Nutrients For Healthy, Glowing Skin
        </h4>

        <p className="text-[12px] text-[#777]">
          May 12, 2024
        </p>

      </div>

    </div>

    <div className="flex gap-4">

      <img
        src={nutrition}
        alt=""
        className="
          w-[90px]
          h-[90px]
          rounded-lg
          object-cover
        "
      />

      <div>

        <h4
          className="
            text-[14px]
            font-semibold
            leading-6
            mb-2
          "
        >
          A Beginner's Guide To Balanced Nutrition
        </h4>

        <p className="text-[12px] text-[#777]">
          May 08, 2024
        </p>

      </div>

    </div>

    <div className="flex gap-4">

      <img
        src={fitness}
        alt=""
        className="
          w-[90px]
          h-[90px]
          rounded-lg
          object-cover
        "
      />

      <div>

        <h4
          className="
            text-[14px]
            font-semibold
            leading-6
            mb-2
          "
        >
          How Supplements Can Support Your Fitness Goals
        </h4>

        <p className="text-[12px] text-[#777]">
          May 02, 2024
        </p>

      </div>

    </div>

  </div>

</div>
</div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default BlogListing;