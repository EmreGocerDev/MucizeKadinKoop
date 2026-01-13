-- =============================================
-- EV LEZZETLERİ - SUPABASE DATABASE SCHEMA
-- Tüm tablolar, ilişkiler, indexler ve RLS politikaları
-- =============================================

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS (Kullanıcılar) Tablosu
-- =============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  district TEXT,
  postal_code TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- =============================================
-- 2. SELLERS (Satıcılar) Tablosu
-- =============================================
CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  store_slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  iban TEXT,
  tax_number TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  commission_rate DECIMAL(4,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sellers RLS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers are viewable by everyone" ON public.sellers
  FOR SELECT USING (is_approved = true AND is_active = true);

CREATE POLICY "Users can view their own seller profile" ON public.sellers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile" ON public.sellers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create seller profile" ON public.sellers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 3. CATEGORIES (Kategoriler) Tablosu
-- =============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (is_active = true);

-- Default categories
INSERT INTO public.categories (name, slug, description, image_url, sort_order) VALUES
  ('Ana Yemekler', 'ana-yemekler', 'Ev yapımı lezzetli ana yemekler', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 1),
  ('Çorbalar', 'corbalar', 'Sıcacık ev çorbaları', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', 2),
  ('Tatlılar', 'tatlilar', 'El yapımı tatlılar ve pastalar', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', 3),
  ('Kahvaltılıklar', 'kahvaltiliklar', 'Kahvaltı sofranız için', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop', 4),
  ('Salatalar', 'salatalar', 'Taze ve sağlıklı salatalar', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 5),
  ('Börekler', 'borekler', 'El açması börekler', 'https://images.unsplash.com/photo-1628191139360-4083564d03fd?w=400&h=300&fit=crop', 6);

-- =============================================
-- 4. PRODUCTS (Ürünler) Tablosu
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  preparation_time TEXT,
  serving_size TEXT,
  calories INTEGER,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 10,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, slug)
);

-- Products Index
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_available ON public.products(is_available);
CREATE INDEX idx_products_featured ON public.products(is_featured);

-- Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Sellers can manage their own products" ON public.products
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.sellers WHERE id = products.seller_id
    )
  );

-- =============================================
-- 5. PRODUCT_REVIEWS (Ürün Yorumları) Tablosu
-- =============================================
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

-- Reviews Index
CREATE INDEX idx_reviews_product ON public.product_reviews(product_id);
CREATE INDEX idx_reviews_user ON public.product_reviews(user_id);

-- Reviews RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.product_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 6. CARTS (Sepetler) Tablosu
-- =============================================
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Carts Index
CREATE INDEX idx_carts_user ON public.carts(user_id);
CREATE INDEX idx_carts_session ON public.carts(session_id);

-- Carts RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart" ON public.carts
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 7. CART_ITEMS (Sepet Ürünleri) Tablosu
-- =============================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Cart Items Index
CREATE INDEX idx_cart_items_cart ON public.cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON public.cart_items(product_id);

-- Cart Items RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart items" ON public.cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
  );

-- =============================================
-- 8. ADDRESSES (Adresler) Tablosu
-- =============================================
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  neighborhood TEXT,
  address_line TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses Index
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- Addresses RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 9. ORDERS (Siparişler) Tablosu
-- =============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL NOT NULL,
  
  -- Fiyatlandırma
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Durum
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'preparing', 'ready', 
    'on_delivery', 'delivered', 'cancelled', 'refunded'
  )),
  
  -- Teslimat bilgileri
  delivery_address JSONB NOT NULL,
  delivery_notes TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  
  -- Ödeme bilgileri
  payment_method TEXT DEFAULT 'credit_card' CHECK (payment_method IN (
    'credit_card', 'bank_transfer', 'cash_on_delivery'
  )),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded'
  )),
  payment_id TEXT,
  
  -- İptal/İade
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Index
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sellers can view orders for their store" ON public.orders
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.sellers WHERE id = orders.seller_id)
  );

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update their orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.sellers WHERE id = orders.seller_id)
  );

