import React from 'react';
import { Phone, Mail, ArrowUpRight, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-[#000000] text-white flex-1 flex flex-col pt-8 pb-12 relative overflow-hidden">
      
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32 flex-1 flex flex-col">
        
        {/* PREMIUM MAIN CARD */}
        <div className="bg-[#101114] border border-[#ffffff]/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative shadow-2xl overflow-hidden min-h-[750px] flex flex-col">
          
          {/* Subtle Green Ambient Glow in background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00DF81]/5 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Faint Background Decorative "CONTACT" Typography */}
          <div className="absolute top-10 right-12 text-[10rem] font-black text-[#ffffff] opacity-[0.02] select-none leading-none pointer-events-none hidden lg:block uppercase">
            Contact
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
            
            {/* LEFT: Heading & Contact List */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00DF81]/20 bg-[#00DF81]/5 mb-8 w-max">
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#00DF81]">Contact</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Get in touch</h2>
              <p className="text-[#ffffff]/60 font-medium text-lg mb-12 max-w-sm">
                Have questions or ready to rent professional gear? Our team is here to assist.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Mail size={22} />, label: "Email us", value: "hello@gearzi.com", href: "mailto:hello@gearzi.com" },
                  { icon: <Phone size={22} />, label: "Call us", value: "+91 73069 22073", href: "tel:+917306922073" },
                  { icon: <MapPin size={22} />, label: "Our location", value: "Kozhikode, Kerala, India", href: "#" }
                ].map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.href}
                    className="bg-[#0B0B0B] border border-[#ffffff]/10 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-[#00DF81]/50 hover:shadow-[0_0_20px_rgba(0,223,129,0.1)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#ffffff]/5 flex items-center justify-center text-[#ffffff]/40 group-hover:text-[#00DF81] transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-[#ffffff]/50 font-bold mb-0.5">{item.label}</p>
                        <p className="font-bold text-[15px]">{item.value}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={20} className="text-[#ffffff]/30 group-hover:text-[#00DF81] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="bg-[#0B0B0B] rounded-[2rem] border border-[#ffffff]/5 p-8 md:p-10 shadow-2xl relative group">
              {/* Subtle Border Glow */}
              <div className="absolute inset-0 rounded-[2rem] border border-[#00DF81]/0 group-hover:border-[#00DF81]/20 transition-all duration-500 pointer-events-none"></div>
              
              <form className="space-y-6 relative z-10">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-[#ffffff]/50 uppercase mb-3">Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-[#000000] text-white border border-[#ffffff]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00DF81]/50 focus:shadow-[0_0_15px_rgba(0,223,129,0.1)] transition-all"/>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-[#ffffff]/50 uppercase mb-3">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-[#000000] text-white border border-[#ffffff]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00DF81]/50 focus:shadow-[0_0_15px_rgba(0,223,129,0.1)] transition-all"/>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-[#ffffff]/50 uppercase mb-3">Message</label>
                  <textarea rows="6" placeholder="How can we help you today?" className="w-full bg-[#000000] text-white border border-[#ffffff]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00DF81]/50 focus:shadow-[0_0_15px_rgba(0,223,129,0.1)] transition-all resize-none"></textarea>
                </div>

                <button type="button" className="w-full bg-[#ffffff] text-[#000000] hover:bg-[#00DF81] font-black text-[15px] py-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] mt-4 shadow-lg">
                  Submit
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;