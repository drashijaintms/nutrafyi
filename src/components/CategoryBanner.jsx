import bannerImage from "../assets/category-banner.png";
import leafPattern from "../assets/leaf-banner.png";

function CategoryBanner() {
  return (
    <>
      {/* Banner */}
      <section
        className="relative h-[360px] lg:h-[420px] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      >
        {/* Left Leaf */}
        <img
          src={leafPattern}
          alt=""
          className="
            absolute
            left-0
            bottom-0
            w-[110px]
            opacity-80
          "
        />

        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">

          <div className="max-w-[520px]">

            <h1 className="text-[42px] lg:text-[58px] font-bold leading-tight text-black mb-6">
              Shop by Categories
            </h1>

            <p className="text-[18px] leading-10 text-[#222]">
              Explore our wide range of wellness products designed
              to support your healthy lifestyle.
            </p>

          </div>

        </div>
      </section>
    </>
  );
}

export default CategoryBanner;