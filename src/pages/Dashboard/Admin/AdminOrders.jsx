import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import Table from "../../../components/Table";
import { API_URL } from "../../../api/recruiter";
import { useTranslation } from "react-i18next";

const AdminOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
      toast.error(t("orders.loadError"));
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
      link.setAttribute("download", "orders.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error(t("orders.exportCSVError"));
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
      toast.error(t("orders.exportPDFError"));
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
      toast.success(t("orders.statusUpdated"));
      fetchOrders();
    } catch (err) {
      toast.error(t("orders.statusUpdateError"));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="text-white min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("orders.title")}</h2>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            <FaDownload className="inline mr-2" /> {t("orders.exportCSV")}
          </button>
          <button
            onClick={exportPDF}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            <FaDownload className="inline mr-2" /> {t("orders.exportPDF")}
          </button>
        </div>
      </div>

      <Table
        headers={[
          t("orders.product"),
          t("orders.category"),
          t("orders.buyer"),
          t("orders.vendor"),
          t("orders.price"),
          t("orders.fee"),
          t("orders.total"),
          t("orders.status"),
          t("orders.date"),
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
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            className="bg-black text-white border px-2 py-1 rounded"
          >
            <option value="placed">{t("orders.placed")}</option>
            <option value="cancelled">{t("orders.cancelled")}</option>
            <option value="delivered">{t("orders.delivered")}</option>
          </select>,
          new Date(order.createdAt).toLocaleDateString(),
        ])}
        loading={loading}
      />
    </div>
  );
};

export default AdminOrders;
