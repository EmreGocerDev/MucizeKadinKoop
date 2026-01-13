import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kırıkkale Mucize Kadın Kooperatifi | El Yapımı Lezzetler",
  description: "Kırıkkale Mucize Kadın Kooperatifi'nden taze, sağlıklı ve sevgiyle hazırlanmış el yapımı ürünler. Kooperatifimizden sofranıza.",
  keywords: ["kadın kooperatifi", "el yapımı", "taze ürünler", "kırıkkale", "ev yapımı lezzetler"],
  icons: {
    icon: '/ico.png',
    shortcut: '/ico.png',
    apple: '/ico.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  let initialUser = null;
  let initialCartCount = 0;
  
  if (authUser) {
    // Sadece gerekli alanları seç - daha hızlı sorgu
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, role')
      .eq('id', authUser.id)
      .single();
    
    initialUser = {
      id: authUser.id,
      email: authUser.email || '',
      full_name: profile?.full_name,
      role: profile?.role,
    };
    
    // Get cart count
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', authUser.id)
      .single();
    
    if (cart) {
      const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('cart_id', cart.id);
      
      initialCartCount = count || 0;
    }
  }

  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LayoutWrapper initialUser={initialUser} initialCartCount={initialCartCount}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
