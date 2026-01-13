'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Admin check
async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

// Products
export async function createProduct(formData: FormData) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const product = {
    name: formData.get('name') as string,
    slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    category_id: formData.get('category_id') as string,
    image_url: formData.get('image_url') as string || null,
    stock_quantity: parseInt(formData.get('stock') as string) || 0,
    is_active: true,
    is_featured: formData.get('is_featured') === 'true',
  };

  const { error } = await supabase.from('products').insert(product);

  if (error) {
    console.error('Product create error:', error);
    return { error: 'Ürün eklenemedi: ' + error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  return { success: 'Ürün başarıyla eklendi' };
}

export async function updateProduct(id: string, formData: FormData) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const product = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    category_id: formData.get('category_id') as string,
    image_url: formData.get('image_url') as string || null,
    stock_quantity: parseInt(formData.get('stock') as string) || 0,
    is_featured: formData.get('is_featured') === 'true',
  };

  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);

  if (error) {
    return { error: 'Ürün güncellenemedi' };
  }

  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  return { success: 'Ürün güncellendi' };
}

export async function deleteProduct(id: string) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'Ürün silinemedi' };
  }

  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  return { success: 'Ürün silindi' };
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    return { error: 'Durum güncellenemedi' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: isActive ? 'Ürün aktif edildi' : 'Ürün pasif edildi' };
}

// Categories
export async function createCategory(formData: FormData) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const category = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
    description: formData.get('description') as string || null,
    image_url: formData.get('image_url') as string || null,
  };

  const { error } = await supabase.from('categories').insert(category);

  if (error) {
    return { error: 'Kategori eklenemedi' };
  }

  revalidatePath('/admin');
  revalidatePath('/categories');
  revalidatePath('/');
  return { success: 'Kategori eklendi' };
}

export async function updateCategory(id: string, formData: FormData) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const category = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
  };

  const { error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id);

  if (error) {
    return { error: 'Kategori güncellenemedi' };
  }

  revalidatePath('/admin');
  revalidatePath('/categories');
  revalidatePath('/');
  return { success: 'Kategori güncellendi' };
}

export async function deleteCategory(id: string) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'Kategori silinemedi (içinde ürün olabilir)' };
  }

  revalidatePath('/admin');
  revalidatePath('/categories');
  revalidatePath('/');
  return { success: 'Kategori silindi' };
}

// Orders
export async function getOrders() {
  if (!await isAdmin()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users!orders_user_id_fkey (
        full_name,
        email
      ),
      order_items (
        *,
        products (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Orders fetch error:', error);
    return [];
  }

  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  if (!await isAdmin()) {
    return { error: 'Yetkisiz erişim' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { error: 'Durum güncellenemedi' };
  }

  revalidatePath('/admin');
  return { success: 'Sipariş durumu güncellendi' };
}

// Stats
export async function getAdminStats() {
  if (!await isAdmin()) {
    return null;
  }

  const supabase = await createClient();

  const [products, orders, users] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('orders').select('id, total_amount, status'),
    supabase.from('users').select('id', { count: 'exact' }).eq('role', 'customer'),
  ]);

  const totalRevenue = orders.data?.reduce((sum, order) => {
    return order.status === 'delivered' ? sum + (order.total_amount || 0) : sum;
  }, 0) || 0;

  const pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0;

  return {
    totalProducts: products.count || 0,
    totalOrders: orders.data?.length || 0,
    totalRevenue,
    pendingOrders,
    totalCustomers: users.count || 0,
  };
}

// Get all products for admin
export async function getAdminProducts() {
  if (!await isAdmin()) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Products fetch error:', error);
    return [];
  }

  return data || [];
}

// Get all categories for admin
export async function getAdminCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products (id)
    `)
    .order('name');

  if (error) {
    console.error('Categories fetch error:', error);
    return [];
  }

  // Add product count
  return (data || []).map(cat => ({
    ...cat,
    productCount: cat.products?.length || 0,
  }));
}
