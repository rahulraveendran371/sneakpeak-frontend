import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPackage, FiHeart, FiLogOut, FiChevronRight } from "react-icons/fi";

export default function Account() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Avatar initials ഉണ്ടാക്കുന്നു — "Rahul Kumar" → "RK"
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 pb-10">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-sm border border-gray-100">

        {/* Cover banner */}
        <div className="h-20 bg-black" />

        {/* Avatar */}
        <div className="flex justify-center -mt-8 mb-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-blue-700 text-xl font-semibold">
            {getInitials(user.name)}
          </div>
        </div>

        {/* Name & subtitle */}
        <p className="text-center text-lg font-semibold text-gray-900">{user.name}</p>
        <p className="text-center text-sm text-gray-400 mb-5">Member account</p>

        {/* Info section */}
        <div className="border-t border-gray-100 px-6 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <FiUser className="text-gray-400 text-lg" />
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-gray-400 text-lg" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-100 px-6 py-4 space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left"
          >
            <FiPackage className="text-gray-500 text-lg" />
            <span className="flex-1 text-sm font-medium text-gray-700">My Orders</span>
            <FiChevronRight className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left"
          >
            <FiHeart className="text-gray-500 text-lg" />
            <span className="flex-1 text-sm font-medium text-gray-700">My Wishlist</span>
            <FiChevronRight className="text-gray-300" />
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}