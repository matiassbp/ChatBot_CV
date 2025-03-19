import React from "react";
import Message from "./Message";

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-800 bg-opacity-70 rounded-2xl p-4 flex rounded-bl-sm border border-gray-700 border-opacity-50 shadow-lg">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
              <span className="text-lg">🤖</span>
            </div>
            <div className="flex items-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;