import { useState, useEffect } from "react";

const PermissionModal = ({ user, onClose, onSave }) => {
  const [permissions, setPermissions] = useState({
    submissions: false,
    pto: false,
    salaries: false,
    reports: false,
  });

  useEffect(() => {
    if (user?.permissions) setPermissions(user.permissions);
  }, [user]);

  const handleToggle = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    onSave(permissions); // Pass new permissions back
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Manage Access for {user.name}</h3>
        <div className="space-y-3">
          {Object.keys(permissions).map((key) => (
            <div key={key} className="flex justify-between items-center border p-2 rounded">
              <span className="capitalize">{key}</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions[key]}
                  onChange={() => handleToggle(key)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="text-gray-500 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
