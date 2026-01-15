import { createClient } from '@/lib/supabase/client';

// Helper to get session with timeout
async function getSessionWithTimeout(supabase: ReturnType<typeof createClient>, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    clearTimeout(timeoutId);
    return session;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('Session fetch timed out');
      return null;
    }
    throw error;
  }
}

export async function addToCartClient(productId: string, quantity: number = 1) {
  try {
    const supabase = createClient();
    const session = await getSessionWithTimeout(supabase);

    if (!session?.user) {
      return { error: 'Sepete eklemek için giriş yapmalısınız' };
    }

    const userId = session.user.id;

    // Get or create cart
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

      if (createError) {
        console.error('Cart create error:', createError);
        return { error: 'Sepet oluşturulamadı' };
      }
      cart = newCart;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Update error:', updateError);
        return { error: 'Sepet güncellenemedi' };
      }
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        return { error: 'Ürün sepete eklenemedi' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Add to cart error:', error);
    return { error: 'Bir hata oluştu' };
  }
}

export async function getCartClient() {
  try {
    const supabase = createClient();
    const session = await getSessionWithTimeout(supabase);

    if (!session?.user) return null;

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
      .eq('user_id', session.user.id)
      .single();

    return cart;
  } catch (error) {
    console.error('Get cart error:', error);
    return null;
  }
}

export async function updateCartItemClient(itemId: string, quantity: number) {
  try {
    const supabase = createClient();
    const session = await getSessionWithTimeout(supabase);

    if (!session?.user) {
      return { error: 'Giriş yapmanız gerekiyor' };
    }

    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        return { error: 'Ürün silinemedi' };
      }
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) {
        return { error: 'Miktar güncellenemedi' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Update cart error:', error);
    return { error: 'Bir hata oluştu' };
  }
}

export async function removeFromCartClient(itemId: string) {
  try {
    const supabase = createClient();
    const session = await getSessionWithTimeout(supabase);

    if (!session?.user) {
      return { error: 'Giriş yapmanız gerekiyor' };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      return { error: 'Ürün silinemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Remove from cart error:', error);
    return { error: 'Bir hata oluştu' };
  }
}

export async function getCartCountClient(): Promise<number> {
  try {
    const supabase = createClient();
    const session = await getSessionWithTimeout(supabase);

    if (!session?.user) return 0;

    const { data: cart } = await supabase
      .from('carts')
      .select('cart_items(id)')
      .eq('user_id', session.user.id)
      .single();

    return cart?.cart_items?.length || 0;
  } catch (error) {
    return 0;
  }
}
