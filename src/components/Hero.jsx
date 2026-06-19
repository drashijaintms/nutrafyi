import heroBg from "../assets/index-hero.png";

function Hero() {
  return (
    <section
      className="relative min-h-[750px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      {/* Light overlay for text readability */}
      <div className="absolute inset-0 bg-white/15"></div>

      <div className="relative max-w-7xl mx-auto px-6">
  <div className="min-h-[750px] flex items-center">

    <div className="w-full lg:w-5/12">

      <h1 className="text-6xl font-bold leading-tight text-black mb-8">
        Feel Your Best Every Day with Daily Wellness Supplements
      </h1>

      <p className="text-lg text-gray-800 mb-10 leading-8">
        Daily wellness support for a healthier and more energized
        lifestyle, because feeling good should be part of every day.
      </p>

      <div className="flex gap-4">

        <button className="bg-[#147a3f] hover:bg-[#116a37] text-white px-8 py-4 rounded-lg font-medium transition">
          Explore Wellness Blog
        </button>

        <button className="bg-white border border-gray-300 text-[#147a3f] px-8 py-4 rounded-lg font-medium">
          Learn More
        </button>

      </div>

    </div>

  </div>
</div>
    </section>
  );
}

export default Hero;