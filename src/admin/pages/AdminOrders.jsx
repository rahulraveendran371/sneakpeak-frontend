import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Placed", "Shipped", "Delivered", "Cancelled"];
const ITEMS_PER_PAGE = 6;

const STATUS_COLORS = {
  Placed: "bg-blue-100 text-blue-700",
  Shipped: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const [ordersRes, usersRes] = await Promise.all([
        api.get("/orders"),
        api.get("/users"),
      ]);

      setOrders(ordersRes.data);
      setUsers(usersRes.data);

    } catch {

      toast.error("Failed to load orders");

    } finally {

      setLoading(false);

    }

  };

  const getUserName = (userId) => {

    const user = users.find((u) => u._id === userId);

    return user ? user.name : "Unknown";

  };

  const filteredOrders = orders.filter((order) =>
    getUserName(order.userId)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const updateStatus = async (orderId, newStatus) => {

    try {

      await api.patch(`/orders/${orderId}`, { status: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success("Order status updated");

    } catch {

      toast.error("Failed to update status");

    }

  };

  if (loading) {

    return (
      <div className="text-center py-20 text-gray-500">
        Loading orders...
      </div>
    );

  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-3xl font-bold text-gray-800">
          Orders Management
        </h1>

        <input
          type="text"
          placeholder="🔍 Search by user name"
          value={search}
          onChange={(e) => {

            setSearch(e.target.value);
            setCurrentPage(1);

          }}
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-black outline-none"
        />

      </div>

      {/* TABLE */}

      {paginatedOrders.length === 0 ? (

        <p className="text-center text-gray-500 py-10">
          No orders found
        </p>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">

              <tr>

                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>

              </tr>

            </thead>

            <tbody>

              {paginatedOrders.map((order) => (

                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-mono text-xs">
                    {order._id}
                  </td>

                  <td className="p-4 font-medium">
                    {getUserName(order.userId)}
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    ₹{order.total}
                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-2">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[order.status || "Placed"]
                        }`}
                      >
                        {order.status || "Placed"}
                      </span>

                      <select
                        value={order.status || "Placed"}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >

                        {STATUS_OPTIONS.map((status) => (

                          <option key={status} value={status}>
                            {status}
                          </option>

                        ))}

                      </select>

                    </div>

                  </td>

                  <td className="p-4 text-gray-500 text-xs">
                    {order.date}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2 pt-4">

          {[...Array(totalPages)].map((_, i) => {

            const page = i + 1;

            return (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page === currentPage
                    ? "bg-black text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >

                {page}

              </button>

            );

          })}

        </div>

      )}

    </div>

  );

}
