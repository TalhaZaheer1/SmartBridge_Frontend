import { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SideBarHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-end items-center py-4 px-6 bg-white shadow-md sticky top-0 z-40 rounded-lg">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden sm:block font-medium">{t("sidebarHeader.account")}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              <FaSignOutAlt /> {t("sidebarHeader.logout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarHeader;
