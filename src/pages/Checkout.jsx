import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">
          No items to checkout
        </h2>
      </div>
    );
  }

  
  const handleProceed = () => {
    
    if (!fullName || !address || !city || !pincode) {
      setError("All fields are required");
      return;
    }

  
    if (/\d/.test(fullName)) {
      setError("Full name should not contain numbers");
      return;
    }

    if (/\d/.test(city)) {
      setError("City should not contain numbers");
      return;
    }

    
    if (!/^\d+$/.test(pincode)) {
      setError("Pincode should contain only numbers");
      return;
    }

    
    if (pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      return;
    }

    setError("");
    navigate("/payment");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      
      <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Shipping Address
        </h2>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>

      
      <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        {cart.map((item) => (
          <p key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </p>
        ))}

        <hr className="my-3" />

        <p className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </p>
      </div>

      <button
        onClick={handleProceed}
        className="w-full bg-black text-white py-3 rounded"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
