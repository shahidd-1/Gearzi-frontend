import React from 'react';
import { Search, CalendarCheck, Truck, RotateCcw } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { 
      id: 1, 
      title: "General Concept", 
      description: "Explore our extensive catalog of premium cameras, lenses, and audio gear. We stock the best.", 
      icon: <Search size={28} className="text-[#00DF81]" strokeWidth={2.5} />,
      pos: { left: '10%', top: '60%' }
    },
    { 
      id: 2, 
      title: "Booking Process", 
      description: "Select your pickup dates. Complete the secure booking and easily upload necessary documents.", 
      icon: <CalendarCheck size={28} className="text-[#00DF81]" strokeWidth={2.5} />,
      pos: { left: '35%', top: '20%' }
    },
    { 
      id: 3, 
      title: "Gear Pickup", 
      description: "Pick up your gear from our dedicated studio, or opt for fast delivery to your location.", 
      icon: <Truck size={28} className="text-[#00DF81]" strokeWidth={2.5} />,
      pos: { left: '60%', top: '53.33%' }
    },
    { 
      id: 4, 
      title: "Shoot & Return", 
      description: "Create your masterpiece! Simply return the equipment to us when your project is finished.", 
      icon: <RotateCcw size={28} className="text-[#00DF81]" strokeWidth={2.5} />,
      pos: { left: '85%', top: '13.33%' }
    }
  ];

  return (
    <div className="bg-[#000000] text-white flex-1 flex flex-col pt-8 pb-12 relative overflow-hidden font-sans">
      
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32 flex-1 flex flex-col">
        
        <div className="bg-[#101114] border border-[#ffffff]/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative shadow-2xl overflow-hidden min-h-[750px] flex flex-col">

          <div className="max-w-3xl relative z-10 mb-16 lg:mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.1] tracking-tight text-white mb-6">
              Renting professional gear should be as <span className="text-[#00DF81] font-bold">seamless and fast</span> as taking a photograph.
            </h1>
            <p className="text-[#00DF81] font-bold tracking-widest uppercase text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#00DF81] inline-block"></span> 2026 Essentials.
            </p>
          </div>

          {/* DESKTOP TIMELINE */}
          <div className="hidden lg:block relative w-full flex-1 mt-10 min-h-[450px]">
            
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none" 
              viewBox="0 0 1000 300" 
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path 
                d="M -50,180 C 20,180 50,180 100,180 S 250,60 350,60 S 500,160 600,160 S 750,40 850,40 S 950,40 1050,40" 
                fill="none" 
                stroke="#00DF81" 
                strokeWidth="2" 
                opacity="0.4"
                filter="url(#line-glow)"
              />
            </svg>

            {steps.map((step) => (
              <div 
                key={step.id} 
                className="absolute w-72 xl:w-80 group z-10"
                style={{ 
                  left: step.pos.left, 
                  top: step.pos.top,
                  transform: 'translate(-28px, -28px)' 
                }}
              >
                <div className="absolute -top-12 right-0 text-[10rem] font-black text-[#ffffff] opacity-[0.03] select-none leading-none z-0 transition-opacity duration-300 group-hover:opacity-[0.08]">
                  {step.id}
                </div>

                <div className="relative z-10 flex flex-col items-start">
                  <div className="w-14 h-14 rounded-2xl bg-[#000000] border border-[#00DF81]/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,223,129,0.3)] group-hover:shadow-[0_0_50px_rgba(0,223,129,0.6)] group-hover:scale-110 transition-all duration-300">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{step.title}</h3>
                  <p className="text-[#ffffff]/70 text-base leading-relaxed font-medium pr-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE TIMELINE */}
          <div className="lg:hidden relative mt-8 space-y-12 before:absolute before:inset-0 before:ml-[27px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#00DF81]/50 before:via-[#00DF81]/20 before:to-transparent">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-start gap-6 group">
                
                <div className="w-14 h-14 rounded-2xl bg-[#000000] border border-[#00DF81]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,223,129,0.3)] z-10">
                  {step.icon}
                </div>
                
                <div className="pt-1 relative">
                  <div className="absolute -top-6 left-0 text-[6rem] font-black text-[#ffffff] opacity-[0.03] select-none leading-none z-0">
                    {step.id}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-[#ffffff]/70 text-[15px] sm:text-base leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HowItWorks;