-- =============================================
-- 10. ORDER_ITEMS (Sipariş Ürünleri) Tablosu
-- =============================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Index
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- Order Items RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- =============================================
-- 11. PAYMENTS (Ödemeler) Tablosu
-- =============================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- PayTR bilgileri
  merchant_oid TEXT UNIQUE,
  paytr_token TEXT,
  
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TRY',
  
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
  )),
  
  payment_method TEXT,
  card_last_four TEXT,
  card_brand TEXT,
  
  -- PayTR callback bilgileri
  callback_received BOOLEAN DEFAULT FALSE,
  callback_data JSONB,
  
  error_code TEXT,
  error_message TEXT,
  
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Index
CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_merchant_oid ON public.payments(merchant_oid);

-- Payments RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 12. FAVORITES (Favoriler) Tablosu
-- =============================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Favorites Index
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_product ON public.favorites(product_id);

-- Favorites RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 13. COUPONS (Kuponlar) Tablosu
-- =============================================
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons are viewable" ON public.coupons
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- =============================================
-- 14. COUPON_USAGE (Kupon Kullanımları) Tablosu
-- =============================================
CREATE TABLE public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, order_id)
);

-- =============================================
-- 15. NOTIFICATIONS (Bildirimler) Tablosu
-- =============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'order_status', 'promotion', 'review', 'system', 'chat'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Index
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- Notifications RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 16. CONTACT_MESSAGES (İletişim Mesajları) Tablosu
-- =============================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 17. NEWSLETTER_SUBSCRIBERS (E-Bülten Aboneleri) Tablosu
-- =============================================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- =============================================
-- 18. SITE_SETTINGS (Site Ayarları) Tablosu
-- =============================================
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"site_name": "Ev Lezzetleri", "tagline": "El Yapımı Ev Yemekleri", "email": "info@evlezzetleri.com", "phone": "+90 212 123 45 67"}'),
  ('delivery', '{"min_order_amount": 50, "delivery_fee": 15, "free_delivery_threshold": 150}'),
  ('commission', '{"default_rate": 10}'),
  ('payment', '{"paytr_merchant_id": "", "paytr_merchant_key": "", "paytr_merchant_salt": ""}');

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'EL' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function: Update product rating after review
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    rating = (SELECT AVG(rating) FROM public.product_reviews WHERE product_id = NEW.product_id AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM public.product_reviews WHERE product_id = NEW.product_id AND is_approved = true)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger AFTER INSERT OR UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function: Update seller rating
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
  seller_id_var UUID;
BEGIN
  SELECT seller_id INTO seller_id_var FROM public.products WHERE id = NEW.product_id;
  
  UPDATE public.sellers
  SET 
    rating = (
      SELECT AVG(pr.rating) 
      FROM public.product_reviews pr
      JOIN public.products p ON pr.product_id = p.id
      WHERE p.seller_id = seller_id_var AND pr.is_approved = true
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.product_reviews pr
      JOIN public.products p ON pr.product_id = p.id
      WHERE p.seller_id = seller_id_var AND pr.is_approved = true
    )
  WHERE id = seller_id_var;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seller_rating_trigger AFTER INSERT OR UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

-- Function: Create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Kullanıcı')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- VIEWS
-- =============================================

-- View: Products with seller and category info
CREATE OR REPLACE VIEW public.products_with_details AS
SELECT 
  p.*,
  s.store_name as seller_name,
  s.store_slug as seller_slug,
  s.rating as seller_rating,
  c.name as category_name,
  c.slug as category_slug
FROM public.products p
LEFT JOIN public.sellers s ON p.seller_id = s.id
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.is_available = true AND s.is_approved = true AND s.is_active = true;

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sellers', 'sellers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('reviews', 'reviews', true);

-- Storage policies
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
