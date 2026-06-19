function AboutBrand({
  brandDescription,
}) {
  return (
    <section className="mt-16">

      <div
        className="
          bg-white
          border
          border-[#e5e5e5]
          rounded-xl
          p-8
        "
      >

        <h2
          className="
            text-[28px]
            font-bold
            uppercase
            mb-6
          "
        >
          About The Brand
        </h2>

        <p
          className="
            text-[#444]
            leading-8
            text-[15px]
          "
        >
          {brandDescription}
        </p>

      </div>

    </section>
  );
}

export default AboutBrand;