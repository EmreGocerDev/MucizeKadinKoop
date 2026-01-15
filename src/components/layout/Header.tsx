'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, User, Search, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import type { Session } from '@supabase/supabase-js';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface HeaderProps {
  initialUser?: UserData | null;
  initialCartCount?: number;
}

export default function Header({ initialUser = null, initialCartCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, setCartCount } = useCart();
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial cart count
  useEffect(() => {
    if (initialCartCount > 0) {
      setCartCount(initialCartCount);
    }
  }, [initialCartCount, setCartCount]);

  // Load user on mount and listen for auth changes
  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;
    const syncAuthState = async (event: string, session: Session | null) => {
      try {
        await fetch('/api/auth/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({ event, session }),
        });
      } catch (error) {
        console.error('Failed to sync auth state', error);
      }
    };

    // Helper function to load user profile
    const loadUserProfile = async (userId: string, email: string) => {
      try {
        const { data: profile } = (await supabase
          .from('users')
          .select('full_name, role')
          .eq('id', userId)
          .single()) as {
          data: { full_name?: string | null; role?: string | null } | null;
        };
        
        if (isMounted) {
          setUser({
            id: userId,
            email: email,
            full_name: profile?.full_name ?? undefined,
            role: profile?.role ?? undefined,
          });
        }
        
        // Get cart count
        const { data: cart } = (await supabase
          .from('carts')
          .select('cart_items(id)')
          .eq('user_id', userId)
          .single()) as {
          data: { cart_items?: { id: string }[] } | null;
        };
        
        if (isMounted) {
          setCartCount(cart?.cart_items?.length || 0);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncAuthState('INITIAL_SESSION', session);
          await loadUserProfile(session.user.id, session.user.email || '');
        }
      } catch (error) {
        console.error('Failed to init session', error);
      }
    };

    void initSession();

    // Listen for auth changes - this also fires INITIAL_SESSION on mount
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session ? 'exists' : 'null');
      void syncAuthState(event, session);
      
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setCartCount(0);
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setCartCount]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    try {
      await fetch('/api/auth/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ event: 'SIGNED_OUT', session: null }),
      });
    } catch (error) {
      console.error('Failed to sync sign out', error);
    }
    setUser(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Kırıkkale Mucize Kadın Kooperatifi"
              width={180}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Ana Sayfa
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Menü
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Kategoriler
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition font-medium">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition font-medium">
              İletişim
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-24 truncate">{user.full_name?.split(' ')[0] || 'Hesabım'}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-20 py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Yönetim Paneli
                        </Link>
                      )}
                      
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Hesabım
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition"
              >
                <User className="h-4 w-4" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Ana Sayfa
              </Link>
              <Link href="/menu" className="text-gray-700 hover:text-orange-600 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Menü
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Kategoriler
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                İletişim
              </Link>
              <div className="flex items-center gap-4 pt-4 border-t">
                <Link href="/cart" className="flex items-center gap-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>Sepetim</span>
                </Link>
              </div>
              {user ? (
                <div className="space-y-2">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-gray-700 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Yönetim Paneli</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Çıkış Yap ({user.full_name?.split(' ')[0]})</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-4 py-3 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
