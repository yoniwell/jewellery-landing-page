import React, { useState } from 'react';
import { Sparkles, Shield, Eye, Phone, Send, Filter, CheckCircle2, ChevronRight, Gem } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface ParaibaPageProps {
  gemstones: Gemstone[];
  onSelectStone: (stone: Gemstone) => void;
  onOpenInquiry: (stoneName?: string) => void;
  onOpenWhatsAppWithStone: (stoneName: string) => void;
  onViewCertificate: (stone: Gemstone) => void;
}

export const ParaibaPage: React.FC<ParaibaPageProps> = ({
  gemstones,
  onSelectStone,
  onOpenInquiry,
  onOpenWhatsAppWithStone,
  onViewCertificate,
}) => {
  const [selectedShape, setSelectedShape] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter for Paraíba stones (category === 'paraiba' or rough with paraiba subcategory)
  const paraibaStones = gemstones.filter(
    (g) => g.category === 'paraiba' || g.subCategory === 'Rough Paraíba Tourmaline' || g.name.toLowerCase().includes('paraíba')
  );

  const filteredStones = paraibaStones.filter((stone) => {
    const matchShape = selectedShape === 'ALL' || stone.shapeCut.toLowerCase().includes(selectedShape.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || stone.status === statusFilter;
    return matchShape && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#05080D] pt-28 pb-24">
      
      {/* Top Hero Banner */}
      <div className="relative py-16 bg-gradient-to-b from-[#071522] via-[#05080D] to-[#05080D] border-b border-[#0B2745] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#14f1ce]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#14f1ce]/40 bg-[#071522] text-[#14f1ce] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRIMARY COMMERCIAL SPECIALTY</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-light text-[#F7F5EF]">
            Ethiopian <span className="text-[#14f1ce] font-semibold drop-shadow-[0_0_25px_rgba(20,241,206,0.3)]">Paraíba</span> Tourmaline
          </h1>

          <p className="font-serif-lux text-xl text-[#F0D27A] italic max-w-2xl mx-auto">
            Electric Color. Natural Beauty. Rare Material.
          </p>

          <p className="text-sm sm:text-base text-[#A7ADB5] max-w-3xl mx-auto font-light leading-relaxed">
            Discover our selection of Ethiopian Paraíba Tourmaline, sourced directly from Ethiopia and offered to international collectors, gemstone dealers and jewelry professionals. Each stone is selected for its color, character, quality and potential.
          </p>

          {/* Quick CTA */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => onOpenInquiry('Ethiopian Paraíba Tourmaline Sourcing')}
              className="px-6 py-3 rounded text-xs uppercase font-mono tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#14f1ce] to-[#2dd4bf] hover:shadow-[0_0_20px_rgba(20,241,206,0.4)] transition-all cursor-pointer"
            >
              Request Custom Parcel Sourcing
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 text-xs font-mono">
          
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#D6A83F] shrink-0" />
            <span className="text-[#A7ADB5] uppercase tracking-wider shrink-0 text-[10px] sm:text-xs">Shape:</span>
            {['ALL', 'Cushion', 'Oval', 'Crystal'].map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-2.5 sm:px-3 py-1 rounded transition-all cursor-pointer whitespace-nowrap min-h-[34px] text-[11px] sm:text-xs ${
                  selectedShape === shape
                    ? 'bg-[#14f1ce] text-[#05080D] font-bold shadow-sm'
                    : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF] border border-[#0B2745]'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[#A7ADB5] uppercase tracking-wider shrink-0 text-[10px] sm:text-xs">Status:</span>
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

          <div className="text-[11px] sm:text-xs text-[#14f1ce] pt-1 md:pt-0 border-t md:border-t-0 border-[#0B2745] flex items-center justify-between md:justify-end">
            <span>Showing <strong>{filteredStones.length}</strong> Paraíba specimens</span>
          </div>
        </div>
      </div>

      {/* Product Listings Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredStones.map((stone) => (
            <div
              key={stone.id}
              className="group rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#14f1ce]/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Image box */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#05080D] overflow-hidden">
                <img
                  src={stone.images[0]}
                  alt={stone.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#14f1ce] text-[9px] font-mono border border-[#14f1ce]/40 backdrop-blur-md">
                    {stone.weightCarats} ct
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 text-[#F0D27A] text-[9px] font-mono border border-[#D6A83F]/30 backdrop-blur-md">
                    {stone.shapeCut}
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
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-[#F7F5EF] group-hover:text-[#14f1ce] transition-colors truncate">
                    {stone.name}
                  </h3>
                  <p className="text-xs text-[#A7ADB5] font-light mt-1.5 line-clamp-2">
                    {stone.description}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="rounded-lg bg-[#05080D] p-2.5 sm:p-3 border border-[#0B2745] grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-[#A7ADB5] text-[9px] block">COLOR</span>
                    <span className="text-[#14f1ce] font-semibold truncate block">{stone.color}</span>
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

                {/* Certificate notification */}
                {stone.certificate && (
                  <button
                    onClick={() => onViewCertificate(stone)}
                    className="text-[11px] font-mono text-[#D6A83F] hover:text-[#F0D27A] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="truncate">Report: {stone.certificate.laboratory} #{stone.certificate.reportNumber}</span>
                  </button>
                )}

                {/* Price & Action Buttons */}
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
                      className="px-2.5 sm:px-3 py-2 rounded bg-[#0B2745] hover:bg-[#14f1ce]/20 text-[11px] sm:text-xs font-mono text-[#14f1ce] border border-[#14f1ce]/30 flex items-center gap-1 transition-colors cursor-pointer min-h-[38px] active:scale-95"
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
