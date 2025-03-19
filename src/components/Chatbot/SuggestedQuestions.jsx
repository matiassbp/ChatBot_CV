import React from "react";
import { motion } from "framer-motion";

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  return (
    <div className="p-3 bg-gray-800 bg-opacity-50 border-t border-gray-700 grid grid-cols-2 md:grid-cols-3 gap-2">
      {questions.map((question, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onQuestionClick(question)}
          className="px-3 py-2 bg-gray-700 hover:bg-blue-700 transition-all duration-200 rounded-full text-sm text-blue-100 border border-gray-600 hover:border-blue-500 shadow-md hover:shadow-glow truncate"
        >
          {question}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;