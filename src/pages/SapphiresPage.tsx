import React, { useState } from 'react';
import { Gem, Shield, Eye, Phone, Send, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface SapphiresPageProps {
  gemstones: Gemstone[];
  onSelectStone: (stone: Gemstone) => void;
  onOpenInquiry: (stoneName?: string) => void;
  onOpenWhatsAppWithStone: (stoneName: string) => void;
}

export const SapphiresPage: React.FC<SapphiresPageProps> = ({
  gemstones,
  onSelectStone,
  onOpenInquiry,
  onOpenWhatsAppWithStone,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const sapphireStones = gemstones.filter(
    (g) => g.category === 'sapphire' || g.category === 'padparadscha' || g.subCategory?.includes('Sapphire')
  );

  const categories = [
    'ALL',
    'Royal Blue',
    'Cornflower Blue',
    'Padparadscha',
    'Bi-Color',
    'Yellow Sapphire',
    'Star Sapphire',
  ];

  const filteredStones = sapphireStones.filter((s) => {
    const matchCat = activeCategory === 'ALL' || s.subCategory === activeCategory;
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#05080D] pt-28 pb-24">
      
      {/* Top Banner */}
      <div className="relative py-16 bg-gradient-to-b from-[#0B2745]/40 via-[#071522] to-[#05080D] border-b border-[#0B2745] overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#1755af]/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#60a5fa]/40 bg-[#071522] text-[#60a5fa] text-xs font-mono uppercase tracking-widest">
            <Gem className="w-3.5 h-3.5" />
            <span>FINE SAPPHIRES</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-light text-[#F7F5EF]">
            Natural <span className="text-[#60a5fa] font-semibold">Sapphires</span>
          </h1>

          <p className="font-serif-lux text-xl text-[#F0D27A] italic max-w-2xl mx-auto">
            From vibrant Cornflower and Royal Blue to rare collector hues.
          </p>

          <p className="text-sm sm:text-base text-[#A7ADB5] max-w-3xl mx-auto font-light leading-relaxed">
            Renowned for exceptional natural purity and color saturation, from vibrant cornflower blue and royal blue to rare colors. Abel Gemstone offers selected rough and finished sapphires for collectors, dealers and international jewelry buyers.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => onOpenInquiry('Sapphires Portfolio Sourcing')}
              className="px-6 py-3 rounded text-xs uppercase font-mono tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer"
            >
              Inquire Sapphire Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Availability Toolbar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-3 sm:space-y-4">
        <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[#A7ADB5] uppercase tracking-wider text-[10px] sm:text-xs shrink-0">Sub-Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[34px] text-[11px] sm:text-xs ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#1755af] to-[#0B2745] text-[#F7F5EF] border border-[#60a5fa] font-medium'
                    : 'bg-[#05080D] text-[#A7ADB5] border border-[#0B2745] hover:text-[#F7F5EF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[#A7ADB5] uppercase tracking-wider text-[10px] sm:text-xs shrink-0">Status:</span>
            {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 sm:px-3 py-1 rounded transition-all cursor-pointer whitespace-nowrap min-h-[34px] text-[11px] sm:text-xs ${
                  statusFilter === status
                    ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-sm'
                    : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF] border border-[#0B2745]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="text-[11px] sm:text-xs text-[#60a5fa] pt-1 md:pt-0 border-t md:border-t-0 border-[#0B2745] flex items-center justify-between md:justify-end">
            <span>Showing <strong>{filteredStones.length}</strong> certified sapphire specimens</span>
          </div>
        </div>
      </div>

      {/* Product Listings Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredStones.map((stone) => (
            <div
              key={stone.id}
              className="group rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#60a5fa]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#05080D] overflow-hidden">
                <img
                  src={stone.images[0]}
                  alt={stone.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80" />

                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#60a5fa] text-[9px] font-mono border border-[#1755af]/50 backdrop-blur-sm">
                    {stone.weightCarats} ct
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#F0D27A] text-[9px] font-mono border border-[#D6A83F]/30 backdrop-blur-sm">
                    {stone.subCategory || 'Natural Sapphire'}
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

              <div className="p-4 sm:p-5 lg:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-[#F7F5EF] group-hover:text-[#60a5fa] transition-colors truncate">
                    {stone.name}
                  </h3>
                  <p className="text-xs text-[#A7ADB5] font-light mt-1.5 line-clamp-2">
                    {stone.description}
                  </p>
                </div>

                <div className="rounded-lg bg-[#05080D] p-2.5 sm:p-3 border border-[#0B2745] grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-[#A7ADB5] text-[9px] block">COLOR</span>
                    <span className="text-[#F7F5EF] font-semibold truncate block">{stone.color}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADB5] text-[9px] block">ORIGIN</span>
                    <span className="text-[#F7F5EF] truncate block">{stone.origin}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADB5] text-[9px] block">TREATMENT</span>
                    <span className="text-[#25D366] truncate block">{stone.treatment}</span>
                  </div>
                  <div>
                    <span className="text-[#A7ADB5] text-[9px] block">DIMENSIONS</span>
                    <span className="text-[#F7F5EF] truncate block">{stone.dimensions}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0B2745] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase text-[#A7ADB5] block font-mono">Wholesale</span>
                    <strong className="text-xs sm:text-sm font-mono text-[#F0D27A] font-bold truncate block">
                      {stone.priceFormatted || 'Price on Request'}
                    </strong>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={() => onSelectStone(stone)}
                      className="px-2.5 sm:px-3 py-2 rounded bg-[#0B2745] hover:bg-[#60a5fa]/20 text-[11px] sm:text-xs font-mono text-[#60a5fa] border border-[#1755af]/40 flex items-center gap-1 transition-colors cursor-pointer min-h-[38px] active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => onOpenInquiry(stone.name)}
                      className="px-3 sm:px-3.5 py-2 rounded bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[11px] sm:text-xs font-mono font-bold text-[#05080D] hover:opacity-90 transition-opacity cursor-pointer min-h-[38px] active:scale-95"
                    >
                      Inquire
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
