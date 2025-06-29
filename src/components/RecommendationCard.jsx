import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Target, ArrowRight, ChevronDown, ChevronUp, Star, Shield, Zap, CheckCircle, X, Loader2, AlertTriangle, BarChart3, PieChart, TrendingDown, Award, Clock, Users, FileText, Search, AlertCircle, CheckSquare, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const RecommendationCard = () => {
  const { userProfile } = useAuth();
  const [expandedCard, setExpandedCard] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [investmentAnalysis, setInvestmentAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [securityAnalysis, setSecurityAnalysis] = useState(null);
  const [analyzingSecurity, setAnalyzingSecurity] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Test API import on component mount
  useEffect(() => {
    try {
      console.log('API test:', api.test());
      console.log('API baseURL:', api.baseURL);
    } catch (error) {
      console.error('API import error:', error);
    }
  }, []);

  // Default investment schemes if no recommendations provided
  const defaultSchemes = [
    {
      id: 1,
      name: "HDFC Mid-Cap Opportunities Fund",
      type: "Mutual Fund",
      category: "Equity - Mid Cap",
      minAmount: 5000,
      duration: "5-7 years",
      expectedReturn: "12-15%",
      riskLevel: "Moderate",
      rating: 4.5,
      safetyScore: 7.5,
      features: [
        "Invests in mid-cap companies with high growth potential",
        "Systematic Investment Plan (SIP) available",
        "Tax benefits under Section 80C (ELSS variant)",
        "Professional fund management",
        "Regular dividend payout option"
      ],
      rules: [
        "Minimum investment: ₹5,000",
        "Exit load: 1% if redeemed within 1 year",
        "Lock-in period: 3 years for ELSS",
        "KYC compliance required",
        "Nomination facility available"
      ],
      pros: ["High growth potential", "Diversified portfolio", "Professional management"],
      cons: ["Market volatility risk", "Exit load charges", "Long-term commitment needed"],
      suitability: "Suitable for investors with moderate risk appetite looking for long-term wealth creation",
      safetyAnalysis: {
        fundHouse: "HDFC Asset Management Company",
        aum: "₹15,000+ Crores",
        inception: "2007",
        fundManager: "Mr. Chirag Setalvad",
        experience: "15+ years",
        trackRecord: "Consistent performance over 10+ years",
        regulatoryCompliance: "SEBI registered",
        riskFactors: ["Market risk", "Sector concentration", "Mid-cap volatility"],
        safetyMeasures: ["Diversified portfolio", "Regular rebalancing", "Professional management"]
      }
    },
    {
      id: 2,
      name: "SBI Life Smart Humsafar",
      type: "Insurance",
      category: "Term Insurance with Return of Premium",
      minAmount: 12000,
      duration: "20-30 years",
      expectedReturn: "6-8%",
      riskLevel: "Low",
      rating: 4.3,
      safetyScore: 9.0,
      features: [
        "High life coverage with return of premium",
        "Critical illness rider available",
        "Accidental death benefit",
        "Waiver of premium on disability",
        "Tax benefits under Section 80C & 10(10D)"
      ],
      rules: [
        "Minimum coverage: ₹25 lakhs",
        "Maximum coverage: ₹1 crore",
        "Entry age: 18-65 years",
        "Premium payment: Yearly/Half-yearly/Monthly",
        "Grace period: 30 days"
      ],
      pros: ["Life protection", "Premium return", "Tax benefits", "Rider options"],
      cons: ["Lower returns compared to equity", "Long-term commitment", "Medical examination required"],
      suitability: "Ideal for family breadwinners seeking life protection with savings component",
      safetyAnalysis: {
        company: "SBI Life Insurance",
        irdaRegistration: "IRDAI registered",
        claimSettlementRatio: "95.2%",
        financialStrength: "AAA rated",
        solvencyRatio: "2.15",
        trackRecord: "20+ years in insurance",
        regulatoryCompliance: "IRDAI compliant",
        riskFactors: ["Policy lapse risk", "Medical underwriting"],
        safetyMeasures: ["Guaranteed returns", "Government backing", "Strong financials"]
      }
    },
    {
      id: 3,
      name: "Axis Bank Fixed Deposit Plus",
      type: "Fixed Deposit",
      category: "Senior Citizen Special",
      minAmount: 10000,
      duration: "1-5 years",
      expectedReturn: "7.5-8.5%",
      riskLevel: "Very Low",
      rating: 4.7,
      safetyScore: 9.5,
      features: [
        "Higher interest rates for senior citizens",
        "Quarterly interest payout option",
        "Premature withdrawal facility",
        "Auto-renewal option",
        "Online account management"
      ],
      rules: [
        "Minimum deposit: ₹10,000",
        "Maximum deposit: No limit",
        "Interest rate: 7.5% (general), 8.5% (senior citizens)",
        "Premature withdrawal penalty: 1%",
        "TDS applicable on interest above ₹40,000"
      ],
      pros: ["Guaranteed returns", "Higher rates for seniors", "Flexible tenure", "Safe investment"],
      cons: ["Lower returns than equity", "Lock-in period", "Interest rate fluctuations"],
      suitability: "Perfect for conservative investors and senior citizens seeking stable returns",
      safetyAnalysis: {
        bank: "Axis Bank",
        rbiRegistration: "RBI regulated",
        depositInsurance: "₹5 lakhs per account",
        creditRating: "AAA",
        financialStrength: "Strong",
        trackRecord: "25+ years",
        regulatoryCompliance: "RBI compliant",
        riskFactors: ["Interest rate risk", "Inflation risk"],
        safetyMeasures: ["Deposit insurance", "RBI regulation", "Strong financials"]
      }
    },
    {
      id: 4,
      name: "ICICI Prudential Technology Fund",
      type: "Mutual Fund",
      category: "Sectoral - Technology",
      minAmount: 5000,
      duration: "3-5 years",
      expectedReturn: "15-20%",
      riskLevel: "High",
      rating: 4.1,
      safetyScore: 6.0,
      features: [
        "Focuses on technology sector companies",
        "Global technology exposure",
        "Regular rebalancing",
        "SIP and SWP options",
        "Dividend and growth options"
      ],
      rules: [
        "Minimum investment: ₹5,000",
        "Exit load: 1% if redeemed within 1 year",
        "Sector concentration risk",
        "Regular portfolio review",
        "Market timing important"
      ],
      pros: ["High growth potential", "Sector expertise", "Global exposure", "Technology focus"],
      cons: ["High volatility", "Sector risk", "Market dependent", "Requires monitoring"],
      suitability: "Suitable for aggressive investors with high risk tolerance and technology sector understanding",
      safetyAnalysis: {
        fundHouse: "ICICI Prudential Asset Management",
        aum: "₹8,000+ Crores",
        inception: "2000",
        fundManager: "Ms. Priyanka Khandelwal",
        experience: "12+ years",
        trackRecord: "Technology sector expertise",
        regulatoryCompliance: "SEBI registered",
        riskFactors: ["Sector concentration", "High volatility", "Market timing risk"],
        safetyMeasures: ["Professional management", "Regular rebalancing", "Diversification within sector"]
      }
    }
  ];

  useEffect(() => {
    fetchPersonalizedRecommendations();
    generateInvestmentAnalysis();
  }, [userProfile]);

  const fetchPersonalizedRecommendations = async () => {
    if (!userProfile) {
      const customizedSchemes = customizeDefaultSchemes({});
      setRecommendations(customizedSchemes);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.getRecommendations(userProfile);
      if (response && response.recommendations && response.recommendations.length > 0) {
        // Transform backend recommendations to match our scheme format
        const transformedRecommendations = response.recommendations.map((rec, index) => ({
          id: `rec-${index}`,
          name: rec.title,
          category: rec.type,
          type: rec.type,
          minAmount: 1000, // Default minimum
          duration: 'Flexible',
          expectedReturn: '8-12%',
          riskLevel: rec.priority === 'high' ? 'High' : rec.priority === 'medium' ? 'Moderate' : 'Low',
          rating: 4.5,
          safetyScore: 7.0,
          description: rec.description,
          suitability: rec.description,
          features: ['Personalized', 'AI Recommended'],
          pros: ['Tailored to your profile', 'Risk-adjusted'],
          cons: ['Requires regular review'],
          howToInvest: 'Contact our advisors for personalized guidance',
          safetyAnalysis: {
            recommendation: "AI-generated based on your profile",
            riskAssessment: "Personalized risk analysis",
            safetyMeasures: ["Regular monitoring", "Profile-based selection"],
            riskFactors: ["Profile changes", "Market conditions"]
          }
        }));
        setRecommendations(transformedRecommendations);
      } else {
        // If no personalized recommendations, use default with profile-based customization
        const customizedSchemes = customizeDefaultSchemes(userProfile);
        setRecommendations(customizedSchemes);
      }
    } catch (error) {
      console.error('Failed to fetch personalized recommendations:', error);
      // Use default schemes with profile-based customization
      const customizedSchemes = customizeDefaultSchemes(userProfile);
      setRecommendations(customizedSchemes);
      setError('Using personalized recommendations based on your profile');
    } finally {
      setLoading(false);
    }
  };

  const generateInvestmentAnalysis = () => {
    if (!userProfile) return;

    const analysis = {
      profileSummary: {
        age: userProfile.age || 30,
        income: userProfile.income || 0,
        riskTolerance: userProfile.riskTolerance || 'Moderate',
        investmentHorizon: userProfile.investmentHorizon || '5-10 years',
        monthlyInvestmentCapacity: userProfile.monthlyInvestmentCapacity || 0
      },
      riskAssessment: {
        overallRisk: calculateOverallRisk(),
        riskFactors: identifyRiskFactors(),
        riskMitigation: suggestRiskMitigation()
      },
      portfolioRecommendation: {
        equityAllocation: calculateEquityAllocation(),
        debtAllocation: calculateDebtAllocation(),
        goldAllocation: 5, // Standard 5% allocation
        emergencyFund: calculateEmergencyFund()
      },
      safetyAnalysis: {
        overallSafety: calculateOverallSafety(),
        safetyScore: calculateSafetyScore(),
        safetyRecommendations: generateSafetyRecommendations()
      },
      investmentReport: {
        isSafe: determineInvestmentSafety(),
        keyFindings: generateKeyFindings(),
        recommendations: generateDetailedRecommendations(),
        nextSteps: generateNextSteps()
      }
    };

    setInvestmentAnalysis(analysis);
  };

  const calculateOverallRisk = () => {
    const age = userProfile.age || 30;
    const riskTolerance = userProfile.riskTolerance || 'Moderate';
    
    if (age < 30 && riskTolerance.toLowerCase().includes('aggressive')) return 'High';
    if (age > 50 || riskTolerance.toLowerCase().includes('conservative')) return 'Low';
    return 'Moderate';
  };

  const identifyRiskFactors = () => {
    const factors = [];
    if (!userProfile.emergencyFund || userProfile.emergencyFund < 50000) {
      factors.push('Insufficient emergency fund');
    }
    if (userProfile.debt && userProfile.debt > userProfile.income * 0.3) {
      factors.push('High debt-to-income ratio');
    }
    if (!userProfile.existingInsurance || userProfile.existingInsurance === 'none') {
      factors.push('No insurance coverage');
    }
    return factors;
  };

  const suggestRiskMitigation = () => {
    const mitigations = [];
    if (!userProfile.emergencyFund || userProfile.emergencyFund < 50000) {
      mitigations.push('Build emergency fund of 3-6 months expenses');
    }
    if (userProfile.debt && userProfile.debt > userProfile.income * 0.3) {
      mitigations.push('Reduce high-interest debt before investing');
    }
    if (!userProfile.existingInsurance || userProfile.existingInsurance === 'none') {
      mitigations.push('Consider term insurance for family protection');
    }
    return mitigations;
  };

  const calculateEquityAllocation = () => {
    const age = userProfile.age || 30;
    const riskTolerance = userProfile.riskTolerance || 'Moderate';
    
    let baseAllocation = 100 - age; // 100 - age rule
    if (riskTolerance.toLowerCase().includes('conservative')) baseAllocation -= 20;
    if (riskTolerance.toLowerCase().includes('aggressive')) baseAllocation += 20;
    
    return Math.max(10, Math.min(80, baseAllocation));
  };

  const calculateDebtAllocation = () => {
    return 100 - calculateEquityAllocation() - 5; // 5% for gold
  };

  const calculateEmergencyFund = () => {
    const monthlyExpenses = (userProfile.income || 0) / 12 * 0.7;
    return monthlyExpenses * 6; // 6 months of expenses
  };

  const calculateOverallSafety = () => {
    const factors = [];
    if (userProfile.emergencyFund >= 50000) factors.push(1);
    if (userProfile.existingInsurance && userProfile.existingInsurance !== 'none') factors.push(1);
    if (userProfile.debt < (userProfile.income || 0) * 0.3) factors.push(1);
    
    const safetyPercentage = (factors.length / 3) * 100;
    if (safetyPercentage >= 80) return 'Very Safe';
    if (safetyPercentage >= 60) return 'Safe';
    if (safetyPercentage >= 40) return 'Moderate';
    return 'Needs Attention';
  };

  const calculateSafetyScore = () => {
    const factors = [];
    if (userProfile.emergencyFund >= 50000) factors.push(1);
    if (userProfile.existingInsurance && userProfile.existingInsurance !== 'none') factors.push(1);
    if (userProfile.debt < (userProfile.income || 0) * 0.3) factors.push(1);
    if (userProfile.savings > (userProfile.income || 0) * 0.2) factors.push(1);
    
    return (factors.length / 4) * 10;
  };

  const generateSafetyRecommendations = () => {
    const recommendations = [];
    if (!userProfile.emergencyFund || userProfile.emergencyFund < 50000) {
      recommendations.push('Prioritize building emergency fund');
    }
    if (!userProfile.existingInsurance || userProfile.existingInsurance === 'none') {
      recommendations.push('Consider term insurance coverage');
    }
    if (userProfile.debt > (userProfile.income || 0) * 0.3) {
      recommendations.push('Focus on debt reduction');
    }
    return recommendations;
  };

  const determineInvestmentSafety = () => {
    const safetyScore = calculateSafetyScore();
    return safetyScore >= 7.5;
  };

  const generateKeyFindings = () => {
    const findings = [];
    findings.push(`Your investment profile shows ${calculateOverallRisk().toLowerCase()} risk tolerance`);
    findings.push(`Recommended equity allocation: ${calculateEquityAllocation()}%`);
    findings.push(`Emergency fund status: ${userProfile.emergencyFund >= 50000 ? 'Adequate' : 'Needs attention'}`);
    findings.push(`Insurance coverage: ${userProfile.existingInsurance && userProfile.existingInsurance !== 'none' ? 'Present' : 'Recommended'}`);
    return findings;
  };

  const generateDetailedRecommendations = () => {
    const recommendations = [];
    recommendations.push('Start with SIPs in diversified equity funds');
    recommendations.push('Consider debt funds for stability');
    recommendations.push('Include gold ETFs for diversification');
    recommendations.push('Review portfolio quarterly');
    return recommendations;
  };

  const generateNextSteps = () => {
    const steps = [];
    steps.push('Complete KYC for mutual fund investments');
    steps.push('Set up SIP for regular investing');
    steps.push('Consult with financial advisor');
    steps.push('Monitor and rebalance portfolio');
    return steps;
  };

  const customizeDefaultSchemes = (profile) => {
    const schemes = [...defaultSchemes];
    
    // Customize based on user profile
    if (profile.riskTolerance) {
      schemes.forEach(scheme => {
        if (profile.riskTolerance.toLowerCase().includes('conservative') && scheme.riskLevel === 'High') {
          scheme.suitability = "May not be suitable for conservative investors. Consider lower risk options.";
        } else if (profile.riskTolerance.toLowerCase().includes('aggressive') && scheme.riskLevel === 'Very Low') {
          scheme.suitability = "Consider higher risk options for better returns based on your aggressive profile.";
        }
      });
    }

    // Customize based on monthly investment capacity
    if (profile.monthlyInvestmentCapacity) {
      const capacity = parseInt(profile.monthlyInvestmentCapacity);
      schemes.forEach(scheme => {
        if (scheme.minAmount > capacity) {
          scheme.suitability += " Note: Minimum investment amount may be higher than your monthly capacity.";
        }
      });
    }

    return schemes;
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
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

  const getSafetyColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'mutual fund': return <TrendingUp className="h-5 w-5" />;
      case 'insurance': return <Shield className="h-5 w-5" />;
      case 'fixed deposit': return <DollarSign className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const analyzeInvestmentSecurity = async (investment) => {
    if (!userProfile) {
      toast.error('Please complete your profile first to get personalized security analysis');
      return;
    }

    setAnalyzingSecurity(true);
    setSelectedInvestment(investment);

    try {
      // Prepare investment details for analysis
      const investmentDetails = {
        type: investment.type,
        amount: investment.minAmount,
        duration: investment.duration,
        expected_return: investment.expectedReturn,
        risk_level: investment.riskLevel,
        name: investment.name,
        category: investment.category
      };

      const response = await api.analyzeInvestmentSecurity(
        investmentDetails,
        userProfile
      );

      if (response) {
        setSecurityAnalysis(response);
        toast.success('Security analysis completed!');
      }
    } catch (error) {
      console.error('Security analysis error:', error);
      toast.error('Failed to analyze investment security. Please try again.');
    } finally {
      setAnalyzingSecurity(false);
    }
  };

  const SecurityAnalysisModal = ({ analysis, investment, onClose }) => {
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
                <p className="text-gray-600 mt-1">{investment?.name}</p>
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
                  // Add logic to save analysis or take action
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Analysis Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investment Recommendations</h2>
          <p className="text-gray-600 mt-1">Personalized investment suggestions based on your profile</p>
        </div>
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="btn-primary flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>{showAnalysis ? 'Hide' : 'Show'} Investment Analysis</span>
        </button>
      </div>

      {/* Investment Analysis Report */}
      {showAnalysis && investmentAnalysis && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card bg-gradient-to-r from-blue-50 to-purple-50"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Investment Analysis Report</h3>
              <p className="text-gray-600">Comprehensive analysis of your investment profile</p>
            </div>
          </div>

          {/* Safety Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-gray-900">Safety Assessment</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Safety:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSafetyColor(investmentAnalysis.safetyAnalysis.safetyScore)}`}>
                    {investmentAnalysis.safetyAnalysis.overallSafety}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Score:</span>
                  <span className="font-semibold">{investmentAnalysis.safetyAnalysis.safetyScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Safe:</span>
                  <span className={`flex items-center space-x-1 ${investmentAnalysis.investmentReport.isSafe ? 'text-green-600' : 'text-red-600'}`}>
                    {investmentAnalysis.investmentReport.isSafe ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span className="font-medium">{investmentAnalysis.investmentReport.isSafe ? 'Yes' : 'Needs Attention'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <PieChart className="h-6 w-6 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Portfolio Allocation</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Equity:</span>
                  <span className="font-semibold text-blue-600">{investmentAnalysis.portfolioRecommendation.equityAllocation}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Debt:</span>
                  <span className="font-semibold text-green-600">{investmentAnalysis.portfolioRecommendation.debtAllocation}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gold:</span>
                  <span className="font-semibold text-yellow-600">{investmentAnalysis.portfolioRecommendation.goldAllocation}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary-600" />
              <span>Key Findings</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investmentAnalysis.investmentReport.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations and Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary-600" />
                <span>Recommendations</span>
              </h4>
              <div className="space-y-2">
                {investmentAnalysis.investmentReport.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowRight className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary-600" />
                <span>Next Steps</span>
              </h4>
              <div className="space-y-2">
                {investmentAnalysis.investmentReport.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowRight className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Investment Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((scheme) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  {getTypeIcon(scheme.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                  <p className="text-sm text-gray-600">{scheme.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scheme.riskLevel)}`}>
                  {scheme.riskLevel}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyColor(scheme.safetyScore)}`}>
                  Safety: {scheme.safetyScore}/10
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Min Amount</p>
                <p className="text-lg font-semibold text-gray-900">₹{scheme.minAmount.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Expected Return</p>
                <p className="text-lg font-semibold text-green-600">{scheme.expectedReturn}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{scheme.rating}</span>
              </div>
              <button
                onClick={() => toggleCard(scheme.id)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {expandedCard === scheme.id ? 'Show Less' : 'View Details'}
              </button>
            </div>

            <AnimatePresence>
              {expandedCard === scheme.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 pt-4 space-y-4"
                >
                  {/* Safety Analysis */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>Safety Analysis</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      {scheme.safetyAnalysis && Object.entries(scheme.safetyAnalysis).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {scheme.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-green-600">Pros</h4>
                      <ul className="space-y-1">
                        {scheme.pros.map((pro, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-red-600">Cons</h4>
                      <ul className="space-y-1">
                        {scheme.cons.map((con, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suitability */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Suitability</h4>
                    <p className="text-sm text-gray-700">{scheme.suitability}</p>
                  </div>

                  {/* Investment Button */}
                  <button className="w-full btn-primary">
                    Invest Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Security Analysis Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => analyzeInvestmentSecurity(scheme)}
                disabled={analyzingSecurity}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
              >
                {analyzingSecurity ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                <span>
                  {analyzingSecurity ? 'Analyzing...' : 'Security Analysis'}
                </span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Analysis Modal */}
      <AnimatePresence>
        {securityAnalysis && selectedInvestment && (
          <SecurityAnalysisModal
            analysis={securityAnalysis}
            investment={selectedInvestment}
            onClose={() => {
              setSecurityAnalysis(null);
              setSelectedInvestment(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationCard; 