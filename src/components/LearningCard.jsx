import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  ArrowRight,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import toast from 'react-hot-toast';

const LearningCard = () => {
  const { userProfile } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [currentProgress, setCurrentProgress] = useState({});

  // Detailed learning modules with comprehensive content
  const learningModules = [
    {
      id: 'insurance-basics',
      title: 'Insurance Fundamentals',
      description: 'Master the basics of insurance, types, and how they protect your financial future',
      duration: '45 minutes',
      difficulty: 'Beginner',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-blue-500',
      topics: [
        'What is Insurance and Why You Need It',
        'Types of Insurance: Life, Health, Auto, Home',
        'Understanding Premiums, Deductibles, and Coverage',
        'How to Choose the Right Insurance Policy',
        'Insurance Myths and Misconceptions'
      ],
      content: {
        overview: 'Insurance is a financial safety net that protects you and your family from unexpected financial losses. This module covers everything from basic concepts to advanced strategies for choosing the right coverage.',
        keyTakeaways: [
          'Understanding different types of insurance and their purposes',
          'How to calculate your insurance needs based on your lifestyle',
          'Strategies for finding the best insurance rates',
          'Common mistakes to avoid when buying insurance'
        ],
        practicalExercises: [
          'Calculate your life insurance needs using the DIME method',
          'Compare different health insurance plans',
          'Create a personal insurance checklist'
        ]
      }
    },
    {
      id: 'investment-strategies',
      title: 'Investment Strategies',
      description: 'Learn proven investment strategies to grow your wealth and achieve financial goals',
      duration: '60 minutes',
      difficulty: 'Intermediate',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-green-500',
      topics: [
        'Investment Basics: Stocks, Bonds, and Mutual Funds',
        'Risk Management and Portfolio Diversification',
        'Long-term vs Short-term Investment Strategies',
        'Tax-efficient Investing Strategies',
        'Building a Retirement Portfolio'
      ],
      content: {
        overview: 'Investment strategies are systematic approaches to growing your wealth over time. This module teaches you how to build a diversified portfolio that matches your risk tolerance and financial goals.',
        keyTakeaways: [
          'Understanding different asset classes and their risk-return profiles',
          'How to create a diversified investment portfolio',
          'Tax-efficient investment strategies for long-term wealth building',
          'Retirement planning through systematic investment'
        ],
        practicalExercises: [
          'Create a personal investment plan based on your goals',
          'Analyze and compare different mutual funds',
          'Design a retirement portfolio strategy'
        ]
      }
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Create a comprehensive financial plan to achieve your life goals',
      duration: '75 minutes',
      difficulty: 'Advanced',
      icon: <Target className="h-8 w-8" />,
      color: 'bg-purple-500',
      topics: [
        'Setting SMART Financial Goals',
        'Budgeting and Cash Flow Management',
        'Emergency Fund Planning',
        'Debt Management Strategies',
        'Estate Planning Basics'
      ],
      content: {
        overview: 'Financial planning is the process of creating a roadmap to achieve your financial goals. This comprehensive module covers everything from basic budgeting to advanced estate planning strategies.',
        keyTakeaways: [
          'How to set and prioritize financial goals',
          'Creating and maintaining a realistic budget',
          'Building and maintaining an emergency fund',
          'Effective debt management and elimination strategies'
        ],
        practicalExercises: [
          'Create a comprehensive financial plan',
          'Develop a debt elimination strategy',
          'Design an emergency fund plan'
        ]
      }
    },
    {
      id: 'fraud-protection',
      title: 'Fraud Protection & Security',
      description: 'Protect yourself from financial fraud and secure your digital assets',
      duration: '50 minutes',
      difficulty: 'Beginner',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-red-500',
      topics: [
        'Common Types of Financial Fraud',
        'Digital Security Best Practices',
        'Identity Theft Prevention',
        'Safe Online Banking and Shopping',
        'What to Do If You\'re a Victim of Fraud'
      ],
      content: {
        overview: 'In today\'s digital world, protecting yourself from financial fraud is crucial. This module teaches you how to recognize, prevent, and respond to various types of financial fraud.',
        keyTakeaways: [
          'Identifying common fraud schemes and red flags',
          'Implementing strong digital security practices',
          'Protecting your personal and financial information',
          'Steps to take if you become a victim of fraud'
        ],
        practicalExercises: [
          'Conduct a personal security audit',
          'Create a fraud prevention checklist',
          'Develop an incident response plan'
        ]
      }
    }
  ];

  // Calculate learning progress
  const calculateProgress = () => {
    const totalModules = learningModules.length;
    const completed = completedModules.length;
    const progress = (completed / totalModules) * 100;
    
    return {
      total: totalModules,
      completed: completed,
      progress: Math.round(progress),
      remaining: totalModules - completed
    };
  };

  const progress = calculateProgress();

  // Mark module as completed
  const completeModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      
      // Update user profile with completed modules
      if (userProfile) {
        // Here you would typically update the user profile in the backend
        console.log('Module completed:', moduleId);
        toast.success(`Congratulations! You've completed ${learningModules.find(m => m.id === moduleId)?.title}`);
      }
    }
  };

  // Start learning a module
  const startModule = (module) => {
    setSelectedModule(module);
    toast.success(`Starting ${module.title}`);
  };

  const ModuleCard = ({ module, index }) => {
    const isCompleted = completedModules.includes(module.id);
    const isInProgress = currentProgress[module.id] > 0 && currentProgress[module.id] < 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => startModule(module)}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg text-white ${module.color}`}>
            {module.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{module.title}</h3>
              <div className="flex items-center space-x-2">
                {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                {isInProgress && <Clock className="h-5 w-5 text-blue-500" />}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {module.difficulty}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{module.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{module.topics.length} topics</span>
                </div>
              </div>
              <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium">
                <span>{isCompleted ? 'Review' : 'Start'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ModuleDetail = ({ module, onClose }) => {
    const [currentTopic, setCurrentTopic] = useState(0);
    const isCompleted = completedModules.includes(module.id);

    const handleComplete = () => {
      completeModule(module.id);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg text-white ${module.color}`}>
                  {module.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{module.title}</h2>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{module.content.overview}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
                  <div className="space-y-2">
                    {module.topics.map((topic, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {module.content.keyTakeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Practical Exercises</h3>
                  <div className="space-y-3">
                    {module.content.practicalExercises.map((exercise, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{index + 1}.</span>
                        <span className="text-gray-700 ml-2">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-3">Module Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{module.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">{module.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Topics:</span>
                      <span className="font-medium">{module.topics.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        isCompleted ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {isCompleted ? 'Completed' : 'Not Started'}
                      </span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <button
                    onClick={handleComplete}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as Completed</span>
                  </button>
                )}

                <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
                  <h4 className="font-semibold text-gray-900 mb-2">Pro Tip</h4>
                  <p className="text-sm text-gray-700">
                    Take notes while learning and practice the exercises to reinforce your understanding. 
                    Consider revisiting this module periodically to refresh your knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Center</h2>
          <p className="text-gray-600">Master financial literacy with our comprehensive modules</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{progress.progress}%</div>
          <div className="text-sm text-gray-600">
            {progress.completed} of {progress.total} modules completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">{progress.remaining} modules remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
          />
        </div>
        {progress.completed > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Great progress! Keep up the learning momentum.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Learning Modules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Modules</h3>
        {learningModules.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <ModuleDetail 
          module={selectedModule} 
          onClose={() => setSelectedModule(null)} 
        />
      )}
    </div>
  );
};

export default LearningCard; 