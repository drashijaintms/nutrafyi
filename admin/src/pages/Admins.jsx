import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { Edit, Trash2, Plus, Shield, Search, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ACCESS_MATRIX_MODULES = [
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "brands", label: "Brands" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Customers" },
  { id: "coupons", label: "Coupons" },
  { id: "reviews", label: "Reviews" },
  { id: "inventory", label: "Inventory" },
  { id: "cmsPages", label: "CMS Pages" },
  { id: "cmsBlogs", label: "CMS Blogs" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "settings", label: "Settings" },
  { id: "trashBin", label: "Trash Bin" }
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Admins() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "roles"
  
  // Search and Page sizing states
  const [userSearch, setUserSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [userPageSize, setUserPageSize] = useState(10);
  const [rolePageSize, setRolePageSize] = useState(10);

  // Modals visibility
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // User form states
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Role form states
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState({});

  // Query Admins list
  const { data: admins = [], isLoading: isLoadingAdmins, refetch: refetchAdmins } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await API.get("/admins");
      return res.data;
    }
  });

  // Query Roles list
  const { data: roles = [], isLoading: isLoadingRoles, refetch: refetchRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await API.get("/roles");
      return res.data;
    }
  });

  // Check if current user is logged in
  const currentUser = useSelector((state) => state.auth.user);

  // Initialize permissions helper
  const initializeEmptyPermissions = () => {
    const empty = {};
    ACCESS_MATRIX_MODULES.forEach((m) => {
      empty[m.id] = { view: false, edit: false, delete: false };
    });
    return empty;
  };

  // Checkbox matrix toggle handler
  const handleCheckboxChange = (moduleId, permType) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permType]: !prev[moduleId]?.[permType]
      }
    }));
  };

  // User actions
  const openCreateUserModal = () => {
    setEditingUser(null);
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setSelectedRoleId(roles[0]?._id || "");
    setUserModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPassword(""); // Leave blank
    setSelectedRoleId(user.roleId?._id || user.roleId || "");
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userName || !userEmail) return toast.error("Name and email are required");
    if (!editingUser && !userPassword) return toast.error("Password is required for new users");

    const selectedRoleObj = roles.find(r => r._id === selectedRoleId);

    const payload = {
      name: userName,
      email: userEmail,
      role: selectedRoleObj ? selectedRoleObj.name : "admin",
      roleId: selectedRoleId || null
    };

    if (userPassword) {
      payload.password = userPassword;
    }

    try {
      if (editingUser) {
        await API.put(`/admins/${editingUser._id}`, payload);
        toast.success("User updated successfully");
      } else {
        await API.post("/admins", payload);
        toast.success("User created successfully");
      }
      setUserModalOpen(false);
      refetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (currentUser?._id === id) {
      return toast.error("You cannot delete your own account.");
    }
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        await API.delete(`/admins/${id}`);
        toast.success("User deleted successfully");
        refetchAdmins();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  // Role actions
  const openCreateRoleModal = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleDescription("");
    setPermissions(initializeEmptyPermissions());
    setRoleModalOpen(true);
  };

  const openEditRoleModal = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
    
    // Merge existing role permissions with full access list to avoid undefined states
    const merged = initializeEmptyPermissions();
    if (role.permissions) {
      for (const key in role.permissions) {
        if (merged[key] && role.permissions[key]) {
          merged[key].view = !!role.permissions[key].view;
          merged[key].edit = !!role.permissions[key].edit;
          merged[key].delete = !!role.permissions[key].delete;
        }
      }
    }
    setPermissions(merged);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName) return toast.error("Role name is required");

    const payload = {
      name: roleName,
      description: roleDescription,
      permissions
    };

    try {
      if (editingRole) {
        await API.put(`/roles/${editingRole._id}`, payload);
        toast.success("Role updated successfully");
      } else {
        await API.post("/roles", payload);
        toast.success("Role created successfully");
      }
      setRoleModalOpen(false);
      refetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save role");
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await API.delete(`/roles/${id}`);
        toast.success("Role deleted successfully");
        refetchRoles();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete role");
      }
    }
  };

  // Filter calculations
  const filteredUsers = admins.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.roleId?.name || u.role || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(roleSearch.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(0, userPageSize);
  const displayedRoles = filteredRoles.slice(0, rolePageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Toggle Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {activeTab === "users" ? "User Management" : "Roles & Permissions"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {activeTab === "users" 
              ? "Manage administrative access and assign roles." 
              : "Define custom roles and set their granular access rights."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 sm:mt-0">
          {activeTab === "users" ? (
            <button
              onClick={openCreateUserModal}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" /> Add User
            </button>
          ) : (
            <button
              onClick={openCreateRoleModal}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" /> Add Role
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200/80 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === "users"
              ? "text-indigo-650 border-b-2 border-indigo-650"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === "roles"
              ? "text-indigo-650 border-b-2 border-indigo-650"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Roles & Permissions
        </button>
      </div>

      {/* Page Content based on tab */}
      {activeTab === "users" ? (
        // ================= USER MANAGEMENT VIEW =================
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full text-sm pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Entries Sizing */}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Show</span>
              <div className="relative">
                <select
                  value={userPageSize}
                  onChange={(e) => setUserPageSize(parseInt(e.target.value))}
                  className="appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <span>entries</span>
            </div>
          </div>

          {/* Table */}
          {isLoadingAdmins || isLoadingRoles ? (
            <Loader size="lg" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => {
                      const initial = user.name ? user.name[0].toUpperCase() : "A";
                      const roleName = user.roleId?.name || user.role || "Admin";
                      return (
                        <tr key={user._id} className="hover:bg-slate-50/30">
                          {/* User Avatar & Details */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-250 flex items-center justify-center font-bold text-slate-600">
                                {initial}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-805 leading-none">{user.name}</h4>
                                <span className="text-xs text-slate-400 mt-1 block">{user.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Assigned Role */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-650 border border-indigo-100 uppercase tracking-wider">
                              <Shield className="w-3.5 h-3.5 shrink-0" />
                              {roleName}
                            </span>
                          </td>

                          {/* Joined Date */}
                          <td className="px-6 py-4 text-slate-500 font-semibold">
                            {formatDate(user.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => openEditUserModal(user)}
                                className="p-2 rounded-xl border border-slate-150 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 rounded-xl border border-slate-150 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer"
                                title="Delete User"
                                disabled={currentUser?._id === user._id}
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
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                        No administrative users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // ================= ROLES & PERMISSIONS VIEW =================
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full text-sm pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Entries Sizing */}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Show</span>
              <div className="relative">
                <select
                  value={rolePageSize}
                  onChange={(e) => setRolePageSize(parseInt(e.target.value))}
                  className="appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <span>entries</span>
            </div>
          </div>

          {/* Table */}
          {isLoadingRoles ? (
            <Loader size="lg" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                    <th className="px-6 py-4">Role Name</th>
                    <th className="px-6 py-4">Permissions</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                  {displayedRoles.length > 0 ? (
                    displayedRoles.map((role) => (
                      <tr key={role._id} className="hover:bg-slate-50/30">
                        {/* Name & Description */}
                        <td className="px-6 py-4">
                          <h4 className="font-bold text-slate-805 leading-none">{role.name}</h4>
                          <span className="text-xs text-slate-400 mt-1 block">{role.description || "No description provided."}</span>
                        </td>

                        {/* Enabled Count */}
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 uppercase tracking-wider">
                            {role.enabledCount || 0} ENABLED
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openEditRoleModal(role)}
                              className="p-2 rounded-xl border border-slate-150 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer"
                              title="Edit Role Access Matrix"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role._id)}
                              className="p-2 rounded-xl border border-slate-150 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer"
                              title="Delete Role"
                              disabled={["Administrator", "Admin"].includes(role.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">
                        No custom roles defined yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= ADD / EDIT USER MODAL ================= */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={editingUser ? "Edit User Access" : "Add Administrative User"}
      >
        <form onSubmit={handleSaveUser} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {editingUser ? "Reset Password (leave blank to keep)" : "Password"}
              </label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
                placeholder={editingUser ? "••••••••" : "Password"}
                required={!editingUser}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Assigned Role</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
              >
                {roles.map(role => (
                  <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setUserModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= ADD / EDIT ROLE & ACCESS MATRIX MODAL ================= */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={editingRole ? "Edit Role & Permissions" : "Add Role"}
      >
        <form onSubmit={handleSaveRole} className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
                placeholder="Role name"
                required
                disabled={editingRole && ["Administrator", "Admin"].includes(editingRole.name)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
              <input
                type="text"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-slate-50/50"
                placeholder="Short explanation of role access"
              />
            </div>
          </div>

          {/* Access Matrix Table */}
          <div className="space-y-3">
            <h3 className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Access Matrix</h3>
            
            <div className="overflow-hidden border border-slate-200/80 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-3">Module</th>
                    <th className="px-6 py-3 text-center">View</th>
                    <th className="px-6 py-3 text-center">Edit</th>
                    <th className="px-6 py-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                  {ACCESS_MATRIX_MODULES.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/20">
                      <td className="px-6 py-3.5 font-bold text-slate-800">{m.label}</td>
                      
                      {/* View Checkbox */}
                      <td className="px-6 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[m.id]?.view || false}
                          onChange={() => handleCheckboxChange(m.id, "view")}
                          className="w-4.5 h-4.5 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
                        />
                      </td>

                      {/* Edit Checkbox */}
                      <td className="px-6 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[m.id]?.edit || false}
                          onChange={() => handleCheckboxChange(m.id, "edit")}
                          className="w-4.5 h-4.5 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
                        />
                      </td>

                      {/* Delete Checkbox */}
                      <td className="px-6 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[m.id]?.delete || false}
                          onChange={() => handleCheckboxChange(m.id, "delete")}
                          className="w-4.5 h-4.5 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRoleModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Save Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
