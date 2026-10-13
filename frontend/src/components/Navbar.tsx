import React, { useState, useEffect } from 'react';
import { Gem, Menu, X, ShieldCheck, Phone, Globe, ChevronDown, Lock, Compass } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenInquiry: (gemstoneName?: string) => void;
  onOpenWhatsApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenInquiry,
  onOpenWhatsApp,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'gemstones', label: 'GEMSTONES' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'FR', label: 'Français (Coming Soon)' },
    { code: 'DE', label: 'Deutsch (Coming Soon)' },
    { code: 'AR', label: 'العربية (Coming Soon)' },
    { code: 'ZH', label: '中文 (Coming Soon)' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05080D]/95 backdrop-blur-md border-b border-[#D6A83F]/20 py-2.5 shadow-xl'
          : 'bg-gradient-to-b from-[#05080D]/95 via-[#05080D]/70 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none min-h-[44px]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D6A83F]/40 bg-gradient-to-br from-[#0B2745] to-[#071522] flex items-center justify-center shadow-lg group-hover:border-[#D6A83F] group-hover:scale-105 transition-all shrink-0">
              <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0D27A]" />
            </div>
            <div>
              <span className="block font-heading text-base sm:text-lg font-bold tracking-wider sm:tracking-widest text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors leading-none">
                ABEL GEMSTONE
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#D6A83F] font-mono mt-0.5">
                African Sources · Wholesale
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 relative font-medium min-h-[40px] flex items-center cursor-pointer ${
                    isActive
                      ? 'text-[#F0D27A]'
                      : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons (Language, WhatsApp, Admin Login, Wholesale Inquiry) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-[#A7ADB5] hover:text-[#F7F5EF] px-2.5 py-1.5 rounded border border-[#0B2745] hover:border-[#D6A83F]/40 bg-[#071522]/50 transition-colors min-h-[38px]"
                title="International Language Selection"
              >
                <Globe className="w-3.5 h-3.5 text-[#D6A83F]" />
                <span className="font-mono">{currentLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#071522] border border-[#D6A83F]/30 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-lg">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setCurrentLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#0B2745]/60 ${
                        currentLang === l.code ? 'text-[#F0D27A] font-semibold' : 'text-[#A7ADB5]'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="font-mono text-[10px] text-[#D6A83F]">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick WhatsApp Action */}
            <button
              onClick={onOpenWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-[#25D366] hover:text-[#F7F5EF] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-all cursor-pointer min-h-[38px]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium">WhatsApp</span>
            </button>

            {/* Buyer Inquiry CTA */}
            <button
              onClick={() => onOpenInquiry()}
              className="px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer min-h-[38px] whitespace-nowrap"
            >
              Inquire Stones
            </button>
          </div>

          {/* Mobile Actions: WhatsApp Icon & Burger */}
          <div className="flex xl:hidden items-center gap-1.5">
            <button
              onClick={onOpenWhatsApp}
              className="min-h-[42px] min-w-[42px] rounded-full text-[#25D366] bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              aria-label="Direct WhatsApp Chat"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[42px] min-w-[42px] rounded-lg text-[#F7F5EF] hover:text-[#D6A83F] hover:bg-[#071522] flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#F0D27A]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071522]/98 border-b border-[#D6A83F]/30 backdrop-blur-xl px-4 pt-3 pb-5 mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium flex items-center justify-between min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'text-[#F0D27A] bg-[#0B2745]/70 border-l-2 border-[#D6A83F]'
                      : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/30'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#D6A83F]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#0B2745] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3 text-center text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] rounded-lg shadow-lg cursor-pointer min-h-[44px]"
            >
              Submit Buyer Inquiry
            </button>
            <div className="flex items-center justify-center pt-1 px-1">
              <span className="text-[10px] text-[#A7ADB5]/70 font-mono">Direct African Sourcing</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
