import blogHero from "../assets/blog/blog-hero.jpg";

function BlogHero() {
  return (
    <section className="bg-[#f5f2eb]">
      <div className="">

        <div className="grid lg:grid-cols-[45%_55%] min-h-[420px] items-stretch">

          {/* Left Content */}
          <div className="flex items-center px-8 lg:px-14 py-10 lg:py-0">

            <div>

              <h1
                className="
                  font-['Noto_Sans']
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[45px]
                  font-bold
                  leading-[1.15]
                  text-[#111111]
                  mb-5
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
                  text-[13.5px]
                  sm:text-[14.5px]
                  leading-[22px]
                  max-w-[420px]
                "
              >
                Expert tips, healthy living guides, and nutrition
                insights to help you live your healthiest life,
                naturally.
              </p>

            </div>

          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden min-h-[300px] lg:min-h-0 h-full">

            <img
              src={blogHero}
              alt="Wellness Blog"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                block
              "
            />

            {/* Smooth cream gradient overlay to cover the dark shadow on the left edge of the image */}
            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-24
                bg-gradient-to-r
                from-[#f5f2eb]
                to-transparent
                pointer-events-none
              "
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default BlogHero;