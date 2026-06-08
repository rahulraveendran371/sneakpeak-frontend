import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../context/SearchContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaShoppingCart, FaBoxOpen, FaBars, FaTimes, FaSearch } from "react-icons/fa";

export default function Navbar({ showPriceFilter, maxPrice, setMaxPrice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { search, setSearch } = useContext(SearchContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-white after:w-full"
      : "text-gray-400 hover:text-white after:w-0 hover:after:w-full";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (location.pathname === "/") navigate("/products");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("user-changed"));
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        .nav-link {
          position: relative;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          height: 1px;
          background: white;
          transition: width 0.3s ease;
        }
        .logo-text {
          font-family: 'Bebas Neue', cursive;
          letter-spacing: 0.05em;
        }
        .search-input {
          font-family: 'Outfit', sans-serif;
        }
        .badge {
          animation: popIn 0.2s ease;
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <nav
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-2xl border-b border-white/5"
            : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="logo-text text-white text-3xl tracking-wider group-hover:text-gray-300 transition-colors">
                SNEAK
              </span>
              <span className="logo-text text-3xl" style={{ color: "#e11d48" }}>
                PEAK
              </span>
            </Link>

            {/* CENTER NAV LINKS — desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { path: "/products", label: "All" },
                { path: "/men", label: "Men" },
                { path: "/women", label: "Women" },
              ].map(({ path, label }) => (
                <Link key={path} to={path} className={`nav-link ${isActive(path)}`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* RIGHT SECTION */}
            <div className="hidden lg:flex items-center gap-5">

              {/* Search bar */}
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-500 text-xs" />
                <input
                  type="text"
                  placeholder="Search sneakers..."
                  value={search}
                  onChange={handleSearch}
                  className="search-input pl-8 pr-4 py-1.5 w-48 bg-white/5 border border-white/10 rounded-full text-white text-xs placeholder-gray-500 focus:outline-none focus:border-white/40 focus:w-56 transition-all duration-300"
                />
              </div>

              {/* Price filter */}
              {showPriceFilter && (
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="search-input px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 text-xs focus:outline-none focus:border-white/40"
                >
                  <option value="">All Prices</option>
                  <option value="2000">Under ₹2000</option>
                  <option value="4000">Under ₹4000</option>
                  <option value="6000">Under ₹6000</option>
                  <option value="8000">Under ₹8000</option>
                </select>
              )}

              {/* Icons */}
              {user && (
                <div className="flex items-center gap-4">
                  <Link to="/orders" className="text-gray-400 hover:text-white transition-colors" title="Orders">
                    <FaBoxOpen className="text-base" />
                  </Link>

                  <Link to="/wishlist" className="relative text-gray-400 hover:text-white transition-colors" title="Wishlist">
                    <FaHeart className="text-base" />
                    {wishlist.length > 0 && (
                      <span className="badge absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors" title="Cart">
                    <FaShoppingCart className="text-base" />
                    {cart.length > 0 && (
                      <span className="badge absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* User */}
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/account")}
                    className="text-xs font-medium text-gray-300 hover:text-white border border-white/20 px-3 py-1.5 rounded-full hover:border-white/50 transition-all"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {user.name.split(" ")[0]}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-full transition-all"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-xs font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-gray-100 transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}
                >
                  LOGIN
                </button>
              )}
            </div>

            {/* MOBILE: icons + hamburger */}
            <div className="flex lg:hidden items-center gap-4">
              {user && (
                <>
                  <Link to="/wishlist" className="relative text-gray-400">
                    <FaHeart className="text-sm" />
                    {wishlist.length > 0 && (
                      <span className="badge absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative text-gray-400">
                    <FaShoppingCart className="text-sm" />
                    {cart.length > 0 && (
                      <span className="badge absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white text-lg focus:outline-none"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-screen border-t border-white/10" : "max-h-0"
          } bg-black/98`}
        >
          <div className="px-6 py-6 flex flex-col gap-5">

            {/* Search mobile */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={search}
                onChange={handleSearch}
                className="search-input w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Links */}
            {[
              { path: "/products", label: "All Products" },
              { path: "/men", label: "Men" },
              { path: "/women", label: "Women" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="nav-link text-gray-400 hover:text-white text-sm py-1 border-b border-white/5"
              >
                {label}
              </Link>
            ))}

            {user && (
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="nav-link text-gray-400 hover:text-white text-sm py-1 border-b border-white/5"
              >
                My Orders
              </Link>
            )}

            {/* Auth buttons */}
            <div className="flex gap-3 pt-2">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate("/account"); setIsOpen(false); }}
                    className="flex-1 text-sm font-medium text-white border border-white/20 py-2 rounded-full"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Hi, {user.name.split(" ")[0]}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 text-sm font-medium bg-rose-600 text-white py-2 rounded-full"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setIsOpen(false); }}
                  className="w-full text-sm font-semibold bg-white text-black py-2.5 rounded-full"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
