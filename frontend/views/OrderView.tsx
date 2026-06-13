import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Clock } from 'lucide-react';
import { menuItems } from '../data';
import { CartItem, Product, OrderType } from '../types';

interface OrderViewProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

export const OrderView: React.FC<OrderViewProps> = ({ cart, onAddToCart, orderType, setOrderType }) => {
  const categories = ['All', 'Espresso', 'Matcha', 'Pastries'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="pb-32 pt-12 px-6 space-y-6 max-w-md mx-auto min-h-screen relative">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-walnut">Menu</h1>
      </header>

      {/* Order Type Toggle */}
      <div className="flex p-1 bg-linen rounded-xl border border-walnut/5">
        <button
          onClick={() => setOrderType('dine-in')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            orderType === 'dine-in' ? 'bg-walnut text-pure shadow-md' : 'text-walnut/60 hover:text-walnut'
          }`}
        >
          Dine In
        </button>
        <button
          onClick={() => setOrderType('takeout')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            orderType === 'takeout' ? 'bg-walnut text-pure shadow-md' : 'text-walnut/60 hover:text-walnut'
          }`}
        >
          <Clock size={14} />
          Takeout (5 mins)
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40" size={18} />
        <input 
          type="text" 
          placeholder="Search for drinks, pastries..." 
          className="w-full bg-linen border border-walnut/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-saffron transition-colors shadow-sm text-walnut placeholder:text-walnut/40"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === category 
                ? 'bg-walnut text-pure shadow-md' 
                : 'bg-linen text-walnut/70 border border-walnut/5 hover:bg-walnut/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-5 pb-20">
        {filteredItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-linen rounded-[24px] p-3 shadow-sm border border-walnut/5 flex gap-4"
          >
            <img src={item.image} alt={item.name} className="w-28 h-28 rounded-[18px] object-cover" />
            <div className="flex-1 flex flex-col justify-between py-1 pr-1">
              <div>
                <h3 className="font-serif font-bold text-walnut text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-walnut/60 line-clamp-2 mb-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-terracotta">{item.price} MAD</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAddToCart(item)}
                  className="bg-walnut text-pure p-2 rounded-xl hover:bg-walnut/90 transition-all shadow-sm"
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
