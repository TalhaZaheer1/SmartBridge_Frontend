import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaSearch, FaTimes, FaBars } from 'react-icons/fa';
import logo from '../assets/MAIN.png';
import { useCart } from '../context/CartContext';
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userRole, setUserRole] = useState("");

  const token = localStorage.getItem("token");
  const { cart, increment, decrement,clearCart } = useCart();
  console.log(cart)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
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
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/admin/create",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully");
      clearCart();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown')) setUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        if (user?.balance !== undefined) {
          setBalance(user.balance);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 10 ? 'bg-white shadow-md' : 'bg-white'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-black">
          {[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Categories', to: '/categories' }, { label: 'Deals', to: '/deals' }, { label: 'Contact', to: '/contact' }]
            .map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-gray-500 transition">{item.label}</Link>
              </li>
            ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5 text-black text-sm">
          {token ? (
            <>
              <FaSearch className="hover:text-gray-500 transition cursor-pointer" />
              <button onClick={() => setShowCartDrawer(true)} className="relative">
                <FaShoppingCart className="hover:text-gray-500 transition cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">{cartCount}</span>
                )}

              </button>

              <div className="relative user-dropdown">
                <button onClick={() => setUserMenuOpen((prev) => !prev)} className="hover:text-gray-500 transition cursor-pointer">
                  <FaUser />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-black z-50">
                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                    <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                    <Link to="/payment" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Payment</Link>

                    {/* ✅ Show only for store users */}
                    {userRole === "store" && (
                      <Link to="/store/products" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                        Store Products
                      </Link>
                    )}

                    <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                )}

              </div>

              <span className="text-sm text-gray-600 font-medium ml-2">
                Balance: <span className="text-black">${balance.toFixed(2)}</span>
              </span>

            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Sign Up</Link>
            </>
          )}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setOpen(true)}>
            <FaBars className="text-2xl text-black" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-black z-50 shadow-lg text-white"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <img src={logo} alt="Logo" className="h-8" />
              <button onClick={() => setOpen(false)}>
                <FaTimes className="text-xl text-white" />
              </button>
            </div>
            <ul className="px-6 py-6 space-y-4 font-medium">
              {[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Categories', to: '/categories' }, { label: 'Deals', to: '/deals' }, { label: 'Contact', to: '/contact' }]
                .map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} onClick={() => setOpen(false)} className="block py-2 hover:text-gray-400 transition">{item.label}</Link>
                  </li>
                ))}
              {!token && (
                <>
                  <li><Link to="/login" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-400">Sign In</Link></li>
                  <li><Link to="/register" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-400">Sign Up</Link></li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-full p-10 max-w-sm bg-white shadow-lg z-50 flex flex-col border-l border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={() => setShowCartDrawer(false)} className="text-gray-600 hover:text-black">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <div className="flex items-center mt-2 gap-2">
                          <button onClick={() => decrement(item)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-sm rounded">−</button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button onClick={() => increment(item)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-sm rounded">+</button>
                        </div>
                        <p className="text-sm font-bold mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <p className="text-right text-base font-semibold text-gray-800 mb-4">
                  Total: ${cartTotal.toFixed(2)}
                </p>
                <button
                  onClick={() => cart.forEach((item) => placeOrder(item._id))}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Place Order
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
