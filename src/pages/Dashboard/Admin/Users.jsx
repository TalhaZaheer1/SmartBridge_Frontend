
import { useEffect, useState } from "react";
import Table from "../../../components/Table";
import UserModal from "../../../components/UserModal";
import PermissionModal from "../../../components/PermissionModal";
import StatusBadge from "../../../components/StatusBadge";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaShieldAlt } from "react-icons/fa";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser as deleteUserApi,
  adjustBalance,
} from "../../../api/user";
import toast from "react-hot-toast";
import { updatestatus } from "../../../api/user";

const Users = () => {
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
        toast.error("Failed to fetch users");
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
  const amountStr = prompt(`Enter amount to adjust for ${user.name} (use negative for deduction):`);
  if (!amountStr) return;

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return toast.error("Invalid amount");

  const note = prompt("Enter a note for this adjustment:") || "";

  try {
    const result = await adjustBalance(user._id, { amount, note });
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? result.user : u))
    );
    toast.success("Balance adjusted");
  } catch (err) {
    console.error(err);
    toast.error("Failed to adjust balance");
  }
};

  const saveUser = async (updatedUser) => {
    try {
      if (updatedUser._id) {
        const result = await updateUser(updatedUser._id, updatedUser);
        setUsers((prev) => prev.map((u) => (u._id === result._id ? result : u)));
        toast.success("User updated");
      } else {
        const result = await createUser(updatedUser);
        console.log(result)
        setUsers((prev) => [...prev, result]);
        toast.success("User created");
      }
      closeModals();
    } catch(error) {
      console.log(error)
      toast.error("Failed to save user");
    }
  };

  const updatePermissions = async (id, newPermissions) => {
    try {
      const user = users.find((u) => u._id === id);
      const updated = { ...user, permissions: newPermissions };
      const result = await updateUser(id, updated);
      setUsers((prev) => prev.map((u) => (u._id === id ? result : u)));
      toast.success("Permissions updated");
    } catch {
      toast.error("Failed to update permissions");
    }
  };

 const toggleStatus = async (id) => {
  const user = users.find((u) => u._id === id);
  const newStatus = user.status === "active" ? "inactive" : "active";

  try {
    const result = await updatestatus(id, { status: newStatus });
    setUsers((prev) => prev.map((u) => (u._id === id ? result.user : u)));
    toast.success("Status updated");
  } catch (err) {
    console.error(err);
    toast.error("Failed to toggle status");
  }
};

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Management</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={() => openModal()}
        >
          <FaPlus />
          Add User
        </button>
      </div>

     <Table
  headers={[
    "Name",
    "Email",
    "Phone",
    "Role",
    "Status",
    "Verified",
    "Store Level",
    "Fee Ratio",
    "Balance",
    "Recharge Logs",
    "Created At",
    "Actions",
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
      <button
        onClick={() => openModal(user)}
        className="text-blue-600 hover:underline"
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
  onClick={() => promptBalanceAdjust(user)}
  className="text-green-600 hover:underline"
  title="Adjust Balance"
>
  💰
</button>

      <button
        onClick={() => toggleStatus(user._id)}
        className="text-yellow-600 hover:underline"
        title="Toggle Status"
      >
        {user.status === "active" ? <FaToggleOff /> : <FaToggleOn />}
      </button>
      <button
        onClick={() => deleteUser(user._id)}
        className="text-red-600 hover:underline"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>,
  ])}
/>


      {showUserModal && (
        <UserModal user={selectedUser} onClose={closeModals} onSave={saveUser} />
      )}

      {showPermissionModal && selectedUser && (
        <PermissionModal user={selectedUser} onClose={closeModals} onSave={(permissions) => updatePermissions(selectedUser._id, permissions)} />
      )}
    </div>
  );
};

export default Users;
