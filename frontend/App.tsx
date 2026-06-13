import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { OrderView } from './views/OrderView';
import { CommunityView } from './views/CommunityView';
import { ExperiencesView } from './views/ExperiencesView';
import { LoginView } from './views/LoginView';
import { CheckoutView } from './views/CheckoutView';
import { ChatView } from './views/ChatView';
import { StaffView } from './views/StaffView';
import { CartItem, Product, OrderType, Order, ServiceRequest } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');

  // Global state for Staff Dashboard
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const clearCart = () => setCart([]);

  const handleCheckoutSuccess = (finalCart: CartItem[], type: OrderType) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6),
      items: finalCart,
      type: type,
      tableNumber: type === 'dine-in' ? '12' : undefined, // Hardcoded table 12 for demo
      status: 'pending',
      timestamp: new Date(),
      total: finalCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckout(false);
    setActiveTab('home');
  };

  const handleRequestService = (service: string, table: string) => {
    const newReq: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 6),
      serviceType: service,
      tableNumber: table,
      status: 'pending',
      timestamp: new Date()
    };
    setServiceRequests(prev => [newReq, ...prev]);
  };

  const handleCompleteOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed' } : o));
  };

  const handleResolveRequest = (id: string) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  if (isCheckout) {
    return (
      <CheckoutView 
        cart={cart} 
        orderType={orderType}
        onBack={() => setIsCheckout(false)} 
        onSuccess={handleCheckoutSuccess} 
      />
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onAddToCart={addToCart} onOpenChat={() => setIsChatOpen(true)} onRequestService={handleRequestService} />;
      case 'order':
        return <OrderView cart={cart} onAddToCart={addToCart} orderType={orderType} setOrderType={setOrderType} />;
      case 'community':
        return <CommunityView />;
      case 'experiences':
        return <ExperiencesView />;
      case 'staff':
        return <StaffView orders={orders} serviceRequests={serviceRequests} onCompleteOrder={handleCompleteOrder} onResolveRequest={handleResolveRequest} />;
      default:
        return <HomeView onAddToCart={addToCart} onOpenChat={() => setIsChatOpen(true)} onRequestService={handleRequestService} />;
    }
  };

  return (
    <div className="min-h-screen bg-base font-sans selection:bg-terracotta/30">
      <main className="w-full h-full">
        {renderView()}
      </main>
      
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCheckout(true)}
      />

      <ChatView 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onAddToCart={addToCart}
        onRequestService={handleRequestService}
      />
    </div>
  );
};

export default App;
