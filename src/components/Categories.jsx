import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/public");
        const products = res.data.products || res.data;
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="max-w-5xl mx-auto px-4 py-12 mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">{t("categories1.title")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="border border-black rounded-lg p-6 text-center hover:bg-black hover:text-white transition cursor-pointer"
          >
            {cat || t("categories1.unknown")}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Categories;
