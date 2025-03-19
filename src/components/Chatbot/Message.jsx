import React from "react";
import { motion } from "framer-motion";

const Message = ({ message }) => {
  const formatMessage = (text) => {
    // Procesar markdown básico (negritas)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-blue-300">$1</span>');

    // Detectar listas en el texto
    if (formattedText.includes("- ")) {
      const lines = formattedText.split("\n");
      return lines.map((line, index) => {
        if (line.trim().startsWith("- ")) {
          return (
            <li
              key={index}
              className="ml-4 mb-2 list-disc text-blue-300"
              dangerouslySetInnerHTML={{ __html: line.trim().substring(2) }}
            />
          );
        }

        return line.trim() ? (
          <p
            key={index}
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ) : null;
      });
    }

    // Formato normal para texto sin listas
    return formattedText.split("\n").map((line, index) =>
      line.trim() ? (
        <p
          key={index}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ) : null
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`
        max-w-[85%] rounded-2xl p-4 shadow-lg
        ${message.role === 'user'
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-900/30'
          : 'bg-gray-800 bg-opacity-70 text-white rounded-bl-sm flex border border-gray-700 border-opacity-50'}
      `}>
        {message.role === 'bot' && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
            <span className="text-lg">🤖</span>
          </div>
        )}
        <div className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          {message.role === "bot" ? formatMessage(message.content) : message.content}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;