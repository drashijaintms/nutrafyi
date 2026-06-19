import newsletterIcon from "../assets/newsletter/newsletter-icon.png";
import leafPattern from "../assets/newsletter/newsletter-leaf.png";

function NewsletterSection() {
  return (
    <section className="relative bg-[#eef6ea] overflow-hidden">
      
      {/* Decorative Leaf */}
      <img
        src={leafPattern}
        alt=""
        className="
          absolute
          right-0
          bottom-0
          w-[120px]
          lg:w-[160px]
          opacity-70
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* Left Content */}
          <div className="flex items-start gap-5 max-w-2xl">

            <img
              src={newsletterIcon}
              alt="Newsletter"
              className="w-[60px] lg:w-[70px] flex-shrink-0"
            />

            <div>

              <h2 className="text-[#147a3f] text-[28px] lg:text-[52px] font-bold leading-tight mb-3">
                Join the NutraFYI Wellness Community
              </h2>

              <p className="text-[#333] text-[16px] lg:text-[18px] leading-8">
                Get exclusive wellness tips, product updates,
                healthy lifestyle inspiration, and special offers
                delivered directly to your inbox.
              </p>

            </div>

          </div>

          {/* Form */}
          <div className="w-full lg:w-auto">

            <form className="flex flex-col sm:flex-row gap-4">

              <input
                type="email"
                placeholder="Enter your email address"
                className="
                  w-full
                  lg:w-[420px]
                  h-[60px]
                  px-5
                  rounded-lg
                  border
                  border-[#e1e1e1]
                  bg-white
                  focus:outline-none
                  focus:border-[#147a3f]
                "
              />

              <button
                type="submit"
                className="
                  h-[60px]
                  px-10
                  bg-[#147a3f]
                  hover:bg-[#106933]
                  text-white
                  font-semibold
                  rounded-lg
                  transition
                  whitespace-nowrap
                "
              >
                Get Wellness Updates
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

export default NewsletterSection;