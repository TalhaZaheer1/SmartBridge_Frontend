import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import Table from "../../../components/Table";
import { API_URL } from "../../../api/recruiter";
import { useTranslation } from "react-i18next";

export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || "http://localhost:5000";

const AdminProducts = () => {
  const { t } = useTranslation();

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

      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(t("product.fetchError"));
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

      toast.success(t("product.created"));
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
      toast.error(t("product.createError"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("product.confirmDelete"))) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(t("product.deleted"));
      fetchProducts();
    } catch (err) {
      toast.error(t("product.deleteError"));
    }
  };

  return (
    <div className="text-white min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("product.title")}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          <FaPlus className="inline mr-2" />
          {t("product.addProduct")}
        </button>
      </div>

      <Table
        headers={[
          t("product.image"),
          t("product.productTitle"),
          t("product.price"),
          t("product.category"),
          t("product.storeLevels"),
          t("product.actions"),
        ]}
        rows={products.map((p) => [
          <img
            src={`${API_IMAGE_URL}${p.image}`}
            alt={p.title}
            className="w-14 h-14 object-cover rounded"
          />,
          p.title,
          `$${p.price}`,
          p.category,
          (p.storeLevels || []).join(", "),
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-500 hover:underline"
              title={t("product.delete")}
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
            <h3 className="text-lg font-semibold mb-4">{t("product.addProduct")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("product.productTitle")}
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder={t("product.category")}
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder={t("product.price")}
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder={t("product.storeLevelsPlaceholder")}
                value={newProduct.storeLevels}
                onChange={(e) => setNewProduct({ ...newProduct, storeLevels: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <textarea
                placeholder={t("product.description")}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border px-3 py-2 rounded md:col-span-2"
              />
              <input type="file" onChange={handleFileChange} className="md:col-span-2" />
              <button
                onClick={handleCreate}
                className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 md:col-span-2"
              >
                {t("product.submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
