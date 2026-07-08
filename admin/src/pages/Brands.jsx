import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Tag, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function Brands() {
  const queryClient = useQueryClient();
  const admin = useSelector((state) => state.auth.user);
  const isVendor = admin?.role === "vendor";

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");

  // Fetch Brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["brands", isVendor ? "vendor" : "all"],
    queryFn: async () => {
      const res = await API.get("/brands/admin/all");
      return res.data;
    },
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingLogo(true);
    const toastId = toast.loading("Uploading logo...");

    try {
      const res = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLogo(res.data.url);
      toast.success("Logo uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload logo", { id: toastId });
    } finally {
      setUploadingLogo(false);
    }
  };

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await API.put(`/brands/${editingId}`, payload);
      } else {
        return await API.post("/brands", payload);
      }
    },
    onSuccess: (res) => {
      const status = res?.data?.approvalStatus;
      if (status === "pending") {
        toast.success("Brand submitted for approval! It will go live once the super admin approves it.", { duration: 5000 });
      } else {
        toast.success(editingId ? "Brand updated" : "Brand created");
      }
      queryClient.invalidateQueries(["brands"]);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/brands/${id}`);
    },
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries(["brands"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete brand");
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setLogo("");
    setDescription("");
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    setSlug(brand.slug);
    setLogo(brand.logo || "");
    setDescription(brand.description || "");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required");

    saveMutation.mutate({
      name,
      slug: slug || undefined,
      logo,
      description,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Brands</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {isVendor ? "Your brand submissions. New brands require super admin approval before going live." : "Manage store brand profiles, slugs, and logos."}
        </p>
      </div>

      {/* Vendor info banner */}
      {isVendor && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Vendor Submission Workflow</p>
            <p className="text-xs text-amber-700 mt-0.5">Brands you create will be sent to the platform owner for review. They appear on the storefront only after approval.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {isVendor ? "Add New Brand" : (editingId ? "Edit Brand" : "Add New Brand")}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Brand Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Optimum Nutrition"
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
                placeholder="e.g. optimum-nutrition"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

             <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Brand Logo
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/images/logo.png"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
                <label className="shrink-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer border border-indigo-100 transition-all">
                  {uploadingLogo ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
              </div>
              {logo && (
                <div className="mt-3 relative w-20 h-20 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center p-1 group">
                  <img src={logo} alt="Brand Logo Preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brand story or details..."
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                {editingId ? "Update" : "Add Brand"}
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

        {/* Brands List Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">All Brands</h3>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Logo</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Slug</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Status</th>
                    {!isVendor && <th className="pb-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                  {brands.length > 0 ? (
                    brands.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5">
                          <img
                            src={b.logo || "https://placehold.co/40x40?text=Logo"}
                            alt={b.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50"
                          />
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                            {b.name}
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-xs">{b.slug}</td>
                        <td className="py-3.5 max-w-xs truncate text-slate-400">{b.description || "—"}</td>
                        {/* Approval status badge */}
                        <td className="py-3.5">
                          {b.approvalStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                              <Clock className="w-2.5 h-2.5" /> Pending
                            </span>
                          )}
                          {b.approvalStatus === "approved" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                            </span>
                          )}
                          {b.approvalStatus === "rejected" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                              <XCircle className="w-2.5 h-2.5" /> Rejected
                            </span>
                          )}
                          {!b.approvalStatus && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                            </span>
                          )}
                        </td>
                        {!isVendor && (
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(b)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-indigo-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(b._id)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isVendor ? 5 : 6} className="py-8 text-center text-slate-400">
                        No brands found.
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
