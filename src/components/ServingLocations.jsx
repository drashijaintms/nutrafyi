import headingLeaf from "../assets/heading-leaf.png";
import usaMap from "../assets/about/USA-Map.png";
import europeMap from "../assets/about/Europe-Map.png";

function ServingLocations() {
  return (
    <section className="bg-[#07652c]">

      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-3 items-center">

          {/* USA */}
          <div className="flex justify-center">
            <img
              src={usaMap}
              alt="USA"
              className="w-[140px] opacity-100"
            />
          </div>

          {/* Center Content */}
          <div className="text-center">

            <div className="flex items-center justify-center gap-2 mb-1">

              <img
                src={headingLeaf}
                alt=""
                className="w-6"
              />

              <span
                className="
                  text-white
                  font-bold
                  uppercase
                  text-[24px]
                "
              >
                We Are Serving
              </span>

              <img
                src={headingLeaf}
                alt=""
                className="w-6 scale-x-[-1]"
              />

            </div>

            <h2
              className="
                text-[#9fd14f]
                text-[38px]
                font-bold
              "
            >
              IN USA and EUROPE
            </h2>

          </div>

          {/* Europe */}
          <div className="flex justify-center">
            <img
              src={europeMap}
              alt="Europe"
              className="w-[120px] opacity-100"
            />
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServingLocations;