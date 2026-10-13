import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface HeroSectionProps {
  gemstones?: Gemstone[];
  onExploreParaiba: () => void;
  onContactUs: () => void;
  onSelectStone: (stone: Gemstone) => void;
  featuredStone?: Gemstone;
}

interface HeroSlide {
  id: string;
  image: string;
  imageIndex: number;
  totalImagesForStone: number;
  stone?: Gemstone;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  gemstones = [],
  onExploreParaiba,
  onContactUs,
  onSelectStone,
  featuredStone,
}) => {
  // Aggregate all gemstone images from the entire inventory for the hero loop
  const slides = useMemo<HeroSlide[]>(() => {
    if (!gemstones || gemstones.length === 0) {
      return [];
    }

    const items: HeroSlide[] = [];
    gemstones.forEach((stone) => {
      const stoneImages = (stone.images && stone.images.length > 0)
        ? stone.images
        : [];

      stoneImages.forEach((imgUrl, imgIdx) => {
        items.push({
          id: `${stone.id}-img-${imgIdx}`,
          image: imgUrl,
          imageIndex: imgIdx,
          totalImagesForStone: stoneImages.length,
          stone,
        });
      });
    });

    return items;
  }, [gemstones]);

  // Current active slide index in the loop
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safe bounds guard if gemstones array changes
  const activeIndex = slides.length > 0 ? Math.min(currentIndex, slides.length - 1) : 0;
  const currentSlide = slides[activeIndex] || slides[0];

  // Loop navigation handlers
  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Jump directly to the first image of a specific gemstone
  const jumpToStone = (stoneId: string) => {
    const targetIdx = slides.findIndex((s) => s.stone?.id === stoneId);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }
  };

  // Keyboard navigation support (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Top distinct specimens for quick switcher
  const distinctStones = useMemo(() => {
    return gemstones.slice(0, 5);
  }, [gemstones]);

  const activeStoneId = currentSlide?.stone?.id;

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

            {/* Main Luxury Headline */}
            <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl font-light text-[#F7F5EF] leading-[1.15] sm:leading-[1.12] tracking-tight">
              Rare Stones. <br />
              <span className="font-semibold gold-gradient-text">Direct Sources.</span> <br />
              <span className="font-normal italic font-serif-lux text-[#F7F5EF]/90">Exceptional Color.</span>
            </h1>

            {/* Supporting Text (concise, high-impact) */}
            <p className="text-xs sm:text-base text-[#A7ADB5] max-w-xl font-light leading-relaxed">
              Exceptional untreated and natural gemstones. Sourced directly at mine level in Africa for international collectors, dealers, and luxury jewelers.
            </p>


            {/* Action Buttons: EXPLORE GEMSTONES | CONTACT US */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={onExploreParaiba}
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-heading text-xs uppercase tracking-[0.18em] font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] via-[#F0D27A] to-[#D6A83F] hover:shadow-[0_0_30px_rgba(214,168,63,0.5)] transition-all duration-300 cursor-pointer overflow-hidden min-h-[46px] sm:min-h-[48px] active:scale-[0.99]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORE GEMSTONES
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

          {/* Right Column: Hero Gemstone Interactive Image Loop Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Luxury Frame with glowing border */}
              <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#D6A83F]/40 via-[#0B2745] to-[#071522] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="relative rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745]">
                  
                  {slides.length === 0 ? (
                    <div className="relative aspect-square w-full bg-[#05080D] flex flex-col items-center justify-center p-6 sm:p-8 text-center select-none">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B2745]/60 border border-[#D6A83F]/30 flex items-center justify-center text-[#D6A83F] mb-4 shadow-inner">
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#071522] border border-[#D6A83F]/30 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#F0D27A] mb-2">
                        DIRECT AFRICAN SOURCING
                      </span>
                      <h4 className="font-heading text-base sm:text-lg font-light text-[#F7F5EF] mb-2">
                        Vault Inventory
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#A7ADB5] max-w-xs font-light leading-relaxed">
                        No gemstone specimens published yet. Upload stones with photographs from the Admin Dashboard to showcase them here.
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => currentSlide?.stone && onSelectStone(currentSlide.stone)}
                      className="relative aspect-square w-full bg-[#05080D] overflow-hidden select-none cursor-pointer group"
                      title={currentSlide?.stone?.name ? `Click to inspect ${currentSlide.stone.name}` : undefined}
                    >
                      <img
                        key={currentSlide?.image}
                        src={currentSlide?.image}
                        alt={currentSlide?.stone?.name || 'Featured Gemstone'}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
                      />

                      {/* PREVIOUS & NEXT BUTTONS (Only when multiple images exist) */}
                      {slides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrev();
                            }}
                            aria-label="Previous gemstone image"
                            title="Previous Gemstone Image"
                            className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#05080D]/80 hover:bg-[#D6A83F] text-[#F7F5EF] hover:text-[#05080D] border border-[#D6A83F]/60 shadow-[0_4px_24px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-90 group/btn"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNext();
                            }}
                            aria-label="Next gemstone image"
                            title="Next Gemstone Image"
                            className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#05080D]/80 hover:bg-[#D6A83F] text-[#F7F5EF] hover:text-[#05080D] border border-[#D6A83F]/60 shadow-[0_4px_24px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-90 group/btn"
                          >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </>
                      )}
                      
                      {/* Minimal Top Badges & Loop Counter */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono tracking-wider border font-bold bg-[#05080D]/85 text-[#F0D27A] border-[#D6A83F]/40 backdrop-blur-md">
                          NATURAL SPECIMEN
                        </span>

                        {slides.length > 1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold bg-[#05080D]/85 text-[#F0D27A] border border-[#D6A83F]/40 backdrop-blur-md shadow flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-[#D6A83F]" />
                            <span>{activeIndex + 1} / {slides.length}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Decorative luxury seal */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#D6A83F] to-[#A87E23] p-[2px] shadow-xl hidden sm:flex items-center justify-center pointer-events-none">
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
