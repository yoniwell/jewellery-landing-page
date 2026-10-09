import React from 'react';
import { Compass, MapPin, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export const SourcingStory: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#05080D] relative border-t border-[#0B2745]">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#D6A83F]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Story with Map & Field Images */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#D6A83F]/30 p-1 bg-gradient-to-b from-[#0B2745] to-[#071522] shadow-2xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#071522]">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop"
                  alt="East African Gemstone Exploration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-[#05080D]/40 to-transparent" />
                
                {/* Floating Source Pin Card */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3 sm:p-4 rounded-lg bg-[#05080D]/95 border border-[#D6A83F]/40 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[#D6A83F] text-[10px] sm:text-xs font-mono">
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
                    <span className="uppercase tracking-widest font-bold">ETHICAL DIRECT SOURCING</span>
                  </div>
                  <h4 className="font-heading text-xs sm:text-sm text-[#F7F5EF] font-semibold mt-1">
                    East Africa & Sri Lanka Field Operations
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#A7ADB5] mt-1">
                    Direct access to primary geological extraction before intermediate broker markups.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats counter */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                <span className="font-heading text-lg sm:text-xl font-bold text-[#F0D27A]">100%</span>
                <span className="block text-[9px] sm:text-[10px] text-[#A7ADB5] uppercase font-mono mt-0.5">Disclosed</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                <span className="font-heading text-lg sm:text-xl font-bold text-[#14f1ce]">0</span>
                <span className="block text-[9px] sm:text-[10px] text-[#A7ADB5] uppercase font-mono mt-0.5">Brokers</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                <span className="font-heading text-lg sm:text-xl font-bold text-[#60a5fa]">GIA/SSEF</span>
                <span className="block text-[9px] sm:text-[10px] text-[#A7ADB5] uppercase font-mono mt-0.5">Lab Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Narrative strictly from Brief */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#071522] text-[#F0D27A] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>DIRECT FROM AFRICAN SOURCES</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF] leading-tight">
              From African Sources <br />
              <span className="gold-gradient-text font-normal">to the World</span>
            </h2>

            <p className="font-serif-lux text-base sm:text-xl text-[#F0D27A] italic">
              Direct relationships. Honest communication. Exceptional color.
            </p>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-base text-[#A7ADB5] font-light leading-relaxed">
              <p>
                Abel Gemstone specializes in sourcing, cutting, polishing and trading exceptional colored gemstones. Our business is built around direct sourcing, careful selection and long-term relationships with international gemstone buyers.
              </p>
              <p>
                We work with gemstone material from Africa and Sri Lanka, with a particular focus on exceptional colored stones and rare collector material. From rough material to finished gemstones, our goal is to preserve the natural character of each stone while bringing out its maximum beauty through expert cutting and polishing.
              </p>
              <p>
                Our journey begins at the source. We work close to gemstone-producing regions to identify promising material before it reaches the international market. Direct sourcing allows us to understand the material, evaluate its potential and build relationships with suppliers and buyers around the world.
              </p>
            </div>

            {/* Core Values Bullet List */}
            <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                <CheckCircle2 className="w-4 h-4 text-[#D6A83F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F7F5EF] block font-heading text-xs sm:text-sm">Verified Origin</strong>
                  <span className="text-[#A7ADB5] text-[11px] sm:text-xs">Transparent origin disclosures supported by leading gem labs.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                <CheckCircle2 className="w-4 h-4 text-[#D6A83F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F7F5EF] block font-heading text-xs sm:text-sm">Direct Mine Access</strong>
                  <span className="text-[#A7ADB5] text-[11px] sm:text-xs">First-hand selection of unheated rough and collector specimens.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
