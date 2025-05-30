import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselImages = [
  {
    src: 'https://images.pexels.com/photos/7156885/pexels-photo-7156885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Trendy Summer Collection',
    subtitle: 'Explore the latest arrivals in fashion',
  },
  {
    src: 'https://images.pexels.com/photos/7679874/pexels-photo-7679874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Handpicked Accessories',
    subtitle: 'Style up with our curated designs',
  },
  {
    src: 'https://images.pexels.com/photos/6995885/pexels-photo-6995885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Exclusive Deals',
    subtitle: 'Limited-time offers on bestsellers',
  },
];

export const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[100vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={carouselImages[index].src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {carouselImages[index].title}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {carouselImages[index].subtitle}
            </motion.p>
            <motion.a
              href="#shop-now"
              className="inline-block bg-white text-black font-semibold py-2 px-6 rounded shadow hover:bg-gray-200 transition"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Shop Now
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
