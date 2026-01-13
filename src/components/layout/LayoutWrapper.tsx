'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface LayoutWrapperProps {
  children: React.ReactNode;
  initialUser?: UserData | null;
  initialCartCount?: number;
}

export default function LayoutWrapper({ children, initialUser, initialCartCount = 0 }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <CartProvider initialCount={initialCartCount}>
      <Header initialUser={initialUser} initialCartCount={initialCartCount} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
