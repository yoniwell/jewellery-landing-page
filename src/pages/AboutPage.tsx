import React from 'react';
import { Compass, Disc, ShieldCheck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { CuttingPolishingStory } from '../components/CuttingPolishingStory';
import { SourcingStory } from '../components/SourcingStory';

interface AboutPageProps {
  onOpenInquiry: () => void;
  onOpenWhatsApp: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenInquiry, onOpenWhatsApp }) => {
  return (
    <div className="min-h-screen bg-[#05080D] pt-28 pb-24">
      
      {/* Top Banner */}
      <div className="relative py-16 bg-gradient-to-b from-[#071522] via-[#05080D] to-[#05080D] border-b border-[#0B2745] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#D6A83F]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/40 bg-[#071522] text-[#F0D27A] text-xs font-mono uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>ETHICAL DIRECT SOURCE TRADING</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-light text-[#F7F5EF]">
            From African Sources <span className="gold-gradient-text font-normal">to the World</span>
          </h1>

          <p className="font-serif-lux text-xl text-[#F0D27A] italic max-w-2xl mx-auto">
            Direct relationships. Honest communication. Exceptional color.
          </p>

          <p className="text-sm sm:text-base text-[#A7ADB5] max-w-3xl mx-auto font-light leading-relaxed">
            Abel Gemstone specializes in sourcing, cutting, polishing and trading exceptional colored gemstones. Our business is built around direct sourcing, careful selection and long-term relationships with international gemstone buyers.
          </p>
        </div>
      </div>

      {/* Sourcing Narrative Component */}
      <SourcingStory />

      {/* Cutting & Polishing Lapidary Component */}
      <CuttingPolishingStory />

      {/* Trust & Transparency Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-[#071522] border border-[#D6A83F]/30 p-8 sm:p-12 text-center space-y-6">
          <h3 className="font-heading text-2xl sm:text-4xl font-light text-[#F7F5EF]">
            Direct Consultation with Our <span className="gold-gradient-text font-normal">Sourcing Principals</span>
          </h3>
          <p className="text-sm text-[#A7ADB5] max-w-2xl mx-auto font-light leading-relaxed">
            Whether you require rough crystal parcels or calibrated museum stones with GIA / SSEF / Gübelin / GRS origin reports, contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenWhatsApp}
              className="px-8 py-3.5 rounded bg-[#25D366] hover:bg-[#20bd5a] text-xs font-bold uppercase font-mono tracking-widest text-[#05080D] cursor-pointer"
            >
              Chat on WhatsApp Desk
            </button>
            <button
              onClick={onOpenInquiry}
              className="px-8 py-3.5 rounded bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-xs font-bold uppercase font-mono tracking-widest text-[#05080D] cursor-pointer"
            >
              Submit Buyer Inquiry
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
