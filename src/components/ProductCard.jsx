import { Link } from "react-router-dom";
import {products} from "../data/products.js";

const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function ProductCard({
  image,
  name,
  price,
  regularPrice,
  salePrice,
  slug,
  isBestSeller,
  badge,
  rating = 5,
  reviews = 2415,
}) {
  const hasSale = salePrice && regularPrice && toNum(salePrice) > 0 && toNum(salePrice) !== toNum(regularPrice);

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
      {(hasSale || badge === "Sale") && (
        <span
          className={`
            absolute
            top-0
            z-10
            bg-[#e53e3e]
            text-white
            text-[10px]
            font-bold
            px-3
            py-1
            rounded-br-md
            uppercase
            tracking-wider
            ${isBestSeller ? "left-[75px]" : "left-0"}
          `}
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

      <div className="p-4 text-center">

        <h3 className="text-[14px] leading-6 mb-2 font-semibold text-slate-800 line-clamp-2 min-h-[48px]">
          {name}
        </h3>

        <div className="text-[#f6a400] text-sm mb-2 flex items-center justify-center gap-1">
          <span>{"★".repeat(rating)}</span>
          <span className="text-[#555] ml-1 text-xs">
            ({reviews})
          </span>
        </div>

        {/* Pricing Block */}
        {hasSale ? (
          <div className="flex items-baseline justify-center gap-2 mt-2 mb-2">
            <span className="font-bold text-[20px] text-[#dc2626]">
              ${toNum(salePrice).toFixed(2)}
            </span>
            <span className="text-[13px] line-through text-slate-400 font-semibold">
              ${toNum(regularPrice).toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="font-bold text-[20px] mt-2 mb-2 text-slate-850">
            ${toNum(regularPrice || price).toFixed(2)}
          </div>
        )}

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
            font-bold
            transition-colors
          "
        >
          ADD TO CART
        </button>

      </div>
    </Link>
  );
}

export default ProductCard;