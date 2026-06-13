import React from 'react';
import { Home, Coffee, ShoppingBag, Users, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, cartItemCount, onCartClick }) => {
  const navItemsLeft = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'order', icon: Coffee, label: 'Order' },
  ];
  
  const navItemsRight = [
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'staff', icon: ClipboardList, label: 'Staff' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* The Night Walnut Navigation Bar */}
      <div className="bg-walnut text-pure rounded-t-[32px] px-6 pt-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center max-w-md mx-auto relative">
          
          {/* Left Items */}
          <div className="flex space-x-8">
            {navItemsLeft.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center space-y-1.5 transition-colors duration-200 ${
                    isActive ? 'text-saffron' : 'text-pure/50 hover:text-pure/80'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Center Floating CTA (Shopping Basket) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="relative bg-terracotta text-pure p-4 rounded-full shadow-[0_8px_20px_rgba(208,109,77,0.4)] border-4 border-base"
              onClick={onCartClick}
            >
              <ShoppingBag size={28} strokeWidth={2} />
              
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.div
                    key={cartItemCount}
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-walnut text-saffron text-[12px] font-bold w-7 h-7 rounded-full flex items-center justify-center border-2 border-base shadow-sm"
                  >
                    {cartItemCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Right Items */}
          <div className="flex space-x-8">
            {navItemsRight.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center space-y-1.5 transition-colors duration-200 ${
                    isActive ? 'text-saffron' : 'text-pure/50 hover:text-pure/80'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
