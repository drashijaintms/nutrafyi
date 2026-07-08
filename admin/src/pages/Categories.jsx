import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Folder, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { resolveCategoryImage } from "../utils/resolveImage";

export default function Categories() {
  const queryClient = useQueryClient();
  const admin = useSelector((state) => state.auth.user);
  const isVendor = admin?.role === "vendor";
  const isSuperAdmin = admin?.role === "superadmin" || admin?.role === "Administrator";

  const isRestrictedBlogManager =
    admin &&
    admin.role !== "superadmin" &&
    admin.permissions?.blogs === true &&
    admin.permissions?.products !== true &&
    admin.permissions?.orders !== true;

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  // Fetch Categories — vendors use /admin/all to see only their own
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", isVendor ? "vendor" : "all"],
    queryFn: async () => {
      const endpoint = isVendor ? "/categories/admin/all" : "/categories";
      const res = await API.get(endpoint);
      return res.data;
    },
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(res.data.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await API.put(`/categories/${editingId}`, payload);
      } else {
        return await API.post("/categories", payload);
      }
    },
    onSuccess: (res) => {
      const status = res?.data?.approvalStatus;
      if (status === "pending") {
        toast.success("Category submitted for approval! It will go live once the super admin approves it.", { duration: 5000 });
      } else {
        toast.success(editingId ? "Category updated" : "Category created");
      }
      queryClient.invalidateQueries(["categories"]);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete category");
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setParentCategory("");
    setImage("");
    setDescription("");
    setOrder(0);
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setTitle(cat.title);
    setSlug(cat.slug);
    setParentCategory(cat.parentCategory || "");
    setImage(cat.image || "");
    setDescription(cat.description || "");
    setOrder(cat.order || 0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return toast.error("Name is required");

    saveMutation.mutate({
      title,
      slug: slug || undefined,
      parentCategory: parentCategory || null,
      image,
      description,
      order: parseInt(order) || 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {isVendor ? "Your category submissions. New categories require super admin approval before going live." : "Manage store product categories, nested hierarchies, and display orders."}
        </p>
      </div>

      {/* Vendor info banner */}
      {isVendor && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Vendor Submission Workflow</p>
            <p className="text-xs text-amber-700 mt-0.5">Categories you create will be sent to the platform owner for review. They appear on the storefront only after approval.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Category Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vitamins"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Slug (Optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. vitamins"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Parent Category
              </label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              >
                <option value="">None</option>
                {categories
                  .filter((cat) => cat._id !== editingId)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
              </select>
            </div>

             <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Category Image
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/images/cat.jpg"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
                <label className="shrink-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer border border-indigo-100 transition-all">
                  {uploadingImage ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {image && (
                <div className="mt-3 relative w-20 h-20 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center p-1 group">
                  <img src={resolveCategoryImage(image, slug)} alt="Category Preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {!isRestrictedBlogManager && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Category details..."
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                {editingId ? "Update" : "Add Category"}
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

        {/* Categories List Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">All Categories</h3>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Image</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Slug</th>
                    {!isRestrictedBlogManager && <th className="pb-3">Products</th>}
                    {!isRestrictedBlogManager && <th className="pb-3">Order</th>}
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                  {categories.length > 0 ? (
                    categories.map((cat) => {
                      const isSub = !!cat.parentCategory;
                      return (
                        <tr key={cat._id} className="hover:bg-slate-50/50">
                          <td className="py-3.5">
                            <img
                              src={resolveCategoryImage(cat.image, cat.slug) || "https://placehold.co/40x40?text=Cat"}
                              alt={cat.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50"
                            />
                          </td>
                          <td className="py-3.5 font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              {isSub && <span className="text-slate-400 font-normal">↳</span>}
                              <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                              {cat.title}
                            </div>
                          </td>
                          <td className="py-3.5 font-mono text-xs">{cat.slug}</td>
                          {!isRestrictedBlogManager && <td className="py-3.5 font-semibold">{cat.count || 0}</td>}
                          {!isRestrictedBlogManager && <td className="py-3.5">{cat.order || 0}</td>}
                          {/* Approval status badge */}
                          <td className="py-3.5">
                            {cat.approvalStatus === "pending" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                                <Clock className="w-2.5 h-2.5" /> Pending
                              </span>
                            )}
                            {cat.approvalStatus === "approved" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                              </span>
                            )}
                            {cat.approvalStatus === "rejected" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                                <XCircle className="w-2.5 h-2.5" /> Rejected
                              </span>
                            )}
                            {!cat.approvalStatus && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(cat)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-indigo-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cat._id)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={isRestrictedBlogManager ? 4 : 6} className="py-8 text-center text-slate-400">
                        No categories found.
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
