import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FloatingInput = ({ label, value, onChange, type = "text" }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="peer w-full px-4 pt-5 pb-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white placeholder-transparent text-black transition"
      placeholder={label}
    />
    <label className="absolute left-3 top-2 px-1 bg-white text-sm text-gray-600 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black">
      {label}
    </label>
  </div>
);

const SearchBar = () => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/public`);
      setProducts(res.data.products || res.data); // Adjust if needed
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const filtered = useMemo(() => {
    return products.filter((product) => {
      return (
        (!category || product.category?.toLowerCase().includes(category.toLowerCase())) &&
        (!brand || product.brand?.toLowerCase().includes(brand.toLowerCase())) &&
        (!size || product.size?.toLowerCase() === size.toLowerCase()) &&
        (!color || product.color?.toLowerCase().includes(color.toLowerCase()))
      );
    });
  }, [category, brand, size, color, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">Shop Your Style</h2>
          <p className="text-sm text-gray-600 mt-2">Filter by category, brand, size or color</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <FloatingInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <FloatingInput label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <FloatingInput label="Size" value={size} onChange={(e) => setSize(e.target.value)} />
          <FloatingInput label="Color" value={color} onChange={(e) => setColor(e.target.value)} />
          <button
            disabled
            className="bg-black text-white flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium shadow w-full"
          >
            <FaSearch />
            Filter Live
          </button>
        </div>
      </motion.div>

      {/* Product Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } }, hidden: {} }}
      >
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-black rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-xl transform group-hover:scale-105 transition duration-300 ease-in-out"
                />
                <button
                  onClick={() => setSelectedProduct(item)}
                  className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow hover:bg-white hover:text-black transition"
                >
                  Quick View
                </button>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-base font-medium text-black">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand} • {item.color}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-black font-bold text-lg">{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-sm bg-black hover:bg-gray-900 text-white px-4 py-1.5 rounded-md transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 mt-10">No products found.</p>
        )}
      </motion.div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-56 object-cover rounded" />
            <h3 className="text-lg font-bold text-black mt-4">{selectedProduct.name}</h3>
            <p className="text-gray-600">{selectedProduct.brand} • {selectedProduct.color}</p>
            <p className="text-sm text-gray-500 mb-2">Size: {selectedProduct.size}</p>
            <p className="text-black font-bold text-xl mb-4">{selectedProduct.price}</p>
            <button
              onClick={() => addToCart(selectedProduct)}
              className="text-sm bg-black hover:bg-gray-900 text-white px-4 py-1.5 rounded-md transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
