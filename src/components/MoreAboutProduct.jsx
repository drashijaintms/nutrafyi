function MoreAboutProduct({
  moreAbout,
}) {
  return (
    <section className="mt-16">

      <h2
        className="
          text-[28px]
          font-bold
          uppercase
          mb-6
        "
      >
        More About The Product
      </h2>

      <div
        className="
          border
          border-[#e5e5e5]
          rounded-xl
          p-8
          bg-white
        "
      >

        <p className="leading-8 text-[#444]">
          {moreAbout}
        </p>

      </div>

    </section>
  );
}

export default MoreAboutProduct;