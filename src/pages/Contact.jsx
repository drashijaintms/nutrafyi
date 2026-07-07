import { useState } from "react";
import { Leaf, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import contactHeroBg from "../assets/contact-hero-bg.png";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <section className="relative bg-[#FAF9F5] min-h-[680px] flex items-center py-20 overflow-hidden">
      {/* Background Image for Right Side (visible on large screens) */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[46%] hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: `url(${contactHeroBg})` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Features */}
          <div className="lg:col-span-6 text-left pr-0 lg:pr-12">
            <span className="text-[#137b3a] font-bold text-[13px] tracking-widest uppercase mb-4 block" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Contact Us
            </span>
            
            <h1 className="font-['Noto_Sans'] text-[36px] lg:text-[45px] font-bold leading-[1.15] text-[#111111] mb-6">
              We're Here to
              <br />
              Support Your Wellness
              <br />
              Journey
            </h1>
            
            <p className="font-['Poppins'] text-[#555555] text-[14.5px] leading-[24px] mb-10 max-w-[480px]">
              Have a question about our products or need help with your order? Our team is here to help you live your best, healthiest life.
            </p>

            {/* Feature List */}
            <div className="space-y-8">
              {/* Friendly Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e8f3ec] flex items-center justify-center text-[#137b3a] shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Poppins'] font-bold text-[15px] text-[#137b3a] mb-1">
                    Friendly Support
                  </h4>
                  <p className="font-['Poppins'] text-[#555555] text-[13px] leading-[18px]">
                    Our team is always ready to assist you.
                  </p>
                </div>
              </div>

              {/* Your Satisfaction Matters */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e8f3ec] flex items-center justify-center text-[#137b3a] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Poppins'] font-bold text-[15px] text-[#137b3a] mb-1">
                    Your Satisfaction Matters
                  </h4>
                  <p className="font-['Poppins'] text-[#555555] text-[13px] leading-[18px]">
                    We're committed to providing the best experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-[#e5e5db]/60 p-8 w-full max-w-[490px] relative">
              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-[#137b3a] mb-4 animate-bounce" />
                  <h3 className="font-['Noto_Sans'] font-bold text-[22px] text-[#111111] mb-2">Message Sent!</h3>
                  <p className="font-['Poppins'] text-[#555555] text-[14px]">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-['Noto_Sans'] text-[24px] font-bold text-[#111111] mb-2">
                    Send Us a Message
                  </h2>
                  <p className="font-['Poppins'] text-[#666666] text-[13.5px] leading-[20px] mb-6">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wide font-['Poppins']">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:border-[#137b3a] focus:ring-1 focus:ring-[#137b3a] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-[#FAF9F5]/40"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wide font-['Poppins']">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:border-[#137b3a] focus:ring-1 focus:ring-[#137b3a] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-[#FAF9F5]/40"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wide font-['Poppins']">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:border-[#137b3a] focus:ring-1 focus:ring-[#137b3a] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-[#FAF9F5]/40"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-2 uppercase tracking-wide font-['Poppins']">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg focus:outline-none focus:border-[#137b3a] focus:ring-1 focus:ring-[#137b3a] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-[#FAF9F5]/40 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#137b3a] hover:bg-[#0f6630] text-white font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer font-['Poppins']"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;