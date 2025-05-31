import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiTrendingUp, FiCreditCard } from "react-icons/fi";


const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const Account = () => {
  const [profile, setProfile] = useState(null);
  const [recharges, setRecharges] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, rechargeRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/recharges/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/users/dashboard/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProfile(profileRes.data.user);
      setRecharges(rechargeRes.data.recharges || []);
      setDashboardStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-6 text-white space-y-8">
      <h2 className="text-3xl font-bold mb-2">My Account</h2>

      {/* Profile Info */}
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-xl font-semibold mb-2 text-teal-400">
          <FiUser /> Profile Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
          <p><strong>Phone:</strong> {profile?.phone || "N/A"}</p>
          <p><strong>Store Level:</strong> {profile?.storeLevel}</p>
          <p><strong>Balance:</strong> ${profile?.balance?.toFixed(2)}</p>
          <p><strong>Fee Ratio:</strong> {profile?.feeRatio}%</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-xl font-semibold text-yellow-400">
          <FiTrendingUp /> Dashboard Summary
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <p><strong>Total Orders:</strong> {dashboardStats?.orders || 0}</p>
          <p><strong>Total Spent:</strong> ${dashboardStats?.totalSpent?.toFixed(2) || 0}</p>
          <p><strong>Active Orders:</strong> {dashboardStats?.activeOrders || 0}</p>
        </div>
      </div>

      {/* Recharge History */}
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-xl font-semibold text-indigo-400">
          <FiCreditCard /> Recharge History
        </div>

        {recharges.length === 0 ? (
          <p className="text-sm text-gray-400">No recharge history found.</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full table-auto text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-600 text-left text-gray-300">
                  <th className="p-2 font-medium">Amount</th>
                  <th className="p-2 font-medium">Note</th>
                  <th className="p-2 font-medium">Date</th>
                  <th className="p-2 font-medium">Approved By</th>
                </tr>
              </thead>
              <tbody>
                {recharges.map((r, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="p-2">${r.amount}</td>
                    <td className="p-2">{r.note || "—"}</td>
                    <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-2">{r.approvedBy?.name || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
