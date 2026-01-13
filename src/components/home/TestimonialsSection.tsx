import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Mantılar harikaydı! Annemin yaptığından bile güzel. Kesinlikle tekrar sipariş vereceğim.',
    product: 'Ev Yapımı Mantı'
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Kahvaltı seti muhteşemdi. Her şey taptaze ve lezzetliydi. Reçeller özellikle çok güzeldi.',
    product: 'Serpme Kahvaltı Seti'
  },
  {
    id: 3,
    name: 'Fatma Demir',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Cheesecake hayatımda yediğim en güzel cheesecakedı. Teslimat da çok hızlıydı.',
    product: 'San Sebastian Cheesecake'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini okuyun.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-orange-200" />
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {testimonial.comment}
              </p>

              {/* Product */}
              <p className="text-sm text-orange-600 font-medium mb-4">
                {testimonial.product}
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">Doğrulanmış Müşteri</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
