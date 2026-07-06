import BreadcrumbBar from "../components/BreadcrumbBar";
import NewsletterSection from "../components/NewsletterSection";

function PrivacyPolicy() {
  return (
    <>
      <BreadcrumbBar title="Privacy Policy" />

      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <h1 className="font-['Noto_Sans'] text-3xl font-bold text-slate-800 mb-6">
              Privacy Policy
            </h1>

            <div className="space-y-8 font-['Poppins'] text-slate-600 text-[14px] leading-relaxed">
              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Introduction
                </h2>
                <p>
                  At NutraFYI, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our store.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Information We Collect
                </h2>
                <p className="mb-3">
                  We collect information that you voluntarily provide to us when you register, make a purchase, sign up for our newsletter, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>Name, email address, phone number, and billing/shipping addresses.</li>
                  <li>Payment details (processed securely through our encrypted payment gateways).</li>
                  <li>Account login credentials.</li>
                  <li>Preferences and product interests.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  How We Use Your Information
                </h2>
                <p className="mb-3">
                  We use the information we collect for various business purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>Processing and delivering your orders.</li>
                  <li>Managing your user account.</li>
                  <li>Sending order confirmations, tracking details, and support messages.</li>
                  <li>Sending marketing newsletters and product updates (which you can opt-out of at any time).</li>
                  <li>Improving our website performance, layout, and shopping experience.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Data Security
                </h2>
                <p>
                  We implement robust technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All transaction information is encrypted using standard Secure Socket Layer (SSL) technology.
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

export default PrivacyPolicy;
