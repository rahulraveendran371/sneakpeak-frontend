import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function UserDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      
      const userRes = await api.get(`/users/${id}`);
      setUser(userRes.data);

      
      const orderRes = await api.get(`/orders?userId=${id}`);
      setOrders(orderRes.data);

    } catch (error) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user details...</p>;

  if (!user) return <p>User not found</p>;

  
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        User Details
      </h1>

      
      <div className="bg-white p-6 rounded shadow mb-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <p className="mt-2">
          <strong>Status:</strong>{" "}
          {user.isBlocked ? (
            <span className="text-red-600 font-semibold">
              Blocked
            </span>
          ) : (
            <span className="text-green-600 font-semibold">
              Active
            </span>
          )}
        </p>
      </div>

      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Spent</h3>
          <p className="text-2xl font-bold">₹{totalSpent}</p>
        </div>
      </div>

      
      <button
        onClick={() => navigate("/admin/users")}
        className="underline"
      >
        ← Back to Users
      </button>
    </div>
  );
}
