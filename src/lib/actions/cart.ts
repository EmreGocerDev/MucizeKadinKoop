'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: cart } = await supabase
    .from('carts')
    .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          price,
          image_url,
          slug
        )
      )
    `)
    .eq('user_id', user.id)
    .single();

  return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Sepete eklemek için giriş yapmalısınız' };
    }

    // Get or create cart
    let { data: cart, error: cartFetchError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (cartFetchError && cartFetchError.code !== 'PGRST116') {
      console.error('Cart fetch error:', cartFetchError);
      return { error: 'Sepet bilgisi alınamadı' };
    }

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .single();

      if (cartError) {
        console.error('Cart create error:', cartError);
        return { error: 'Sepet oluşturulamadı: ' + cartError.message };
      }
      cart = newCart;
    }

    // Check if product already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) {
        console.error('Cart item update error:', error);
        return { error: 'Ürün güncellenemedi: ' + error.message };
      }
    } else {
    // Ürün fiyatını al
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();

    if (!product) {
      return { error: 'Ürün bulunamadı' };
    }

    // Add new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity,
        unit_price: product.price,
    return removeFromCart(itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  if (error) {
    return { error: 'Güncellenemedi' };
  }

  revalidatePath('/cart');
  return { success: 'Güncellendi' };
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    return { error: 'Silinemedi' };
  }

  revalidatePath('/cart');
  return { success: 'Ürün silindi' };
}

export async function clearCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Oturum bulunamadı' };

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (cart) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);
  }

  revalidatePath('/cart');
  return { success: 'Sepet temizlendi' };
}
