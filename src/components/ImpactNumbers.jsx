import headingLeaf from "../assets/heading-leaf.png";
import {
  Users,
  ShieldCheck,
  HeartPulse,
  BadgePercent,
} from "lucide-react";

function ImpactNumbers() {
  const stats = [
    {
      icon: Users,
      value: "50k+",
      title: "Happy Customers",
    },
    {
      icon: ShieldCheck,
      value: "100+",
      title: "Premium Products",
    },
    {
      icon: HeartPulse,
      value: "25+",
      title: "Health Categories",
    },
    {
      icon: BadgePercent,
      value: "98%",
      title: "Customer Satisfaction",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="section-header-container mb-10">
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-center
                  gap-4
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    rounded-xl
                    border
                    border-[#147a3f]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    size={28}
                    className="text-[#147a3f]"
                  />
                </div>

                <div>

                  <h3
                    className="
                      text-[#147a3f]
                      text-[38px]
                      font-bold
                      leading-none
                    "
                  >
                    {item.value}
                  </h3>

                  <p
                    className="
                      text-[16px]
                      font-semibold
                      text-[#222]
                    "
                  >
                    {item.title}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default ImpactNumbers;