import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminPaymentPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    wechatId: "",
    usdtAddress: "",
    description1: "",
    description2: "",
  });
  const [wechatQr, setWechatQr] = useState(null);
  const [usdtQr, setUsdtQr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${API_URL}/payment/config`);
        setFormData({
          wechatId: res.data.wechatId || "",
          usdtAddress: res.data.usdtAddress || "",
          description1: res.data.description1 || "",
          description2: res.data.description2 || "",
        });
      } catch (err) {
        toast.error(t("payment1.loadError"));
      }
    };

    fetchConfig();
  }, [t]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "wechatQr") setWechatQr(files[0]);
    if (name === "usdtQr") setUsdtQr(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
    if (wechatQr) payload.append("wechatQr", wechatQr);
    if (usdtQr) payload.append("usdtQr", usdtQr);

    try {
      await axios.post(`${API_URL}/payment/update`, payload);
      toast.success(t("payment1.success"));
    } catch (err) {
      toast.error(t("payment1.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-6">{t("payment1.title")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">{t("payment1.wechatId")}</label>
          <input
            type="text"
            name="wechatId"
            value={formData.wechatId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">{t("payment1.wechatQr")}</label>
          <input
            type="file"
            name="wechatQr"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium">{t("payment1.usdtAddress")}</label>
          <input
            type="text"
            name="usdtAddress"
            value={formData.usdtAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">{t("payment1.usdtQr")}</label>
          <input
            type="file"
            name="usdtQr"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium">{t("payment1.description1")}</label>
          <textarea
            name="description1"
            value={formData.description1}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">{t("payment1.description2")}</label>
          <textarea
            name="description2"
            value={formData.description2}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? t("payment1.updating") : t("payment1.updateBtn")}
        </button>
      </form>
    </div>
  );
};

export default AdminPaymentPage;
