import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import Navbar from "../components/Navbar";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cart, addToCart } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/products/${id}`,
          {
            signal: controller.signal,
          }
        );

        const productData = res.data;

        if (
          productData &&
          productData.isActive === false
        ) {
          toast.error(
            "This product is currently unavailable"
          );

          navigate("/", {
            replace: true,
          });

          return;
        }

        setProduct(productData);
      } catch (err) {
        if (err.name === "CanceledError") return;

        console.error(err);

        setError("Product not found");

        toast.error("Product not found");

        navigate("/", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id, navigate]);

  const alreadyInCart = useMemo(() => {
    if (!product) return false;

    return cart.some(
      (item) => item._id === product._id
    );
  }, [cart, product]);

  const requireLogin = (callback) => {
    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      user = null;
    }

    if (!user) {
      toast.warning(
        "Please login to continue"
      );

      navigate("/login");

      return;
    }

    callback();
  };

  const handleWishlistToggle = () => {
    requireLogin(() => {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        toast.info(
          "Removed from wishlist"
        );
      } else {
        addToWishlist(product);
        toast.success(
          "Added to wishlist"
        );
      }
    });
  };

  const handleAddToCart = () => {
    requireLogin(() => {
      for (
        let i = 0;
        i < quantity;
        i++
      ) {
        addToCart(product);
      }

      toast.success(
        "Added to cart"
      );
    });
  };

  const handleBuyNow = () => {
    requireLogin(() => {
      for (
        let i = 0;
        i < quantity;
        i++
      ) {
        addToCart(product);
      }

      navigate("/checkout");
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-lg font-semibold">
          Loading product...
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-red-500 font-semibold">
          {error || "Product not found"}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-10 relative">

          <button
            onClick={
              handleWishlistToggle
            }
            className="absolute top-4 right-4 text-2xl hover:scale-110 transition"
          >
            {isInWishlist(
              product._id
            ) ? (
              <FaHeart className="text-red-600" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500" />
            )}
          </button>

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x400?text=No+Image";
            }}
            className="max-h-[420px] object-contain mix-blend-multiply"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold mb-3">
            {product.name}
          </h1>

          <p className="text-gray-500 capitalize mb-2">
            Category:{" "}
            {product.category}
          </p>

          <p className="text-2xl font-semibold mb-6">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">
              Quantity
            </span>

            <div className="flex border rounded">

              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.max(1, q - 1)
                  )
                }
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                −
              </button>

              <span className="px-6 py-2 font-semibold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((q) =>
                    q + 1
                  )
                }
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>

            </div>
          </div>

          <div className="flex flex-wrap gap-4">

            {!alreadyInCart ? (
              <button
                onClick={
                  handleAddToCart
                }
                className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition"
              >
                Add To Cart
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate("/cart")
                }
                className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition"
              >
                View Cart
              </button>
            )}

            <button
              onClick={
                handleBuyNow
              }
              className="border border-black px-8 py-3 rounded hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>

          </div>

          <div className="mt-10">
            <h3 className="font-semibold mb-2">
              Product Details
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description ||
                "Premium quality shoes designed for comfort, durability, and everyday style. Perfect for casual wear and lifestyle use."}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}