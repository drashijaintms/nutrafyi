import headingLeaf from "../assets/heading-leaf.png";
import usaMap from "../assets/about/USA-Map.png";
import europeMap from "../assets/about/Europe-Map.png";

function ServingLocations() {
  return (
    <section className="bg-[#0e4a24] py-8 md:py-12 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-3 items-center gap-4">

          {/* USA */}
          <div className="flex justify-center">
            <img
              src={usaMap}
              alt="USA"
              className="w-[110px] md:w-[140px] opacity-100 object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5">

              <img
                src={headingLeaf}
                alt=""
                className="w-4 md:w-5 object-contain"
              />

              <span
                className="
                  text-white
                  font-extrabold
                  uppercase
                  text-[14px]
                  md:text-[18px]
                  tracking-wider
                "
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              >
                We Are Serving
              </span>

              <img
                src={headingLeaf}
                alt=""
                className="w-4 md:w-5 object-contain scale-x-[-1]"
              />

            </div>

            <h2
              className="
                text-[#92d050]
                text-[24px]
                sm:text-[28px]
                md:text-[36px]
                font-bold
                tracking-wide
              "
              style={{ fontFamily: "'Kreon', serif" }}
            >
              IN USA and EUROPE
            </h2>

          </div>

          {/* Europe */}
          <div className="flex justify-center">
            <img
              src={europeMap}
              alt="Europe"
              className="w-[90px] md:w-[120px] opacity-100 object-contain"
            />
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServingLocations;