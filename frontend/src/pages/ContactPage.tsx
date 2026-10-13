import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, CheckCircle2, Globe, Instagram, Youtube, Facebook, Gem } from 'lucide-react';
import { BuyerInquiry } from '../types/gemstone';

interface ContactPageProps {
  onSubmitInquiry: (inquiry: BuyerInquiry) => void;
  onOpenWhatsApp: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onSubmitInquiry,
  onOpenWhatsApp,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    whatsapp: '',
    gemstoneWanted: '',
    roughOrFinished: 'Finished Gemstone' as 'Finished Gemstone' | 'Rough Material' | 'Both / Portfolio Consultation',
    approximateCarat: '',
    budgetRange: 'Over $25,000 USD',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newInq: BuyerInquiry = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        company: formData.company,
        country: formData.country,
        email: formData.email,
        whatsapp: formData.whatsapp,
        gemstoneWanted: formData.gemstoneWanted,
        roughOrFinished: formData.roughOrFinished,
        approximateCarat: formData.approximateCarat,
        budgetRange: formData.budgetRange,
        message: formData.message,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        status: 'New',
      };

      onSubmitInquiry(newInq);
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#05080D] pt-28 pb-24">
      
      {/* Top Banner strictly matching Section 17 */}
      <div className="relative py-12 sm:py-16 bg-gradient-to-b from-[#071522] via-[#05080D] to-[#05080D] border-b border-[#0B2745] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#D6A83F]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/40 bg-[#071522] text-[#F0D27A] text-[10px] sm:text-xs font-mono uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            <span>DIRECT WHOLESALE DESK</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-light text-[#F7F5EF]">
            Looking for <span className="gold-gradient-text font-normal">Something Rare?</span>
          </h1>

          <p className="font-serif-lux text-base sm:text-xl text-[#F0D27A] italic max-w-2xl mx-auto">
            Direct access to African and fine natural colored gemstones.
          </p>

          <p className="text-xs sm:text-base text-[#A7ADB5] max-w-3xl mx-auto font-light leading-relaxed">
            Tell us what gemstone you are looking for. Whether you are searching for Paraíba Tourmaline, natural sapphires, rough material or a specific collector stone, contact us with your requirements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Contact Hub & Channels */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            
            <div className="p-5 sm:p-8 rounded-2xl bg-[#071522] border border-[#0B2745] space-y-5 sm:space-y-6">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F7F5EF]">
                Direct Contact Channels
              </h3>

              <div className="space-y-3 sm:space-y-4 text-xs font-mono">
                
                {/* WhatsApp */}
                <div
                  onClick={onOpenWhatsApp}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#05080D] border border-[#25D366]/30 hover:border-[#25D366] transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] uppercase text-[#A7ADB5] block">Instant Messaging</span>
                      <strong className="text-xs sm:text-sm text-[#F7F5EF] group-hover:text-[#25D366]">WhatsApp Direct Desk</strong>
                    </div>
                  </div>
                  <span className="text-[#25D366] text-xs font-semibold">Chat →</span>
                </div>

                {/* Email Info */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-1">
                  <span className="text-[9px] sm:text-[10px] uppercase text-[#A7ADB5] block">Corporate Inquiry</span>
                  <a href="mailto:info@abelgemstone.com" className="text-xs sm:text-sm text-[#F0D27A] hover:underline block font-bold truncate">
                    info@abelgemstone.com
                  </a>
                </div>

                {/* Email Sales */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-1">
                  <span className="text-[9px] sm:text-[10px] uppercase text-[#A7ADB5] block">Wholesale & Trade</span>
                  <a href="mailto:sales@abelgemstone.com" className="text-xs sm:text-sm text-[#F0D27A] hover:underline block font-bold truncate">
                    sales@abelgemstone.com
                  </a>
                </div>

                {/* Sourcing Hubs */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-1">
                  <span className="text-[9px] sm:text-[10px] uppercase text-[#A7ADB5] block">Field Operations</span>
                  <p className="text-[11px] sm:text-xs text-[#F7F5EF] leading-relaxed">
                    East Africa (Ethiopia / Kenya / Tanzania) & International Desks
                  </p>
                </div>

              </div>

              {/* Social Channels strictly matching Section 20 */}
              <div className="pt-3 sm:pt-4 border-t border-[#0B2745]">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-[#A7ADB5] block mb-2 sm:mb-3">
                  Follow Field Discoveries
                </span>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 sm:p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center gap-1.5 text-xs font-mono transition-all min-h-[38px]"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 sm:p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center gap-1.5 text-xs font-mono transition-all min-h-[38px]"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 sm:p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center gap-1.5 text-xs font-mono transition-all min-h-[38px]"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Buyer Inquiry Form matching Section 18 */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-10 rounded-2xl bg-[#071522] border border-[#D6A83F]/40 shadow-2xl">
              
              <div className="mb-5 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-mono text-[#D6A83F] uppercase tracking-widest block">
                  BUYER INQUIRY FORM
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F7F5EF] mt-1">
                  Send Your Gemstone Requirements
                </h3>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-8 text-center space-y-4 bg-[#05080D] rounded-xl border border-[#25D366]/40">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="font-heading text-lg sm:text-xl font-bold text-[#F7F5EF]">
                    Inquiry Received
                  </h4>
                  <p className="text-xs text-[#A7ADB5] max-w-md mx-auto leading-relaxed">
                    Thank you. Your request has been transmitted to our sourcing desk at <code className="text-[#F0D27A]">sales@abelgemstone.com</code>. We will respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs font-mono min-h-[40px] cursor-pointer"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs font-mono">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company or jewelry house"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Country *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Country of residence"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Corporate email"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+XX XXX XXX XXXX"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Gemstone Wanted *</label>
                      <input
                        type="text"
                        required
                        value={formData.gemstoneWanted}
                        onChange={(e) => setFormData({ ...formData, gemstoneWanted: e.target.value })}
                        placeholder="e.g. Paraíba, Sapphire"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Rough or Finished</label>
                      <select
                        value={formData.roughOrFinished}
                        onChange={(e: any) => setFormData({ ...formData, roughOrFinished: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      >
                        <option value="Finished Gemstone">Finished Gemstone</option>
                        <option value="Rough Material">Rough Material</option>
                        <option value="Both / Portfolio Consultation">Both / Portfolio Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Approximate Carat</label>
                      <input
                        type="text"
                        value={formData.approximateCarat}
                        onChange={(e) => setFormData({ ...formData, approximateCarat: e.target.value })}
                        placeholder="e.g. 2 - 5 ct"
                        className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Budget Range</label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F] min-h-[42px]"
                    >
                      <option value="Under $10,000 USD">Under $10,000 USD</option>
                      <option value="$10,000 - $25,000 USD">$10,000 - $25,000 USD</option>
                      <option value="$25,000 - $50,000 USD">$25,000 - $50,000 USD</option>
                      <option value="$50,000 - $100,000 USD">$50,000 - $100,000 USD</option>
                      <option value="Over $100,000 USD">Over $100,000 USD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#A7ADB5] mb-1 text-[11px] sm:text-xs">Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify color tone, lab certificate preferences (GIA/SSEF/Gübelin), or viewing timeline."
                      className="w-full p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Transmitting...' : 'SEND INQUIRY'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
