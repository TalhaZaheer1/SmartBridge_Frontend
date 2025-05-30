import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPaymentPage = () => {
  const [formData, setFormData] = useState({
    wechatId: "",
    usdtAddress: "",
    description1: "",
    description2: "",
  });
  const [wechatQr, setWechatQr] = useState(null);
  const [usdtQr, setUsdtQr] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing payment config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payment/config");
        setFormData({
          wechatId: res.data.wechatId || "",
          usdtAddress: res.data.usdtAddress || "",
          description1: res.data.description1 || "",
          description2: res.data.description2 || "",
        });
      } catch (err) {
        toast.error("Failed to load payment config");
      }
    };

    fetchConfig();
  }, []);

  // Input field change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File input change handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "wechatQr") setWechatQr(files[0]);
    if (name === "usdtQr") setUsdtQr(files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
    if (wechatQr) payload.append("wechatQr", wechatQr);
    if (usdtQr) payload.append("usdtQr", usdtQr);

    try {
      await axios.post("http://localhost:5000/api/payment/update", payload);
      toast.success("Payment config updated successfully");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-6">Admin – Payment Page Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* WeChat ID */}
        <div>
          <label className="block font-medium">WeChat ID</label>
          <input
            type="text"
            name="wechatId"
            value={formData.wechatId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* WeChat QR Upload */}
        <div>
          <label className="block font-medium">WeChat QR Code</label>
          <input
            type="file"
            name="wechatQr"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* USDT Wallet Address */}
        <div>
          <label className="block font-medium">USDT Wallet Address (TRC20)</label>
          <input
            type="text"
            name="usdtAddress"
            value={formData.usdtAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* USDT QR Upload */}
        <div>
          <label className="block font-medium">USDT Wallet QR Code</label>
          <input
            type="file"
            name="usdtQr"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block font-medium">Description 1: How Payment Works</label>
          <textarea
            name="description1"
            value={formData.description1}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description 2: Store-Level Benefits</label>
          <textarea
            name="description2"
            value={formData.description2}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Config"}
        </button>
      </form>
    </div>
  );
};

export default AdminPaymentPage;
