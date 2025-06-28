import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Lock, 
  Star, 
  Clock, 
  Target,
  TrendingUp,
  Shield,
  Calculator
} from 'lucide-react';
import { learningAPI } from '../lib/api';

const LearningCard = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await learningAPI.getModules();
      setModules(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setSelectedLesson(null);
  };

  const handleLessonClick = async (lesson) => {
    try {
      const response = await learningAPI.getLesson(selectedModule.id, lesson.id);
      setSelectedLesson(response.data);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    }
  };

  const completeLesson = async (lessonId) => {
    try {
      await learningAPI.updateProgress({
        moduleId: selectedModule.id,
        lessonId: lessonId,
        completed: true,
        timestamp: new Date().toISOString()
      });
      
      setProgress(prev => ({
        ...prev,
        [lessonId]: true
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const learningModules = [
    {
      id: 'insurance_basics',
      title: 'Insurance Fundamentals',
      description: 'Learn the basics of insurance and different types of coverage',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-blue-500',
      progress: 60,
      lessons: [
        {
          id: 'term_vs_ulip',
          title: 'Term Insurance vs ULIP',
          duration: '5 min',
          difficulty: 'Beginner',
          completed: false,
          description: 'Understand the difference between term insurance and ULIP'
        },
        {
          id: 'health_insurance',
          title: 'Health Insurance Basics',
          duration: '7 min',
          difficulty: 'Beginner',
          completed: false,
          description: 'Learn about health insurance coverage and benefits'
        }
      ]
    },
    {
      id: 'investment_basics',
      title: 'Investment Fundamentals',
      description: 'Master the basics of investing and wealth creation',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-500',
      progress: 30,
      lessons: [
        {
          id: 'sip_emergency',
          title: 'SIPs and Emergency Funds',
          duration: '6 min',
          difficulty: 'Beginner',
          completed: false,
          description: 'Learn about Systematic Investment Plans and emergency fund importance'
        },
        {
          id: 'mutual_funds',
          title: 'Mutual Funds Explained',
          duration: '8 min',
          difficulty: 'Intermediate',
          completed: false,
          description: 'Understand mutual funds and their types'
        }
      ]
    },
    {
      id: 'loan_basics',
      title: 'Loan and EMI Understanding',
      description: 'Learn about loans, EMIs, and how to avoid debt traps',
      icon: <Calculator className="h-6 w-6" />,
      color: 'bg-purple-500',
      progress: 0,
      lessons: [
        {
          id: 'emi_calculation',
          title: 'Understanding EMI and Loan Traps',
          duration: '10 min',
          difficulty: 'Beginner',
          completed: false,
          description: 'Learn how EMIs work and common loan traps to avoid'
        },
        {
          id: 'credit_score',
          title: 'Credit Score and Loans',
          duration: '6 min',
          difficulty: 'Beginner',
          completed: false,
          description: 'Understand credit scores and their impact on loans'
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (selectedModule && selectedLesson) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Lesson Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to {selectedModule.title}
          </button>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{selectedLesson.duration}</span>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-lg ${selectedModule.color} text-white`}>
              {selectedModule.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h2>
              <p className="text-gray-600">{selectedLesson.description}</p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">📚 What you'll learn:</h3>
              <ul className="space-y-2">
                <li>✓ Key concepts and definitions</li>
                <li>✓ Real-world examples and scenarios</li>
                <li>✓ Practical tips and best practices</li>
                <li>✓ Common mistakes to avoid</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Interactive Learning</h3>
              <p className="text-blue-800">
                This lesson includes interactive elements to help you understand the concepts better.
                Take your time and don't hesitate to ask questions!
              </p>
            </div>

            {/* Quiz Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-900">🧠 Quick Quiz</h3>
              <p className="text-green-800 mb-4">
                Test your understanding with this quick quiz:
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="font-medium mb-2">Question 1: What is the main purpose of term insurance?</p>
                  <div className="space-y-2">
                    {['Pure protection for family', 'Investment with returns', 'Tax saving only', 'All of the above'].map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="quiz1" className="text-green-600" />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setSelectedLesson(null)}
              className="btn-secondary"
            >
              Previous Lesson
            </button>
            <button
              onClick={() => completeLesson(selectedLesson.id)}
              className="btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Lesson</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (selectedModule) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Module Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedModule(null)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Learning Modules
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${selectedModule.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{selectedModule.progress}%</span>
          </div>
        </div>

        {/* Module Info */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-3 rounded-lg ${selectedModule.color} text-white`}>
              {selectedModule.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
              <p className="text-gray-600">{selectedModule.description}</p>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-4">
            {selectedModule.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${selectedModule.color} text-white`}>
                      <Play className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-500">{lesson.difficulty}</span>
                    </div>
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h2>
        <p className="text-gray-600">Master financial concepts with our bite-sized, interactive lessons</p>
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleModuleClick(module)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${module.color} text-white`}>
                {module.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${module.color} h-2 rounded-full`}
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{module.lessons.length} lessons</span>
                <span>{module.lessons.filter(l => l.completed).length} completed</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Learning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Take Your Time</h4>
              <p className="text-sm text-gray-600">Each lesson is designed to be completed in 5-10 minutes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Practice Regularly</h4>
              <p className="text-sm text-gray-600">Complete lessons regularly to build strong financial knowledge</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningCard; 