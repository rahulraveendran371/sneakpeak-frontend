import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";
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

      <div className="p-8 bg-white min-h-screen">

        <h1 className="text-3xl font-bold mb-10">
          Women Sneakers
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {paginatedProducts.map((item) => {

            const isInCart = cart.some(
              (c) => c._id === item._id
            );

            return (

              <div
                key={item._id}
                className="group border border-gray-200 bg-white hover:shadow-lg transition relative"
              >

                <button
                  onClick={() =>
                    requireLogin(() => {

                      isInWishlist(item._id)
                        ? removeFromWishlist(item._id)
                        : addToWishlist(item);

                    })
                  }
                  className="absolute top-3 right-3 text-xl z-20 hover:scale-110 transition"
                >

                  {isInWishlist(item._id) ? (
                    <FaHeart className="text-red-600" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-red-500" />
                  )}

                </button>

                <Link to={`/product/${item._id}`}>

                  <div className="h-80 flex items-center justify-center p-6 overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />

                  </div>

                </Link>

                <div className="px-5 pb-5">

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-base font-bold uppercase">
                        {item.name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {item.brand || "Brand"}
                      </p>

                    </div>

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
                        className="border w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition"
                      >
                        <FaPlus />
                      </button>

                    )}

                  </div>

                  <p className="mt-4 text-lg font-semibold">
                    ₹{item.price}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

        {totalPages > 1 && (

          <div className="flex justify-center gap-2 mt-12">

            {[...Array(totalPages)].map((_, i) => {

              const page = i + 1;

              return (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>

              );

            })}

          </div>

        )}

      </div>
    </>
  );
}