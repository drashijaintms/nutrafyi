import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import leafPattern from "../assets/leaf-pattern.png";
import { getCategories } from "../services/categoryService";

function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const forms = [
  { name: "Capsules", count: 18 },
  { name: "Tablets", count: 14 },
  { name: "Powder", count: 16 },
  { name: "Gummies", count: 12 },
  { name: "Liquid", count: 15 },
];
  const dietaryPreferences = [
  { name: "Vegetarian", count: 18 },
  { name: "Vegan", count: 14 },
  { name: "Gluten Free", count: 16 },
  { name: "Non-GMO", count: 12 },
  { name: "Sugar Free", count: 15 },
];

  return (
  <>
    {/* Shop Categories */}
    <div className="bg-[#f7f7f7] rounded-[20px] p-8">

      <h3 className="text-[#147a3f] text-[20px] font-bold mb-8">
        Shop Categories
      </h3>

<div className="space-y-6">
  {categories.map((category) => (
    <Link
      key={category._id}
      to={`/category/${category.slug}`}
      className={`
        flex
        justify-between
        items-center
        transition
        ${
          slug === category.slug
            ? "text-[#147a3f] font-semibold"
            : "hover:text-[#147a3f]"
        }
      `}
    >
      <span>{category.title}</span>
      <span>{category.count || 0}</span>
    </Link>
  ))}
</div>

    </div>

 {/* Filter By */}
<div className="bg-[#f7f7f7] rounded-[20px] p-8 mt-6">

  <h3 className="text-[#147a3f] text-[20px] font-bold mb-6">
    Filter By
  </h3>

  {/* Price Range */}
  <h4 className="font-semibold text-[16px] mb-5">
    Price Range
  </h4>

  <input
    type="range"
    min="0"
    max="100"
    className="w-full accent-[#147a3f]"
  />

  <div className="flex items-center justify-between mt-5">

    <div className="bg-white border border-[#d9d9d9] rounded-md px-4 py-3 min-w-[82px] text-center">
      $ 0
    </div>

    <span className="font-medium">
      to
    </span>

    <div className="bg-white border border-[#d9d9d9] rounded-md px-4 py-3 min-w-[82px] text-center">
      $ 100
    </div>

  </div>

  {/* Divider */}
  <div className="border-t border-[#d9d9d9] my-8"></div>

  {/* Form */}
  <h4 className="font-bold text-[18px] mb-5">
    Form
  </h4>

  <div className="space-y-4">

    {forms.map((form, index) => (
      <label
        key={index}
        className="flex items-center justify-between cursor-pointer"
      >

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            className="w-4 h-4 accent-[#147a3f]"
          />

          <span>{form.name}</span>

        </div>

        <span>{form.count}</span>

      </label>
    ))}

  </div>

  {/* Dietary Preference */}
  <h4 className="font-bold text-[18px] mt-10 mb-5">
    Dietary Preference
  </h4>

  <div className="space-y-4">

    {dietaryPreferences.map((item, index) => (
      <label
        key={index}
        className="flex items-center justify-between cursor-pointer"
      >

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            className="w-4 h-4 accent-[#147a3f]"
          />

          <span>{item.name}</span>

        </div>

        <span>{item.count}</span>

      </label>
    ))}

  </div>

</div>
{/* Need Help Choosing */}
<div className="bg-[#f4f0df] rounded-[20px] p-8 mt-6 relative overflow-hidden">

  <h3 className="text-[#147a3f] text-[20px] font-bold mb-5">
    Need Help Choosing?
  </h3>

  <p className="text-[16px] leading-9 mb-6">
    Our Wellness Experts Are
    Here To Help You Find The
    Right Products.
  </p>

  <button
    className="
      bg-[#147a3f]
      hover:bg-[#0f6630]
      text-white
      text-[13px]
      font-semibold
      px-6
      py-3
      rounded-md
      transition
    "
  >
    CONTACT US
  </button>

  {/* Optional leaf image */}
  <img
    src={leafPattern}
    alt=""
    className="
      absolute
      bottom-0
      right-0
      w-[120px]
      opacity-50
      pointer-events-none
    "
  />

</div>

  </>
);
}

export default CategorySidebar;