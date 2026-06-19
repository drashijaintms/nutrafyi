import headingLeaf from "../assets/heading-leaf.png";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";

function WellnessCategories() {
  return (
    <section className="py-20 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="flex items-center justify-center gap-4 mb-12">
  <img
    src={headingLeaf}
    alt="Leaf"
    className="w-14 h-auto"
  />

  <h2 className="text-[42px] font-bold uppercase text-center">
    Nature Wellness Products Designed For Every Lifestyle
  </h2>

  <img
    src={headingLeaf}
    alt="Leaf"
    className="w-14 h-auto scale-x-[-1]"
  />
</div>

        {/* Top Right Link */}
        <div className="flex justify-end mb-6">
  <Link
    to="/category"
    className="font-semibold uppercase text-sm hover:text-green-700 transition"
  >
    View All Categories →
  </Link>
</div>

        {/* Cards */}
        <div className="flex flex-wrap -mx-3">

          {categories.slice(0, 6).map((item, index) => (
            <Link
  key={index}
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
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[170px] object-cover"
                />

                <div className="p-5 text-center">

                  <h3 className="text-[#137b3a] font-bold text-[22px] leading-[30px] uppercase min-h-[70px]">
                    {item.title}
                  </h3>

                  <button className="mt-4 bg-[#7BC043] hover:bg-[#6bb33a] text-white font-semibold px-6 py-3 rounded-md transition">
                    SHOP NOW
                  </button>

                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WellnessCategories;