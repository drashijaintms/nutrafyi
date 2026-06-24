import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, ShoppingBag } from "lucide-react";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["customerDetail", id],
    queryFn: async () => {
      const res = await API.get(`/customers/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader size="lg" />;
  if (error) return <div className="text-rose-500">Failed to load customer details</div>;

  const { customer = {}, orders = [] } = data || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <button
          onClick={() => navigate("/customers")}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Customer Profile</h1>
          <p className="text-xs text-slate-400">Customer ID: {customer._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-5">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-50">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 text-2xl mb-3">
              {customer.name ? customer.name[0] : "C"}
            </div>
            <h3 className="font-bold text-slate-800 text-base">{customer.name}</h3>
            <span className="text-xs text-slate-400 capitalize mt-0.5">Member</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center gap-2.5 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{customer.phone || "No phone added"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Spend stats */}
          <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Orders
              </p>
              <h4 className="text-lg font-bold text-slate-800">{customer.totalOrders || 0}</h4>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Spent
              </p>
              <h4 className="text-lg font-bold text-slate-800">
                ${(customer.totalSpending || 0).toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        {/* Addresses & Orders History */}
        <div className="space-y-6 lg:col-span-2">
          {/* Address Book */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" /> Saved Addresses
            </h3>
            {customer.addresses?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.addresses.map((addr, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-2">
                      {addr.addressType} Address
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {addr.address}, {addr.city}, {addr.state} - {addr.zip}, {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-2">No addresses on profile.</p>
            )}
          </div>

          {/* Orders History */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-slate-400" /> Order History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-indigo-600">
                          <Link to={`/orders/${order._id}`}>#{order.orderId}</Link>
                        </td>
                        <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 font-semibold">${order.amount.total.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-600"
                                : order.status === "Cancelled"
                                ? "bg-rose-50 text-rose-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No orders recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
