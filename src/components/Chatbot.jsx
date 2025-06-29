import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Brain, Lightbulb, TrendingUp, Shield, BookOpen } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/UserContext";
import toast from "react-hot-toast";

const Chatbot = ({ onClose, initialQuestion = '' }) => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI financial advisor with 15+ years of expertise. I can help you with:\n\n💡 **Investment Guidance** - SIPs, mutual funds, portfolio planning\n🛡️ **Insurance Advice** - Term plans, health insurance, coverage needs\n💰 **Loan & EMI** - Calculations, comparisons, avoiding traps\n🚨 **Fraud Prevention** - Scam detection, security tips\n📚 **Financial Education** - Complex concepts made simple\n\nWhat would you like to learn about today?",
      type: "welcome"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    userProfile: null,
    conversationHistory: [],
    currentTopic: null,
    expertiseLevel: "beginner"
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update context when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setContext(prev => ({
        ...prev,
        userProfile: userProfile
      }));
    }
  }, [userProfile]);

  // Handle initial question from FAQ
  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
      // Auto-send the initial question after a short delay
      setTimeout(() => {
        sendMessage(initialQuestion);
      }, 500);
    }
  }, [initialQuestion]);

  // Enhanced message sending with proper error handling
  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;
    
    const userMsg = { sender: "user", text: textToSend };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending message to API:", textToSend);
      
      // Prepare the request payload
      const payload = {
        message: textToSend,
        history: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        user_profile: userProfile || {}
      };
      
      console.log("API payload:", payload);
      
      const response = await api.chat(textToSend, {
        conversationHistory: payload.history,
        userProfile: payload.user_profile
      });
      
      console.log("API response:", response);
      
      if (!response.response) {
        throw new Error('Invalid response from server');
      }
      
      const botResponse = response.response;
      
      setMessages((msgs) => [
        ...msgs,
        { 
          sender: "bot", 
          text: botResponse,
          type: "response",
          suggestions: response.suggestions || []
        },
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("I'm having trouble connecting right now. Please try again.");
      setMessages((msgs) => [
        ...msgs,
        { 
          sender: "bot", 
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or you can check our FAQ section for quick answers.",
          type: "error"
        },
      ]);
    }
    setLoading(false);
  };

  // Analyze user message for better context understanding
  const analyzeUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Topic detection
    let topic = "general";
    let expertiseLevel = "beginner";
    let responseType = "general";
    
    if (lowerMessage.includes("sip") || lowerMessage.includes("mutual fund") || lowerMessage.includes("investment") || lowerMessage.includes("portfolio")) {
      topic = "investment";
      responseType = "investment";
    } else if (lowerMessage.includes("insurance") || lowerMessage.includes("term") || lowerMessage.includes("ulip") || lowerMessage.includes("coverage")) {
      topic = "insurance";
      responseType = "insurance";
    } else if (lowerMessage.includes("loan") || lowerMessage.includes("emi") || lowerMessage.includes("credit") || lowerMessage.includes("debt")) {
      topic = "loans";
      responseType = "loans";
    } else if (lowerMessage.includes("fraud") || lowerMessage.includes("scam") || lowerMessage.includes("security") || lowerMessage.includes("phishing")) {
      topic = "fraud_prevention";
      responseType = "security";
    } else if (lowerMessage.includes("tax") || lowerMessage.includes("80c") || lowerMessage.includes("deduction") || lowerMessage.includes("itr")) {
      topic = "taxation";
      responseType = "tax";
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("savings") || lowerMessage.includes("budget")) {
      topic = "financial_planning";
      responseType = "planning";
    }

    // Expertise level detection
    if (lowerMessage.includes("advanced") || lowerMessage.includes("complex") || lowerMessage.includes("detailed") || lowerMessage.includes("expert")) {
      expertiseLevel = "advanced";
    } else if (lowerMessage.includes("intermediate") || lowerMessage.includes("moderate") || lowerMessage.includes("experienced")) {
      expertiseLevel = "intermediate";
    }

    return { topic, expertiseLevel, responseType };
  };

  // Create enhanced prompt with context and reasoning
  const createEnhancedPrompt = (userMessage, analysis) => {
    const basePrompt = `You are an expert BFSI (Banking, Financial Services, and Insurance) advisor with 15+ years of experience. You specialize in making complex financial concepts simple and actionable.

**Current Context:**
- Topic: ${analysis.topic}
- User Expertise Level: ${analysis.expertiseLevel}
- Response Type: ${analysis.responseType}

**User Query:** ${userMessage}

**Response Guidelines:**
1. **Logical Reasoning**: Always explain the "why" behind your advice
2. **Step-by-Step Approach**: Break down complex concepts into digestible steps
3. **Real Examples**: Use relatable examples and analogies
4. **Risk Awareness**: Always mention potential risks and considerations
5. **Actionable Steps**: Provide specific, actionable next steps
6. **Educational Value**: Teach the user, don't just answer
7. **Personalization**: Consider the user's expertise level in your explanation
8. **Simple Language**: Use clear, understandable language for new users
9. **Indian Context**: Use Indian financial context (₹, Indian regulations, etc.)

**Response Structure:**
- Start with a brief overview
- Provide logical reasoning and explanation
- Include practical examples
- Mention important considerations/risks
- End with actionable next steps
- Use emojis and formatting for better readability

**Special Instructions for ${analysis.topic}:**
${getTopicSpecificInstructions(analysis.topic)}

Please provide a comprehensive, educational response that empowers the user to make informed decisions.`;

    return basePrompt;
  };

  // Get topic-specific instructions
  const getTopicSpecificInstructions = (topic) => {
    const instructions = {
      investment: `- Explain risk vs return relationship
- Mention the power of compounding
- Include diversification principles
- Suggest starting with SIPs for beginners
- Provide specific fund categories to consider
- Use Indian mutual fund examples`,
      insurance: `- Emphasize protection over investment
- Explain term vs whole life insurance
- Calculate coverage needs (10-15x annual income)
- Mention tax benefits under Section 80C
- Suggest riders for comprehensive coverage
- Use Indian insurance examples`,
      loans: `- Explain EMI calculation and total cost
- Warn about hidden charges and prepayment penalties
- Compare different loan types
- Suggest ways to reduce interest burden
- Use Indian loan examples and regulations`,
      fraud_prevention: `- Explain common fraud types
- Provide specific warning signs
- Suggest preventive measures
- Include reporting procedures
- Use recent Indian fraud examples`,
      taxation: `- Explain tax-saving instruments
- Cover Section 80C benefits
- Suggest tax-efficient investments
- Include filing deadlines
- Use Indian tax examples`,
      financial_planning: `- Emphasize emergency fund importance
- Explain budgeting principles
- Suggest goal-based planning
- Include inflation considerations
- Use Indian financial context`
    };
    
    return instructions[topic] || "Provide general financial advice with practical examples.";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
    sendMessage(suggestion);
  };

  const getQuickSuggestions = () => {
    return [
      "What is SIP investment?",
      "How much life insurance do I need?",
      "How to avoid loan traps?",
      "What are the best tax-saving options?"
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bot className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Financial Advisor</h3>
              <p className="text-sm text-gray-500">Your personal financial expert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Quick suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickSuggestion(suggestion)}
                              className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <User className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && !loading && (
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick questions you can ask:</p>
            <div className="flex flex-wrap gap-2">
              {getQuickSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-sm bg-primary-50 text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about finance..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="1"
                disabled={loading}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot; 