import React from 'react';
import { Shield, Mail, Phone } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-[#000000] text-white flex-1 flex flex-col pt-8 pb-12 relative overflow-hidden font-sans">
      
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32 flex-1 flex flex-col">

        <div className="w-full bg-[#101114] border border-[#ffffff]/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00DF81]/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-10 right-12 text-[10rem] font-black text-[#ffffff] opacity-[0.02] select-none leading-none pointer-events-none hidden lg:block uppercase">Terms</div>

          <div className="relative z-10 text-[#ffffff]/80 leading-relaxed text-lg sm:text-[18px]">

            {/* HEADER */}
            <div className="mb-12 pb-12 border-b border-[#ffffff]/10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00DF81]/20 bg-[#00DF81]/5 mb-6 w-max">
                <Shield size={16} className="text-[#00DF81]" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#00DF81]">Legal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                Terms and <span className="text-[#00DF81]" style={{ textShadow: '0 0 20px rgba(0,223,129,0.4)'}}>Conditions</span>
              </h1>
              <p className="text-[#ffffff]/40 font-medium text-sm tracking-widest uppercase">
                Effective Date: June 1, 2026
              </p>
            </div>

            <div className="space-y-16">

              {/* INTRO */}
              <section>
                <p className="text-xl md:text-2xl text-white font-medium leading-tight">
                  Welcome to Gearzi. By accessing or using our platform (website and/or mobile application), you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.{' '}
                  <span className="text-[#00DF81] font-bold">If you do not agree to these Terms, you must not use Gearzi.</span>
                </p>
              </section>

              {/* 1 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">01.</span> About the Platform
                </h2>
                <p className="mb-4">
                  Gearzi is an online marketplace that connects individuals and businesses who wish to rent camera equipment, drones, lighting gear, iPhones, and related accessories ("Equipment").
                </p>
                <p className="bg-[#00DF81]/5 border border-[#00DF81]/20 rounded-2xl p-5 text-[#ffffff]/90">
                  <span className="text-[#00DF81] font-bold">Important:</span> Gearzi acts solely as an intermediary platform. We do not own, possess, control, manage, offer, deliver, or supply any Equipment listed on the platform. All listings are created and managed by independent users.
                </p>
              </section>

              {/* 2 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">02.</span> User Eligibility
                </h2>
                <p className="mb-4">To use the platform, you must:</p>
                <ul className="space-y-3 mb-4">
                  {[
                    'Be at least 16 years of age',
                    'Have the legal capacity to enter into a binding agreement',
                    'Provide accurate, truthful, and complete registration information',
                    'Comply with all applicable local, state, and national laws'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#ffffff]/60 text-base">
                  Gearzi reserves the right to suspend or permanently terminate accounts that provide false, misleading, or incomplete information without prior notice.
                </p>
              </section>

              {/* 3 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">03.</span> User Accounts
                </h2>
                <ul className="space-y-3">
                  {[
                    'You are solely responsible for maintaining the confidentiality of your account credentials',
                    'All activities that occur under your account are your responsibility',
                    'Gearzi may suspend, restrict, or terminate your account for any violation of these Terms',
                    <span>You must notify us immediately at <span className="text-[#00DF81] font-bold">hello@gearzi.com</span> if you suspect unauthorized access to your account</span>
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 4 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">04.</span> KYC & Identity Verification
                </h2>
                <p className="mb-4">
                  Gearzi requires identity verification (KYC – Know Your Customer) before users can rent Equipment. This process is in place to protect both Owners and Renters.
                </p>
                <p className="mb-4">As part of KYC verification, you may be required to provide:</p>
                <ul className="space-y-3 mb-6">
                  {[
                    'A government-issued photo ID (Aadhaar Card, Passport, Driving Licence, or Voter ID)',
                    'A selfie or live photo for identity matching',
                    'A valid mobile number linked to your account',
                    'Any additional documents we may request to verify your identity'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#ffffff]/60 text-base">
                  Gearzi reserves the right to decline or suspend rental access to any user who fails to complete verification or provides false documentation. All KYC data is handled in accordance with our Privacy Policy.
                </p>
              </section>

              {/* 5 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">05.</span> Listings
                </h2>
                <ul className="space-y-3">
                  {[
                    'Users (Owners) are solely responsible for the accuracy, legality, and completeness of their product listings',
                    "Listings must include honest descriptions of the Equipment's condition, specifications, and any known defects",
                    'Misleading, fraudulent, or prohibited listings are strictly not allowed',
                    'Gearzi reserves the right to remove any listing at any time, without prior notice, for any reason',
                    'Owners must ensure their listed Equipment is legally owned or authorised to be rented out'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 6 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">06.</span> Rental & Transactions
                </h2>
                <p className="mb-4">
                  All rental agreements are directly between the Equipment Owner ("Lender") and the Renter.{' '}
                  <span className="text-white font-bold">Gearzi is not a party to any rental transaction</span> and accepts no liability arising from such agreements.
                </p>
                <p className="mb-4">Before completing a rental, both parties must mutually agree on:</p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Rental duration (start and end dates/times)',
                    'Daily or total rental price',
                    'Security deposit amount (if applicable)',
                    'Delivery or pickup method and location',
                    'Condition of Equipment at the time of handover'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="bg-[#00DF81]/5 border border-[#00DF81]/20 rounded-2xl p-5 text-[#ffffff]/90">
                  <span className="text-[#00DF81] font-bold">Recommended:</span> Both parties should document the Equipment's condition with photos or video before and after the rental period.
                </p>
              </section>

              {/* 7 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">07.</span> Payments & Commission
                </h2>
                <p className="mb-4">
                  Currently, Gearzi facilitates coordination between users. Payments may be made directly between parties as agreed. Gearzi may, in the future, integrate third-party payment processors (such as Razorpay) to handle transactions securely.
                </p>
                <p className="bg-[#00DF81]/5 border border-[#00DF81]/20 rounded-2xl p-5 text-[#ffffff]/90 mb-4">
                  <span className="text-[#00DF81] font-bold">Platform Commission:</span> Gearzi may charge a platform commission of <span className="text-white font-bold">5%</span> on completed transactions. Details of any applicable commission will be communicated clearly before transactions are finalised.
                </p>
                <p className="text-[#ffffff]/60 text-base">
                  Gearzi is not responsible for any payment failures, delays, disputes, or fraud arising from direct transactions between users or from third-party payment providers.
                </p>
              </section>

              {/* 8 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">08.</span> Security Deposit & Damages
                </h2>
                <ul className="space-y-3 mb-6">
                  {[
                    'Owners may require a refundable security deposit at their discretion before handing over Equipment',
                    'The security deposit amount and refund conditions must be agreed upon before the rental begins',
                    "Any damage, loss, theft, or misuse of Equipment during the rental period is entirely the Renter's responsibility",
                    'Disputes regarding deposits or damages must be resolved directly between the Owner and Renter'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#ffffff]/60 text-base">
                  Gearzi is not liable for any damage, loss, or theft of Equipment and is not responsible for mediating financial disputes between users.
                </p>
              </section>

              {/* 9 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">09.</span> Prohibited Activities
                </h2>
                <p className="mb-4">By using the platform, you agree <span className="text-white font-bold">NOT</span> to:</p>
                <ul className="space-y-3 mb-6">
                  {[
                    'List, rent, or sell stolen, counterfeit, or illegally obtained Equipment',
                    'Use the platform for fraudulent, deceptive, or misleading purposes',
                    'Harass, threaten, abuse, or intimidate other users',
                    'Bypass the platform to avoid applicable platform commissions',
                    'Post spam, fake reviews, or misleading content',
                    "Attempt to hack, scrape, or disrupt the platform's functionality",
                    'Use the platform for any activity that violates applicable Indian law'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-[#ffffff]/90">
                  <span className="text-red-400 font-bold">Warning:</span> Violation of any of the above may result in immediate account termination and may be reported to law enforcement authorities.
                </p>
              </section>

              {/* 10 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">10.</span> Limitation of Liability
                </h2>
                <p className="mb-4">
                  Gearzi provides the platform on an <span className="text-white font-bold">"as is"</span> and <span className="text-white font-bold">"as available"</span> basis. To the fullest extent permitted by law, Gearzi is not responsible for:
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'The quality, safety, legality, or condition of any listed Equipment',
                    'Damage, loss, or theft of Equipment during or after a rental',
                    'Disputes, losses, or claims arising between Owners and Renters',
                    'Any indirect, incidental, consequential, or punitive losses',
                    'Service interruptions, data loss, or technical failures'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#ffffff]/60 text-base">Use of the platform is entirely at your own risk.</p>
              </section>

              {/* 11 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">11.</span> Intellectual Property
                </h2>
                <p className="mb-4">
                  All content, design, logos, branding, software, and materials on the Gearzi platform are the <span className="text-white font-bold">exclusive intellectual property of Gearzi</span> or its licensors.
                </p>
                <p>
                  You may not copy, reproduce, distribute, modify, or commercially exploit any platform content without prior written permission from us.
                </p>
              </section>

              {/* 12 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">12.</span> Privacy Policy
                </h2>
                <p>
                  Your use of Gearzi is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the platform, you consent to the collection and use of your data as described in our Privacy Policy.
                </p>
              </section>

              {/* 13 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">13.</span> Termination
                </h2>
                <p className="mb-4">Gearzi reserves the right to suspend or permanently terminate your account and access to the platform:</p>
                <ul className="space-y-3 mb-6">
                  {[
                    'For any violation of these Terms',
                    'For illegal, fraudulent, or abusive activity',
                    'For failure to complete KYC verification',
                    'At our sole discretion, with or without prior notice'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00DF81] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#ffffff]/60 text-base">Termination does not affect any rights or obligations that arose prior to termination.</p>
              </section>

              {/* 14 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">14.</span> Changes to These Terms
                </h2>
                <p className="mb-4">
                  Gearzi may revise or update these Terms at any time. We will notify users of significant changes via email or a notice on the platform.{' '}
                  <span className="text-white font-bold">Your continued use of the platform following any update constitutes your acceptance of the revised Terms.</span>
                </p>
                <p className="text-[#ffffff]/60 text-base">We recommend reviewing these Terms periodically.</p>
              </section>

              {/* 15 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">15.</span> Governing Law & Jurisdiction
                </h2>
                <p>
                  These Terms and Conditions are governed by and construed in accordance with the <span className="text-white font-bold">laws of India</span>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in <span className="text-white font-bold">Kozhikode, Kerala</span>.
                </p>
              </section>

              {/* Agreement Banner */}
              <section className="bg-[#00DF81]/5 border border-[#00DF81]/20 rounded-2xl p-6">
                <p className="text-white font-bold text-lg text-center">
                  By using the Gearzi platform, you confirm that you have read, understood, and agree to these Terms and Conditions.
                </p>
              </section>

              {/* Contact */}
              <section className="pt-12 border-t border-[#ffffff]/10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-4">
                  <span className="text-[#00DF81] font-black">16.</span> Contact Us
                </h2>
                <p className="mb-8 text-[#ffffff]/60 text-base">Location: Kozhikode, Kerala, India</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <a href="mailto:hello@gearzi.com" className="flex items-center gap-5 bg-[#000000] p-6 rounded-3xl border border-[#ffffff]/5 hover:border-[#00DF81]/30 transition-all text-[17px]">
                    <div className="bg-[#121212] p-3 rounded-xl text-[#00DF81]"><Mail size={24} /></div>
                    <span className="text-white font-bold">hello@gearzi.com</span>
                  </a>
                  <a href="tel:+917306922073" className="flex items-center gap-5 bg-[#000000] p-6 rounded-3xl border border-[#ffffff]/5 hover:border-[#00DF81]/30 transition-all text-[17px]">
                    <div className="bg-[#121212] p-3 rounded-xl text-[#00DF81]"><Phone size={24} /></div>
                    <span className="text-white font-bold">+91 73069 22073</span>
                  </a>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;