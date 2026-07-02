import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { Heart } from "lucide-react";

const toNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;

function ProductCard({
  id,
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
  currencyOverrides,
  productType,
  externalUrl,
  buttonText,
}) {
  const navigate = useNavigate();
  const { formatPrice, hasActiveSale } = useCurrency();
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // We can pass the product object to hasActiveSale:
  const mockProductObj = { price, regularPrice, salePrice, currencyOverrides };
  const hasSale = hasActiveSale(mockProductObj);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!id) return;
      const token = localStorage.getItem("token");
      let wishList = [];
      const wishJson = localStorage.getItem("wishlist_ids");
      
      if (wishJson) {
        wishList = JSON.parse(wishJson);
      } else if (token) {
        try {
          const res = await fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.customer && data.customer.wishlist) {
              const ids = data.customer.wishlist.map(w => w._id || w);
              localStorage.setItem("wishlist_ids", JSON.stringify(ids));
              wishList = ids;
            }
          }
        } catch (err) {
          console.error("Self-heal wishlist fetch error:", err);
        }
      }
      setIsWishlisted(wishList.includes(id));
    };

    checkWishlist();

    window.addEventListener("wishlist_updated", checkWishlist);
    window.addEventListener("user_logged_in", checkWishlist);
    window.addEventListener("user_logged_out", checkWishlist);
    
    return () => {
      window.removeEventListener("wishlist_updated", checkWishlist);
      window.removeEventListener("user_logged_in", checkWishlist);
      window.removeEventListener("user_logged_out", checkWishlist);
    };
  }, [id]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update wishlist");
      }

      localStorage.setItem("wishlist_ids", JSON.stringify(data.wishlist));
      window.dispatchEvent(new Event("wishlist_updated"));

      setToast({
        show: true,
        message: isWishlisted ? "Removed from Wishlist!" : "Added to Wishlist!"
      });
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);

    } catch (err) {
      console.error("Wishlist error:", err);
      setToast({ show: true, message: err.message || "Error updating wishlist" });
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cartJson = localStorage.getItem("cart_items");
    let items = cartJson ? JSON.parse(cartJson) : [];

    const priceVal = parseFloat(String(salePrice || regularPrice || price || "0").replace(/[^\d.]/g, "")) || 0;

    const existing = items.find(item => item.slug === slug);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: slug,
        name: name,
        price: priceVal,
        qty: 1,
        image: image || "",
        slug: slug,
        currencyOverrides: currencyOverrides || {}
      });
    }

    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));

    setToast({ show: true, message: `Added "${name}" to Cart!` });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (externalUrl) {
      window.location.href = externalUrl;
    }
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="
        group
        relative
        block
        w-full
        bg-transparent
        border
        border-transparent
        rounded-[20px]
        overflow-hidden
        transition-all
        duration-300
        hover:bg-white
        hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
        hover:scale-[1.03]
      "
    >
      {/* Top Half: Image container — white box with borders by default */}
      <div className="relative w-full h-[180px] bg-white border border-[#e5e5db] group-hover:border-transparent rounded-[16px] shadow-xs group-hover:shadow-none flex items-center justify-center p-4 transition-all duration-300">
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
              font-semibold
              px-3
              py-1
              rounded-br-md
              rounded-tl-[16px]
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
              ${isBestSeller ? "left-[75px] rounded-tl-none" : "left-0 rounded-tl-[16px]"}
            `}
          >
            Sale
          </span>
        )}

        {/* Wishlist Heart Icon */}
        {id && (
          <button
            onClick={handleToggleWishlist}
            type="button"
            className="
              absolute
              top-3
              right-3
              z-10
              bg-white/80
              backdrop-blur-xs
              p-2
              rounded-full
              border
              border-slate-200/60
              hover:text-red-500
              hover:scale-110
              transition-all
              shadow-xs
            "
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400"
              }`}
            />
          </button>
        )}

        <img
          src={image}
          alt={name}
          className="max-h-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Bottom Half: Details container */}
      <div className="px-4 pb-6 pt-4 text-center">
        <h3 className="font-bold text-[15px] leading-[20px] min-h-[40px] text-black mb-2">
          {name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          <span className="text-[#f5a300] text-[18px] leading-none">
            {"★".repeat(rating || 5)}
          </span>
          <span className="text-[13px] text-slate-800 font-medium">
            ({reviews})
          </span>
        </div>

        {hasSale ? (
          <div className="flex items-baseline justify-center gap-2 mt-3 mb-4">
            <span className="font-extrabold text-[19px] text-[#dc2626]">
              {formatPrice(salePrice, currencyOverrides)}
            </span>
            <span className="text-[13px] line-through text-slate-400 font-semibold">
              {formatPrice(regularPrice || price, currencyOverrides, true)}
            </span>
          </div>
        ) : (
          <div className="font-extrabold text-[19px] mt-3 mb-4 text-black">
            {formatPrice(regularPrice || price, currencyOverrides)}
          </div>
        )}

        {productType === "External" ? (
          <button
            onClick={handleBuyNow}
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
            {buttonText || "BUY NOW"}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
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

          {toast.show && (
            <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
            </div>
          )}
        </div>
      </Link>
    );
}

export default ProductCard;