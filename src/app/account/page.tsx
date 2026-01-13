'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, Package, MapPin, Heart, Settings, LogOut, 
  ChevronRight, Clock, CheckCircle, Truck, XCircle,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/lib/actions/auth';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string;
    };
  }[];
}

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Get profile
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile({
        ...profileData,
        email: user.email || '',
      });
    }

    // Get orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Hesabım</h1>
          <p className="text-white/80 mt-1">Hoş geldiniz, {profile?.full_name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-center font-semibold text-gray-900">{profile?.full_name}</h2>
                <p className="text-center text-sm text-gray-500">{profile?.email}</p>
              </div>

              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'profile' 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profilim</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'orders' 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Siparişlerim</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgilerim</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ad Soyad</label>
                    <p className="text-gray-900 font-medium">{profile?.full_name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">E-posta</label>
                    <p className="text-gray-900 font-medium">{profile?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Telefon</label>
                    <p className="text-gray-900 font-medium">{profile?.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Üyelik Tarihi</label>
                    <p className="text-gray-900 font-medium">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-'}
                    </p>
                  </div>
                </div>

                {profile?.role === 'admin' && (
                  <div className="mt-8 p-4 bg-orange-50 rounded-xl">
                    <p className="text-orange-800 font-medium mb-2">🛡️ Admin Hesabı</p>
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                      Yönetim Paneline Git
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Siparişlerim</h2>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz siparişiniz yok</h3>
                    <p className="text-gray-500 mb-6">İlk siparişinizi vermek için menümüze göz atın.</p>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
                    >
                      Menüye Git
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                      {/* Order Header */}
                      <div className="p-4 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Sipariş No</p>
                          <p className="font-mono font-semibold text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tarih</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Toplam</p>
                          <p className="font-bold text-orange-600">₺{order.total_amount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-medium">{getStatusText(order.status)}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            {item.products?.image_url && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.products.image_url}
                                  alt={item.products.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.products?.name}</p>
                              <p className="text-sm text-gray-500">{item.quantity} adet × ₺{item.price}</p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ₺{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
