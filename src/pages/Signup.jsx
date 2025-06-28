import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    setLoading(true);
    try {
      await signup(formData.email, formData.password);
      navigate('/profile-setup');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: 'Secure & encrypted data protection'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      text: 'AI-powered financial insights'
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: '24/7 AI chatbot support'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: 'Personalized learning modules'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 to-secondary-800 text-white p-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6">
              Start Your Financial Journey
            </h1>
            <p className="text-xl mb-12 text-secondary-100">
              Join thousands of users who are taking control of their financial future with AI-powered guidance.
            </p>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 p-1 bg-white/20 rounded-full">
                    {benefit.icon}
                  </div>
                  <span className="text-secondary-100">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <h4 className="font-semibold mb-2">Free Forever</h4>
              <p className="text-secondary-100 text-sm">
                No hidden fees, no premium tiers. Get access to all features completely free.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your financial education journey</p>
          </motion.div>

          <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-secondary-600 hover:text-secondary-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>

          {/* Mobile Benefits */}
          <div className="lg:hidden mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Why Join BFSI Advisor?
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex-shrink-0 p-1 bg-secondary-100 rounded-full text-secondary-600">
                    {benefit.icon}
                  </div>
                  <span className="text-sm text-gray-700">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 