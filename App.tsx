
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import DeviceControl from './components/DeviceControl';
import AddDeviceModal from './components/AddDeviceModal';
import Logo from './components/Logo';
import AuthScreen from './components/AuthScreen';
import AccountTab from './components/AccountTab';
import CartDrawer from './components/CartDrawer';
import { PRODUCTS, CLOUD_PACKAGES, INSTALLATION_SERVICES, PREMIUM_SERVICES, STARTER_KIT, FUTURE_ROADMAP } from './constants';
import { getAIResponse } from './services/geminiService';
import { ChatMessage, Device, User, CartItem, Product } from './types';
import { translations } from './translations';
import { 
  XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, YAxis
} from 'recharts';
import { 
  Rocket, ArrowRight, Send, Sparkles, Zap, ZapOff, ShoppingBag, MessageCircle, X, Smartphone, 
  Users, PieChart as PieIcon, Plus, Clock, Mic, ShieldAlert, BrainCircuit, Languages, 
  LineChart, Eye, ArrowUpRight, History, AlertTriangle, Fingerprint, Volume2, Trash2, 
  BookUser, UserCheck, UserPlus, Cloud, Wrench, CheckCircle2, ShieldCheck, Heart, MapPin, 
  Layers, Diamond, Leaf, Lightbulb, Camera, ToggleLeft, Activity as ActivityIcon, Home, Activity
} from 'lucide-react';

const WELCOME_MSG = {
  vi: `Chào bạn 👋 Mình là trợ lý SMARTLIFE!\nĐèn S1 có 16 triệu màu Pantone cực đẹp.\nBạn muốn mình tối ưu hóa ánh sáng không?\nThử bảo mình "Tôi muốn thư giãn" nhé!`,
  en: `Hello 👋 I am your SMARTLIFE assistant!\nSmartBulb S1 has 16 million beautiful Pantone colors.\nWant me to optimize your lighting?\nTry telling me "I want to relax"!`
};

const CONSUMPTION_BASE = [12, 15, 10, 18, 14, 22, 19];
const HABIT_BASE = [85, 92, 78, 95];

const MOCK_CONTACTS = [
  { name: 'Nguyễn Văn A', phone: '0901234567' },
  { name: 'Trần Thị B', phone: '0912345678' },
  { name: 'Lê Văn C', phone: '0987654321' },
];

interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string;
  active: boolean;
  type: 'time' | 'location' | 'device' | 'ai';
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardSubTab, setDashboardSubTab] = useState('devices'); 
  const [shopSubTab, setShopSubTab] = useState('hardware'); 
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAnomalyLogOpen, setIsAnomalyLogOpen] = useState(false);
  const [isContactListOpen, setIsContactListOpen] = useState(false);
  const [aiAutoAdjustEnabled, setAiAutoAdjustEnabled] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const [tempAuto, setTempAuto] = useState({ name: '', trigger: '', action: '', type: 'time' as Automation['type'] });
  const [tempInvite, setTempInvite] = useState({ name: '', phone: '', role: 'member' });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => translations[language], [language]);

  const consumptionData = useMemo(() => [
    { day: t.dashboard.charts.mon, usage: CONSUMPTION_BASE[0] },
    { day: t.dashboard.charts.tue, usage: CONSUMPTION_BASE[1] },
    { day: t.dashboard.charts.wed, usage: CONSUMPTION_BASE[2] },
    { day: t.dashboard.charts.thu, usage: CONSUMPTION_BASE[3] },
    { day: t.dashboard.charts.fri, usage: CONSUMPTION_BASE[4] },
    { day: t.dashboard.charts.sat, usage: CONSUMPTION_BASE[5] },
    { day: t.dashboard.charts.sun, usage: CONSUMPTION_BASE[6] },
  ], [t]);

  const habitConfidence = useMemo(() => [
    { name: t.dashboard.charts.morning, value: HABIT_BASE[0] },
    { name: t.dashboard.charts.leave, value: HABIT_BASE[1] },
    { name: t.dashboard.charts.dinner, value: HABIT_BASE[2] },
    { name: t.dashboard.charts.sleep, value: HABIT_BASE[3] },
  ], [t]);

  const lifestyleSequences = useMemo(() => [
    { time: '07:00 AM', event: t.dashboard.events.coffee, prob: 95, icon: Clock },
    { time: '08:30 AM', event: t.dashboard.events.commute, prob: 88, icon: Smartphone },
    { time: '06:00 PM', event: t.dashboard.events.relax, prob: 72, icon: Sparkles },
    { time: '11:00 PM', event: t.dashboard.events.security, prob: 98, icon: ShieldAlert },
  ], [t]);

  const anomalyLogs = useMemo(() => [
    { id: 1, time: '03:15 AM', type: 'Lighting', desc: language === 'vi' ? 'Thiết bị bật ngoài thói quen 30 ngày.' : 'Device turned on outside 30-day pattern.', risk: 'Low' },
    { id: 2, time: '11:45 PM', type: 'Security', desc: language === 'vi' ? 'Cửa mở sau khi đã kích hoạt chế độ khóa.' : 'Door opened after Lockdown engaged.', risk: 'Medium' },
    { id: 3, time: '02:00 PM', type: 'Energy', desc: language === 'vi' ? 'Phát hiện quá tải (300% ngưỡng).' : 'Power surge detected (300% above threshold).', risk: 'High' },
  ], [language]);

  // Sync AI messages with language toggle
  useEffect(() => {
    setMessages([{ role: 'model', text: WELCOME_MSG[language] }]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isAIModalOpen]);

  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Đèn Phòng Khách', type: 'bulb', isOn: true, brightness: 80, color: '#FFFFFF' },
    { id: '3', name: 'Công tắc Bếp', type: 'switch', isOn: true },
    { id: '4', name: 'SmartCam Sân Trước', type: 'cam', isOn: true },
    { id: '5', name: 'SmartHub Z1', type: 'hub', isOn: true, connectedDevices: 12 }
  ]);

  const [automations, setAutomations] = useState<Automation[]>([
    { id: 'a1', name: 'Chào buổi sáng', trigger: '6:30 AM', actions: 'Mở rèm, Pha cafe', active: true, type: 'time' },
    { id: 'a2', name: 'Rời nhà', trigger: 'Cửa khóa', actions: 'Tắt đèn, Bật báo động', active: true, type: 'device' },
  ]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 'f1', name: 'Bạn (Admin)', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=me', status: 'Online' },
    { id: 'f2', name: 'Lê Hương', role: 'member', avatar: 'https://i.pravatar.cc/150?u=user1', status: 'Offline' },
  ]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const msgToUse = textOverride || input;
    if (!msgToUse.trim() || isTyping) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msgToUse }]);
    setIsTyping(true);
    try {
      const response = await getAIResponse(msgToUse, language);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: language === 'vi' ? 'Lỗi kết nối AI.' : 'AI Connection Error.' }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, language]);

  const handleVoiceTrigger = () => {
    if (isVoiceActive) return;
    setIsVoiceActive(true);
    setTimeout(() => {
      const command = language === 'vi' ? 'Tắt hết đèn đi' : 'Turn off all lights';
      setIsVoiceActive(false);
      handleSendMessage(command);
    }, 2000);
  };

  const handleCreateAuto = () => {
    if (!tempAuto.name || !tempAuto.action) return;
    const newAuto: Automation = {
      id: Math.random().toString(36).substr(2, 9),
      name: tempAuto.name,
      trigger: tempAuto.trigger || t.dashboard.automation.manual,
      actions: tempAuto.action,
      active: true,
      type: tempAuto.type
    };
    setAutomations(prev => [...prev, newAuto]);
    setIsAutomationModalOpen(false);
    setTempAuto({ name: '', trigger: '', action: '', type: 'time' });
  };

  const handleInviteSubmit = () => {
    if (!tempInvite.name || !tempInvite.phone) return;
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: tempInvite.name,
      role: tempInvite.role,
      avatar: `https://i.pravatar.cc/150?u=${tempInvite.phone}`,
      status: 'Offline'
    };
    setFamilyMembers(prev => [...prev, newMember]);
    setIsInviteModalOpen(false);
    setTempInvite({ name: '', phone: '', role: 'member' });
  };

  const mobileNavTabs = [
    { id: 'overview', label: t.nav.home, icon: Home },
    { id: 'products', label: t.nav.shop, icon: ShoppingBag },
    { id: 'dashboard', label: t.nav.management, icon: Activity },
    { id: 'account', label: t.nav.account, icon: Users },
  ];

  const renderOverview = () => (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="rounded-[3rem] bg-[#1F2020] text-white p-12 md:p-24 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#3A6AD6]/15 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 bg-[#3A6AD6]/20 border border-[#3A6AD6]/30 px-5 py-2 rounded-full text-[#3A6AD6] text-xs font-black mb-10 uppercase tracking-[0.2em]">{t.hero.tag}</div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">{t.hero.title} <br/><span className="text-[#3A6AD6]">{t.hero.subtitle}</span></h1>
          <p className="text-gray-400 text-xl md:text-2xl mb-8 leading-relaxed font-medium max-w-xl">{t.hero.desc}</p>
          
          {/* Product Completion Bar */}
          <div className="mb-12 max-w-sm space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>{t.hero.completionLabel}</span>
              <span className="text-[#3A6AD6] animate-pulse">85%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-[#3A6AD6] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(58,106,214,0.5)]" 
                style={{ width: '85%' }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <button onClick={() => setActiveTab('products')} className="group bg-[#3A6AD6] text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
              {t.hero.btnShop} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button onClick={() => setActiveTab('dashboard')} className="group bg-white/5 border border-white/10 text-white px-10 py-6 rounded-2xl font-black text-lg flex items-center gap-4 hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md">
              {t.hero.btnManage}
            </button>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {t.home.features.map((feature: any, i: number) => {
          const icons = [Diamond, BrainCircuit, ShieldCheck];
          const Icon = icons[i];
          return (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-[#3A6AD6] mb-8 group-hover:bg-[#3A6AD6] group-hover:text-white transition-all duration-500">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Product Ecosystem Introduction */}
      <section className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{t.home.ecosystemTitle}</h2>
          <p className="text-gray-400 font-medium text-lg">{t.home.ecosystemSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.home.ecosystemCategories.map((cat: any, i: number) => {
            const icons = [Lightbulb, Camera, ToggleLeft, ActivityIcon];
            const Icon = icons[i];
            const colors = ['#3A6AD6', '#EF4444', '#10B981', '#F59E0B'];
            return (
              <div key={i} className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-[#3A6AD6]/5 transition-all duration-500" />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500" style={{ backgroundColor: `${colors[i]}15`, color: colors[i] }}>
                    <Icon size={28} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{cat.title}</h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Starter Kit Promotion */}
      <section className="bg-white rounded-[4rem] p-12 md:p-20 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
        <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
            {t.home.saveLabel} {STARTER_KIT.saving}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{STARTER_KIT.name}</h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
            {t.home.starterDesc}
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
            <Zap className="text-[#3A6AD6]" /> {t.home.starterInclude}
          </div>
          <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start">
            <span className="text-4xl font-black text-[#3A6AD6]">{STARTER_KIT.price}</span>
            <button onClick={() => setActiveTab('products')} className="bg-[#1F2020] text-white px-10 py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95">
              {t.hero.btnShop}
            </button>
          </div>
        </div>
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-[#CADCFC]/30 rounded-[3rem] blur-3xl group-hover:bg-[#3A6AD6]/20 transition-all duration-700" />
          <img 
            src="starterkit.png" 
            alt="Starter Kit Box" 
            className="w-full h-auto rounded-[3rem] shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{t.home.roadmapTitle}</h2>
          <p className="text-gray-400 font-medium">{t.home.roadmapSubtitle}</p>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
          {FUTURE_ROADMAP.map((item, i) => (
            <div key={i} className="min-w-[320px] bg-[#1F2020] p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between group">
              <div>
                <div className="inline-block px-3 py-1 bg-[#3A6AD6]/20 text-[#3A6AD6] text-[8px] font-black uppercase tracking-widest rounded-full mb-6 border border-[#3A6AD6]/30">{t.home.comingSoon}</div>
                <h4 className="text-2xl font-black mb-2">{item.name}</h4>
                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
              </div>
              <div className="mt-12 flex items-center justify-between">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-[#3A6AD6] group-hover:text-white transition-all duration-500">
                  <Rocket size={24} />
                </div>
                <div className="h-0.5 flex-1 mx-6 bg-white/5 overflow-hidden">
                  <div className="h-full bg-[#3A6AD6] w-1/3 group-hover:w-full transition-all duration-1000" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1F2020] tracking-tight uppercase">{t.dashboard.title}</h2>
          <p className="text-gray-400 font-medium">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex p-1.5 bg-gray-100 rounded-[1.2rem] overflow-x-auto max-w-full no-scrollbar shadow-inner">
          {[
            { id: 'devices', label: t.dashboard.tabs.devices, icon: Smartphone },
            { id: 'automation', label: t.dashboard.tabs.automation, icon: Zap },
            { id: 'stats', label: t.dashboard.tabs.energy, icon: PieIcon },
            { id: 'family', label: t.dashboard.tabs.family, icon: Users },
            { id: 'ai', label: t.dashboard.tabs.ai, icon: BrainCircuit },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDashboardSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[1rem] text-[11px] font-black transition-all whitespace-nowrap ${
                dashboardSubTab === tab.id ? 'bg-white text-[#3A6AD6] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {dashboardSubTab === 'devices' && (
          <DeviceControl 
            devices={devices} 
            onToggle={(id) => setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d))} 
            onUpdate={(id, updates) => setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))}
            onAddClick={() => setIsAddModalOpen(true)}
            language={language}
          />
        )}
        {dashboardSubTab === 'automation' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.automation.title}</h3>
                  <p className="text-gray-400 text-sm font-medium">{t.dashboard.automation.desc}</p>
               </div>
               <button onClick={() => setIsAutomationModalOpen(true)} className="flex items-center gap-3 bg-[#3A6AD6] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-600 active:scale-95 transition-all">
                  <Plus size={20} /> {t.dashboard.automation.btnCreate}
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {automations.map(auto => (
                 <div key={auto.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-blue-50 text-[#3A6AD6] rounded-2xl">
                             {auto.type === 'time' && <Clock size={24} />}
                             {auto.type === 'device' && <Smartphone size={24} />}
                             {auto.type === 'ai' && <BrainCircuit size={24} />}
                             {auto.type === 'location' && <MapPin size={24} />}
                          </div>
                          <button onClick={() => setAutomations(prev => prev.map(a => a.id === auto.id ? {...a, active: !a.active} : a))} className={`w-14 h-7 rounded-full relative transition-colors ${auto.active ? 'bg-[#3A6AD6]' : 'bg-gray-200'}`}>
                             <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${auto.active ? 'left-8' : 'left-1'}`} />
                          </button>
                       </div>
                       <h4 className="text-xl font-black mb-1">{auto.name}</h4>
                       <div className="space-y-4 mt-6">
                          <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                             <ArrowUpRight size={14} /> {t.dashboard.automation.if}: {auto.trigger}
                          </div>
                          <div className="flex items-center gap-3 text-[#3A6AD6] text-xs font-black uppercase tracking-widest">
                             <CheckCircle2 size={14} /> {t.dashboard.automation.then}: {auto.actions}
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setAutomations(prev => prev.filter(a => a.id !== auto.id))} className="mt-8 text-red-300 hover:text-red-500 transition-colors self-end"><Trash2 size={18} /></button>
                 </div>
               ))}
            </div>
          </div>
        )}
        {dashboardSubTab === 'stats' && (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-8 shadow-sm">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black">{t.dashboard.energy.title}</h3>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.dashboard.energy.expected}</span>
                <div className="text-3xl font-black text-[#3A6AD6]">128.5 kWh</div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#CBD5E1'}} width={30} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="usage" stroke="#3A6AD6" fill="#3A6AD620" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <ShieldCheck className="text-[#3A6AD6]" />
               <p className="text-xs font-bold text-blue-900 leading-tight">{t.dashboard.energy.aiSuggest}</p>
            </div>
          </div>
        )}
        {dashboardSubTab === 'family' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.family.title}</h3>
                  <p className="text-gray-400 text-sm font-medium">{t.dashboard.family.desc}</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsContactListOpen(true)} className="flex items-center gap-3 bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl font-black text-gray-400 hover:border-[#3A6AD6] hover:text-[#3A6AD6] transition-all">
                     <BookUser size={20} /> {t.dashboard.family.btnContacts}
                  </button>
                  <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-3 bg-[#3A6AD6] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-600 transition-all">
                     <UserPlus size={20} /> {t.dashboard.family.btnInvite}
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {familyMembers.map(member => (
                 <div key={member.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center shadow-sm relative group">
                    <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-3xl object-cover mb-4 border-2 border-gray-50 group-hover:border-[#3A6AD6] transition-colors" />
                    <h4 className="text-lg font-black">{member.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mt-1">{member.role}</p>
                    <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-[10px] font-bold text-gray-400">
                       <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                       {member.status}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
        {dashboardSubTab === 'ai' && (
          <div className="space-y-8">
            <div className="bg-[#1F2020] p-10 rounded-[3rem] text-white flex justify-between items-center shadow-2xl overflow-hidden relative group">
              {/* Background ambient light */}
              <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] transition-opacity duration-1000 ${aiAutoAdjustEnabled ? 'bg-[#3A6AD6]/20 opacity-100' : 'bg-gray-800/20 opacity-0'}`} />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className={`p-5 rounded-3xl transition-all duration-500 ${aiAutoAdjustEnabled ? 'bg-[#3A6AD6] shadow-[0_0_30px_rgba(58,106,214,0.4)]' : 'bg-gray-700 shadow-inner'}`}><BrainCircuit size={32}/></div>
                 <div className="max-w-[150px] md:max-w-none">
                    <h3 className="text-xl md:text-2xl font-black">{t.dashboard.ai.masterSwitch}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">{t.dashboard.ai.masterSwitchDesc}</p>
                 </div>
              </div>
              
              {/* ADVANCED AI TOGGLE BUTTON - OPTIMIZED FOR MOBILE */}
              <button 
                onClick={() => setAiAutoAdjustEnabled(!aiAutoAdjustEnabled)} 
                className={`relative w-16 h-8 md:w-20 md:h-10 rounded-full p-1 transition-all duration-500 ease-in-out outline-none group/switch border-2 overflow-hidden flex-shrink-0 ${
                  aiAutoAdjustEnabled ? 'bg-[#3A6AD6] border-[#3A6AD6] shadow-[0_0_15px_rgba(58,106,214,0.4)]' : 'bg-black/20 border-white/10 shadow-inner'
                }`}
              >
                <div 
                  className={`relative w-5 h-5 md:w-7 md:h-7 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.1,0.64,1)] flex items-center justify-center shadow-xl ${
                    aiAutoAdjustEnabled 
                      ? 'translate-x-[2rem] md:translate-x-[2.4rem] bg-white text-[#3A6AD6]' 
                      : 'translate-x-0 bg-[#2D2D2D] text-gray-500'
                  }`}
                >
                  <Sparkles size={12} className={`md:size-4 transition-transform duration-500 ${aiAutoAdjustEnabled ? 'scale-110 rotate-12' : 'scale-90 rotate-0'}`} />
                  {aiAutoAdjustEnabled && (
                    <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
                  )}
                </div>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-10 shadow-sm">
                    <h4 className="font-black text-2xl uppercase tracking-tight flex items-center gap-4"><LineChart className="text-[#3A6AD6]"/> {t.dashboard.ai.insightTitle}</h4>
                    <div className="grid grid-cols-2 gap-6">
                       {lifestyleSequences.map((seq, i) => (
                         <div key={i} className="relative p-6 bg-gray-50 rounded-3xl space-y-4 hover:bg-gray-100 transition-colors cursor-default">
                            <div className="p-3 bg-white rounded-2xl text-[#3A6AD6] w-fit shadow-sm"><seq.icon size={20} /></div>
                            <div>
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{seq.time}</p>
                               <h5 className="font-bold text-sm text-[#1F2020] mt-1">{seq.event}</h5>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-8 shadow-sm text-center flex flex-col justify-center">
                    <div className="p-6 bg-blue-50 text-[#3A6AD6] w-fit mx-auto rounded-full shadow-inner"><Mic size={36} /></div>
                    <h4 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.ai.voiceTitle}</h4>
                    <p className="text-gray-400 text-sm font-medium px-4">{t.dashboard.ai.voiceDesc}</p>
                    <button onClick={handleVoiceTrigger} className="w-full py-6 rounded-[2rem] font-black bg-[#1F2020] text-white uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                      {isVoiceActive ? t.dashboard.ai.voiceActive : t.dashboard.ai.startMic}
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <h4 className="font-black mb-4 flex items-center gap-3"><Fingerprint className="text-purple-500" /> {t.dashboard.ai.predictiveTitle}</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={habitConfidence}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} />
                        <Bar dataKey="value" fill="#3A6AD6" radius={[8, 8, 8, 8]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                  <h4 className="font-black mb-4 flex items-center gap-3"><ShieldAlert className="text-red-500" /> {t.dashboard.ai.anomalyTitle}</h4>
                  <div className="space-y-4">
                      {anomalyLogs.slice(0, 2).map((log) => (
                        <div key={log.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                          <div className="text-[10px] font-black text-gray-400 w-12">{log.time}</div>
                          <div className="font-bold text-xs flex-1">{log.desc}</div>
                        </div>
                      ))}
                  </div>
                  <button onClick={() => setIsAnomalyLogOpen(true)} className="w-full mt-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#3A6AD6] hover:text-[#3A6AD6] transition-all">
                      {t.dashboard.ai.viewLogs}
                  </button>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter">{t.shop.title}</h2>
        <div className="flex p-1.5 bg-gray-100 rounded-2xl shadow-inner">
          <button onClick={() => setShopSubTab('hardware')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${shopSubTab === 'hardware' ? 'bg-white text-[#3A6AD6] shadow-sm' : 'text-gray-400'}`}>{t.shop.tabs.hardware}</button>
          <button onClick={() => setShopSubTab('services')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${shopSubTab === 'services' ? 'bg-white text-[#3A6AD6] shadow-sm' : 'text-gray-400'}`}>{t.shop.tabs.services}</button>
        </div>
      </div>

      {shopSubTab === 'hardware' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} language={language} />)}
        </div>
      ) : (
        <div className="space-y-20">
          <section className="space-y-10">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><Cloud className="text-[#3A6AD6]"/> {t.shop.cloudTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {CLOUD_PACKAGES.map((pkg, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border flex flex-col transition-all ${i === 2 ? 'bg-[#1F2020] text-white border-transparent shadow-2xl scale-105 z-10' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h4 className="text-xl font-black mb-1">{pkg.name}</h4>
                  <p className="text-[#3A6AD6] font-black text-2xl mb-6">{pkg.price}</p>
                  <ul className="space-y-3 mb-8 text-xs font-bold text-gray-500">
                    <li>{t.shop.storage}: {pkg.storage}</li>
                  </ul>
                  <button className={`mt-auto w-full py-4 rounded-xl font-black text-[10px] uppercase transition-all ${i === 2 ? 'bg-[#3A6AD6] text-white hover:bg-blue-600' : 'bg-gray-100 text-[#1F2020] hover:bg-gray-200'}`}>
                    {t.shop.selectPlan}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><Wrench className="text-orange-500"/> {t.shop.installTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {INSTALLATION_SERVICES.map((srv, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <h5 className="text-xs font-black text-gray-400 uppercase mb-1">{srv.level}</h5>
                  <h4 className="text-xl font-black mb-4">{srv.name}</h4>
                  <div className="font-black text-[#3A6AD6] mb-6 text-xl">{srv.price}</div>
                  <ul className="space-y-2 mb-8 text-[11px] font-bold text-gray-400">
                    {srv.features.map((f, fi) => <li key={fi} className="flex items-center gap-2">• {f}</li>)}
                  </ul>
                  <button className="w-full py-4 border-2 border-gray-100 rounded-xl font-black text-[10px] uppercase hover:border-[#3A6AD6] hover:text-[#3A6AD6] transition-all">
                    {t.shop.bookService}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><Heart className="text-pink-500"/> {t.shop.warrantyTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {PREMIUM_SERVICES.map((srv, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:bg-[#3A6AD6] transition-all">
                  <h4 className="text-lg font-black mb-2 group-hover:text-white transition-colors">{srv.name}</h4>
                  <div className="font-black text-[#3A6AD6] group-hover:text-white mb-6 transition-colors">{srv.price}</div>
                  <ul className="space-y-2 mb-8 text-[11px] font-bold text-gray-400 group-hover:text-white/70 transition-colors">
                    {srv.features.map((f, fi) => <li key={fi}>• {f}</li>)}
                  </ul>
                  <button className="w-full py-4 border-2 border-gray-100 rounded-xl font-black text-[10px] uppercase group-hover:bg-white group-hover:text-[#3A6AD6] group-hover:border-white transition-all">
                    {t.shop.addToCart}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 bg-[#F8FAFC]">
      <header className="fixed top-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-[60] flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Logo onClick={() => setActiveTab('overview')} />
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} language={language} className="hidden md:flex" />
          <div className="flex items-center gap-4">
            <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="p-3 bg-gray-50 text-[#3A6AD6] rounded-2xl hover:bg-[#CADCFC] transition-all flex items-center gap-2 group">
              <Languages size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black">{language.toUpperCase()}</span>
            </button>
            <button onClick={() => setIsAIModalOpen(!isAIModalOpen)} className={`p-3 rounded-2xl transition-all shadow-sm ${isAIModalOpen ? 'bg-[#3A6AD6] text-white' : 'bg-gray-50 text-[#3A6AD6] hover:bg-[#CADCFC]'}`}><MessageCircle size={22} /></button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-[#CADCFC] hover:text-[#3A6AD6] transition-all">
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[60] flex justify-around items-center h-20 px-4 md:hidden">
        {mobileNavTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
              activeTab === id ? 'text-[#3A6AD6]' : 'text-gray-400'
            }`}
          >
            <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
            {activeTab === id && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#3A6AD6] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 pb-32 md:pb-10">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderShop()}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'account' && (user ? <AccountTab user={user} onLogout={() => setUser(null)} language={language} /> : <AuthScreen onLogin={setUser} language={language} />)}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} language={language} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.product.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.product.id !== id))} />
      <AddDeviceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={(d) => setDevices(prev => [...prev, d])} language={language} />
      
      {isAIModalOpen && (
        <div className="fixed bottom-24 md:bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm z-[70] animate-in slide-in-from-bottom-4 duration-300">
          <div className="h-[550px] flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
            <div className="bg-[#3A6AD6] p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest"><Sparkles size={18} className="text-blue-100"/> S-Life AI</div>
              <button onClick={() => setIsAIModalOpen(false)}><X size={20} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-bold shadow-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-[#3A6AD6] text-white rounded-tr-none' : 'bg-white text-[#1F2020] border border-gray-100 rounded-tl-none'}`}>
                    <div className="markdown-content">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-gray-300 italic animate-pulse">S-Life AI is thinking...</div>}
            </div>
            <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={language === 'vi' ? 'Hỏi trợ lý...' : 'Ask S-Life...'} className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#3A6AD6]" />
              <button onClick={() => handleSendMessage()} className="bg-[#3A6AD6] text-white p-3 rounded-xl shadow-lg hover:bg-blue-600 transition-all"><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Modal */}
      {isAutomationModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.automation.modalTitle}</h3>
                 <button onClick={() => setIsAutomationModalOpen(false)}><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.automation.nameLabel}</label>
                    <input type="text" value={tempAuto.name} onChange={e => setTempAuto({...tempAuto, name: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-[#3A6AD6]" placeholder="e.g. Wake Up" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.automation.if}</label>
                       <select value={tempAuto.type} onChange={e => setTempAuto({...tempAuto, type: e.target.value as any})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none cursor-pointer">
                          <option value="time">{t.dashboard.automation.triggers.time}</option>
                          <option value="location">{t.dashboard.automation.triggers.location}</option>
                          <option value="device">{t.dashboard.automation.triggers.device}</option>
                          <option value="ai">{t.dashboard.automation.triggers.ai}</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.automation.triggerLabel}</label>
                       <input type="text" value={tempAuto.trigger} onChange={e => setTempAuto({...tempAuto, trigger: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none" placeholder="e.g. 7:00 AM" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.automation.actionLabel}</label>
                    <input type="text" value={tempAuto.action} onChange={e => setTempAuto({...tempAuto, action: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none" placeholder="e.g. Turn on Lights" />
                 </div>
                 <button onClick={handleCreateAuto} className="w-full bg-[#3A6AD6] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">{t.dashboard.automation.save}</button>
              </div>
           </div>
        </div>
      )}

      {/* Anomaly Log Viewer */}
      {isAnomalyLogOpen && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                 <h2 className="text-2xl font-black uppercase text-red-600 tracking-tight flex items-center gap-3"><AlertTriangle /> {t.dashboard.ai.anomalyTitle}</h2>
                 <button onClick={() => setIsAnomalyLogOpen(false)} className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"><X size={28} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {anomalyLogs.map((log) => (
                  <div key={log.id} className="flex gap-6 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                    <div className="p-4 rounded-2xl h-fit bg-red-100 text-red-600"><AlertTriangle size={24} /></div>
                    <div className="flex-1">
                       <h4 className="font-black text-[#1F2020] text-lg">{log.desc}</h4>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{log.time} • {t.dashboard.ai.riskLabel}: {log.risk}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                 <button onClick={() => setIsAnomalyLogOpen(false)} className="w-full bg-[#1F2020] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
                   {t.dashboard.ai.dismiss}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Family Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.family.modalTitle}</h3>
                 <button onClick={() => setIsInviteModalOpen(false)}><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.family.inputName}</label>
                    <input type="text" value={tempInvite.name} onChange={e => setTempInvite({...tempInvite, name: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-[#3A6AD6]" placeholder="Name" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.family.inputPhone}</label>
                    <input type="text" value={tempInvite.phone} onChange={e => setTempInvite({...tempInvite, phone: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-[#3A6AD6]" placeholder="09xx..." />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.dashboard.family.role}</label>
                    <select value={tempInvite.role} onChange={e => setTempInvite({...tempInvite, role: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none outline-none cursor-pointer">
                       <option value="member">{t.dashboard.family.roleMember}</option>
                       <option value="manager">{t.dashboard.family.roleManager}</option>
                    </select>
                 </div>
                 <button onClick={handleInviteSubmit} className="w-full bg-[#3A6AD6] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">{t.dashboard.family.sendInvite}</button>
              </div>
           </div>
        </div>
      )}

      {/* Mock Contact List */}
      {isContactListOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 flex flex-col max-h-[70vh]">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black uppercase tracking-tight">{t.dashboard.family.btnContacts}</h3>
                 <button onClick={() => setIsContactListOpen(false)}><X size={24}/></button>
              </div>
              <div className="overflow-y-auto space-y-4 no-scrollbar">
                 {MOCK_CONTACTS.map((contact, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-[#CADCFC]/20 transition-all">
                       <div>
                          <p className="font-black text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-400 font-bold">{contact.phone}</p>
                       </div>
                       <button onClick={() => {
                          setTempInvite({ name: contact.name, phone: contact.phone, role: 'member' });
                          setIsContactListOpen(false);
                          setIsInviteModalOpen(true);
                       }} className="p-2 bg-[#3A6AD6] text-white rounded-lg hover:bg-blue-600"><Plus size={16}/></button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
