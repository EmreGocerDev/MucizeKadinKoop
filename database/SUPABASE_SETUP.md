# Supabase Database Kurulum Rehberi

## Adım 1: Supabase Dashboard'a Gir
1. https://supabase.com/dashboard adresine git
2. Projenize giriş yapın: `injbtpuclawegmtibtik` (MCZ projesi)

## Adım 2: SQL Editor'ü Aç
1. Sol menüden **SQL Editor** seçeneğine tıklayın
2. **New query** butonuna tıklayın

## Adım 3: Schema'yı Çalıştır

### Önemli Not:
Schema dosyasını tek seferde çalıştırmak yerine, **adım adım** çalıştırmanız önerilir.

### Sıralı Kurulum:

#### 1. UUID Extension
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 2. Users Tablosu
```sql
-- Schema.sql dosyasındaki Users bölümünü kopyalayıp çalıştırın (satır 10-40)
```

#### 3. Sellers Tablosu
```sql
-- Schema.sql dosyasındaki Sellers bölümünü kopyalayıp çalıştırın (satır 42-85)
```

#### 4. Categories Tablosu
```sql
-- Schema.sql dosyasındaki Categories bölümünü kopyalayıp çalıştırın (satır 87-112)
```

#### 5. Diğer Tablolar
Sırasıyla şu tabloları oluşturun:
- Products (bağımlılık: sellers, categories)
- Product_reviews (bağımlılık: products, users)
- Carts (bağımlılık: users)
- Cart_items (bağımlılık: carts, products)
- Addresses (bağımlılık: users)
- Orders (bağımlılık: users, sellers)
- Order_items (bağımlılık: orders, products)
- Payments (bağımlılık: orders, users)
- Favorites (bağımlılık: users, products)
- Coupons
- Coupon_usage
- Notifications
- Contact_messages
- Newsletter_subscribers
- Site_settings

#### 6. Functions ve Triggers
```sql
-- Schema.sql dosyasındaki Functions & Triggers bölümünü çalıştırın
```

#### 7. Storage Buckets
```sql
-- Schema.sql dosyasındaki Storage Buckets bölümünü çalıştırın
```

## Adım 4: RLS Politikalarını Kontrol Et

Her tablo oluşturulduktan sonra, RLS politikalarının da eklendiğinden emin olun.

## Hızlı Kurulum (Tek Seferde)

Eğer hatasız çalıştırmak isterseniz, `schema.sql` dosyasının tamamını kopyalayıp SQL Editor'e yapıştırın ve **RUN** butonuna basın.

⚠️ **Dikkat:** Eğer tablolar zaten varsa, önce silmeniz gerekebilir:

```sql
-- Tüm tabloları silmek için (DİKKATLİ KULLANIN!)
DROP TABLE IF EXISTS public.coupon_usage CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.sellers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
```

## Adım 5: RLS Sorunlarını Düzelt

### Eksik RLS Politikaları:

#### Products - Admin Erişimi Ekle
```sql
-- Admin'ler tüm ürünleri görebilsin
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin'ler tüm ürünleri yönetebilsin
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Categories - Herkes Görebilsin (is_active kontrolü kaldır)
```sql
-- Mevcut politikayı güncelle
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);
```

#### Orders - Admin Erişimi
```sql
-- Admin'ler tüm siparişleri görebilsin
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin'ler tüm siparişleri güncelleyebilsin
CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Cart Items - Unit Price Otomatik Doldur
```sql
-- Trigger ekle: Cart item eklendiğinde unit_price otomatik doldurulsun
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

CREATE TRIGGER set_cart_item_price_trigger 
  BEFORE INSERT ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION set_cart_item_price();
```

#### Site Settings - Herkes Okuyabilsin
```sql
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

-- Admin'ler güncelleyebilsin
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Adım 6: Test Verileri (Opsiyonel)

### Test Seller Oluştur
```sql
-- Önce bir test kullanıcısı oluşturun (Supabase Auth'dan)
-- Sonra seller ekleyin:

INSERT INTO public.sellers (user_id, store_name, store_slug, description, address, city, district, phone, email, is_approved, is_active)
VALUES (
  'YOUR_USER_ID_HERE',
  'Test Mutfağı',
  'test-mutfagi',
  'En lezzetli ev yemekleri',
  'Test Sokak No:1',
  'İstanbul',
  'Kadıköy',
  '+90 555 123 4567',
  'test@example.com',
  true,
  true
);
```

### Test Ürün Oluştur
```sql
INSERT INTO public.products (
  seller_id, 
  category_id, 
  name, 
  slug, 
  description, 
  price, 
  image_url,
  is_available,
  stock_quantity
)
VALUES (
  (SELECT id FROM public.sellers LIMIT 1),
  (SELECT id FROM public.categories WHERE slug = 'ana-yemekler' LIMIT 1),
  'Karnıyarık',
  'karniyarik',
  'Ev yapımı lezzetli karnıyarık',
  45.00,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  true,
  10
);
```

## Doğrulama

Kurulum tamamlandıktan sonra aşağıdaki sorguları çalıştırarak kontrol edin:

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- RLS aktif mi kontrol et
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Kategorileri kontrol et
SELECT * FROM public.categories;

-- Site ayarlarını kontrol et
SELECT * FROM public.site_settings;
```

## Sorun Giderme

### Hata: "relation does not exist"
- Tabloların doğru sırada oluşturulduğundan emin olun
- Bağımlılıkları kontrol edin

### Hata: "permission denied"
- RLS politikalarını kontrol edin
- Auth kullanıcısının user tablosunda kaydı var mı kontrol edin

### Hata: "duplicate key value"
- Verileri birden fazla kez eklemeye çalışıyor olabilirsiniz
- INSERT yerine INSERT ... ON CONFLICT kullanın

## Tamamlandı! 🎉

Artık Next.js uygulamanız Supabase database'inize bağlanabilir.

Uygulama URL: http://localhost:3000
Supabase URL: https://injbtpuclawegmtibtik.supabase.co
