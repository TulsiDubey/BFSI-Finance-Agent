import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/profile-setup');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test function for development
  const handleTestLogin = () => {
    // Simulate successful login for testing
    localStorage.setItem('testUser', JSON.stringify({
      uid: 'test-user-123',
      email: 'test@example.com',
      profileComplete: false
    }));
    navigate('/profile-setup');
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Fraud Detection',
      description: 'AI-powered fraud detection to keep your finances safe'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Smart Recommendations',
      description: 'Personalized financial product recommendations'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'AI chatbot available round the clock for assistance'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Learning Modules',
      description: 'Bite-sized lessons on financial literacy'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6">
              Your Personal Financial Advisor
            </h1>
            <p className="text-xl mb-12 text-primary-100">
              Get personalized financial guidance, learn about investments, and protect yourself from fraud with AI-powered insights.
            </p>
            
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-primary-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </motion.div>

          <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />

          {/* Test Login Button for Development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              onClick={handleTestLogin}
              className="w-full mt-4 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              🧪 Test Login (Development Only)
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </motion.div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Why Choose BFSI Advisor?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 