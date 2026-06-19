import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
function AdminLayout() {
  return (
    <div className="flex">
  <AdminSidebar />

  <div className="flex-1 p-8">
    <Outlet />
  </div>
</div>
  );
}

export default AdminLayout;