import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (!user) return;

    const fetchOrders = async () => {

      try {

        const res = await api.get(`/orders?userId=${user._id}`);

        setOrders(res.data);

      } catch (err) {

        console.error("Error fetching orders", err);

      }

    };

    fetchOrders();

    // auto refresh every 3 seconds
    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);

  }, [user]);

  return (
    <>
      <Navbar />

      {!user ? (

        <div className="p-10 text-center">

          <h2 className="text-2xl font-bold mb-4">
            Please login to view your orders
          </h2>

          <Link
            to="/login"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Login
          </Link>

        </div>

      ) : orders.length === 0 ? (

        <div className="p-10 text-center">

          <h2 className="text-2xl font-bold mb-4">
            No Orders Yet
          </h2>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="p-8 max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            My Orders
          </h1>

          {orders.map((order) => (

            <div
              key={order._id}
              className="border rounded-lg p-6 mb-6 bg-white shadow-sm"
            >

              <p className="text-sm text-gray-500 mb-2">
                Ordered on: {order.date}
              </p>

              <p className="mb-4">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Shipped"
                      ? "text-blue-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status || "Placed"}
                </span>
              </p>

              {order.items?.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between text-sm mb-2"
                >

                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    ₹{item.price * item.qty}
                  </span>

                </div>

              ))}

              <hr className="my-4" />

              <p className="font-bold text-right text-lg">
                Total: ₹{order.total}
              </p>

            </div>

          ))}

        </div>

      )}
    </>
  );
}