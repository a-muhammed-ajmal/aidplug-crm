import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { supabase } from '../../services/supabase';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
              <Building className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AidPlug CRM</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
            <p className="text-gray-600">Your password has been successfully reset.</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting you to sign in...</p>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Building className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AidPlug CRM</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
            <p className="text-gray-600 text-sm">Please enter your new password below</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-11"
                  placeholder="Enter new password"
                  disabled={!validSession}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={!validSession}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Confirm new password"
                disabled={!validSession}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !validSession}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-sm"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {!validSession && (
            <div className="mt-5 text-center">
              <a
                href="/"
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                Back to Sign In
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 AidPlug. All rights reserved.
        </p>
      </div>
    </div>
  );
};