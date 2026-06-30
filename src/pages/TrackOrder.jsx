import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BreadcrumbBar from "../components/BreadcrumbBar";
import { Search, Package, CheckCircle2, Truck, Check, HelpCircle } from "lucide-react";
import { productImages } from "../data/productImages";

const resolveProductImage = (img, slug) => {
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/"))) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

const STATUS_STEPS = [
  { status: "Pending", label: "Pending Review", desc: "We received your order and are verifying details.", icon: HelpCircle },
  { status: "Confirmed", label: "Confirmed", desc: "Your payment is approved and items are being packed.", icon: CheckCircle2 },
  { status: "Shipped", label: "Shipped", desc: "Your package is on its way. Carrier tracking is active.", icon: Truck },
  { status: "Delivered", label: "Delivered", desc: "The package has been delivered to your shipping address.", icon: Package },
];

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryId);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTracking = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/track/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to find order");
      }
      setOrderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setOrderIdInput(queryId);
      fetchTracking(queryId);
    }
  }, [queryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchParams({ id: orderIdInput.trim() });
    fetchTracking(orderIdInput.trim());
  };

  // Helper to determine step completion index
  const getStepIndex = (currentStatus) => {
    const normalized = currentStatus ? currentStatus.toLowerCase() : "";
    if (["pending", "processing"].includes(normalized)) return 0;
    if (["confirmed"].includes(normalized)) return 1;
    if (["shipped"].includes(normalized)) return 2;
    if (["delivered"].includes(normalized)) return 3;
    return -1; // e.g. cancelled/refunded
  };

  const activeStepIdx = orderData ? getStepIndex(orderData.status) : -1;

  return (
    <div className="bg-[#fcfbf7] min-h-screen flex flex-col justify-between">
      <div>
        <BreadcrumbBar title="Track Order" />

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Tracking Search Input Bar */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-xs text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Track Your Shipment</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Enter your unique Order ID (e.g. ORD-123456) provided in your checkout confirmation or invoice.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Order ID (e.g. ORD-982736)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm font-semibold uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#147a3f] hover:bg-[#0f6630] disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Search className="w-4 h-4" /> Locate
              </button>
            </form>
          </div>

          {loading && (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">
              Locating your order shipment...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-650 rounded-2xl p-6 text-center shadow-3xs max-w-lg mx-auto">
              <span className="text-lg font-bold text-red-750 block mb-1">Lookup Failed</span>
              <p className="text-xs text-red-500">{error}. Please double check the ID and try again.</p>
            </div>
          )}

          {orderData && (
            <div className="space-y-6">
              {/* Order Meta Info Card */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking ID</span>
                  <h3 className="font-extrabold text-slate-800 text-base">#{orderData.orderId}</h3>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Placed</span>
                  <p className="text-xs font-semibold text-slate-600">{new Date(orderData.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value</span>
                  <p className="text-sm font-bold text-[#147a3f]">{orderData.currencySymbol || "$"}{orderData.amount.total.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Payment</span>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                    COD / Verified
                  </span>
                </div>
              </div>

              {/* Steps Progress Tracker */}
              {activeStepIdx === -1 ? (
                // Cancelled or Refunded
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-center text-rose-700">
                  <h4 className="font-bold text-base mb-1">Order Status: {orderData.status}</h4>
                  <p className="text-xs">This shipment has been cancelled or refunded. Contact support for details.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
                  <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wide">Shipment Journey</h3>

                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                    {/* Background Progress Bar for Desktop */}
                    <div className="absolute left-[20px] top-[24px] bottom-[24px] md:bottom-auto md:left-[5%] md:right-[5%] md:top-[20px] w-0.5 md:w-[90%] h-[80%] md:h-0.5 bg-slate-100 z-0" />
                    
                    {/* Active Progress Filler for Desktop */}
                    {activeStepIdx > 0 && (
                      <div
                        className="absolute left-[20px] top-[24px] bottom-auto md:bottom-auto md:left-[5%] md:top-[20px] w-0.5 md:h-0.5 bg-[#147a3f] z-0 transition-all duration-500"
                        style={{
                          height: window.innerWidth < 768 ? `${(activeStepIdx / 3) * 80}%` : 'auto',
                          width: window.innerWidth >= 768 ? `${(activeStepIdx / 3) * 90}%` : 'auto'
                        }}
                      />
                    )}

                    {STATUS_STEPS.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isCompleted = idx <= activeStepIdx;
                      const isCurrent = idx === activeStepIdx;

                      return (
                        <div key={idx} className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-2 flex-1 w-full">
                          {/* Step Icon Badge */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isCompleted
                              ? "bg-[#147a3f] border-[#147a3f] text-white shadow-md shadow-[#147a3f]/20"
                              : "bg-white border-slate-200 text-slate-350"
                          }`}>
                            {isCompleted && idx < activeStepIdx ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <StepIcon className="w-5 h-5" />
                            )}
                          </div>

                          {/* Step Details labels */}
                          <div className="text-left md:text-center">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${
                              isCurrent
                                ? "text-[#147a3f]"
                                : isCompleted
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}>
                              {step.label}
                            </h4>
                            <p className="text-[10px] text-slate-400 max-w-xs mt-0.5 leading-relaxed hidden md:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items Summary */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wide border-b border-slate-100 pb-3">Package Items</h3>
                <div className="divide-y divide-slate-50">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {resolveProductImage(item.image, item.slug) && (
                          <img
                            src={resolveProductImage(item.image, item.slug)}
                            alt=""
                            className="w-12 h-12 object-contain rounded-lg border border-slate-100 p-0.5 bg-white shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                          <span className="text-[10px] text-slate-450 mt-0.5 block">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-750 text-sm">{orderData.currencySymbol || "$"}{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
