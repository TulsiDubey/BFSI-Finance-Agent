import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, User, DollarSign, Target, Shield, Home, Car, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileSetup = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    age: '',
    occupation: '',
    city: '',
    
    // Financial Information
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: '',
    existingInvestments: '',
    
    // Goals and Preferences
    primaryGoal: '',
    riskTolerance: '',
    investmentHorizon: '',
    monthlyInvestmentCapacity: '',
    
    // Family Information
    maritalStatus: '',
    dependents: '',
    existingInsurance: '',
    
    // Financial Products Interest
    interestedProducts: [],
    loanRequirements: '',
    emergencyFund: '',

    // Existing Insurance Policies
    existingPolicies: [],
  });

  const steps = [
    {
      title: 'Personal Information',
      icon: <User className="h-5 w-5" />,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'age', label: 'Age', type: 'number', required: true },
        { name: 'occupation', label: 'Occupation', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
      ]
    },
    {
      title: 'Financial Overview',
      icon: <DollarSign className="h-5 w-5" />,
      fields: [
        { name: 'monthlyIncome', label: 'Monthly Income (₹)', type: 'number', required: true },
        { name: 'monthlyExpenses', label: 'Monthly Expenses (₹)', type: 'number', required: true },
        { name: 'savings', label: 'Current Savings (₹)', type: 'number', required: true },
        { name: 'existingInvestments', label: 'Existing Investments (₹)', type: 'number', required: false },
      ]
    },
    {
      title: 'Financial Goals',
      icon: <Target className="h-5 w-5" />,
      fields: [
        { 
          name: 'primaryGoal', 
          label: 'Primary Financial Goal', 
          type: 'select', 
          options: [
            'Retirement Planning',
            'Child Education',
            'Home Purchase',
            'Emergency Fund',
            'Tax Saving',
            'Wealth Creation',
            'Insurance Coverage'
          ],
          required: true 
        },
        { 
          name: 'riskTolerance', 
          label: 'Risk Tolerance', 
          type: 'select', 
          options: [
            'Conservative (Low risk, stable returns)',
            'Moderate (Balanced risk and returns)',
            'Aggressive (High risk, high potential returns)'
          ],
          required: true 
        },
        { 
          name: 'investmentHorizon', 
          label: 'Investment Time Horizon', 
          type: 'select', 
          options: [
            '1-3 years (Short term)',
            '3-7 years (Medium term)',
            '7+ years (Long term)'
          ],
          required: true 
        },
        { name: 'monthlyInvestmentCapacity', label: 'Monthly Investment Capacity (₹)', type: 'number', required: true },
      ]
    },
    {
      title: 'Family & Insurance',
      icon: <Shield className="h-5 w-5" />,
      fields: [
        { 
          name: 'maritalStatus', 
          label: 'Marital Status', 
          type: 'select', 
          options: ['Single', 'Married', 'Divorced', 'Widowed'],
          required: true 
        },
        { name: 'dependents', label: 'Number of Dependents', type: 'number', required: true },
        { 
          name: 'existingInsurance', 
          label: 'Existing Insurance Coverage', 
          type: 'select', 
          options: [
            'No insurance',
            'Life insurance only',
            'Health insurance only',
            'Both life and health',
            'Multiple policies'
          ],
          required: true 
        },
      ]
    },
    {
      title: 'Existing Insurance Policies',
      icon: <Shield className="h-5 w-5" />,
      fields: [],
      customComponent: true
    },
    {
      title: 'Product Preferences',
      icon: <Home className="h-5 w-5" />,
      fields: [
        { 
          name: 'interestedProducts', 
          label: 'Products of Interest (Select all that apply)', 
          type: 'multiselect', 
          options: [
            'Term Insurance',
            'Health Insurance',
            'ULIP',
            'Mutual Funds',
            'Fixed Deposits',
            'PPF',
            'ELSS',
            'Home Loan',
            'Personal Loan',
            'Credit Cards'
          ],
          required: true 
        },
        { 
          name: 'loanRequirements', 
          label: 'Loan Requirements', 
          type: 'select', 
          options: [
            'No loan requirements',
            'Home loan',
            'Personal loan',
            'Business loan',
            'Education loan',
            'Vehicle loan'
          ],
          required: true 
        },
        { name: 'emergencyFund', label: 'Emergency Fund (months of expenses)', type: 'number', required: true },
      ]
    }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const addPolicy = () => {
    const newPolicy = {
      id: Date.now(),
      policyType: '',
      policyNumber: '',
      insuranceCompany: '',
      premiumAmount: '',
      coverageAmount: '',
      startDate: '',
      endDate: '',
      nominee: ''
    };
    setFormData(prev => ({
      ...prev,
      existingPolicies: [...prev.existingPolicies, newPolicy]
    }));
  };

  const updatePolicy = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      existingPolicies: prev.existingPolicies.map(policy =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const removePolicy = (id) => {
    setFormData(prev => ({
      ...prev,
      existingPolicies: prev.existingPolicies.filter(policy => policy.id !== id)
    }));
  };

  const validateStep = (stepIndex) => {
    const currentStep = steps[stepIndex];
    
    // Handle custom component step (Existing Insurance Policies)
    if (currentStep.customComponent) {
      // For step 4 (Existing Insurance Policies), it's optional
      // Users can skip this step if they don't have existing policies
      return true;
    }
    
    // Validate regular fields
    const currentStepFields = currentStep.fields;
    for (const field of currentStepFields) {
      if (field.required && !formData[field.name]) {
        toast.error(`Please fill in ${field.label}`);
        return false;
      }
      
      // Additional validation for specific fields
      if (field.name === 'age' && formData[field.name]) {
        const age = parseInt(formData[field.name]);
        if (age < 18 || age > 100) {
          toast.error('Age must be between 18 and 100');
          return false;
        }
      }
      
      if (field.name === 'monthlyIncome' && formData[field.name]) {
        const income = parseInt(formData[field.name]);
        if (income < 0) {
          toast.error('Monthly income cannot be negative');
          return false;
        }
      }
      
      if (field.name === 'monthlyExpenses' && formData[field.name]) {
        const expenses = parseInt(formData[field.name]);
        if (expenses < 0) {
          toast.error('Monthly expenses cannot be negative');
          return false;
        }
      }
      
      if (field.name === 'savings' && formData[field.name]) {
        const savings = parseInt(formData[field.name]);
        if (savings < 0) {
          toast.error('Savings cannot be negative');
          return false;
        }
      }
      
      if (field.name === 'dependents' && formData[field.name]) {
        const dependents = parseInt(formData[field.name]);
        if (dependents < 0 || dependents > 20) {
          toast.error('Number of dependents must be between 0 and 20');
          return false;
        }
      }
      
      if (field.name === 'emergencyFund' && formData[field.name]) {
        const emergencyFund = parseInt(formData[field.name]);
        if (emergencyFund < 0 || emergencyFund > 60) {
          toast.error('Emergency fund must be between 0 and 60 months');
          return false;
        }
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="input-field"
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="input-field"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => handleMultiSelect(field.name, option)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderCustomComponent = () => {
    if (currentStep === 4) { // Existing Insurance Policies step
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Existing Insurance Policies</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  // Skip this step if user has no policies
                  if (formData.existingPolicies.length === 0) {
                    nextStep();
                  }
                }}
                className="btn-secondary"
              >
                Skip (No Policies)
              </button>
              <button
                type="button"
                onClick={addPolicy}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Policy</span>
              </button>
            </div>
          </div>
          
          {formData.existingPolicies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No existing policies added yet.</p>
              <p className="text-sm">Click "Add Policy" to add your insurance details or "Skip" if you don't have any.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.existingPolicies.map((policy, index) => (
                <div key={policy.id} className="card border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Policy {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePolicy(policy.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Type *
                      </label>
                      <select
                        value={policy.policyType}
                        onChange={(e) => updatePolicy(policy.id, 'policyType', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Select Policy Type</option>
                        <option value="Health">Health Insurance</option>
                        <option value="Life">Life Insurance</option>
                        <option value="Motor">Motor Insurance</option>
                        <option value="Home">Home Insurance</option>
                        <option value="Travel">Travel Insurance</option>
                        <option value="Term">Term Insurance</option>
                        <option value="ULIP">ULIP</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Number *
                      </label>
                      <input
                        type="text"
                        value={policy.policyNumber}
                        onChange={(e) => updatePolicy(policy.id, 'policyNumber', e.target.value)}
                        className="input-field"
                        placeholder="Enter policy number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Company *
                      </label>
                      <input
                        type="text"
                        value={policy.insuranceCompany}
                        onChange={(e) => updatePolicy(policy.id, 'insuranceCompany', e.target.value)}
                        className="input-field"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Premium Amount (₹) *
                      </label>
                      <input
                        type="number"
                        value={policy.premiumAmount}
                        onChange={(e) => updatePolicy(policy.id, 'premiumAmount', e.target.value)}
                        className="input-field"
                        placeholder="Enter premium amount"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coverage Amount (₹) *
                      </label>
                      <input
                        type="number"
                        value={policy.coverageAmount}
                        onChange={(e) => updatePolicy(policy.id, 'coverageAmount', e.target.value)}
                        className="input-field"
                        placeholder="Enter coverage amount"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={policy.startDate}
                        onChange={(e) => updatePolicy(policy.id, 'startDate', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={policy.endDate}
                        onChange={(e) => updatePolicy(policy.id, 'endDate', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nominee Name
                      </label>
                      <input
                        type="text"
                        value={policy.nominee}
                        onChange={(e) => updatePolicy(policy.id, 'nominee', e.target.value)}
                        className="input-field"
                        placeholder="Enter nominee name"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
        </div>
        <p className="text-gray-600">Please provide accurate information for personalized recommendations</p>
      </div>

      {/* Form Fields */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {steps[currentStep].customComponent ? (
          renderCustomComponent()
        ) : (
          steps[currentStep].fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <motion.button
          onClick={prevStep}
          disabled={currentStep === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </motion.button>

        {currentStep === steps.length - 1 ? (
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Complete Setup</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={nextStep}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup; 