import { Link } from "react-router-dom";
import { products } from "../data/products";
function CategoryCard({
  image,
  title,
  description,
  slug,
}) {
  const productCount = products.filter(
  (product) => product.category === slug
).length;
  return (
   <Link
  to={`/category/${slug}`}
  className="
    block
    bg-white
    border
    border-[#e5e5e5]
    rounded-[18px]
    overflow-hidden
    hover:shadow-lg
    transition-all
    duration-300
    hover:-translate-y-2
  "
>
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="
          w-full
          h-[180px]
          object-cover
        "
      />

      {/* Content */}
      <div className="p-5">

        <h3 className="text-[#147a3f] font-bold text-[18px] uppercase mb-3">
          {title}
        </h3>

        <p className="text-[13px] text-[#444] leading-7 mb-4">
          {description}
        </p>

        <p className="text-[#147a3f] font-semibold text-[14px] mb-4">
  {productCount} PRODUCTS
</p>

        <button
          className="
            bg-[#147a3f]
            hover:bg-[#0f6630]
            text-white
            px-5
            py-2
            rounded-md
            text-[14px]
          "
        >
          Shop Now
        </button>

      </div>
    </Link>
  );
}

export default CategoryCard;