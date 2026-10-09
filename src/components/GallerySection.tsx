import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Play, Maximize2, ShieldCheck, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types/gemstone';
import { GALLERY_ITEMS } from '../data/gemstoneInventory';
import { api } from '../services/api';

interface GallerySectionProps {
  onInquireItem?: (title: string) => void;
  galleryItems?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onInquireItem, galleryItems }) => {
  const [items, setItems] = useState<GalleryItem[]>(galleryItems || GALLERY_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (galleryItems && galleryItems.length > 0) {
      setItems(galleryItems);
      return;
    }
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch {
        // Fallback
      }
    };
    fetchGallery();
  }, [galleryItems]);

  const categories = [
    'ALL',
    'Paraíba',
    'Sapphires',
    'Padparadscha',
    'Rough Stones',
    'Emeralds',
    'Rare Stones',
    'Cutting & Polishing',
    'Mining & Sourcing',
  ];

  const filteredItems = activeCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const nextLightboxItem = () => {
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIdx);
    setSelectedItem(filteredItems[nextIdx]);
  };

  const prevLightboxItem = () => {
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prevIdx);
    setSelectedItem(filteredItems[prevIdx]);
  };

  return (
    <section className="py-24 bg-[#071522] relative border-t border-[#0B2745]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#05080D] text-[#F0D27A] text-xs font-mono uppercase tracking-widest">
            <Camera className="w-3.5 h-3.5" />
            <span>EXCLUSIVE ARCHIVE & FIELD SOURCING</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-light text-[#F7F5EF]">
            Luxury <span className="gold-gradient-text font-normal">Gemstone Gallery</span>
          </h2>

          <p className="text-sm sm:text-base text-[#A7ADB5] font-light leading-relaxed">
            Explore high-resolution photography and video captures of our museum-grade rough and faceted gemstones, lapidary workshops, and field sourcing across Africa and Sri Lanka.
          </p>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-4" />
        </div>

        {/* 8 Category Tabs strictly matching Brief */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-[0_0_15px_rgba(214,168,63,0.3)]'
                  : 'bg-[#05080D] text-[#A7ADB5] border border-[#0B2745] hover:border-[#D6A83F]/40 hover:text-[#F7F5EF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid with interactive lightbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item, index)}
              className="group relative rounded-xl overflow-hidden bg-[#05080D] border border-[#0B2745] hover:border-[#D6A83F]/60 cursor-pointer shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#05080D]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Category Pill Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/80 border border-[#D6A83F]/30 text-[9px] font-mono tracking-widest text-[#F0D27A] backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Zoom hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#05080D]/80 border border-[#D6A83F] flex items-center justify-center text-[#F0D27A] shadow-xl">
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>

              {/* Item Caption */}
              <div className="p-3.5 sm:p-4 space-y-1">
                <h4 className="font-heading text-xs sm:text-sm font-semibold text-[#F7F5EF] group-hover:text-[#F0D27A] transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#A7ADB5] line-clamp-1 font-light">
                  {item.description}
                </p>
                {item.origin && (
                  <span className="text-[10px] text-[#D6A83F] font-mono block pt-0.5 truncate">
                    Origin: {item.origin}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Luxury Full-Screen Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-8 animate-in fade-in duration-300">
          
          {/* Close Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-[#071522] border border-[#D6A83F]/40 text-[#F7F5EF] hover:text-[#F0D27A] hover:border-[#D6A83F] transition-all z-50 cursor-pointer shadow-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxItem();
            }}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#071522]/90 border border-[#D6A83F]/30 text-[#F7F5EF] hover:text-[#F0D27A] hover:border-[#D6A83F] transition-all z-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxItem();
            }}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#071522]/90 border border-[#D6A83F]/30 text-[#F7F5EF] hover:text-[#F0D27A] hover:border-[#D6A83F] transition-all z-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div className="max-w-5xl w-full bg-[#071522] border border-[#D6A83F]/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row max-h-[92vh]">
            
            {/* Image Viewer */}
            <div className="lg:w-2/3 bg-[#05080D] flex items-center justify-center relative overflow-hidden p-2 min-h-[260px] sm:min-h-[350px]">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="max-h-[60vh] lg:max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Info Sidebar */}
            <div className="lg:w-1/3 p-4 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#0B2745] bg-[#071522] overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-[#05080D] border border-[#D6A83F]/40 text-[#F0D27A] text-[9px] sm:text-[10px] font-mono tracking-widest">
                    {selectedItem.category}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-[#A7ADB5]">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#F7F5EF]">
                  {selectedItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
                  {selectedItem.description}
                </p>

                {selectedItem.origin && (
                  <div className="p-2.5 sm:p-3 rounded bg-[#05080D] border border-[#0B2745]">
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono text-[#A7ADB5] block">Geological Origin</span>
                    <strong className="text-xs text-[#F0D27A] font-mono mt-0.5 block truncate">{selectedItem.origin}</strong>
                  </div>
                )}
              </div>

              <div className="pt-4 sm:pt-6 border-t border-[#0B2745] space-y-2.5 sm:space-y-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    if (onInquireItem) onInquireItem(selectedItem.title);
                  }}
                  className="w-full py-3 rounded-lg text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition-all cursor-pointer font-mono text-center min-h-[44px] active:scale-95"
                >
                  Inquire This Specimen
                </button>
                <p className="text-[9px] sm:text-[10px] text-center text-[#A7ADB5] font-mono">
                  Abel Gemstone Direct Sourcing Archive
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </section>
  );
};
