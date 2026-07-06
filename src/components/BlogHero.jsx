import blogHero from "../assets/blog/blog-hero.png";

function BlogHero() {
  return (
    <section 
      className="relative w-full bg-[#f5f2eb] bg-cover bg-[position:75%_center] lg:bg-center bg-no-repeat min-h-[380px] md:min-h-[420px] lg:min-h-[460px] flex items-center"
      style={{ backgroundImage: `url(${blogHero})` }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-14 w-full py-12 md:py-16">
        <div className="max-w-lg lg:max-w-xl bg-[#f5f2eb]/90 sm:bg-transparent p-6 sm:p-0 rounded-2xl">
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
    </section>
  );
}

export default BlogHero;