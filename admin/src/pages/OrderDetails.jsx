import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { ArrowLeft, Printer, FileDown, Clock, ShieldAlert } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: async () => {
      const res = await API.get(`/orders/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const statusMutation = useMutation({
    mutationFn: async (payload) => {
      return await API.put(`/orders/${id}/status`, payload);
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries(["orderDetail", id]);
      setNote("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    statusMutation.mutate({ status, note });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loader size="lg" />;
  if (error) return <div className="text-rose-500">Failed to load order detail</div>;

  const billing = order.billingDetails || {};
  const shipping = order.shippingDetails || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto printable">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Order Details</h1>
            <p className="text-xs text-slate-400">Order ID: #{order.orderId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Order
          </button>
          <a
            href={`/api/orders/${order._id}/invoice`}
            download
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" /> Download Invoice
          </a>
        </div>
      </div>

      {/* Grid: Order content & Update Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items, Customer, Ship Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Summary & Items */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Ordered Items</h3>
            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-400 text-xs">
                      Product
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">{item.title}</span>
                      {item.variation && Object.keys(item.variation).length > 0 && (
                        <span className="text-[10px] text-indigo-500 font-medium block mt-0.5">
                          {Object.entries(item.variation)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">SKU: {item.sku || "N/A"}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <span className="font-semibold text-slate-800">${item.price.toFixed(2)}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-4 flex flex-col items-end gap-2 text-sm">
              <div className="flex justify-between w-64 text-slate-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-700">${order.amount.subtotal.toFixed(2)}</span>
              </div>
              {order.amount.discount > 0 && (
                <div className="flex justify-between w-64 text-rose-500">
                  <span>Discount:</span>
                  <span className="font-semibold">-${order.amount.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-slate-500">
                <span>Shipping:</span>
                <span className="font-semibold text-slate-700">${order.amount.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-slate-800 font-bold border-t border-slate-100 pt-2 text-base">
                <span>Total Amount:</span>
                <span>${order.amount.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Billing details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Shipping Details</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">{order.customer.name}</p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.state} - {shipping.zip}
                </p>
                <p>{shipping.country}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Billing Details</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">{order.customer.name}</p>
                <p>{billing.address}</p>
                <p>
                  {billing.city}, {billing.state} - {billing.zip}
                </p>
                <p>{billing.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update status, Payment details, status logs */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4 no-print">
            <h3 className="text-sm font-bold text-slate-700">Update Order Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3.5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Include a status update note..."
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={statusMutation.isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                Save Status Changes
              </button>
            </form>
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Payment details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-semibold text-slate-700">{order.paymentDetails?.method || "COD"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-xs">{order.paymentDetails?.transactionId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span
                  className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                    order.paymentDetails?.status === "Paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {order.paymentDetails?.status || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Status History Logs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Order History Log
            </h3>
            <div className="space-y-4 max-h-[16rem] overflow-y-auto pr-2">
              {(order.statusHistory || []).map((history, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-normal relative">
                  {idx < order.statusHistory.length - 1 && (
                    <div className="absolute left-[9px] top-6 w-0.5 h-full bg-slate-100" />
                  )}
                  <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{history.status}</p>
                    <p className="text-slate-500 mt-0.5">{history.note}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(history.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
