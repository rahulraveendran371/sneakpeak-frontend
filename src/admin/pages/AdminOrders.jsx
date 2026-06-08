import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  "Placed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

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
      setLoading(true);

      const [ordersRes, usersRes] = await Promise.all([
        api.get("/orders"),
        api.get("/users"),
      ]);

      setOrders(
        Array.isArray(ordersRes.data)
          ? ordersRes.data
          : []
      );

      setUsers(
        Array.isArray(usersRes.data)
          ? usersRes.data
          : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const usersMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user._id] = user.name;
      return acc;
    }, {});
  }, [users]);

  const getUserName = (userId) => {
    return usersMap[userId] || "Unknown";
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN").format(
      amount || 0
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return date;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchValue =
      search.toLowerCase();

    return (
      getUserName(order.userId)
        .toLowerCase()
        .includes(searchValue) ||
      order._id
        ?.toLowerCase()
        .includes(searchValue) ||
      (order.status || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      await api.patch(
        `/orders/${orderId}`,
        {
          status: newStatus,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      toast.success(
        "Order status updated"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
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
          placeholder="Search by customer, order ID or status"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-80 focus:ring-2 focus:ring-black outline-none"
        />

      </div>

      {/* TABLE */}

      {paginatedOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">

              <tr>
                <th className="p-4 text-left">
                  Order ID
                </th>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>
              </tr>

            </thead>

            <tbody>

              {paginatedOrders.map(
                (order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-mono text-xs">
                      {order._id}
                    </td>

                    <td className="p-4 font-medium">
                      {getUserName(
                        order.userId
                      )}
                    </td>

                    <td className="p-4 font-semibold text-gray-800">
                      ₹
                      {formatPrice(
                        order.total
                      )}
                    </td>

                    <td className="p-4">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[
                              order.status ||
                                "Placed"
                            ]
                          }`}
                        >
                          {order.status ||
                            "Placed"}
                        </span>

                        <select
                          value={
                            order.status ||
                            "Placed"
                          }
                          onChange={(e) =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          {STATUS_OPTIONS.map(
                            (
                              status
                            ) => (
                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {
                                  status
                                }
                              </option>
                            )
                          )}
                        </select>

                      </div>

                    </td>

                    <td className="p-4 text-gray-500 text-xs">
                      {formatDate(
                        order.createdAt ||
                          order.date
                      )}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4 flex-wrap">

          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage ===
                  index + 1
                    ? "bg-black text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            )
          )}

        </div>
      )}

    </div>
  );
}