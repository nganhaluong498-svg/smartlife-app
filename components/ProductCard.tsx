import React from 'react';
import { Product } from '../types';
import { TrendingUp, Info, Plus, Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  language: 'vi' | 'en';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, language }) => {
  const t = translations[language].shop;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://placehold.co/800x600/3A6AD6/white?text=${encodeURIComponent(product.name)}`;
  };
  
  return (
    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-[#3A6AD6] border border-[#CADCFC] shadow-sm uppercase tracking-widest">
          {t.categories[product.category] || product.category}
        </div>
        
        {product.badge && (
          <div className="absolute top-4 left-4 bg-[#3A6AD6] text-white px-3 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-lg animate-pulse uppercase tracking-wider">
            <Sparkles size={12} />
            {(t as any)[product.badge] || product.badge}
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-[#1F2020] tracking-tight">{product.name}</h3>
          <span className="text-lg font-black text-[#3A6AD6]">{product.price}</span>
        </div>
        
        <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed line-clamp-2">{product.description}</p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#3A6AD6] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#2F58B8] active:scale-[0.97] transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;