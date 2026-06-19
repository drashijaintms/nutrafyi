import { blogs } from "../data/blogs";
import { Link } from "react-router-dom";
function BlogSection() {


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
  className="
    inline-block
    bg-[#137b3a]
    hover:bg-[#0f6630]
    text-white
    px-10
    py-4
    rounded-lg
    font-medium
    transition
  "
>
  Explore Wellness Blog
</Link>

          </div>

          {/* Right Cards */}
          <div className="w-full lg:w-7/12">

            <div className="flex items-center">

              {/* Left Arrow */}
              <button
                className="
                  hidden lg:flex
                  w-12
                  h-12
                  items-center
                  justify-center
                  text-[#137b3a]
                  text-[40px]
                  mr-5
                "
              >
                ‹
              </button>

              {/* Cards */}
              <div className="flex flex-wrap lg:flex-nowrap gap-4 flex-1">

                {blogs.slice(0, 3).map((blog) => (
                  <Link
  key={blog.id}
  to={`/blog/${blog.slug}`}
  className="
    w-full
    md:w-[48%]
    lg:w-[33.33%]
    bg-white
    rounded-[18px]
    overflow-hidden
    border
    border-[#dcdcdc]
    shadow-sm
    block
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-lg
  "
>

                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="
                        w-full
                        h-[180px]
                        object-cover
                      "
                    />

                    <div className="p-4">

                      <h3 className="text-[#137b3a] text-[18px] font-bold mb-3">
                        {blog.title}
                      </h3>

                      <p className="text-[#777] text-[13px] leading-6">
                        {blog.description}
                      </p>

                    </div>

                  </Link>
                ))}

              </div>

              {/* Right Arrow */}
              <button
                className="
                  hidden lg:flex
                  w-12
                  h-12
                  items-center
                  justify-center
                  text-[#137b3a]
                  text-[40px]
                  ml-5
                "
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