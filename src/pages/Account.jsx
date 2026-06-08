import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16">
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          My Account
        </h2>

        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>

        
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full border py-2 rounded hover:bg-gray-100"
          >
            My Orders
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="w-full border py-2 rounded hover:bg-gray-100"
          >
            My Wishlist
          </button>

          <button
            onClick={logout}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
