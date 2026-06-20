import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus, FaChevronLeft, FaChevronRight, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 12;
  const { search } = useContext(SearchContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `/products?page=${currentPage}&limit=${ITEMS_PER_PAGE}&isActive=true`;
        if (search) url += `&search=${search}`;

        const res = await api.get(url);
        const data = res.data;

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [currentPage, search]);

  // ✅ Search മാറുമ്പോൾ page 1-ലേക്ക് reset ചെയ്യണം
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const requireLogin = (callback) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to continue");
      navigate("/login");
      return;
    }
    callback();
  };

  const processedProducts = [...products]
    .filter((item) => (maxPrice ? item.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  // ✅ Pagination helper — page numbers array ഉണ്ടാക്കുന്നു
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // കൂടുതൽ pages ഉണ്ടെങ്കിൽ ... കാണിക്കും

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

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
                All Products
              </h1>
            </div>
            <p className="hidden sm:block text-sm text-neutral-400">
              {processedProducts.length} item{processedProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {processedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-32">
              <FaShoppingBag className="text-5xl text-neutral-200 mb-4" />
              <p className="text-neutral-400 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {processedProducts.map((item) => (
                <div
                  key={item._id}
                  className="group relative flex flex-col rounded-2xl bg-white border border-neutral-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                >
                  {/* Wishlist button */}
                  <button
                    onClick={() =>
                      requireLogin(() =>
                        isInWishlist(item._id)
                          ? removeFromWishlist(item._id)
                          : addToWishlist(item)
                      )
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
                    <h3 className="font-semibold text-neutral-800 text-sm uppercase tracking-wide truncate">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <p className="text-lg font-bold text-neutral-900">
                        ₹{item.price}
                      </p>
                      <button
                        onClick={() =>
                          requireLogin(() => {
                            addToCart(item);
                            toast.success("Added");
                          })
                        }
                        className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-700 active:scale-95 transition-all"
                        aria-label="Add to cart"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-600 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`dots-${index}`} className="px-1 text-neutral-300 select-none">
                    ···
                  </span>
                ) : (
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
                )
              )}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-600 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronRight className="text-xs" />
              </button>
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