import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // ആകെ പേജുകളുടെ എണ്ണം ബാക്ക് എൻഡിൽ നിന്ന് എടുക്കാൻ

  const ITEMS_PER_PAGE = 12;

  const { search } = useContext(SearchContext);
  const { cart, addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const navigate = useNavigate();

  // ഫിൽട്ടറുകളും പേജും മാറുമ്പോൾ ബാക്ക് എൻഡിൽ നിന്ന് കൃത്യമായ ഡാറ്റ മാത്രം എടുക്കുന്നു
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ബാക്ക് എൻഡ് റൂട്ടിലേക്ക് എല്ലാ ഫിൽട്ടറുകളും ക്വറിയായി അയക്കുന്നു
        let url = `/products?isActive=true&page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
        
        if (search) url += `&search=${search}`;
        // Note: ബാക്ക് എൻഡിൽ പ്രൈസ്/സോർട്ട് ഫിൽട്ടർ ഇല്ലെങ്കിൽ അത് ഫ്രണ്ട് എൻഡിൽ ചെയ്യാൻ താഴെ കൊടുത്തിട്ടുണ്ട്

        const res = await api.get(url);

        // ബാക്ക് എൻഡ് ഒബ്ജക്റ്റ് ഫോർമാറ്റിലാണ് ഡാറ്റ തരുന്നത്: { products: [], totalPages: X }
        if (res.data && res.data.products) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [currentPage, search]); // പേജോ സെർച്ചോ മാറുമ്പോൾ API വീണ്ടും റൺ ചെയ്യും

  // ഫിൽട്ടറുകൾ മാറുമ്പോൾ ഒന്നാമത്തെ പേജിലേക്ക് തിരികെ പോകാൻ
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

  // പ്രൈസ് ഫിൽട്ടറും സോർട്ടിംഗും ഫ്രണ്ട് എൻഡിൽ തന്നെ നിലനിർത്തിയിരിക്കുന്നു
  const processedProducts = [...(products || [])]
    .filter((item) => (maxPrice ? item.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

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
            {processedProducts.map((item) => {
              const isInCart = cart.some((c) => c._id === item._id);

              return (
                <div
                  key={item._id}
                  className="group border border-gray-200 bg-white hover:shadow-lg transition relative"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={() =>
                      requireLogin(() => {
                        isInWishlist(item._id)
                          ? removeFromWishlist(item._id)
                          : addToWishlist(item);
                      })
                    }
                    className="absolute top-3 right-3 z-20 text-xl hover:scale-110 transition"
                  >
                    {isInWishlist(item._id) ? (
                      <FaHeart className="text-red-600" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>

                  {/* Product Image Link */}
                  <Link to={`/product/${item._id}`}>
                    <div className="h-80 flex items-center justify-center p-6 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="px-5 pb-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {item.brand || "SNEAKPEAK"}
                        </p>
                        <h3 className="text-base font-bold uppercase truncate max-w-[150px]">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase mt-1">
                          {item.color || "Premium"}
                        </p>
                      </div>

                      {/* Cart Button */}
                      {isInCart ? (
                        <button
                          onClick={() => navigate("/cart")}
                          className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition"
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
                          className="border border-black w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition"
                        >
                          <FaPlus />
                        </button>
                      )}
                    </div>

                    <p className="mt-4 text-lg font-semibold">₹{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 border-t pt-6">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border font-medium bg-white hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border font-medium transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border font-medium bg-white hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}