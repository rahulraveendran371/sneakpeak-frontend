import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const logout = () => {

    // Remove login data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-64 bg-black text-white p-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">

          <NavLink
            to="/admin"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block p-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            Orders
          </NavLink>

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
          >
            Logout
          </button>

        </nav>
      </aside>
    </>
  );
}
