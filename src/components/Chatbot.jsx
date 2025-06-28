import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import { chatAPI } from "../lib/api";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your 24/7 AI financial assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(input, {});
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: res.data.response || "Sorry, I didn't get that." },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-end"
    >
      <div className="w-full max-w-md m-6 bg-white rounded-xl shadow-lg flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary-600" />
            <span className="font-semibold text-gray-900">AI Chatbot</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${
                  msg.sender === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {msg.sender === "bot" && <Bot className="h-4 w-4 text-primary-600" />}
                  {msg.sender === "user" && <User className="h-4 w-4 text-white" />}
                  <span className="text-sm">{msg.text}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input */}
        <form
          className="p-4 border-t flex items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary flex items-center justify-center"
            disabled={loading}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot; 