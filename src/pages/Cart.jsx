import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Cart() {

  const { cart, removeFromCart, increaseQty, decreaseQty } =
    useContext(CartContext);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <Navbar />

      {cart.length === 0 ? (

        <div className="p-10 text-center">

          <h2 className="text-2xl font-bold mb-4">
            Your Cart is Empty
          </h2>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Shop Now
          </Link>

        </div>

      ) : (

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Your Cart
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="md:col-span-2 space-y-4">

              {cart.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center gap-4 border p-4 rounded"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 object-contain"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">

                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-3 py-1 border rounded"
                      >
                        −
                      </button>

                      <span className="font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-3 py-1 border rounded"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 font-semibold"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            <div className="border p-6 rounded h-fit">

              <h2 className="text-xl font-bold mb-4">
                Price Details
              </h2>

              <p className="flex justify-between mb-2">
                <span>Total Items</span>
                <span>{cart.length}</span>
              </p>

              <p className="flex justify-between mb-4 font-semibold">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </p>

              <Link
                to="/checkout"
                className="block text-center bg-black text-white py-2 rounded"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        </div>

      )}
    </>
  );

}