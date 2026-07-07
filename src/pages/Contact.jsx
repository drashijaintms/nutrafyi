import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ShieldCheck, Send, CheckCircle2, Headset, Package, MapPin, Clock, Mail, Phone, ChevronDown, ChevronRight } from "lucide-react";
import contactHeroBg from "../assets/contact-hero-bg.png";
import contactCtaPlants from "../assets/contact-cta-plants.png";
import headingLeaf from "../assets/heading-leaf.png";
import newsletterLeaf from "../assets/newsletter/newsletter-leaf.png";
import NewsletterSection from "../components/NewsletterSection";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null); // Only one FAQ open at a time

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  const faqData = [
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can use it to track your package in real time."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all unopened products. Simply reach out to our customer support team to initiate a return."
    },
    {
      question: "Are your products safe?",
      answer: "Yes, all our products are manufactured in FDA-registered, GMP-certified facilities and undergo third-party testing to ensure purity and potency."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship to select countries worldwide. Shipping rates and delivery times will be calculated at checkout based on your location."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our support team via email at support@nutrafyi.com, call us at (888) 123-4567, or use the message form on this page."
    },
    {
      question: "Where are your products manufactured?",
      answer: "Our premium supplements are formulated and manufactured in state-of-the-art facilities in the United States using high-quality global ingredients."
    }
  ];

  return (
    <div className="w-full">
      {/* SECTION 1: HERO & FORM */}
      <section className="relative bg-[#FAF9F5] min-h-[700px] flex items-center py-20 lg:py-24 overflow-hidden border-b border-[#e5e5db]/40">
        {/* Background Image for Right Side with seamless left fade */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block bg-cover bg-center"
          style={{ backgroundImage: `url(${contactHeroBg})` }}
        >
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF9F5] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & Features */}
            <div className="lg:col-span-6 text-left pr-0 lg:pr-12">
              <span 
                className="text-[#137b3a] font-bold text-[13px] tracking-widest uppercase mb-4 block"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Us
              </span>
              
              <h1 
                className="text-[#0a3d24] font-bold text-[36px] lg:text-[46px] leading-[1.15] mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                We're Here to
                <br />
                Support Your Wellness
                <br />
                Journey
              </h1>
              
              <p 
                className="text-[#333333] text-[15px] leading-[24px] mb-10 max-w-[480px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Have a question about our products or need help with your order? Our team is here to help you live your best, healthiest life.
              </p>

              {/* Feature List */}
              <div className="space-y-8">
                {/* Friendly Support */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#137b3a] shrink-0 border border-[#e5ecd9]/30">
                    <Leaf className="w-5 h-5 text-[#0a3d24]" />
                  </div>
                  <div>
                    <h4 
                      className="font-bold text-[16px] text-[#0a3d24] mb-1"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Friendly Support
                    </h4>
                    <p 
                      className="text-[#555555] text-[13px] leading-[18px]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Our team is always ready to assist you.
                    </p>
                  </div>
                </div>

                {/* Your Satisfaction Matters */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#137b3a] shrink-0 border border-[#e5ecd9]/30">
                    <ShieldCheck className="w-5 h-5 text-[#0a3d24]" />
                  </div>
                  <div>
                    <h4 
                      className="font-bold text-[16px] text-[#0a3d24] mb-1"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Your Satisfaction Matters
                    </h4>
                    <p 
                      className="text-[#555555] text-[13px] leading-[18px]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      We're committed to providing the best experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.035)] border border-[#e5e5db]/60 p-8 w-full max-w-[490px] relative">
                {submitted ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-[#0a3d24] mb-4 animate-bounce" />
                    <h3 
                      className="font-bold text-[22px] text-[#0a3d24] mb-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Message Sent!
                    </h3>
                    <p 
                      className="text-[#555555] text-[14px]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Thank you for reaching out. We will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 
                      className="text-[24px] font-bold text-[#0a3d24] mb-1.5"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Send Us a Message
                    </h2>
                    <p 
                      className="text-slate-500 text-[13px] leading-[18px] mb-6"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label 
                          className="block text-[11px] font-bold text-[#111111] mb-1.5 uppercase tracking-wider"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full px-4 py-2.5 border border-[#e5e5db] rounded-lg focus:outline-none focus:border-[#0a3d24] focus:ring-1 focus:ring-[#0a3d24] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-white"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label 
                          className="block text-[11px] font-bold text-[#111111] mb-1.5 uppercase tracking-wider"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2.5 border border-[#e5e5db] rounded-lg focus:outline-none focus:border-[#0a3d24] focus:ring-1 focus:ring-[#0a3d24] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-white"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label 
                          className="block text-[11px] font-bold text-[#111111] mb-1.5 uppercase tracking-wider"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          className="w-full px-4 py-2.5 border border-[#e5e5db] rounded-lg focus:outline-none focus:border-[#0a3d24] focus:ring-1 focus:ring-[#0a3d24] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-white"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label 
                          className="block text-[11px] font-bold text-[#111111] mb-1.5 uppercase tracking-wider"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Message
                        </label>
                        <textarea
                          name="message"
                          required
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Type your message here..."
                          className="w-full px-4 py-2.5 border border-[#e5e5db] rounded-lg focus:outline-none focus:border-[#0a3d24] focus:ring-1 focus:ring-[#0a3d24] text-sm text-[#333333] placeholder-slate-400 font-['Poppins'] bg-white resize-none"
                        />
                      </div>

                      {/* Submit Button - Left Aligned */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-auto px-6 py-3 bg-[#0a3d24] hover:bg-[#062616] text-white font-bold rounded-lg text-[13.5px] transition flex items-center justify-center gap-2 cursor-pointer font-['Poppins'] shadow-xs"
                        >
                          <span>Send Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: GET IN TOUCH */}
      <section className="bg-white py-20 lg:py-24 border-b border-[#e5e5db]/40">
        <div className="max-w-7xl mx-auto px-4 w-full">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-3 select-none">
              <img src={headingLeaf} alt="leaf left" className="w-6 h-6 object-contain scale-x-[-1] opacity-90" />
              <h2 
                className="text-[#0a3d24] font-bold text-[28px] lg:text-[34px] tracking-wide"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Get in Touch
              </h2>
              <img src={headingLeaf} alt="leaf right" className="w-6 h-6 object-contain opacity-90" />
            </div>
            <p 
              className="text-slate-500 text-[14.5px] leading-[22px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Choose the best way to reach us. We're here to help!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Customer Support */}
            <div className="bg-white border border-[#e5e5db]/60 rounded-[20px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-md hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#0a3d24] mb-6 shrink-0">
                <Headset className="w-6 h-6" />
              </div>
              <h3 
                className="text-[#0a3d24] font-bold text-[17px] mb-3.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Customer Support
              </h3>
              <p 
                className="text-slate-500 text-[13px] leading-[20px] mb-6 flex-1 max-w-[210px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                We're here to assist with your orders, products, and more.
              </p>
              
              <div 
                className="w-full flex flex-col items-center gap-2.5 pt-4 border-t border-slate-100"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <a href="mailto:support@nutrafyi.com" className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#137b3a] transition w-fit">
                  <Mail className="w-3.5 h-3.5 text-[#0a3d24]" />
                  <span>support@nutrafyi.com</span>
                </a>
                <a href="tel:8881234567" className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#137b3a] transition w-fit">
                  <Phone className="w-3.5 h-3.5 text-[#0a3d24]" />
                  <span>(888) 123-4567</span>
                </a>
              </div>
            </div>

            {/* Card 2: Order Inquiries */}
            <div className="bg-white border border-[#e5e5db]/60 rounded-[20px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-md hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#0a3d24] mb-6 shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <h3 
                className="text-[#0a3d24] font-bold text-[17px] mb-3.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Order Inquiries
              </h3>
              <p 
                className="text-slate-500 text-[13px] leading-[20px] mb-6 flex-1 max-w-[210px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Questions about your order or shipping? Reach out!
              </p>
              
              <div 
                className="w-full flex flex-col items-center gap-2.5 pt-4 border-t border-slate-100"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <a href="mailto:orders@nutrafyi.com" className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#137b3a] transition w-fit">
                  <Mail className="w-3.5 h-3.5 text-[#0a3d24]" />
                  <span>orders@nutrafyi.com</span>
                </a>
                <a href="tel:8889876543" className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#137b3a] transition w-fit">
                  <Phone className="w-3.5 h-3.5 text-[#0a3d24]" />
                  <span>(888) 987-6543</span>
                </a>
              </div>
            </div>

            {/* Card 3: Our Location */}
            <div className="bg-white border border-[#e5e5db]/60 rounded-[20px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-md hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#0a3d24] mb-6 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 
                className="text-[#0a3d24] font-bold text-[17px] mb-3.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Our Location
              </h3>
              <p 
                className="text-slate-500 text-[13px] leading-[20px] mb-6 flex-1 max-w-[210px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Visit us or send us mail at our headquarters.
              </p>
              
              <div 
                className="w-full flex flex-col items-center gap-1 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 leading-[18px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span>123 Wellness Way,</span>
                <span>Healthyville, CA 90210, USA</span>
              </div>
            </div>

            {/* Card 4: Business Hours */}
            <div className="bg-white border border-[#e5e5db]/60 rounded-[20px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-md hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-full bg-[#f0f4ef] flex items-center justify-center text-[#0a3d24] mb-6 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <h3 
                className="text-[#0a3d24] font-bold text-[17px] mb-3.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Business Hours
              </h3>
              <p 
                className="text-slate-500 text-[13px] leading-[20px] mb-6 flex-1 max-w-[210px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                We're available to help during the following hours.
              </p>
              
              <div 
                className="w-full flex flex-col items-center gap-1.5 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 leading-[18px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span>Mon – Fri: 9:00 AM – 6:00 PM</span>
                <span>Sat – Sun: 10:00 AM – 4:00 PM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-[#FAF9F5] py-20 lg:py-24 border-b border-[#e5e5db]/40">
        <div className="max-w-7xl mx-auto px-4 w-full">
          
          {/* Header */}
          <div className="relative mb-12 flex flex-col items-center">
            {/* Centered Heading & Subtitle */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3 select-none">
                <img src={headingLeaf} alt="leaf left" className="w-6 h-6 object-contain scale-x-[-1] opacity-90" />
                <h2 
                  className="text-[#0a3d24] font-bold text-[28px] lg:text-[34px] tracking-wide"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Frequently Asked Questions
                </h2>
                <img src={headingLeaf} alt="leaf right" className="w-6 h-6 object-contain opacity-90" />
              </div>
              <p 
                className="text-slate-500 text-[14.5px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Find quick answers to the most common questions.
              </p>
            </div>

            {/* View All Link (Positioned on the right for md screens, centered on mobile) */}
            <div className="mt-4 md:mt-0 md:absolute md:right-0 md:bottom-2">
              <Link 
                to="/faq" 
                className="inline-flex items-center gap-1 text-xs font-bold text-[#137b3a] hover:text-[#0f6630] uppercase tracking-wider transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                View All FAQs →
              </Link>
            </div>
          </div>

          {/* FAQ Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: FAQs 0, 1, 2 */}
            <div className="space-y-4">
              {faqData.slice(0, 3).map((item, idx) => {
                const globalIdx = idx;
                const isOpen = activeFaq === globalIdx;
                return (
                  <div 
                    key={globalIdx}
                    className="bg-white border border-[#e5e5db]/60 rounded-xl overflow-hidden shadow-[0_3px_15px_rgba(0,0,0,0.01)] transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(globalIdx)}
                      className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left focus:outline-none"
                    >
                      <span 
                        className="text-[#0a3d24] font-bold text-[14.5px] leading-snug"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform duration-300 ease-in-out"
                        style={{
                          color: isOpen ? "#0a3d24" : "#94a3b8",
                          transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                      />
                    </button>
                    
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.32s ease",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <div
                          className="px-6 pb-5 pt-1 border-t border-slate-100/80"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: "opacity 0.25s ease",
                          }}
                        >
                          <p 
                            className="text-[#555555] text-[13px] leading-[20px] font-normal"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: FAQs 3, 4, 5 */}
            <div className="space-y-4">
              {faqData.slice(3, 6).map((item, idx) => {
                const globalIdx = idx + 3;
                const isOpen = activeFaq === globalIdx;
                return (
                  <div 
                    key={globalIdx}
                    className="bg-white border border-[#e5e5db]/60 rounded-xl overflow-hidden shadow-[0_3px_15px_rgba(0,0,0,0.01)] transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(globalIdx)}
                      className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left focus:outline-none"
                    >
                      <span 
                        className="text-[#0a3d24] font-bold text-[14.5px] leading-snug"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform duration-300 ease-in-out"
                        style={{
                          color: isOpen ? "#0a3d24" : "#94a3b8",
                          transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                      />
                    </button>
                    
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.32s ease",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <div
                          className="px-6 pb-5 pt-1 border-t border-slate-100/80"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: "opacity 0.25s ease",
                          }}
                        >
                          <p 
                            className="text-[#555555] text-[13px] leading-[20px] font-normal"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: CTA BANNER */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          
          <div className="bg-[#FAF9F5] border border-[#e5e5db]/60 rounded-[20px] relative overflow-hidden flex flex-col lg:flex-row items-stretch lg:h-[220px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            
            {/* Left Side: Plant Image (flush with top, bottom, and left edge) */}
            <div className="w-full lg:w-[35%] min-h-[180px] lg:min-h-0 relative shrink-0">
              <img 
                src={contactCtaPlants} 
                alt="Herbs and supplements" 
                className="absolute inset-0 w-full h-full object-cover rounded-t-[19px] lg:rounded-tr-none lg:rounded-l-[19px]"
              />
            </div>

            {/* Right Side: Text & Button */}
            <div className="w-full lg:w-[65%] p-6 lg:p-8 lg:pl-10 flex flex-col justify-center items-start relative z-10">
              <h3 
                className="text-[#0a3d24] font-bold text-[24px] lg:text-[26px] mb-1.5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Still Need Help?
              </h3>
              <p 
                className="text-slate-500 text-[13.5px] leading-[20px] mb-4.5 max-w-[480px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Our team is just a message away. Reach out and we'll get back to you shortly.
              </p>

              <div>
                <a 
                  href="mailto:support@nutrafyi.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a3d24] hover:bg-[#062616] text-white font-bold rounded-lg text-[13px] transition shadow-xs"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                  <span>Email Us Now</span>
                </a>
              </div>
            </div>

            {/* Leaf decoration on the far right */}
            <img 
              src={newsletterLeaf} 
              alt="Decorative leaf" 
              className="absolute right-0 top-0 bottom-0 h-full w-auto object-contain object-right hidden lg:block select-none pointer-events-none z-0" 
            />

          </div>

        </div>
      </section>

      {/* SECTION 5: NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}

export default Contact;