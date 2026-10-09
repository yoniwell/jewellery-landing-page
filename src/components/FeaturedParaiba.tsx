import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Eye, Info, CheckCircle2, Phone } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface FeaturedParaibaProps {
  paraibaStones: Gemstone[];
  onViewCollection: () => void;
  onInquireStone: (stoneName?: string) => void;
  onSelectStone: (stone: Gemstone) => void;
  onOpenCertificate: (stone: Gemstone) => void;
}

export const FeaturedParaiba: React.FC<FeaturedParaibaProps> = ({
  paraibaStones,
  onViewCollection,
  onInquireStone,
  onSelectStone,
  onOpenCertificate,
}) => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<Gemstone>(paraibaStones[0] || {} as Gemstone);

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#071522] relative overflow-hidden border-t border-[#D6A83F]/20">
      
      {/* Background Cyan Electric Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#14f1ce]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0B2745] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-16">
          
          <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#14f1ce]/40 bg-[#05080D] text-[#14f1ce] text-[10px] sm:text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14f1ce] animate-ping" />
              DIRECT SOURCE SPECIALTY
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF] leading-tight">
              ETHIOPIAN <span className="text-[#14f1ce] font-semibold drop-shadow-[0_0_20px_rgba(20,241,206,0.3)]">PARAÍBA</span> TOURMALINE
            </h2>

            <p className="font-serif-lux text-lg sm:text-2xl text-[#F0D27A] italic">
              Electric Color. Natural Beauty. Rare Material.
            </p>

            <p className="text-xs sm:text-sm md:text-base text-[#A7ADB5] font-light leading-relaxed">
              Direct access to Ethiopian Paraíba rough and precision-cut faceted stones. Each piece is selected for electric neon saturation, crystal purity, and high-yield potential.
            </p>

            {/* Buttons matching Brief: VIEW PARAÍBA COLLECTION | INQUIRE ABOUT AVAILABLE STONES */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onViewCollection}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#14f1ce] to-[#2dd4bf] hover:shadow-[0_0_25px_rgba(20,241,206,0.4)] transition-all cursor-pointer min-h-[44px]"
              >
                <span>VIEW COLLECTION</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => onInquireStone('Ethiopian Paraíba Tourmaline Parcel / Singles')}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-medium text-[#F7F5EF] border border-[#14f1ce]/40 hover:border-[#14f1ce] bg-[#05080D]/60 hover:bg-[#0B2745] transition-all cursor-pointer min-h-[44px]"
              >
                INQUIRE AVAILABLE STONES
              </button>
            </div>
          </div>

          {/* Right Highlight Box: 5.20 ct Featured Specimen Showcase */}
          <div className="lg:col-span-6">
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#14f1ce]/40 via-[#0B2745] to-[#D6A83F]/30 shadow-2xl">
              <div className="bg-[#05080D] rounded-xl overflow-hidden p-3.5 sm:p-5 border border-[#0B2745]">
                
                {/* Visual Specimen Viewer */}
                <div className="relative aspect-video sm:aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#071522] border border-[#14f1ce]/20 group">
                  <img
                    src={selectedSpecimen.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'}
                    alt={selectedSpecimen.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#14f1ce]/20 text-[#14f1ce] text-[9px] font-mono border border-[#14f1ce]/40 font-bold">
                      ETHIOPIAN CUPRIAN
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#05080D]/80 text-[#F0D27A] text-[9px] font-mono border border-[#D6A83F]/40 font-bold">
                      {selectedSpecimen.weightCarats} ct
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs text-[#14f1ce] font-mono font-medium truncate">
                        {selectedSpecimen.color || 'Neon Blue-Green'}
                      </p>
                      <p className="font-heading text-xs sm:text-sm text-[#F7F5EF] font-semibold truncate">
                        {selectedSpecimen.name}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectStone(selectedSpecimen)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#071522] hover:bg-[#14f1ce]/20 text-[11px] text-[#F7F5EF] border border-[#14f1ce]/40 flex items-center gap-1 transition-colors cursor-pointer shrink-0 min-h-[36px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#14f1ce]" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>

                {/* Technical Spec Matrix Table */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-[#071522] border border-[#0B2745]">
                    <span className="text-[9px] uppercase font-mono text-[#A7ADB5] block">Origin</span>
                    <strong className="text-[#F7F5EF] text-[11px] sm:text-xs font-mono">Ethiopia</strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-[#071522] border border-[#0B2745]">
                    <span className="text-[9px] uppercase font-mono text-[#A7ADB5] block">Treatment</span>
                    <strong className="text-[#F0D27A] text-[11px] sm:text-xs font-mono truncate block">Natural / Unheated</strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-[#071522] border border-[#0B2745]">
                    <span className="text-[9px] uppercase font-mono text-[#A7ADB5] block">Cut</span>
                    <strong className="text-[#F7F5EF] text-[11px] sm:text-xs font-mono">{selectedSpecimen.shapeCut || 'Cushion'}</strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-[#071522] border border-[#0B2745]">
                    <span className="text-[9px] uppercase font-mono text-[#A7ADB5] block">Price</span>
                    <strong className="text-[#25D366] text-[11px] sm:text-xs font-mono">
                      {selectedSpecimen.priceFormatted || 'On Request'}
                    </strong>
                  </div>
                </div>

                {/* Certificate & Quick Contact Bar */}
                <div className="mt-3 pt-2.5 border-t border-[#0B2745] flex items-center justify-between text-xs">
                  {selectedSpecimen.certificate ? (
                    <button
                      onClick={() => onOpenCertificate(selectedSpecimen)}
                      className="text-[11px] sm:text-xs text-[#D6A83F] hover:text-[#F0D27A] flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{selectedSpecimen.certificate.laboratory} Report #{selectedSpecimen.certificate.reportNumber}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#A7ADB5] font-mono">Natural Cuprian Certified</span>
                  )}

                  <button
                    onClick={() => onInquireStone(selectedSpecimen.name)}
                    className="text-xs text-[#14f1ce] hover:underline font-mono font-bold py-1 min-h-[36px] flex items-center"
                  >
                    Direct Inquiry →
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Mini Paraíba Stone Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pt-2 sm:pt-6">
          {paraibaStones.map((stone) => (
            <div
              key={stone.id}
              onClick={() => setSelectedSpecimen(stone)}
              className={`p-3 sm:p-4 rounded-xl bg-[#05080D] border transition-all cursor-pointer flex gap-3 sm:gap-4 items-center ${
                selectedSpecimen.id === stone.id
                  ? 'border-[#14f1ce] shadow-[0_0_20px_rgba(20,241,206,0.25)] bg-[#071522]'
                  : 'border-[#0B2745] hover:border-[#14f1ce]/40'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#071522] shrink-0 border border-[#14f1ce]/20">
                <img
                  src={stone.images[0]}
                  alt={stone.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#14f1ce] font-bold">
                    {stone.weightCarats} ct • {stone.shapeCut}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                    stone.status === 'AVAILABLE' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30' :
                    stone.status === 'SOLD' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30' :
                    'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                  }`}>
                    {stone.status}
                  </span>
                </div>
                <h4 className="font-heading text-xs font-semibold text-[#F7F5EF] truncate mt-1">
                  {stone.name}
                </h4>
                <p className="text-[11px] text-[#A7ADB5] truncate font-mono">
                  {stone.color}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-[#F0D27A] font-mono font-medium">
                    {stone.priceFormatted || 'Price on Request'}
                  </span>
                  <span className="text-[10px] text-[#14f1ce] underline">Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
