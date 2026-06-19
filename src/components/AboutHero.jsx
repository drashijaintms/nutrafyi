import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import aboutHero from "../assets/about/about-hero.png";

function AboutHero() {
  return (
    <section>
      <div
        className="
          relative
          h-[600px]
          overflow-hidden
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

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white
            via-white/85
            to-transparent
          "
        />

        {/* Content */}
        <div className="relative z-10 max-w-[460px] pl-16">

          <h1
            className="
              text-[48px]
              lg:text-[72px]
              font-bold
              leading-[1.05]
              text-black
              mb-6
            "
          >
            Supporting
            <br />
            Healthier Living
            <br />
            Every Day
          </h1>

          <p
            className="
              text-[#555]
              text-[18px]
              leading-10
              mb-8
            "
          >
            At NutraFYI, wellness is more than supplements.
            It’s about empowering healthier choices and helping
            people live better every day.
          </p>

          <div className="flex flex-wrap gap-4">

            <Link
              to="/category"
              className="
                inline-flex
                items-center
                gap-2
                bg-[#147a3f]
                hover:bg-[#0f6630]
                text-white
                px-8
                py-4
                rounded-lg
                font-semibold
                transition
              "
            >
              <ShoppingCart size={18} />
              Explore Products
            </Link>

            <Link
              to="/blog"
              className="
                inline-flex
                items-center
                gap-2
                bg-white
                border
                border-[#d9d9d9]
                hover:border-[#147a3f]
                text-black
                px-8
                py-4
                rounded-lg
                font-semibold
                transition
              "
            >
              <Heart size={18} />
              Explore Wellness Blog
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutHero;