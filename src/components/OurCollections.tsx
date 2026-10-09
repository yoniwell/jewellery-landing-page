import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface OurCollectionsProps {
  onNavigateToCategory: (category: string) => void;
}

export const OurCollections: React.FC<OurCollectionsProps> = ({ onNavigateToCategory }) => {
  const collections = [
    {
      id: 'paraiba',
      title: 'Ethiopian Paraíba Tourmaline',
      description: 'Electric color and rare Ethiopian material.',
      tag: 'FLAGSHIP SPECIALTY',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#14f1ce]/30 group-hover:border-[#14f1ce]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(20,241,206,0.2)]',
    },
    {
      id: 'sapphires',
      title: 'Ceylon Sapphires',
      description: 'Natural and treated Sri Lankan sapphires selected for color and quality.',
      tag: 'SRI LANKAN SOURCE',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#1755af]/40 group-hover:border-[#60a5fa]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(23,85,175,0.3)]',
    },
    {
      id: 'emerald',
      title: 'African Emeralds',
      description: 'Selected African emerald rough and finished stones.',
      tag: 'ZAMBIAN & EAST AFRICAN',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#10b981]/30 group-hover:border-[#34d399]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    },
    {
      id: 'rare',
      title: 'Rare & Collector Gemstones',
      description: 'Exceptional stones for collectors and serious buyers.',
      tag: 'MUSEUM & INVESTMENT',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#D6A83F]/30 group-hover:border-[#F0D27A]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(214,168,63,0.3)]',
    },
    {
      id: 'rough',
      title: 'Rough Gemstones',
      description: 'Rough material available for cutting, treatment and investment.',
      tag: 'DIRECT MINE PARCELS',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#a87e23]/40 group-hover:border-[#D6A83F]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(168,126,35,0.3)]',
    },
    {
      id: 'fine-cut',
      title: 'Fine Cut & Polished Stones',
      description: 'Finished gemstones prepared for collectors, dealers and jewelry.',
      tag: 'MASTER FACETED',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      accent: 'border-[#0B2745] group-hover:border-[#D6A83F]/70',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(214,168,63,0.2)]',
    },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#05080D] relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#071522] text-[#F0D27A] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#D6A83F]" />
            <span>WHOLESALE & COLLECTOR PORTFOLIO</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF]">
            Exceptional Gemstones, <span className="gold-gradient-text font-normal">Carefully Selected</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#A7ADB5] font-light">
            Rare colored gemstones sourced directly from African and Sri Lankan deposits.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-3" />
        </div>

        {/* 6 Luxury Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {collections.map((col, index) => (
            <div
              key={col.id}
              onClick={() => {
                if (col.id === 'paraiba') onNavigateToCategory('paraiba');
                else if (col.id === 'sapphires') onNavigateToCategory('sapphires');
                else if (col.id === 'rough') onNavigateToCategory('rough');
                else onNavigateToCategory(col.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group relative rounded-xl overflow-hidden bg-[#071522] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${col.accent} ${col.glowColor} active:scale-[0.99]`}
            >
              {/* Card Image Container */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#05080D]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-[#071522]/30 to-transparent" />
                
                {/* Category Pill Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/85 border border-[#D6A83F]/30 text-[8px] sm:text-[9px] font-mono tracking-widest text-[#F0D27A] backdrop-blur-md">
                    {col.tag}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#05080D]/80 border border-[#D6A83F]/30 flex items-center justify-center text-[#F7F5EF] group-hover:text-[#05080D] group-hover:bg-[#F0D27A] group-hover:border-[#F0D27A] transition-all backdrop-blur-md shadow-md">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3.5 sm:p-5 lg:p-6 space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-medium text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-[#A7ADB5] font-light leading-relaxed mt-1">
                    {col.description}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-3 border-t border-[#0B2745] flex items-center justify-between text-xs text-[#D6A83F] font-mono mt-1.5">
                  <span className="tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[10px] sm:text-xs">
                    VIEW SELECTION →
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#A7ADB5]">#0{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
