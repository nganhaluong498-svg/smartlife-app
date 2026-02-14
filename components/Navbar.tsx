
import React from 'react';
import { Home, ShoppingBag, Activity, User } from 'lucide-react';
import { translations } from '../translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'vi' | 'en';
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, language, className = "" }) => {
  const t = translations[language].nav;
  const tabs = [
    { id: 'overview', label: t.home, icon: Home },
    { id: 'products', label: t.shop, icon: ShoppingBag },
    { id: 'dashboard', label: t.management, icon: Activity },
    { id: 'account', label: t.account, icon: User },
  ];

  return (
    <nav className={`flex items-center gap-2 md:gap-8 ${className}`}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex flex-col md:flex-row items-center gap-1.5 transition-all duration-300 relative group ${
            activeTab === id ? 'text-[#3A6AD6]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} className="md:hidden lg:block" />
          <span className="text-[9px] md:text-xs font-black tracking-widest whitespace-nowrap">{label}</span>
          {activeTab === id && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3A6AD6] rounded-full hidden md:block" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
