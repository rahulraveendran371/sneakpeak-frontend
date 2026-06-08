import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 8;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.toLowerCase();

    return users.filter(
      (user) =>
        user.name
          ?.toLowerCase()
          .includes(searchValue) ||
        user.email
          ?.toLowerCase()
          .includes(searchValue)
    );
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length /
      ITEMS_PER_PAGE
  );

  const paginatedUsers =
    filteredUsers.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE
    );

  const toggleBlockUser = async (
    user
  ) => {
    if (user.role === "admin") {
      toast.warning(
        "Admin accounts cannot be blocked"
      );
      return;
    }

    try {
      await api.patch(
        `/users/${user._id}`,
        {
          isBlocked:
            !user.isBlocked,
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                isBlocked:
                  !u.isBlocked,
              }
            : u
        )
      );

      toast.success(
        user.isBlocked
          ? "User unblocked"
          : "User blocked"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Action failed"
      );
    }
  };

  const toggleDeleteUser =
    async (user) => {
      const confirmed =
        window.confirm(
          user.isActive
            ? "Delete this user?"
            : "Restore this user?"
        );

      if (!confirmed) return;

      try {
        await api.patch(
          `/users/${user._id}`,
          {
            isActive:
              !user.isActive,
          }
        );

        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  isActive:
                    !u.isActive,
                }
              : u
          )
        );

        toast.success(
          user.isActive
            ? "User deleted"
            : "User restored"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Delete action failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-black outline-none"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Email
              </th>

              <th className="p-3 text-center">
                Role
              </th>

              <th className="p-3 text-center">
                Status
              </th>

              <th className="p-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedUsers.map(
              (user) => (
                <tr
                  key={user._id}
                  className={`border-t ${
                    !user.isActive
                      ? "bg-gray-100 opacity-70"
                      : ""
                  }`}
                >

                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold ${
                        user.role ===
                        "admin"
                          ? "text-purple-600"
                          : "text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

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

                  <td className="p-3 text-center space-x-2">

                    <Link
                      to={`/admin/users/${user._id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>

                    {user.role !==
                      "admin" &&
                      user.isActive && (
                        <button
                          onClick={() =>
                            toggleBlockUser(
                              user
                            )
                          }
                          className={`px-3 py-1 rounded text-white ${
                            user.isBlocked
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {user.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                      )}

                    {user.role !==
                      "admin" && (
                        <button
                          onClick={() =>
                            toggleDeleteUser(
                              user
                            )
                          }
                          className={`px-3 py-1 rounded text-white ${
                            user.isActive
                              ? "bg-gray-800"
                              : "bg-blue-600"
                          }`}
                        >
                          {user.isActive
                            ? "Delete"
                            : "Restore"}
                        </button>
                      )}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
                className={`px-4 py-2 rounded ${
                  currentPage ===
                  index + 1
                    ? "bg-black text-white"
                    : "bg-white border"
                }`}
              >
                {index + 1}
              </button>
            )
          )}

        </div>
      )}

    </div>
  );
}