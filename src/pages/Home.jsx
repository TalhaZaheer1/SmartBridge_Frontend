import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {QRCodeSVG} from 'qrcode.react';
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Hero } from "../components/Hero";
import Footer from "../components/Footer";

const sectionVariants = {
  hiddenLeft: { opacity: 0, x: -50 },
  hiddenRight: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
    },
  }),
};

const Home = () => {
 

  return (
    <>
      <div className="overflow-x-hidden">
        <Navbar />
        <div id="hero">
          <Hero />
        </div>

        <motion.div
          initial="hiddenLeft"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="min-h-fit"
        >
          <div id="search">
            <SearchBar />
          </div>
        </motion.div>

        <div id="footer">
          <Footer />
        </div>
      </div>

  
    </>
  );
};

export default Home;
