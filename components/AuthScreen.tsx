
import React from 'react';
import Logo from './Logo';
import { Chrome, Apple, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { translations } from '../translations';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  language: 'vi' | 'en';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, language }) => {
  const t = translations[language].auth;
  
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    const mockUser: User = {
      id: 'mock-user-123',
      name: provider === 'google' ? 'Alex Smart' : 'Jordan Life',
      email: `${provider}@smartlife.com`,
      avatar: `https://i.pravatar.cc/150?u=${provider}`,
      provider: provider
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-500">
        <Logo className="h-14 mb-8 justify-center" stacked />
        <h2 className="text-3xl font-black text-[#1F2020] mb-3 tracking-tighter">{t.welcome}</h2>
        <p className="text-gray-400 font-medium mb-10">{t.desc}</p>

        <div className="space-y-4">
          <button 
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all group"
          >
            <div className="p-1 bg-white rounded-lg"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="google" /></div>
            {t.google}
            <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>

          <button 
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center gap-4 bg-black text-white py-4 rounded-2xl font-bold hover:bg-[#1F2020] transition-all group"
          >
            <Apple size={24} fill="white" />
            {t.apple}
            <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50">
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest leading-relaxed">
            {t.terms}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
