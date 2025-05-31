import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import {
  FaUsers, FaClipboardList, FaBars, FaChartBar,
  FaUserClock, FaSignOutAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { role } = useParams(); // should be "admin"
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const basePath = `/dashboard/${role}`;

  const adminLinks = [
    { name: "dashboard", path: "", icon: <FaChartBar /> },
    { name: "users", path: "users", icon: <FaUsers /> },
    { name: "products", path: "products", icon: <FaClipboardList /> },
    { name: "orders", path: "orders", icon: <FaClipboardList /> },
    { name: "payment", path: "payment", icon: <FaUserClock /> },
  ];

  const isActive = (path) =>
    location.pathname === `${basePath}/${path}` ||
    (path === "" && location.pathname === `${basePath}`);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white h-screen shadow-lg fixed flex flex-col justify-between z-50"
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <AnimatePresence>
            {isOpen && (
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold text-black"
              >
                {t("sidebar.title")}
              </motion.h1>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-black"
            title="Toggle Sidebar"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1 px-2">
          {adminLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`${basePath}/${link.path}`}
                className={`flex items-center gap-7 px-6 py-4 rounded-md text-md font-normal
                  transition hover:bg-gray-100 hover:text-black
                  ${isActive(link.path) ? "bg-gray-200 text-black font-semibold" : "text-gray-700"}
                `}
                title={!isOpen ? t(`sidebar.${link.name}`) : ""}
              >
                <span className="text-lg">{link.icon}</span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {t(`sidebar.${link.name}`)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer - Logout */}
      <div className="p-4 border-t">
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 text-red-600 hover:bg-gray-100 px-6 py-4 rounded-md w-full transition"
        >
          <FaSignOutAlt className="text-lg" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium"
            >
              {t("sidebar.logout")}
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
