import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Women() {

  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const { search } = useContext(SearchContext);
  const { cart, addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchProducts = async () => {

      try {

            const res = await api.get(
  "/products?category=women&isActive=true&limit=1000"
);

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(data);

      } catch (error) {

        console.error(error);
        setProducts([]);

      }

    };

    fetchProducts();

  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, maxPrice, sortOrder]);

  const requireLogin = (callback) => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.warning("Please login to continue");
      navigate("/login");
      return;
    }

    callback();

  };

  const filteredProducts = [...(products || [])]
    .filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      maxPrice ? item.price <= Number(maxPrice) : true
    )
    .sort((a, b) => {

      if (sortOrder === "low-high") return a.price - b.price;

      if (sortOrder === "high-low") return b.price - a.price;

      return 0;

    });

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar
        showPriceFilter
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">

          {/* Header */}
          <div className="flex items-end justify-between mb-10 border-b border-neutral-200 pb-6">
            <div>
              <p className="text-xs tracking-[0.2em] text-neutral-400 font-semibold uppercase mb-2">
                Collection
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                Women Sneakers
              </h1>
            </div>
            <p className="hidden sm:block text-sm text-neutral-400">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-32">
              <FaShoppingBag className="text-5xl text-neutral-200 mb-4" />
              <p className="text-neutral-400 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">

              {paginatedProducts.map((item) => {

                const isInCart = cart.some(
                  (c) => c._id === item._id
                );

                return (

                  <div
                    key={item._id}
                    className="group relative flex flex-col rounded-2xl bg-white border border-neutral-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                  >

                    {/* Wishlist button */}
                    <button
                      onClick={() =>
                        requireLogin(() => {

                          isInWishlist(item._id)
                            ? removeFromWishlist(item._id)
                            : addToWishlist(item);

                        })
                      }
                      className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-base hover:scale-110 transition-transform"
                    >

                      {isInWishlist(item._id) ? (
                        <FaHeart className="text-red-600" />
                      ) : (
                        <FaRegHeart className="text-neutral-400" />
                      )}

                    </button>

                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="block">
                      <div className="relative h-72 bg-gradient-to-b from-neutral-100 to-neutral-50 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.04),_transparent_70%)]" />
                        <img
                          src={item.image}
                          alt={item.name}
                          className="relative z-10 max-h-[85%] max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex flex-col flex-1 px-5 pt-4 pb-5">

                      <div className="flex justify-between items-start gap-2">

                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {item.brand || "Brand"}
                          </p>
                        </div>

                        {isInCart ? (
                          <button
                            onClick={() => navigate("/cart")}
                            className="shrink-0 rounded-full border border-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                          >
                            View Cart
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              requireLogin(() => {

                                addToCart(item);
                                toast.success("Added to cart");

                              })
                            }
                            className="shrink-0 w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-700 active:scale-95 transition-all"
                            aria-label="Add to cart"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        )}

                      </div>

                      <p className="mt-auto pt-4 text-lg font-bold text-neutral-900">
                        ₹{item.price}
                      </p>

                    </div>

                  </div>

                );

              })}

            </div>
          )}

          {/* PAGINATION UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">

              {[...Array(totalPages)].map((_, i) => {

                const page = i + 1;

                return (

                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-neutral-900 text-white shadow-md"
                        : "text-neutral-500 border border-transparent hover:border-neutral-300 hover:text-neutral-900"
                    }`}
                  >
                    {page}
                  </button>

                );

              })}

            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs text-neutral-400 mt-4 tracking-wide">
              Page {currentPage} of {totalPages}
            </p>
          )}

        </div>
      </div>
    </>
  );
}