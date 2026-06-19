import { Link } from "react-router-dom";
import {products} from "../data/products.js";

function ProductCard({
  image,
  name,
  price,
  slug,
  isBestSeller,
  badge,
  rating = 5,
  reviews = 2415,
}) {
  return (
    <Link
      to={`/product/${slug}`}
      className="
        relative
        block
        bg-white
        border
        border-[#e5e5e5]
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        transition
      "
    >
      {/* Best Seller Badge */}
      {isBestSeller && (
        <span
          className="
            absolute
            top-0
            left-0
            z-10
            bg-[#d76611]
            text-white
            text-[10px]
            font-medium
            px-3
            py-1
            rounded-br-md
          "
        >
          Best Seller
        </span>
      )}

      {/* Sale Badge */}
      {badge === "Sale" && (
        <span
          className="
            absolute
            top-0
            left-0
            z-10
            bg-black
            text-white
            text-[10px]
            font-medium
            px-3
            py-1
            rounded-br-md
          "
        >
          Sale
        </span>
      )}

      <div className="h-[180px] flex items-center justify-center p-4">
        <img
          src={image}
          alt={name}
          className="max-h-full object-contain"
        />
      </div>

      <div className="p-4">

        <h3 className="text-[14px] leading-6 mb-2">
          {name}
        </h3>

        <div className="text-[#f6a400] text-sm mb-2">
          {"★".repeat(rating)}
          <span className="text-[#555] ml-2">
            ({reviews})
          </span>
        </div>

        <div className="font-bold text-[22px]">
          {price}
        </div>

        <button
          className="
            mt-4
            w-full
            bg-[#147a3f]
            hover:bg-[#0f6630]
            text-white
            py-2
            rounded-md
            text-sm
          "
        >
          ADD TO CART
        </button>

      </div>
    </Link>
  );
}

export default ProductCard;