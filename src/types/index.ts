// Supabase entegrasyonu için tipler

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  stock_quantity?: number;
  is_active?: boolean;
  is_featured?: boolean;
  ingredients?: string[];
  preparation_time?: string;
  created_at: string;
  // Joined data
  categories?: Category;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  delivery_address: string;
  created_at: string;
}
