import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, BellRing, Droplet, Sparkles } from 'lucide-react';
import { Order, ServiceRequest } from '../types';

interface StaffViewProps {
  orders: Order[];
  serviceRequests: ServiceRequest[];
  onCompleteOrder: (id: string) => void;
  onResolveRequest: (id: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ orders, serviceRequests, onCompleteOrder, onResolveRequest }) => {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'floor'>('kitchen');

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const pendingRequests = serviceRequests.filter(r => r.status === 'pending');

  const getServiceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('water')) return <Droplet size={20} className="text-blue-500" />;
    if (t.includes('clean')) return <Sparkles size={20} className="text-saffron" />;
    return <BellRing size={20} className="text-terracotta" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="pb-32 pt-12 px-6 space-y-6 max-w-md mx-auto min-h-screen bg-walnut text-pure">
      <header>
        <h1 className="text-3xl font-serif text-saffron mb-2">Staff Dashboard</h1>
        <p className="text-pure/60 text-sm">Manage incoming orders and table requests.</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-pure/10 rounded-xl border border-pure/5">
        <button
          onClick={() => setActiveTab('kitchen')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'kitchen' ? 'bg-saffron text-walnut shadow-md' : 'text-pure/60 hover:text-pure'
          }`}
        >
          <ChefHat size={16} />
          Kitchen ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('floor')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'floor' ? 'bg-saffron text-walnut shadow-md' : 'text-pure/60 hover:text-pure'
          }`}
        >
          <BellRing size={16} />
          Floor ({pendingRequests.length})
        </button>
      </div>

      {/* Kitchen View */}
      {activeTab === 'kitchen' && (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 text-pure/40">
              <ChefHat size={48} className="mx-auto mb-4 opacity-50" />
              <p>No pending orders.</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pure/5 rounded-[20px] p-5 border border-pure/10"
              >
                <div className="flex justify-between items-start mb-4 border-b border-pure/10 pb-3">
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      order.type === 'takeout' ? 'bg-terracotta/20 text-terracotta' : 'bg-saffron/20 text-saffron'
                    }`}>
                      {order.type === 'takeout' ? 'Takeout' : `Table ${order.tableNumber}`}
                    </span>
                    <p className="text-xs text-pure/50 flex items-center gap-1">
                      <Clock size={12} /> {formatTime(order.timestamp)} • Order #{order.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="bg-pure/10 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.tags && <p className="text-[10px] text-pure/50">{item.tags.join(', ')}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onCompleteOrder(order.id)}
                  className="w-full bg-saffron text-walnut py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 size={18} />
                  Mark as Ready
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Floor View */}
      {activeTab === 'floor' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-pure/40">
              <BellRing size={48} className="mx-auto mb-4 opacity-50" />
              <p>No pending service requests.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pure/5 rounded-[20px] p-5 border border-pure/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-pure/10 p-3 rounded-full">
                    {getServiceIcon(req.serviceType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Table {req.tableNumber}</h3>
                    <p className="text-sm text-pure/80 capitalize">{req.serviceType}</p>
                    <p className="text-[10px] text-pure/40 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {formatTime(req.timestamp)}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => onResolveRequest(req.id)}
                  className="bg-pure/10 hover:bg-saffron hover:text-walnut p-3 rounded-full transition-colors active:scale-95"
                >
                  <CheckCircle2 size={24} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
