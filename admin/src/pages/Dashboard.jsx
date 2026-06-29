import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  Package,
  FolderTree,
  FileText,
  Eye,
  Mail,
  Plus,
  BookOpen,
  ArrowRight
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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function Dashboard() {
  const admin = useSelector((state) => state.auth.user);

  const isRestrictedBlogManager =
    admin &&
    (admin.role === "blogadmin" ||
     admin.role === "Editor" ||
     admin.role === "Blog Editor" ||
     (admin.permissions?.blogs === true &&
      admin.permissions?.products !== true &&
      admin.permissions?.orders !== true));

  // 1. E-Commerce stats query (enabled if NOT blog admin)
  const { data: ecommerceData, isLoading: isEcommerceLoading, error: ecommerceError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await API.get("/dashboard/stats");
      return res.data;
    },
    enabled: !isRestrictedBlogManager,
  });

  // 2. CMS Blogs query (enabled if blog admin)
  const { data: blogs = [], isLoading: isBlogsLoading, error: blogsError } = useQuery({
    queryKey: ["cmsBlogs"],
    queryFn: async () => {
      const res = await API.get("/blogs");
      return res.data;
    },
    enabled: !!isRestrictedBlogManager,
  });

  // 3. Categories query (enabled if blog admin)
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
    enabled: !!isRestrictedBlogManager,
  });

  // 4. Newsletter Subscribers query
  const { data: subscriberData } = useQuery({
    queryKey: ["subscribersCount"],
    queryFn: async () => {
      const res = await API.get("/newsletter/count");
      return res.data;
    },
    enabled: !!isRestrictedBlogManager,
  });
  const subscriberCount = subscriberData?.count ?? 0;

  const isLoading = isRestrictedBlogManager
    ? (isBlogsLoading || isCategoriesLoading)
    : isEcommerceLoading;

  const error = isRestrictedBlogManager
    ? blogsError
    : ecommerceError;

  if (isLoading) return <Loader size="lg" />;
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-2xl">
        Failed to load dashboard metrics: {error.message}
      </div>
    );
  }

  // Render Blog Dashboard if user is a restricted blog manager / Editor / blogadmin
  if (isRestrictedBlogManager) {
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const blogCategoryOptions = categories.length > 0 
      ? categories.map(c => c.title) 
      : [];
    const mostViewedBlogs = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));

    const chartData = [
      { name: "Dec 25", views: 0 },
      { name: "Jan 26", views: 0 },
      { name: "Feb 26", views: 0 },
      { name: "Mar 26", views: 0 },
      { name: "Apr 26", views: 0 },
      { name: "May 26", views: totalViews },
      { name: "Jun 26", views: 0 }
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Blog Management Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Manage articles, categories, and track search engine optimization statistics.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Link
              to="/blogs"
              state={{ viewState: "list" }}
              className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 text-sm font-semibold transition-all cursor-pointer shadow-xs hover:border-slate-300"
            >
              Manage Posts
            </Link>
            <Link
              to="/blogs"
              state={{ triggerCreate: true }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" /> Add New Post
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Posts */}
          <Link
            to="/blogs"
            state={{ viewState: "list" }}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Posts</span>
              <span className="text-3xl font-bold text-slate-800 block">{blogs.length}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">
                +{blogs.length} total
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </Link>

          {/* Card 2: Categories */}
          <Link
            to="/categories"
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Categories</span>
              <span className="text-3xl font-bold text-slate-800 block">{blogCategoryOptions.length}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">
                +{blogCategoryOptions.length} modules
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FolderTree className="w-6 h-6" />
            </div>
          </Link>

          {/* Card 3: Cumulative Views */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cumulative Views</span>
              <span className="text-3xl font-bold text-slate-800 block">{totalViews}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">
                Live Traffic
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Subscribers */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Subscribers</span>
              <span className="text-3xl font-bold text-slate-800 block">{subscriberCount}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">
                {subscriberCount} list
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Chart & Most Viewed Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Analytics Line Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Traffic Analytics</h3>
              <p className="text-xs text-slate-400 mt-1">Real Article Views over time</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #f1f5f9",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: "#f97316", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Viewed Articles */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Most Viewed Articles</h3>
              <p className="text-xs text-slate-400 mt-1">Top performing content</p>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {mostViewedBlogs.map((b) => (
                <div key={b._id} className="py-3 flex items-center gap-3 hover:bg-slate-50/50 rounded-xl px-1.5 transition-colors">
                  <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                    {b.featuredImage ? (
                      <img src={b.featuredImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{b.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold">
                      <span>{new Date(b.publishDate).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                      <span>•</span>
                      <span className="text-orange-500 font-bold">{b.views || 0} views</span>
                      <span>•</span>
                      <span className="uppercase text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-sm font-bold">
                        {b.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render default E-Commerce dashboard
  const { summary = {}, charts = {}, recentOrders = [], recentActivities = [], topProducts = [], topCategories = [] } = ecommerceData || {};

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
