import BreadcrumbBar from "../components/BreadcrumbBar";
import NewsletterSection from "../components/NewsletterSection";

function TermsConditions() {
  return (
    <>
      <BreadcrumbBar title="Terms & Conditions" />

      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <h1 className="font-['Noto_Sans'] text-3xl font-bold text-slate-800 mb-6">
              Terms & Conditions
            </h1>

            <div className="space-y-8 font-['Poppins'] text-slate-600 text-[14px] leading-relaxed">
              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Agreement to Terms
                </h2>
                <p>
                  Welcome to NutraFYI. These terms and conditions outline the rules and regulations for the use of our website. By accessing this website and purchasing our products, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use our website.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Use of the Website
                </h2>
                <p>
                  You must be at least 18 years of age to use this website or purchase our products. You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Product Information & Disclaimer
                </h2>
                <p>
                  While we make every effort to display product details as accurately as possible, we do not warrant that product descriptions, ingredients, or other content are error-free. The information provided on this website is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Intellectual Property
                </h2>
                <p>
                  Unless otherwise stated, NutraFYI owns the intellectual property rights for all material on the website. All intellectual property rights are reserved. You may access this from NutraFYI for your own personal use subjected to restrictions set in these terms and conditions.
                </p>
              </div>

              <div>
                <h2 className="font-['Noto_Sans'] text-lg font-bold text-slate-800 mb-2">
                  Limitation of Liability
                </h2>
                <p>
                  NutraFYI, its directors, employees, or agents shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this website, or the performance of any products purchased through this website.
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

export default TermsConditions;
