import React, { useState, useEffect } from "react";
import { Search, UserRound, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

function BreadcrumbBar({ title, category }) {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadCart = () => {
    const cartJson = localStorage.getItem("cart_items");
    const items = cartJson ? JSON.parse(cartJson) : [];
    setCartItems(items);
    setCartCount(items.reduce((sum, item) => sum + item.qty, 0));
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart_updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
    };
  }, []);

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    const updated = cartItems.map(item => 
      item.id === itemId ? { ...item, qty: newQty } : item
    );
    localStorage.setItem("cart_items", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const handleRemoveItem = (itemId) => {
    const updated = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem("cart_items", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
    triggerToast("Item removed from cart");
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart_items");
    window.dispatchEvent(new Event("cart_updated"));
    triggerToast("Cart cleared");
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const { formatPrice, getNumericPrice, symbol } = useCurrency();
  const subtotal = cartItems.reduce((sum, item) => sum + getNumericPrice(item.price, item.currencyOverrides) * item.qty, 0);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("user_logged_in", handleLoginStatus);
    window.addEventListener("user_logged_out", handleLoginStatus);
    return () => {
      window.removeEventListener("user_logged_in", handleLoginStatus);
      window.removeEventListener("user_logged_out", handleLoginStatus);
    };
  }, []);

  return (
    <section className="bg-white shadow-sm border-b border-[#e5e5e5] relative">
      <div className="max-w-7xl mx-auto px-4 py-3">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Breadcrumb */}
          <div>
            <p className="text-[18px] text-[#222]">
              <Link to="/" className="hover:text-[#147a3f] transition">Home</Link>

              {category && (
                <>
                  <span className="mx-2 text-slate-400">/</span>
                  <span className="text-slate-500">{category}</span>
                </>
              )}

              {title && (
                <>
                  <span className="mx-2 text-slate-400">/</span>
                  <span className="text-slate-800 font-medium">{title}</span>
                </>
              )}
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Product Search"
                className="
                  w-[280px]
                  h-[42px]
                  bg-[#f5f7f6]
                  rounded-md
                  pl-4
                  pr-10
                  text-sm
                  outline-none
                  border border-transparent
                  focus:border-[#147a3f]
                "
              />
              <Search
                size={18}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />
            </div>

            {/* User */}
            <Link 
              to={isLoggedIn ? "/account" : "/login"} 
              className={`transition p-1 ${isLoggedIn ? "text-[#147a3f] hover:text-[#0f6630]" : "text-gray-600 hover:text-[#147a3f]"}`}
              title={isLoggedIn ? "My Account" : "Sign In / Register"}
            >
              <UserRound size={22} />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-[#147a3f] transition p-1"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#147a3f] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-[#147a3f]" size={20} />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Your Shopping Cart</h3>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <ShoppingCart size={48} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-400">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold text-[#147a3f] hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-xl relative group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-contain rounded-lg bg-white border border-slate-100 p-1 shrink-0" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=150&h=150&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0 pr-6 text-left">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-[11px] font-bold text-[#147a3f] mt-1">{formatPrice(item.price, item.currencyOverrides)} x {item.qty}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50 text-[10px] font-bold"
                        >-</button>
                        <span className="text-xs font-bold text-slate-700 min-w-[12px] text-center">{item.qty}</span>
                        <button 
                          onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50 text-[10px] font-bold"
                        >+</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal:</span>
                  <span className="text-lg font-extrabold text-slate-800">{symbol}{subtotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleClearCart}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#147a3f] hover:bg-[#0f6630] text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-700/15 transition-all cursor-pointer"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default BreadcrumbBar;