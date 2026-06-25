import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadcrumbBar from "../components/BreadcrumbBar";
import { LogOut, ShoppingBag, Heart, User, MapPin, Loader2, ArrowRight } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { productImages } from "../data/productImages";

const resolveProductImage = (img, slug) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

export default function Account() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState("orders");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Address form states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrType, setNewAddrType] = useState("Shipping");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrState, setNewAddrState] = useState("");
  const [newAddrZip, setNewAddrZip] = useState("");
  const [newAddrCountry, setNewAddrCountry] = useState("India");
  const [addrError, setAddrError] = useState("");
  const [addrSuccess, setAddrSuccess] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(data.message || "Failed to load account");
      }
      setProfileData(data);
      if (data.customer && data.customer.wishlist) {
        localStorage.setItem("wishlist_ids", JSON.stringify(data.customer.wishlist.map(w => w._id || w)));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();

    window.addEventListener("wishlist_updated", fetchProfile);
    window.addEventListener("user_logged_in", fetchProfile);

    return () => {
      window.removeEventListener("wishlist_updated", fetchProfile);
      window.removeEventListener("user_logged_in", fetchProfile);
    };
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist_ids");
    window.dispatchEvent(new Event("user_logged_out"));
    navigate("/login");
  };

  const handleRemoveWishlist = async (prodId) => {
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: prodId }),
      });
      if (res.ok) {
        fetchProfile();
        window.dispatchEvent(new Event("wishlist_updated"));
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddrError("");
    setAddrSuccess("");
    setAddrLoading(true);

    if (!newAddrStreet || !newAddrCity || !newAddrState || !newAddrZip || !newAddrCountry) {
      setAddrError("All address fields are required");
      setAddrLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          addressType: newAddrType,
          address: newAddrStreet,
          city: newAddrCity,
          state: newAddrState,
          zip: newAddrZip,
          country: newAddrCountry
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      setAddrSuccess("Address added successfully!");
      setNewAddrStreet("");
      setNewAddrCity("");
      setNewAddrState("");
      setNewAddrZip("");
      
      fetchProfile();
      
      setTimeout(() => {
        setShowAddAddress(false);
        setAddrSuccess("");
      }, 1500);

    } catch (err) {
      setAddrError(err.message);
    } finally {
      setAddrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfbf7] min-h-screen flex flex-col justify-between">
        <div>
          <BreadcrumbBar title="My Account" />
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#147a3f]" />
            <span className="text-sm font-semibold tracking-wide">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const { customer = {}, orders = [] } = profileData || {};
  const wishlist = customer.wishlist || [];

  const recentlyPurchasedItems = [];
  const seenProductIds = new Set();
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const prodId = item.product ? item.product.toString() : "";
      if (prodId && !seenProductIds.has(prodId)) {
        seenProductIds.add(prodId);
        recentlyPurchasedItems.push(item);
      }
    });
  });

  return (
    <div className="bg-[#fcfbf7] min-h-screen flex flex-col justify-between">
      <div>
        <BreadcrumbBar title="My Account" />

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Dashboard Header Bar */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs mb-8">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-[#e8f5e9] text-[#147a3f] font-bold text-2xl flex items-center justify-center border border-[#c8e6c9]">
                {customer.name ? customer.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Store Member since {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-2xs h-fit space-y-1">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "orders"
                    ? "bg-[#147a3f] text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Order History ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "wishlist"
                    ? "bg-[#147a3f] text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#147a3f] text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <User className="w-4 h-4" /> Profile Details
              </button>
            </div>

            {/* Main Tabs Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Order History</h3>

                  {recentlyPurchasedItems.length > 0 && (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-2xs space-y-4">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recently Purchased</h4>
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                        {recentlyPurchasedItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 border border-slate-100 p-3 rounded-2xl bg-slate-50/30 min-w-[260px] shrink-0">
                            {item.image && (
                              <img
                                src={resolveProductImage(item.image, item.slug)}
                                alt=""
                                className="w-12 h-12 object-contain bg-white rounded-lg p-0.5 border border-slate-100 shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{item.title}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{formatPrice(item.price)}</p>
                              {item.slug && (
                                <Link
                                  to={`/product/${item.slug}`}
                                  className="text-[10px] font-bold text-[#147a3f] hover:underline mt-1.5 block"
                                >
                                  Buy Again →
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {orders.length === 0 ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-12 text-center shadow-2xs">
                      <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-sm font-bold text-slate-700 mb-1">No orders found</h4>
                      <p className="text-xs text-slate-400 mb-6">You haven't placed any storefront orders yet.</p>
                      <Link to="/products" className="inline-block bg-[#147a3f] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0f6630] transition-colors shadow-sm">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-2xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Order ID</span>
                            <h4 className="font-extrabold text-slate-850 text-sm">#{order.orderId}</h4>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Date Placed</span>
                            <p className="text-xs font-semibold text-slate-650">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Due</span>
                            <p className="text-sm font-bold text-[#147a3f]">{order.currencySymbol || "$"}{(order.amount?.total || 0).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Status</span>
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : order.status === "Cancelled" || order.status === "Refunded"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div>
                            <Link
                              to={`/track-order?id=${order.orderId}`}
                              className="flex items-center gap-1 bg-[#147a3f] hover:bg-[#0f6630] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                            >
                              Track <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>

                        {/* Order Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 border border-slate-100 p-3 rounded-2xl bg-slate-50/20">
                              {item.image && (
                                <img
                                  src={resolveProductImage(item.image, item.slug)}
                                  alt=""
                                  className="w-12 h-12 object-contain bg-white rounded-lg p-0.5 border border-slate-100 shrink-0"
                                />
                              )}
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity} • Price: {order.currencySymbol || "$"}{item.price.toFixed(2)}</p>
                                {item.variation && Object.keys(item.variation).length > 0 && (
                                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                                    {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: WISHLIST */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">My Wishlist</h3>
                  
                  {wishlist.length === 0 ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-12 text-center shadow-2xs">
                      <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-sm font-bold text-slate-700 mb-1">Your wishlist is empty</h4>
                      <p className="text-xs text-slate-400 mb-6">Browse products and save your favorites here.</p>
                      <Link to="/products" className="inline-block bg-[#147a3f] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0f6630] transition-colors shadow-sm">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {wishlist.map((prod) => (
                        <div key={prod._id} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden p-4 shadow-3xs flex flex-col justify-between">
                          <div>
                            <div className="h-32 flex items-center justify-center p-2 mb-3 bg-slate-50/30 rounded-xl border border-slate-100">
                              <img
                                src={resolveProductImage(prod.image, prod.slug)}
                                alt=""
                                className="max-h-full object-contain"
                              />
                            </div>
                            <Link to={`/product/${prod.slug}`} className="font-bold text-xs text-slate-850 hover:text-[#147a3f] transition-colors line-clamp-2 leading-tight">
                              {prod.title}
                            </Link>
                            <p className="font-extrabold text-[#147a3f] text-sm mt-2">{formatPrice(prod.price, prod.currencyOverrides)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveWishlist(prod._id)}
                            className="mt-4 w-full border border-rose-100 hover:bg-rose-50 text-rose-500 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PROFILE DETAILS */}
              {activeTab === "profile" && (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                        <p className="font-bold text-slate-850">{customer.name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                        <p className="font-bold text-slate-850">{customer.email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                        <p className="font-bold text-slate-850">{customer.phone || "No phone added"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" /> Saved Address Book
                      </h3>
                      {!showAddAddress && (
                        <button
                          onClick={() => setShowAddAddress(true)}
                          className="text-[10px] font-bold uppercase tracking-wider text-[#147a3f] hover:text-[#0f6630] border border-[#147a3f]/30 hover:bg-[#147a3f]/5 px-3 py-1.5 rounded-xl transition-all"
                        >
                          + Add Address
                        </button>
                      )}
                    </div>

                    {showAddAddress && (
                      <form onSubmit={handleAddAddress} className="bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 mb-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-250">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-750 uppercase tracking-wider">New Address Details</h4>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddAddress(false);
                              setAddrError("");
                            }}
                            className="text-[10px] font-bold text-slate-450 hover:text-slate-650 uppercase"
                          >
                            Cancel
                          </button>
                        </div>

                        {addrError && (
                          <div className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-3 text-[11px] font-semibold">
                            {addrError}
                          </div>
                        )}

                        {addrSuccess && (
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 text-[11px] font-semibold">
                            {addrSuccess}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address Type</label>
                            <select
                              value={newAddrType}
                              onChange={(e) => setNewAddrType(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            >
                              <option value="Shipping">Shipping</option>
                              <option value="Billing">Billing</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Street Address</label>
                            <input
                              type="text"
                              required
                              value={newAddrStreet}
                              onChange={(e) => setNewAddrStreet(e.target.value)}
                              placeholder="123 Health St"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                            <input
                              type="text"
                              required
                              value={newAddrCity}
                              onChange={(e) => setNewAddrCity(e.target.value)}
                              placeholder="City"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">State / Province</label>
                            <input
                              type="text"
                              required
                              value={newAddrState}
                              onChange={(e) => setNewAddrState(e.target.value)}
                              placeholder="State"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">ZIP / Postal Code</label>
                            <input
                              type="text"
                              required
                              value={newAddrZip}
                              onChange={(e) => setNewAddrZip(e.target.value)}
                              placeholder="ZIP Code"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                            <input
                              type="text"
                              required
                              value={newAddrCountry}
                              onChange={(e) => setNewAddrCountry(e.target.value)}
                              placeholder="Country"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#147a3f]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={addrLoading}
                          className="w-full bg-[#147a3f] hover:bg-[#0f6630] disabled:bg-slate-350 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                        >
                          {addrLoading ? "Saving Address..." : "Save Address"}
                        </button>
                      </form>
                    )}

                    {customer.addresses?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {customer.addresses.map((addr, idx) => (
                          <div key={idx} className="border border-slate-150/60 rounded-2xl p-4 bg-slate-50/20">
                            <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-indigo-100">
                              {addr.addressType} Address
                            </span>
                            <p className="text-xs text-slate-650 leading-relaxed font-medium">
                              {addr.address}, {addr.city}, {addr.state} - {addr.zip}, {addr.country}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No shipping or billing addresses saved yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
