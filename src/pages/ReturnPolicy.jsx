import BreadcrumbBar from "../components/BreadcrumbBar";
import NewsletterSection from "../components/NewsletterSection";

function ReturnPolicy() {
  return (
    <>
      <BreadcrumbBar title="Return Policy" />

      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <h1 className="font-['Noto_Sans'] text-3xl font-bold text-slate-800 mb-6">
              Return & Refund Policy
            </h1>

            <div className="space-y-8 font-['Poppins'] text-slate-600 text-[14px] leading-relaxed">
              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Our 30-Day Money-Back Guarantee
                </h2>
                <p>
                  At NutraFYI, we stand behind the quality of our wellness products. If you are not completely satisfied with your purchase, you may return the item within 30 days of the delivery date for a full refund of the product purchase price, minus any shipping and handling charges.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Return Eligibility
                </h2>
                <p>
                  To be eligible for a refund, the product must be returned in its original container, even if it has been opened or partially used. Please note that return labels are not pre-paid, and shipping costs are the responsibility of the customer.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  How to Initiate a Return
                </h2>
                <p className="mb-4">
                  Returning an item is simple. Just follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>Contact our customer support team at <span className="font-semibold text-slate-800">support@nutrafyi.com</span> with your order number.</li>
                  <li>Our team will provide you with the return shipping address and a Return Merchandise Authorization (RMA) code.</li>
                  <li>Package the item securely, write the RMA code clearly on the outside of the box, and ship it to the address provided.</li>
                </ol>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Refund Processing
                </h2>
                <p>
                  Once we receive your return at our warehouse, it will be processed within 3 to 5 business days. The refund will be credited back to your original payment method. Depending on your financial institution, it may take an additional 5 to 10 business days for the refund to reflect on your account statement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

export default ReturnPolicy;
