import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  BookOpen, 
  MessageCircle, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Home,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  Upload,
  FileImage
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { formatCurrency } from '../lib/auth';
import LearningCard from './LearningCard';
import RecommendationCard from './RecommendationCard';
import FraudAlertCard from './FraudAlertCard';
import Chatbot from './Chatbot';
import FAQSection from './FAQSection';
import SecurityUpload from './SecurityUpload';
import InsuranceClaim from './InsuranceClaim';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatbot, setShowChatbot] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    financialHealth: 75,
    learningProgress: 30,
    fraudRisk: 'Low',
    recommendations: 3,
    recentActivity: []
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Home className="h-5 w-5" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'investments', name: 'Investments', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'claims', name: 'Claims', icon: <FileImage className="h-5 w-5" /> },
    { id: 'chat', name: 'AI Assistant', icon: <MessageCircle className="h-5 w-5" /> },
    { id: 'faq', name: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const overviewCards = [
    {
      title: 'Financial Health Score',
      value: `${dashboardData.financialHealth}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Based on your savings, investments, and debt ratio'
    },
    {
      title: 'Learning Progress',
      value: `${dashboardData.learningProgress}%`,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Completed modules in financial literacy'
    },
    {
      title: 'Fraud Risk Level',
      value: dashboardData.fraudRisk,
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Your current fraud risk assessment'
    },
    {
      title: 'Active Recommendations',
      value: dashboardData.recommendations,
      icon: <Target className="h-6 w-6" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Personalized product recommendations'
    }
  ];

  const quickActions = [
    {
      title: 'Start Learning',
      description: 'Continue your financial education',
      icon: <BookOpen className="h-5 w-5" />,
      action: () => setActiveTab('learning'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Recommendations',
      description: 'See personalized product suggestions',
      icon: <Target className="h-5 w-5" />,
      action: () => setActiveTab('investments'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Security Check',
      description: 'Review your fraud protection status',
      icon: <Shield className="h-5 w-5" />,
      action: () => setActiveTab('security'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Chat with AI',
      description: 'Get instant financial advice',
      icon: <MessageCircle className="h-5 w-5" />,
      action: () => setShowChatbot(true),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const recentActivities = [
    {
      type: 'learning',
      title: 'Completed Term Insurance Module',
      time: '2 hours ago',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      type: 'recommendation',
      title: 'New Health Insurance Recommendation',
      time: '1 day ago',
      icon: <Target className="h-4 w-4 text-blue-500" />
    },
    {
      type: 'security',
      title: 'Fraud Risk Assessment Updated',
      time: '2 days ago',
      icon: <Shield className="h-4 w-4 text-green-500" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500 rounded-lg text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Learning Progress</h3>
                    <p className="text-2xl font-bold text-blue-600">75%</p>
                    <p className="text-sm text-gray-600">3 of 4 modules completed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500 rounded-lg text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Investment Score</h3>
                    <p className="text-2xl font-bold text-green-600">8.5/10</p>
                    <p className="text-sm text-gray-600">Based on your profile</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500 rounded-lg text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Security Status</h3>
                    <p className="text-2xl font-bold text-purple-600">Safe</p>
                    <p className="text-sm text-gray-600">No threats detected</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudAlertCard />
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('security')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Security Analysis</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('claims')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
                  >
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Submit Claim</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('learning')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
                  >
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Continue Learning</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center"
                  >
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Ask AI Assistant</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'learning':
        return <LearningCard />;

      case 'security':
        return <SecurityUpload />;

      case 'investments':
        return <RecommendationCard />;

      case 'claims':
        return <InsuranceClaim />;

      case 'chat':
        return <Chatbot />;

      case 'faq':
        return <FAQSection />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, {userProfile?.name || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setShowChatbot(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Dashboard; 