import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Kırıkkale Mucize Kadın Kooperatifi"
                width={160}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kırıkkale Mucize Kadın Kooperatifi olarak el yapımı, organik ve taze malzemelerle 
              hazırlanan ürünleri sizlere ulaştırıyoruz.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-orange-500 transition text-sm">
                  Menü
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-500 transition text-sm">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 transition text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-500 transition text-sm">
                  Yönetim Paneli
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-500 transition text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/ana-yemekler" className="hover:text-orange-500 transition text-sm">
                  Ana Yemekler
                </Link>
              </li>
              <li>
                <Link href="/category/corbalar" className="hover:text-orange-500 transition text-sm">
                  Çorbalar
                </Link>
              </li>
              <li>
                <Link href="/category/tatlilar" className="hover:text-orange-500 transition text-sm">
                  Tatlılar
                </Link>
              </li>
              <li>
                <Link href="/category/borekler" className="hover:text-orange-500 transition text-sm">
                  Börekler
                </Link>
              </li>
              <li>
                <Link href="/category/kahvaltiliklar" className="hover:text-orange-500 transition text-sm">
                  Kahvaltılıklar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Kırıkkale, Türkiye</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>+90 (318) 123 45 67</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>info@kirikkalekooperatif.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Kırıkkale Mucize Kadın Kooperatifi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-orange-500 transition">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="hover:text-orange-500 transition">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
