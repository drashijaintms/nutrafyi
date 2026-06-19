import aboutImage from "../assets/about-nutrafyi.png";

function AboutSection() {
  return (
    <section className="py-24 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-wrap items-center">

          {/* Left Image */}
          <div className="w-full lg:w-7/12 mb-10 lg:mb-0">

            <div className="pr-0 lg:pr-8">

              <img
                src={aboutImage}
                alt="About NutraFYI"
                className="
                  w-full
                  rounded-[20px]
                  object-cover
                  shadow-sm
                "
              />

            </div>

          </div>

          {/* Right Content */}
          <div className="w-full lg:w-5/12">

            <span className="text-[#137b3a] text-[18px] font-semibold mb-4 block">
              About NutraFYI
            </span>

            <h2 className="text-[32px] lg:text-[52px] font-bold leading-[1.2] mb-8">
              Your Wellness Partner for Everyday Nutrition
            </h2>

            <div className="space-y-6 text-[#333333] text-[18px] leading-[32px]">

              <p>
                At NutraFYI, we believe wellness starts with consistency,
                balance, and the right nutritional support. Our mission is to
                make healthy living simple, accessible, and effective for people
                who want to feel better, stay active, and support their everyday
                wellness goals.
              </p>

              <p>
                We offer trusted wellness products designed for modern
                lifestyles, busy schedules, and daily health needs. Every
                product is carefully selected with quality, effectiveness, and
                customer satisfaction in mind.
              </p>

              <p>
                At NutraFYI, we're more than a wellness brand; we're your
                partner in building healthier habits and living a healthier,
                more balanced life every day.
              </p>

            </div>

            <div className="mt-10">

              <button
                className="
                  bg-[#137b3a]
                  hover:bg-[#0f6630]
                  text-white
                  font-semibold
                  px-8
                  py-4
                  rounded-lg
                  transition
                  duration-300
                "
              >
                Learn More About Us →
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;