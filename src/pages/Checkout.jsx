import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  UserRound, 
  Search, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  CreditCard,
  Building,
  Smartphone,
  ChevronDown,
  Send,
  Edit2,
  Check
} from "lucide-react";
import logo from "../assets/nutrafyi-logo.png";
import { useCurrency } from "../context/CurrencyContext";

// Custom SVG components for social media
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

// Inline Payment Badge SVGs/Components for clean representation
const UpiLogos = () => (
  <div className="flex items-center gap-1.5 shrink-0">
    {/* GPay Logo */}
    <div className="h-5 px-1.5 bg-white border border-slate-200 rounded flex items-center justify-center text-[9px] font-bold text-slate-800 select-none shadow-xs">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">P</span>
      <span className="text-[#FBBC05]">a</span>
      <span className="text-[#34A853]">y</span>
    </div>
    {/* PhonePe Logo */}
    <div className="h-5 px-1.5 bg-[#5f259f] rounded flex items-center justify-center text-[8px] font-extrabold text-white select-none shadow-xs">
      Pe
    </div>
    {/* Paytm Logo */}
    <div className="h-5 px-1.5 bg-white border border-slate-200 rounded flex items-center justify-center text-[9px] font-black italic select-none shadow-xs">
      <span className="text-[#00b9f5]">pay</span>
      <span className="text-[#002e6e]">tm</span>
    </div>
    <span className="text-[10px] text-slate-400 font-semibold">& more</span>
  </div>
);

