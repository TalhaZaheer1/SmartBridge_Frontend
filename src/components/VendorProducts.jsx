import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VendorProducts = () => {
  const [selectable, setSelectable] = useState([]);
  const [mine, setMine] = useState([]);
  const [category, setCategory] = useState("");

const fetchSelectable = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/products/selectable`, {
      params: category ? { category } : {},
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Add token if protected
    });

    if (Array.isArray(res.data)) {
      setSelectable(res.data);
    } else {
      setSelectable([]); // fallback
      console.warn("Expected an array but got:", res.data);
    }
  } catch (err) {
    toast.error("Failed to load selectable products");
    setSelectable([]); // reset to empty array to prevent map crash
  }
};


const fetchMine = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/products/mine`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (Array.isArray(res.data)) {
      setMine(res.data);
    } else {
      setMine([]);
      console.warn("Expected an array but got:", res.data);
    }
  } catch (err) {
    toast.error("Failed to load your products");
    setMine([]);
  }
};


const adoptProduct = async (id) => {
  try {
    await axios.put(
      `http://localhost:5000/api/products/adopt/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Product adopted");
    fetchSelectable();
    fetchMine();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to adopt");
  }
};


  useEffect(() => {
    fetchSelectable();
    fetchMine();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select Products</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <button
          onClick={fetchSelectable}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectable.map((prod) => (
          <div key={prod._id} className="border p-4 rounded shadow-sm">
            <img src={prod.image} alt={prod.title} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{prod.title}</h3>
            <p className="text-gray-500">{prod.category}</p>
            <p className="text-sm text-gray-700">{prod.description}</p>
            <p className="font-bold mt-2">${prod.price}</p>
            <button
              onClick={() => adoptProduct(prod._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Adopt Product
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">My Adopted Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mine.map((prod) => (
          <div key={prod._id} className="border p-4 rounded shadow-sm">
            <img src={prod.image} alt={prod.title} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{prod.title}</h3>
            <p className="text-gray-500">{prod.category}</p>
            <p className="font-bold mt-2">${prod.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;
