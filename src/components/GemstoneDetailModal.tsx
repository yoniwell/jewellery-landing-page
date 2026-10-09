import React, { useState } from 'react';
import { 
  X, Shield, Phone, Mail, Send, Eye, CheckCircle2, RotateCw, 
  Sparkles, ZoomIn, FileText, ChevronRight, Gem, AlertCircle
} from 'lucide-react';
import { Gemstone } from '../types/gemstone';

interface GemstoneDetailModalProps {
  stone: Gemstone | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInquiry: (stoneName: string) => void;
  onOpenWhatsAppWithStone: (stoneName: string) => void;
  onViewCertificate: (stone: Gemstone) => void;
}

export const GemstoneDetailModal: React.FC<GemstoneDetailModalProps> = ({
  stone,
  isOpen,
  onClose,
  onOpenInquiry,
  onOpenWhatsAppWithStone,
  onViewCertificate,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  if (!isOpen || !stone) return null;

  const handleRotate = () => {
    setIsRotating(true);
    setRotationAngle((prev) => (prev + 90) % 360);
    setTimeout(() => setIsRotating(false), 500);
  };

  const statusColors = {
    AVAILABLE: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30',
    RESERVED: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
    SOLD: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30',
    'COMING SOON': 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/30',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-5xl w-full bg-[#071522] border border-[#D6A83F]/40 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden my-3 sm:my-6 relative flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-6 bg-[#05080D] border-b border-[#0B2745] flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono font-bold border shrink-0 ${statusColors[stone.status]}`}>
              {stone.status}
            </span>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-[#D6A83F] uppercase tracking-widest block truncate">
                REF: #{stone.id}
              </span>
              <h2 className="font-heading text-base sm:text-2xl font-bold text-[#F7F5EF] truncate">
                {stone.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#071522] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left: Gemstone Visual Studio (Photos, 360 Spin, Loupe) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#05080D] border border-[#0B2745] group">
              <img
                src={stone.images[activeImageIndex] || stone.images[0]}
                alt={stone.name}
                style={{
                  transform: `rotate(${rotationAngle}deg) ${isLoupeActive ? 'scale(1.8)' : 'scale(1)'}`,
                  transition: isRotating ? 'transform 0.5s ease-out' : 'transform 0.3s ease',
                }}
                className="w-full h-full object-cover object-center origin-center select-none"
              />
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05080D]/80 via-transparent to-transparent" />

              {/* Visual Controls Overlay */}
              <div className="absolute top-2.5 left-2.5 flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => setIsLoupeActive(!isLoupeActive)}
                  className={`p-1.5 sm:p-2 rounded-lg text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md border transition-all cursor-pointer min-h-[36px] ${
                    isLoupeActive
                      ? 'bg-[#D6A83F] text-[#05080D] font-bold border-[#F0D27A]'
                      : 'bg-[#05080D]/80 text-[#F7F5EF] border-[#D6A83F]/30 hover:border-[#D6A83F]'
                  }`}
                  title="Toggle 10x Gemological Loupe Simulator"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isLoupeActive ? 'Loupe [Active]' : 'Loupe 10x'}</span>
                </button>

                <button
                  onClick={handleRotate}
                  className="p-1.5 sm:p-2 rounded-lg bg-[#05080D]/80 text-[#F7F5EF] border border-[#D6A83F]/30 hover:border-[#D6A83F] text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-md cursor-pointer transition-all min-h-[36px]"
                  title="Rotate Specimen Axis"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#F0D27A]" />
                  <span>Rotate</span>
                </button>
              </div>

              {/* Bottom spec quick label */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] sm:text-xs font-mono bg-[#05080D]/90 p-2 sm:p-2.5 rounded-lg border border-[#0B2745] backdrop-blur-md">
                <span className="text-[#14f1ce] truncate pr-2">{stone.color}</span>
                <span className="text-[#F0D27A] font-bold shrink-0">{stone.weightCarats} ct</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
              {stone.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsLoupeActive(false);
                  }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#D6A83F] shadow-[0_0_10px_rgba(214,168,63,0.5)]'
                      : 'border-[#0B2745] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Certificate badge if available */}
            {stone.certificate && (
              <div className="p-3 sm:p-4 rounded-xl bg-[#05080D] border border-[#D6A83F]/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6A83F] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F7F5EF] block truncate">
                      {stone.certificate.laboratory} Certified Report
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#A7ADB5] block truncate">
                      Report #{stone.certificate.reportNumber}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onViewCertificate(stone)}
                  className="px-2.5 sm:px-3 py-1.5 rounded bg-[#0B2745] hover:bg-[#D6A83F]/20 text-[#F0D27A] border border-[#D6A83F]/40 text-[11px] sm:text-xs font-mono font-medium transition-colors cursor-pointer shrink-0 min-h-[36px]"
                >
                  View Report →
                </button>
              </div>
            )}

          </div>

          {/* Right: Technical Specification Breakdown */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 flex flex-col justify-between">
            
            <div className="space-y-3 sm:space-y-4">
              
              {/* Pricing banner */}
              <div className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between ${
                stone.status === 'SOLD'
                  ? 'bg-gradient-to-r from-[#1f0b10] to-[#071522] border-[#ef4444]/40'
                  : 'bg-gradient-to-r from-[#0B2745] to-[#071522] border-[#D6A83F]/30'
              }`}>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono text-[#A7ADB5] block tracking-wider">
                    {stone.status === 'SOLD' ? 'COLLECTOR STATUS / ARCHIVE' : 'ESTIMATED WHOLESALE VALUE'}
                  </span>
                  <strong className={`text-lg sm:text-2xl font-mono font-bold ${
                    stone.status === 'SOLD' ? 'text-[#ef4444]' : 'text-[#F0D27A]'
                  }`}>
                    {stone.status === 'SOLD' ? 'Acquired (Private Collection)' : (stone.priceFormatted || 'Price on Request')}
                  </strong>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#A7ADB5] text-right">
                  {stone.status === 'SOLD' ? (
                    <>Museum Provenance<br /><span className="text-[#14f1ce]">Source Commission Open</span></>
                  ) : (
                    <>Direct Mine Sourcing<br />No Middlemen</>
                  )}
                </span>
              </div>

              {/* Stone Description */}
              <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
                {stone.description}
              </p>

              {/* Rough cutting yield if applicable */}
              {stone.isRough && stone.cuttingPotential && (
                <div className="p-3 rounded-lg bg-[#05080D] border border-[#14f1ce]/30">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono text-[#14f1ce] block font-bold">
                    ESTIMATED CUTTING & YIELD POTENTIAL
                  </span>
                  <p className="text-xs text-[#F7F5EF] mt-0.5 font-mono">
                    {stone.cuttingPotential}
                  </p>
                </div>
              )}

              {/* Detailed Spec Sheet Table */}
              <div className="rounded-xl border border-[#0B2745] bg-[#05080D] divide-y divide-[#0B2745] text-[11px] sm:text-xs font-mono">
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Carat Weight</span>
                  <span className="text-[#F7F5EF] font-bold">{stone.weightCarats} ct</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Shape & Cut</span>
                  <span className="text-[#F7F5EF]">{stone.shapeCut}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Measurements</span>
                  <span className="text-[#F7F5EF]">{stone.dimensions}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Color Variety</span>
                  <span className="text-[#14f1ce] font-semibold">{stone.color}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Geographic Origin</span>
                  <span className="text-[#F0D27A] font-bold">{stone.origin}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Treatment Disclosure</span>
                  <span className="text-[#25D366]">{stone.treatment}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex justify-between">
                  <span className="text-[#A7ADB5]">Clarity Grade</span>
                  <span className="text-[#F7F5EF]">{stone.clarity}</span>
                </div>
              </div>

            </div>

            {/* CTAs strictly matching Section 16 */}
            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-[#0B2745]">
              <span className="text-[11px] sm:text-xs uppercase font-mono text-[#D6A83F] tracking-wider block font-bold">
                {stone.status === 'SOLD'
                  ? 'COMMISSION SIMILAR SPECIMEN SOURCING'
                  : 'INTERESTED IN THIS GEMSTONE?'}
              </span>

              {stone.status === 'SOLD' && (
                <div className="p-2.5 rounded-lg bg-[#05080D] border border-[#ef4444]/30 text-[11px] font-mono text-[#A7ADB5]">
                  This gemstone is now in a private collection. You can commission Abel Gemstone to source an equivalent rough crystal or finished cut from our direct African mining contacts.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  onClick={() => onOpenWhatsAppWithStone(stone.name)}
                  className="w-full py-3 rounded-lg text-xs uppercase font-mono tracking-wider font-bold text-[#F7F5EF] bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all cursor-pointer min-h-[44px] active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </button>

                <button
                  onClick={() => onOpenInquiry(stone.status === 'SOLD' ? `Custom Sourcing Request (Similar to ${stone.name})` : stone.name)}
                  className="w-full py-3 rounded-lg text-xs uppercase font-mono tracking-wider font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:opacity-90 flex items-center justify-center gap-2 transition-opacity cursor-pointer min-h-[44px] active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{stone.status === 'SOLD' ? 'Inquire Similar Sourcing' : 'Send Formal Inquiry'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#A7ADB5] pt-1">
                <span>Insured Courier Delivery</span>
                <span className="font-mono text-[#D6A83F]">info@abelgemstone.com</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
