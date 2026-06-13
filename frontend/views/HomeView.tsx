import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Sparkles, Droplet, BellRing, MapPin, CheckCircle2 } from 'lucide-react';
import { currentUser, communityMembers, menuItems } from '../data';
import { Product } from '../types';

interface HomeViewProps {
  onAddToCart: (product: Product) => void;
  onOpenChat: () => void;
  onRequestService: (service: string, table: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onAddToCart, onOpenChat, onRequestService }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const activeMembers = communityMembers.filter(m => m.isHere);
  
  const progress = (currentUser.points / currentUser.nextTierPoints) * 100;
  const circleRadius = 36;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  const featuredItem = menuItems.find(i => i.id === 'p2') || menuItems[0]; // Lavender Latte

  const handleServiceRequest = (service: string) => {
    onRequestService(service, '12'); // Hardcoded table 12 for demo
    setToastMessage(`${service} request sent to your table.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="pb-32 pt-14 px-6 space-y-8 max-w-md mx-auto relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-12 left-6 right-6 z-50 bg-walnut text-pure px-4 py-3 rounded-2xl shadow-premium flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-saffron" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-walnut">
            Good morning, {currentUser.name}
          </h1>
          <p className="text-walnut/60 text-sm mt-1 flex items-center gap-1">
            Rise and grind! ☕️
          </p>
        </div>
        <img 
          src={currentUser.avatar} 
          alt="Profile" 
          className="w-12 h-12 rounded-full object-cover shadow-sm border border-walnut/10"
        />
      </header>

      {/* Table Service Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linen rounded-[24px] p-5 shadow-sm border border-walnut/5"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-saffron/20 p-2.5 rounded-full">
              <MapPin size={18} className="text-saffron" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-walnut text-sm">Table 12</h3>
              <p className="text-[10px] text-walnut/60 uppercase tracking-wider font-semibold">TIME Gueliz</p>
            </div>
          </div>
          <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-green-500/20">
            Checked In
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleServiceRequest('Water')}
            className="bg-pure rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-walnut/5 active:scale-95 transition-transform hover:bg-walnut/5"
          >
            <Droplet className="text-terracotta" size={20} />
            <span className="text-xs font-semibold text-walnut">Water</span>
          </button>
          <button 
            onClick={() => handleServiceRequest('Waiter')}
            className="bg-pure rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-walnut/5 active:scale-95 transition-transform hover:bg-walnut/5"
          >
            <BellRing className="text-saffron" size={20} />
            <span className="text-xs font-semibold text-walnut">Waiter</span>
          </button>
          <button 
            onClick={() => handleServiceRequest('Clean Table')}
            className="bg-pure rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-walnut/5 active:scale-95 transition-transform hover:bg-walnut/5"
          >
            <Sparkles className="text-walnut/60" size={20} />
            <span className="text-xs font-semibold text-walnut">Clean</span>
          </button>
        </div>
      </motion.section>

      {/* Rewards Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-walnut rounded-[24px] p-6 text-pure shadow-premium relative overflow-hidden"
      >
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <p className="text-pure/70 text-xs font-semibold tracking-wider uppercase">Rewards Balance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{currentUser.points}</span>
              <Star size={20} className="text-saffron fill-saffron mb-1" />
            </div>
            <p className="text-pure/80 text-sm mt-2 max-w-[160px] leading-snug">
              You're {currentUser.nextTierPoints - currentUser.points} stars away from your next reward!
            </p>
            
            <div className="flex gap-4 mt-6">
              <button className="bg-pure text-walnut px-4 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-transform">
                View rewards
              </button>
              <button className="text-pure/80 text-sm font-medium active:scale-95 transition-transform">
                Earn more stars
              </button>
            </div>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
              <circle cx="48" cy="48" r={circleRadius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
              <circle
                cx="48" cy="48" r={circleRadius} stroke="#D4A017" strokeWidth="6" fill="none" strokeLinecap="round"
                style={{ strokeDasharray: circleCircumference, strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="bg-linen w-12 h-12 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-xl">🥤</span>
            </div>
          </div>
        </div>
      </motion.div>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-serif text-walnut">Order again</h2>
          <button className="text-sm text-terracotta font-medium">See all</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          {menuItems.slice(0, 3).map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-44 bg-linen rounded-[20px] p-3 shadow-sm border border-walnut/5"
            >
              <div className="relative mb-3">
                <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-2xl" />
                <button className="absolute top-2 right-2 bg-pure/80 backdrop-blur-sm p-1.5 rounded-full text-terracotta">
                  <Heart size={16} />
                </button>
              </div>
              <div className="px-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-walnut text-sm leading-tight pr-2">{item.name}</h3>
                  <span className="text-terracotta font-semibold text-sm">{item.price} MAD</span>
                </div>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="w-full py-2 rounded-xl border border-walnut/20 text-walnut text-xs font-semibold hover:bg-walnut/5 active:scale-95 transition-all"
                >
                  Order again
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-linen rounded-[24px] p-6 flex items-center justify-between shadow-sm border border-walnut/5 relative overflow-hidden">
          <div className="z-10 max-w-[60%]">
            <h3 className="text-lg font-serif text-walnut mb-2">
              Try our new<br/>{featuredItem.name} 🪻
            </h3>
            <p className="text-walnut/60 text-xs mb-4 leading-relaxed">
              {featuredItem.description}
            </p>
            <button 
              onClick={() => onAddToCart(featuredItem)}
              className="bg-terracotta text-pure px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-transform"
            >
              Order now
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <img 
              src={featuredItem.image} 
              alt={featuredItem.name} 
              className="w-full h-full object-cover object-left mask-image-linear-gradient"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-serif text-walnut">Who's at TIME</h2>
          <button className="text-sm text-terracotta font-medium">View all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {activeMembers.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-20 flex flex-col items-center space-y-2"
            >
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-pure shadow-sm" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-saffron border-2 border-pure rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-walnut truncate w-20">{member.name}</p>
                <p className="text-[10px] text-walnut/50 truncate w-20">{member.status}</p>
              </div>
            </motion.div>
          ))}
          <div className="flex-shrink-0 w-20 flex flex-col items-center justify-center space-y-2">
            <button className="w-16 h-16 rounded-full border-2 border-dashed border-walnut/20 flex items-center justify-center text-walnut/40 hover:bg-walnut/5 transition-colors">
              <span className="text-2xl">+</span>
            </button>
            <p className="text-xs font-medium text-walnut/60">Check in</p>
          </div>
        </div>
      </section>

      {/* Ammi Driss AI FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpenChat}
        className="fixed bottom-28 right-6 bg-walnut text-saffron p-4 rounded-full shadow-premium border-2 border-saffron/20 z-40 flex items-center justify-center"
      >
        <Sparkles size={24} />
      </motion.button>

    </div>
  );
};
