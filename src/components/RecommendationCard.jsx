import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Target, ArrowRight, ChevronDown, ChevronUp, Star, Shield, Zap, CheckCircle, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { recommendationAPI } from '../lib/api';

const RecommendationCard = () => {
  const { userProfile } = useAuth();
  const [expandedCard, setExpandedCard] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      suitability: "Suitable for investors with moderate risk appetite looking for long-term wealth creation"
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
      suitability: "Ideal for family breadwinners seeking life protection with savings component"
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
      suitability: "Perfect for conservative investors and senior citizens seeking stable returns"
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
      suitability: "Suitable for aggressive investors with high risk tolerance and technology sector understanding"
    }
  ];

  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, [userProfile]);

  const fetchPersonalizedRecommendations = async () => {
    if (!userProfile) {
      setRecommendations(defaultSchemes);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await recommendationAPI.getRecommendations(userProfile);
      if (response.data && response.data.recommendations && response.data.recommendations.length > 0) {
        setRecommendations(response.data.recommendations);
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
          scheme.suitability += " Note: Minimum investment exceeds your monthly capacity. Consider SIP options.";
        }
      });
    }

    // Customize based on age
    if (profile.age) {
      const age = parseInt(profile.age);
      if (age > 60) {
        schemes.forEach(scheme => {
          if (scheme.type === 'Fixed Deposit') {
            scheme.suitability = "Excellent choice for senior citizens with higher interest rates.";
          }
        });
      }
    }

    // Customize based on existing insurance
    if (profile.existingInsurance) {
      schemes.forEach(scheme => {
        if (scheme.type === 'Insurance' && profile.existingInsurance.toLowerCase().includes('both')) {
          scheme.suitability = "You already have comprehensive insurance. Consider investment-focused products.";
        }
      });
    }

    return schemes;
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'very low': return 'text-green-600 bg-green-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'very high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'mutual fund': return <TrendingUp className="h-5 w-5" />;
      case 'insurance': return <Shield className="h-5 w-5" />;
      case 'fixed deposit': return <DollarSign className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Personalized Investment Recommendations</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your profile for personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
          <Target className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {userProfile ? 'Personalized Investment Recommendations' : 'Investment Recommendations'}
        </h2>
      </div>

      {userProfile && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Based on Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Risk Tolerance:</span> {userProfile.riskTolerance || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Investment Capacity:</span> ₹{userProfile.monthlyInvestmentCapacity || '0'}/month
            </div>
            <div>
              <span className="font-medium">Primary Goal:</span> {userProfile.primaryGoal || 'Not specified'}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((scheme) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    {getTypeIcon(scheme.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
                    <p className="text-sm text-gray-600">{scheme.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Min Investment</p>
                    <p className="font-semibold text-gray-900">₹{scheme.minAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{scheme.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Return</p>
                    <p className="font-semibold text-green-600">{scheme.expectedReturn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(scheme.riskLevel)}`}>
                      {scheme.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{scheme.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{scheme.type}</span>
                </div>
              </div>

              <button
                onClick={() => toggleCard(scheme.id)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {expandedCard === scheme.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            {expandedCard === scheme.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>Key Features</span>
                    </h4>
                    <ul className="space-y-2">
                      {scheme.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-orange-500" />
                      <span>Rules & Terms</span>
                    </h4>
                    <ul className="space-y-2">
                      {scheme.rules.map((rule, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-sm text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Pros</h4>
                    <ul className="space-y-1">
                      {scheme.pros.map((pro, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Cons</h4>
                    <ul className="space-y-1">
                      {scheme.cons.map((con, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Personalized Suitability</h4>
                  <p className="text-sm text-blue-800">{scheme.suitability}</p>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="btn-primary flex items-center space-x-2">
                    <span>Invest Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="btn-secondary">
                    Learn More
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Investment Disclaimer</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Past performance does not guarantee future returns</p>
          <p>• Investment values can go up or down</p>
          <p>• Please read all scheme documents carefully before investing</p>
          <p>• Consult with a financial advisor for personalized advice</p>
          <p>• Recommendations are based on your profile and may not be suitable for all investors</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard; 