import headingLeaf from "../assets/heading-leaf.png";

import sarahImg from "../assets/testimonials/sarah-mitchell.png";
import jamesImg from "../assets/testimonials/james-carter.png";
import emilyImg from "../assets/testimonials/emily-johnson.png";

function Testimonials() {
  const testimonials = [
    {
      image: sarahImg,
      name: "Sarah Mitchell",
      location: "California",
      title: "Amazing Wellness Experience",
      review:
        "The products arrived quickly, and I love the quality. NutraFYI has become part of my daily wellness routine.",
    },
    {
      image: jamesImg,
      name: "James Carter",
      location: "Texas",
      title: "Great for Everyday Health",
      review:
        "I was looking for trusted wellness products and finally found a brand that focuses on quality and simplicity.",
    },
    {
      image: emilyImg,
      name: "Emily Johnson",
      location: "Florida",
      title: "Excellent Customer Support",
      review:
        "The support team was very helpful, and the shopping experience was smooth from start to finish.",
    },
  ];

  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="flex items-center justify-center gap-4 mb-14">

          <img
            src={headingLeaf}
            alt=""
            className="w-10 md:w-14"
          />

          <h2 className="text-[24px] md:text-[36px] lg:text-[42px] font-bold uppercase text-center">
            What Our Customers Say
          </h2>

          <img
            src={headingLeaf}
            alt=""
            className="w-10 md:w-14 scale-x-[-1]"
          />

        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {testimonials.map((item, index) => (
           <div className="relative bg-white border border-[#ddd] rounded-[20px] p-6">

  {/* Quote */}
  <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-[#ddd] flex items-center justify-center">
    <span className="text-[#137b3a] text-[28px] font-bold">”</span>
  </div>

  {/* Main Content */}
  <div className="pl-[90px]">

    <div className="text-[#f4a000] text-[22px] mb-3">
      ★★★★★
    </div>

    <h3 className="text-[18px] font-bold mb-3">
      “{item.title}”
    </h3>

    <p className="text-[16px] leading-8 text-[#222] mb-6">
      “{item.review}”
    </p>

  </div>

  {/* Customer */}
  <div className="flex items-center mt-4">

    <img
      src={item.image}
      alt={item.name}
      className="
        w-[68px]
        h-[68px]
        rounded-lg
        object-cover
      "
    />

    <h4 className="ml-4 text-[#137b3a] text-[18px] font-semibold">
      — {item.name}, {item.location}
    </h4>

  </div>

</div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;