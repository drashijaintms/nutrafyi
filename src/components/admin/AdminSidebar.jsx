import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-[250px] min-h-screen bg-[#147a3f] text-white p-6">

      <h2 className="text-2xl font-bold mb-8">
        NutraFYI Admin
      </h2>

      <div className="flex flex-col gap-4">

        <Link to="/admin">
          Dashboard
        </Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/categories">
          Categories
        </Link>

      </div>

    </div>
  );
}

export default AdminSidebar;