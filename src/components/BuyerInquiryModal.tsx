import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Phone, Mail, Building, Globe, Gem } from 'lucide-react';
import { BuyerInquiry } from '../types/gemstone';

interface BuyerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillStoneName?: string;
  onSubmitInquiry: (inquiry: BuyerInquiry) => void;
  onOpenWhatsApp: () => void;
}

export const BuyerInquiryModal: React.FC<BuyerInquiryModalProps> = ({
  isOpen,
  onClose,
  prefillStoneName,
  onSubmitInquiry,
  onOpenWhatsApp,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    whatsapp: '',
    gemstoneWanted: prefillStoneName || '',
    roughOrFinished: 'Finished Gemstone' as 'Finished Gemstone' | 'Rough Material' | 'Both / Portfolio Consultation',
    approximateCarat: '',
    budgetRange: 'Over $25,000 USD',
    message: prefillStoneName 
      ? `I am interested in acquiring ${prefillStoneName}. Please provide available gemological reports, daylight video scans, and wholesale acquisition terms.` 
      : 'Seeking high-grade Ethiopian Paraíba Tourmaline / Ceylon Sapphires for international wholesale acquisition.',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newInquiry: BuyerInquiry = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        company: formData.company,
        country: formData.country,
        email: formData.email,
        whatsapp: formData.whatsapp,
        gemstoneWanted: formData.gemstoneWanted || 'General Inquiry',
        stoneName: prefillStoneName,
        roughOrFinished: formData.roughOrFinished,
        approximateCarat: formData.approximateCarat,
        budgetRange: formData.budgetRange,
        message: formData.message,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        status: 'New',
      };

      onSubmitInquiry(newInquiry);
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05080D]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-2xl w-full bg-[#071522] border border-[#D6A83F]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-4 sm:my-8 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#05080D] border-b border-[#0B2745] flex items-center justify-between">
          <div className="pr-2 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-[#F0D27A]">
              <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6A83F]" />
              <span className="uppercase tracking-widest truncate">WHOLESALE SOURCING DESK</span>
            </div>
            <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#F7F5EF] mt-0.5 truncate">
              Buyer Inquiry & Sourcing Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#071522] transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-12 text-center space-y-4 animate-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#F7F5EF]">
              Inquiry Transmitted Successfully
            </h4>
            
            <p className="text-xs sm:text-sm text-[#A7ADB5] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#F7F5EF]">{formData.name}</strong>. Your confidential inquiry has been routed to our managing director at <code className="text-[#F0D27A] font-mono">info@abelgemstone.com</code>. We typically reply within 2 to 4 business hours.
            </p>

            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={onOpenWhatsApp}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-bold text-[#F7F5EF] bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Instant WhatsApp Follow-up</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs uppercase font-mono tracking-widest font-semibold text-[#F7F5EF] bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F] cursor-pointer min-h-[44px] active:scale-95"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 text-xs font-mono">
            
            {prefillStoneName && (
              <div className="p-3 rounded-lg bg-[#05080D] border border-[#D6A83F]/40 flex items-center justify-between text-xs">
                <span className="text-[#A7ADB5]">Selected Gemstone:</span>
                <strong className="text-[#F0D27A] font-mono truncate pl-2">{prefillStoneName}</strong>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Full Name <span className="text-[#D6A83F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jean-Luc Mercier"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Company / House
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Mercier Joaillerie"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Country <span className="text-[#D6A83F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Switzerland / USA / UAE"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Corporate Email <span className="text-[#D6A83F]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="buyer@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  WhatsApp / Direct Phone
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+41 79 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* Gemstone Wanted */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Gemstone Wanted <span className="text-[#D6A83F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.gemstoneWanted}
                  onChange={(e) => setFormData({ ...formData, gemstoneWanted: e.target.value })}
                  placeholder="e.g. Ethiopian Paraíba / Sapphire"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

              {/* Rough or Finished */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Material Type
                </label>
                <select
                  value={formData.roughOrFinished}
                  onChange={(e: any) => setFormData({ ...formData, roughOrFinished: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                >
                  <option value="Finished Gemstone">Finished Gemstone (Cut & Polished)</option>
                  <option value="Rough Material">Rough Material (Direct Mine Parcels)</option>
                  <option value="Both / Portfolio Consultation">Both / Portfolio Consultation</option>
                </select>
              </div>

              {/* Approximate Carat / Weight */}
              <div>
                <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                  Approx. Carat / Weight
                </label>
                <input
                  type="text"
                  value={formData.approximateCarat}
                  onChange={(e) => setFormData({ ...formData, approximateCarat: e.target.value })}
                  placeholder="e.g. 3 - 5 ct or 50+ ct Parcel"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
                />
              </div>

            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                Target Budget Range (USD)
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors min-h-[42px]"
              >
                <option value="Under $10,000 USD">Under $10,000 USD</option>
                <option value="$10,000 - $25,000 USD">$10,000 - $25,000 USD</option>
                <option value="$25,000 - $50,000 USD">$25,000 - $50,000 USD</option>
                <option value="$50,000 - $100,000 USD">$50,000 - $100,000 USD</option>
                <option value="Over $100,000 USD">Over $100,000 USD (Collector / Important Stones)</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1">
                Requirements / Note <span className="text-[#D6A83F]">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include specifications, required lab certificates (GIA/SSEF/Gübelin/GRS), viewing locations, and delivery timeline."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#A7ADB5]">
                <ShieldCheck className="w-4 h-4 text-[#D6A83F] shrink-0" />
                <span>Confidentiality & Non-Disclosure Guaranteed</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_25px_rgba(214,168,63,0.5)] transition-all cursor-pointer font-mono flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] active:scale-95"
              >
                {loading ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND INQUIRY</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
