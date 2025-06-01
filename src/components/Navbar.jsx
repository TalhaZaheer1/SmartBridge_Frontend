import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import logo from "../assets/MAIN-bg.png";
import { useCart } from "../context/CartContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userRole, setUserRole] = useState("");
  const { t, i18n } = useTranslation();
  const API_IMAGE_URL =
    import.meta.env.VITE_API_IMAGE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const { cart, increment, decrement, clearCart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        if (user?.balance !== undefined) setBalance(user.balance);
        if (user?.role) setUserRole(user.role);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [token]);

  const placeOrder = async (productId) => {
    if (!token) {
      toast.error(t("loginPrompt"));
      return;
    }
    try {
      await axios.post(
        `${API_URL}/orders/admin/create`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("orderPlaced"));
      clearCart();
    } catch (err) {
      toast.error(err?.response?.data?.message || t("orderFailed"));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) setUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 10 ? "bg-black shadow-md" : "bg-black"}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center text-white h-[72px]">
        <Link to="/" className="flex items-center gap-2 mt-3">
          <img
            src={logo}
            alt="Logo"
            className="max-h-36 sm:max-h-32 w-auto object-contain"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {[
            { label: t("home"), to: "/" },
            { label: t("shop"), to: "/shop" },
            { label: t("categories"), to: "/categories" },
            { label: t("contact"), to: "/contact" },
          ].map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="hover:text-gray-300 transition">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4 text-sm">
          <div className="flex gap-2 mr-4">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="text-xs border border-white text-white px-2 py-1 rounded hover:bg-white hover:text-black min-w-[50px]"
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage("zh")}
              className="text-xs border border-white text-white px-2 py-1 rounded hover:bg-white hover:text-black min-w-[50px]"
            >
              中文
            </button>
          </div>

          {token ? (
            <>
              <FaSearch className="hover:text-gray-300 transition cursor-pointer" />
              <button
                onClick={() => setShowCartDrawer(true)}
                className="relative"
              >
                <FaShoppingCart className="hover:text-gray-300 transition cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="hover:text-gray-300 transition cursor-pointer"
                >
                  <FaUser />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-black z-50">
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {t("myAccount")}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {t("orders-nav")}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {t("wishlist")}
                    </Link>
                    <Link
                      to="/payment"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {t("payment.title")}
                    </Link>
                    {userRole === "store" && (
                      <Link
                        to="/store/products"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {t("storeProducts")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>

              <span className="text-sm text-gray-300 font-medium ml-2">
                {t("balance")}:{" "}
                <span className="text-white">${balance.toFixed(2)}</span>
              </span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition"
              >
                {t("signIn")}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setOpen(true)}>
            <FaBars className="text-2xl text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-black z-50 shadow-lg text-white overflow-y-auto"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <img src={logo} alt="Logo" className="h-28 w-auto" />
              <button onClick={() => setOpen(false)}>
                <FaTimes className="text-xl text-white" />
              </button>
            </div>
            <ul className="px-6 py-6 space-y-4 font-medium">
              {/* Navigation links */}
              {[
                { label: t("home"), to: "/" },
                { label: t("shop"), to: "/shop" },
                { label: t("categories"), to: "/categories" },
                { label: t("contact"), to: "/contact" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-2 hover:text-gray-400 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Auth/Account Links for Logged In Users */}
              {token && (
                <>
                  <li>
                    <Link
                      to="/account"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("myAccount")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("orders-nav")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("wishlist")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payment"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("payment.title")}
                    </Link>
                  </li>
                  {userRole === "store" && (
                    <li>
                      <Link
                        to="/store/products"
                        onClick={() => setOpen(false)}
                        className="block py-2 hover:text-gray-400"
                      >
                        {t("storeProducts")}
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className="block w-full text-left py-2 hover:text-red-400 transition"
                    >
                      {t("logout")}
                    </button>
                  </li>
                </>
              )}

              {/* Guest-only Links */}
              {!token && (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("signIn")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-gray-400"
                    >
                      {t("signUp")}
                    </Link>
                  </li>
                </>
              )}
              <div className="flex gap-2 mr-4">
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
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCartDrawer && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-lg z-50 flex flex-col border-l border-gray-200 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4 p-4 border-b">
              <h2 className="text-lg font-semibold">{t("yourCart")}</h2>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="text-gray-600 hover:text-black"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
              {cart.length === 0 ? (
                <p className="text-gray-500">{t("cartEmpty")}</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b pb-3"
                    >
                      <img
                        src={`${API_IMAGE_URL.replace(/\/$/, "")}/${item.image.replace(/^\/+/, "")}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={() => console.error("Image failed to load")}
                        crossOrigin="anonymous"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() => decrement(item)}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => increment(item)}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-bold mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 px-4 pb-6">
                <p className="text-right text-base font-semibold text-gray-800 mb-4">
                  {t("total")}: ${cartTotal.toFixed(2)}
                </p>
                <button
                  onClick={() => cart.forEach((item) => placeOrder(item._id))}
                  className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  {t("placeOrder")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
