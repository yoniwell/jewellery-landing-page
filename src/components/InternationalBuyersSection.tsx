import React from 'react';
import { Globe, Plane, ShieldCheck, Lock, FileText, Phone, ArrowRight } from 'lucide-react';

interface InternationalBuyersProps {
  onOpenInquiry: () => void;
  onOpenWhatsApp: () => void;
}

export const InternationalBuyersSection: React.FC<InternationalBuyersProps> = ({
  onOpenInquiry,
  onOpenWhatsApp,
}) => {
  const regions = [
    { name: 'Europe', hubs: 'Geneva, Zurich, London, Paris, Antwerp' },
    { name: 'United States', hubs: 'New York, Los Angeles, Miami' },
    { name: 'Middle East', hubs: 'Dubai (DMCC), Abu Dhabi, Riyadh, Doha' },
    { name: 'Asia', hubs: 'Hong Kong, Tokyo, Bangkok, Singapore' },
    { name: 'Africa', hubs: 'Addis Ababa, Nairobi, Arusha, direct mine desks' },
  ];

  const commitments = [
    {
      title: 'AUTHENTICITY',
      desc: 'Accurate gemstone descriptions and geological verification.',
    },
    {
      title: 'TRANSPARENCY',
      desc: 'Treatment and certification information disclosed where known.',
    },
    {
      title: 'QUALITY',
      desc: 'Carefully selected material with zero compromise on optical fire.',
    },
    {
      title: 'RELATIONSHIPS',
      desc: 'Long-term relationships with international buyers, dealers & jewelry houses.',
    },
  ];

  return (
    <section className="py-24 bg-[#05080D] relative border-t border-[#0B2745]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title strictly from Brief */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#071522] text-[#F0D27A] text-xs font-mono uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL WHOLESALE REACH</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-light text-[#F7F5EF]">
            Serving Collectors, Dealers & <span className="gold-gradient-text font-normal">Jewelry Professionals Worldwide</span>
          </h2>

          <p className="text-sm sm:text-base text-[#A7ADB5] font-light leading-relaxed">
            We operate direct international logistics, secure bonded viewings, and transparent certification with clients across major luxury trade hubs.
          </p>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-4" />
        </div>

        {/* Global Regions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 mb-10 sm:mb-16">
          {regions.map((reg, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-5 rounded-xl bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/40 transition-all text-center space-y-1.5 sm:space-y-2 group ${
                idx === 4 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#05080D] border border-[#D6A83F]/30 text-[#F0D27A] flex items-center justify-center mx-auto text-[10px] sm:text-xs font-mono group-hover:scale-110 transition-transform">
                0{idx + 1}
              </div>
              <h4 className="font-heading text-xs sm:text-base font-bold text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors truncate">
                {reg.name}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#A7ADB5] font-light leading-snug">
                {reg.hubs}
              </p>
            </div>
          ))}
        </div>

        {/* Section 30: Our Commitment (4 points) */}
        <div className="p-5 sm:p-12 rounded-2xl bg-[#071522] border border-[#D6A83F]/30 relative overflow-hidden mb-10 sm:mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A83F]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-xs font-mono text-[#D6A83F] uppercase tracking-widest block">TRUST & INTEGRITY</span>
            <h3 className="font-heading text-xl sm:text-3xl font-semibold text-[#F7F5EF] mt-1">
              Our Commitment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {commitments.map((c, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D6A83F] shrink-0" />
                  <h5 className="font-heading text-[11px] sm:text-xs font-bold text-[#F7F5EF] tracking-wider uppercase">
                    {c.title}
                  </h5>
                </div>
                <p className="text-[11px] sm:text-xs text-[#A7ADB5] font-light leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 31: Homepage Final Section */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0B2745] via-[#071522] to-[#0B2745] border border-[#D6A83F]/40 p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <h3 className="font-heading text-2xl sm:text-4xl font-light text-[#F7F5EF]">
              Exceptional Stones. <span className="gold-gradient-text font-normal">Lasting Value.</span>
            </h3>

            <p className="text-xs sm:text-base text-[#A7ADB5] font-light leading-relaxed">
              Looking for a specific gemstone or exceptional material? Tell us your requirements or begin a direct consultation with our sourcing desk.
            </p>

            {/* Buttons matching Brief: WHATSAPP US | SEND AN INQUIRY */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4">
              <button
                onClick={onOpenWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#F7F5EF] bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all cursor-pointer min-h-[44px] active:scale-95"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>WHATSAPP US</span>
              </button>

              <button
                onClick={onOpenInquiry}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_25px_rgba(214,168,63,0.5)] transition-all cursor-pointer min-h-[44px] active:scale-95"
              >
                <span>SEND AN INQUIRY</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
