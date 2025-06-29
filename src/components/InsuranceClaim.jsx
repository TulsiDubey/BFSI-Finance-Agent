import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Shield,
  Eye,
  Download,
  Trash2,
  Info,
  Lightbulb,
  FileImage,
  Calendar,
  User,
  MapPin,
  Activity,
  TrendingUp,
  AlertCircle,
  File,
  Image,
  Search,
  BarChart3,
  Camera,
  Monitor,
  CheckSquare,
  AlertOctagon,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/UserContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const InsuranceClaim = () => {
  const { userProfile } = useAuth();
  const [claimData, setClaimData] = useState({
    policyNumber: '',
    claimType: '',
    incidentDate: '',
    description: '',
    amount: '',
    location: ''
  });
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [claimStatus, setClaimStatus] = useState(null);
  const [monitoringStatus, setMonitoringStatus] = useState(null);

  // Supported file types
  const supportedFormats = ['pdf', 'jpg', 'jpeg', 'png'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const claimTypes = [
    { value: 'health', label: 'Health Insurance', icon: <Shield className="h-4 w-4" /> },
    { value: 'life', label: 'Life Insurance', icon: <User className="h-4 w-4" /> },
    { value: 'auto', label: 'Auto Insurance', icon: <MapPin className="h-4 w-4" /> },
    { value: 'home', label: 'Home Insurance', icon: <Shield className="h-4 w-4" /> },
    { value: 'travel', label: 'Travel Insurance', icon: <MapPin className="h-4 w-4" /> }
  ];

  // Document validation rules
  const documentRequirements = {
    health: [
      { type: 'medical_bills', required: true, description: 'Medical bills and invoices', formats: ['pdf', 'jpg', 'png'] },
      { type: 'prescription', required: true, description: 'Doctor prescriptions', formats: ['pdf', 'jpg', 'png'] },
      { type: 'diagnosis', required: true, description: 'Medical diagnosis reports', formats: ['pdf'] },
      { type: 'discharge_summary', required: false, description: 'Hospital discharge summary', formats: ['pdf', 'jpg', 'png'] }
    ],
    life: [
      { type: 'death_certificate', required: true, description: 'Death certificate', formats: ['pdf', 'jpg', 'png'] },
      { type: 'policy_document', required: true, description: 'Original policy document', formats: ['pdf'] },
      { type: 'nominee_details', required: true, description: 'Nominee identification documents', formats: ['pdf', 'jpg', 'png'] },
      { type: 'medical_records', required: false, description: 'Medical records if applicable', formats: ['pdf'] }
    ],
    auto: [
      { type: 'fir_copy', required: true, description: 'FIR copy (if applicable)', formats: ['pdf', 'jpg', 'png'] },
      { type: 'repair_bills', required: true, description: 'Vehicle repair bills', formats: ['pdf', 'jpg', 'png'] },
      { type: 'photos', required: true, description: 'Accident scene photos', formats: ['jpg', 'png'] },
      { type: 'police_report', required: false, description: 'Police report', formats: ['pdf', 'jpg', 'png'] }
    ],
    home: [
      { type: 'damage_photos', required: true, description: 'Damage assessment photos', formats: ['jpg', 'png'] },
      { type: 'repair_estimates', required: true, description: 'Repair cost estimates', formats: ['pdf', 'jpg', 'png'] },
      { type: 'police_report', required: false, description: 'Police report (if theft/burglary)', formats: ['pdf', 'jpg', 'png'] },
      { type: 'inventory_list', required: false, description: 'Stolen/damaged items inventory', formats: ['pdf', 'jpg', 'png'] }
    ],
    travel: [
      { type: 'travel_documents', required: true, description: 'Travel tickets and itinerary', formats: ['pdf', 'jpg', 'png'] },
      { type: 'medical_bills', required: true, description: 'Medical bills (if applicable)', formats: ['pdf', 'jpg', 'png'] },
      { type: 'police_report', required: false, description: 'Police report (if applicable)', formats: ['pdf', 'jpg', 'png'] },
      { type: 'receipts', required: true, description: 'Expense receipts', formats: ['pdf', 'jpg', 'png'] }
    ]
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isValidFormat = supportedFormats.includes(fileExtension);
      const isValidSize = file.size <= maxFileSize;

      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: fileExtension,
        status: isValidFormat && isValidSize ? 'uploading' : 'error',
        documentType: 'unknown',
        error: !isValidFormat ? 'Unsupported file format' : !isValidSize ? 'File too large' : null
      };
    });

    setUploadedDocuments(prev => [...prev, ...newFiles]);
    
    // Simulate file upload for valid files
    newFiles.filter(f => f.status === 'uploading').forEach(fileObj => {
      setTimeout(() => {
        setUploadedDocuments(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'uploaded' }
              : f
          )
        );
      }, 1000 + Math.random() * 2000);
    });
  };

  const removeDocument = (fileId) => {
    setUploadedDocuments(prev => prev.filter(f => f.id !== fileId));
  };

  const updateClaimData = (field, value) => {
    setClaimData(prev => ({ ...prev, [field]: value }));
  };

  const validateClaimData = () => {
    const errors = [];
    
    if (!claimData.policyNumber) errors.push('Policy number is required');
    if (!claimData.claimType) errors.push('Claim type is required');
    if (!claimData.incidentDate) errors.push('Incident date is required');
    if (!claimData.description) errors.push('Description is required');
    if (!claimData.amount) errors.push('Claim amount is required');
    if (!claimData.location) errors.push('Incident location is required');

    return errors;
  };

  const validateDocuments = () => {
    if (!claimData.claimType) return { valid: false, errors: ['Please select a claim type first'] };

    const requirements = documentRequirements[claimData.claimType] || [];
    const errors = [];
    const warnings = [];

    // Check for required documents
    requirements.forEach(req => {
      if (req.required) {
        const hasDocument = uploadedDocuments.some(doc => 
          doc.documentType === req.type || doc.name.toLowerCase().includes(req.type.replace('_', ' '))
        );
        if (!hasDocument) {
          errors.push(`Missing required document: ${req.description}`);
        }
      }
    });

    // Check document quality
    uploadedDocuments.forEach(doc => {
      if (doc.size > maxFileSize) {
        warnings.push(`${doc.name} is larger than 10MB and may cause processing delays`);
      }
      if (doc.status === 'error') {
        errors.push(`${doc.name}: ${doc.error}`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  };

  const submitClaim = async () => {
    const dataErrors = validateClaimData();
    const docValidation = validateDocuments();

    if (dataErrors.length > 0) {
      toast.error(`Please fix the following errors: ${dataErrors.join(', ')}`);
      return;
    }

    if (!docValidation.valid) {
      toast.error(`Document validation failed: ${docValidation.errors.join(', ')}`);
      return;
    }

    if (docValidation.warnings.length > 0) {
      toast.warning(`Warnings: ${docValidation.warnings.join(', ')}`);
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('claimData', JSON.stringify(claimData));
      formData.append('userProfile', JSON.stringify(userProfile));
      
      uploadedDocuments.forEach(doc => {
        if (doc.status === 'uploaded') {
          formData.append('documents', doc.file);
        }
      });

      const response = await api.submitClaim(formData);
      
      if (response.success) {
        setClaimStatus(response);
        setMonitoringStatus(response.monitoring_status);
        setCurrentStep(4);
        toast.success('Claim submitted successfully!');
      } else {
        toast.error('Failed to submit claim. Please try again.');
      }
    } catch (error) {
      console.error('Claim submission error:', error);
      toast.error('An error occurred while submitting your claim.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeDocuments = async () => {
    if (uploadedDocuments.length === 0) {
      toast.error('Please upload documents first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      uploadedDocuments.forEach(doc => {
        if (doc.status === 'uploaded') {
          formData.append('documents', doc.file);
        }
      });
      formData.append('claimType', claimData.claimType);

      const response = await api.analyzeSecurity(formData);
      
      if (response) {
        setAnalysis(response);
        setCurrentStep(3);
        toast.success('Document analysis completed!');
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      toast.error('Failed to analyze documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMonitoringStage = (stage) => {
    const stages = {
      'Document Analysis': { icon: <FileText className="h-4 w-4" />, color: 'text-blue-600' },
      'AI Fraud Detection': { icon: <Search className="h-4 w-4" />, color: 'text-purple-600' },
      'Claims Adjuster Review': { icon: <User className="h-4 w-4" />, color: 'text-green-600' },
      'Decision & Processing': { icon: <CheckCircle className="h-4 w-4" />, color: 'text-orange-600' }
    };
    return stages[stage] || { icon: <Activity className="h-4 w-4" />, color: 'text-gray-600' };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Claim Information</h3>
              <p className="text-gray-600">Please provide details about your insurance claim</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                <input
                  type="text"
                  value={claimData.policyNumber}
                  onChange={(e) => updateClaimData('policyNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your policy number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
                <select
                  value={claimData.claimType}
                  onChange={(e) => updateClaimData('claimType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select claim type</option>
                  {claimTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
                <input
                  type="date"
                  value={claimData.incidentDate}
                  onChange={(e) => updateClaimData('incidentDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount</label>
                <input
                  type="number"
                  value={claimData.amount}
                  onChange={(e) => updateClaimData('amount', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter claim amount"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Incident Location</label>
                <input
                  type="text"
                  value={claimData.location}
                  onChange={(e) => updateClaimData('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter incident location"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={claimData.description}
                  onChange={(e) => updateClaimData('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe the incident in detail..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!claimData.claimType}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Upload Documents
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Upload</h3>
              <p className="text-gray-600">Upload supporting documents for your claim</p>
            </div>

            {/* Document Requirements */}
            {claimData.claimType && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>Required Documents for {claimTypes.find(t => t.value === claimData.claimType)?.label}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {documentRequirements[claimData.claimType]?.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${req.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm text-blue-800">
                        {req.description} {req.required ? '(Required)' : '(Optional)'}
                      </span>
                      <span className="text-xs text-blue-600">
                        ({req.formats.join(', ').toUpperCase()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h4>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: PDF, JPG, PNG (Max size: 10MB per file)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                Choose Files
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedDocuments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      doc.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.extension)}
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                        {doc.error && <p className="text-sm text-red-600">{doc.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      )}
                      {doc.status === 'uploaded' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {doc.status === 'error' && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <div className="space-x-3">
                <button
                  onClick={analyzeDocuments}
                  disabled={uploadedDocuments.filter(d => d.status === 'uploaded').length === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Documents
                </button>
                <button
                  onClick={submitClaim}
                  disabled={uploadedDocuments.filter(d => d.status === 'uploaded').length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Analysis</h3>
              <p className="text-gray-600">AI-powered analysis of your uploaded documents</p>
            </div>

            {analysis && (
              <div className="space-y-6">
                {/* Fraud Analysis */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Fraud Detection Analysis</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <p className={`text-lg font-semibold ${
                        analysis.fraud_analysis?.risk_level === 'high' ? 'text-red-600' :
                        analysis.fraud_analysis?.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {analysis.fraud_analysis?.risk_level?.toUpperCase() || 'LOW'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {analysis.fraud_analysis?.confidence?.toUpperCase() || 'HIGH'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-semibold text-green-600">
                        {analysis.fraud_analysis?.risk_level === 'high' ? 'REVIEW REQUIRED' : 'CLEAR'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Validation */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Document Validation</span>
                  </h4>
                  <div className="space-y-3">
                    {analysis.validation?.document_issues?.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-yellow-800">{issue}</span>
                      </div>
                    ))}
                    {analysis.validation?.document_issues?.length === 0 && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">All documents validated successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {analysis.validation?.recommendations && (
                  <div className="card">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <span>Recommendations</span>
                    </h4>
                    <ul className="space-y-2">
                      {analysis.validation.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={submitClaim}
                className="btn-primary"
              >
                Submit Claim
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Claim Submitted Successfully!</h3>
              <p className="text-gray-600">Your claim is now under review</p>
            </div>

            {/* Claim Status */}
            {claimStatus && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Claim Details</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Submitted
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Claim ID</p>
                    <p className="font-semibold text-gray-900">{claimStatus.claim_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(claimStatus.monitoring_status?.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Claim Type</p>
                    <p className="font-semibold text-gray-900">{claimData.claimType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">₹{claimData.amount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Monitoring Status */}
            {monitoringStatus && (
              <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Monitor className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Claim Monitoring Status</h4>
                    <p className="text-gray-600">Real-time tracking of your claim processing</p>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="bg-white p-6 rounded-lg border mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-gray-900">Current Stage</h5>
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getMonitoringStage(monitoringStatus.current_stage).icon}
                    <span className={`font-semibold ${getMonitoringStage(monitoringStatus.current_stage).color}`}>
                      {monitoringStatus.current_stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Estimated completion: {monitoringStatus.estimated_processing_time}
                  </p>
                </div>

                {/* Processing Stages */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-900">Processing Stages</h5>
                  {monitoringStatus.next_stages?.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      <div className={`p-2 rounded-lg ${
                        index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {getMonitoringStage(stage).icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          index === 0 ? getMonitoringStage(stage).color : 'text-gray-600'
                        }`}>
                          {stage}
                        </p>
                        <p className="text-sm text-gray-500">
                          {index === 0 ? 'In Progress' : 'Pending'}
                        </p>
                      </div>
                      {index === 0 && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Surveillance Status */}
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Under Surveillance</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your claim is being monitored by our AI system for fraud detection and verification. 
                    This helps ensure faster processing and accurate assessment.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setClaimData({
                    policyNumber: '',
                    claimType: '',
                    incidentDate: '',
                    description: '',
                    amount: '',
                    location: ''
                  });
                  setUploadedDocuments([]);
                  setAnalysis(null);
                  setClaimStatus(null);
                  setMonitoringStatus(null);
                }}
                className="btn-primary"
              >
                Submit Another Claim
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance Claims</h2>
          <p className="text-gray-600">Submit and track your insurance claims</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-8">
          <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>
            Claim Details
          </span>
          <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'}`}>
            Upload Documents
          </span>
          <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'}`}>
            Analysis
          </span>
          <span className={`text-sm font-medium ${currentStep >= 4 ? 'text-primary-600' : 'text-gray-500'}`}>
            Submission
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="card">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing...</p>
            </div>
          </div>
        )}
        
        {!loading && renderStep()}
      </div>
    </div>
  );
};

export default InsuranceClaim; 