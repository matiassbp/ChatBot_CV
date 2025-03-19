import React from "react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6 text-center p-6 rounded-2xl bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm border border-white border-opacity-10 shadow-lg"
    >
      <div className="flex items-center justify-center mb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mr-3"
        >
          <span className="text-2xl">🤖</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
          Asistente Virtual
        </h1>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-blue-100 opacity-90"
      >
        Descubre más sobre la experiencia profesional de Matías Benoni
      </motion.p>
    </motion.header>
  );
};

export default Header;