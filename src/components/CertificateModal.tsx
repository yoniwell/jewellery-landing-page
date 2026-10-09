import React from 'react';
import { X, ShieldCheck, Award, FileText, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { GemCertificate } from '../types/gemstone';

interface CertificateModalProps {
  certificate: GemCertificate | null;
  stoneName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  stoneName,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-3xl w-full bg-[#071522] border border-[#D6A83F]/50 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-8 relative">
        
        {/* Top Laboratory Header */}
        <div className="p-6 bg-[#05080D] border-b border-[#0B2745] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#071522] border border-[#D6A83F]/40 flex items-center justify-center text-[#F0D27A] font-heading font-black text-lg shadow-inner">
              {certificate.laboratory}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#D6A83F] uppercase tracking-widest">
                  OFFICIAL GEMOLOGICAL REPORT
                </span>
                <span className="px-2 py-0.5 rounded bg-[#25D366]/10 border border-[#25D366]/30 text-[10px] font-mono text-[#25D366] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED AUTHENTIC
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F7F5EF] mt-0.5">
                {certificate.laboratory} Identification Report #{certificate.reportNumber}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#071522] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Data Sheet */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#A7ADB5] block">Gemstone Name</span>
              <strong className="text-sm font-heading text-[#F7F5EF]">{stoneName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#A7ADB5] block">Report Date</span>
              <span className="text-xs font-mono text-[#F0D27A]">{certificate.date}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#A7ADB5] block">Laboratory</span>
              <span className="text-xs font-mono text-[#F7F5EF] font-bold">{certificate.laboratory} Gemological Institute</span>
            </div>
          </div>

          {/* Core Tested Parameters Matrix strictly following Section 29 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                CARAT WEIGHT
              </span>
              <p className="text-base font-mono font-bold text-[#F7F5EF]">
                {certificate.weight} ct
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                SHAPE & CUT
              </span>
              <p className="text-base font-mono text-[#F7F5EF]">
                {certificate.shape}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                MEASUREMENTS / DIMENSIONS
              </span>
              <p className="text-base font-mono text-[#F7F5EF]">
                {certificate.dimensions}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                COLOR DESCRIPTION
              </span>
              <p className="text-base font-mono text-[#14f1ce] font-semibold">
                {certificate.color}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                GEOGRAPHIC ORIGIN OPINION
              </span>
              <p className="text-base font-mono font-bold text-[#F0D27A]">
                {certificate.origin}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05080D]/80 border border-[#0B2745] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
                THERMAL & CLARITY TREATMENT STATUS
              </span>
              <p className="text-sm font-mono text-[#25D366]">
                {certificate.treatment}
              </p>
            </div>

          </div>

          {/* Expert Lab Comments */}
          <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-[#D6A83F] tracking-widest block">
              LABORATORY COMMENTS & SPECTROSCOPIC DATA
            </span>
            <p className="text-xs text-[#A7ADB5] leading-relaxed font-mono">
              "{certificate.comments}"
            </p>
          </div>

          {/* Disclaimer rule from brief: Section 29 */}
          <div className="p-3 rounded-lg bg-[#05080D]/50 border border-[#0B2745] text-[11px] text-[#A7ADB5]/80 leading-relaxed font-light">
            <strong className="text-[#D6A83F] font-mono">Disclosure Notice:</strong> Only information supported by the actual laboratory report is displayed. Abel Gemstone maintains strict ethical chain of custody and discloses all known thermal, optical, and clarity characteristics.
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#05080D] border-t border-[#0B2745] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A7ADB5]">
            <ShieldCheck className="w-4 h-4 text-[#D6A83F]" />
            <span>Official Report Database Match</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:opacity-90 transition-opacity cursor-pointer font-mono"
          >
            Close Report Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
