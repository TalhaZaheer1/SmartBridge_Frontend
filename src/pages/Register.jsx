import { useState } from "react";
import { register } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error(t("register.error.fillFields"));
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error(t("register.error.invalidEmail"));
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success(t("register.error.success"));
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || t("register.error.fail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-md border rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 w-full md:w-1/2 p-10">
          <img src="/store-register.svg" alt="Register" className="max-w-xs" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {t("register.title")}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {t("register.subtitle")}
          </p>

          {/* Role Selection */}
          <div className="flex gap-2 justify-center mb-4">
            {["store", "candidate"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                disabled={form.role === role}
                className={`px-4 py-1 text-sm rounded-full transition ${
                  form.role === role
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t(`register.${role}`)}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("register.fullName")}
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("register.email")}
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder={t("register.phone")}
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder={t("register.password")}
                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-gray-600"
              >
                {showPassword ? t("register.hide") : t("register.show")}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-900 transition"
            >
              {loading ? t("register.creating") : t("register.signUp")}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              {t("register.agreeText")}{" "}
              <a href="#" className="underline">{t("register.terms")}</a>{" "}
              {t("register.and")}{" "}
              <a href="#" className="underline">{t("register.privacy")}</a>。
            </p>
            <p className="text-sm text-center mt-3">
              {t("register.haveAccount")}{" "}
              <a href="/login" className="text-black font-medium">
                {t("register.login")}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
