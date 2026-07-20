import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import headingLeaf from "../assets/heading-leaf.png";

import sarahImg from "../assets/testimonials/sarah-mitchell.png";
import jamesImg from "../assets/testimonials/james-carter.png";
import emilyImg from "../assets/testimonials/emily-johnson.png";
import michaelImg from "../assets/testimonials/michael-brown.png";

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
    {
      image: michaelImg,
      name: "Michael Brown",
      location: "Illinois",
      title: "Highly Recommend!",
      review:
        "The supplements are pure and highly effective. I've noticed a significant boost in my energy levels within a week.",
    },
  ];

  // Rotate list to support infinite loop carousel
  const [list, setList] = useState(testimonials);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else {
        setVisibleCards(2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setIsTransitioning(true);
    setTranslateX(-(100 / visibleCards));

    setTimeout(() => {
      setList((prev) => {
        const nextList = [...prev];
        const first = nextList.shift();
        nextList.push(first);
        return nextList;
      });
      setIsTransitioning(false);
      setTranslateX(0);
      setAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setIsTransitioning(false);
    setTranslateX(-(100 / visibleCards));

    setList((prev) => {
      const nextList = [...prev];
      const last = nextList.pop();
      nextList.unshift(last);
      return nextList;
    });

    setTimeout(() => {
      setIsTransitioning(true);
      setTranslateX(0);
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 50);
  };

  // Automatically crawl/play every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [animating, visibleCards]);

  return (
    <section className="py-20 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="section-header-container mb-12">
          <div className="section-header-title-wrap">
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf"
            />
            <h2 className="section-header-title">
              What Our Customers Say
            </h2>
            <img
              src={headingLeaf}
              alt=""
              className="section-header-leaf flipped"
            />
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative px-0 md:px-8">
          <div className="overflow-hidden">
            {/* Sliding Track */}
            <div
              className="flex gap-6 select-none"
              style={{
                transform: `translate3d(${translateX}%, 0, 0)`,
                transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
              }}
            >
              {list.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="
                    bg-white
                    border
                    border-[#e5e5db]/60
                    rounded-[28px]
                    shadow-[0_10px_35px_rgba(0,0,0,0.03)]
                    relative
                    flex
                    w-full
                    md:w-[calc(50%-12px)]
                    lg:w-[calc(50%-12px)]
                    flex-shrink-0
                    items-stretch
                    text-left
                    min-h-[220px]
                    overflow-hidden
                  "
                >
                  {/* Left Cover Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-[150px]
                      sm:w-[170px]
                      object-cover
                      flex-shrink-0
                    "
                  />

                  {/* Right Details */}
                  <div className="flex-1 flex flex-col justify-center p-6 min-w-0 pr-10">
                    <div className="text-[#f4a000] text-[15px] leading-none mb-1.5 flex gap-0.5">
                      {"★".repeat(5)}
                    </div>

                    <h3 className="font-['Noto_Sans'] font-bold text-[16px] text-black mb-1.5 leading-tight">
                      “{item.title}”
                    </h3>

                    <p className="font-['Poppins'] text-[13.5px] leading-[20px] text-[#333333] mb-2.5 whitespace-normal">
                      “{item.review}”
                    </p>

                    <span className="font-['Poppins'] text-[13px] font-semibold text-[#137b3a]">
                      — {item.name}, {item.location}
                    </span>
                  </div>

                  {/* Quote Circle Icon (Top-Right) */}
                  <div className="absolute top-5 right-5 w-[36px] h-[36px] rounded-full border border-[#e5e5db]/50 bg-white flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <span className="text-[#137b3a] text-[24px] font-bold leading-none">”</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              -translate-x-1/2
              z-20
              w-10
              h-10
              bg-white
              border
              border-[#e5e5db]
              rounded-full
              flex
              items-center
              justify-center
              shadow-sm
              hover:bg-slate-50
              hover:scale-105
              transition-all
              hidden
              md:flex
            "
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 text-[#137b3a]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              translate-x-1/2
              z-20
              w-10
              h-10
              bg-white
              border
              border-[#e5e5db]
              rounded-full
              flex
              items-center
              justify-center
              shadow-sm
              hover:bg-slate-50
              hover:scale-105
              transition-all
              hidden
              md:flex
            "
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 text-[#137b3a]" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;