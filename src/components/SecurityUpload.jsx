import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Target,
  Info,
  Lightbulb,
  BarChart3,
  AlertCircle,
  CheckSquare,
  XCircle,
  ArrowRight,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const SecurityUpload = () => {
  const { userProfile } = useAuth();
  
  // Investment analysis states
  const [investmentDetails, setInvestmentDetails] = useState({
    type: '',
    amount: '',
    duration: '',
    expected_return: '',
    risk_level: '',
    name: '',
    category: ''
  });
  const [investmentAnalysis, setInvestmentAnalysis] = useState(null);
  const [analyzingInvestment, setAnalyzingInvestment] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);

  // Financial health parameters for risk assessment
  const financialParameters = {
    savingsRatio: {
      excellent: 30, // 30%+ of income
      good: 20,      // 20-30% of income
      adequate: 10,  // 10-20% of income
      poor: 5,       // 5-10% of income
      critical: 0    // <5% of income
    },
    debtRatio: {
      excellent: 10,  // <10% of income
      good: 20,       // 10-20% of income
      moderate: 30,   // 20-30% of income
      high: 50,       // 30-50% of income
      critical: 100   // >50% of income
    },
    investmentRatio: {
      excellent: 20,  // 20%+ of income
      good: 15,       // 15-20% of income
      adequate: 10,   // 10-15% of income
      poor: 5,        // 5-10% of income
      critical: 0     // <5% of income
    },
    emergencyFund: {
      excellent: 6,   // 6+ months expenses
      good: 3,        // 3-6 months expenses
      adequate: 1,    // 1-3 months expenses
      poor: 0.5,      // 2 weeks - 1 month
      critical: 0     // <2 weeks
    }
  };

  // Calculate financial health score
  const calculateFinancialHealth = () => {
    if (!userProfile) return null;

    const income = parseInt(userProfile.income) || 0;
    const savings = parseInt(userProfile.savings) || 0;
    const debt = parseInt(userProfile.debt) || 0;
    const investment = parseInt(userProfile.monthlyInvestmentCapacity) || 0;
    const emergencyFund = parseInt(userProfile.emergencyFund) || 0;

    if (income === 0) return null;

    const monthlyIncome = income / 12;
    const monthlyExpenses = monthlyIncome * 0.7; // Assuming 70% of income goes to expenses

    // Calculate ratios
    const savingsRatio = (savings / income) * 100;
    const debtRatio = (debt / income) * 100;
    const investmentRatio = ((investment * 12) / income) * 100;
    const emergencyMonths = emergencyFund / monthlyExpenses;

    // Score each parameter (0-100)
    const scores = {
      savings: calculateScore(savingsRatio, financialParameters.savingsRatio, true),
      debt: calculateScore(debtRatio, financialParameters.debtRatio, false),
      investment: calculateScore(investmentRatio, financialParameters.investmentRatio, true),
      emergency: calculateScore(emergencyMonths, financialParameters.emergencyFund, true)
    };

    // Weighted average score
    const totalScore = (
      scores.savings * 0.25 +
      scores.debt * 0.25 +
      scores.investment * 0.25 +
      scores.emergency * 0.25
    );

    // Determine risk level
    let riskLevel = 'Low';
    let riskColor = 'green';
    let recommendations = [];

    if (totalScore >= 80) {
      riskLevel = 'Low';
      riskColor = 'green';
      recommendations = [
        'Maintain your excellent financial habits',
        'Consider increasing your investment allocation',
        'Explore tax-efficient investment strategies',
        'Plan for long-term wealth building'
      ];
    } else if (totalScore >= 60) {
      riskLevel = 'Moderate';
      riskColor = 'yellow';
      recommendations = [
        'Focus on building your emergency fund',
        'Consider increasing your savings rate',
        'Review and optimize your debt management',
        'Start or increase your investment contributions'
      ];
    } else if (totalScore >= 40) {
      riskLevel = 'High';
      riskColor = 'orange';
      recommendations = [
        'Prioritize building an emergency fund (3-6 months of expenses)',
        'Focus on debt reduction, especially high-interest debt',
        'Reduce discretionary spending to increase savings',
        'Consider seeking professional financial advice',
        'Create a strict budget and stick to it'
      ];
    } else {
      riskLevel = 'Critical';
      riskColor = 'red';
      recommendations = [
        'Immediate focus on debt reduction',
        'Create a strict emergency budget',
        'Consider debt consolidation options',
        'Seek professional financial counseling',
        'Explore additional income sources',
        'Prioritize essential expenses only'
      ];
    }

    return {
      score: Math.round(totalScore),
      riskLevel,
      riskColor,
      ratios: {
        savings: savingsRatio,
        debt: debtRatio,
        investment: investmentRatio,
        emergency: emergencyMonths
      },
      scores,
      recommendations,
      details: {
        income,
        savings,
        debt,
        investment,
        emergencyFund,
        monthlyIncome,
        monthlyExpenses
      }
    };
  };

  const calculateScore = (value, parameters, higherIsBetter) => {
    if (higherIsBetter) {
      if (value >= parameters.excellent) return 100;
      if (value >= parameters.good) return 80;
      if (value >= parameters.adequate) return 60;
      if (value >= parameters.poor) return 40;
      return 20;
    } else {
      if (value <= parameters.excellent) return 100;
      if (value <= parameters.good) return 80;
      if (value <= parameters.moderate) return 60;
      if (value <= parameters.high) return 40;
      return 20;
    }
  };

  const analyzeInvestmentSecurity = async () => {
    if (!userProfile) {
      toast.error('Please complete your profile first to get personalized investment analysis');
      return;
    }

    // Validate required fields
    if (!investmentDetails.type || !investmentDetails.amount || !investmentDetails.duration) {
      toast.error('Please fill in all required investment details');
      return;
    }

    setAnalyzingInvestment(true);

    try {
      const response = await api.analyzeInvestmentSecurity(
        investmentDetails,
        userProfile
      );

      if (response) {
        setInvestmentAnalysis(response);
        toast.success('Investment security analysis completed!');
      }
    } catch (error) {
      console.error('Investment analysis error:', error);
      toast.error('Failed to analyze investment security. Please try again.');
    } finally {
      setAnalyzingInvestment(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'very high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'very high':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const InvestmentAnalysisModal = ({ analysis, onClose }) => {
    if (!analysis) return null;

    const { risk_assessment, risk_factors, user_profile_analysis, risk_mitigation, comparison_analysis, detailed_recommendations } = analysis;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Investment Security Analysis</h2>
                <p className="text-gray-600 mt-1">{investmentDetails.name || 'Investment Analysis'}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Risk Assessment Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk_assessment?.risk_level)}`}>
                    {getRiskIcon(risk_assessment?.risk_level)}
                    <span className="ml-1">{risk_assessment?.risk_level?.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Risk Level</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{risk_assessment?.overall_risk_score}/10</div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{risk_assessment?.suitability_score}/10</div>
                  <p className="text-sm text-gray-600">Suitability Score</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(risk_assessment?.recommendation?.toLowerCase())}`}>
                  {getRiskIcon(risk_assessment?.recommendation?.toLowerCase())}
                  <span className="ml-2">{risk_assessment?.recommendation}</span>
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Factors</h3>
              <div className="space-y-2">
                {risk_factors?.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{factor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(user_profile_analysis || {}).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 capitalize mb-1">
                      {key.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Mitigation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Mitigation Strategies</h3>
              <div className="space-y-2">
                {risk_mitigation?.map((strategy, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckSquare className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comparison Analysis</h3>
              <div className="space-y-3">
                {Object.entries(comparison_analysis || {}).map(([key, value]) => (
                  <div key={key} className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 capitalize mb-1">
                      {key.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Recommendations</h3>
              <div className="space-y-2">
                {detailed_recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Analysis saved to your profile');
                  onClose();
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const financialHealth = calculateFinancialHealth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Analysis</h2>
          <p className="text-gray-600">AI-powered investment security analysis and financial health assessment</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary-600" />
          <span className="text-sm text-gray-600">AI-Powered Analysis</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Security Analysis */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Investment Security Analysis</h3>
              <button
                onClick={() => setShowInvestmentForm(!showInvestmentForm)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {showInvestmentForm ? 'Hide Form' : 'Add Investment'}
              </button>
            </div>

            {showInvestmentForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Type *
                    </label>
                    <select
                      value={investmentDetails.type}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="Equity">Equity</option>
                      <option value="Fixed Deposit">Fixed Deposit</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Gold">Gold</option>
                      <option value="Crypto">Crypto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={investmentDetails.amount}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={investmentDetails.duration}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="5-7 years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Return
                    </label>
                    <input
                      type="text"
                      value={investmentDetails.expected_return}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, expected_return: e.target.value }))}
                      placeholder="12-15%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level
                    </label>
                    <select
                      value={investmentDetails.risk_level}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, risk_level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Risk Level</option>
                      <option value="Very Low">Very Low</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Name
                    </label>
                    <input
                      type="text"
                      value={investmentDetails.name}
                      onChange={(e) => setInvestmentDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., HDFC Mid-Cap Fund"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <button
                  onClick={analyzeInvestmentSecurity}
                  disabled={analyzingInvestment || !investmentDetails.type || !investmentDetails.amount || !investmentDetails.duration}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                >
                  {analyzingInvestment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  <span>
                    {analyzingInvestment ? 'Analyzing...' : 'Analyze Investment Security'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Get personalized investment security analysis</p>
                <button
                  onClick={() => setShowInvestmentForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Financial Health Analysis */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Health Assessment</h3>
            
            {financialHealth ? (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {financialHealth.score}/100
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    financialHealth.riskColor === 'green' ? 'bg-green-100 text-green-800' :
                    financialHealth.riskColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    financialHealth.riskColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {financialHealth.riskLevel} Risk Level
                  </div>
                </div>

                {/* Financial Ratios */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Savings Ratio</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {financialHealth.ratios.savings.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {financialHealth.scores.savings}/100
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                    <p className="text-sm text-gray-600">Debt Ratio</p>
                    <p className="text-lg font-semibold text-red-600">
                      {financialHealth.ratios.debt.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {financialHealth.scores.debt}/100
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Investment Ratio</p>
                    <p className="text-lg font-semibold text-green-600">
                      {financialHealth.ratios.investment.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {financialHealth.scores.investment}/100
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600">Emergency Fund</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {financialHealth.ratios.emergency.toFixed(1)} months
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {financialHealth.scores.emergency}/100
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">AI Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {financialHealth.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Complete your profile to see financial health analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investment Analysis Modal */}
      <AnimatePresence>
        {investmentAnalysis && (
          <InvestmentAnalysisModal
            analysis={investmentAnalysis}
            onClose={() => setInvestmentAnalysis(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityUpload; 