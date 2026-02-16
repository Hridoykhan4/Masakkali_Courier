import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaPaperPlane,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content">
      {/* Upper Footer: Newsletter & Brand */}
      <div className="container-page py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <MasakkaliLogo />
            </div>
            <p className="text-neutral-content/70 max-w-xs leading-relaxed">
              Redefining logistics with speed and precision. Providing reliable
              door-to-door courier services since {currentYear}.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaYoutube].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">
                Company
              </h4>
              <ul className="space-y-2 text-neutral-content/60 text-sm font-medium">
                <li className="hover:text-primary transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Our Coverage
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">
                Support
              </h4>
              <ul className="space-y-2 text-neutral-content/60 text-sm font-medium">
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Track Parcel
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  API Docs
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer">
                  Contact Us
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">
              Stay Updated
            </h4>
            <p className="text-neutral-content/60 text-sm">
              Join our newsletter for logistics insights and offers.
            </p>
            <div className="relative mt-4">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 rounded-xl flex items-center justify-center hover:opacity-90 transition-all">
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-8">
        <div className="container-page flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-40">
          <p>© {currentYear} Masakkali Courier Ltd. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span>Terms of Service</span>
            <span>Security</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
