import headingLeaf from "../assets/heading-leaf.png";
import usaMap from "../assets/about/USA-Map.png";
import europeMap from "../assets/about/Europe-Map.png";

function ServingLocations() {
  return (
    <section className="bg-[#0e4a24] overflow-hidden py-8 md:py-12">

      <div className="max-w-[1200px] mx-auto px-4">

        <div className="flex items-center justify-center gap-6 sm:gap-16 md:gap-24">

          {/* USA */}
          <div className="flex-shrink-0">
            <img
              src={usaMap}
              alt="USA"
              className="w-[180px] sm:w-[260px] md:w-[350px] opacity-100 object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center flex-shrink-0">

            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">

              <img
                src={headingLeaf}
                alt=""
                className="w-5 md:w-7 object-contain"
              />

              <span
                className="
                  text-white
                  font-extrabold
                  uppercase
                  text-[16px]
                  sm:text-[22px]
                  md:text-[28px]
                  tracking-wider
                  whitespace-nowrap
                "
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              >
                We Are Serving
              </span>

              <img
                src={headingLeaf}
                alt=""
                className="w-5 md:w-7 object-contain scale-x-[-1]"
              />

            </div>

            <h2
              className="
                text-[#92d050]
                text-[26px]
                sm:text-[38px]
                md:text-[52px]
                font-bold
                tracking-wide
                leading-tight
                whitespace-nowrap
              "
              style={{ fontFamily: "'Kreon', serif" }}
            >
              IN USA and EUROPE
            </h2>

          </div>

          {/* Europe */}
          <div className="flex-shrink-0">
            <img
              src={europeMap}
              alt="Europe"
              className="w-[150px] sm:w-[220px] md:w-[300px] opacity-100 object-contain"
            />
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServingLocations;