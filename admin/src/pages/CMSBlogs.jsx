import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Edit2, Trash2, FileText } from "lucide-react";

export default function CMSBlogs() {
  const queryClient = useQueryClient();

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [blogCategories, setBlogCategories] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [status, setStatus] = useState("Published");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Fetch Blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["cmsBlogs"],
    queryFn: async () => {
      const res = await API.get("/blogs");
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
      setFeaturedImage(res.data.url);
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
        return await API.put(`/blogs/${editingId}`, payload);
      } else {
        return await API.post("/blogs", payload);
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Blog post updated" : "Blog post created");
      queryClient.invalidateQueries(["cmsBlogs"]);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      toast.success("Blog post deleted");
      queryClient.invalidateQueries(["cmsBlogs"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete post");
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setFeaturedImage("");
    setBlogCategories("");
    setBlogTags("");
    setStatus("Published");
    setMetaTitle("");
    setMetaDescription("");
  };

  const handleEdit = (b) => {
    setEditingId(b._id);
    setTitle(b.title);
    setSlug(b.slug);
    setContent(b.content || "");
    setFeaturedImage(b.featuredImage || "");
    setBlogCategories(b.categories?.join(", ") || "");
    setBlogTags(b.tags?.join(", ") || "");
    setStatus(b.status || "Published");
    if (b.seo) {
      setMetaTitle(b.seo.metaTitle || "");
      setMetaDescription(b.seo.metaDescription || "");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Title and content are required");

    saveMutation.mutate({
      title,
      slug: slug || undefined,
      content,
      featuredImage,
      categories: blogCategories.split(",").map((c) => c.trim()).filter(Boolean),
      tags: blogTags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      seo: {
        metaTitle,
        metaDescription,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">CMS Blogs</h1>
        <p className="text-xs text-slate-400 mt-0.5">Publish articles, updates, and tagging systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {editingId ? "Edit Blog Post" : "Write Blog Post"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Benefits of Vitamin C"
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
                placeholder="benefits-of-vitamin-c"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

             <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Featured Image
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/images/blog.png"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden"
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
              {featuredImage && (
                <div className="mt-3 relative w-32 h-20 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center p-1 group">
                  <img src={featuredImage} alt="Blog Preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Categories (comma)
                </label>
                <input
                  type="text"
                  value={blogCategories}
                  onChange={(e) => setBlogCategories(e.target.value)}
                  placeholder="Health, Diet"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  Tags (comma)
                </label>
                <input
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="vitamins, nutrition"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Post Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write blog post article body..."
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Fields</h4>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Meta title"
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="Meta description..."
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                {editingId ? "Update" : "Publish Post"}
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

        {/* Blogs List Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Blog Posts</h3>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Banner</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Categories</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                  {blogs.length > 0 ? (
                    blogs.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5">
                          <img
                            src={b.featuredImage || "https://placehold.co/80x45?text=Blog"}
                            alt={b.title}
                            className="w-16 h-9 rounded-lg object-cover border border-slate-100 bg-slate-50"
                          />
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                            {b.title}
                          </div>
                        </td>
                        <td className="py-3.5 text-xs text-slate-500">{b.categories?.join(", ") || "—"}</td>
                        <td className="py-3.5">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              b.status === "Published"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No articles published.
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
