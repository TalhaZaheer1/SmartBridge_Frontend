import { useEffect, useState } from "react";
import Table from "../../../components/Table";
import UserModal from "../../../components/UserModal";
import PermissionModal from "../../../components/PermissionModal";
import StatusBadge from "../../../components/StatusBadge";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser as deleteUserApi,
  adjustBalance,
  updatestatus,
} from "../../../api/user";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Users = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        toast.error(t("users.fetchError"));
      }
    };
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openPermissionModal = (user) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  const closeModals = () => {
    setSelectedUser(null);
    setShowUserModal(false);
    setShowPermissionModal(false);
  };

  const promptBalanceAdjust = async (user) => {
    const amountStr = prompt(t("users.promptAmount", { name: user.name }));
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return toast.error(t("users.invalidAmount"));

    const note = prompt(t("users.promptNote")) || "";

    try {
      const result = await adjustBalance(user._id, { amount, note });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? result.user : u)));
      toast.success(t("users.balanceAdjusted"));
    } catch (err) {
      console.error(err);
      toast.error(t("users.adjustFailed"));
    }
  };

  const saveUser = async (updatedUser) => {
    try {
      if (updatedUser._id) {
        const result = await updateUser(updatedUser._id, updatedUser);
        setUsers((prev) => prev.map((u) => (u._id === result._id ? result : u)));
        toast.success(t("users.updated"));
      } else {
        const result = await createUser(updatedUser);
        setUsers((prev) => [...prev, result]);
        toast.success(t("users.created"));
      }
      closeModals();
    } catch (error) {
      console.log(error);
      toast.error(t("users.saveError"));
    }
  };

  const updatePermissions = async (id, newPermissions) => {
    try {
      const user = users.find((u) => u._id === id);
      const updated = { ...user, permissions: newPermissions };
      const result = await updateUser(id, updated);
      setUsers((prev) => prev.map((u) => (u._id === id ? result : u)));
      toast.success(t("users.permissionsUpdated"));
    } catch {
      toast.error(t("users.permissionError"));
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u._id === id);
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const result = await updatestatus(id, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u._id === id ? result.user : u)));
      toast.success(t("users.statusUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(t("users.statusError"));
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm(t("users.confirmDelete"))) return;
    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success(t("users.deleted"));
    } catch {
      toast.error(t("users.deleteError"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("users.title")}</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={() => openModal()}
        >
          <FaPlus />
          {t("users.add")}
        </button>
      </div>

      <Table
        headers={[
          t("users.name"),
          t("users.email"),
          t("users.phone"),
          t("users.role"),
          t("users.status"),
          t("users.verified"),
          t("users.storeLevel"),
          t("users.feeRatio"),
          t("users.balance"),
          t("users.rechargeLogs"),
          t("users.createdAt"),
          t("users.actions"),
        ]}
        rows={users.map((user) => [
          user.name,
          user.email || "-",
          user.phone || "-",
          user.role,
          <StatusBadge status={user.status} />,
          user.isVerified ? "✅" : "❌",
          user.storeLevel || "-",
          `${user.feeRatio ?? 0}%`,
          `$${user.balance?.toFixed(2) || 0}`,
          <div className="text-xs max-w-[180px] overflow-x-auto">
            {(user.rechargeHistory || []).slice(0, 2).map((rec, i) => (
              <div key={i}>
                <div>💰 {rec.amount} - {new Date(rec.date).toLocaleDateString()}</div>
              </div>
            ))}
            {user.rechargeHistory?.length > 2 && (
              <div className="text-gray-400">+{user.rechargeHistory.length - 2} more</div>
            )}
          </div>,
          new Date(user.createdAt).toLocaleDateString(),
          <div className="flex gap-3 text-sm">
            <button onClick={() => openModal(user)} title={t("users.edit")} className="text-blue-600 hover:underline">
              <FaEdit />
            </button>
            <button onClick={() => promptBalanceAdjust(user)} title={t("users.adjust")} className="text-green-600 hover:underline">
              💰
            </button>
            <button onClick={() => toggleStatus(user._id)} title={t("users.toggle")} className="text-yellow-600 hover:underline">
              {user.status === "active" ? <FaToggleOff /> : <FaToggleOn />}
            </button>
            <button onClick={() => deleteUser(user._id)} title={t("users.delete")} className="text-red-600 hover:underline">
              <FaTrash />
            </button>
          </div>,
        ])}
      />

      {showUserModal && (
        <UserModal user={selectedUser} onClose={closeModals} onSave={saveUser} />
      )}

      {showPermissionModal && selectedUser && (
        <PermissionModal
          user={selectedUser}
          onClose={closeModals}
          onSave={(permissions) =>
            updatePermissions(selectedUser._id, permissions)
          }
        />
      )}
    </div>
  );
};

export default Users;
