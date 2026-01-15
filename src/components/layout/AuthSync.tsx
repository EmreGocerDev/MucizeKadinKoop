'use client';

import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export default function AuthSync() {
  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const syncAuthState = async (event: string, session: Session | null) => {
      try {
        await fetch('/api/auth/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({ event, session }),
        });
      } catch (error) {
        console.error('Failed to sync auth state', error);
      }
    };

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error.message);
          // Clear invalid session
          await supabase.auth.signOut();
          return;
        }
        
        if (session?.user && isMounted) {
          await syncAuthState('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('Failed to init session', error);
      }
    };

    void initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        await syncAuthState(event, session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
