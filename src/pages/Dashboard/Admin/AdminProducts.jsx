import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import Table from "../../../components/Table";
import { API_URL } from "../../../api/recruiter";

export const API_IMAGE_URL= import.meta.env.VITE_API_IMAGE_URL || "http://localhost:5000";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    storeLevels: "",
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Ensure it's an array before setting
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load products");
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Product created");
      setNewProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        storeLevels: "",
        image: null,
      });
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="text-white min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          <FaPlus className="inline mr-2" />
          Add Product
        </button>
      </div>

      <Table
        headers={["Image", "Title", "Price", "Category", "Store Levels", "Actions"]}
        rows={products.map((p) => [
          <img src={`${API_IMAGE_URL}${p.image}`} alt={p.title} className="w-14 h-14 object-cover rounded" />,
          p.title,
          `$${p.price}`,
          p.category,
          (p.storeLevels || []).join(", "),
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-500 hover:underline"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>,
        ])}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white text-black w-full max-w-2xl rounded p-6 relative">
            <button
              className="absolute top-2 right-2 text-black hover:text-red-600"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Store Levels (comma-separated)"
                value={newProduct.storeLevels}
                onChange={(e) => setNewProduct({ ...newProduct, storeLevels: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border px-3 py-2 rounded md:col-span-2"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="md:col-span-2"
              />
              <button
                onClick={handleCreate}
                className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 md:col-span-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
