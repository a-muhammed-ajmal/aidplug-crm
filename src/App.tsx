import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import MainApp from './components/MainApp';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    // Check if URL contains reset password hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('type') === 'recovery') {
      setIsResetPassword(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show reset password page if recovery token exists
  if (isResetPassword) {
    return <ResetPasswordPage />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <MainApp />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;