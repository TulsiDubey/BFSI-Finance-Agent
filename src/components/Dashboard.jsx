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
  FileImage,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { formatCurrency } from '../lib/auth';
import toast from 'react-hot-toast';
import LearningCard from './LearningCard';
import RecommendationCard from './RecommendationCard';
import FraudAlertCard from './FraudAlertCard';
import Chatbot from './Chatbot';
import FAQSection from './FAQSection';
import SecurityUpload from './SecurityUpload';
import InsuranceClaim from './InsuranceClaim';
import AddPolicy from './AddPolicy';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    financialHealth: 75,
    learningProgress: 30,
    fraudRisk: 'Low',
    recommendations: 3,
    recentActivity: []
  });

  // Ensure userProfile exists and has required fields
  const safeUserProfile = userProfile || {
    name: 'User',
    age: 30,
    income: 0,
    savings: 0,
    debt: 0,
    existingInsurance: 'none',
    monthlyInvestmentCapacity: 0,
    emergencyFund: 0,
    primaryGoal: '',
    riskTolerance: '',
    investmentHorizon: '',
    maritalStatus: '',
    dependents: 0,
    interestedProducts: [],
    loanRequirements: '',
    existingPolicies: [],
    completedModules: []
  };

  // Calculate Investment Score based on user profile
  const calculateInvestmentScore = () => {
    if (!safeUserProfile) return { score: 0, breakdown: {}, level: 'Beginner' };

    const factors = {
      age: 0,
      income: 0,
      savings: 0,
      debt: 0,
      insurance: 0,
      investment: 0,
      emergency: 0,
      goals: 0
    };

    // Age factor (0-20 points)
    const age = parseInt(safeUserProfile.age) || 30;
    if (age < 25) factors.age = 15; // Young, can take risks
    else if (age < 35) factors.age = 20; // Prime investment age
    else if (age < 50) factors.age = 18; // Still good for growth
    else if (age < 60) factors.age = 15; // Conservative approach
    else factors.age = 10; // Very conservative

    // Income factor (0-20 points)
    const income = parseInt(safeUserProfile.income) || parseInt(safeUserProfile.monthlyIncome) || 0;
    if (income >= 1500000) factors.income = 20; // High income
    else if (income >= 800000) factors.income = 18; // Good income
    else if (income >= 500000) factors.income = 15; // Moderate income
    else if (income >= 300000) factors.income = 12; // Basic income
    else factors.income = 8; // Low income

    // Savings factor (0-15 points)
    const savings = parseInt(safeUserProfile.savings) || 0;
    const savingsRatio = income > 0 ? (savings / income) * 100 : 0;
    if (savingsRatio >= 30) factors.savings = 15; // Excellent savings
    else if (savingsRatio >= 20) factors.savings = 12; // Good savings
    else if (savingsRatio >= 10) factors.savings = 10; // Adequate savings
    else if (savingsRatio >= 5) factors.savings = 7; // Low savings
    else factors.savings = 3; // Very low savings

    // Debt factor (0-10 points) - Lower debt is better
    const debt = parseInt(safeUserProfile.debt) || parseInt(safeUserProfile.monthlyExpenses) || 0;
    const debtRatio = income > 0 ? (debt / income) * 100 : 0;
    if (debtRatio <= 10) factors.debt = 10; // Very low debt
    else if (debtRatio <= 20) factors.debt = 8; // Low debt
    else if (debtRatio <= 30) factors.debt = 6; // Moderate debt
    else if (debtRatio <= 50) factors.debt = 4; // High debt
    else factors.debt = 2; // Very high debt

    // Insurance factor (0-10 points)
    const insurance = safeUserProfile.existingInsurance || 'none';
    if (insurance === 'both') factors.insurance = 10; // Life + Health
    else if (insurance === 'life') factors.insurance = 7; // Life only
    else if (insurance === 'health') factors.insurance = 6; // Health only
    else factors.insurance = 3; // No insurance

    // Investment factor (0-10 points)
    const investment = parseInt(safeUserProfile.monthlyInvestmentCapacity) || 0;
    if (investment >= 20000) factors.investment = 10; // High investment capacity
    else if (investment >= 10000) factors.investment = 8; // Good investment capacity
    else if (investment >= 5000) factors.investment = 6; // Moderate investment capacity
    else if (investment >= 2000) factors.investment = 4; // Low investment capacity
    else factors.investment = 2; // Very low investment capacity

    // Emergency fund factor (0-10 points)
    const emergencyFund = parseInt(safeUserProfile.emergencyFund) || 0;
    const monthlyExpenses = income / 12;
    const emergencyMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    if (emergencyMonths >= 6) factors.emergency = 10; // 6+ months emergency fund
    else if (emergencyMonths >= 3) factors.emergency = 7; // 3-6 months
    else if (emergencyMonths >= 1) factors.emergency = 4; // 1-3 months
    else factors.emergency = 2; // Less than 1 month

    // Goals factor (0-5 points)
    const primaryGoal = safeUserProfile.primaryGoal || '';
    if (primaryGoal.includes('retirement')) factors.goals = 5; // Long-term planning
    else if (primaryGoal.includes('wealth')) factors.goals = 4; // Wealth creation
    else if (primaryGoal.includes('emergency')) factors.goals = 3; // Emergency fund
    else if (primaryGoal.includes('education')) factors.goals = 4; // Education
    else factors.goals = 2; // Other goals

    // Calculate total score
    const totalScore = Object.values(factors).reduce((sum, value) => sum + value, 0);
    const normalizedScore = Math.min(10, (totalScore / 100) * 10);

    // Determine investment level
    let level = 'Beginner';
    if (normalizedScore >= 8) level = 'Expert';
    else if (normalizedScore >= 6) level = 'Advanced';
    else if (normalizedScore >= 4) level = 'Intermediate';
    else if (normalizedScore >= 2) level = 'Beginner';
    else level = 'Novice';

    return {
      score: Math.round(normalizedScore * 10) / 10,
      breakdown: factors,
      level: level
    };
  };

  // Calculate Learning Progress based on actual modules
  const calculateLearningProgress = () => {
    if (!safeUserProfile) return { progress: 0, completed: 0, total: 4 };

    // Get learning progress from user profile or default to 0
    const completedModules = safeUserProfile.completedModules || [];
    const totalModules = 4; // Total number of learning modules
    const progress = (completedModules.length / totalModules) * 100;

    return {
      progress: Math.round(progress),
      completed: completedModules.length,
      total: totalModules
    };
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Home className="h-5 w-5" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'investments', name: 'Investments', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'claims', name: 'Claims', icon: <FileImage className="h-5 w-5" /> },
    { id: 'chat', name: 'AI Assistant', icon: <MessageCircle className="h-5 w-5" /> },
    { id: 'faq', name: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const investmentScore = calculateInvestmentScore();
  const learningProgress = calculateLearningProgress();

  const handlePolicyAdded = (newPolicy) => {
    // Handle the newly added policy
    console.log('New policy added:', newPolicy);
    // You can update the dashboard data or show a success message
    toast.success('Policy added successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Add Policy Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <button
                onClick={() => setShowAddPolicy(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Policy</span>
              </button>
            </div>

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
                    <p className="text-2xl font-bold text-blue-600">{learningProgress.progress}%</p>
                    <p className="text-sm text-gray-600">{learningProgress.completed} of {learningProgress.total} modules completed</p>
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
                    <p className="text-2xl font-bold text-green-600">{investmentScore.score}/10</p>
                    <p className="text-sm text-gray-600">{investmentScore.level} Level</p>
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

            {/* Investment Score Breakdown */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Score Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Age Factor</p>
                  <p className="text-lg font-semibold text-blue-600">{investmentScore.breakdown.age}/20</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Income</p>
                  <p className="text-lg font-semibold text-green-600">{investmentScore.breakdown.income}/20</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Savings</p>
                  <p className="text-lg font-semibold text-yellow-600">{investmentScore.breakdown.savings}/15</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Debt</p>
                  <p className="text-lg font-semibold text-red-600">{investmentScore.breakdown.debt}/10</p>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600">Insurance</p>
                  <p className="text-lg font-semibold text-indigo-600">{investmentScore.breakdown.insurance}/10</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Investment</p>
                  <p className="text-lg font-semibold text-purple-600">{investmentScore.breakdown.investment}/10</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600">Emergency</p>
                  <p className="text-lg font-semibold text-pink-600">{investmentScore.breakdown.emergency}/10</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Goals</p>
                  <p className="text-lg font-semibold text-gray-600">{investmentScore.breakdown.goals}/5</p>
                </div>
              </div>
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

      {/* Add Policy Modal */}
      {showAddPolicy && (
        <AddPolicy 
          onClose={() => setShowAddPolicy(false)} 
          onPolicyAdded={handlePolicyAdded}
        />
      )}
    </div>
  );
};

export default Dashboard; 