const CardLogos = () => (
  <div className="flex items-center gap-1.5 shrink-0">
    {/* Visa */}
    <div className="h-5 px-1.5 bg-white border border-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-[#00579f] italic select-none shadow-xs">
      VISA
    </div>
    {/* MasterCard */}
    <div className="h-5 px-1.5 bg-white border border-slate-200 rounded flex items-center justify-center gap-[1px] select-none shadow-xs">
      <div className="w-2 h-2 rounded-full bg-[#eb001b] opacity-90" />
      <div className="w-2 h-2 rounded-full bg-[#ff5f00] opacity-90 -ml-1" />
    </div>
    {/* RuPay */}
    <div className="h-5 px-1.5 bg-white border border-slate-200 rounded flex items-center justify-center text-[8px] font-bold text-[#0c438c] italic select-none shadow-xs">
      RuPay
    </div>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();

  // Wizard Steps: 1 = Shipping, 2 = Payment, 3 = Review, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("India");
  const [saveAddress, setSaveAddress] = useState(true);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard or express

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card, netbanking, cod

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Random order details saved after checkout
  const [orderNumber, setOrderNumber] = useState("");

  // Load Cart from localStorage
  const loadCart = () => {
    const cartJson = localStorage.getItem("cart_items");
    const items = cartJson ? JSON.parse(cartJson) : [];
    
    // Normalize item prices (converting string "$44.10" or number to numeric)
    const cleanedItems = items.map(item => {
      let priceNum = 0;
      if (typeof item.price === "string") {
        priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      } else {
        priceNum = Number(item.price);
      }
      return {
        ...item,
        price: isNaN(priceNum) ? 0 : priceNum
      };
    });

    setCartItems(cleanedItems);
    setCartCount(cleanedItems.reduce((sum, item) => sum + item.qty, 0));
  };

  useEffect(() => {
    loadCart();

    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => {
        if (data.customer) {
          setFullName(data.customer.name || "");
          setEmail(data.customer.email || "");
          setPhone(data.customer.phone || "");

          const shipAddr = data.customer.addresses?.find(addr => addr.addressType === "Shipping");
          if (shipAddr) {
            setAddressLine1(shipAddr.address || "");
            setCity(shipAddr.city || "");
            setStateVal(shipAddr.state || "");
            setPincode(shipAddr.zip || "");
            setCountry(shipAddr.country || "India");
          }
        }
      })
      .catch(err => console.error("Checkout profile prefill error:", err));
    }
  }, []);

  const { currency, symbol, getNumericPrice, formatPrice } = useCurrency();

  // calculations
  const subtotal = cartItems.reduce((sum, item) => sum + getNumericPrice(item.price, item.currencyOverrides) * item.qty, 0);
  const shippingCost = shippingMethod === "express" ? getNumericPrice(5.0) : 0.0;
  const discountVal = subtotal * (discountPercent / 100);
  const total = subtotal + shippingCost - discountVal;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch(`/api/coupons/validate/${code}?subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.message || "Failed to validate coupon");
        return;
      }
      setAppliedCoupon(data.coupon.code);
      if (data.coupon.discountType === "Percentage") {
        setDiscountPercent(data.coupon.discountAmount);
        setCouponSuccess(`Coupon ${data.coupon.code} applied! ${data.coupon.discountAmount}% discount added.`);
      } else {
        const pct = subtotal > 0 ? (data.coupon.discountAmount / subtotal) * 100 : 0;
        setDiscountPercent(pct);
        setCouponSuccess(`Coupon ${data.coupon.code} applied! $${data.coupon.discountAmount.toFixed(2)} discount added.`);
      }
    } catch (err) {
      setCouponError("Error validating coupon code");
    }
  };

  const autoDetectLocation = () => {
    setPincode("400001");
    setCity("Mumbai");
    setStateVal("Maharashtra");
    setCountry("India");
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !pincode || !addressLine1 || !city || !stateVal) {
      alert("Please fill in all required shipping address fields.");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        customer: {
          name: fullName,
          email: email,
          phone: phone
        },
        items: cartItems.map(item => ({
          product: item.id || item._id, // product slug/id in cart
          title: item.name || item.title,
          price: getNumericPrice(item.price, item.currencyOverrides),
          quantity: item.qty,
          variation: item.variation || {},
          image: item.image,
          slug: item.slug
        })),
        shippingDetails: {
          address: addressLine1 + (addressLine2 ? ", " + addressLine2 : ""),
          city: city,
          state: stateVal,
          zip: pincode,
          country: country
        },
        billingDetails: {
          address: addressLine1 + (addressLine2 ? ", " + addressLine2 : ""),
          city: city,
          state: stateVal,
          zip: pincode,
          country: country
        },
        paymentDetails: {
          method: paymentMethod.toUpperCase(),
          status: paymentMethod === "cod" ? "Pending" : "Paid",
          transactionId: paymentMethod === "cod" ? "" : "TXN-" + Math.floor(100000 + Math.random() * 900000)
        },
        amount: {
          subtotal: subtotal,
          discount: discountVal,
          shipping: shippingCost,
          total: total
        },
        appliedCoupon: appliedCoupon || null,
        currency: currency,
        currencySymbol: symbol
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to place order. Please check item stock or try again.");
        return;
      }

      setOrderNumber(data.order.orderId);

      // Clear cart
      localStorage.removeItem("cart_items");
      window.dispatchEvent(new Event("cart_updated"));
      setStep(4);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Order placement error:", err);
      alert(`Error placing order: ${err.message || "Please check connection"}. Please try again.`);
    }
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen font-sans antialiased text-slate-600">
      
      {/* ── Top Announcement Bar ── */}
      <div className="bg-[#0f6630] text-white text-[11px] py-2 border-b border-emerald-800 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Truck size={12} className="shrink-0" />
            <span>Free Shipping on Orders Above $50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={12} className="shrink-0" />
            <span>100% Natural & Safe Ingredients</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw size={12} className="shrink-0" />
            <span>Support + Mon - Sat (9AM - 7PM)</span>
          </div>
          <div className="font-bold">
            <span>+91 98765 43210</span>
          </div>
        </div>
      </div>

      {/* ── Custom Mockup Header ── */}
      <header className="bg-white border-b border-slate-100 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="NutraFYI" className="h-10 md:h-12 object-contain" />
            <div className="hidden sm:block text-left border-l border-slate-100 pl-3">
              <span className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">Supporting Your Journey Every Day</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Link to="/" className="hover:text-[#147a3f] transition">Home</Link>
            <div className="relative group cursor-pointer py-2">
              <span className="hover:text-[#147a3f] transition flex items-center gap-1">
                Shop <ChevronDown size={12} />
              </span>
            </div>
            <Link to="/about" className="hover:text-[#147a3f] transition">About Us</Link>
            <Link to="/blog" className="hover:text-[#147a3f] transition">Wellness Blog</Link>
            <Link to="/contact" className="hover:text-[#147a3f] transition">Contact Us</Link>
            <Link to="/faq" className="hover:text-[#147a3f] transition">FAQ</Link>
          </nav>

          <div className="flex items-center gap-4 text-slate-600">
            <button className="hover:text-[#147a3f] transition p-1 cursor-pointer"><Search size={18} /></button>
            <button className="hover:text-[#147a3f] transition p-1 cursor-pointer"><UserRound size={18} /></button>
            <button onClick={() => navigate("/products")} className="relative hover:text-[#147a3f] transition p-1 cursor-pointer">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#147a3f] text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Checkout Container ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight text-left">Checkout</h1>

        {/* ── Step Progress Indicator ── */}
        <div className="mb-12 max-w-4xl mx-auto px-4">
          <div className="flex items-start justify-between relative">
            
            {/* Background Connector Line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-0.5 bg-slate-200 z-0" />
            
            {/* Active Connector Line */}
            <div 
              className="absolute left-[12.5%] top-[18px] h-0.5 bg-[#147a3f] transition-all duration-500 z-0" 
              style={{ width: `${((step - 1) / 3) * 75}%` }}
            />

            {/* Step 1: Shipping */}
            <div className="flex flex-col items-center text-center z-10 w-1/4">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  step >= 1 
                    ? "bg-[#147a3f] border-[#147a3f] text-white shadow-md shadow-emerald-700/10" 
                    : "bg-white border-slate-300 text-slate-500"
                }`}
              >
                {step > 1 ? <Check size={14} /> : "1"}
              </div>
              <span className="text-xs font-bold mt-2 text-slate-800">Shipping</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Enter shipping details</span>
            </div>

            {/* Step 2: Payment */}
            <div className="flex flex-col items-center text-center z-10 w-1/4">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  step >= 2 
                    ? "bg-[#147a3f] border-[#147a3f] text-white shadow-md shadow-emerald-700/10" 
                    : "bg-white border-slate-300 text-slate-500"
                }`}
              >
                {step > 2 ? <Check size={14} /> : "2"}
              </div>
              <span className="text-xs font-bold mt-2 text-slate-800">Payment</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Select payment method</span>
            </div>

            {/* Step 3: Review */}
            <div className="flex flex-col items-center text-center z-10 w-1/4">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  step >= 3 
                    ? "bg-[#147a3f] border-[#147a3f] text-white shadow-md shadow-emerald-700/10" 
                    : "bg-white border-slate-300 text-slate-500"
                }`}
              >
                {step > 3 ? <Check size={14} /> : "3"}
              </div>
              <span className="text-xs font-bold mt-2 text-slate-800">Review</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Review your order</span>
            </div>

            {/* Step 4: Confirmation */}
            <div className="flex flex-col items-center text-center z-10 w-1/4">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  step >= 4 
                    ? "bg-[#147a3f] border-[#147a3f] text-white shadow-md shadow-emerald-700/10" 
                    : "bg-white border-slate-300 text-slate-500"
                }`}
              >
                {step > 4 ? <Check size={14} /> : "4"}
              </div>
              <span className="text-xs font-bold mt-2 text-slate-800">Confirmation</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Order placed</span>
            </div>
          </div>
        </div>

        {step === 4 ? (
          /* ── STEP 4: CONFIRMATION SUCCESS ── */
          <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#147a3f]">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">Order Placed Successfully!</h2>
              <p className="text-xs text-slate-400 font-medium">Thank you for shopping with NutraFYI. Your order has been placed and is being processed.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left divide-y divide-slate-200/60 text-xs font-semibold text-slate-600">
              <div className="py-2.5 flex justify-between">
                <span>Order Number:</span>
                <span className="text-slate-800 font-extrabold">{orderNumber}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-slate-800 font-extrabold">{shippingMethod === "express" ? "1-2 Business Days" : "3-5 Business Days"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Payment Mode:</span>
                <span className="text-slate-800 font-extrabold uppercase">{paymentMethod}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Ship To:</span>
                <span className="text-slate-800 font-extrabold">{fullName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => navigate(`/track-order?id=${orderNumber}`)}
                className="bg-[#147a3f] hover:bg-[#0f6630] text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-700/10 transition-all cursor-pointer"
              >
                Track Order
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* ── MAIN CHECKOUT LAYOUT ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Checkout Slides */}
            <div className="lg:col-span-8 space-y-6">
              
              {step === 1 && (
                /* ── STEP 1: SHIPPING ADDRESS & METHOD ── */
                <form onSubmit={handleContinueToPayment} className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Address Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h2 className="text-base font-extrabold text-slate-800">Shipping Address</h2>
                      <span className="text-xs text-slate-400 font-semibold">
                        Already have an account? <Link to="/login" className="text-[#147a3f] font-bold hover:underline">Log in</Link>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end text-left">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pincode *</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Enter pincode"
                            className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white pr-36 transition-all"
                          />
                          <button
                            type="button"
                            onClick={autoDetectLocation}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0f6630] hover:bg-[#147a3f] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <MapPin size={10} />
                            Auto Detect Location
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="House no., Building, Street, Area"
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          placeholder="Apartment, Landmark, etc."
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter city"
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">State *</label>
                        <select
                          required
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        >
                          <option value="">Select state</option>
                          {country === "India" ? (
                            <>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Uttar Pradesh">Uttar Pradesh</option>
                              <option value="West Bengal">West Bengal</option>
                            </>
                          ) : (
                            <>
                              <option value="California">California</option>
                              <option value="New York">New York</option>
                              <option value="Texas">Texas</option>
                              <option value="Florida">Florida</option>
                              <option value="Washington">Washington</option>
                              <option value="Ontario">Ontario</option>
                              <option value="British Columbia">British Columbia</option>
                              <option value="London">London</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Country *</label>
                        <select
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            setStateVal("");
                          }}
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#147a3f]/20 focus:border-[#147a3f] focus:bg-white transition-all"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 select-none cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 rounded focus:ring-[#147a3f]/20"
                      />
                      <span>Save this address for faster checkout</span>
                    </label>
                  </div>

                  {/* Shipping Method Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 text-left">Shipping Method</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option 1: Standard */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          shippingMethod === "standard" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="text-left flex items-center gap-2.5">
                            <Truck size={16} className="text-[#147a3f]" />
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800">Standard Shipping</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3-5 Business Days</p>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-[#147a3f]">FREE</span>
                      </label>

                      {/* Option 2: Express */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          shippingMethod === "express" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="text-left flex items-center gap-2.5">
                            <Truck size={16} className="text-[#147a3f]" />
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800">Express Shipping</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">1-2 Business Days</p>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{formatPrice(5.0)}</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0f6630] hover:bg-[#147a3f] text-white py-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/15 transition-all cursor-pointer"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}

              {step === 2 && (
                /* ── STEP 2: PAYMENT METHOD ── */
                <form onSubmit={handleContinueToReview} className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Address Summary Box */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-xs font-semibold text-slate-600 flex justify-between items-center text-left">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Ship To</span>
                      <p className="text-slate-800 font-bold">{fullName} • {phone}</p>
                      <p className="text-slate-500 font-normal">{addressLine1}, {city}, {stateVal} - {pincode}, {country}</p>
                      <p className="text-slate-500 font-normal mt-0.5">Method: {shippingMethod === "express" ? `Express Shipping (${formatPrice(5.0)})` : "Standard Shipping (FREE)"}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="text-[#147a3f] hover:underline flex items-center gap-1 font-bold cursor-pointer shrink-0"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Payment Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 text-left">Payment Method</h2>
                    
                    <div className="space-y-3">
                      {/* Option 1: UPI */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          paymentMethod === "upi" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="flex items-center gap-2">
                            <Smartphone size={16} className="text-slate-500" />
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-slate-800">UPI</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pay securely using any UPI app</p>
                            </div>
                          </div>
                        </div>
                        <UpiLogos />
                      </label>

                      {/* Option 2: Card */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          paymentMethod === "card" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-slate-500" />
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-slate-800">Credit / Debit Card</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Visa, Mastercard, RuPay & more</p>
                            </div>
                          </div>
                        </div>
                        <CardLogos />
                      </label>

                      {/* Option 3: NetBanking */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          paymentMethod === "netbanking" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "netbanking"}
                            onChange={() => setPaymentMethod("netbanking")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="flex items-center gap-2">
                            <Building size={16} className="text-slate-500" />
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-slate-800">Net Banking</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">All major banks supported</p>
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Option 4: COD */}
                      <label 
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          paymentMethod === "cod" ? "border-[#147a3f] bg-emerald-50/10" : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 focus:ring-[#147a3f]/20"
                          />
                          <div className="flex items-center gap-2">
                            <Building size={16} className="text-slate-500" />
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-slate-800">Cash on Delivery (COD)</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pay when you receive your order</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-left">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4.5 h-4.5 text-[#147a3f] border-slate-300 rounded focus:ring-[#147a3f]/20"
                        />
                        <span>I would like to receive order updates and exclusive offers via WhatsApp & Email</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-[120px] bg-white border border-slate-250 hover:bg-slate-50 text-slate-600 py-4 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#0f6630] hover:bg-[#147a3f] text-white py-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/15 transition-all cursor-pointer"
                    >
                      <span>Continue to Review Order</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                /* ── STEP 3: ORDER REVIEW ── */
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Address & Payment Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Shipping Address Summary */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-xs font-semibold text-slate-600 flex justify-between items-start text-left">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Shipping Details</span>
                        <p className="text-slate-800 font-bold">{fullName}</p>
                        <p className="text-slate-500 font-normal">{phone}</p>
                        <p className="text-slate-500 font-normal">{addressLine1}, {city}, {stateVal} - {pincode}</p>
                        <p className="text-slate-500 font-normal mt-1">Method: {shippingMethod === "express" ? `Express Shipping (${formatPrice(5.0)})` : "Standard Shipping (FREE)"}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setStep(1)} 
                        className="text-[#147a3f] hover:underline flex items-center gap-1 font-bold cursor-pointer shrink-0"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-xs font-semibold text-slate-600 flex justify-between items-start text-left">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Payment Method</span>
                        <p className="text-slate-800 font-bold uppercase">{paymentMethod}</p>
                        <p className="text-slate-500 font-normal mt-1">Secure Transaction Protocol</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setStep(2)} 
                        className="text-[#147a3f] hover:underline flex items-center gap-1 font-bold cursor-pointer shrink-0"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Review items list */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-left space-y-4">
                    <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Review Items ({cartCount})</h3>
                    <div className="divide-y divide-slate-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                          <img
                            src={item.image}
                            alt={item.name || item.title}
                            className="w-14 h-14 object-contain bg-slate-50 rounded-lg border border-slate-100 p-0.5 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.name || item.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Qty: {item.qty}</p>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 shrink-0">{symbol}{(getNumericPrice(item.price, item.currencyOverrides) * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-[120px] bg-white border border-slate-250 hover:bg-slate-50 text-slate-600 py-4 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-[#0f6630] hover:bg-[#147a3f] text-white py-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/15 transition-all cursor-pointer"
                    >
                      <span>Place Order & Pay</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Encryption Info */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider py-4">
                <Lock size={12} />
                <span>Your data is 100% secure and encrypted</span>
              </div>
            </div>

            {/* Right Column: Order Summary & Trust Badges */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Order Summary</h2>
                  <span className="text-xs font-bold text-[#147a3f]">{cartCount} Items in Cart</span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto pr-1">
                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                      Your cart is empty.
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="py-3.5 flex gap-3 first:pt-0 last:pb-0">
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="w-12 h-12 object-contain bg-slate-50 rounded-lg border border-slate-100 p-0.5 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=150&h=150&q=80";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.name || item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Qty: {item.qty}</p>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 shrink-0">{symbol}{(getNumericPrice(item.price, item.currencyOverrides) * item.qty).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-850 font-bold">{symbol}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-[#147a3f] font-extrabold" : "text-slate-850 font-bold"}>
                      {shippingCost === 0 ? "FREE" : `${symbol}${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-[#147a3f]">
                      <span>Discount ({appliedCoupon})</span>
                      <span className="font-extrabold">-${symbol}{discountVal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-slate-100 text-sm font-extrabold text-slate-800">
                    <span>Total (Inclusive of all taxes)</span>
                    <span className="text-lg font-extrabold text-slate-850">{symbol}{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Block */}
                <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-[#147a3f] transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-[#0f6630] hover:bg-[#147a3f] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-bold mt-1.5">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-[#147a3f] font-bold mt-1.5">{couponSuccess}</p>}
                </form>
              </div>

              {/* Secure Trust Info Block */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex gap-3">
                  <div className="text-[#147a3f] shrink-0"><ShieldCheck size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">Safe & Secure Checkout</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Your information is protected with 256-bit SSL encryption.</p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100/60 pt-3.5">
                  <div className="text-[#147a3f] shrink-0"><Award size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">100% Original Products</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sourced directly from trusted brands.</p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100/60 pt-3.5">
                  <div className="text-[#147a3f] shrink-0"><Truck size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">Free Shipping</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">On all orders above $50.</p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100/60 pt-3.5">
                  <div className="text-[#147a3f] shrink-0"><RotateCcw size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">Easy Returns</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Hassle-free returns within 7 days.</p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100/60 pt-3.5">
                  <div className="text-[#147a3f] shrink-0"><UserRound size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">Customer Support</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">We're here to help you: +91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Feature Trust Grid ── */}
      <div className="bg-[#f4f2e8] border-t border-slate-200 py-10 text-slate-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[#147a3f]"><Award size={24} /></div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">100% Natural</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Safe & Effective</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[#147a3f]"><ShieldCheck size={24} /></div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lab Tested</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Quality Assured</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[#147a3f]"><RotateCcw size={24} /></div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Artificial Ingredients</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Pure & Clean</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[#147a3f]"><UserRound size={24} /></div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Trusted by 50,000+</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Happy Customers</p>
          </div>
        </div>
      </div>

      {/* ── Custom Mockup Footer ── */}
      <footer className="bg-[#0b361c] text-white pt-12 pb-6 text-left border-t border-[#0e4825]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/">
              <img src={logo} alt="NutraFYI" className="h-10 invert brightness-200" />
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed max-w-xs">
              Supporting healthier living every day with clean, natural and effective wellness supplements.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all"><FacebookIcon /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all"><InstagramIcon /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all"><YoutubeIcon /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all"><LinkedinIcon /></a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Shop</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/products" className="hover:text-white transition-all">All Products</Link></li>
              <li><Link to="/products" className="hover:text-white transition-all">Daily Multivitamins</Link></li>
              <li><Link to="/products" className="hover:text-white transition-all">Immunity Support</Link></li>
              <li><Link to="/products" className="hover:text-white transition-all">Energy & Focus</Link></li>
              <li><Link to="/products" className="hover:text-white transition-all">View All Products</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Company</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/about" className="hover:text-white transition-all">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-all">Wellness Blog</Link></li>
              <li><Link to="/ingredients" className="hover:text-white transition-all">Our Ingredients</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-all">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-all">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Customer Support</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><a href="#" className="hover:text-white transition-all">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-all">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-all">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-all">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Subscribe Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Stay Updated</h4>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              Subscribe to get special offers, wellness tips & more.
            </p>
            <div className="flex border border-slate-700 bg-[#072412] rounded-xl overflow-hidden shadow-xs focus-within:border-emerald-500 transition-all">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 text-xs px-3 py-2 bg-transparent text-white focus:outline-hidden"
              />
              <button className="bg-[#0f6630] hover:bg-[#147a3f] text-white px-3.5 flex items-center justify-center transition-all cursor-pointer">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Payment Badges */}
        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-700/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 NutraFYI. All rights reserved.</p>
          <div className="flex gap-2">
            <div className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-750 font-bold select-none text-slate-300">VISA</div>
            <div className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-750 font-bold select-none text-slate-300">MASTERCARD</div>
            <div className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-750 font-bold select-none text-slate-300">RUPAY</div>
            <div className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-750 font-bold select-none text-slate-300">UPI</div>
            <div className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-750 font-bold select-none text-slate-300">PAYTM</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
