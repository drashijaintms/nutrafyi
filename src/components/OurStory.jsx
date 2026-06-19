import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import storyImage from "../assets/about-nutrafyi.png";

function OurStory() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <div>
            <img
              src={storyImage}
              alt="About NutraFYI"
              className="
                w-full
                h-full
                rounded-2xl
                object-cover
              "
            />
          </div>

          {/* Content */}
          <div>

            <h2 className="text-[#147a3f] text-[42px] font-bold mb-6">
              Our Story
            </h2>

            <p className="text-[#444] text-[16px] leading-8 mb-6">
              NutraFYI was founded with a simple mission to make
              high-quality, science-backed wellness products
              accessible to everyone.
            </p>

            <p className="text-[#444] text-[16px] leading-8 mb-6">
              We understand the challenges of maintaining a healthy
              lifestyle in today’s fast-paced world. That's why we create
              premium supplements made with clean, effective ingredients
              you can trust.
            </p>

            <p className="text-[#444] text-[16px] leading-8 mb-8">
              From immunity and energy to beauty and brain health, our
              products are designed to support your well-being at every
              step of your journey.
            </p>

            <Link
              to="/category"
              className="
                inline-flex
                items-center
                gap-2
                bg-[#147a3f]
                hover:bg-[#0f6630]
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
                transition-all
              "
            >
              Know More About Our Products
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OurStory;