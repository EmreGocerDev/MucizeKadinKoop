'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testAuth();
  }, []);

  const testAuth = async () => {
    try {
      const supabase = createClient();
      
      setStatus('Checking Supabase connection...');
      
      // Test 1: Check if client is created
      if (!supabase) {
        setError('Supabase client creation failed');
        return;
      }
      
      setStatus('Supabase client created ✓');
      
      // Wait a bit to avoid race conditions
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Test 2: Check auth session first (more reliable)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setError('Session error: ' + sessionError.message);
        setStatus('Session check failed ✗');
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        setStatus('User authenticated via session ✓');
        return;
      }
      
      // Test 3: Try getUser if session doesn't work
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }
        
        if (user) {
          setUser(user);
          setStatus('User authenticated via getUser ✓');
        } else {
          setStatus('No user logged in (this is OK)');
        }
      } catch (getUserError: any) {
        if (getUserError.message?.includes('aborted')) {
          setStatus('Auth check aborted, but session is valid: ' + (session ? 'logged in' : 'not logged in'));
        } else {
          throw getUserError;
        }
      }
      
    } catch (err: any) {
      if (err.message?.includes('aborted')) {
        setError('Request was aborted (Next.js issue)');
        setStatus('Aborted but may still work ⚠️');
      } else {
        setError('Test error: ' + err.message);
        setStatus('Test failed ✗');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Status:</h2>
            <p className="text-gray-700">{status}</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
          
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">User Data:</h3>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Link 
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Go to Login
            </Link>
            <Link 
              href="/account"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Go to Account
            </Link>
            <Link 
              href="/"
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Go Home
            </Link>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <div className="text-sm space-y-1">
              <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
              <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
