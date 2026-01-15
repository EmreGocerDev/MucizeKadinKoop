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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await syncAuthState('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('Failed to init session', error);
      }
    };

    void initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      void syncAuthState(event, session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
