
import React, { useState } from 'react';
import { User as UserType } from '../types';
import { Settings, Shield, Bell, CreditCard, LogOut, ChevronRight, Share2, Phone, Mail, MapPin, Check, Wallet } from 'lucide-react';
import { translations } from '../translations';

interface AccountTabProps {
  user: UserType;
  onLogout: () => void;
  language: 'vi' | 'en';
}

const AccountTab: React.FC<AccountTabProps> = ({ user, onLogout, language }) => {
  const t = translations[language]?.account;
  const icons = [Settings, Shield, Bell, CreditCard, Phone];
  const [showSupport, setShowSupport] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (!t) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center gap-5 shadow-sm">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-[2.5rem] border-4 border-[#CADCFC] object-cover shadow-xl" />
          <div className="absolute -bottom-2 -right-2 bg-[#3A6AD6] text-white p-2.5 rounded-2xl shadow-lg border-2 border-white">
             <Settings size={20} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1F2020] tracking-tight">{user.name}</h2>
          <p className="text-gray-400 font-bold text-base mt-1">{user.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#CADCFC]/30 px-4 py-2 rounded-full text-[11px] font-black text-[#3A6AD6] uppercase tracking-widest border border-[#3A6AD6]/10">
            {t.status} {user.provider}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        {t.sections?.map((item, i) => {
          if (!item) return null;
          const Icon = icons[i] || Settings;
          const isSupport = i === 4;
          const isPayment = i === 3;

          return (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button 
                onClick={() => {
                  if (isSupport) setShowSupport(!showSupport);
                  if (isPayment) setShowPayment(!showPayment);
                }}
                className="w-full flex items-center justify-between p-7 hover:bg-gray-50 transition-all group text-left"
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl transition-all ${
                    (isSupport && showSupport) || (isPayment && showPayment)
                      ? 'bg-[#3A6AD6] text-white' 
                      : 'bg-gray-50 text-[#3A6AD6] group-hover:bg-[#CADCFC] group-hover:text-[#3A6AD6]'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2020] text-lg">{item.title || "Setting"}</h4>
                    <p className="text-sm text-gray-400 font-medium">{item.desc || "Manage details"}</p>
                  </div>
                </div>
                <ChevronRight size={22} className={`text-gray-300 group-hover:text-[#3A6AD6] transition-all ${((isSupport && showSupport) || (isPayment && showPayment)) ? 'rotate-90' : ''}`} />
              </button>

              {isSupport && showSupport && (
                <div className="px-10 pb-10 pt-4 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-blue-50/50 rounded-3xl space-y-4 border border-blue-100/50">
                    <div className="flex items-center gap-4 text-[#3A6AD6]">
                      <Phone size={20} />
                      <span className="font-bold">{t.support.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#3A6AD6]">
                      <Mail size={20} />
                      <span className="font-bold">{t.support.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                      <MapPin size={20} className="flex-shrink-0" />
                      <span className="font-medium text-xs leading-relaxed">{t.support.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {isPayment && showPayment && (
                <div className="px-10 pb-10 pt-4 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">{t.payment.title}</h5>
                    <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#CADCFC] hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 font-black">M</div>
                        <span className="font-bold text-sm">{t.payment.momo}</span>
                      </div>
                      <Check size={20} className="text-[#3A6AD6]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-black">B</div>
                        <span className="font-bold text-sm">{t.payment.bidv}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-4 hover:bg-red-100 transition-all border border-red-100 active:scale-95 shadow-sm"
      >
        <LogOut size={24} /> {t.logout || "Logout"}
      </button>

      <div className="text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] py-8 border-t border-gray-100">
        SMARTLIFE PLATFORM v1.4.5 (STABLE)
      </div>
    </div>
  );
};

export default AccountTab;
