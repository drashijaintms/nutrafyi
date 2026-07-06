import { useState } from "react";
import BreadcrumbBar from "../components/BreadcrumbBar";
import NewsletterSection from "../components/NewsletterSection";

function FAQ() {
  const faqs = [
    {
      question: "Are your supplements third-party tested?",
      answer: "Yes, all NutraFYI products undergo rigorous third-party testing by independent laboratories to verify purity, potency, and safety. We ensure that what is on our label is exactly what is in the product."
    },
    {
      question: "Where are NutraFYI products manufactured?",
      answer: "All our supplements are formulated and manufactured in state-of-the-art facilities in the USA. Our manufacturing partners are fully GMP (Good Manufacturing Practices) certified and FDA-registered."
    },
    {
      question: "How long will it take to receive my order?",
      answer: "Standard shipping typically takes 3 to 5 business days within the continental United States. Express shipping options are available at checkout and usually arrive within 1 to 2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all NutraFYI products. If you are not completely satisfied with your purchase, please contact our customer support team to initiate a return and refund."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship directly to customers across the United States, Canada, and select European countries. You can view shipping rates and availability for your location at checkout."
    },
    {
      question: "How should I store my supplements?",
      answer: "We recommend storing your supplements in a cool, dry place away from direct sunlight, moisture, and heat. Always ensure the bottle cap is sealed tightly after each use."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <BreadcrumbBar title="Frequently Asked Questions" />

      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-['Noto_Sans'] text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="font-['Poppins'] text-sm text-slate-500 max-w-lg mx-auto">
              Find quick answers to common questions about our wellness products, shipping, purity testing, and orders.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-['Noto_Sans'] font-semibold text-slate-800 text-[15px] md:text-[16px]">
                      {faq.question}
                    </span>
                    <span className={`transform transition-transform duration-300 shrink-0 ml-4 text-[#147a3f] font-bold text-lg`}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[500px] border-t border-slate-50" : "max-h-0"
                    }`}
                  >
                    <p className="font-['Poppins'] text-slate-650 text-[13.5px] leading-relaxed px-6 py-5 bg-slate-50/50">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

export default FAQ;
