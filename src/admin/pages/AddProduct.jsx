import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AddProduct() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("men");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {

    if (!name || !price || !image) {
      toast.error("All fields are required");
      return;
    }

    try {

      setLoading(true);

      await api.post("/products", {
        name,
        price: Number(price),
        image,
        category,
        isActive: true
      });

      toast.success("Product added successfully");

      navigate("/admin/products");

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-3xl mx-auto">

      <button
        onClick={() => navigate("/admin/products")}
        className="mb-6 text-sm text-gray-600 hover:underline"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Product
          </h1>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-semibold mb-1">
              Product Name
            </label>

            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Price (₹)
            </label>

            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Image URL
            </label>

            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Category
            </label>

            <select
              className="w-full border rounded-lg px-4 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">

            <button
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleAddProduct}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}