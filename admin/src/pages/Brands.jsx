import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  Plus, Edit2, Trash2, Tag, Clock, CheckCircle2, XCircle, AlertCircle,
  Globe, Mail, Phone, ExternalLink, ChevronDown, ChevronUp, X
} from "lucide-react";

// Inline social SVGs (lucide-react in admin doesn't include brand icons)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TABS = ["identity", "contact", "social", "schema"];

export default function Brands() {
  const queryClient = useQueryClient();
  const admin = useSelector((state) => state.auth.user);
  const isVendor = admin?.role === "vendor";

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formTab, setFormTab] = useState("identity");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [logoAltText, setLogoAltText] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["brands", isVendor ? "vendor" : "all"],
    queryFn: async () => {
      const res = await API.get("/brands/admin/all");
      return res.data;
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploadingLogo(true);
    const toastId = toast.loading("Uploading logo...");
    try {
      const res = await API.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogo(res.data.url);
      toast.success("Logo uploaded!", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setUploadingLogo(false);
    }
  };

  const generateBrandSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Brand",
      "name": name,
      ...(websiteUrl && { "url": websiteUrl }),
      ...(logo && { "logo": logo }),
      ...(description && { "description": description }),
      ...(contactEmail && { "email": contactEmail }),
      ...(contactNumber && { "telephone": contactNumber }),
      ...(socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.twitter
        ? {
            "sameAs": [
              socialLinks.facebook,
              socialLinks.instagram,
              socialLinks.linkedin,
              socialLinks.twitter,
            ].filter(Boolean)
          }
        : {}),
    };
    return JSON.stringify(schema, null, 2);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) return await API.put(`/brands/${editingId}`, payload);
      return await API.post("/brands", payload);
    },
    onSuccess: (res) => {
      const status = res?.data?.approvalStatus;
      if (status === "pending") {
        toast.success("Brand submitted for approval!", { duration: 5000 });
      } else {
        toast.success(editingId ? "Brand updated!" : "Brand created!");
      }
      queryClient.invalidateQueries(["brands"]);
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/brands/${id}`),
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries(["brands"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete"),
  });

  const resetForm = () => {
    setEditingId(null);
    setFormTab("identity");
    setName(""); setSlug(""); setLogo(""); setLogoAltText(""); setDescription("");
    setWebsiteUrl(""); setContactEmail(""); setContactNumber("");
    setSocialLinks({ facebook: "", instagram: "", linkedin: "", twitter: "" });
  };

  const handleEdit = (brand) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(brand._id);
    setFormTab("identity");
    setName(brand.name || "");
    setSlug(brand.slug || "");
    setLogo(brand.logo || "");
    setLogoAltText(brand.logoAltText || "");
    setDescription(brand.description || "");
    setWebsiteUrl(brand.websiteUrl || "");
    setContactEmail(brand.contactEmail || "");
    setContactNumber(brand.contactNumber || "");
    setSocialLinks({
      facebook: brand.socialLinks?.facebook || "",
      instagram: brand.socialLinks?.instagram || "",
      linkedin: brand.socialLinks?.linkedin || "",
      twitter: brand.socialLinks?.twitter || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error("Brand Name is required");
    saveMutation.mutate({
      name, slug: slug || undefined, logo, logoAltText, description,
      websiteUrl, contactEmail, contactNumber, socialLinks,
    });
  };

  const tabClass = (t) =>
    `px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
      formTab === t
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Brands</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {isVendor
            ? "Your brand submissions. New brands require super admin approval."
            : "Manage brand profiles, contact info, social links, and schema."}
        </p>
      </div>

      {isVendor && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Vendor Submission Workflow</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Brands you create will be sent to the platform owner for review.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Brand Form ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {editingId ? "Edit Brand" : "Add New Brand"}
          </h3>

          {/* Form tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "identity", label: "Identity" },
              { key: "contact", label: "Contact" },
              { key: "social", label: "Social" },
              { key: "schema", label: "Schema" },
            ].map(({ key, label }) => (
              <button key={key} type="button" className={tabClass(key)} onClick={() => setFormTab(key)}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── IDENTITY TAB ── */}
            {formTab === "identity" && (
              <div className="space-y-4">
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
                  <div className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="https://…/logo.png"
                      className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <label className="shrink-0 bg-indigo-50 hover:bg-indigo-100 text-[#6366f1] hover:text-indigo-700 font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer border border-indigo-100 transition-all">
                      {uploadingLogo ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={logoAltText}
                    onChange={(e) => setLogoAltText(e.target.value)}
                    placeholder="Logo alt text (for SEO)"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  {logo && (
                    <div className="mt-3 relative w-20 h-20 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center p-1 group">
                      <img src={logo} alt="Brand Logo Preview" className="max-h-full max-w-full object-contain" />
                      <button type="button" onClick={() => setLogo("")}
                        className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                    Brand Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brand story, mission, or details…"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                    Brand Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://brand.com"
                      className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── CONTACT TAB ── */}
            {formTab === "contact" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@brand.com"
                      className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+1 800 000 0000"
                      className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Preview</p>
                  {contactEmail && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> {contactEmail}
                    </p>
                  )}
                  {contactNumber && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" /> {contactNumber}
                    </p>
                  )}
                  {!contactEmail && !contactNumber && (
                    <p className="text-xs text-slate-400 mt-1">No contact info yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── SOCIAL TAB ── */}
            {formTab === "social" && (
              <div className="space-y-4">
                {[
                  { key: "facebook", label: "Facebook", Icon: Facebook, placeholder: "https://facebook.com/brand" },
                  { key: "instagram", label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/brand" },
                  { key: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/company/brand" },
                  { key: "twitter", label: "Twitter / X", Icon: Twitter, placeholder: "https://x.com/brand" },
                ].map(({ key, label, Icon, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={socialLinks[key]}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SCHEMA TAB ── */}
            {formTab === "schema" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600">Auto-generated Brand Schema</p>
                  <button
                    type="button"
                    onClick={() => {
                      const schema = generateBrandSchema();
                      navigator.clipboard?.writeText(schema);
                      toast.success("Schema copied to clipboard!");
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-indigo-100"
                  >
                    Copy JSON-LD
                  </button>
                </div>
                <pre className="text-[10px] leading-relaxed bg-slate-900 text-emerald-300 rounded-xl p-4 overflow-auto max-h-60 font-mono">
                  {generateBrandSchema()}
                </pre>
                <p className="text-[10px] text-slate-400">
                  This schema is automatically injected into product pages that use this brand. Fill in Identity, Contact, and Social tabs to enrich it.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
              >
                {saveMutation.isPending ? "Saving…" : (editingId ? "Update Brand" : "Add Brand")}
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

        {/* ── Brands List ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-700 mb-4">All Brands</h3>
          {isLoading ? (
            <Loader />
          ) : brands.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No brands found.</div>
          ) : (
            <div className="space-y-3">
              {brands.map((b) => {
                const isExpanded = expandedId === b._id;
                return (
                  <div key={b._id} className={`border rounded-2xl overflow-hidden transition-all ${isExpanded ? "border-indigo-200 shadow-sm" : "border-slate-100"}`}>
                    {/* Brand row */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : b._id)}
                    >
                      <img
                        src={b.logo || "https://placehold.co/40x40?text=Brand"}
                        alt={b.logoAltText || b.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{b.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 truncate">{b.slug}</p>
                      </div>
                      {/* Status badge */}
                      <div className="shrink-0">
                        {(b.approvalStatus === "approved" || !b.approvalStatus) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Live
                          </span>
                        )}
                        {b.approvalStatus === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            <Clock className="w-2.5 h-2.5" /> Pending
                          </span>
                        )}
                        {b.approvalStatus === "rejected" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" /> Rejected
                          </span>
                        )}
                      </div>
                      {/* Actions */}
                      {!isVendor && (
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleEdit(b)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-indigo-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (window.confirm("Delete this brand?")) deleteMutation.mutate(b._id); }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-rose-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="shrink-0 text-slate-300">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded brand detail panel */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        {/* Description */}
                        <div className="sm:col-span-2">
                          <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Description</p>
                          <p className="text-slate-600 leading-relaxed">{b.description || "—"}</p>
                        </div>
                        {/* Contact */}
                        <div>
                          <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Contact</p>
                          <div className="space-y-1">
                            {b.websiteUrl && (
                              <a href={b.websiteUrl} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors">
                                <Globe className="w-3 h-3" /> Website
                              </a>
                            )}
                            {b.contactEmail && (
                              <p className="flex items-center gap-1.5 text-slate-600">
                                <Mail className="w-3 h-3 text-slate-400" /> {b.contactEmail}
                              </p>
                            )}
                            {b.contactNumber && (
                              <p className="flex items-center gap-1.5 text-slate-600">
                                <Phone className="w-3 h-3 text-slate-400" /> {b.contactNumber}
                              </p>
                            )}
                            {!b.websiteUrl && !b.contactEmail && !b.contactNumber && (
                              <p className="text-slate-400">No contact info</p>
                            )}
                          </div>
                        </div>
                        {/* Social Links */}
                        {(b.socialLinks?.facebook || b.socialLinks?.instagram || b.socialLinks?.linkedin || b.socialLinks?.twitter) && (
                          <div>
                            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Social</p>
                            <div className="flex flex-wrap gap-2">
                              {b.socialLinks.facebook && (
                                <a href={b.socialLinks.facebook} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
                                  <FacebookIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {b.socialLinks.instagram && (
                                <a href={b.socialLinks.instagram} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-pink-600 hover:text-pink-700 transition-colors">
                                  <InstagramIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {b.socialLinks.linkedin && (
                                <a href={b.socialLinks.linkedin} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-blue-700 hover:text-blue-800 transition-colors">
                                  <LinkedinIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {b.socialLinks.twitter && (
                                <a href={b.socialLinks.twitter} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
                                  <TwitterIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
