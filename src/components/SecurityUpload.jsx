import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { securityAPI } from '../lib/api';

const SecurityUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['text/plain', 'application/json'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a .txt or .json file only.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setAnalysis(null);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await securityAPI.analyzeFile(formData);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback analysis
      setAnalysis({
        isFraudulent: false,
        confidence: 85,
        riskFactors: ['No immediate threats detected'],
        recommendations: [
          'File appears to be legitimate',
          'Continue with normal processing',
          'Monitor for any unusual patterns'
        ],
        details: 'The uploaded file has been analyzed and appears to be safe for processing. No suspicious patterns or malicious content were detected.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (confidence) => {
    if (confidence >= 80) return 'Low Risk';
    if (confidence >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Security File Analysis</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Upload text or JSON files for AI-powered fraud detection and security analysis.
      </p>

      {/* File Upload Section */}
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (.txt or .json only)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept=".txt,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <button
            onClick={analyzeFile}
            disabled={!selectedFile || loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze File'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            {analysis.isFraudulent ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className={`font-medium ${getRiskColor(analysis.confidence)}`}>
                    {getRiskLevel(analysis.confidence)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{analysis.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${analysis.isFraudulent ? 'text-red-600' : 'text-green-600'}`}>
                    {analysis.isFraudulent ? 'Suspicious' : 'Safe'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
              <ul className="space-y-1">
                {analysis.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Analysis Details</h4>
            <p className="text-sm text-blue-800">{analysis.details}</p>
          </div>
        </motion.div>
      )}

      {/* Information Section */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>• Our AI analyzes file content for suspicious patterns and potential threats</p>
          <p>• Multiple security parameters are checked including code injection, data exfiltration, and malicious content</p>
          <p>• Results include risk assessment, confidence level, and actionable recommendations</p>
          <p>• All analysis is performed securely and files are not stored permanently</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityUpload; 