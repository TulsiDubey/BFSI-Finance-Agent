import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/UserContext";
import { fraudAPI } from "../lib/api";

const FraudAlertCard = () => {
  const { userProfile } = useAuth();
  const [fraudStatus, setFraudStatus] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchFraudStatus();
    }
  }, [userProfile]);

  const fetchFraudStatus = async () => {
    setLoading(true);
    try {
      const res = await fraudAPI.detectFraud(userProfile);
      setFraudStatus(res.data.status || res.data.risk_level || "Low");
      setTips(res.data.tips || res.data.recommendations || [
        "Never share OTPs or passwords.",
        "Verify links before clicking.",
        "Check for RBI/IRDAI registration of financial companies.",
      ]);
    } catch (error) {
      console.error('Fraud detection error:', error);
      setFraudStatus("Low");
      setTips([
        "Never share OTPs or passwords.",
        "Verify links before clicking.",
        "Check for RBI/IRDAI registration of financial companies.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-green-100 rounded-lg text-green-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Fraud Detection & Alerts</h2>
      </div>
      <p className="text-gray-600 mb-4">
        Stay protected from financial frauds. Our AI keeps you safe!
      </p>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-green-600" />
        </div>
      ) : (
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Fraud Risk: {fraudStatus}</h3>
          </div>
          <ul className="list-disc pl-6 text-gray-700">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8">
        <div className="card bg-green-50">
          <h4 className="font-medium text-green-900 mb-2">How to stay safe?</h4>
          <ul className="list-disc pl-6 text-green-800 text-sm">
            <li>Never share OTPs or passwords with anyone.</li>
            <li>Always verify the sender before making payments.</li>
            <li>Report suspicious activity to your bank immediately.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default FraudAlertCard; 