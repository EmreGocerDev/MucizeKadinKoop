import { NextResponse } from 'next/server';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

type AuthSyncPayload = {
  event: AuthChangeEvent | 'TOKEN_REFRESH_FAILED';
  session: Session | null;
};

export async function POST(request: Request) {
  let payload: AuthSyncPayload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { event, session } = payload;

  const response = NextResponse.json({ success: true });

  try {
    const requestCookies = parseCookieHeader(request.headers.get('cookie') ?? '')
      .filter((cookie) => typeof cookie.value === 'string')
      .map((cookie) => ({ name: cookie.name, value: cookie.value! }));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return requestCookies;
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_FAILED') {
      await supabase.auth.signOut();
      
      // Clear all auth cookies
      requestCookies
        .filter(cookie => cookie.name.startsWith('sb-'))
        .forEach(cookie => {
          response.cookies.delete(cookie.name);
        });
      
      return response;
    }

    if (!session) {
      return response;
    }

    const { access_token, refresh_token } = session;

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
    }

    // Only set session if we have valid tokens
    if (refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });

      if (error) {
        console.error('[auth/state] setSession error:', error.message);
        // Don't return error, just log it
      }
    }

    return response;
  } catch (error) {
    console.error('[auth/state] sync error', error);
    return NextResponse.json({ error: 'Failed to sync auth state' }, { status: 500 });
  }
}
