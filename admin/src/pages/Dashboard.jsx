import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import {
  DollarSign,
  ShoppingCart,
  Users,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Package
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await API.get("/dashboard/stats");
      return res.data;
    },
  });

  if (isLoading) return <Loader size="lg" />;
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-2xl">
        Failed to load dashboard metrics: {error.message}
      </div>
    );
  }

  const { summary = {}, charts = {}, recentOrders = [], recentActivities = [], topProducts = [], topCategories = [] } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time statistics and store progress metrics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(summary.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="emerald"
          change="+8.4%"
          changeType="positive"
          to="/orders"
        />
        <StatsCard
          title="Total Orders"
          value={summary.totalOrders || 0}
          icon={ShoppingCart}
          color="indigo"
          change="+4.2%"
          changeType="positive"
          to="/orders"
        />
        <StatsCard
          title="Total Customers"
          value={summary.totalCustomers || 0}
          icon={Users}
          color="sky"
          change="+12.1%"
          changeType="positive"
          to="/customers"
        />
        <StatsCard
          title="Total Products"
          value={summary.totalProducts || 0}
          icon={ShoppingBag}
          color="violet"
          to="/products"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-700">Revenue Analytics</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Last 30 Days
            </span>
          </div>
          <div className="h-72">
            {charts.dailySales?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.dailySales}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-700">Order Analytics</h3>
            <span className="text-xs font-semibold text-slate-400">Monthly breakdown</span>
          </div>
          <div className="h-72">
            {charts.monthlySales?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No orders data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Product</th>
                  <th className="pb-3 text-center">Units Sold</th>
                  <th className="pb-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-650">
                {topProducts && topProducts.length > 0 ? (
                  topProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/50">
                      <td className="py-3 flex items-center gap-3">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg border border-slate-100 p-0.5 shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs uppercase shrink-0 border border-slate-100">
                            No Img
                          </div>
                        )}
                        <span className="font-bold text-slate-800 line-clamp-1">{prod.title || "Unknown Product"}</span>
                      </td>
                      <td className="py-3 text-center font-semibold text-slate-800">{prod.totalQty}</td>
                      <td className="py-3 text-right font-bold text-emerald-600">${(prod.totalSales || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No sales data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Top Selling Categories</h3>
          <div className="space-y-4">
            {topCategories && topCategories.length > 0 ? (
              topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-slate-850 text-sm capitalize">{cat._id}</h4>
                    <span className="text-xs text-slate-400">{cat.totalQty} units sold</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">${(cat.totalSales || 0).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-12 text-sm">
                No category sales records.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-800">#{order.orderId}</td>
                      <td className="py-3">{order.customer.name}</td>
                      <td className="py-3 font-semibold">${order.amount.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
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
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Admin Activity</h3>
          <div className="space-y-4 max-h-[16.5rem] overflow-y-auto pr-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-normal">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                    {act.adminName[0]}
                  </div>
                  <div>
                    <p className="text-slate-700">
                      <strong className="font-semibold text-slate-800">{act.adminName}</strong>{" "}
                      {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-12 text-sm">
                No recent activity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
