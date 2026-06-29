import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { RotateCcw, Trash2, Search, FileText, Folder, ShoppingBag, FileCode } from "lucide-react";
import { useSelector } from "react-redux";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function TrashBin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("blogs");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "superadmin";

  const isRestrictedBlogManager =
    currentUser &&
    (currentUser.role === "blogadmin" ||
     currentUser.role === "Editor" ||
     currentUser.role === "Blog Editor" ||
     (currentUser.permissions?.blogs === true &&
      currentUser.permissions?.products !== true &&
      currentUser.permissions?.orders !== true));

  const tabs = isRestrictedBlogManager
    ? [{ id: "blogs", label: "Blogs", type: "blog", icon: FileText }]
    : [
        { id: "blogs", label: "Blogs", type: "blog", icon: FileText },
        { id: "pages", label: "Pages", type: "page", icon: FileCode },
        { id: "categories", label: "Categories", type: "category", icon: Folder },
        { id: "products", label: "Products", type: "product", icon: ShoppingBag }
      ];

  // Fetch deleted items
  const { data: trash = {}, isLoading, refetch } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await API.get("/trash");
      return res.data;
    }
  });

  // Restore Mutation
  const restoreMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      return await API.put(`/trash/restore/${type}/${id}`);
    },
    onSuccess: (data, variables) => {
      toast.success("Item restored successfully");
      queryClient.invalidateQueries(["trash"]);
      // Invalidate target query types to refresh active lists
      queryClient.invalidateQueries([variables.type === "blog" ? "cmsBlogs" : variables.type === "page" ? "cmsPages" : variables.type === "category" ? "categories" : "products"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to restore item");
    }
  });

  // Permanent Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      return await API.delete(`/trash/permanent/${type}/${id}`);
    },
    onSuccess: () => {
      toast.success("Item permanently deleted");
      queryClient.invalidateQueries(["trash"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to permanently delete item");
    }
  });

  const handleRestore = (type, id) => {
    if (!isSuperAdmin) {
      return toast.error("Only superadmin accounts can restore items from the Trash Bin.");
    }
    restoreMutation.mutate({ type, id });
  };

  const handlePermanentDelete = (type, id, title) => {
    if (!isSuperAdmin) {
      return toast.error("Only superadmin accounts can permanently delete items.");
    }
    if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate({ type, id });
    }
  };

  // Get active tab list
  const activeItems = trash[activeTab] || [];

  // Filter list locally by search query
  const filteredItems = activeItems.filter(item => {
    const title = item.title || item.name || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || FileText;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trash Bin</h1>
        <p className="text-sm text-slate-400 mt-1">Review soft-deleted posts, categories, and products. Restore them or erase permanently.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200/80 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = trash[tab.id]?.length || 0;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative cursor-pointer ${
                activeTab === tab.id
                  ? "text-indigo-650 border-b-2 border-indigo-650"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {tab.label}
              {count > 0 && (
                <span className="bg-orange-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 h-5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search deleted ${activeTab}...`}
            className="w-full text-sm pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {isLoading ? (
          <Loader size="lg" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                  <th className="px-6 py-4">Title / Name</th>
                  <th className="px-6 py-4">Deleted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const title = item.title || item.name || "Unnamed Item";
                    const itemType = tabs.find(t => t.id === activeTab)?.type;
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/30">
                        {/* Title & Icon */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ActiveIcon className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                            <span className="font-bold text-slate-800">{title}</span>
                          </div>
                        </td>

                        {/* Deleted At Date */}
                        <td className="px-6 py-4 text-slate-500 font-semibold">
                          {formatDate(item.deletedAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleRestore(itemType, item._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-150 text-indigo-650 hover:bg-indigo-50 transition-colors text-xs font-bold cursor-pointer"
                              title="Restore Item"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restore
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(itemType, item._id, title)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-150 text-rose-650 hover:bg-rose-50 transition-colors text-xs font-bold cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                      No deleted {activeTab} found in the Trash Bin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
