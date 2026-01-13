# Kırıkkale Mucize Kadın Kooperatifi - E-Ticaret Sitesi

El yapımı ürünler için modern e-ticaret platformu.

## 🚀 Teknolojiler

- **Framework:** Next.js 16.1.1 (App Router)
- **Veritabanı:** Supabase (PostgreSQL)
- **Kimlik Doğrulama:** Supabase Auth
- **Stil:** Tailwind CSS
- **Dil:** TypeScript

## 📋 Özellikler

- ✅ Ürün listeleme ve detay sayfaları
- ✅ Kategori bazlı filtreleme
- ✅ Kullanıcı kayıt/giriş sistemi
- ✅ Sepet yönetimi
- ✅ Sipariş sistemi
- ✅ Admin paneli (ürün/kategori/sipariş yönetimi)
- ✅ Responsive tasarım

## 🛠️ Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/KULLANICI_ADINIZ/homemade-food.git
cd homemade-food
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi girin.

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Deploy

### Vercel ile deploy

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub reponuzu bağlayın
3. Ortam değişkenlerini ayarlayın
4. Deploy!

## 👤 Admin Erişimi

Admin paneline `/admin` adresinden erişebilirsiniz. Kullanıcının `role` alanı `admin` olmalıdır.

## 📝 Lisans

MIT License
