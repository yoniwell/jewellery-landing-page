import React from 'react';
import { Gem, Mail, Phone, MapPin, Globe, ShieldCheck, ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenInquiry: () => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onOpenInquiry,
  onOpenWhatsApp,
}) => {
  return (
    <footer className="bg-[#05080D] border-t border-[#0B2745] text-[#A7ADB5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#0B2745]">
          
          {/* Col 1: Brand Info strictly from Section 21 */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D6A83F]/40 bg-[#0B2745] flex items-center justify-center">
                <Gem className="w-5 h-5 text-[#F0D27A]" />
              </div>
              <div>
                <span className="block font-heading text-lg font-bold tracking-widest text-[#F7F5EF]">
                  ABEL GEMSTONE
                </span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#D6A83F] font-mono font-medium">
                  Direct from African Sources • Wholesale
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
              Luxury colored gemstones sourced, selected, cut and traded for international buyers, collectors, and premier jewelry houses.
            </p>

            <div className="pt-2 text-xs font-mono text-[#F0D27A]">
              "Rare Stones. Direct Sources. Exceptional Color."
            </div>

            {/* Social Media Links matching Section 20 & 21 */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F] text-[#F7F5EF] hover:text-[#D6A83F] flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-[#F7F5EF]">
              Gemstone Portfolio
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => { setCurrentPage('gemstones'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  All Certified Gemstones
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('gemstones'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Ethiopian Paraíba Tourmaline
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('gemstones'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Natural Royal Blue & Fine Sapphires
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('gemstones'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Rough Gemstones & Parcels
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Exclusive Visual Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Direct Access */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-[#F7F5EF]">
              Abel Gemstone
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  About Our Sourcing
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Lapidary & Cutting
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F0D27A] transition-colors"
                >
                  Contact & Private Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Sourcing Hubs */}
          <div className="lg:col-span-3 space-y-3 text-xs font-mono">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-[#F7F5EF]">
              Wholesale Sourcing Desk
            </h4>
            
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6A83F]" />
                <a href="mailto:info@abelgemstone.com" className="hover:text-[#F0D27A]">
                  info@abelgemstone.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6A83F]" />
                <a href="mailto:sales@abelgemstone.com" className="hover:text-[#F0D27A]">
                  sales@abelgemstone.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#25D366]" />
                <button onClick={onOpenWhatsApp} className="hover:text-[#25D366] text-left">
                  WhatsApp: +251 91 100 0000
                </button>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[#A7ADB5]">
                <MapPin className="w-4 h-4 text-[#D6A83F] shrink-0 mt-0.5" />
                <span>Direct Operations: East Africa & International Desks</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright strictly matching Section 21 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A7ADB5]/70 gap-4">
          <p>© 2026 Abel Gemstone. All Rights Reserved. Direct from African Sources.</p>
          
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="hover:text-[#F7F5EF] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#F7F5EF] cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-[#F7F5EF] cursor-pointer">Lab Disclosure Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
