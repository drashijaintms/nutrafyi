import headingLeaf from "../assets/heading-leaf.png";
import usaMap from "../assets/about/USA-Map.png";
import europeMap from "../assets/about/Europe-Map.png";

function ServingLocations() {
  return (
    <section className="bg-[#0e4a24] py-3 md:py-4 overflow-hidden">

      <div className="max-w-[850px] mx-auto px-4">

        <div className="grid grid-cols-3 items-center gap-4">

          {/* USA */}
          <div className="flex justify-center">
            <img
              src={usaMap}
              alt="USA"
              className="w-[120px] md:w-[160px] opacity-100 object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">

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
                  text-[15px]
                  md:text-[19px]
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
                sm:text-[29px]
                md:text-[35px]
                font-bold
                tracking-wide
                leading-tight
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
              className="w-[95px] md:w-[125px] opacity-100 object-contain"
            />
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServingLocations;