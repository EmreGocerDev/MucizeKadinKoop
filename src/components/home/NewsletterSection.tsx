'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-500 to-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fırsatları Kaçırmayın!
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            E-bültenimize abone olun, yeni lezzetlerden ve indirimlerden ilk siz haberdar olun.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              <span>Abone Ol</span>
              <Send className="h-5 w-5" />
            </button>
          </form>

          {isSubmitted && (
            <p className="mt-4 text-white font-medium animate-pulse">
              ✓ Başarıyla abone oldunuz!
            </p>
          )}

          <p className="text-orange-200 text-sm mt-6">
            Spam yapmıyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
