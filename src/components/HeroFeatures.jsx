import trustedIcon from "../assets/herofeatures/trusted-wellness-solutions.png";
import scienceIcon from "../assets/herofeatures/science-backed-formulas.png";
import premiumIcon from "../assets/herofeatures/premium-quality-ingredients.png";
import shippingIcon from "../assets/herofeatures/fast-and-secure-shipping.png";

function HeroFeatures() {
  const features = [
    {
      icon: trustedIcon,
      title: "Trusted Wellness",
      subtitle: "Solutions",
    },
    {
      icon: scienceIcon,
      title: "Science-Backed",
      subtitle: "Formulas",
    },
    {
      icon: premiumIcon,
      title: "Premium Quality",
      subtitle: "Ingredients",
    },
    {
      icon: shippingIcon,
      title: "Fast & Secure",
      subtitle: "Shipping",
    },
  ];

  return (
    <section className="relative z-20 -mt-10">
      <div className="max-w-6xl mx-auto px-4">

        <div className="bg-white rounded-[24px] border border-[#d9d9d9] shadow-sm overflow-hidden">

          <div className="flex flex-wrap">

            {features.map((item, index) => (
              <div
                key={index}
                className={`w-full md:w-1/2 lg:w-1/4 flex items-center px-8 py-7 ${
                  index !== features.length - 1
                    ? "lg:border-r border-[#d9d9d9]"
                    : ""
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 object-contain mr-4"
                />

                <div>
                  <h3 className="text-[18px] font-semibold leading-[24px] text-[#1a1a1a]">
                    {item.title}
                  </h3>

                  <p className="text-[18px] font-semibold leading-[24px] text-[#1a1a1a]">
                    {item.subtitle}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroFeatures;