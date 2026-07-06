import blogHero from "../assets/blog/blog-hero.png";

function BlogHero() {
  return (
    <section className="bg-[#f5f2eb]">
      <div className="">

        <div className="grid lg:grid-cols-[45%_55%] min-h-[420px]">

          {/* Left Content */}
          <div className="flex items-center px-8 lg:px-14 py-10 lg:py-0">

            <div>

              <h1
                className="
                  font-['Kreon']
                  text-[36px]
                  sm:text-[44px]
                  md:text-[52px]
                  lg:text-[56px]
                  font-bold
                  leading-[1.1]
                  text-[#111111]
                  mb-5
                "
              >
                Wellness Insights
                <br />
                for a Better You
              </h1>

              <p
                className="
                  font-['Poppins']
                  text-[#333333]
                  text-[14px]
                  sm:text-[15px]
                  leading-[24px]
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

          </div>

        </div>

      </div>
    </section>
  );
}

export default BlogHero;