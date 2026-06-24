import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";
import API from "../services/api";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  MessageSquare,
  PackageCheck,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const admin = useSelector((state) => state.auth.user);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: ShoppingBag },
    { label: "Categories", path: "/categories", icon: FolderTree },
    { label: "Brands", path: "/brands", icon: Tag },
    { label: "Orders", path: "/orders", icon: ShoppingCart },
    { label: "Customers", path: "/customers", icon: Users },
    { label: "Coupons", path: "/coupons", icon: Tag },
    { label: "Reviews", path: "/reviews", icon: MessageSquare },
    { label: "Inventory", path: "/inventory", icon: PackageCheck },
    { label: "CMS Pages", path: "/pages", icon: FileText },
    { label: "CMS Blogs", path: "/blogs", icon: FileText },
    { label: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const fetchNotifications = async () => {
    try {
      // Mocking/fetching notifications
      // In a real database we could fetch `/api/notifications`
      // Let's seed a few fake alerts if no database route yet, to populate UI
      setNotifications([
        { id: "1", title: "New Order Recieved", message: "Order #ORD-82937 worth $120.00", read: false },
        { id: "2", title: "Low Stock Alert", message: "Vitamin C capsules is below threshold", read: false },
        { id: "3", title: "New Review Received", message: "Customer John left 5 stars review", read: true },
      ]);
      setUnreadCount(2);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/admin/logout");
    } catch (err) {}
    dispatch(logoutSuccess());
    navigate("/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="text-lg font-bold text-white tracking-wider">NutraFyi Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all mt-6"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base font-bold text-slate-800 hidden md:block">
              {menuItems.find((item) => item.path === location.pathname)?.label || "E-Commerce"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
                  <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <span className="text-sm font-bold text-slate-700">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-indigo-600 font-semibold hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors ${!n.read ? "bg-indigo-50/20" : ""}`}>
                        <p className="text-sm font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                {admin?.name ? admin.name[0] : "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{admin?.name || "Admin"}</p>
                <p className="text-xs text-slate-400 capitalize mt-0.5">{admin?.role || "Administrator"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="p-6 md:p-8 flex-1 flex flex-col bg-slate-50/50">{children}</main>
      </div>
    </div>
  );
}
