'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, ShoppingCart, Users, TrendingUp, 
  Plus, Edit, Trash2, Eye, Search, Filter,
  LayoutDashboard, Settings, LogOut, Menu, X,
  ChevronRight, DollarSign, Box, Tag, Loader2
} from 'lucide-react';
import { 
  getAdminStats, 
  getAdminProducts, 
  getAdminCategories, 
  getOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
  updateOrderStatus,
  toggleProductStatus
} from '@/lib/actions/admin';
import { getSiteSettings, updateSiteSettings, SiteSettings } from '@/lib/actions/settings';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url: string | null;
  categories: { name: string } | null;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  users: { full_name: string; email: string } | null;
  order_items: { id: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'categories' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const isCheckingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let isInitializing = true;

    const checkAdminAndLoadData = async () => {
      if (isCheckingRef.current || hasLoadedRef.current) return;
      isCheckingRef.current = true;
      try {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (!user) {
          if (isInitializing) {
            router.replace('/login?redirectTo=/admin');
          }
          return;
        }

        // Check if admin
        const { data: profile } = (await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()) as { data: { role: string } | null };

        if (!isMounted) return;

        if (profile?.role !== 'admin') {
          if (isInitializing) {
            router.replace('/');
          }
          return;
        }

        await loadData();
        hasLoadedRef.current = true;
        isInitializing = false;
      } catch (error: any) {
        console.error('Admin check error:', error);
        if (isMounted && isInitializing) {
          router.replace('/login?redirectTo=/admin');
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isInitializing) {
        window.location.href = '/login?redirectTo=/admin';
      }
    });

    checkAdminAndLoadData();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      await fetch('/api/auth/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ event: 'SIGNED_OUT', session: null }),
      });
      
      // Clear local state
      setStats(null);
      setProducts([]);
      setOrders([]);
      setCategories([]);
      
      // Hard redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [statsData, productsData, ordersData, categoriesData, settingsData] = await Promise.all([
      getAdminStats(),
      getAdminProducts(),
      getOrders(),
      getAdminCategories(),
      getSiteSettings(),
    ]);

    setStats(statsData);
    setProducts(productsData);
    setOrders(ordersData);
    setCategories(categoriesData);
    setSiteSettings(settingsData);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal';
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      default: return status;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    startTransition(async () => {
      await deleteProduct(productId);
      await loadData();
    });
  };

  const handleToggleProductStatus = (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleProductStatus(productId, !currentStatus);
      await loadData();
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    startTransition(async () => {
      await deleteCategory(categoryId);
      await loadData();
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      await loadData();
    });
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createProduct(formData);
      if (result.success) {
        setShowAddProduct(false);
        await loadData();
      } else {
        alert(result.error);
      }
    });
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.success) {
        setShowAddCategory(false);
        await loadData();
      } else {
        alert(result.error);
      }
    });
  };

  const sidebarItems = [
    { id: 'dashboard' as TabType, name: 'Kontrol Paneli', icon: LayoutDashboard },
    { id: 'products' as TabType, name: 'Ürünler', icon: Package },
    { id: 'orders' as TabType, name: 'Siparişler', icon: ShoppingCart },
    { id: 'categories' as TabType, name: 'Kategoriler', icon: Tag },
    { id: 'settings' as TabType, name: 'Ayarlar', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Kooperatif"
              width={120}
              height={40}
              className="h-10 w-auto invert brightness-200"
            />
          </Link>
          <p className="text-xs text-gray-400 mt-2">Yönetim Paneli</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Siteye Dön</span>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {sidebarItems.find(item => item.id === activeTab)?.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hoş geldiniz, Admin</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Ürün</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Sipariş</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-gray-900">₺{(stats?.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Bekleyen Sipariş</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Box className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Son Siparişler</h2>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-orange-500 text-sm hover:underline flex items-center gap-1"
                  >
                    Tümünü Gör <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{order.users?.full_name || 'Anonim'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₺{order.total_amount}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Ürün Ekle
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {product.image_url && (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.categories?.name || '-'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₺{product.price}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.stock_quantity > 0 ? product.stock_quantity : <span className="text-red-500">Tükendi</span>}
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                              disabled={isPending}
                              className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {product.is_active ? 'Aktif' : 'Pasif'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/product/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Görüntüle">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Link>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isPending}
                                className="p-2 hover:bg-gray-100 rounded-lg transition" 
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Sipariş no veya müşteri ara..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Tüm Durumlar</option>
                  <option value="pending">Beklemede</option>
                  <option value="processing">Hazırlanıyor</option>
                  <option value="shipped">Kargoda</option>
                  <option value="delivered">Teslim Edildi</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Sayısı</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{order.users?.full_name || 'Anonim'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{order.order_items?.length || 0} ürün</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₺{order.total_amount}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              disabled={isPending}
                              className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Beklemede</option>
                              <option value="processing">Hazırlanıyor</option>
                              <option value="shipped">Kargoda</option>
                              <option value="delivered">Teslim Edildi</option>
                              <option value="cancelled">İptal</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Detay">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Kategori Ekle
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori Adı</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Sayısı</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{category.slug}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{category.productCount} ürün</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={isPending}
                                className="p-2 hover:bg-gray-100 rounded-lg transition" 
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              {settingsMessage && (
                <div className={`p-4 rounded-lg ${settingsMessage.includes('başarı') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {settingsMessage}
                </div>
              )}
              
              {/* İletişim Bilgileri */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <textarea
                      rows={3}
                      value={siteSettings.contact_address || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, contact_address: e.target.value})}
                      placeholder="Adres bilgisi"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon 1</label>
                      <input
                        type="text"
                        value={siteSettings.contact_phone1 || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_phone1: e.target.value})}
                        placeholder="+90 (XXX) XXX XX XX"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon 2 (Opsiyonel)</label>
                      <input
                        type="text"
                        value={siteSettings.contact_phone2 || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_phone2: e.target.value})}
                        placeholder="+90 (XXX) XXX XX XX"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta 1</label>
                      <input
                        type="email"
                        value={siteSettings.contact_email1 || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_email1: e.target.value})}
                        placeholder="info@ornek.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta 2 (Opsiyonel)</label>
                      <input
                        type="email"
                        value={siteSettings.contact_email2 || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_email2: e.target.value})}
                        placeholder="destek@ornek.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hafta İçi Çalışma Saatleri</label>
                      <input
                        type="text"
                        value={siteSettings.contact_hours_weekday || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_hours_weekday: e.target.value})}
                        placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cumartesi Çalışma Saatleri</label>
                      <input
                        type="text"
                        value={siteSettings.contact_hours_saturday || ''}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_hours_saturday: e.target.value})}
                        placeholder="Cumartesi: 10:00 - 14:00"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hakkımızda */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hakkımızda Sayfası</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={siteSettings.about_title || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, about_title: e.target.value})}
                      placeholder="Hakkımızda başlığı"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                    <textarea
                      rows={2}
                      value={siteSettings.about_description || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, about_description: e.target.value})}
                      placeholder="Kısa açıklama"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hikayemiz</label>
                    <textarea
                      rows={6}
                      value={siteSettings.about_story || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, about_story: e.target.value})}
                      placeholder="Kooperatifinizin hikayesi..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={async () => {
                  setSettingsMessage(null);
                  startTransition(async () => {
                    const result = await updateSiteSettings(siteSettings);
                    if (result.success) {
                      setSettingsMessage('Ayarlar başarıyla kaydedildi!');
                    } else {
                      setSettingsMessage(result.error || 'Bir hata oluştu');
                    }
                    setTimeout(() => setSettingsMessage(null), 3000);
                  });
                }}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isPending ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Yeni Ürün Ekle</h2>
              <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ürün adını giriniz"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="category_id" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Kategori seçiniz</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Ürün açıklaması"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_featured" value="true" id="is_featured" className="rounded" />
                <label htmlFor="is_featured" className="text-sm text-gray-700">Öne Çıkan Ürün</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {isPending ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Yeni Kategori Ekle</h2>
              <button onClick={() => setShowAddCategory(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Kategori adını giriniz"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="kategori-adi"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Kategori açıklaması"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {isPending ? 'Kaydediliyor...' : 'Kategoriyi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
