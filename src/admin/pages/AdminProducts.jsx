import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      setProducts(data);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const product = products.find((p) => p._id === id);

      if (!product) {
        toast.error("Product not found");
        return;
      }

      const confirmAction = window.confirm(
        product.isActive
          ? "Deactivate this product?"
          : "Restore this product?"
      );

      if (!confirmAction) return;

      const updatedProduct = {
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        isActive: !product.isActive,
      };

      await api.put(`/products/${id}`, updatedProduct);

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, isActive: !p.isActive }
            : p
        )
      );

      toast.success(
        product.isActive
          ? "Product deactivated successfully"
          : "Product restored successfully"
      );
    } catch (error) {
      console.error("Deactivate Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update product"
      );
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

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading products...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Product Management
        </h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          + Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* TABLE */}
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        product.isActive
                      )}`}
                    >
                      {product.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product._id}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleSoftDelete(product._id)
                      }
                      className={
                        product.isActive
                          ? "text-red-600 hover:underline"
                          : "text-green-600 hover:underline"
                      }
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