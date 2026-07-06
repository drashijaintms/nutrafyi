import blogHero from "../assets/blog/blog-hero.png";

function BlogHero() {
  return (
    <section className="relative w-full bg-[#f5f2eb] overflow-hidden">
      {/* Image that determines the height of the section to keep 100% of the image ratio */}
      <img
        src={blogHero}
        alt="Wellness Insights"
        className="w-full h-auto block min-h-[320px] lg:min-h-0 object-cover lg:object-fill"
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-8 lg:px-14 w-full">
          <div className="max-w-xs sm:max-w-md lg:max-w-xl">
            <h1
              className="
                font-['Noto_Sans']
                text-[20px]
                sm:text-[30px]
                md:text-[38px]
                lg:text-[45px]
                font-bold
                leading-[1.15]
                text-[#111111]
                mb-3
                sm:mb-5
              "
            >
              Wellness Insights for
              <br />
              a Better You
            </h1>

            <p
              className="
                font-['Poppins']
                text-[#333333]
                text-[11px]
                sm:text-[13px]
                md:text-[14px]
                lg:text-[14.5px]
                leading-[16px]
                sm:leading-[22px]
                max-w-[260px]
                sm:max-w-[420px]
                line-clamp-3
                sm:line-clamp-none
              "
            >
              Expert tips, healthy living guides, and nutrition
              insights to help you live your healthiest life,
              naturally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogHero;