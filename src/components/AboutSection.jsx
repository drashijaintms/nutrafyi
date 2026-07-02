import aboutImage from "../assets/about-nutrafyi.png";

function AboutSection() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Image */}
          <div className="w-full lg:col-span-7 flex">
            <div className="w-full pr-0 lg:pr-6 h-full flex">
              <img
                src={aboutImage}
                alt="About NutraFYI"
                className="
                  w-full
                  h-full
                  min-h-[320px]
                  object-cover
                  rounded-[20px]
                  shadow-sm
                  flex-1
                "
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:col-span-5 flex flex-col justify-center">

            <span className="font-['Taviraj'] text-[#137b3a] text-[15px] lg:text-[16px] font-semibold mb-2 block">
              About NutraFYI
            </span>

            <h2 className="font-['Noto_Sans'] text-[24px] lg:text-[34px] font-bold leading-[1.25] mb-4 text-black">
              Your Wellness Partner for Everyday Nutrition
            </h2>

            <div className="space-y-4 text-[#222222] text-[14px] lg:text-[15px] leading-[22px] lg:leading-[24px] font-['Poppins']">

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

            <div className="mt-6">

              <button
                className="
                  font-['Poppins']
                  bg-[#137b3a]
                  hover:bg-[#0f6630]
                  text-white
                  font-semibold
                  text-[13px]
                  px-6
                  py-3
                  rounded-[5px]
                  transition
                  duration-300
                "
              >
                Learn More About Us &gt;
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;