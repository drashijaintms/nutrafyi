import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";
import API from "../services/api";
import { toast } from "react-hot-toast";
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
  ChevronDown,
  Trash2,
  ClipboardCheck,
  Store,
} from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const admin = useSelector((state) => state.auth.user);

  const isSuperAdmin = admin?.role === "superadmin" || admin?.role === "Administrator";
  const isVendor = admin?.role === "vendor";

  const menuItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: ShoppingBag, resource: "products" },
    { label: "Categories", path: "/categories", icon: FolderTree, resource: "categories" },
    { label: "Brands", path: "/brands", icon: Tag, resource: "brands" },
    { label: "Orders", path: "/orders", icon: ShoppingCart, resource: "orders" },
    { label: "Customers", path: "/customers", icon: Users, resource: "users_view" },
    { label: "Coupons", path: "/coupons", icon: Tag, resource: "coupons" },
    { label: "Reviews", path: "/reviews", icon: MessageSquare, resource: "reviews" },
    { label: "Inventory", path: "/inventory", icon: PackageCheck, resource: "inventory" },
    { label: "CMS Pages", path: "/pages", icon: FileText, resource: "pages" },
    { label: "CMS Blogs", path: "/blogs", icon: FileText, resource: "blogs" },
    { label: "Settings", path: "/settings", icon: SettingsIcon, resource: "settings" },
    { label: "Administrators", path: "/admins", icon: Users, resource: "admins" },
    { label: "Trash Bin", path: "/trash", icon: Trash2 },
    // Approvals: only visible to superadmins
    { label: "Approvals", path: "/approvals", icon: ClipboardCheck, superAdminOnly: true, badge: pendingApprovalCount },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!admin) return false;
    // SuperAdmin-only items
    if (item.superAdminOnly) return isSuperAdmin;
    // Vendor: only show Dashboard, Products, Categories
    if (isVendor) return ["Dashboard", "Products", "Categories"].includes(item.label);
    // Others: check resource permissions
    if (!item.resource) return true;
    if (isSuperAdmin) return true;
    return admin.permissions && admin.permissions[item.resource] === true;
  });

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      const newNotifications = res.data.notifications || [];
      const newUnreadCount = res.data.unreadCount || 0;

      if (!isFirstLoad && newUnreadCount > unreadCount) {
        const latest = newNotifications.find(n => !n.read);
        if (latest) {
          toast.success(`${latest.title}: ${latest.message}`, {
            icon: "🔔",
            duration: 5000,
          });
        }
      }
      setIsFirstLoad(false);
      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const fetchPendingCount = async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await API.get("/approvals/count");
      setPendingApprovalCount(res.data.pendingCount || 0);
    } catch (err) {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchPendingCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchPendingCount();
    }, 15000);
    return () => clearInterval(interval);
  }, [unreadCount, isFirstLoad]);

  const handleLogout = async () => {
    try {
      await API.post("/admin/logout");
    } catch (err) {}
    dispatch(logoutSuccess());
    navigate("/login");
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/mark-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (n) => {
    try {
      if (!n.read) {
        await API.put(`/notifications/${n._id}/read`);
        fetchNotifications();
      }
      setShowNotifications(false);
      if (n.link) {
        navigate(n.link);
      }
    } catch (err) {
      console.error("Failed to handle notification click:", err);
    }
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
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Vendor info banner */}
          {isVendor && (
            <div className="mt-4 mx-1 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400">Vendor Account</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Products & categories you add will be sent to the super admin for approval before going live.</p>
            </div>
          )}

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
              {filteredMenuItems.find((item) => item.path === location.pathname)?.label || "E-Commerce"}
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
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 italic">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div
                          key={n._id || idx}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? "bg-indigo-50/20 font-medium" : ""}`}
                        >
                          <p className="text-sm font-bold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isVendor ? "bg-amber-100 border border-amber-200 text-amber-700" :
                isSuperAdmin ? "bg-indigo-100 border border-indigo-200 text-indigo-700" :
                "bg-slate-100 border border-slate-200 text-slate-600"
              }`}>
                {admin?.name ? admin.name[0].toUpperCase() : "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{admin?.name || "Admin"}</p>
                <p className="text-xs mt-0.5 capitalize font-medium" style={{ color: isVendor ? "#d97706" : isSuperAdmin ? "#6366f1" : "#94a3b8" }}>
                  {isVendor ? "Vendor" : isSuperAdmin ? "Super Admin" : admin?.role || "Administrator"}
                </p>
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
