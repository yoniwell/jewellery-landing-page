import React, { useState, useMemo } from 'react';
import { Sparkles, Search, ArrowRight, ShieldCheck, Eye, Phone, SlidersHorizontal, CheckCircle2, Award, ChevronRight, Play, Gem } from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface HomeGemstoneVaultProps {
  gemstones: Gemstone[];
  onSelectStone: (stone: Gemstone) => void;
  onInquireStone: (stoneName?: string) => void;
  onViewAllStones: () => void;
}

export const HomeGemstoneVault: React.FC<HomeGemstoneVaultProps> = ({
  gemstones,
  onSelectStone,
  onInquireStone,
  onViewAllStones,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'RESERVED'>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'newest'>('featured');

  // Filter and sort stones
  const filteredStones = useMemo(() => {
    let result = [...gemstones];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(stone => stone.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(stone =>
        stone.name.toLowerCase().includes(q) ||
        stone.color.toLowerCase().includes(q) ||
        stone.shapeCut.toLowerCase().includes(q) ||
        stone.origin.toLowerCase().includes(q) ||
        stone.treatment.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime();
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return result;
  }, [gemstones, statusFilter, searchQuery, sortBy]);

  // Display top 6 stones on homepage
  const displayedStones = filteredStones.slice(0, 6);

  const availableCount = useMemo(() => {
    return gemstones.filter(s => s.status === 'AVAILABLE').length;
  }, [gemstones]);

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#05080D] relative border-t border-[#0B2745]/60">
      
      {/* Background atmospheric luxury glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#D6A83F]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#14f1ce]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#071522] text-[#F0D27A] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#D6A83F]" />
            <span>LIVE GEMSTONE INVENTORY · MINE-TO-MARKET</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF] leading-tight">
            The Abel Gemstone <span className="gold-gradient-text font-normal">Vault</span>
          </h2>

          <p className="font-serif-lux text-base sm:text-lg text-[#F0D27A]/90 italic">
            Directly sourced natural gemstones, precision-cut for collectors and luxury jewellers.
          </p>

          <p className="text-xs sm:text-sm md:text-base text-[#A7ADB5] font-light leading-relaxed max-w-2xl mx-auto">
            Every stone is individually evaluated at origin, ethically acquired, and cut to optimize optical scintillation. Full disclosure and independent laboratory documentation provided for every specimen.
          </p>

          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-3" />
        </div>

        {/* Real-time stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] text-center">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#F7F5EF]">{gemstones.length}</span>
            <span className="block text-[10px] sm:text-xs font-mono uppercase text-[#A7ADB5] mt-0.5">Total Specimens</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] text-center">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#25D366]">{availableCount}</span>
            <span className="block text-[10px] sm:text-xs font-mono uppercase text-[#A7ADB5] mt-0.5">Available Now</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] text-center">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#D6A83F]">100%</span>
            <span className="block text-[10px] sm:text-xs font-mono uppercase text-[#A7ADB5] mt-0.5">Direct Sourced</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] text-center">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#60a5fa]">GIA / SSEF</span>
            <span className="block text-[10px] sm:text-xs font-mono uppercase text-[#A7ADB5] mt-0.5">Lab Certified</span>
          </div>
        </div>

        {/* Live Filter & Search Toolbar */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#071522] border border-[#0B2745] mb-6 sm:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A7ADB5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gemstones by name, cut, origin, color or lab..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#05080D] border border-[#0B2745] text-xs sm:text-sm text-[#F7F5EF] placeholder-[#A7ADB5]/60 focus:border-[#D6A83F] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Status Segmented Buttons */}
            <div className="flex items-center rounded-lg bg-[#05080D] border border-[#0B2745] p-0.5">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-mono transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-[#0B2745] text-[#F7F5EF] font-bold border border-[#D6A83F]/30 shadow-sm'
                    : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setStatusFilter('AVAILABLE')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-mono transition-all cursor-pointer ${
                  statusFilter === 'AVAILABLE'
                    ? 'bg-[#25D366]/20 text-[#25D366] font-bold border border-[#25D366]/40'
                    : 'text-[#A7ADB5] hover:text-[#25D366]'
                }`}
              >
                AVAILABLE
              </button>
              <button
                onClick={() => setStatusFilter('RESERVED')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-mono transition-all cursor-pointer ${
                  statusFilter === 'RESERVED'
                    ? 'bg-[#f59e0b]/20 text-[#fbbf24] font-bold border border-[#f59e0b]/40'
                    : 'text-[#A7ADB5] hover:text-[#fbbf24]'
                }`}
              >
                RESERVED
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#A7ADB5]">
              <span className="hidden sm:inline font-mono">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[11px] sm:text-xs text-[#F7F5EF] focus:border-[#D6A83F] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="name">Name: A to Z</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

        </div>

        {/* Gemstones Grid */}
        {displayedStones.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-[#071522] border border-[#0B2745] p-6">
            <p className="text-sm text-[#A7ADB5]">No gemstones match your search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
              className="mt-3 px-4 py-2 rounded-lg bg-[#0B2745] text-xs text-[#F0D27A] font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {displayedStones.map((stone) => {
              const isAvailable = stone.status === 'AVAILABLE';

              return (
                <div
                  key={stone.id}
                  className="group relative rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {/* Image Container with Badges */}
                  <div
                    onClick={() => onSelectStone(stone)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#05080D] cursor-pointer flex items-center justify-center"
                  >
                    {stone.images && stone.images.length > 0 ? (
                      <img
                        src={stone.images[0]}
                        alt={stone.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : stone.videoUrl ? (
                      <div className="relative w-full h-full">
                        <video
                          src={stone.videoUrl}
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-[#F0D27A] flex items-center gap-1 font-mono border border-[#D6A83F]/30 z-10">
                          <Play className="w-2.5 h-2.5 fill-[#F0D27A]" /> VIDEO
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#071522] text-[#8EA3B8] gap-2 p-4 text-center">
                        <Gem className="w-8 h-8 text-[#D6A83F]/40" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Specimen Available</span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                        isAvailable
                          ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 backdrop-blur-md'
                          : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40 backdrop-blur-md'
                      }`}>
                        {stone.status}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#05080D]/85 text-[#F0D27A] border border-[#D6A83F]/40 backdrop-blur-md">
                        {stone.shapeCut}
                      </span>
                    </div>
                  </div>

                  {/* Stone Information */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name */}
                      <h3
                        onClick={() => onSelectStone(stone)}
                        className="font-heading text-sm sm:text-base font-semibold text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors cursor-pointer line-clamp-1"
                      >
                        {stone.name}
                      </h3>

                      {/* Color & Cut Description */}
                      <p className="text-xs text-[#D6A83F] font-mono mt-1">
                        {stone.color}
                      </p>

                      {/* Specifications Grid */}
                      <div className="mt-3 pt-3 border-t border-[#0B2745] grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px] uppercase font-mono">Shape & Cut</span>
                          <span className="text-[#F7F5EF] font-medium truncate block">{stone.shapeCut}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px] uppercase font-mono">Origin</span>
                          <span className="text-[#F7F5EF] font-medium truncate block">{stone.origin}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px] uppercase font-mono">Treatment</span>
                          <span className="text-[#F7F5EF] font-medium truncate block">{stone.treatment}</span>
                        </div>
                        <div>
                          <span className="text-[#A7ADB5] block text-[10px] uppercase font-mono">Dimensions</span>
                          <span className="text-[#F7F5EF] font-medium truncate block">{stone.dimensions || 'Precision Cut'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-[#0B2745] flex items-center gap-2">
                      <button
                        onClick={() => onSelectStone(stone)}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-[#0B2745] hover:bg-[#D6A83F]/20 text-xs text-[#F7F5EF] hover:text-[#F0D27A] border border-[#D6A83F]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px] active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Stone</span>
                      </button>

                      <button
                        onClick={() => onInquireStone(stone.name)}
                        className="py-2 px-3 rounded-lg bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-xs font-semibold text-[#05080D] hover:opacity-90 flex items-center justify-center gap-1 transition-opacity cursor-pointer min-h-[38px] active:scale-95 shrink-0"
                      >
                        <span>Inquire</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Inventory Master CTA Bar */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071522] via-[#0B2745] to-[#071522] border border-[#D6A83F]/40 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A83F]/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#F0D27A]">
              COMPLETE DIRECT COLLECTION
            </span>
            <h3 className="font-heading text-xl sm:text-3xl font-light text-[#F7F5EF]">
              Access the Entire <span className="gold-gradient-text font-normal">Natural Gemstone Portfolio</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
              Explore our full inventory with advanced faceted specifications, high-definition 360° videos, and laboratory verification reports.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onViewAllStones}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] via-[#F0D27A] to-[#D6A83F] hover:shadow-[0_0_25px_rgba(214,168,63,0.4)] transition-all cursor-pointer min-h-[44px]"
              >
                <span>VIEW COMPLETE INVENTORY ({gemstones.length} STONES)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => onInquireStone('Custom Gemstone Sourcing Request')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-medium text-[#F7F5EF] border border-[#D6A83F]/40 hover:border-[#D6A83F] bg-[#05080D]/60 hover:bg-[#071522] transition-all cursor-pointer min-h-[44px]"
              >
                <span>REQUEST CUSTOM SOURCING</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
