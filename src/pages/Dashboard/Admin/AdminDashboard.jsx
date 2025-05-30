import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaUserClock,
  FaPlusCircle,
  FaFileAlt,
  FaDollarSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAdminDashboard } from "../../../api/dashboard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const navigate = useNavigate();

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetchAdminDashboard();
      setStats({
        totalUsers: res.totalUsers || 0,
        totalOrders: res.totalOrders || 0,
        totalRevenue: res.totalRevenue || 0,
        recentOrders: res.recentOrders || [],
      });
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  fetchStats();
}, []);


  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      bg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: FaClipboardList,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      icon: FaDollarSign,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  const lineData = stats.recentOrders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    amount: order.amount,
  }));

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bg} rounded-xl shadow-md p-6 flex items-center gap-4`}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Icon className={`${card.iconColor} text-3xl`} />
              </motion.div>
              <div>
                <p className="text-gray-600 text-sm">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  <CountUp end={card.value} duration={1.5} />
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No recent order data available.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <button
            onClick={() => navigate("/dashboard/admin/users")}
            className="bg-indigo-50 text-indigo-700 p-3 rounded flex items-center gap-2 hover:bg-indigo-100 transition"
          >
            <FaPlusCircle /> Add New User
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/reports")}
            className="bg-green-50 text-green-700 p-3 rounded flex items-center gap-2 hover:bg-green-100 transition"
          >
            <FaFileAlt /> View Reports
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/orders")}
            className="bg-yellow-50 text-yellow-700 p-3 rounded flex items-center gap-2 hover:bg-yellow-100 transition"
          >
            <FaClipboardList /> View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
