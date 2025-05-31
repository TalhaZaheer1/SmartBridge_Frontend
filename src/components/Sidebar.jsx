import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import {
  FaUsers,
  FaClipboardList,
  FaBars,
  FaChartBar,
  FaUserClock,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { role } = useParams(); // should be "admin"
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: isOpen ? 260 : 80 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-screen bg-white shadow-lg z-50 flex flex-col justify-between transition-all overflow-hidden"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between px-4 py-4 border-b">
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
          <div className="flex flex-col gap-1 px-2 py-3">
            {adminLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`${basePath}/${link.path}`}
                  className={`flex items-center gap-7 px-6 py-3 rounded-md text-sm font-medium transition
                    ${isActive(link.path)
                      ? "bg-gray-200 text-black font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                    }
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
            <div className="flex ml-5 gap-2 mr-4">
              <button
                onClick={() => i18n.changeLanguage("en")}
                className="text-xs border px-2 py-1 rounded hover:bg-gray-100 min-w-[50px]"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage("zh")}
                className="text-xs border px-2 py-1 rounded hover:bg-gray-100 min-w-[50px]"
              >
                中文
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 text-red-600 hover:bg-gray-100 px-6 py-3 rounded-md w-full transition"
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
    </>
  );
};

export default Sidebar;
