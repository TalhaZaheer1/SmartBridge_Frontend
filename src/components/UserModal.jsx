import { useState, useEffect } from "react";

const UserModal = ({ user, onClose, onSave }) => {
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
      alert("Please fill all required fields.");
      return;
    }

    const formattedForm = {
      ...form,
      feeRatio: form.feeRatio ? parseFloat(form.feeRatio) : 0,
      storeLevel: form.storeLevel || "800U", // fallback if empty
    };

    onSave(formattedForm); // pass to parent
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h3>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border p-2 rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border p-2 rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="store">Store</option>
            <option value="customer">Customer</option>
          </select>
          <input
            name="storeLevel"
            value={form.storeLevel}
            onChange={handleChange}
            placeholder="Store Level (e.g. Gold)"
            className="w-full border p-2 rounded"
          />
          <input
            name="feeRatio"
            value={form.feeRatio}
            onChange={handleChange}
            placeholder="Fee Ratio (e.g. 0.1)"
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
