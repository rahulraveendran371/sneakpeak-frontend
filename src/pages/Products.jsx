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
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 12;
  const { search } = useContext(SearchContext);
  const { cart, addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // API റൂട്ട് ശരിയാണെന്ന് ഉറപ്പാക്കുക
        let url = `/products?page=${currentPage}&limit=${ITEMS_PER_PAGE}&isActive=true`;
        if (search) url += `&search=${search}`;

        const res = await api.get(url);

        // ഡാറ്റാ ഫോർമാറ്റ് പരിശോധിക്കുന്നു
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

  return (
    <>
      <Navbar showPriceFilter maxPrice={maxPrice} setMaxPrice={setMaxPrice} sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-10">All Products</h1>
        {processedProducts.length === 0 ? (
          <div className="text-center text-gray-500 my-10">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {processedProducts.map((item) => (
              <div key={item._id} className="group border border-gray-200 bg-white hover:shadow-lg transition relative">
                <button onClick={() => requireLogin(() => isInWishlist(item._id) ? removeFromWishlist(item._id) : addToWishlist(item))} className="absolute top-3 right-3 z-20 text-xl">
                  {isInWishlist(item._id) ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-gray-400" />}
                </button>
                <Link to={`/product/${item._id}`}>
                  <div className="h-80 flex items-center justify-center p-6 overflow-hidden">
                    <img src={item.image} alt={item.name} className="max-h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <h3 className="font-bold uppercase truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold">₹{item.price}</p>
                    <button onClick={() => requireLogin(() => { addToCart(item); toast.success("Added"); })} className="border border-black p-2 hover:bg-black hover:text-white">
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}