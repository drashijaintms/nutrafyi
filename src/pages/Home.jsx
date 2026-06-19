// src/pages/Home.jsx

import Hero from "../components/Hero";
import HeroFeatures from "../components/HeroFeatures";
import WellnessCategories from "../components/WellnessCategories";
import BestSellerProducts from "../components/BestSellerProducts";
import AboutSection from "../components/AboutSection";
import Testimonials from "../components/Testimonials";
import BlogSection from "../components/BlogSection";
import NewsletterSection from "../components/NewsletterSection";

function Home() {
  return (
    <>
      <Hero />
      <HeroFeatures />
      <WellnessCategories />
      <BestSellerProducts />
      <AboutSection />
      <Testimonials />
      <BlogSection />
      <NewsletterSection />
    </>
  );
}

export default Home;