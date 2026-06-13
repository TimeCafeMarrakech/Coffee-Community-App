import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle2, Loader2, ShoppingBag, Banknote, Clock, XCircle } from 'lucide-react';
import { CartItem, OrderType } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  orderType: OrderType;
  onBack: () => void;
  onSuccess: (cart: CartItem[], type: OrderType) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, orderType, onBack, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'google' | 'card' | 'cash'>('apple');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax for food/beverage
  const total = subtotal + tax;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-walnut">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-terracotta/10 rounded-full p-4 mb-6"
        >
          <XCircle size={64} className="text-terracotta" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-serif mb-2 text-center"
        >
          Order Cancelled
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-walnut/60 text-center mb-12"
        >
          Your order has been successfully cancelled. No charges were made to your account.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs"
        >
          <button 
            onClick={() => onBack()}
            className="w-full bg-walnut text-pure py-4 rounded-2xl font-semibold text-lg shadow-premium active:scale-95 transition-transform"
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-walnut flex flex-col items-center justify-center p-6 text-pure">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-saffron rounded-full p-4 mb-6"
        >
          <CheckCircle2 size={64} className="text-walnut" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-serif mb-2 text-center"
        >
          Order Confirmed
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-pure/60 text-center mb-12"
        >
          {orderType === 'takeout' 
            ? "Your order will be ready for pickup in exactly 5 minutes." 
            : "Your order is being prepared. We'll bring it to your table."}
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs space-y-4"
        >
          <button 
            onClick={() => onSuccess(cart, orderType)}
            className="w-full bg-pure text-walnut py-4 rounded-2xl font-semibold text-lg shadow-premium active:scale-95 transition-transform"
          >
            Done
          </button>
          <button 
            onClick={() => setIsCancelled(true)}
            className="w-full bg-transparent border border-pure/20 text-pure/80 py-4 rounded-2xl font-semibold text-lg active:scale-95 transition-transform hover:bg-pure/5"
          >
            Cancel Order
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-base flex flex-col max-w-md mx-auto">
        <header className="px-6 pt-12 pb-4 flex items-center gap-4 bg-base sticky top-0 z-10">
          <button onClick={onBack} className="p-2 bg-linen rounded-full text-walnut active:scale-95 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-serif text-walnut">Your Cart</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-walnut/30" />
          </div>
          <h2 className="text-xl font-serif text-walnut mb-2">Your basket is empty</h2>
          <p className="text-walnut/60 text-sm mb-8">Looks like you haven't added any delicious coffee or pastries yet.</p>
          <button 
            onClick={onBack}
            className="bg-walnut text-pure px-8 py-3 rounded-xl font-semibold shadow-premium active:scale-95 transition-transform"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-4 bg-base sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-linen rounded-full text-walnut active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif text-walnut">Checkout</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-8">
        
        {/* Order Type Banner */}
        {orderType === 'takeout' && (
          <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="text-terracotta mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-terracotta text-sm">Takeout Order</h3>
              <p className="text-terracotta/80 text-xs mt-1">We'll start preparing this immediately so it's ready in 5 minutes.</p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <section>
          <h2 className="text-sm font-bold text-walnut/50 uppercase tracking-wider mb-4">Order Summary</h2>
          <div className="bg-linen rounded-[24px] p-5 space-y-4 border border-walnut/5">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-walnut/5 w-8 h-8 rounded-full flex items-center justify-center text-walnut font-semibold text-sm">
                    {item.quantity}x
                  </div>
                  <span className="font-medium text-walnut">{item.name}</span>
                </div>
                <span className="font-semibold text-walnut">{item.price * item.quantity} MAD</span>
              </div>
            ))}
            
            <div className="border-t border-walnut/10 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm text-walnut/60">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-sm text-walnut/60">
                <span>Tax (10%)</span>
                <span>{tax.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-walnut pt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} MAD</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-sm font-bold text-walnut/50 uppercase tracking-wider mb-4">Payment Method</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setPaymentMethod('apple')}
              className={`w-full flex items-center justify-between p-4 rounded-[20px] border-2 transition-all ${
                paymentMethod === 'apple' ? 'border-walnut bg-walnut/5' : 'border-transparent bg-linen'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-walnut" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.099-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.468 3.603-2.925 1.156-1.687 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.507 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/>
                </svg>
                <span className="font-semibold text-walnut">Apple Pay</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'apple' ? 'border-walnut' : 'border-walnut/20'}`}>
                {paymentMethod === 'apple' && <div className="w-2.5 h-2.5 bg-walnut rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('card')}
              className={`w-full flex items-center justify-between p-4 rounded-[20px] border-2 transition-all ${
                paymentMethod === 'card' ? 'border-walnut bg-walnut/5' : 'border-transparent bg-linen'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-walnut" />
                <span className="font-semibold text-walnut">Credit Card</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-walnut' : 'border-walnut/20'}`}>
                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-walnut rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`w-full flex items-center justify-between p-4 rounded-[20px] border-2 transition-all ${
                paymentMethod === 'cash' ? 'border-walnut bg-walnut/5' : 'border-transparent bg-linen'
              }`}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-walnut" />
                <span className="font-semibold text-walnut">Cash at Counter</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-walnut' : 'border-walnut/20'}`}>
                {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-walnut rounded-full" />}
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-base border-t border-walnut/5 max-w-md mx-auto pb-safe">
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-walnut text-pure rounded-2xl p-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-premium active:scale-95 transition-all disabled:opacity-80 disabled:active:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Processing...
            </>
          ) : (
            paymentMethod === 'cash' ? 'Confirm Order' : `Pay ${total.toFixed(2)} MAD`
          )}
        </button>
      </div>
    </div>
  );
};
