import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

function AboutHero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/hero-bg.png?v=2)`,
        minHeight: "450px",
        imageRendering: "-webkit-optimize-contrast",
      }}
    >
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 min-h-[450px] flex items-center">
        <div className="w-full lg:w-[58%]">

          <h1 className="text-[2.4rem] md:text-[3.4rem] font-bold leading-[1.2] text-[#111] mb-5 tracking-tight">
            Supporting Healthier Living Every Day
          </h1>

          <p className="text-[15px] md:text-[17px] text-gray-600 mb-8 leading-relaxed max-w-[520px]">
            At NutraFYI, we believe wellness is not just about supplements—it's about empowering you to live your best life, naturally.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1a6b35] hover:bg-[#155c2c] text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg"
            >
              <ShoppingCart size={15} />
              Explore Product
            </Link>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border border-[#bbb] bg-white/80 hover:bg-white text-[#333] px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg"
            >
              <Heart size={15} className="text-[#1a6b35]" />
              Explore Wellness Blog
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutHero;