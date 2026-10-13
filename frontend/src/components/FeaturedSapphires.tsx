import React, { useState } from 'react';
import { Gem, ArrowRight, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface FeaturedSapphiresProps {
  sapphireStones: Gemstone[];
  onViewSapphiresPage: (subCategory?: string) => void;
  onSelectStone: (stone: Gemstone) => void;
  onInquireStone: (stoneName?: string) => void;
}

export const FeaturedSapphires: React.FC<FeaturedSapphiresProps> = ({
  sapphireStones,
  onViewSapphiresPage,
  onSelectStone,
  onInquireStone,
}) => {
  const filteredStones = sapphireStones.slice(0, 6);

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#05080D] relative border-t border-[#0B2745]">
      
      {/* Deep Sapphire background glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#1755af]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1755af]/40 bg-[#071522] text-[#60a5fa] text-[10px] sm:text-xs font-mono uppercase tracking-widest">
            <Gem className="w-3.5 h-3.5" />
            <span>NATURAL SAPPHIRES · DIRECT SOURCING</span>
          </div>
          
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF]">
            Natural <span className="text-[#60a5fa] font-normal">Sapphires</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#A7ADB5] font-light leading-relaxed">
            From vibrant Cornflower and Royal Blue to rare unheated stones, sourced directly for collectors and jewelry professionals.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent mx-auto mt-3" />
        </div>

        {/* Sapphires Grid with Luxury Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredStones.map((stone) => (
            <div
              key={stone.id}
              className="group rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#60a5fa]/60 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(23,85,175,0.2)] flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#05080D] overflow-hidden flex items-center justify-center">
                {stone.images && stone.images.length > 0 ? (
                  <img
                    src={stone.images[0]}
                    alt={stone.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : stone.videoUrl ? (
                  <video
                    src={stone.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-xs font-mono text-[#60a5fa]/50">Specimen Available</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80" />
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#60a5fa] text-[9px] font-mono border border-[#1755af]/50 backdrop-blur-sm">
                    {stone.subCategory || 'Natural Sapphire'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#F0D27A] text-[9px] font-mono border border-[#D6A83F]/30 backdrop-blur-sm">
                    {stone.weightCarats} ct
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border font-bold ${
                    stone.status === 'AVAILABLE' ? 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30' :
                    stone.status === 'SOLD' ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30' :
                    'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30'
                  }`}>
                    {stone.status}
                  </span>
                </div>
              </div>

              {/* Stone details */}
              <div className="p-4 sm:p-5 lg:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#A7ADB5] font-mono">
                    <span>{stone.shapeCut}</span>
                    <span>{stone.origin}</span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-[#F7F5EF] mt-1 group-hover:text-[#60a5fa] transition-colors truncate">
                    {stone.name}
                  </h3>
                  <p className="text-xs text-[#A7ADB5] font-light line-clamp-2 mt-1.5">
                    {stone.description}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#0B2745] text-[11px] font-mono">
                  <div>
                    <span className="text-[#A7ADB5] block text-[9px]">COLOR</span>
                    <span className="text-[#F7F5EF] truncate block">{stone.color}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADB5] block text-[9px]">TREATMENT</span>
                    <span className="text-[#F0D27A] truncate block">{stone.treatment}</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-[#0B2745] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] text-[#A7ADB5] block font-mono">WHOLESALE</span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#F0D27A]">
                      {stone.priceFormatted || 'Price on Request'}
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onSelectStone(stone)}
                      className="p-2 rounded-lg bg-[#0B2745] hover:bg-[#60a5fa]/20 text-[#60a5fa] border border-[#1755af]/40 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                      title="Inspect Specifications"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onInquireStone(stone.name)}
                      className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-xs font-bold text-[#05080D] hover:opacity-90 transition-opacity cursor-pointer font-mono min-h-[38px]"
                    >
                      Inquire
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View All Sapphires CTA Banner */}
        <div className="mt-8 sm:mt-14 text-center">
          <button
            onClick={() => onViewSapphiresPage()}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-lg border border-[#60a5fa]/40 hover:border-[#60a5fa] bg-[#071522] hover:bg-[#0B2745] text-xs uppercase font-mono tracking-widest text-[#F7F5EF] transition-all cursor-pointer min-h-[44px]"
          >
            <span>VIEW ALL GEMSTONES</span>
            <ArrowRight className="w-4 h-4 text-[#60a5fa]" />
          </button>
        </div>

      </div>
    </section>
  );
};
