import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageCircle, Briefcase, Coffee, BookOpen } from 'lucide-react';
import { communityMembers } from '../data';

export const CommunityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'here' | 'board'>('here');

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Working': return <Briefcase size={14} />;
      case 'Networking': return <MessageCircle size={14} />;
      case 'Learning': return <BookOpen size={14} />;
      default: return <Coffee size={14} />;
    }
  };

  return (
    <div className="pb-24 pt-12 px-6 space-y-6 max-w-md mx-auto min-h-screen flex flex-col">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-espresso mb-2">Community</h1>
        <p className="text-espresso/60 text-sm">Connect with creatives and professionals at TIME.</p>
      </header>

      {/* Custom Tabs */}
      <div className="flex p-1 bg-sand/30 rounded-xl">
        <button 
          onClick={() => setActiveTab('here')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'here' ? 'bg-white shadow-sm text-espresso' : 'text-espresso/60'}`}
        >
          Who's Here
        </button>
        <button 
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'board' ? 'bg-white shadow-sm text-espresso' : 'text-espresso/60'}`}
        >
          Notice Board
        </button>
      </div>

      {activeTab === 'here' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 space-y-4"
        >
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40" size={18} />
              <input 
                type="text" 
                placeholder="Search skills, roles..." 
                className="w-full bg-white border border-sand/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-copper transition-colors"
              />
            </div>
            <button className="bg-white border border-sand/50 p-2.5 rounded-xl text-espresso/70">
              <Filter size={18} />
            </button>
          </div>

          {/* Member List */}
          <div className="space-y-4">
            {communityMembers.filter(m => m.isHere).map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-sand/50"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-espresso">{member.name}</h3>
                        <p className="text-xs text-espresso/60">{member.role}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sand/30 text-espresso rounded-md text-[10px] font-medium">
                        {getStatusIcon(member.status)}
                        {member.status}
                      </span>
                    </div>
                    
                    {member.lookingFor && member.lookingFor.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-semibold text-espresso/50 uppercase tracking-wider mb-1">Looking for</p>
                        <div className="flex flex-wrap gap-1.5">
                          {member.lookingFor.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-copper/10 text-copper rounded-md text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 bg-espresso text-cream py-2 rounded-xl text-xs font-medium hover:bg-espresso/90 transition-colors">
                        Connect
                      </button>
                      <button className="px-4 bg-sand/30 text-espresso py-2 rounded-xl text-xs font-medium hover:bg-sand/50 transition-colors">
                        Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'board' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center text-espresso/50 text-sm"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-sand/30 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle size={24} className="text-espresso/40" />
            </div>
            <p>Notice board coming soon.<br/>Post jobs, events, and ideas here.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
