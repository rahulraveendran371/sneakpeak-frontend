import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/orders?userId=${user._id}`
        );

        const data = Array.isArray(res.data)
          ? res.data
          : [];

        setOrders(data);
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN").format(
      amount
    );

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return date;
    }
  };

  return (
    <>
      <Navbar />

      {!user ? (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">

          <h2 className="text-3xl font-bold mb-4">
            Please Login
          </h2>

          <p className="text-gray-500 mb-6">
            Login to view your orders.
          </p>

          <Link
            to="/login"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Login
          </Link>

        </div>
      ) : loading ? (
        <div className="min-h-[60vh] flex items-center justify-center text-lg font-medium">
          Loading orders...
        </div>
      ) : error ? (
        <div className="min-h-[60vh] flex items-center justify-center text-red-600 font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">

          <h2 className="text-3xl font-bold mb-4">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mb-6">
            Start shopping to place your
            first order.
          </p>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>

        </div>
      ) : (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            My Orders
          </h1>

          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-6 mb-6 bg-white shadow-sm"
            >

              <p className="text-sm text-gray-500 mb-2">
                Ordered on:{" "}
                {formatDate(order.date)}
              </p>

              <p className="mb-4">
                <span className="font-semibold">
                  Status:
                </span>{" "}
                <span
                  className={`font-semibold ${
                    order.status ===
                    "Delivered"
                      ? "text-green-600"
                      : order.status ===
                        "Shipped"
                      ? "text-blue-600"
                      : order.status ===
                        "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status ||
                    "Placed"}
                </span>
              </p>

              {order.items?.map(
                (item, index) => (
                  <div
                    key={
                      item.id ||
                      item._id ||
                      index
                    }
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.name} ×{" "}
                      {item.qty}
                    </span>

                    <span>
                      ₹
                      {formatPrice(
                        item.price *
                          item.qty
                      )}
                    </span>
                  </div>
                )
              )}

              <hr className="my-4" />

              <p className="font-bold text-right text-lg">
                Total: ₹
                {formatPrice(
                  order.total
                )}
              </p>

            </div>
          ))}
        </div>
      )}
    </>
  );
}