'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  showNotification: (message: string) => void;
  notification: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, initialCount = 0 }: { children: ReactNode; initialCount?: number }) {
  const [cartCount, setCartCount] = useState(initialCount);
  const [notification, setNotification] = useState<string | null>(null);

  const incrementCart = useCallback(() => {
    setCartCount(prev => prev + 1);
  }, []);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, incrementCart, showNotification, notification }}>
      {children}
      {/* Global Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-xl">✓</span>
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
