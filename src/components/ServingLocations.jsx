import headingLeaf from "../assets/heading-leaf.png";
import usaMap from "../assets/about/USA-Map.png";
import europeMap from "../assets/about/Europe-Map.png";

function ServingLocations() {
  return (
    <section className="bg-[#0e4a24] overflow-hidden">

      <div className="max-w-[850px] mx-auto px-4">

        <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-14">

          {/* USA */}
          <div className="flex-shrink-0">
            <img
              src={usaMap}
              alt="USA"
              className="w-[75px] sm:w-[115px] md:w-[150px] opacity-100 object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center flex-shrink-0">

            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">

              <img
                src={headingLeaf}
                alt=""
                className="w-3.5 md:w-4.5 object-contain"
              />

              <span
                className="
                  text-white
                  font-extrabold
                  uppercase
                  text-[13px]
                  sm:text-[15px]
                  md:text-[19px]
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
                className="w-3.5 md:w-4.5 object-contain scale-x-[-1]"
              />

            </div>

            <h2
              className="
                text-[#92d050]
                text-[20px]
                sm:text-[27px]
                md:text-[35px]
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
              className="w-[60px] sm:w-[90px] md:w-[120px] opacity-100 object-contain"
            />
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServingLocations;