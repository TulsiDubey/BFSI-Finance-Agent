import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search, BookOpen, Shield, TrendingUp, DollarSign, Target, Clock, Star, MessageCircle, ThumbsUp, Bot } from "lucide-react";
import { chatAPI } from "../lib/api";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/UserContext';
import Chatbot from './Chatbot';

// Enhanced FAQ categories with comprehensive questions
const faqCategories = {
  insurance: {
    icon: Shield,
    title: "Insurance & Protection",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    questions: [
      {
        question: "What is term insurance and how does it work?",
        keywords: ["term insurance", "life insurance", "protection"],
        category: "insurance_basics"
      },
      {
        question: "What's the difference between term insurance and ULIP?",
        keywords: ["term vs ulip", "ulip", "investment insurance"],
        category: "insurance_comparison"
      },
      {
        question: "How much life insurance coverage do I need?",
        keywords: ["coverage amount", "insurance calculation", "family protection"],
        category: "insurance_planning"
      },
      {
        question: "What are the tax benefits of insurance policies?",
        keywords: ["tax benefits", "section 80c", "insurance tax"],
        category: "insurance_tax"
      },
      {
        question: "How to choose the right health insurance policy?",
        keywords: ["health insurance", "medical insurance", "policy selection"],
        category: "health_insurance"
      }
    ]
  },
  investment: {
    icon: TrendingUp,
    title: "Investment & Wealth",
    color: "text-green-600",
    bgColor: "bg-green-50",
    questions: [
      {
        question: "What is SIP and how does it help in wealth creation?",
        keywords: ["sip", "systematic investment", "mutual funds"],
        category: "investment_basics"
      },
      {
        question: "How to build an emergency fund and where to invest it?",
        keywords: ["emergency fund", "savings", "liquid funds"],
        category: "emergency_planning"
      },
      {
        question: "What are mutual funds and how to choose the right one?",
        keywords: ["mutual funds", "fund selection", "investment options"],
        category: "mutual_funds"
      },
      {
        question: "How to start investing with a small amount?",
        keywords: ["small investment", "beginner investing", "low amount"],
        category: "beginner_investing"
      },
      {
        question: "What is the difference between equity and debt funds?",
        keywords: ["equity funds", "debt funds", "risk vs returns"],
        category: "fund_types"
      }
    ]
  },
  loans: {
    icon: DollarSign,
    title: "Loans & EMI",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    questions: [
      {
        question: "How to calculate EMI and understand loan terms?",
        keywords: ["emi calculation", "loan terms", "interest rates"],
        category: "loan_basics"
      },
      {
        question: "What are common loan traps and how to avoid them?",
        keywords: ["loan traps", "hidden charges", "loan scams"],
        category: "loan_traps"
      },
      {
        question: "How to improve credit score for better loan terms?",
        keywords: ["credit score", "credit history", "loan eligibility"],
        category: "credit_score"
      },
      {
        question: "What's the difference between secured and unsecured loans?",
        keywords: ["secured loans", "unsecured loans", "collateral"],
        category: "loan_types"
      },
      {
        question: "How to choose between different loan options?",
        keywords: ["loan comparison", "best loan", "loan selection"],
        category: "loan_comparison"
      }
    ]
  },
  fraud: {
    icon: Shield,
    title: "Fraud Prevention",
    color: "text-red-600",
    bgColor: "bg-red-50",
    questions: [
      {
        question: "How to identify and avoid financial frauds?",
        keywords: ["financial fraud", "scam prevention", "fraud detection"],
        category: "fraud_prevention"
      },
      {
        question: "What are common banking scams and how to protect yourself?",
        keywords: ["banking scams", "otp fraud", "phishing"],
        category: "banking_fraud"
      },
      {
        question: "How to verify if an investment opportunity is legitimate?",
        keywords: ["investment fraud", "ponzi schemes", "legitimate investment"],
        category: "investment_fraud"
      },
      {
        question: "What to do if you become a victim of financial fraud?",
        keywords: ["fraud victim", "report fraud", "fraud recovery"],
        category: "fraud_recovery"
      },
      {
        question: "How to protect your personal and financial information?",
        keywords: ["data protection", "privacy", "information security"],
        category: "data_protection"
      }
    ]
  },
  financial_planning: {
    icon: Target,
    title: "Financial Planning",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    questions: [
      {
        question: "How to create and stick to a budget?",
        keywords: ["budgeting", "financial planning", "expenses", "savings"],
        category: "budgeting"
      },
      {
        question: "How to plan for retirement in India?",
        keywords: ["retirement planning", "pension", "nps", "epf"],
        category: "retirement_planning"
      },
      {
        question: "How to save for children's education?",
        keywords: ["education planning", "child education", "sukanya samriddhi"],
        category: "education_planning"
      },
      {
        question: "How to manage multiple financial goals?",
        keywords: ["goal planning", "multiple goals", "priority setting"],
        category: "goal_management"
      },
      {
        question: "How to create a financial emergency plan?",
        keywords: ["emergency planning", "financial safety", "crisis management"],
        category: "emergency_planning"
      }
    ]
  }
};

const FAQSection = () => {
  const { userProfile } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  // Comprehensive FAQ data with detailed answers
  const faqData = [
    {
      id: 1,
      category: 'insurance',
      question: 'What is the difference between term insurance and whole life insurance?',
      answer: `Term insurance provides coverage for a specific period (10, 20, 30 years) with lower premiums and no cash value. It's ideal for young families and temporary coverage needs. Whole life insurance provides lifelong coverage with higher premiums and includes a cash value component that accumulates over time. It's suitable for estate planning and permanent coverage needs. The choice depends on your financial goals, budget, and coverage timeline.`,
      tags: ['life insurance', 'term insurance', 'whole life', 'coverage'],
      helpful: 156,
      category_icon: <Shield className="h-5 w-5" />
    },
    {
      id: 2,
      category: 'investment',
      question: 'How should I start investing as a beginner?',
      answer: `Start by assessing your financial situation, building an emergency fund, and paying off high-interest debt. Set clear investment goals (short-term, medium-term, long-term) and determine your risk tolerance. Begin with simple investment vehicles like mutual funds, ETFs, or index funds. Use SIPs for regular, disciplined investing. Focus on diversification across different asset classes and sectors. Start small and increase gradually, focusing on long-term investing (5+ years) rather than trying to time the market.`,
      tags: ['beginner investing', 'mutual funds', 'sip', 'diversification'],
      helpful: 203,
      category_icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 3,
      category: 'loans',
      question: 'How do I calculate EMI and understand loan terms?',
      answer: `EMI (Equated Monthly Installment) can be calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal, r is monthly interest rate, and n is number of months. However, you can use online EMI calculators for convenience. Key loan terms to understand include: Principal (loan amount), Interest Rate (annual percentage), Tenure (repayment period), Processing Fee (one-time charge), Prepayment Penalty (for early closure), and Late Payment Charges. Always read the fine print and compare multiple loan offers.`,
      tags: ['emi calculation', 'loan terms', 'interest rates', 'loan comparison'],
      helpful: 189,
      category_icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: 4,
      category: 'fraud',
      question: 'How can I identify and avoid financial frauds?',
      answer: `Common red flags include: unsolicited calls/emails asking for personal information, promises of unrealistic returns, pressure to act quickly, requests for OTP or passwords, and offers that seem too good to be true. To protect yourself: never share OTPs or passwords, verify the source before sharing information, check for official websites and contact numbers, avoid clicking suspicious links, and report suspicious activities immediately. Always use official channels for financial transactions and keep your contact information updated with banks.`,
      tags: ['fraud prevention', 'scam detection', 'security tips', 'otp safety'],
      helpful: 267,
      category_icon: <Shield className="h-5 w-5" />
    },
    {
      id: 5,
      category: 'financial_planning',
      question: 'How do I create and stick to a budget?',
      answer: `Start by tracking all your income and expenses for 1-2 months. Use the 50/30/20 rule: 50% for needs (rent, food, utilities), 30% for wants (entertainment, shopping), and 20% for savings/investments. Set specific, measurable financial goals. Use budgeting apps or spreadsheets to track spending. Review and adjust your budget monthly. Include emergency fund contributions and debt payments. Be realistic and flexible - unexpected expenses will occur. Celebrate small wins to stay motivated.`,
      tags: ['budgeting', 'financial planning', 'expense tracking', 'savings'],
      helpful: 178,
      category_icon: <Target className="h-5 w-5" />
    }
  ];

  useEffect(() => {
    setFaqs(faqData);
    setLoading(false);
  }, []);

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const markHelpful = (faqId) => {
    setFaqs(faqs.map(faq => 
      faq.id === faqId ? { ...faq, helpful: faq.helpful + 1 } : faq
    ));
    toast.success('Thank you for your feedback!');
  };

  const getCategoryIcon = (category) => {
    const categoryData = faqCategories[category];
    return categoryData ? categoryData.icon : HelpCircle;
  };

  const handleAskAI = (question = '') => {
    setSelectedQuestion(question);
    setShowChatbot(true);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = () => {
    const stats = {};
    Object.keys(faqCategories).forEach(category => {
      stats[category] = faqs.filter(faq => faq.category === category).length;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Assistant Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-1">Find answers to common questions or ask our AI assistant</p>
        </div>
        <button
          onClick={() => handleAskAI()}
          className="btn-primary flex items-center space-x-2"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search questions, answers, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {Object.entries(faqCategories).map(([key, category]) => (
            <option key={key} value={key}>
              {category.title} ({categoryStats[key] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(faqCategories).map(([key, category]) => {
          const Icon = category.icon;
          const questionCount = categoryStats[key] || 0;
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${category.bgColor} hover:shadow-md`}
              onClick={() => setSelectedCategory(key)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{questionCount} questions</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or ask our AI assistant</p>
            <button
              onClick={() => handleAskAI()}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    {faq.category_icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-700 leading-relaxed mb-4"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>2 min read</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{faq.helpful} found helpful</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      {faq.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => markHelpful(faq.id)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleAskAI(faq.question)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Ask AI Assistant about this"
                  >
                    <Bot className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <Chatbot 
          onClose={() => setShowChatbot(false)} 
          initialQuestion={selectedQuestion}
        />
      )}
    </div>
  );
};

export default FAQSection; 