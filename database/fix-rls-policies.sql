-- =============================================
-- RLS POLİTİKA DÜZELTMELERİ VE EKSİKLER
-- Supabase SQL Editor'de çalıştırın
-- =============================================

-- 1. PRODUCTS - Admin erişimi ekle
-- =============================================

CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Mevcut ürün görüntüleme politikasını güncelle (is_available kontrolünü kaldır admin için)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (
    is_available = true 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. CATEGORIES - Herkes görebilsin
-- =============================================

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Admin kategorileri yönetebilsin
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. ORDERS - Admin erişimi
-- =============================================

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. ORDER ITEMS - Seller ve Admin erişimi
-- =============================================

CREATE POLICY "Sellers can view their order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM public.orders o
      JOIN public.sellers s ON o.seller_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. CART ITEMS - Unit Price Auto-fill
-- =============================================

CREATE OR REPLACE FUNCTION set_cart_item_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unit_price IS NULL OR NEW.unit_price = 0 THEN
    SELECT price INTO NEW.unit_price 
    FROM public.products 
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_cart_item_price_trigger ON public.cart_items;

CREATE TRIGGER set_cart_item_price_trigger 
  BEFORE INSERT ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION set_cart_item_price();

-- 6. SITE SETTINGS - RLS Ekle
-- =============================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. SELLERS - Admin erişimi
-- =============================================

CREATE POLICY "Admins can view all sellers" ON public.sellers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all sellers" ON public.sellers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. USERS - Admin tüm kullanıcıları görebilsin
-- =============================================

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.id = auth.uid() AND u2.role = 'admin'
    )
  );

-- 9. CONTACT MESSAGES - RLS Ekle
-- =============================================

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. NEWSLETTER - RLS Ekle
-- =============================================

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. PRODUCT REVIEWS - Seller Erişimi
-- =============================================

CREATE POLICY "Sellers can view reviews of their products" ON public.product_reviews
  FOR SELECT USING (
    product_id IN (
      SELECT p.id FROM public.products p
      JOIN public.sellers s ON p.seller_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- 12. COUPON USAGE - RLS Ekle
-- =============================================

ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create coupon usage" ON public.coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. COUPONS - Seller ve Admin Erişimi
-- =============================================

CREATE POLICY "Sellers can manage their own coupons" ON public.coupons
  FOR ALL USING (
    seller_id IN (
      SELECT id FROM public.sellers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- EK FAYDALΙ FUNCTİONLAR
-- =============================================

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user is seller
CREATE OR REPLACE FUNCTION is_seller()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.sellers 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's seller_id
CREATE OR REPLACE FUNCTION get_seller_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM public.sellers 
    WHERE user_id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VERİ TUTARLILIĞI İÇİN CHECKLER
-- =============================================

-- Cart items quantity check
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_quantity_check,
  ADD CONSTRAINT cart_items_quantity_check CHECK (quantity > 0 AND quantity <= 100);

-- Products price check
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_price_check,
  ADD CONSTRAINT products_price_check CHECK (price > 0 AND price < 100000);

-- Orders total amount check
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_total_check,
  ADD CONSTRAINT orders_total_check CHECK (total_amount >= 0);

-- =============================================
-- PERFORMANS İYİLEŞTİRMELERİ
-- =============================================

-- Additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role) WHERE role IN ('admin', 'seller');

-- =============================================
-- TAMAMLANDI! ✅
-- =============================================

-- Kontrol et:
SELECT 'Setup completed successfully!' as status;

-- Tüm RLS politikalarını listele
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
