import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (user) => {
    try {

      await api.patch(`/users/${user._id}`, {
        isBlocked: !user.isBlocked
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, isBlocked: !u.isBlocked }
            : u
        )
      );

      toast.success(
        user.isBlocked ? "User unblocked" : "User blocked"
      );

    } catch {
      toast.error("Action failed");
    }
  };

  const toggleDeleteUser = async (user) => {

    const confirm = window.confirm(
      user.isActive
        ? "Are you sure you want to delete this user?"
        : "Restore this user?"
    );

    if (!confirm) return;

    try {

      await api.patch(`/users/${user._id}`, {
        isActive: !user.isActive
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, isActive: !u.isActive }
            : u
        )
      );

      toast.success(
        user.isActive
          ? "User deleted successfully"
          : "User restored successfully"
      );

    } catch {
      toast.error("Delete action failed");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map(user => (

              <tr
                key={user._id}
                className={`border-t ${
                  !user.isActive ? "bg-gray-100 opacity-70" : ""
                }`}
              >

                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>

                <td className="p-3 text-center">

                  {!user.isActive ? (
                    <span className="text-gray-500 font-semibold">
                      Deleted
                    </span>
                  ) : user.isBlocked ? (
                    <span className="text-red-600 font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  )}

                </td>

                <td className="p-3 text-center space-x-3">

                  <Link
                    to={`/admin/users/${user._id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>

                  {user.isActive && (
                    <button
                      onClick={() => toggleBlockUser(user)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}

                  <button
                    onClick={() => toggleDeleteUser(user)}
                    className={`px-3 py-1 rounded text-white ${
                      user.isActive
                        ? "bg-gray-800"
                        : "bg-blue-600"
                    }`}
                  >
                    {user.isActive ? "Delete" : "Restore"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}