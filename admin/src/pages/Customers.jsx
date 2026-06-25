import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import API from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { user } = useSelector((state) => state.auth);
  const isSuper = user?.role === "superadmin";
  const canView = isSuper || (user?.permissions && user.permissions.users_view === true);
  const canCreate = isSuper || (user?.permissions && user.permissions.users_create === true);
  const canEdit = isSuper || (user?.permissions && user.permissions.users_edit === true);
  const canDelete = isSuper || (user?.permissions && user.permissions.users_delete === true);

  const { data: customersData, isLoading, refetch } = useQuery({
    queryKey: ["customers", search, page],
    queryFn: async () => {
      const res = await API.get("/customers", {
        params: { search, page, limit: 10 },
      });
      return res.data;
    },
    enabled: canView
  });

  const openCreateModal = () => {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setModalOpen(true);
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setName(cust.name);
    setEmail(cust.email);
    setPhone(cust.phone || "");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    const payload = { name, email, phone };

    try {
      if (editingCustomer) {
        await API.put(`/customers/${editingCustomer._id}`, payload);
        toast.success("Customer profile updated successfully");
      } else {
        await API.post("/customers", payload);
        toast.success("Customer profile created successfully");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save customer");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await API.delete(`/customers/${id}`);
        toast.success("Customer deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete customer");
      }
    }
  };

  const columns = [
    {
      header: "Name",
      render: (row) => <span className="font-bold text-slate-800 text-sm">{row.name}</span>,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => <span>{row.phone || "—"}</span>,
    },
    {
      header: "Total Orders",
      accessor: "totalOrders",
      render: (row) => <span className="font-semibold">{row.totalOrders || 0} orders</span>,
    },
    {
      header: "Total Spending",
      accessor: "totalSpending",
      render: (row) => (
        <span className="font-bold text-slate-800">${(row.totalSpending || 0).toFixed(2)}</span>
      ),
    },
    {
      header: "Joined Date",
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/customers/${row._id}`}
            className="p-1.5 rounded-lg border border-slate-100 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all inline-block shadow-2xs"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canEdit && (
            <button
              onClick={() => openEditModal(row)}
              className="p-1.5 rounded-lg border border-slate-100 bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all shadow-2xs"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleDelete(row._id)}
              className="p-1.5 rounded-lg border border-slate-100 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-2xs"
              title="Delete Customer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl font-bold mb-4">
          ✕
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-400 max-w-md">
          You do not have permission to view the storefront customer accounts list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Customers</h1>
          <p className="text-xs text-slate-400 mt-0.5">View and manage user accounts, address books, and purchase summary stats.</p>
        </div>
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={customersData?.customers || []}
        loading={isLoading}
        pagination={{
          page: customersData?.page || 1,
          pages: customersData?.pages || 1,
          onPageChange: (newPage) => setPage(newPage),
        }}
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search customers by name, email or phone...",
        }}
      />

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCustomer ? "Edit Customer Details" : "Add Customer Profile"}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              placeholder="customer@domain.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              placeholder="+1 (555) 123-4567"
            />
          </div>

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
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
