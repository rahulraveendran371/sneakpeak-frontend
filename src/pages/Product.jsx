import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { cart, addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  // 1. പ്രൊഡക്റ്റ് ഡാറ്റ എടുക്കാനും ഇൻആക്റ്റീവ് ആണെങ്കിൽ തടയാനുമുള്ള useEffect
  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        const productData = res.data;

        // പ്രൊഡക്റ്റ് Deactivate ചെയ്തിട്ടുണ്ടെങ്കിൽ ഹോം പേജിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
        if (productData && productData.isActive === false) {
          toast.error("This product is currently unavailable");
          navigate("/", { replace: true });
          return;
        }

        setProduct(productData);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Product not found");
        navigate("/", { replace: true });
      });
  }, [id, navigate]);

  // 2. പ്രൊഡക്റ്റ് ഓൾറെഡി കാർട്ടിൽ ഉണ്ടോ എന്ന് നോക്കാനുള്ള useEffect
  useEffect(() => {
    if (product && cart.find((item) => item._id === product._id)) {
      setAdded(true);
    }
  }, [cart, product]);

  const requireLogin = (callback) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.warning("Please login to continue");
      navigate("/login");
      return;
    }

    callback();
  };

  const handleAddToCart = () => {
    requireLogin(() => {
      addToCart({ ...product, qty: quantity });
      toast.success("Added to cart");
      setAdded(true);
    });
  };

  const handleBuyNow = () => {
    requireLogin(() => {
      addToCart({ ...product, qty: quantity });
      navigate("/checkout");
    });
  };

  if (!product) {
    return (
      <div className="p-10 text-center text-lg font-semibold">
        Loading product...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-10 relative">
          <button
            onClick={() =>
              requireLogin(() =>
                isInWishlist(product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)
              )
            }
            className="absolute top-4 right-4 text-2xl hover:scale-110 transition"
          >
            {isInWishlist(product._id) ? (
              <FaHeart className="text-red-600" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500" />
            )}
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="max-h-[420px] object-contain mix-blend-multiply"
          />
        </div>

        {/* Product Info Section */}
        <div>
          <h1 className="text-4xl font-bold mb-3">{product.name}</h1>

          <p className="text-gray-500 capitalize mb-2">
            Category: {product.category}
          </p>

          <p className="text-2xl font-semibold mb-6">₹{product.price}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity</span>
            <div className="flex border rounded">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="px-6 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!added ? (
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>
            ) : (
              <button
                onClick={() => navigate("/cart")}
                className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition"
              >
                View Cart
              </button>
            )}

            <button
              onClick={handleBuyNow}
              className="border border-black px-8 py-3 rounded hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details (Dynamic ആക്കിയത്) */}
          <div className="mt-10">
            <h3 className="font-semibold mb-2">Product Details</h3>
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