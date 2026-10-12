import React, { useState, useMemo } from 'react';
import { Gem, Shield, Eye, Phone, Send, Search, Sparkles, Filter, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface GemstonesPageProps {
  gemstones: Gemstone[];
  onSelectStone: (stone: Gemstone) => void;
  onOpenInquiry: (stoneName?: string) => void;
  onOpenWhatsAppWithStone: (stoneName: string) => void;
}

export const GemstonesPage: React.FC<GemstonesPageProps> = ({
  gemstones,
  onSelectStone,
  onOpenInquiry,
  onOpenWhatsAppWithStone,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'carat-desc' | 'carat-asc' | 'name'>('featured');

  const filteredAndSortedStones = useMemo(() => {
    let result = gemstones.filter((stone) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        stone.name.toLowerCase().includes(q) ||
        stone.color.toLowerCase().includes(q) ||
        stone.shapeCut.toLowerCase().includes(q) ||
        stone.origin.toLowerCase().includes(q) ||
        stone.treatment.toLowerCase().includes(q) ||
        (stone.subCategory && stone.subCategory.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'ALL' || stone.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (sortBy === 'carat-desc') {
      result.sort((a, b) => b.weightCarats - a.weightCarats);
    } else if (sortBy === 'carat-asc') {
      result.sort((a, b) => a.weightCarats - b.weightCarats);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [gemstones, searchQuery, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#05080D] pt-28 pb-24">
      
      {/* Top Banner */}
      <div className="relative py-16 sm:py-20 bg-gradient-to-b from-[#0B2745]/30 via-[#071522] to-[#05080D] border-b border-[#0B2745] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6A83F]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#14f1ce]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/40 bg-[#071522] text-[#F0D27A] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A83F]" />
            <span>EXCLUSIVE MASTER INVENTORY · DIRECT FIELD SOURCING</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-light text-[#F7F5EF]">
            Natural <span className="gold-gradient-text font-semibold">Gemstones</span> Portfolio
          </h1>

          <p className="font-serif-lux text-xl sm:text-2xl text-[#F0D27A] italic max-w-2xl mx-auto">
            Ethically Sourced. Museum Grade. Master Faceted & Direct Mine Crystals.
          </p>

          <p className="text-sm sm:text-base text-[#A7ADB5] max-w-3xl mx-auto font-light leading-relaxed">
            Discover our complete inventory of rare colored gemstones, rough parcels, and certified investment specimens sourced directly through primary field operations in East Africa and premier geological deposits.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenInquiry('Complete Gemstone Portfolio Inquiry')}
              className="px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer min-h-[44px]"
            >
              Wholesale Portfolio Inquiry
            </button>
            <button
              onClick={() => onOpenWhatsAppWithStone('Wholesale Gemstone Availability')}
              className="px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-medium text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct WhatsApp Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-[#071522] border border-[#0B2745] rounded-xl p-4 sm:p-5 shadow-xl mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A7ADB5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by gemstone name, cut, color, origin, or treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F]/60 text-xs sm:text-sm text-[#F7F5EF] placeholder-[#A7ADB5]/60 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A7ADB5] hover:text-[#F7F5EF]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Availability Filter & Sort Control */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-[#A7ADB5]">
                <Filter className="w-3.5 h-3.5 text-[#D6A83F]" />
                <span className="font-mono hidden sm:inline">Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#05080D] border border-[#0B2745] text-xs text-[#F7F5EF] rounded-lg px-3 py-2 font-mono focus:border-[#D6A83F]/60 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available Now</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold Archive</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-[#A7ADB5] ml-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#D6A83F]" />
                <span className="font-mono hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#05080D] border border-[#0B2745] text-xs text-[#F7F5EF] rounded-lg px-3 py-2 font-mono focus:border-[#D6A83F]/60 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Order</option>
                <option value="carat-desc">Carats: High to Low</option>
                <option value="carat-asc">Carats: Low to High</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Count and Quick Indicators */}
          <div className="text-[11px] sm:text-xs text-[#A7ADB5] pt-2 border-t border-[#0B2745] flex items-center justify-between flex-wrap gap-2">
            <span>
              Showing <strong className="text-[#F0D27A]">{filteredAndSortedStones.length}</strong> natural certified gemstones
            </span>
            <span className="text-[10px] text-[#A7ADB5]/80 font-mono">
              Direct African & International Sourcing · Laboratory Verified
            </span>
          </div>
        </div>

        {/* Gemstones Grid */}
        {filteredAndSortedStones.length === 0 ? (
          <div className="text-center py-20 bg-[#071522] rounded-xl border border-[#0B2745] p-8 space-y-3">
            <Gem className="w-10 h-10 text-[#D6A83F] mx-auto opacity-50" />
            <h3 className="text-lg font-heading text-[#F7F5EF]">No gemstones match your search criteria</h3>
            <p className="text-xs text-[#A7ADB5] max-w-md mx-auto">
              Try adjusting your search terms or status filter. Our gemologists can also source specific custom parcels.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="mt-3 px-4 py-2 text-xs font-mono uppercase text-[#F0D27A] border border-[#D6A83F]/30 rounded hover:bg-[#0B2745]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredAndSortedStones.map((stone) => {
              const isAvailable = stone.status === 'AVAILABLE';
              const isReserved = stone.status === 'RESERVED';

              return (
                <div
                  key={stone.id}
                  className="group relative rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(214,168,63,0.15)]"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => onSelectStone(stone)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#05080D] cursor-pointer"
                  >
                    <img
                      src={stone.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'}
                      alt={stone.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold border backdrop-blur-md uppercase ${
                          isAvailable
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                            : isReserved
                            ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-700/40'
                        }`}
                      >
                        {stone.status}
                      </span>
                    </div>

                    {/* Weight Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded bg-[#05080D]/85 text-[#F0D27A] text-[10px] font-mono border border-[#D6A83F]/40 backdrop-blur-md font-bold">
                        {stone.weightCarats} ct
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => onSelectStone(stone)}
                          className="font-heading text-lg font-medium text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors cursor-pointer leading-snug"
                        >
                          {stone.name}
                        </h3>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 pb-2 border-b border-[#0B2745]/70">
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px]">COLOR:</span>
                          <span className="text-[#F7F5EF] truncate block">{stone.color}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px]">CUT / SHAPE:</span>
                          <span className="text-[#F7F5EF] truncate block">{stone.shapeCut}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px]">ORIGIN:</span>
                          <span className="text-[#F7F5EF] truncate block">{stone.origin}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px]">TREATMENT:</span>
                          <span className="text-[#F7F5EF] truncate block">{stone.treatment}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#A7ADB5] font-light pt-2 line-clamp-2 leading-relaxed">
                        {stone.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectStone(stone)}
                          className="w-full py-2.5 rounded bg-[#0B2745]/60 hover:bg-[#0B2745] border border-[#0B2745] hover:border-[#D6A83F]/40 text-xs font-mono text-[#F7F5EF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D6A83F]" />
                          <span>View Details</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onOpenInquiry(stone.name)}
                          className="py-2.5 px-3 rounded text-[11px] uppercase tracking-wider font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_15px_rgba(214,168,63,0.3)] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Inquire</span>
                        </button>
                        <button
                          onClick={() => onOpenWhatsAppWithStone(stone.name)}
                          className="py-2.5 px-3 rounded text-[11px] font-mono text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Sourcing VIP Section at bottom */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B2745]/50 to-[#071522] border border-[#D6A83F]/30 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-[#D6A83F] mx-auto" />
          <h2 className="font-heading text-2xl sm:text-3xl text-[#F7F5EF]">
            Looking for a Specific Gemstone or Parcel?
          </h2>
          <p className="text-xs sm:text-sm text-[#A7ADB5] max-w-2xl mx-auto font-light leading-relaxed">
            Our direct mining relationships and local lapidary operations allow us to fulfill specific dealer, collector, and high-jewelry requirements across cut styles, carat sizes, and rare colors.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onOpenInquiry('Custom Gemstone Sourcing Request')}
              className="px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer"
            >
              Request Custom Sourcing
            </button>
            <button
              onClick={() => onOpenWhatsAppWithStone('Custom Sourcing Desk')}
              className="px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-medium text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Talk with Gemologist</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
