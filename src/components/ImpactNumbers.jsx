import { useState, useEffect } from "react";
import headingLeaf from "../assets/heading-leaf.png";
import iconCustomers from "../assets/about/icon-customers.png";
import iconProducts from "../assets/about/icon-products.png";
import iconCategories from "../assets/about/icon-categories.png";
import iconSatisfaction from "../assets/about/icon-satisfaction.png";

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 1800; // Smooth 1.8 second count-up animation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutQuad) for premium slow-down feel near the end
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function ImpactNumbers() {
  const stats = [
    {
      icon: iconCustomers,
      target: 50,
      suffix: "k+",
      title: "Happy Customers",
    },
    {
      icon: iconProducts,
      target: 100,
      suffix: "+",
      title: "Premium Products",
    },
    {
      icon: iconCategories,
      target: 25,
      suffix: "+",
      title: "Health Categories",
    },
    {
      icon: iconSatisfaction,
      target: 98,
      suffix: "%",
      title: "Customer Satisfaction",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="section-header-container !mb-16">
          <div className="section-header-title-wrap">
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf"
            />
            <h2 className="section-header-title">
              Our Impact In Numbers
            </h2>
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf flipped"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">

          {stats.map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-center
                gap-4
                px-2
              "
            >

              {/* Icon Container */}
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  border
                  border-[#137b3a]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-[28px] h-[28px] object-contain"
                />
              </div>

              {/* Text Block */}
              <div>

                <h3
                  className="
                    text-[#137b3a]
                    text-[28px]
                    md:text-[34px]
                    font-bold
                    leading-none
                    mb-1
                    font-['Poppins']
                  "
                >
                  <AnimatedCounter target={item.target} suffix={item.suffix} />
                </h3>

                <p
                  className="
                    text-[12.5px]
                    md:text-[13.5px]
                    font-semibold
                    text-[#222222]
                    leading-tight
                    font-['Poppins']
                  "
                >
                  {item.title}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default ImpactNumbers;