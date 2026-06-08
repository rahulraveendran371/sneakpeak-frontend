import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import api from "../services/api";

export default function Payment() {
  const { cart, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [cart]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN").format(amount);

  const handlePayment = async () => {
    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      user = null;
    }

    if (!user) {
      toast.warning("Please login to place order");
      navigate("/login");
      return;
    }

    if (!cart.length) {
      toast.error("Cart is empty");
      navigate("/products");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const shippingAddress = JSON.parse(
      localStorage.getItem("shippingAddress") || "null"
    );

    const orderData = {
      userId: user._id,

      items: cart.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        qty: item.qty,
      })),

      shippingAddress,

      total,

      paymentMethod,

      status: "Placed",

      date: new Date().toISOString(),
    };

    try {
      setLoading(true);

      await api.post("/orders", orderData);

      clearCart();

      localStorage.removeItem("shippingAddress");

      toast.success(
        "Order placed successfully 🎉"
      );

      navigate("/orders", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <>
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            No items to pay for
          </h2>

          <p className="text-gray-500 mb-6">
            Your cart is currently empty.
          </p>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

        <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Payment
          </h1>

          <p className="text-lg mb-6 text-center">
            Amount to Pay:{" "}
            <span className="font-bold text-green-600">
              ₹{formatPrice(total)}
            </span>
          </p>

          <div className="space-y-4 mb-6">

            <label className="flex items-center gap-3 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="Credit / Debit Card"
                checked={
                  paymentMethod ===
                  "Credit / Debit Card"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />
              Credit / Debit Card
            </label>

            <label className="flex items-center gap-3 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={
                  paymentMethod === "UPI"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />
              UPI (GPay / PhonePe / Paytm)
            </label>

            <label className="flex items-center gap-3 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="Google Pay"
                checked={
                  paymentMethod ===
                  "Google Pay"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />
              Google Pay
            </label>

            <label className="flex items-center gap-3 border p-4 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={
                  paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />
              Cash on Delivery
            </label>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Pay Now"}
          </button>

        </div>
      </div>
    </>
  );
}