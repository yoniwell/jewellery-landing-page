import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  Phone,
  Send,
  Eye,
  RotateCw,
  ZoomIn,
  FileText,
  ChevronRight,
  ChevronLeft,
  Gem,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  Award,
  Globe2,
  Truck
} from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface GemstoneInspectionPageProps {
  stone: Gemstone | null;
  allStones: Gemstone[];
  onBack: () => void;
  onSelectStone: (stone: Gemstone) => void;
  onOpenInquiry: (stoneName: string) => void;
  onOpenWhatsAppWithStone: (stoneName: string) => void;
  previousPageName?: string;
}

export const GemstoneInspectionPage: React.FC<GemstoneInspectionPageProps> = ({
  stone: initialStone,
  allStones,
  onBack,
  onSelectStone,
  onOpenInquiry,
  onOpenWhatsAppWithStone,
  previousPageName = 'Collection',
}) => {
  const currentStone = initialStone || allStones[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset image and angle whenever the stone changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLoupeActive(false);
    setRotationAngle(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStone?.id]);

  if (!currentStone) {
    return (
      <div className="min-h-screen bg-[#05080D] pt-32 pb-24 text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <Gem className="w-12 h-12 text-[#D6A83F] mx-auto opacity-50" />
          <h2 className="text-xl font-heading text-[#F7F5EF]">Specimen Not Found</h2>
          <p className="text-sm text-[#A7ADB5]">The selected gemstone could not be located in the current inventory.</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg bg-[#D6A83F] text-[#05080D] font-mono font-bold text-xs uppercase"
          >
            Return to {previousPageName}
          </button>
        </div>
      </div>
    );
  }

  // Find index in allStones to support Previous / Next specimen browsing
  const currentIndex = allStones.findIndex((s) => s.id === currentStone.id);
  const prevStone = currentIndex > 0 ? allStones[currentIndex - 1] : allStones[allStones.length - 1];
  const nextStone = currentIndex < allStones.length - 1 ? allStones[currentIndex + 1] : allStones[0];

  const handleRotate = () => {
    setIsRotating(true);
    setRotationAngle((prev) => (prev + 90) % 360);
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    AVAILABLE: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/40',
    RESERVED: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40',
    SOLD: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40',
    'COMING SOON': 'bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/40',
  };

  // Other specimens to browse at the bottom (excluding current stone)
  const otherStones = allStones.filter((s) => s.id !== currentStone.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#05080D] text-[#F7F5EF] pt-24 sm:pt-28 pb-20">
      
      {/* Top Header / Navigation Strip (Normal in-flow, non-sticky) */}
      <div className="border-b border-[#0B2745] bg-[#071522]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Back Button & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#05080D] border border-[#D6A83F]/30 hover:border-[#D6A83F] text-[#F0D27A] hover:text-[#F7F5EF] text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {previousPageName}</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#A7ADB5]">
              <span>/</span>
              <span className="text-[#D6A83F]">Specimen Inspection</span>
              <span>/</span>
              <span className="text-[#F7F5EF] truncate max-w-[200px]">{currentStone.name}</span>
            </div>
          </div>

          {/* Specimen Navigator (Prev / Next Stone) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F]/40 text-[#A7ADB5] hover:text-[#F7F5EF] text-xs font-mono transition-colors"
              title="Copy Specimen Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            {allStones.length > 1 && (
              <div className="flex items-center gap-1 bg-[#05080D] border border-[#0B2745] rounded-lg p-0.5">
                <button
                  onClick={() => onSelectStone(prevStone)}
                  className="px-2.5 py-1 text-xs font-mono text-[#A7ADB5] hover:text-[#F0D27A] hover:bg-[#071522] rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title={`Previous: ${prevStone.name}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <span className="text-[10px] font-mono text-[#A7ADB5]/60 px-1">
                  {currentIndex + 1} / {allStones.length}
                </span>
                <button
                  onClick={() => onSelectStone(nextStone)}
                  className="px-2.5 py-1 text-xs font-mono text-[#A7ADB5] hover:text-[#F0D27A] hover:bg-[#071522] rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title={`Next: ${nextStone.name}`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Inspection Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (6 cols): Gemstone High-Resolution Visual Studio */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Primary Image Box */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#03060A] border border-[#0B2745] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <img
                src={currentStone.images[activeImageIndex] || currentStone.images[0]}
                alt={currentStone.name}
                style={{
                  transform: `rotate(${rotationAngle}deg) ${isLoupeActive ? 'scale(1.75)' : 'scale(1)'}`,
                  transition: isRotating ? 'transform 0.5s ease-out' : 'transform 0.3s ease',
                }}
                className="w-full h-full object-cover object-center origin-center select-none"
              />

              {/* Gradient vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#03060A]/70 via-transparent to-transparent" />

              {/* Top Controls Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${statusColors[currentStone.status]}`}>
                    {currentStone.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#D6A83F] bg-[#05080D]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D6A83F]/30 uppercase">
                    REF: #{currentStone.id}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsLoupeActive(!isLoupeActive)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 backdrop-blur-md border transition-all cursor-pointer ${
                      isLoupeActive
                        ? 'bg-[#D6A83F] text-[#05080D] font-bold border-[#F0D27A]'
                        : 'bg-[#05080D]/85 text-[#F7F5EF] border-[#D6A83F]/40 hover:border-[#D6A83F]'
                    }`}
                    title="Toggle 10x Gemological Loupe Simulator"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{isLoupeActive ? 'Loupe Active' : '10x Loupe'}</span>
                  </button>

                  <button
                    onClick={handleRotate}
                    className="p-2 rounded-lg bg-[#05080D]/85 text-[#F7F5EF] border border-[#D6A83F]/40 hover:border-[#D6A83F] backdrop-blur-md transition-all cursor-pointer"
                    title="Rotate Specimen 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#F0D27A]" />
                  </button>
                </div>
              </div>

              {/* Bottom Quick Spec Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono bg-[#05080D]/90 px-3.5 py-2 rounded-xl border border-[#0B2745] backdrop-blur-md">
                <span className="text-[#14f1ce] font-medium truncate pr-2">{currentStone.color}</span>
                <span className="text-[#F0D27A] font-bold shrink-0">{currentStone.weightCarats} ct</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {currentStone.images.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#A7ADB5]">
                  <span>Specimen Photographic Angles</span>
                  <span>{activeImageIndex + 1} of {currentStone.images.length}</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {currentStone.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsLoupeActive(false);
                      }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#D6A83F] shadow-[0_0_15px_rgba(214,168,63,0.5)] scale-102'
                          : 'border-[#0B2745] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${currentStone.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sourcing & Chain-of-Custody Guarantee */}
            <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-2 text-xs text-[#A7ADB5]">
              <div className="flex items-center gap-2 text-[#D6A83F] font-mono font-bold uppercase tracking-wider text-[11px]">
                <Globe2 className="w-4 h-4" />
                <span>Direct African Mine Sourcing</span>
              </div>
              <p className="leading-relaxed">
                Extracted directly at the geological source in {currentStone.origin}. Zero middlemen. Every crystal is verified untreated or fully disclosed under strict international gemological standards.
              </p>
            </div>

          </div>

          {/* Right Column (6 cols): Gemological Dossier, Technical Spec Sheet, Acquisition */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Core Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D6A83F]">
                  Abel Gemstone · Direct Mine Specimen
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-normal text-[#F7F5EF] leading-tight">
                {currentStone.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[#14f1ce]">
                {currentStone.weightCarats} Carats · {currentStone.shapeCut} · {currentStone.color}
              </p>
            </div>

            {/* Wholesale Price & Acquisition Value Box */}
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              currentStone.status === 'SOLD'
                ? 'bg-gradient-to-r from-[#1f0b10] to-[#071522] border-[#ef4444]/40'
                : 'bg-gradient-to-r from-[#0B2745]/70 via-[#071522] to-[#05080D] border-[#D6A83F]/40'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#A7ADB5] block tracking-wider">
                  {currentStone.status === 'SOLD' ? 'COLLECTOR STATUS / ARCHIVE' : 'DIRECT WHOLESALE ACQUISITION'}
                </span>
                <div className={`text-2xl sm:text-3xl font-mono font-bold mt-0.5 ${
                  currentStone.status === 'SOLD' ? 'text-[#ef4444]' : 'text-[#F0D27A]'
                }`}>
                  {currentStone.status === 'SOLD' ? 'Acquired (Private Collection)' : (currentStone.priceFormatted || 'Price on Formal Request')}
                </div>
              </div>

              <div className="text-xs font-mono text-[#A7ADB5] sm:text-right">
                {currentStone.status === 'SOLD' ? (
                  <>
                    <span className="text-[#ef4444] font-bold block">Specimen Archived</span>
                    <span className="text-[#14f1ce]">Custom Sourcing Available</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#25D366] font-bold block">● Available for Export</span>
                    <span>Mine-Direct Wholesale Terms</span>
                  </>
                )}
              </div>
            </div>

            {/* Detailed Specimen Narrative */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A7ADB5] font-semibold">
                Geological & Gemological Overview
              </h3>
              <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
                {currentStone.description}
              </p>
            </div>

            {/* Rough Cutting Yield if applicable */}
            {currentStone.isRough && currentStone.cuttingPotential && (
              <div className="p-3.5 rounded-xl bg-[#05080D] border border-[#14f1ce]/30 space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#14f1ce] block font-bold tracking-wider">
                  ESTIMATED LAPIDARY YIELD & CUTTING POTENTIAL
                </span>
                <p className="text-xs text-[#F7F5EF] font-mono leading-relaxed">
                  {currentStone.cuttingPotential}
                </p>
              </div>
            )}

            {/* Technical Specification Dossier Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A7ADB5] font-semibold">
                Complete Laboratory & Physical Specifications
              </h3>
              
              <div className="rounded-xl border border-[#0B2745] bg-[#05080D] divide-y divide-[#0B2745] text-xs font-mono">
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Carat Weight</span>
                  <span className="text-[#F7F5EF] font-bold">{currentStone.weightCarats} ct</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Shape & Cut</span>
                  <span className="text-[#F7F5EF]">{currentStone.shapeCut}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Measurements / Dimensions</span>
                  <span className="text-[#F7F5EF]">{currentStone.dimensions}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Color Variety</span>
                  <span className="text-[#14f1ce] font-semibold">{currentStone.color}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Geographic Origin</span>
                  <span className="text-[#F0D27A] font-bold">{currentStone.origin}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Treatment Disclosure</span>
                  <span className="text-[#25D366] font-medium">{currentStone.treatment}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#A7ADB5]">Clarity Grading</span>
                  <span className="text-[#F7F5EF]">{currentStone.clarity}</span>
                </div>
              </div>
            </div>

            {/* Direct Acquisition Action Desk */}
            <div className="pt-4 border-t border-[#0B2745] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-[#D6A83F] tracking-wider font-bold">
                  {currentStone.status === 'SOLD'
                    ? 'COMMISSION EQUIVALENT SOURCING'
                    : 'DIRECT WHOLESALE ACQUISITION'}
                </span>
                <span className="text-[11px] font-mono text-[#A7ADB5]">
                  Ref #{currentStone.id}
                </span>
              </div>

              {currentStone.status === 'SOLD' && (
                <div className="p-3 rounded-xl bg-[#05080D] border border-[#ef4444]/30 text-xs font-mono text-[#A7ADB5] leading-relaxed">
                  This specimen has been acquired by a private collector. You may commission Abel Gemstone to source a matching raw crystal or precision faceted piece directly from our African mining network.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onOpenWhatsAppWithStone(currentStone.name)}
                  className="w-full py-3.5 px-4 rounded-xl text-xs uppercase font-mono tracking-wider font-bold text-[#F7F5EF] bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all cursor-pointer min-h-[48px] active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </button>

                <button
                  onClick={() => onOpenInquiry(currentStone.status === 'SOLD' ? `Custom Sourcing Request (Similar to ${currentStone.name})` : currentStone.name)}
                  className="w-full py-3.5 px-4 rounded-xl text-xs uppercase font-mono tracking-wider font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:opacity-95 flex items-center justify-center gap-2.5 transition-all cursor-pointer min-h-[48px] shadow-[0_0_20px_rgba(214,168,63,0.3)] active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{currentStone.status === 'SOLD' ? 'Inquire Similar Sourcing' : 'Send Formal Inquiry'}</span>
                </button>
              </div>

              {/* Courier & Security Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono text-[#A7ADB5]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745]">
                  <Truck className="w-4 h-4 text-[#D6A83F] shrink-0" />
                  <span className="truncate">Insured Global Courier</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745]">
                  <Shield className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span className="truncate">Escrow Verification</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Other Rare Specimens Carousel / Grid */}
        {otherStones.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#0B2745]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                  EXPLORE THE VAULT
                </span>
                <h2 className="text-xl sm:text-2xl font-heading text-[#F7F5EF]">
                  Other Rare African Specimens
                </h2>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-mono text-[#F0D27A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Collection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {otherStones.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectStone(item)}
                  className="group bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(214,168,63,0.15)] flex flex-col justify-between"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#05080D]">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border backdrop-blur-md ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#05080D]/80 backdrop-blur-md text-[10px] font-mono text-[#F0D27A] font-bold border border-[#0B2745]">
                      {item.weightCarats} ct
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-mono text-[#14f1ce] truncate">
                        {item.origin}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#0B2745] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#D6A83F] font-bold">
                        {item.priceFormatted || 'Price on Request'}
                      </span>
                      <span className="text-[#A7ADB5] group-hover:text-[#F7F5EF] flex items-center gap-1 text-[11px]">
                        Inspect <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
