import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, User, Shield, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import ProfileSetup from '../components/ProfileSetup';

const ProfileSetupPage = () => {
  const [isComplete, setIsComplete] = useState(false);
  const { saveProfile } = useAuth();
  const navigate = useNavigate();

  const handleProfileComplete = async (profileData) => {
    try {
      await saveProfile(profileData);
      setIsComplete(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Setup Complete!</h2>
          <p className="text-gray-600 mb-4">Redirecting to your personalized dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Profile Setup</h1>
            </div>
            <div className="text-sm text-gray-500">
              Step 1 of 2
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Setup Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <ProfileSetup onComplete={handleProfileComplete} />
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Why Profile Setup Matters
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg">
                      <Target className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Personalized Recommendations</h4>
                      <p className="text-sm text-gray-600">
                        Get financial products and advice tailored to your specific needs and goals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-secondary-100 rounded-lg">
                      <Shield className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fraud Protection</h4>
                      <p className="text-sm text-gray-600">
                        Our AI analyzes your profile to detect potential fraud risks and protect your finances.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Smart Learning</h4>
                      <p className="text-sm text-gray-600">
                        Receive customized learning content based on your financial knowledge level.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-800">
                    Be as accurate as possible with your financial information. This helps us provide the best recommendations and protect you from fraud.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">🔒 Data Security</h4>
                  <p className="text-sm text-gray-700">
                    All your information is encrypted and stored securely. We never share your personal data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage; 