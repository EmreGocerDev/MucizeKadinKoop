import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import PopularProducts from "@/components/home/PopularProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import TopRatedProducts from "@/components/home/TopRatedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <PopularProducts />
      <FeaturesSection />
      <TopRatedProducts />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
