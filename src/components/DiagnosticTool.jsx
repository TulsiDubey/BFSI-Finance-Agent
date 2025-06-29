import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';
import { auth } from '../../firebase';

const DiagnosticTool = () => {
  const { user, profileComplete, loading, userProfile } = useAuth();
  const [diagnostics, setDiagnostics] = useState({});
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {
        timestamp: new Date().toISOString(),
        firebase: {},
        auth: {},
        profile: {},
        api: {}
      };

      // Check Firebase Auth
      try {
        results.firebase.auth = auth.currentUser ? 'Connected' : 'Not connected';
        results.firebase.uid = auth.currentUser?.uid || 'No UID';
        results.firebase.email = auth.currentUser?.email || 'No email';
      } catch (error) {
        results.firebase.auth = `Error: ${error.message}`;
      }

      // Check Auth Context
      results.auth.user = user ? 'Present' : 'Not present';
      results.auth.loading = loading ? 'Loading' : 'Not loading';
      results.auth.profileComplete = profileComplete ? 'Complete' : 'Incomplete';
      results.auth.userProfile = userProfile ? 'Present' : 'Not present';

      // Check Profile Data
      if (userProfile) {
        results.profile.email = userProfile.email || 'No email';
        results.profile.profileComplete = userProfile.profileComplete || false;
        results.profile.createdAt = userProfile.createdAt || 'No date';
      }

      // Check API Connection
      try {
        const response = await fetch('http://localhost:5000/api/health');
        results.api.status = response.status;
        results.api.connected = response.ok ? 'Connected' : 'Not connected';
      } catch (error) {
        results.api.connected = `Error: ${error.message}`;
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, [user, profileComplete, loading, userProfile]);

  if (!showDiagnostics) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowDiagnostics(true)}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
          title="Show Diagnostics"
        >
          🔧
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🔧 Diagnostic Tool</h2>
          <button
            onClick={() => setShowDiagnostics(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Firebase Auth</h3>
            <div className="text-sm space-y-1">
              <div>Status: <span className={diagnostics.firebase?.auth === 'Connected' ? 'text-green-600' : 'text-red-600'}>{diagnostics.firebase?.auth}</span></div>
              <div>UID: {diagnostics.firebase?.uid}</div>
              <div>Email: {diagnostics.firebase?.email}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Auth Context</h3>
            <div className="text-sm space-y-1">
              <div>User: <span className={diagnostics.auth?.user === 'Present' ? 'text-green-600' : 'text-red-600'}>{diagnostics.auth?.user}</span></div>
              <div>Loading: <span className={diagnostics.auth?.loading === 'Loading' ? 'text-yellow-600' : 'text-green-600'}>{diagnostics.auth?.loading}</span></div>
              <div>Profile Complete: <span className={diagnostics.auth?.profileComplete ? 'text-green-600' : 'text-red-600'}>{diagnostics.auth?.profileComplete ? 'Yes' : 'No'}</span></div>
              <div>User Profile: <span className={diagnostics.auth?.userProfile === 'Present' ? 'text-green-600' : 'text-red-600'}>{diagnostics.auth?.userProfile}</span></div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Profile Data</h3>
            <div className="text-sm space-y-1">
              <div>Email: {diagnostics.profile?.email || 'N/A'}</div>
              <div>Profile Complete: {diagnostics.profile?.profileComplete ? 'Yes' : 'No'}</div>
              <div>Created At: {diagnostics.profile?.createdAt || 'N/A'}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">API Connection</h3>
            <div className="text-sm space-y-1">
              <div>Status: <span className={diagnostics.api?.connected === 'Connected' ? 'text-green-600' : 'text-red-600'}>{diagnostics.api?.connected}</span></div>
              <div>HTTP Status: {diagnostics.api?.status || 'N/A'}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Current Route</h3>
            <div className="text-sm">
              <div>Path: {window.location.pathname}</div>
              <div>Hash: {window.location.hash}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Clear All Data & Reload
              </button>
              <button
                onClick={() => {
                  console.log('Auth State:', { user, profileComplete, loading, userProfile });
                  console.log('Firebase Auth:', auth.currentUser);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ml-2"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Timestamp: {diagnostics.timestamp}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTool; 