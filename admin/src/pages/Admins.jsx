import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { Edit, Trash2, Plus, Shield, Key, Check } from "lucide-react";
import toast from "react-hot-toast";

const MODULES = [
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "brands", label: "Brands" },
  { id: "orders", label: "Orders" },
  { id: "users_view", label: "Users: View" },
  { id: "users_create", label: "Users: Create" },
  { id: "users_edit", label: "Users: Edit/Update" },
  { id: "users_delete", label: "Users: Delete" },
  { id: "coupons", label: "Coupons" },
  { id: "reviews", label: "Reviews" },
  { id: "inventory", label: "Inventory" },
  { id: "pages", label: "CMS Pages" },
  { id: "blogs", label: "CMS Blogs" },
  { id: "settings", label: "Settings" }
];

const DEFAULT_PERMISSIONS = {
  products: true,
  categories: true,
  brands: true,
  orders: true,
  users_view: true,
  users_create: true,
  users_edit: true,
  users_delete: true,
  coupons: true,
  reviews: true,
  inventory: true,
  pages: true,
  blogs: true,
  settings: true
};

export default function Admins() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const { data: admins = [], isLoading, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await API.get("/admins");
      return res.data;
    }
  });

  const openCreateModal = () => {
    setEditingAdmin(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setPermissions(DEFAULT_PERMISSIONS);
    setModalOpen(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPassword(""); // Leave blank unless changing
    setRole(admin.role);
    setPermissions(admin.permissions || DEFAULT_PERMISSIONS);
    setModalOpen(true);
  };

  const handlePermissionChange = (moduleKey) => {
    setPermissions(prev => {
      const nextVal = !prev[moduleKey];
      let updated = { ...prev, [moduleKey]: nextVal };

      // Users permission dependency logic
      if (moduleKey === "users_view" && !nextVal) {
        // If users_view is unchecked, automatically uncheck users_create, users_edit, and users_delete
        updated.users_create = false;
        updated.users_edit = false;
        updated.users_delete = false;
      } else if (["users_create", "users_edit", "users_delete"].includes(moduleKey) && nextVal) {
        // If users_create, users_edit, or users_delete is checked, automatically check users_view
        updated.users_view = true;
      }

      return updated;
    });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "superadmin") {
      // Superadmins automatically have all permissions enabled
      setPermissions(
        MODULES.reduce((acc, m) => {
          acc[m.id] = true;
          return acc;
        }, {})
      );
    } else if (newRole === "viewer") {
      // Viewers have mutative actions unchecked
      setPermissions(prev => ({
        ...prev,
        users_create: false,
        users_edit: false,
        users_delete: false
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    if (!editingAdmin && !password) {
      toast.error("Password is required for new accounts");
      return;
    }

    const payload = {
      name,
      email,
      role,
      permissions
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (editingAdmin) {
        await API.put(`/admins/${editingAdmin._id}`, payload);
        toast.success("Administrator updated successfully");
      } else {
        await API.post("/admins", payload);
        toast.success("Administrator created successfully");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save administrator");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        await API.delete(`/admins/${id}`);
        toast.success("Administrator deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete administrator");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Administrators</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage admin accounts, roles and granular access permissions.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Administrator
        </button>
      </div>

      {/* Main Admins List */}
      {isLoading ? (
        <Loader size="lg" />
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Module Permissions</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4 font-bold text-slate-800">{admin.name}</td>
                      <td className="px-6 py-4">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                            admin.role === "superadmin"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : admin.role === "admin"
                              ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                              : admin.role === "editor"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        {admin.role === "superadmin" ? (
                          <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> Full Access (All permissions enabled)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {MODULES.map((m) => {
                              const hasPerm = admin.permissions && admin.permissions[m.id];
                              if (!hasPerm) return null;
                              return (
                                <span
                                  key={m.id}
                                  className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                                >
                                  {m.label}
                                </span>
                              );
                            })}
                            {(!admin.permissions || !Object.values(admin.permissions).some(Boolean)) && (
                              <span className="text-xs text-slate-400 italic">No permissions enabled</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-1.5 rounded-lg border border-slate-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-2xs"
                            title="Edit Permissions"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-1.5 rounded-lg border border-slate-100 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-2xs"
                            title="Delete Administrator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No administrators found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingAdmin ? "Edit Administrator" : "Add Administrator"}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {editingAdmin ? "Reset Password (leave blank to keep)" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                placeholder={editingAdmin ? "••••••••" : "Password"}
                required={!editingAdmin}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">System Role</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              >
                <option value="superadmin">Superadmin (All privileges)</option>
                <option value="admin">Admin (Custom access)</option>
                <option value="editor">Editor (Custom access)</option>
                <option value="viewer">Viewer (Read-only access)</option>
              </select>
            </div>
          </div>

          {/* Module Permissions Checklist */}
          <div>
            <h3 className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" /> Module Permissions
            </h3>
            {role === "superadmin" ? (
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-600 text-xs font-semibold">
                Superadmins automatically possess all module access privileges. No checkboxes required.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                {MODULES.map((m) => {
                  const isChecked = permissions[m.id] === true;
                  const isMutativeUserPerm = ["users_create", "users_edit", "users_delete"].includes(m.id);
                  const isDisabled = role === "viewer" && isMutativeUserPerm;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isDisabled
                          ? "bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                          : isChecked
                          ? "bg-white border-indigo-200 text-indigo-700 shadow-3xs"
                          : "bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDisabled ? false : isChecked}
                        disabled={isDisabled}
                        onChange={() => handlePermissionChange(m.id)}
                        className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-xs"
            >
              Save Administrator
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
