import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true); // പ്രൊഡക്റ്റ് സ്റ്റാറ്റസ് സൂക്ഷിക്കാൻ

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        const product = res.data;
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setIsActive(product.isActive); // ഡാറ്റാബേസിലെ നിലവിലെ സ്റ്റാറ്റസ് (true/false)
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product data");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault(); 

    if (!name || !price || !image || !category) {
      toast.error("All fields are required");
      return;
    }

    try {
      // ഡ്യൂപ്ലിക്കേറ്റ് ചെക്കിംഗ്
      const existing = await api.get(`/products?search=${name}`);
      const productList = existing.data.products || [];
      const duplicate = productList.find((p) => p._id !== id && p.name.toLowerCase() === name.toLowerCase());

      if (duplicate) {
        toast.error("Another product with the same name exists");
        return;
      }

      // പ്രധാന മാറ്റം ഇവിടെയാണ്: isActive കൃത്യമായി Boolean (true/false) ആയി മാറ്റുന്നു
      const updatedProduct = {
        name,
        price: Number(price),
        image,
        category,
        isActive: String(isActive) === "true" // സ്ട്രിങ് ആണെങ്കിൽ പോലും Boolean ആയി മാറും
      };

      // ബാക്ക് എൻഡിലേക്ക് അപ്‌ഡേറ്റ് റിക്വസ്റ്റ് അയക്കുന്നു
      await api.put(`/products/${id}`, updatedProduct);

      toast.success("Product updated successfully");
      navigate("/admin/products", { replace: true });

    } catch (error) {
      console.error("Update Error:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleUpdate}>
        {/* Product Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            value={name}
            className="border p-2 w-full"
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
          <input
            value={price}
            type="number"
            className="border p-2 w-full"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            value={image}
            className="border p-2 w-full"
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            className="border p-2 w-full"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        {/* Product Status (Deactivate ചെയ്യാനുള്ള ഡ്രോപ്പ്ഡൗൺ) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
          <select
            value={String(isActive)} // "true" അല്ലെങ്കിൽ "false" സ്ട്രിങ് ആയി സെലക്ട് കാണിക്കും
            className="border p-2 w-full bg-white"
            onChange={(e) => setIsActive(e.target.value === "true")} // സെലക്ട് ചെയ്യുമ്പോൾ മാറും
          >
            <option value="true">Active (Show in Store)</option>
            <option value="false">Inactive (Deactivate / Hide)</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-all"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}