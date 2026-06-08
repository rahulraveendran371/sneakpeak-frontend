import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {

      const res = await api.get("/products");

      // FIX: support both array and {products:[]}
      const data = res.data.products || res.data;

      setProducts(data);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load products");

    }
  };

  const handleSoftDelete = async (id) => {

    try {

      const product = products.find((p) => p._id === id);

      await api.patch(`/products/${id}`, {
        isActive: !product.isActive,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, isActive: !p.isActive }
            : p
        )
      );

      toast.success(
        product.isActive
          ? "Product deactivated"
          : "Product restored"
      );

    } catch {

      toast.error("Action failed");

    }
  };

  const filteredProducts = products
    .filter((p) =>
      category ? p.category === category : true
    )
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );

  const statusBadge = (active) =>
    active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Product Management
        </h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full border-collapse text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  No products found
                </td>
              </tr>
            ) : (

              filteredProducts.map((product) => (

                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4 capitalize">
                    {product.category}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(
                        product.isActive
                      )}`}
                    >
                      {product.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 space-x-4">

                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleSoftDelete(product._id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      {product.isActive
                        ? "Deactivate"
                        : "Restore"}
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}