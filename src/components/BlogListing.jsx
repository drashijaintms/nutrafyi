import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

  useEffect(() => {
    setCurrentPage(1);
  }, [blogs]);

  const totalPages = Math.max(1, Math.ceil(blogs.length / blogsPerPage));
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

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
            image: b.featuredImage || beautySkin,
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

const categories = [
  {
    name: "Vitamins & Nutrition",
    count: 18,
    slug: "vitamins-nutrition",
  },
  {
    name: "Weight Management",
    count: 14,
    slug: "weight-management",
  },
  {
    name: "Energy & Performance",
    count: 16,
    slug: "energy-performance",
  },
  {
    name: "Immune Support",
    count: 12,
    slug: "immune-support",
  },
  {
    name: "Beauty & Skin",
    count: 15,
    slug: "beauty-skin",
  },
  {
    name: "Healthy Living Essentials",
    count: 20,
    slug: "healthy-living",
  },
];
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
            <div className="flex items-center justify-between mb-8">

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

{/* Shop Categories */}
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
    Shop Categories
  </h3>

<div className="space-y-4">

  {categories.map((category, index) => (
    <Link
      key={index}
      to={`/category/${category.slug}`}
      className="
        flex
        justify-between
        hover:text-[#147a3f]
        transition
      "
    >
      <span>{category.name}</span>
      <span>{category.count}</span>
    </Link>
  ))}

</div>

<Link
  to="/category"
  className="
    inline-flex
    items-center
    gap-2
    mt-6
    text-[#147a3f]
    font-bold
    uppercase
    text-sm
  "
>
  View All Products →
</Link>

</div>
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