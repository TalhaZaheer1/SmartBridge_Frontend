import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../api/recruiter";
import { useTranslation } from "react-i18next";

const VerifyOtp = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = location?.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error(t("otp.enterOtpError"));
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || t("otp.invalidOtp"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 bg-white border shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {t("otp.title")}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          {t("otp.description")} <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t("otp.placeholder")}
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 text-sm rounded hover:bg-gray-800 transition"
          >
            {t("otp.button")}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          {t("otp.note")}
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
