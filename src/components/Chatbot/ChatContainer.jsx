import React from "react";
import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineSend, AiOutlineLine } from "react-icons/ai";
import MessageList from "./MessageList";
import SuggestedQuestions from "./SuggestedQuestions";

const ChatContainer = ({
  messages,
  isTyping,
  messagesEndRef,
  isExpanded,
  toggleChatExpansion,
  suggestedQuestions,
  handleSuggestedQuestion,
  input,
  setInput,
  handleKeyPress,
  sendMessage,
  inputRef,
  chatContainerRef
}) => {
  return (
    <motion.div
      ref={chatContainerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700 border-opacity-50 shadow-2xl"
    >
      <div className="bg-gray-800 bg-opacity-60 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-300 text-sm ml-2 hidden md:inline-block">Chat con Asistente de Matías</span>
        </div>
        <button
          onClick={toggleChatExpansion}
          className="text-gray-400 hover:text-white focus:outline-none transform transition-transform hover:scale-110"
        >
          {isExpanded ? (
            <AiOutlineLine className="h-5 w-5" fill="currentColor" />
          ) : (
            <AiOutlineClose className="h-5 w-5" fill="currentColor" />
          )}
        </button>
      </div>

      <div className={`flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'h-[70vh]' : 'h-0'}`}>
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          messagesEndRef={messagesEndRef} 
        />
        
        <SuggestedQuestions 
          questions={suggestedQuestions} 
          onQuestionClick={handleSuggestedQuestion} 
        />
        
        <div className="p-4 bg-gray-800 bg-opacity-70 border-t border-gray-700 flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-900 bg-opacity-50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700"
            rows="1"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${input.trim()
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-glow'
                : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
          >
            <AiOutlineSend className="h-5 w-5 text-white rotate-180" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContainer;