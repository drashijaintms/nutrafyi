import headingLeaf from "../assets/heading-leaf.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";

const resolveProductImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

// Strip any currency symbol and return a clean number
const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  fetchProducts();
}, []);
  const bestSellerProducts = products.filter(
  (product) => product.isBestSeller
);
   return (
    <section className="py-16 bg-[#f4f2e8]">
      <div className="max-w-[1180px] mx-auto px-4">

        {/* Heading */}
        <div className="relative mb-10">

          <div className="flex items-center justify-center gap-4">

            <img
              src={headingLeaf}
              alt=""
              className="w-12"
            />

            <h2 className="text-[22px] lg:text-[42px] font-bold uppercase leading-none">
              Best Seller Products
            </h2>

            <img
              src={headingLeaf}
              alt=""
              className="w-12 scale-x-[-1]"
            />

          </div>

          <Link
  to="/products"
  className="
    absolute
    right-0
    top-1/2
    -translate-y-1/2
    text-[13px]
    font-semibold
    uppercase
    hover:text-[#137b3a]
    transition
  "
>
  VIEW ALL PRODUCTS →
</Link>

        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

  {bestSellerProducts.map((product) => (

      <Link
key={product._id}
  to={`/product/${product.slug}`}
  className="
    group
    relative
    bg-[#fafaf8]
    rounded-[16px]
    border
    border-[#d9d9d9]
    overflow-hidden
    transition-all
    duration-300
    hover:shadow-lg
    block
  "
>
              {/* Best Seller Badge */}
              {product.isBestSeller && (
                <span className="absolute top-0 left-0 z-10 bg-[#d76611] text-white text-[10px] font-medium px-3 py-1 rounded-br-md">
                  Best Seller
                </span>
              )}

              {/* Sale Badge */}
              {(product.badge === "Sale" || (product.salePrice && product.regularPrice && toNum(product.salePrice) > 0 && toNum(product.salePrice) !== toNum(product.regularPrice))) && (
                <span className={`absolute top-0 z-10 bg-[#e53e3e] text-white text-[10px] font-bold px-3 py-1 rounded-br-md uppercase tracking-wider shadow-md ${product.isBestSeller ? "left-[75px]" : "left-0"}`}>
                  Sale
                </span>
              )}

              {/* Image */}
              <div className="h-[175px] flex items-center justify-center px-4 pt-4">
                <img
                  src={resolveProductImage(product.image, product.slug)}
                  alt={product.title}
                  className="
                    max-h-[145px]
                    object-contain
                    transition
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Content */}
              <div className="px-3 pb-5 text-center">

                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-[#f5a300] text-[16px]">
                    {"★".repeat(product.rating)}
                  </span>

                  <span className="text-[12px] text-black ml-1">
  ({product.reviews})
</span>
                </div>

                <h3 className="font-semibold text-[15px] leading-[20px] min-h-[42px]">
                  {product.title}
                </h3>

                {/* Pricing Block */}
                {product.salePrice && product.regularPrice && toNum(product.salePrice) > 0 && toNum(product.salePrice) !== toNum(product.regularPrice) ? (
                  <div className="flex items-baseline justify-center gap-2 mt-3 mb-4">
                    <span className="font-bold text-[18px] text-[#dc2626]">
                      ${toNum(product.salePrice).toFixed(2)}
                    </span>
                    <span className="text-[13px] line-through text-slate-400 font-semibold">
                      ${toNum(product.regularPrice).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="font-bold text-[18px] mt-3 mb-4 text-slate-850">
                    ${toNum(product.regularPrice || product.price).toFixed(2)}
                  </div>
                )}

                <button
                  className="
                    bg-[#147a3f]
                    hover:bg-[#106933]
                    text-white
                    text-[12px]
                    font-bold
                    uppercase
                    px-6
                    py-[10px]
                    rounded-[3px]
                    transition
                  "
                >
                  ADD TO CART
                </button>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default BestSellerProducts;