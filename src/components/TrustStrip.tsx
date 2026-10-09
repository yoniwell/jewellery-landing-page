import React from 'react';
import { Compass, Gem, Disc, Globe2 } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const points = [
    {
      icon: Compass,
      title: 'DIRECT SOURCING',
      description: 'African mine-level access & selection.',
    },
    {
      icon: Gem,
      title: 'NATURAL STONES',
      description: 'Lab-verified untreated & fine gems.',
    },
    {
      icon: Disc,
      title: 'MASTER CUTTING',
      description: 'Mathematical precision faceting & polish.',
    },
    {
      icon: Globe2,
      title: 'GLOBAL TRADE',
      description: 'Insured international wholesale logistics.',
    },
  ];

  return (
    <section className="relative py-6 sm:py-10 bg-[#071522] border-y border-[#D6A83F]/20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="group p-3 sm:p-5 rounded-xl bg-[#05080D]/70 border border-[#0B2745] hover:border-[#D6A83F]/50 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4"
              >
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0B2745] border border-[#D6A83F]/30 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#D6A83F] transition-all">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0D27A]" />
                </div>
                <div>
                  <h4 className="font-heading text-[10px] sm:text-xs font-bold tracking-wider text-[#F7F5EF] uppercase">
                    {point.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-[#A7ADB5] leading-snug font-light">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
