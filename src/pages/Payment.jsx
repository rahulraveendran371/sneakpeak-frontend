import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Payment() {

  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePayment = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.warning("Please login to place order");
      navigate("/login");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Cart is empty");
      navigate("/products");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const orderData = {

      userId: user._id,

      items: cart.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        qty: item.qty
      })),

      total,
      paymentMethod,
      status: "Placed",
      date: new Date().toLocaleString()

    };

    try {

      await api.post("/orders", orderData);

      clearCart();

      toast.success("Payment successful 🎉");

      setTimeout(() => {
        navigate("/orders", { replace: true });
      }, 500);

    } catch (error) {

      console.error(error);

      toast.error("Order failed. Please try again.");

    }

  };

  if (!cart || cart.length === 0) {

    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">
          No items to pay for
        </h2>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Payment
        </h1>

        <p className="text-lg mb-6 text-center">
          Amount to Pay:{" "}
          <span className="font-bold text-green-600">
            ₹{total}
          </span>
        </p>

        <div className="space-y-4 mb-6">

          <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="Credit / Debit Card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit / Debit Card
          </label>

          <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="UPI"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI (GPay / PhonePe / Paytm)
          </label>

          <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="Google Pay"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Google Pay
          </label>

          <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Pay Now
        </button>

      </div>

    </div>

  );

}