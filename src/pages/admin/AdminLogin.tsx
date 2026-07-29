import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await api.adminLogin(adminId.trim(), password.trim());
      if (res.success && res.token) {
        loginAdmin(res.token);
        navigate('/admin/orders');
      } else {
        setErrorMessage(res.error || 'আইডি অথবা পাসওয়ার্ড সঠিক নয়!');
      }
    } catch (err: any) {
      setErrorMessage('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1420] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181F30] border border-[#27324A] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/40 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">KinoMart Admin</h1>
          <p className="text-xs text-gray-400">অর্ডার ম্যানেজমেন্ট ও সাইট এডমিন প্যানেল</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">এডমিন আইডি (ID)</label>
            <div className="relative">
              <input
                type="text"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                placeholder="kinomart"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0F1420] border border-[#27324A] rounded-xl text-sm text-white focus:border-[#3B82F6] outline-none placeholder-gray-500"
                required
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="@kinomart12@"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0F1420] border border-[#27324A] rounded-xl text-sm text-white focus:border-[#3B82F6] outline-none placeholder-gray-500"
                required
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm transition-colors shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'লগইন হচ্ছে...' : 'প্যানেলে প্রবেশ করুন'}
          </button>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-[#27324A]/60 space-y-1">
            <p>ডিফল্ট আইডি: <span className="text-blue-400 font-semibold select-all">kinomart</span></p>
            <p>পাসওয়ার্ড: <span className="text-blue-400 font-semibold select-all">@kinomart12@</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};
