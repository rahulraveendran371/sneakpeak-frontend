import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-10">All Products</h1>

        {processedProducts.length === 0 ? (
          <div className="text-center text-gray-500 my-10">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {processedProducts.map((item) => (
              <div
                key={item._id}
                className="group border border-gray-200 bg-white hover:shadow-lg transition relative"
              >
                <button
                  onClick={() =>
                    requireLogin(() =>
                      isInWishlist(item._id)
                        ? removeFromWishlist(item._id)
                        : addToWishlist(item)
                    )
                  }
                  className="absolute top-3 right-3 z-20 text-xl"
                >
                  {isInWishlist(item._id) ? (
                    <FaHeart className="text-red-600" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </button>

                <Link to={`/product/${item._id}`}>
                  <div className="h-80 flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <h3 className="font-bold uppercase truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold">₹{item.price}</p>
                    <button
                      onClick={() =>
                        requireLogin(() => {
                          addToCart(item);
                          toast.success("Added");
                        })
                      }
                      className="border border-black p-2 hover:bg-black hover:text-white"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ PAGINATION UI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 hover:bg-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`dots-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 border transition font-medium ${
                    currentPage === page
                      ? "bg-black text-white border-black"
                      : "border-gray-300 hover:bg-black hover:text-white"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 hover:bg-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Optional: Page info text */}
        {totalPages > 1 && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Page {currentPage} of {totalPages}
          </p>
        )}

      </div>
    </>
  );
}