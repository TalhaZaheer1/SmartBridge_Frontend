import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import img1 from '../assets/hero.jpg';
import video1 from '../assets/q.mp4';

export const Hero = () => {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  const slides = [
    { type: 'image', src: img1 },
    { type: 'video', src: video1 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = t(`hero.slides.${index}`, { returnObjects: true });

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {slides[index].type === 'image' ? (
            <img
              src={slides[index].src}
              alt={`Slide ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              src={slides[index].src}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )}

          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            {/* Your text and button */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slide.title}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {slide.subtitle}
            </motion.p>
            <motion.a
              href="#shop-now"
              className="inline-block bg-white text-black font-semibold py-2 px-6 rounded shadow hover:bg-gray-200 transition"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {t('hero.button')}
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

  );
};
