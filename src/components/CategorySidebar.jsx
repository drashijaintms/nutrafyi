import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import leafPattern from "../assets/leaf-pattern.png";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter params from URL
  const selectedForms = searchParams.get("form")
    ? searchParams.get("form").split(",")
    : [];

  const selectedDietary = searchParams.get("dietary")
    ? searchParams.get("dietary").split(",")
    : [];

  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"), 10)
    : 2000;

  // Narrow products context by current category if we are in category detail view
  const contextProducts = slug
    ? allProducts.filter((p) => p.category === slug)
    : allProducts;

  // Category dynamic product count helper
  const getCategoryProductCount = (categorySlug) => {
    return allProducts.filter((p) => p.category === categorySlug).length;
  };

  // Helper matching ITEM FORM
  const getFormCount = (formName) => {
    return contextProducts.filter((p) => {
      const spec = p.specifications?.find((s) => s.label === "ITEM FORM");
      if (!spec) return false;
      const val = spec.value.toLowerCase();
      if (formName === "Capsules" && val.includes("capsule")) return true;
      if (formName === "Tablets" && val.includes("tablet")) return true;
      if (formName === "Powder" && val.includes("powder")) return true;
      if (formName === "Gummies" && (val.includes("gummi") || val.includes("gummy"))) return true;
      if (formName === "Liquid" && val.includes("liquid")) return true;
      return false;
    }).length;
  };

  // Helper matching DIET TYPE
  const getDietaryCount = (dietName) => {
    return contextProducts.filter((p) => {
      const spec = p.specifications?.find((s) => s.label === "DIET TYPE");
      if (!spec) return false;
      const val = spec.value.toLowerCase();
      if (dietName === "Vegetarian" && val.includes("vegetarian")) return true;
      if (dietName === "Vegan" && val.includes("vegan")) return true;
      if (dietName === "Gluten Free" && val.includes("gluten")) return true;
      if (dietName === "Non-GMO" && (val.includes("non-gmo") || val.includes("nongmo") || val.includes("non gmo"))) return true;
      if (dietName === "Sugar Free" && val.includes("sugar")) return true;
      return false;
    }).length;
  };

  const handleFormToggle = (formName) => {
    const updated = [...selectedForms];
    const index = updated.indexOf(formName);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(formName);
    }
    const newParams = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      newParams.set("form", updated.join(","));
    } else {
      newParams.delete("form");
    }
    setSearchParams(newParams);
  };

  const handleDietaryToggle = (dietName) => {
    const updated = [...selectedDietary];
    const index = updated.indexOf(dietName);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(dietName);
    }
    const newParams = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      newParams.set("dietary", updated.join(","));
    } else {
      newParams.delete("dietary");
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("maxPrice", val);
    setSearchParams(newParams);
  };

  const forms = [
    { name: "Capsules", count: getFormCount("Capsules") },
    { name: "Tablets", count: getFormCount("Tablets") },
    { name: "Powder", count: getFormCount("Powder") },
    { name: "Gummies", count: getFormCount("Gummies") },
    { name: "Liquid", count: getFormCount("Liquid") },
  ];

  const dietaryPreferences = [
    { name: "Vegetarian", count: getDietaryCount("Vegetarian") },
    { name: "Vegan", count: getDietaryCount("Vegan") },
    { name: "Gluten Free", count: getDietaryCount("Gluten Free") },
    { name: "Non-GMO", count: getDietaryCount("Non-GMO") },
    { name: "Sugar Free", count: getDietaryCount("Sugar Free") },
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
              <span>{getCategoryProductCount(category.slug)}</span>
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
          max="2000"
          value={maxPrice}
          onChange={handlePriceChange}
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
            $ {maxPrice}
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
                  checked={selectedForms.includes(form.name)}
                  onChange={() => handleFormToggle(form.name)}
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
                  checked={selectedDietary.includes(item.name)}
                  onChange={() => handleDietaryToggle(item.name)}
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