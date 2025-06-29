import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Heart,
  Car,
  Home,
  Plane,
  Briefcase,
  X,
  Save,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import toast from 'react-hot-toast';

const policyTypes = [
  {
    id: 'life',
    name: 'Life Insurance',
    icon: <Heart className="h-6 w-6" />,
    description: 'Protect your family\'s future',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  {
    id: 'health',
    name: 'Health Insurance',
    icon: <Heart className="h-6 w-6" />,
    description: 'Cover medical expenses',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: <Car className="h-6 w-6" />,
    description: 'Protect your vehicle',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    id: 'home',
    name: 'Home Insurance',
    icon: <Home className="h-6 w-6" />,
    description: 'Protect your property',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    icon: <Plane className="h-6 w-6" />,
    description: 'Cover travel risks',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    id: 'business',
    name: 'Business Insurance',
    icon: <Briefcase className="h-6 w-6" />,
    description: 'Protect your business',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700'
  }
];

const AddPolicy = ({ onClose, onPolicyAdded }) => {
  const { userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPolicyType, setSelectedPolicyType] = useState(null);
  const [policyData, setPolicyData] = useState({
    policyType: '',
    policyName: '',
    coverageAmount: '',
    premiumAmount: '',
    startDate: '',
    endDate: '',
    insurer: '',
    policyNumber: '',
    nominee: '',
    nomineeRelation: '',
    nomineeContact: '',
    documents: []
  });
  const [underwritingResult, setUnderwritingResult] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Auto-fill policy data based on user profile
  useEffect(() => {
    if (userProfile && selectedPolicyType) {
      setPolicyData(prev => ({
        ...prev,
        nominee: userProfile.spouseName || userProfile.name || '',
        nomineeRelation: userProfile.spouseName ? 'Spouse' : 'Self',
        nomineeContact: userProfile.phone || ''
      }));
    }
  }, [userProfile, selectedPolicyType]);

  const handlePolicyTypeSelect = (policyType) => {
    setSelectedPolicyType(policyType);
    setPolicyData(prev => ({ ...prev, policyType: policyType.id }));
    setStep(2);
  };

  const handleInputChange = (field, value) => {
    setPolicyData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);
    
    try {
      const uploadedFiles = [];
      for (const file of files) {
        // Simulate file upload - in real implementation, this would call the API
        uploadedFiles.push({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type
        });
      }
      
      setPolicyData(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedFiles]
      }));
      
      toast.success(`${files.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const performUnderwriting = async () => {
    setLoading(true);
    try {
      // Simulate API call for underwriting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock underwriting result
      const mockUnderwritingResult = {
        status: 'Approved',
        riskScore: Math.floor(Math.random() * 30) + 20, // 20-50 range
        premiumRate: (Math.random() * 5 + 2).toFixed(2), // 2-7% range
        recommendations: [
          'Consider increasing coverage amount for better protection',
          'Review policy annually for any changes in circumstances',
          'Keep all documents updated and accessible'
        ]
      };
      
      const mockRiskAssessment = {
        factors: [
          { name: 'Age', impact: 'Positive' },
          { name: 'Health Status', impact: 'Positive' },
          { name: 'Occupation', impact: 'Neutral' },
          { name: 'Lifestyle', impact: 'Positive' },
          { name: 'Medical History', impact: 'Neutral' }
        ]
      };
      
      setUnderwritingResult(mockUnderwritingResult);
      setRiskAssessment(mockRiskAssessment);
      setStep(4);
    } catch (error) {
      console.error('Underwriting error:', error);
      toast.error('Failed to perform underwriting assessment');
    } finally {
      setLoading(false);
    }
  };

  const savePolicy = async () => {
    setLoading(true);
    try {
      // Simulate API call to save policy
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedPolicy = {
        id: Date.now().toString(),
        ...policyData,
        underwritingResult,
        riskAssessment,
        createdAt: new Date().toISOString()
      };
      
      toast.success('Policy added successfully!');
      onPolicyAdded(savedPolicy);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save policy');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Policy</h2>
        <p className="text-gray-600">Select the type of insurance policy you want to add</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policyTypes.map((policy) => (
          <motion.div
            key={policy.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${policy.bgColor} border-2 border-transparent hover:border-${policy.color.split('-')[1]}-300`}
            onClick={() => handlePolicyTypeSelect(policy)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg text-white ${policy.color}`}>
                {policy.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Policy Details</h2>
          <p className="text-gray-600">Enter the details for your {selectedPolicyType?.name}</p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Policy Name
          </label>
          <input
            type="text"
            value={policyData.policyName}
            onChange={(e) => handleInputChange('policyName', e.target.value)}
            className="input-field"
            placeholder="Enter policy name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurer
          </label>
          <input
            type="text"
            value={policyData.insurer}
            onChange={(e) => handleInputChange('insurer', e.target.value)}
            className="input-field"
            placeholder="Insurance company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coverage Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={policyData.coverageAmount}
              onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
              className="input-field pl-10"
              placeholder="Enter coverage amount"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Premium Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={policyData.premiumAmount}
              onChange={(e) => handleInputChange('premiumAmount', e.target.value)}
              className="input-field pl-10"
              placeholder="Enter premium amount"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={policyData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={policyData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Policy Number
          </label>
          <input
            type="text"
            value={policyData.policyNumber}
            onChange={(e) => handleInputChange('policyNumber', e.target.value)}
            className="input-field"
            placeholder="Enter policy number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nominee Name
          </label>
          <input
            type="text"
            value={policyData.nominee}
            onChange={(e) => handleInputChange('nominee', e.target.value)}
            className="input-field"
            placeholder="Enter nominee name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nominee Relation
          </label>
          <select
            value={policyData.nomineeRelation}
            onChange={(e) => handleInputChange('nomineeRelation', e.target.value)}
            className="input-field"
          >
            <option value="">Select relation</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Self">Self</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nominee Contact
          </label>
          <input
            type="tel"
            value={policyData.nomineeContact}
            onChange={(e) => handleInputChange('nomineeContact', e.target.value)}
            className="input-field"
            placeholder="Enter nominee contact"
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(1)}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="btn-primary"
          disabled={!policyData.policyName || !policyData.insurer}
        >
          Next: Upload Documents
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
          <p className="text-gray-600">Upload relevant documents for underwriting</p>
        </div>
        <button
          onClick={() => setStep(2)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className="btn-primary cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
        </label>
      </div>
      
      {policyData.documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Uploaded Documents:</h3>
          {policyData.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{doc.name}</span>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(2)}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={performUnderwriting}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Perform Underwriting'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Underwriting Results</h2>
          <p className="text-gray-600">Risk assessment and policy recommendations</p>
        </div>
        <button
          onClick={() => setStep(3)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {underwritingResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Underwriting Decision</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  underwritingResult.status === 'Approved' ? 'text-green-600' : 
                  underwritingResult.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {underwritingResult.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Score:</span>
                <span className="font-medium">{underwritingResult.riskScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Premium Rate:</span>
                <span className="font-medium">{underwritingResult.premiumRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              {riskAssessment?.factors?.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{factor.name}:</span>
                  <span className={`font-medium ${
                    factor.impact === 'Positive' ? 'text-green-600' : 
                    factor.impact === 'Neutral' ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {underwritingResult?.recommendations && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {underwritingResult.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(3)}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={savePolicy}
          className="btn-primary"
          disabled={loading || underwritingResult?.status === 'Rejected'}
        >
          {loading ? 'Saving...' : 'Save Policy'}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPolicy; 