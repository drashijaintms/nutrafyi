import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/hero-bg.png)`,
        minHeight: "573px",
      }}
    >

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 min-h-[573px] flex items-center">
        <div className="w-full lg:w-[44%]">

          <h1 className="text-[2.4rem] md:text-[2.8rem] font-bold leading-[1.2] text-[#111] mb-5">
            Feel Your Best<br />
            Every Day with<br />
            Daily Wellness<br />
            Supplements
          </h1>

          <p className="text-[14px] text-gray-600 mb-8 leading-relaxed max-w-[320px]">
            Daily wellness support for a healthier and more
            energized lifestyle, because feeling good should be
            part of every day.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1a6b35] hover:bg-[#155c2c] text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-md"
            >
              <ShoppingCart size={15} />
              Explore Wellness Blog
            </Link>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border border-[#bbb] bg-white/80 hover:bg-white text-[#333] px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
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

export default Hero;