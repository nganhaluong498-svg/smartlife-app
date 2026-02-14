
import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { translations } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: 'vi' | 'en';
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, language, onUpdateQuantity, onRemove }) => {
  const t = translations[language]?.cart;
  
  const total = items.reduce((sum, item) => {
    // Robust price parsing: take the first number if range exists, remove non-digits
    const priceRaw = item.product.price.split('-')[0];
    const priceStr = priceRaw.replace(/[^\d]/g, '');
    const priceVal = parseInt(priceStr) * 1000;
    return sum + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
  }, 0);

  if (!t) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-[#3A6AD6]" />
              <h2 className="text-xl font-black text-[#1F2020] uppercase tracking-tight">{t.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                <div className="p-6 bg-gray-50 rounded-full"><ShoppingBag size={48} /></div>
                <p className="font-bold">{t.empty}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm transition-all hover:border-[#CADCFC]">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1F2020] text-sm">{item.product.name}</h4>
                        <p className="text-[#3A6AD6] font-black text-xs mt-1">{item.product.price}</p>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="p-1 rounded-md bg-gray-50 text-gray-400 hover:text-[#3A6AD6]"><Minus size={14} /></button>
                      <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="p-1 rounded-md bg-gray-50 text-gray-400 hover:text-[#3A6AD6]"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 border-t border-gray-100 space-y-6 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.total}</span>
                <span className="text-2xl font-black text-[#1F2020]">{(total / 1000).toLocaleString()}K VNĐ</span>
              </div>
              <button className="w-full bg-[#3A6AD6] text-white py-5 rounded-[1.5rem] font-black hover:bg-[#2F58B8] transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                {t.checkout}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
