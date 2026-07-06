import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import aboutHero from "../assets/about/about-hero.png";

function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="
          relative
          min-h-[460px]
          md:min-h-[520px]
          lg:min-h-[580px]
          flex
          items-center
        "
      >
        {/* Background Image */}
        <img
          src={aboutHero}
          alt="NutraFYI"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-right
          "
        />

        {/* Content */}
        <div className="relative z-10 max-w-[550px] w-full px-6 md:px-12 lg:px-20 py-16">

          <h1
            className="
              font-['Noto_Sans']
              text-[30px]
              sm:text-[36px]
              md:text-[42px]
              lg:text-[48px]
              font-bold
              leading-[1.15]
              text-[#111111]
              mb-5
            "
          >
            Supporting<br />
            Healthier Living<br />
            Every Day
          </h1>

          <p
            className="
              font-['Poppins']
              text-slate-600
              text-[13.5px]
              sm:text-[14px]
              leading-relaxed
              mb-8
              max-w-[440px]
            "
          >
            At NutraFYI, we believe wellness is not just about supplements—it's about empowering you to live your best life, naturally.
          </p>

          <div className="flex flex-wrap gap-3">

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                gap-2
                bg-[#137b3a]
                hover:bg-[#0f6630]
                text-white
                px-5
                py-3
                rounded-lg
                text-[13px]
                font-semibold
                font-['Poppins']
                transition-all
                duration-200
                shadow-sm
              "
            >
              <ShoppingCart size={15} />
              Explore Product
            </Link>

            <Link
              to="/blog"
              className="
                inline-flex
                items-center
                gap-2
                bg-white/90
                border
                border-slate-300
                hover:border-[#137b3a]
                text-slate-700
                hover:text-slate-900
                px-5
                py-3
                rounded-lg
                text-[13px]
                font-semibold
                font-['Poppins']
                transition-all
                duration-200
              "
            >
              <Heart size={15} className="text-[#137b3a]" />
              Explore Wellness Blog
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutHero;