import { useState } from "react";
import { login } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const Login = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      toast.error(t("login.error.empty"));
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);
      const { token, user } = res;
      localStorage.setItem("token", token);
      toast.success(t("login.error.success"));

      const role = user?.role;
      if (role === "admin") {
        navigate(`/dashboard/${role}`);
      } else {
        navigate("/payment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("login.error.fail"));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-md border rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 w-full md:w-1/2 p-10">
          <img src="/store-login.svg" alt="eCommerce Illustration" className="max-w-xs" />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t("login.title")}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {t("login.subtitle")}
          </p>

          {/* OAuth */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center border rounded py-2 bg-white hover:bg-gray-50 transition text-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" />
              {t("login.google")}
            </button>
            <button
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center border rounded py-2 bg-white hover:bg-gray-50 transition text-sm"
            >
              <img src="https://www.svgrepo.com/show/349375/github.svg" className="w-5 h-5 mr-2" />
              {t("login.github")}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={t("login.phone")}
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t("login.password")}
                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-gray-600"
              >
                {showPassword ? t("login.hide") : t("login.show")}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-900 transition"
            >
              {loading ? t("login.signingIn") : t("login.signIn")}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            {t("login.noAccount")}{" "}
            <a href="/register" className="text-black font-medium">
              {t("login.signup")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
