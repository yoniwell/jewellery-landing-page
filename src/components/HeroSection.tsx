import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Eye, Phone, ChevronRight, Play } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface HeroSectionProps {
  onExploreParaiba: () => void;
  onContactUs: () => void;
  onSelectStone: (stone: Gemstone) => void;
  featuredStone: Gemstone;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreParaiba,
  onContactUs,
  onSelectStone,
  featuredStone,
}) => {
  const [activeTab, setActiveTab] = useState<'paraiba' | 'sapphire' | 'padparadscha'>('paraiba');

  const heroShowcases = {
    paraiba: {
      title: 'Ethiopian Paraíba Tourmaline',
      carat: '5.20 ct',
      color: 'Electric Neon Blue-Green',
      origin: 'Ethiopia (Direct Source)',
      treatment: 'Natural / Disclosed (Unheated)',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      accentGlow: 'from-[#14f1ce]/20 via-[#0B2745]/40 to-transparent',
      borderColor: 'border-[#14f1ce]/40',
      badgeText: 'MUSEUM SPECIMEN',
      badgeColor: 'bg-[#14f1ce]/10 text-[#14f1ce] border-[#14f1ce]/30',
    },
    sapphire: {
      title: 'Ceylon Royal Blue Sapphire',
      carat: '7.15 ct',
      color: 'Velvety Royal Blue',
      origin: 'Sri Lanka (Ratnapura)',
      treatment: 'Unheated (Certified Gübelin)',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      accentGlow: 'from-[#1755af]/30 via-[#0B2745]/40 to-transparent',
      borderColor: 'border-[#1755af]/50',
      badgeText: 'CERTIFIED ROYAL BLUE',
      badgeColor: 'bg-[#1755af]/20 text-[#60a5fa] border-[#1755af]/40',
    },
    padparadscha: {
      title: 'Ceylon Padparadscha Sapphire',
      carat: '3.42 ct',
      color: 'Sunset Lotus (Pink-Orange)',
      origin: 'Sri Lanka (Ceylon)',
      treatment: 'Natural Unheated (SSEF)',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop',
      accentGlow: 'from-[#f97316]/20 via-[#0B2745]/40 to-transparent',
      borderColor: 'border-[#f97316]/40',
      badgeText: 'RARE COLLECTOR',
      badgeColor: 'bg-[#f97316]/10 text-[#fb923c] border-[#f97316]/30',
    },
  };

  const currentShowcase = heroShowcases[activeTab];

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen pt-24 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center overflow-hidden bg-[#05080D]">
      {/* Dynamic atmospheric radial lighting backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[340px] sm:h-[700px] bg-gradient-to-br from-[#0B2745]/50 via-[#071522]/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-4 sm:right-10 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] bg-[#D6A83F]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-4 sm:left-10 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-[#14f1ce]/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Subtle luxury geometric grid line overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#D6A83F_1px,transparent_1px)] [background-size:40px_40px] sm:[background-size:48px_48px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Brand Headline, Philosophy & Core CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Direct Source Subheading Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#071522]/80 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6A83F] animate-pulse" />
              <span className="text-[9px] sm:text-xs font-mono tracking-widest text-[#F0D27A] uppercase">
                DIRECT FROM AFRICAN SOURCES · WHOLESALE
              </span>
            </div>

            {/* Main Luxury Headline */}
            <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl font-light text-[#F7F5EF] leading-[1.15] sm:leading-[1.12] tracking-tight">
              Rare Stones. <br />
              <span className="font-semibold gold-gradient-text">Direct Sources.</span> <br />
              <span className="font-normal italic font-serif-lux text-[#F7F5EF]/90">Exceptional Color.</span>
            </h1>

            {/* Supporting Text (concise, high-impact) */}
            <p className="text-xs sm:text-base text-[#A7ADB5] max-w-xl font-light leading-relaxed">
              Ethiopian Paraíba Tourmaline and fine colored gemstones from Africa and Sri Lanka. Sourced directly at mine level for international collectors and luxury jewelers.
            </p>

            {/* Quick Segmented Switcher for Hero Gemstone Preview */}
            <div className="pt-0.5 sm:pt-1">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[9px] sm:text-[10px] text-[#A7ADB5]/70 uppercase tracking-wider font-mono shrink-0 mr-1 hidden xs:inline">Preview:</span>
                <button
                  onClick={() => setActiveTab('paraiba')}
                  className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                    activeTab === 'paraiba'
                      ? 'border-[#14f1ce] bg-[#14f1ce]/15 text-[#14f1ce] font-medium shadow-[0_0_15px_rgba(20,241,206,0.25)]'
                      : 'border-[#0B2745] text-[#A7ADB5] hover:border-[#D6A83F]/40'
                  }`}
                >
                  Ethiopian Paraíba
                </button>
                <button
                  onClick={() => setActiveTab('sapphire')}
                  className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                    activeTab === 'sapphire'
                      ? 'border-[#60a5fa] bg-[#1755af]/25 text-[#93c5fd] font-medium shadow-[0_0_15px_rgba(23,85,175,0.3)]'
                      : 'border-[#0B2745] text-[#A7ADB5] hover:border-[#D6A83F]/40'
                  }`}
                >
                  Royal Blue Ceylon
                </button>
                <button
                  onClick={() => setActiveTab('padparadscha')}
                  className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                    activeTab === 'padparadscha'
                      ? 'border-[#f97316] bg-[#f97316]/20 text-[#fdba74] font-medium shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                      : 'border-[#0B2745] text-[#A7ADB5] hover:border-[#D6A83F]/40'
                  }`}
                >
                  Ceylon Padparadscha
                </button>
              </div>
            </div>

            {/* Action Buttons: EXPLORE PARAÍBA | CONTACT US */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={onExploreParaiba}
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-heading text-xs uppercase tracking-[0.18em] font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] via-[#F0D27A] to-[#D6A83F] hover:shadow-[0_0_30px_rgba(214,168,63,0.5)] transition-all duration-300 cursor-pointer overflow-hidden min-h-[46px] sm:min-h-[48px] active:scale-[0.99]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORE PARAÍBA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={onContactUs}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-heading text-xs uppercase tracking-[0.18em] font-medium text-[#F7F5EF] border border-[#D6A83F]/40 hover:border-[#D6A83F] bg-[#071522]/80 hover:bg-[#0B2745]/60 transition-all duration-300 cursor-pointer min-h-[46px] sm:min-h-[48px] active:scale-[0.99]"
              >
                CONTACT US
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-3 sm:pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 border-t border-[#0B2745]/60 text-[10px] sm:text-xs text-[#A7ADB5]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6A83F] shrink-0" />
                <span>GIA / GRS Reports</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6A83F] shrink-0" />
                <span>Mine-to-Market Direct</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />
                <span>Insured Global Logistics</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero High-Value Gemstone Interactive Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Luxury Frame with glowing border */}
              <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#D6A83F]/30 via-[#0B2745] to-[#071522] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="relative rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745]">
                  
                  {/* Gemstone Image with dramatic lighting */}
                  <div className="relative aspect-square w-full bg-[#05080D] overflow-hidden group">
                    <img
                      src={currentShowcase.image}
                      alt={currentShowcase.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for high-end feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-90" />
                    
                    {/* Top Spec Badges */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none">
                      <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-mono tracking-wider border font-bold ${currentShowcase.badgeColor}`}>
                        {currentShowcase.badgeText}
                      </span>
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold bg-[#05080D]/80 text-[#F0D27A] border border-[#D6A83F]/40 backdrop-blur-md">
                        {currentShowcase.carat}
                      </span>
                    </div>

                    {/* Stone Info Card overlay on bottom */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 p-2.5 sm:p-4 rounded-xl bg-[#05080D]/95 border border-[#D6A83F]/30 backdrop-blur-md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-heading text-xs sm:text-base font-semibold text-[#F7F5EF] truncate">
                            {currentShowcase.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-[#F0D27A] font-mono mt-0.5 truncate">
                            {currentShowcase.color}
                          </p>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-mono text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30 font-bold shrink-0">
                          AVAILABLE
                        </span>
                      </div>

                      <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#0B2745] flex items-center justify-between text-[9px] sm:text-[11px] text-[#A7ADB5]">
                        <span className="truncate">Origin: <strong className="text-[#F7F5EF]">{currentShowcase.origin}</strong></span>
                        <span className="shrink-0">{currentShowcase.treatment}</span>
                      </div>

                      <div className="mt-2 sm:mt-2.5 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectStone(featuredStone)}
                          className="py-2 px-2 rounded-lg bg-[#0B2745] hover:bg-[#D6A83F]/20 text-[11px] sm:text-xs text-[#F7F5EF] hover:text-[#F0D27A] border border-[#D6A83F]/30 flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[40px] active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={onContactUs}
                          className="py-2 px-2 rounded-lg bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[11px] sm:text-xs font-semibold text-[#05080D] hover:opacity-90 flex items-center justify-center gap-1 transition-opacity cursor-pointer min-h-[40px] active:scale-95"
                        >
                          <span>Inquire</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Decorative luxury seal */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#D6A83F] to-[#A87E23] p-[2px] shadow-xl hidden sm:flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#071522] flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[8px] uppercase tracking-tighter text-[#D6A83F] font-bold font-mono leading-none">
                    100%
                  </span>
                  <span className="text-[7px] uppercase tracking-tighter text-[#F7F5EF] font-medium leading-none mt-0.5">
                    NATURAL
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
