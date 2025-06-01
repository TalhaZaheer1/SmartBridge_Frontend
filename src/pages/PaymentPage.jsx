import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { API_IMAGE_URL } from "./Dashboard/Admin/AdminProducts";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const PaymentPage = () => {
  const [config, setConfig] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/payment/config`);
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        toast.error(t("payment.loadFail"));
      }
    };

    fetchConfig();
  }, [t]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(t("payment.copySuccess"));
  };

  if (!config) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        {t("payment.loading")}
      </div>
    );
  }

  const {
    wechatQr,
    wechatId,
    usdtQr,
    usdtAddress,
    description1,
    description2,
  } = config;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("payment.title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WeChat Section */}
          {wechatQr && (
            <div className="bg-white shadow rounded-lg p-4 border">
              <h2 className="text-xl font-semibold mb-3">{t("payment.wechat.title")}</h2>
              <img
                src={`${API_IMAGE_URL.replace(/\/$/, "")}/${wechatQr.replace(/^\/+/, "")}`}
                alt="QR"
                className="w-full h-auto"
                onError={() => console.error("Image failed to load")}
                crossOrigin="anonymous"
              />




              <div className="mt-4 flex items-center">
                <span className="font-medium">{t("payment.wechat.id")}:</span>
                <span className="ml-2">{wechatId}</span>
                <button
                  onClick={() => handleCopy(wechatId)}
                  className="ml-3 text-blue-600 hover:text-blue-800"
                  title="Copy WeChat ID"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          )}

          {/* USDT Section */}
          {usdtQr && (
            <div className="bg-white shadow rounded-lg p-4 border">
              <h2 className="text-xl font-semibold mb-3">{t("payment.usdt.title")}</h2>
              <img
                src={`${API_IMAGE_URL.replace(/\/$/, "")}/${usdtQr.replace(/^\/+/, "")}`}
                alt="QR"
                className="w-full h-auto"
                onError={() => console.error("Image failed to load")}
                crossOrigin="anonymous"
              />

              <div className="mt-4 flex items-center">
                <span className="font-medium">{t("payment.usdt.address")}:</span>
                <span className="ml-2 break-all">{usdtAddress}</span>
                <button
                  onClick={() => handleCopy(usdtAddress)}
                  className="ml-3 text-blue-600 hover:text-blue-800"
                  title="Copy Wallet Address"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Descriptions */}
        <div className="mt-8 space-y-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-1">
              {t("payment.descriptions.howItWorks")}
            </h3>
            <p className="text-gray-700">{description1}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-1">
              {t("payment.descriptions.features")}
            </h3>
            <p className="text-gray-700">{description2}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
