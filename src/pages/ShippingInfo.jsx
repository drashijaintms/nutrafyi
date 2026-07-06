import BreadcrumbBar from "../components/BreadcrumbBar";
import NewsletterSection from "../components/NewsletterSection";

function ShippingInfo() {
  return (
    <>
      <BreadcrumbBar title="Shipping Information" />

      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <h1 className="font-['Noto_Sans'] text-3xl font-bold text-slate-800 mb-6">
              Shipping Information
            </h1>

            <div className="space-y-8 font-['Poppins'] text-slate-600 text-[14px] leading-relaxed">
              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Order Processing Times
                </h2>
                <p>
                  All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Domestic Shipping Rates and Estimates
                </h2>
                <p className="mb-4">
                  We offer flat rate shipping options depending on order values and speed of delivery.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-3 pr-4">Shipping Option</th>
                        <th className="py-3 px-4">Estimated Delivery</th>
                        <th className="py-3 pl-4">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-[13.5px]">
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-slate-850">Standard Shipping</td>
                        <td className="py-3 px-4">3 – 5 business days</td>
                        <td className="py-3 pl-4 text-[#147a3f] font-bold">Free (on orders over $50) or $4.95</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-slate-850">Express Shipping</td>
                        <td className="py-3 px-4">1 – 2 business days</td>
                        <td className="py-3 pl-4 text-[#147a3f] font-bold">$9.95</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  International Shipping
                </h2>
                <p>
                  We currently ship to the United States, Canada, and select European destinations. Shipping charges for your order will be calculated and displayed at checkout. Please note that your order may be subject to import duties and taxes which are incurred once a shipment reaches your destination country. NutraFYI is not responsible for these charges if they are applied.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  How do I check the status of my order?
                </h2>
                <p>
                  When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become active. 
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

export default ShippingInfo;
