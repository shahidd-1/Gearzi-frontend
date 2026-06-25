import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-[#ffffff] pt-16 pb-8 mt-auto border-t border-[#ffffff]/10">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black italic tracking-wider"><span className="text-[#00DF81]" style={{ textShadow: '0 0 20px rgba(0,223,129,0.4)'}}> G</span>earzi</span>
            </Link>
            <p className="text-[#ffffff]/60 leading-relaxed text-[17px]">
              Kerala's premium camera rental service. We empower creators with professional gear at accessible prices.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-[#121212] border border-[#ffffff]/10 p-2.5 rounded-full hover:border-[#00DF81] hover:text-[#00DF81] transition-colors flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="#" className="bg-[#121212] border border-[#ffffff]/10 p-2.5 rounded-full hover:border-[#00DF81] hover:text-[#00DF81] transition-colors flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-xl mb-6 tracking-wide text-[#ffffff]/90">NAVIGATION</h3>
            <ul className="space-y-4 text-[#ffffff]/60 text-[17px]">
              <li><Link to="/" className="hover:text-[#00DF81] transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#00DF81] transition">Cameras</Link></li>
              <li><Link to="/products" className="hover:text-[#00DF81] transition">Lenses</Link></li>
              <li><Link to="/contact" className="hover:text-[#00DF81] transition">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-xl mb-6 tracking-wide text-[#ffffff]/90">SUPPORT</h3>
            <ul className="space-y-4 text-[#ffffff]/60 text-[17px]">
              <li><Link to="/contact" className="hover:text-[#00DF81] transition">Contact Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#00DF81] transition">How It Works</Link></li>
              <li><Link to="/terms" className="hover:text-[#00DF81] transition">Terms</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="font-bold text-xl mb-6 tracking-wide text-[#ffffff]/90">GET IN TOUCH</h3>
            <div className="border border-[#ffffff]/10 rounded-2xl p-6 bg-[#121212] space-y-5">
              <div className="flex items-center space-x-3 text-[#ffffff]/80">
                <Phone size={20} className="text-[#00DF81] flex-shrink-0" />
                <span className="text-[16px] font-medium">+91 73069 22073</span>
              </div>
              <div className="flex items-center space-x-3 text-[#ffffff]/80">
                <Mail size={20} className="text-[#00DF81] flex-shrink-0" />
                <span className="text-[16px] font-medium">hello@gearzi.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-[#ffffff]/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[15px] text-[#ffffff]/40 space-y-4 md:space-y-0">
          <p>© 2026 Gearzi. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;