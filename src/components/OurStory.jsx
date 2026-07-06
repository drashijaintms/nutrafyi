import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import storyImage from "../assets/about-nutrafyi.png";

function OurStory() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

          {/* Image */}
          <div className="min-h-[300px] lg:min-h-0">
            <img
              src={storyImage}
              alt="About NutraFYI"
              className="
                w-full
                h-full
                object-cover
                rounded-3xl
                shadow-sm
              "
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">

            <h2 className="!font-['Taviraj'] text-[#137b3a] text-[32px] md:text-[38px] lg:text-[42px] font-bold mb-6">
              Our Story
            </h2>

            <p className="font-['Poppins'] text-black text-[14.5px] leading-relaxed mb-5">
              NutraFYI was founded with a simple mission to make
              high-quality, science-backed wellness products
              accessible to everyone.
            </p>

            <p className="font-['Poppins'] text-black text-[14.5px] leading-relaxed mb-5">
              We understand the challenges of maintaining a healthy
              lifestyle in today’s fast-paced world. That's why we create
              premium supplements made with clean, effective ingredients
              you can trust.
            </p>

            <p className="font-['Poppins'] text-black text-[14.5px] leading-relaxed mb-8">
              From immunity and energy to beauty and brain health, our
              products are designed to support your well-being at every
              step of your journey.
            </p>

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
              Know More About Our Products
              <ArrowRight size={15} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OurStory;