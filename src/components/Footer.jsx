import footerLogo from "../assets/footer-logo.png";

function Footer() {
  return (
    <footer>

      {/* Main Footer */}
      <div className="bg-[#0b6b2d]">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="flex flex-wrap">

            {/* Logo Column */}
            <div className="w-full md:w-6/12 lg:w-3/12 mb-8 lg:mb-0">

              <img
                src={footerLogo}
                alt="NutraFYI"
                className="w-[180px] mb-4"
              />

              <p className="text-white text-sm leading-6 max-w-[180px]">
                Supporting Healthier Living Every Day.
              </p>

            </div>

            {/* Quick Links */}
            <div className="w-full sm:w-6/12 lg:w-2/12 mb-8 lg:mb-0">

              <h4 className="text-white font-semibold mb-4">
                Quick Links
              </h4>

              <ul className="space-y-2">

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Home
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Shop
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    About Us
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Wellness Blog
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Contact Us
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    FAQ
                  </a>
                </li>

              </ul>

            </div>

            {/* Customer Support */}
            <div className="w-full sm:w-6/12 lg:w-2/12 mb-8 lg:mb-0">

              <h4 className="text-white font-semibold mb-4">
                Customer Support
              </h4>

              <ul className="space-y-2">

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Shipping Information
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Return Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="text-white/90 text-sm hover:text-white">
                    Terms & Conditions
                  </a>
                </li>

              </ul>

            </div>

            {/* Social */}
            <div className="w-full lg:w-3/12">

              <h4 className="text-white font-semibold mb-4">
                Follow Us
              </h4>

              <p className="text-white/90 text-sm leading-6 mb-5 max-w-[240px]">
                Stay connected for wellness inspiration,
                product updates, and healthy living tips.
              </p>

              <div className="flex gap-3">

                <a
                  href="#"
                  className="w-9 h-9 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b6b2d] transition"
                >
                  f
                </a>

                <a
                  href="#"
                  className="w-9 h-9 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b6b2d] transition"
                >
                  ig
                </a>

                <a
                  href="#"
                  className="w-9 h-9 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b6b2d] transition"
                >
                  in
                </a>

                <a
                  href="#"
                  className="w-9 h-9 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b6b2d] transition"
                >
                  G
                </a>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#f3f0e3] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <p className="text-[13px] text-[#222]">
            NutraFYI — Supporting Healthier Living Every Day.
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;