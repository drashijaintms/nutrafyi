import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import API from "../services/api";
import DataTable from "../components/DataTable";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { resolveProductImage } from "../utils/resolveImage";

export default function Products() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);
  const isVendor = admin?.role === "vendor";

  // Filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [page, setPage] = useState(1);


  // Fetch Categories list for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["filterCategories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
  });

  // Fetch Products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", search, category, status, stockStatus, approvalStatus, page],
    queryFn: async () => {
      const res = await API.get("/products/admin/all", {
        params: { search, category, status, stockStatus, approvalStatus, page, limit: 10 },
      });
      return res.data;
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete product");
    },
  });

  // Bulk actions mutation
  const bulkMutation = useMutation({
    mutationFn: async ({ action, ids, value }) => {
      await API.post("/products/bulk", { action, ids, value });
    },
    onSuccess: () => {
      toast.success("Bulk action completed successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to execute bulk action");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkAction = (action, ids) => {
    if (action === "delete") {
      if (window.confirm(`Delete ${ids.length} products?`)) {
        bulkMutation.mutate({ action, ids });
      }
    } else if (action === "publish") {
      bulkMutation.mutate({ action, ids, value: "Published" });
    } else if (action === "draft") {
      bulkMutation.mutate({ action, ids, value: "Draft" });
    }
  };

  const columns = [
    {
      header: "Image",
      render: (row) => (
        <img
          src={resolveProductImage(row.image, row.slug) || "https://placehold.co/60x60?text=Product"}
          alt={row.title}
          className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50"
        />
      ),
    },
    {
      header: "Product Name",
      render: (row) => (
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-800 text-sm">{row.title}</span>
            {row.isBestSeller && (
              <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded-md border border-amber-100 uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {row.salePrice && (
              <span className="text-[9px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded-md border border-rose-100 uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>
          <span className="block text-[10px] text-slate-400 mt-0.5">Slug: {row.slug}</span>
        </div>
      ),
    },
    {
      header: "SKU",
      accessor: "sku",
      render: (row) => <span className="font-mono text-xs">{row.sku || "N/A"}</span>,
    },
    {
      header: "Category",
      accessor: "categoryName",
      render: (row) => <span className="text-slate-500 font-medium">{row.categoryName || row.category || "N/A"}</span>,
    },    {
      header: "Price",
      render: (row) => {
        // Strip any currency symbols ($ £ ₹ etc.) before parsing
        const cleanNum = (val) => parseFloat(String(val || "0").replace(/[^\d.]/g, "")) || 0;
        const displayPrice = row.regularPrice || row.price;
        const mainPrice = cleanNum(displayPrice);
        const saleNum = cleanNum(row.salePrice);
        const hasSale = row.salePrice && saleNum > 0 && saleNum !== mainPrice;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">
              ${hasSale ? saleNum.toFixed(2) : mainPrice.toFixed(2)}
            </span>
            {hasSale && (
              <span className="text-xs text-slate-400 line-through">
                ${mainPrice.toFixed(2)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Stock",
      render: (row) => {
        const qty = row.stockQuantity;
        const low = row.lowStockThreshold || 5;

        let pillColor = "bg-emerald-50 text-emerald-600";
        if (qty === 0) pillColor = "bg-rose-50 text-rose-600";
        else if (qty <= low) pillColor = "bg-amber-50 text-amber-600";

        return (
          <div className="flex flex-col">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-block w-fit ${pillColor}`}>
              {qty === 0 ? "Out of Stock" : qty <= low ? "Low Stock" : "In Stock"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 pl-1">Qty: {qty}</span>
          </div>
        );
      },
    },
    {
      header: "Status",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border ${
              row.status === "Published"
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : row.status === "Draft"
                ? "bg-slate-50 text-slate-500 border-slate-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {row.status || "Published"}
          </span>
          {/* Approval status badge */}
          {row.approvalStatus && row.approvalStatus !== "approved" && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border flex items-center gap-1 ${
              row.approvalStatus === "pending"
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
              {row.approvalStatus === "pending" ? <Clock className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
              {row.approvalStatus === "pending" ? "Pending Approval" : "Rejected"}
            </span>
          )}
          {row.approvalStatus === "approved" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Approved
            </span>
          )}
        </div>
      ),
    },


    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/products/edit/${row._id}`}
            className="p-1.5 rounded-lg border border-slate-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg border border-slate-100 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const bulkActions = [
    { label: "Change to Published", value: "publish" },
    { label: "Change to Draft", value: "draft" },
    { label: "Delete Selected", value: "delete" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Products</h1>
          <p className="text-sm text-slate-400 mt-1">
            {isVendor ? "Your product submissions. New products require super admin approval before going live." : "Manage catalog details, pricing rules, and stock settings."}
          </p>
        </div>
        <Link
          to="/products/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 transition-all flex items-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" /> {isVendor ? "Submit Product" : "Add Product"}
        </Link>
      </div>

      {/* Vendor info banner */}
      {isVendor && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Vendor Submission Workflow</p>
            <p className="text-xs text-amber-700 mt-0.5">Products you add here will be submitted to the platform owner (Super Admin) for review. They will go live on the storefront only after approval. Rejected products can be edited and resubmitted.</p>
          </div>
        </div>
      )}

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={productsData?.products || []}
        loading={isLoading}
        pagination={{
          page: productsData?.page || 1,
          pages: productsData?.pages || 1,
          onPageChange: (newPage) => setPage(newPage),
        }}
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search products by name or SKU...",
        }}
        filters={[
          {
            label: "All Categories",
            accessor: "category",
            value: category,
            onChange: (val) => {
              setCategory(val);
              setPage(1);
            },
            options: categories.map((cat) => ({ label: cat.title, value: cat.slug })),
          },
          {
            label: "All Statuses",
            accessor: "status",
            value: status,
            onChange: (val) => {
              setStatus(val);
              setPage(1);
            },
            options: [
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ],
          },
          {
            label: "All Stock Levels",
            accessor: "stockStatus",
            value: stockStatus,
            onChange: (val) => {
              setStockStatus(val);
              setPage(1);
            },
            options: [
              { label: "In Stock", value: "In Stock" },
              { label: "Out of Stock", value: "Out of Stock" },
              { label: "On Backorder", value: "On Backorder" },
            ],
          },
          {
            label: "All Approval States",
            accessor: "approvalStatus",
            value: approvalStatus,
            onChange: (val) => {
              setApprovalStatus(val);
              setPage(1);
            },
            options: [
              { label: "Approved", value: "approved" },
              { label: "Pending Approval", value: "pending" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
      />
    </div>
  );
}
