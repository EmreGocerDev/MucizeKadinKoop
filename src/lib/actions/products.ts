'use server';

import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

// Cached getCategories - 5 dakika cache
export const getCategories = unstable_cache(
  async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },
  ['categories'],
  { revalidate: 300 }
);

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

export async function getProducts(options?: {
  categoryId?: string;
  limit?: number;
  featured?: boolean;
  search?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true);

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }

  if (options?.featured) {
    query = query.eq('is_featured', true);
  }

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      users (
        full_name
      )
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts() {
  return getProducts({ featured: true, limit: 8 });
}

// Cached getPopularProducts - 5 dakika cache
export const getPopularProducts = unstable_cache(
  async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching popular products:', error);
      return [];
    }

    return data || [];
  },
  ['popular-products'],
  { revalidate: 300 }
);
