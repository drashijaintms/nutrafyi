import { useState } from "react";
import axios from "axios";
import newsletterIcon from "../assets/newsletter/newsletter-icon.png";
import leafPattern from "../assets/newsletter/newsletter-leaf.png";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post("/api/newsletter/subscribe", { email });
      setStatus({ type: "success", message: res.data.message });
      setEmail("");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to subscribe. Please try again.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#eef6ea] overflow-hidden">
      
      {/* Decorative Leaf */}
      <img
        src={leafPattern}
        alt=""
        className="
          absolute
          right-[-30px]
          bottom-[-30px]
          w-[100px]
          lg:w-[130px]
          opacity-75
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-9">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left Content */}
          <div className="flex items-center gap-4 lg:max-w-3xl">

            <img
              src={newsletterIcon}
              alt="Newsletter"
              className="w-[50px] lg:w-[56px] flex-shrink-0"
            />

            <div>

              <h2 className="font-['Noto_Sans'] text-[#137b3a] text-[18px] lg:text-[22px] font-bold leading-tight mb-1">
                Join the NutraFYI Wellness Community
              </h2>

              <p className="font-['Poppins'] text-[#4a4a4a] text-[12.5px] lg:text-[13px] leading-relaxed max-w-[580px]">
                Get exclusive wellness tips, product updates, healthy lifestyle
                inspiration, and special offers delivered directly to your inbox.
              </p>

            </div>

          </div>

          {/* Form */}
          <div className="w-full lg:w-auto">

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="
                  w-full
                  lg:w-[320px]
                  h-[48px]
                  px-4
                  rounded-lg
                  border
                  border-[#e1e1e1]
                  bg-white
                  text-[13px]
                  font-['Poppins']
                  focus:outline-none
                  focus:border-[#137b3a]
                "
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  h-[48px]
                  px-7
                  bg-[#137b3a]
                  hover:bg-[#0f6630]
                  text-white
                  font-semibold
                  text-[13px]
                  font-['Poppins']
                  rounded-lg
                  transition
                  whitespace-nowrap
                  disabled:opacity-50
                "
              >
                {loading ? "Subscribing..." : "Get Wellness Updates"}
              </button>

            </form>

            {status.message && (
              <p className={`mt-2 text-xs font-semibold font-['Poppins'] ${status.type === "success" ? "text-emerald-700" : "text-rose-600"}`}>
                {status.message}
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default NewsletterSection;