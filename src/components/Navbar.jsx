import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaShoppingCart, FaBoxOpen, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ showPriceFilter, maxPrice, setMaxPrice }) {
  const [isOpen, setIsOpen] = useState(false); // മൊബൈൽ മെനു ടോഗിൾ ചെയ്യാൻ

  const { search, setSearch } = useContext(SearchContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isActive = (path) =>
    location.pathname === path
      ? "border-b-2 border-white font-bold"
      : "hover:border-b-2 hover:border-gray-400";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (location.pathname === "/") {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("user-changed"));
    navigate("/login");
  };

  return (
    <nav className="w-full bg-black text-white px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* --- LEFT SECTION: LOGO & HAMBURGER --- */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter">
            SneakPeak
          </Link>
          
          {/* മൊബൈലിൽ മാത്രം കാണിക്കുന്ന ടോഗിൾ ബട്ടൺ */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl lg:hidden focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* --- CENTER SECTION: SEARCH & FILTERS (മൊബൈലിലും ലാപ്ടോപ്പിലും ഫിറ്റാകും) --- */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-1/3">
          <input
            type="text"
            placeholder="Search sneakers..."
            value={search}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-800 outline-none focus:border-white text-sm"
          />

          {showPriceFilter && (
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded bg-neutral-900 text-white border border-neutral-800 text-sm focus:border-white"
            >
              <option value="">All Prices</option>
              <option value="2000">Under ₹2000</option>
              <option value="4000">Under ₹4000</option>
              <option value="6000">Under ₹6000</option>
              <option value="8000">Under ₹8000</option>
            </select>
          )}
        </div>

        {/* --- RIGHT SECTION: NAVIGATION LINKS --- */}
        {/* മൊബൈലിൽ ഓപ്പൺ ചെയ്യുമ്പോൾ താഴേക്ക് വരും, ലാപ്ടോപ്പിൽ വശങ്ങളിൽ വരും */}
        <div className={`${isOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full lg:w-auto mt-2 lg:mt-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-800`}>
          
          {/* മെയിൻ പ്രൊഡക്റ്റ് റൂട്ടുകൾ */}
          <ul className="flex flex-col lg:flex-row gap-4 lg:gap-6 text-sm font-medium uppercase tracking-wide">
            <li>
              <Link to="/products" className={`pb-1 inline-block ${isActive("/products")}`}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/men" className={`pb-1 inline-block ${isActive("/men")}`}>
                Men
              </Link>
            </li>
            <li>
              <Link to="/women" className={`pb-1 inline-block ${isActive("/women")}`}>
                Women
              </Link>
            </li>
          </ul>

          {/* കാർട്ട്, വിഷ്‌ലിസ്റ്റ്, ഓർഡേഴ്‌സ് ഐക്കണുകൾ */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 text-sm font-medium uppercase">
            {user && (
              <>
                <Link to="/orders" className={`flex items-center gap-2 pb-1 ${isActive("/orders")}`}>
                  <FaBoxOpen className="text-base" />
                  <span>Orders</span>
                </Link>

                <Link to="/wishlist" className={`relative flex items-center gap-2 pb-1 ${isActive("/wishlist")}`}>
                  <FaHeart className="text-base text-red-500 lg:text-white" />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className={`relative flex items-center gap-2 pb-1 ${isActive("/cart")}`}>
                  <FaShoppingCart className="text-base" />
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* യൂസർ പ്രൊഫൈൽ & ലോഗൗട്ട് ബട്ടണുകൾ */}
            <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/account")}
                    className="bg-white text-black text-xs font-bold px-3 py-2 rounded hover:bg-gray-200 transition text-left"
                  >
                    Hi, {user.name}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-xs font-bold px-3 py-2 rounded hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-black text-xs font-bold px-5 py-2 rounded hover:bg-gray-200 transition w-full lg:w-auto"
                >
                  Login
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}