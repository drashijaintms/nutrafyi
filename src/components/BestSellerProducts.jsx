import headingLeaf from "../assets/heading-leaf.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";
import { useCurrency } from "../context/CurrencyContext";

const resolveProductImage = (img, slug) => {
  if (!img) return null;
  if (img.trim().startsWith("<iframe") || img.trim().startsWith("<div") || img.includes("</iframe>")) {
    return null;
  }
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

// Strip any currency symbol and return a clean number
const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function BestSellerProducts() {
  const { formatPrice, hasActiveSale } = useCurrency();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleAddToCart = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartJson = localStorage.getItem("cart_items");
    let items = cartJson ? JSON.parse(cartJson) : [];
    
    const priceVal = parseFloat(String(prod.salePrice || prod.regularPrice || prod.price || "0").replace(/[^\d.]/g, "")) || 0;
    const imageVal = resolveProductImage(prod.image, prod.slug) || "";

    const existing = items.find(item => item.slug === prod.slug);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: prod.slug,
        name: prod.title,
        price: priceVal,
        qty: 1,
        image: imageVal,
        slug: prod.slug,
        currencyOverrides: prod.currencyOverrides || {}
      });
    }
    
    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));

    setToast({ show: true, message: `Added "${prod.title}" to Cart!` });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

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
  const handleBuyNow = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    if (prod.externalUrl) {
      window.location.href = prod.externalUrl;
    }
  };

  return (
    <section className="py-16 bg-[#faf7e5]">
      <div className="max-w-[1180px] mx-auto px-4">

        {/* Heading */}
        <div className="section-header-container mb-2">
          <div className="section-header-title-wrap">
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf"
            />
            <h2 className="section-header-title">
              Best Seller Products
            </h2>
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf flipped"
            />
          </div>
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
                block
                w-full
                bg-white
                border
                border-[#e5e5db]
                rounded-[20px]
                overflow-hidden
                transition-all
                duration-300
                hover:border-transparent
                hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                hover:scale-[1.05]
              "
            >
              {/* Top Half: Image container — transparent bg, no nested borders */}
              <div className="relative w-full h-[175px] flex items-center justify-center p-4">
                {/* Best Seller Badge */}
                {product.isBestSeller && (
                  <span className="absolute top-0 left-0 z-10 bg-[#d76611] text-white text-[10px] font-semibold px-3 py-1 rounded-br-md rounded-tl-[20px]">
                    Best Seller
                  </span>
                )}

                {/* Sale Badge */}
                {(product.badge === "Sale" || (product.salePrice && product.regularPrice && toNum(product.salePrice) > 0 && toNum(product.salePrice) !== toNum(product.regularPrice))) && (
                  <span className={`absolute top-0 z-10 bg-[#e53e3e] text-white text-[10px] font-bold px-3 py-1 rounded-br-md uppercase tracking-wider shadow-md ${product.isBestSeller ? "left-[75px] rounded-tl-none" : "left-0 rounded-tl-[20px]"}`}>
                    Sale
                  </span>
                )}

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

              {/* Bottom Half: Details container */}
              <div className="px-4 pb-6 pt-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-2.5">
                  <span className="text-[#f5a300] text-[18px] leading-none">
                    {"★".repeat(product.rating || 5)}
                  </span>
                  <span className="text-[13px] text-slate-800 font-medium">
                    ({product.reviews || "2,415"})
                  </span>
                </div>

                <h3 className="font-bold text-[15px] leading-[20px] min-h-[40px] text-black">
                  {product.title}
                </h3>

                {/* Pricing Block */}
                {hasActiveSale(product) ? (
                  <div className="flex items-baseline justify-center gap-2 mt-3 mb-4">
                    <span className="font-extrabold text-[19px] text-[#dc2626]">
                      {formatPrice(product.salePrice, product.currencyOverrides)}
                    </span>
                    <span className="text-[13px] line-through text-slate-400 font-semibold">
                      {formatPrice(product.regularPrice || product.price, product.currencyOverrides, true)}
                    </span>
                  </div>
                ) : (
                  <div className="font-extrabold text-[19px] mt-3 mb-4 text-black">
                    {formatPrice(product.regularPrice || product.price, product.currencyOverrides)}
                  </div>
                )}

                {product.productType === "External" ? (
                  <button
                    onClick={(e) => handleBuyNow(e, product)}
                    className="
                      w-full
                      bg-[#147a3f]
                      hover:bg-[#106933]
                      text-white
                      text-[12px]
                      font-bold
                      uppercase
                      py-[10px]
                      rounded-[6px]
                      transition
                    "
                  >
                    {product.buttonText || "BUY NOW"}
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="
                      w-full
                      bg-[#147a3f]
                      hover:bg-[#106933]
                      text-white
                      text-[12px]
                      font-bold
                      uppercase
                      py-[10px]
                      rounded-[6px]
                      transition
                    "
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            </Link>
          ))}

        </div>

        {/* View All Link - right-aligned at the bottom of the last card */}
        <div className="w-full text-right px-3">
          <Link
            to="/products"
            className="font-['Noto_Sans'] font-bold text-[13px] uppercase tracking-wider text-[#111111] hover:text-[#147a3f] transition-colors duration-200"
          >
            View All Products &gt;
          </Link>
        </div>

        {toast.show && (
          <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
          </div>
        )}

      </div>
    </section>
  );
}

export default BestSellerProducts;