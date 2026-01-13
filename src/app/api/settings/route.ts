import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    // Varsayılan değerler
    return NextResponse.json({
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
    });
  }

  return NextResponse.json(data);
}
