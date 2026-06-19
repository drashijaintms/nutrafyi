import blogHero from "../assets/blog/blog-hero.png";

function BlogHero() {
  return (
    <section className="bg-[#f5f2eb]">
      <div className="">

        <div className="grid lg:grid-cols-[45%_55%] min-h-[420px]">

          {/* Left Content */}
          <div className="flex items-center px-8 lg:px-14">

            <div>

              <h1
                className="
                  text-[48px]
                  lg:text-[60px]
                  font-bold
                  leading-[1.05]
                  text-black
                  mb-8
                "
              >
                Wellness Insights
                <br />
                for a Better You
              </h1>

              <p
                className="
                  text-[#444]
                  text-[18px]
                  leading-10
                  max-w-[360px]
                "
              >
                Expert tips, healthy living guides, and nutrition
                insights to help you live your healthiest life,
                naturally.
              </p>

            </div>

          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden">

            <img
              src={blogHero}
              alt="Wellness Blog"
              className="
                w-full
                h-full
                object-cover
              "
            />

            {/* Blend Into Background */}
            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-64
                bg-gradient-to-r
                from-[#f5f2eb]
                via-[#f5f2eb]/80
                to-transparent
              "
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default BlogHero;