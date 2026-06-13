import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import { experiences } from '../data';

export const ExperiencesView: React.FC = () => {
  const categories = ['All', 'Coworking', 'Classes', 'Workshops'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredExperiences = activeCategory === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === activeCategory);

  return (
    <div className="pb-32 pt-12 px-6 space-y-6 max-w-md mx-auto min-h-screen relative">
      <header>
        <h1 className="text-3xl font-serif text-walnut mb-2">Explore</h1>
        <p className="text-walnut/60 text-sm">Discover coworking spaces, classes, and local events.</p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40" size={18} />
        <input 
          type="text" 
          placeholder="Search experiences..." 
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

      {/* Experiences List */}
      <div className="space-y-6 pb-10">
        {filteredExperiences.map((exp, idx) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-linen rounded-[24px] overflow-hidden shadow-sm border border-walnut/5"
          >
            <div className="relative h-48 w-full">
              <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-pure/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-walnut shadow-sm">
                {exp.category}
              </div>
              <button className="absolute top-3 right-3 bg-pure/90 backdrop-blur-sm p-2 rounded-full text-walnut shadow-sm hover:text-terracotta transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-serif font-bold text-walnut text-lg leading-tight">{exp.title}</h3>
                <div className="flex items-center gap-1 text-sm font-semibold text-walnut">
                  <Star size={14} className="text-saffron fill-saffron" />
                  {exp.rating}
                </div>
              </div>
              
              <p className="text-sm text-walnut/60 mb-3">Hosted by {exp.host}</p>
              
              <div className="flex items-center gap-4 text-xs text-walnut/70 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {exp.duration}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  TIME Marrakech
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-walnut/10">
                <div className="font-bold text-walnut">
                  {exp.price} MAD <span className="text-xs font-normal text-walnut/60">/ person</span>
                </div>
                <button className="bg-terracotta text-pure px-5 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-transform">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
