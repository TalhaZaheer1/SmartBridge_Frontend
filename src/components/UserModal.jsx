import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const UserModal = ({ user, onClose, onSave }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "store", // store or customer
    password: "",
    storeLevel: "",
    category: "",
    feeRatio: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        ...form,
        ...user,
        password: "", // clear password for editing
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.role || (!user && !form.password)) {
      alert(t("userModal.fillAllFields"));
      return;
    }

    const formattedForm = {
      ...form,
      feeRatio: form.feeRatio ? parseFloat(form.feeRatio) : 0,
      storeLevel: form.storeLevel || "800U",
    };

    onSave(formattedForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">
          {user ? t("userModal.editUser") : t("userModal.addUser")}
        </h3>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t("userModal.fullName")}
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("userModal.email")}
            type="email"
            className="w-full border p-2 rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={t("userModal.phone")}
            className="w-full border p-2 rounded"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("userModal.password")}
            type="password"
            className="w-full border p-2 rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="store">{t("userModal.store")}</option>
            <option value="customer">{t("userModal.customer")}</option>
          </select>
          <input
            name="storeLevel"
            value={form.storeLevel}
            onChange={handleChange}
            placeholder={t("userModal.storeLevel")}
            className="w-full border p-2 rounded"
          />
          <input
            name="feeRatio"
            value={form.feeRatio}
            onChange={handleChange}
            placeholder={t("userModal.feeRatio")}
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            {t("userModal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {t("userModal.saveUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
