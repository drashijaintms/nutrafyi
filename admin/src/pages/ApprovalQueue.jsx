import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FolderTree,
  User,
  CalendarDays,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Tag,
} from "lucide-react";

// Status badge helper
function ApprovalBadge({ status }) {
  const map = {
    pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-200",  dot: "bg-amber-400" },
    approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-400" },
    rejected: { label: "Rejected", bg: "bg-rose-50",    text: "text-rose-600",   border: "border-rose-200",   dot: "bg-rose-400" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// Reject modal
function RejectModal({ item, type, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Reject {type === "product" ? "Product" : "Category"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">"{item?.title}"</p>
          </div>
        </div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rejection Reason (optional)</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Tell the vendor why this was rejected..."
          className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// Single item card
function ApprovalCard({ item, type, onApprove, onReject, isApproving, isRejecting }) {
  const [expanded, setExpanded] = useState(false);
  const submittedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Type icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              type === "product" ? "bg-indigo-50" : type === "category" ? "bg-violet-50" : "bg-amber-50"
            }`}>
              {type === "product" ? (
                <Package className="w-5 h-5 text-indigo-500" />
              ) : type === "category" ? (
                <FolderTree className="w-5 h-5 text-violet-500" />
              ) : (
                <Tag className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="font-bold text-slate-800 text-sm truncate">{item.name || item.title}</h3>
                <ApprovalBadge status={item.approvalStatus} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {item.submittedBy && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.submittedBy.name} ({item.submittedBy.email})
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {submittedDate}
                </span>
                {type === "product" && item.sku && (
                  <span className="font-mono">SKU: {item.sku}</span>
                )}
              </div>
              {item.approvalNote && item.approvalStatus === "rejected" && (
                <div className="mt-2 px-2.5 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600">
                  <strong>Rejection note:</strong> {item.approvalNote}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {item.approvalStatus === "pending" && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onApprove(item._id)}
                disabled={isApproving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => onReject(item)}
                disabled={isRejecting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>

        {/* Expandable description */}
        {(item.description || item.shortDescription) && (
          <div className="mt-3 border-t border-slate-50 pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Hide details" : "Show details"}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-4">
                {item.shortDescription || item.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApprovalQueue() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [rejectModal, setRejectModal] = useState(null); // { item, type }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["approvals", statusFilter],
    queryFn: async () => {
      const res = await API.get("/approvals", { params: { status: statusFilter } });
      return res.data;
    },
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, type }) => {
      const endpoint = type === "product" 
        ? `/approvals/products/${id}/approve` 
        : type === "category"
          ? `/approvals/categories/${id}/approve`
          : `/approvals/brands/${id}/approve`;
      await API.post(endpoint);
    },
    onSuccess: () => {
      toast.success("Approved successfully! Item is now live on the storefront.");
      queryClient.invalidateQueries(["approvals"]);
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["brands"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, type, note }) => {
      const endpoint = type === "product" 
        ? `/approvals/products/${id}/reject` 
        : type === "category"
          ? `/approvals/categories/${id}/reject`
          : `/approvals/brands/${id}/reject`;
      await API.post(endpoint, { note });
    },
    onSuccess: () => {
      toast.success("Item rejected. The vendor will see the reason.");
      queryClient.invalidateQueries(["approvals"]);
      setRejectModal(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to reject"),
  });

  const products = data?.products || [];
  const categories = data?.categories || [];
  const brands = data?.brands || [];
  const pendingProducts = data?.pendingProductsCount || 0;
  const pendingCategories = data?.pendingCategoriesCount || 0;
  const pendingBrands = data?.pendingBrandsCount || 0;
  const totalPending = data?.pendingCount || 0;

  const displayItems = activeTab === "all"
    ? [
        ...products.map(p => ({ ...p, _type: "product" })),
        ...categories.map(c => ({ ...c, _type: "category" })),
        ...brands.map(b => ({ ...b, _type: "brand" }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : activeTab === "products"
      ? products.map(p => ({ ...p, _type: "product" }))
      : activeTab === "categories"
        ? categories.map(c => ({ ...c, _type: "category" }))
        : brands.map(b => ({ ...b, _type: "brand" }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ClipboardCheck className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Approval Queue</h1>
            {totalPending > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalPending} pending
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Review vendor submissions before they go live on the storefront.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Total Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalPending}</p>
          <p className="text-xs text-slate-400 mt-0.5">Awaiting your review</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Products</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{pendingProducts}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending product submissions</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Categories</span>
            <FolderTree className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{pendingCategories}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending category submissions</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Brands</span>
            <Tag className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{pendingBrands}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending brand submissions</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 border-b border-slate-100 pb-0">
          <div className="flex gap-1">
            {[
              { id: "all", label: `All (${products.length + categories.length + brands.length})` },
              { id: "products", label: `Products (${products.length})` },
              { id: "categories", label: `Categories (${categories.length})` },
              { id: "brands", label: `Brands (${brands.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pb-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full mr-3" />
              Loading submissions...
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600">No {statusFilter} submissions</p>
              <p className="text-sm text-slate-400 mt-1">
                {statusFilter === "pending" ? "All caught up! No vendor submissions awaiting approval." : `No ${statusFilter} items found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayItems.map(item => (
                <ApprovalCard
                  key={item._id}
                  item={item}
                  type={item._type}
                  onApprove={(id) => approveMutation.mutate({ id, type: item._type })}
                  onReject={(item) => setRejectModal({ item, type: item._type })}
                  isApproving={approveMutation.isPending}
                  isRejecting={rejectMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <RejectModal
          item={rejectModal.item}
          type={rejectModal.type}
          onClose={() => setRejectModal(null)}
          onConfirm={(note) => rejectMutation.mutate({ id: rejectModal.item._id, type: rejectModal.type, note })}
        />
      )}
    </div>
  );
}
