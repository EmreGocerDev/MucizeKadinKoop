'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface SiteSettings {
  id?: string;
  // İletişim Bilgileri
  contact_address?: string;
  contact_phone1?: string;
  contact_phone2?: string;
  contact_email1?: string;
  contact_email2?: string;
  contact_hours_weekday?: string;
  contact_hours_saturday?: string;
  // Hakkımızda
  about_title?: string;
  about_description?: string;
  about_story?: string;
  // Sosyal Medya
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  
  // İlk satırı al (birden fazla olabilir)
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching site settings:', error);
    // Varsayılan değerler
    return {
      contact_address: 'Kırıkkale Merkez',
      contact_phone1: '+90 (318) 000 00 00',
      contact_phone2: '',
      contact_email1: 'info@mucizekadinkooperatifi.com',
      contact_email2: '',
      contact_hours_weekday: 'Pazartesi - Cuma: 09:00 - 18:00',
      contact_hours_saturday: 'Cumartesi: 10:00 - 14:00',
      about_title: 'Kırıkkale Mucize Kadın Kooperatifi',
      about_description: 'El yapımı ürünlerimizle sizlere hizmet veriyoruz.',
      about_story: 'Kooperatifimiz, kadınların el emeği ürünlerini sizlerle buluşturmak için kurulmuştur.',
    };
  }

  return data[0] || {};
}

export async function updateSiteSettings(settings: SiteSettings) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Yetkisiz erişim' };
  }

  // Admin kontrolü
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Yetkisiz erişim' };
  }

  // Önce mevcut ayarları kontrol et (ilk satır)
  const { data: existingList } = await supabase
    .from('site_settings')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1);

  const existing = existingList && existingList.length > 0 ? existingList[0] : null;

  let error;
  
  if (existing) {
    // Güncelle
    const { error: updateError } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', existing.id);
    error = updateError;
  } else {
    // Yeni oluştur
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert(settings);
    error = insertError;
  }

  if (error) {
    console.error('Settings update error:', error);
    return { error: 'Ayarlar güncellenemedi' };
  }

  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/about');
  revalidatePath('/admin');
  
  return { success: 'Ayarlar güncellendi' };
}
