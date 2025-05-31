import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error(t("contact1.error"));
    toast.success(t("contact1.success"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-3xl mx-auto px-4 py-16 mt-16">
      <h2 className="text-3xl font-bold mb-6">{t("contact1.title")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={t("contact1.name")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          placeholder={t("contact1.email")}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder={t("contact1.message")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border px-4 py-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          {t("contact1.submit")}
        </button>
      </form>
    </div>
    </>
  );
};

export default Contact;
