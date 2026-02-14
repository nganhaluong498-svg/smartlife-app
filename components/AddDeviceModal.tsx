
import React, { useState } from 'react';
import { X, Plus, Lightbulb, Camera, ToggleRight, Cpu } from 'lucide-react';
import { Device, Product } from '../types';
import { PRODUCTS } from '../constants';
import { translations } from '../translations';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: Device) => void;
  language: 'vi' | 'en';
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAdd, language }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deviceName, setDeviceName] = useState('');
  const t = translations[language].modal;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const typeMap: Record<string, Device['type']> = {
      'lighting': 'bulb',
      'security': 'cam',
      'control': 'switch',
      'hub': 'hub'
    };

    const newDevice: Device = {
      id: Math.random().toString(36).substr(2, 9),
      name: deviceName || selectedProduct.name,
      type: typeMap[selectedProduct.category],
      isOn: false,
      brightness: selectedProduct.category === 'lighting' ? 100 : undefined,
      color: selectedProduct.category === 'lighting' ? '#FFFFFF' : undefined,
      connectedDevices: selectedProduct.category === 'hub' ? 0 : undefined
    };

    onAdd(newDevice);
    setDeviceName('');
    setSelectedProduct(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-[#1F2020] uppercase tracking-tight">{t.addTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">{t.selectProduct}</label>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedProduct?.id === product.id 
                      ? 'border-[#3A6AD6] bg-[#CADCFC]/20' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedProduct?.id === product.id ? 'bg-[#3A6AD6] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {product.category === 'lighting' && <Lightbulb size={24} />}
                    {product.category === 'security' && <Camera size={24} />}
                    {product.category === 'control' && <ToggleRight size={24} />}
                    {product.category === 'hub' && <Cpu size={24} />}
                  </div>
                  <span className="text-[11px] font-black text-center leading-tight">{product.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">{t.deviceName}</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#3A6AD6] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedProduct}
            className="w-full bg-[#3A6AD6] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#2F58B8] disabled:opacity-50 transition-all shadow-xl shadow-blue-100 active:scale-95"
          >
            <Plus size={22} /> {t.confirm}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
