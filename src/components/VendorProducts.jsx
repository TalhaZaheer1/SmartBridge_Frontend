import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../api/recruiter";
import { useTranslation } from "react-i18next";

const VendorProducts = () => {
  const { t } = useTranslation();
  const [selectable, setSelectable] = useState([]);
  const [mine, setMine] = useState([]);
  const [category, setCategory] = useState("");

  const fetchSelectable = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/selectable`, {
        params: category ? { category } : {},
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (Array.isArray(res.data)) {
        setSelectable(res.data);
      } else {
        setSelectable([]);
        console.warn("Expected an array but got:", res.data);
      }
    } catch (err) {
      toast.error(t("vendor.toast.loadSelectableFail"));
      setSelectable([]);
    }
  };

  const fetchMine = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/mine`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (Array.isArray(res.data)) {
        setMine(res.data);
      } else {
        setMine([]);
        console.warn("Expected an array but got:", res.data);
      }
    } catch (err) {
      toast.error(t("vendor.toast.loadMineFail"));
      setMine([]);
    }
  };

  const adoptProduct = async (id) => {
    try {
      await axios.put(
        `${API_URL}/products/adopt/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(t("vendor.toast.adoptSuccess"));
      fetchSelectable();
      fetchMine();
    } catch (err) {
      toast.error(err.response?.data?.message || t("vendor.toast.adoptFail"));
    }
  };

  useEffect(() => {
    fetchSelectable();
    fetchMine();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t("vendor.selectProducts")}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={t("vendor.filterByCategory")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <button
          onClick={fetchSelectable}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {t("vendor.search")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectable.map((prod) => (
          <div key={prod._id} className="border p-4 rounded shadow-sm">
            <img
              src={prod.image}
              alt={prod.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{prod.title}</h3>
            <p className="text-gray-500">{prod.category}</p>
            <p className="text-sm text-gray-700">{prod.description}</p>
            <p className="font-bold mt-2">${prod.price}</p>
            <button
              onClick={() => adoptProduct(prod._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              {t("vendor.adoptProduct")}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">{t("vendor.myProducts")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mine.map((prod) => (
          <div key={prod._id} className="border p-4 rounded shadow-sm">
            <img
              src={prod.image}
              alt={prod.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{prod.title}</h3>
            <p className="text-gray-500">{prod.category}</p>
            <p className="font-bold mt-2">${prod.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;
