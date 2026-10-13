import React, { useState } from 'react';
import { Phone, MessageCircle, X, Sparkles, Gem } from 'lucide-react';

interface FloatingWhatsAppProps {
  onDirectChat?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onDirectChat }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Hello Abel Gemstone, I am interested in your gemstones. I would like to know what is currently available.'
  );
  const whatsappUrl = `https://wa.me/251911000000?text=${defaultMessage}`;

  const handleOpenWhatsApp = () => {
    if (onDirectChat) {
      onDirectChat();
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-2 sm:mb-3 max-w-[280px] sm:max-w-xs bg-[#071522] border border-[#25D366]/40 p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-[#0B2745]">
            <div className="flex items-center gap-1.5 text-xs text-[#25D366] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Direct WhatsApp Desk</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[#A7ADB5] hover:text-[#F7F5EF] p-1"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#F7F5EF] mt-2 font-light leading-relaxed">
            Connect directly with our gemstone sourcing directors for real-time inventory lists and high-res stone videos.
          </p>
          <button
            onClick={handleOpenWhatsApp}
            className="w-full mt-3 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-xs font-bold text-[#05080D] uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Open WhatsApp Chat</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-[#071522]/90 border border-[#25D366]/40 text-xs text-[#F7F5EF] shadow-lg backdrop-blur-md hover:border-[#25D366] transition-all cursor-pointer font-mono min-h-[40px]"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>Chat with Abel Gemstone</span>
        </button>

        <button
          onClick={handleOpenWhatsApp}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#20bd5a] to-[#25D366] text-[#05080D] flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white/20 group"
          aria-label="Chat with Abel Gemstone on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white group-hover:scale-105 transition-transform" />
        </button>
      </div>

    </div>
  );
};
