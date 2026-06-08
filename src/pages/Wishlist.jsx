import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Wishlist() {

  const { wishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  return (
    <>
      <Navbar />

      {wishlist.length === 0 ? (

        <div className="p-10 text-center">

          <h2 className="text-2xl font-bold mb-4">
            Your Wishlist is Empty
          </h2>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Explore Products
          </Link>

        </div>

      ) : (

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            My Wishlist
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {wishlist.map((item) => (

              <div
                key={item._id}
                className="border p-4 rounded"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 mx-auto object-contain"
                />

                <h3 className="mt-3 font-semibold">
                  {item.name}
                </h3>

                <p className="text-gray-600">
                  ₹{item.price}
                </p>

                <button
                  onClick={() => addToCart({ ...item, qty: 1 })}
                  className="mt-3 w-full bg-black text-white py-2 rounded"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(item._id)
                  }
                  className="mt-2 w-full border py-2 rounded hover:bg-gray-100"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        </div>

      )}
    </>
  );
}