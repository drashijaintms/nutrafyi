import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import footerLogo from "../assets/footer-logo.png";

function Footer() {
  return (
    <footer>

      {/* Main Footer */}
      <div className="bg-[#0f4d25]">
        <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Logo Column */}
            <div>

              <img
                src={footerLogo}
                alt="NutraFYI"
                className="w-[180px] mb-4"
              />

              <p className="font-['Poppins'] text-white/90 text-[13px] leading-[22px] max-w-[180px]">
                Supporting Healthier Living Every Day.
              </p>

            </div>

            {/* Quick Links */}
            <div>

              <h4 className="font-['Noto_Sans'] text-white font-bold text-[16px] mb-4">
                Quick Links
              </h4>

              <ul className="space-y-1 font-['Poppins']">

                <li>
                  <Link to="/" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/products" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Shop
                  </Link>
                </li>

                <li>
                  <Link to="/about" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    About Us
                  </Link>
                </li>

                <li>
                  <Link to="/blog" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Wellness Blog
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Contact Us
                  </Link>
                </li>

                <li>
                  <Link to="/faq" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    FAQ
                  </Link>
                </li>

              </ul>

            </div>

            {/* Customer Support */}
            <div>

              <h4 className="font-['Noto_Sans'] text-white font-bold text-[16px] mb-4">
                Customer Support
              </h4>

              <ul className="space-y-1 font-['Poppins']">

                <li>
                  <Link to="/shipping-info" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Shipping Information
                  </Link>
                </li>

                <li>
                  <Link to="/return-policy" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Return Policy
                  </Link>
                </li>

                <li>
                  <Link to="/privacy-policy" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link to="/terms-conditions" className="text-white/85 text-[13px] hover:text-white transition duration-200">
                    Terms & Conditions
                  </Link>
                </li>

              </ul>

            </div>

            {/* Social */}
            <div>

              <h4 className="font-['Noto_Sans'] text-white font-bold text-[16px] mb-4">
                Follow Us
              </h4>

              <p className="font-['Poppins'] text-white/90 text-[13px] leading-[22px] mb-5 max-w-[250px]">
                Stay connected for wellness inspiration, product updates, and healthy living tips.
              </p>

              <div className="flex gap-3">

                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 border border-white/80 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0f4d25] transition-all duration-200"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 border border-white/80 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0f4d25] transition-all duration-200"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 border border-white/80 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0f4d25] transition-all duration-200"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="Google"
                  className="w-9 h-9 border border-white/80 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0f4d25] transition-all duration-200"
                >
                  <FaGoogle className="w-4 h-4" />
                </a>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#fbfaf3] py-5 border-t border-[#e5e5db]/40">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <p className="font-['Poppins'] text-[13.5px] text-[#222222] font-semibold tracking-wide">
            NutraFYI — Supporting Healthier Living Every Day.
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;