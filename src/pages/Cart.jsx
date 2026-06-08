import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useContext(CartContext);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );
  }, [cart]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN").format(
      amount
    );

  return (
    <>
      <Navbar />

      {cart.length === 0 ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

          <FaShoppingCart className="text-6xl text-gray-300 mb-4" />

          <h2 className="text-3xl font-bold mb-3">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mb-6">
            Looks like you haven't added
            anything yet.
          </p>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <div className="p-4 md:p-8">

          <h1 className="text-3xl font-bold mb-8">
            Your Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {cart.map((item) => (

                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-4 hover:shadow-md transition"
                >

                  <Link
                    to={`/product/${item._id}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                      className="h-24 w-24 object-contain"
                    />
                  </Link>

                  <div className="flex-1 w-full">

                    <Link
                      to={`/product/${item._id}`}
                    >
                      <h3 className="font-semibold hover:text-blue-600 transition">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mt-1">
                      ₹{formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">

                      <button
                        onClick={() =>
                          decreaseQty(item._id)
                        }
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="font-semibold min-w-[20px] text-center">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item._id)
                        }
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>

                    </div>

                    <p className="mt-3 font-semibold">
                      Subtotal: ₹
                      {formatPrice(
                        item.price * item.qty
                      )}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                    className="text-red-600 font-semibold hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* SUMMARY */}
            <div className="border rounded-lg p-6 h-fit lg:sticky lg:top-24">

              <h2 className="text-xl font-bold mb-6">
                Price Details
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span>
                    ₹{formatPrice(totalPrice)}
                  </span>
                </div>

              </div>

              <Link
                to="/checkout"
                className="block text-center bg-black text-white py-3 rounded mt-6 hover:bg-gray-800 transition"
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