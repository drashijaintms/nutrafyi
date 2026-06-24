import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Edit3, History, AlertTriangle, ArrowUpRight } from "lucide-react";
import { resolveProductImage } from "../utils/resolveImage";

export default function Inventory() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("alerts");

  // Manual Adjust Modal state
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [quantityChange, setQuantityChange] = useState("");
  const [note, setNote] = useState("");

  const [logsPage, setLogsPage] = useState(1);

  // Fetch Inventory Status (low stock & out of stock)
  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["inventoryStatus"],
    queryFn: async () => {
      const res = await API.get("/inventory/status");
      return res.data;
    },
  });

  // Fetch Inventory Logs
  const { data: logsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["inventoryLogs", logsPage],
    queryFn: async () => {
      const res = await API.get("/inventory/logs", {
        params: { page: logsPage, limit: 15 },
      });
      return res.data;
    },
    enabled: activeTab === "logs",
  });

  // Stock Adjustment Mutation
  const adjustMutation = useMutation({
    mutationFn: async (payload) => {
      return await API.post("/inventory/adjust", payload);
    },
    onSuccess: () => {
      toast.success("Stock level updated successfully");
      queryClient.invalidateQueries(["inventoryStatus"]);
      queryClient.invalidateQueries(["inventoryLogs"]);
      queryClient.invalidateQueries(["products"]);
      setAdjustingProduct(null);
      setQuantityChange("");
      setNote("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to adjust stock");
    },
  });

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!quantityChange) return toast.error("Enter stock change amount");

    adjustMutation.mutate({
      productId: adjustingProduct._id,
      quantityChange: parseInt(quantityChange),
      note,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Audit real-time stock levels, low-stock warnings, and historical logs.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "alerts"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Stock Alerts
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "logs"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <History className="w-4 h-4" /> Adjustment Ledger
        </button>
      </div>

      {/* Alerts View */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {isLoadingStatus ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Out of Stock Card */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 overflow-hidden">
                <h3 className="text-sm font-bold text-rose-600 flex items-center gap-1.5 mb-4">
                  <span>●</span> Out Of Stock Products ({statusData?.outOfStock?.length || 0})
                </h3>
                <div className="overflow-y-auto max-h-[30rem] pr-2 space-y-3.5">
                  {statusData?.outOfStock?.length > 0 ? (
                    statusData.outOfStock.map((prod) => (
                      <div key={prod._id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProductImage(prod.image, prod.slug) || "https://placehold.co/40x40?text=Prod"}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{prod.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku || "N/A"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAdjustingProduct(prod)}
                          className="bg-indigo-50 text-indigo-600 font-semibold text-[10px] px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Adjust Stock
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 py-6 text-center">No products out of stock.</p>
                  )}
                </div>
              </div>

              {/* Low Stock Card */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 overflow-hidden">
                <h3 className="text-sm font-bold text-amber-600 flex items-center gap-1.5 mb-4">
                  <span>●</span> Low Stock Warnings ({statusData?.lowStock?.length || 0})
                </h3>
                <div className="overflow-y-auto max-h-[30rem] pr-2 space-y-3.5">
                  {statusData?.lowStock?.length > 0 ? (
                    statusData.lowStock.map((prod) => (
                      <div key={prod._id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProductImage(prod.image, prod.slug) || "https://placehold.co/40x40?text=Prod"}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{prod.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Current Stock: <strong className="text-slate-800">{prod.stockQuantity}</strong> (Low: {prod.lowStockThreshold})
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAdjustingProduct(prod)}
                          className="bg-indigo-50 text-indigo-600 font-semibold text-[10px] px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Adjust Stock
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 py-6 text-center">No products running low.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logs View */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Inventory adjustment ledger</h3>
          {isLoadingLogs ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Change</th>
                      <th className="pb-3">Balance</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Auditor</th>
                      <th className="pb-3">Note</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                    {logsData?.logs?.length > 0 ? (
                      logsData.logs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-semibold text-slate-800">
                            {log.product?.title || "Deleted Product"}
                          </td>
                          <td className="py-3 font-mono text-xs">{log.product?.sku || "N/A"}</td>
                          <td className="py-3">
                            <span
                              className={`font-semibold ${
                                log.quantityChange > 0 ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                            </span>
                          </td>
                          <td className="py-3 font-bold">{log.remainingStock}</td>
                          <td className="py-3 text-xs">{log.type}</td>
                          <td className="py-3 text-xs">{log.adminRef?.name || "System"}</td>
                          <td className="py-3 text-xs text-slate-400 italic">"{log.note || "—"}"</td>
                          <td className="py-3 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No logs recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {logsData?.logs?.length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    Page {logsData.page} of {logsData.pages}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                      disabled={logsPage <= 1}
                      className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-xs font-semibold"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setLogsPage((p) => Math.min(logsData.pages, p + 1))}
                      disabled={logsPage >= logsData.pages}
                      className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-xs font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <Modal
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          title={`Adjust Inventory: ${adjustingProduct.title}`}
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Adjustment quantity (e.g. +10, -5) *
                </label>
                <input
                  type="number"
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  required
                />
              </div>
              <div className="text-xs text-slate-400 flex flex-col justify-center">
                <p>Use positive integers to RESTOCK inventory.</p>
                <p className="mt-1">Use negative values to REDUCE inventory count.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Adjustment Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Include a note (e.g. restocked from supplier, damage control)"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2 px-4 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adjustMutation.isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-all"
              >
                Apply Correction
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
