import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Edit2, Trash2, Tag } from "lucide-react";

export default function Coupons() {
  const queryClient = useQueryClient();

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");

  // Fetch Coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await API.get("/coupons");
      return res.data;
    },
  });

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await API.put(`/coupons/${editingId}`, payload);
      } else {
        return await API.post("/coupons", payload);
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Coupon updated" : "Coupon created");
      queryClient.invalidateQueries(["coupons"]);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      toast.success("Coupon deleted");
      queryClient.invalidateQueries(["coupons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setCode("");
    setDiscountType("Percentage");
    setDiscountAmount("");
    setStartDate("");
    setEndDate("");
    setUsageLimit("");
    setMinOrderAmount("");
    setMaxDiscount("");
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountAmount(c.discountAmount);
    if (c.startDate) setStartDate(c.startDate.split("T")[0]);
    if (c.endDate) setEndDate(c.endDate.split("T")[0]);
    setUsageLimit(c.usageLimit || "");
    setMinOrderAmount(c.minOrderAmount || "");
    setMaxDiscount(c.maxDiscount || "");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !discountAmount || !startDate || !endDate) {
      return toast.error("Please fill in all required fields");
    }

    saveMutation.mutate({
      code,
      discountType,
      discountAmount: parseFloat(discountAmount),
      startDate,
      endDate,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Coupons</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage store discount codes, caps, and activation schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coupon Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Coupon Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Value *
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="15"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Min Spend ($)
                </label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="50"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="100"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>

            {discountType === "Percentage" && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Max Discount ($)
                </label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="25"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                {editingId ? "Update" : "Add Coupon"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Coupons List Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">All Coupons</h3>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Discount</th>
                    <th className="pb-3">Range</th>
                    <th className="pb-3">Usage</th>
                    <th className="pb-3">Min Spend</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                  {coupons.length > 0 ? (
                    coupons.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 font-bold font-mono text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                            {c.code}
                          </div>
                        </td>
                        <td className="py-3.5 font-semibold">
                          {c.discountType === "Percentage" ? `${c.discountAmount}%` : `$${c.discountAmount}`}
                        </td>
                        <td className="py-3.5 text-xs text-slate-500">
                          {new Date(c.startDate).toLocaleDateString()} -{" "}
                          {new Date(c.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5">
                          {c.usageCount} / {c.usageLimit || "∞"}
                        </td>
                        <td className="py-3.5 font-semibold">${c.minOrderAmount || 0}</td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-indigo-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No coupons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
