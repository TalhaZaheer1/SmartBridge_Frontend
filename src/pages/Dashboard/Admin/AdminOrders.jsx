import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import Table from "../../../components/Table";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = Array.isArray(res.data.orders) ? res.data.orders : [];
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(t("adminOrders.toast.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/admin/export/csv`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error(t("adminOrders.toast.csvFail"));
    }
  };

  const exportPDF = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/admin/export/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error(t("adminOrders.toast.pdfFail"));
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(t("adminOrders.toast.statusUpdated"));
      fetchOrders();
    } catch (err) {
      toast.error(t("adminOrders.toast.statusFail"));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50 text-gray-900">
      {/* Header + Export Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold">{t("adminOrders.title")}</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2 border"
          >
            <FaDownload /> {t("adminOrders.exportCSV")}
          </button>
          <button
            onClick={exportPDF}
            className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2 border"
          >
            <FaDownload /> {t("adminOrders.exportPDF")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <Table
          headers={[
            t("adminOrders.headers.product"),
            t("adminOrders.headers.category"),
            t("adminOrders.headers.buyer"),
            t("adminOrders.headers.vendor"),
            t("adminOrders.headers.price"),
            t("adminOrders.headers.fee"),
            t("adminOrders.headers.total"),
            t("adminOrders.headers.status"),
            t("adminOrders.headers.date"),
          ]}
          rows={orders.map((order) => [
            order.product?.title || "N/A",
            order.product?.category || "N/A",
            order.buyer?.name || "N/A",
            order.vendor?.name || "N/A",
            `$${order.price.toFixed(2)}`,
            `$${order.fee.toFixed(2)}`,
            `$${order.total.toFixed(2)}`,
            <select
              key={order._id}
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 px-2 py-1 rounded text-sm"
            >
              <option value="placed">{t("adminOrders.status.placed")}</option>
              <option value="cancelled">{t("adminOrders.status.cancelled")}</option>
              <option value="delivered">{t("adminOrders.status.delivered")}</option>
            </select>,
            new Date(order.createdAt).toLocaleDateString(),
          ])}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
