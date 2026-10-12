import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Play, Maximize2, Sparkles } from 'lucide-react';
import { GalleryItem, Gemstone } from '../types/gemstone';
import { GALLERY_ITEMS } from '../data/gemstoneInventory';
import { api } from '../services/api';

interface GallerySectionProps {
  onInquireItem?: (title: string) => void;
  galleryItems?: GalleryItem[];
  gemstones?: Gemstone[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onInquireItem, galleryItems, gemstones }) => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (gemstones && gemstones.length > 0) {
      return gemstones.flatMap((g) =>
        g.images.map((img, i) => ({
          id: `${g.id}-${i}`,
          title: g.name,
          category: 'Natural Specimen' as any,
          imageUrl: img,
          thumbnailUrl: img,
          description: `${g.weightCarats} ct • ${g.shapeCut} • ${g.color}`,
          origin: g.origin,
          isVideo: Boolean(g.videoUrl),
        }))
      );
    }
    return galleryItems || GALLERY_ITEMS;
  });

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (gemstones && gemstones.length > 0) {
      const stoneMedia: GalleryItem[] = gemstones.flatMap((g) =>
        g.images.map((img, i) => ({
          id: `${g.id}-${i}`,
          title: g.name,
          category: 'Natural Specimen' as any,
          imageUrl: img,
          thumbnailUrl: img,
          description: `${g.weightCarats} ct • ${g.shapeCut} • ${g.color}`,
          origin: g.origin,
          isVideo: Boolean(g.videoUrl),
        }))
      );
      setItems(stoneMedia);
      return;
    }

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
  }, [galleryItems, gemstones]);

  const filteredItems = items;

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
            Explore high-resolution photography and video captures of our museum-grade rough and faceted gemstones, lapidary workshop specimens, and direct African mine sourcing.
          </p>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-4" />
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
                
                {/* Natural Specimen Pill Tag (Category-Free) */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-[#05080D]/80 border border-[#D6A83F]/30 text-[9px] font-mono tracking-widest text-[#F0D27A] backdrop-blur-md">
                    NATURAL SPECIMEN
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
          
          <div className="relative max-w-5xl w-full bg-[#071522] border border-[#D6A83F]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 border-b border-[#0B2745] flex items-center justify-between bg-[#05080D]/80">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D6A83F] animate-pulse" />
                <h3 className="font-heading text-sm sm:text-lg font-bold text-[#F7F5EF] truncate">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-lg bg-[#0B2745]/60 hover:bg-[#0B2745] text-[#A7ADB5] hover:text-[#F7F5EF] transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Media Stage */}
            <div className="relative flex-1 bg-[#05080D] flex items-center justify-center min-h-[300px] sm:min-h-[460px] overflow-hidden">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto transition-transform"
              />

              {/* Prev / Next controls */}
              <button
                onClick={prevLightboxItem}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#05080D]/80 hover:bg-[#D6A83F] text-[#F7F5EF] hover:text-[#05080D] border border-[#D6A83F]/30 transition-all cursor-pointer shadow-xl"
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextLightboxItem}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#05080D]/80 hover:bg-[#D6A83F] text-[#F7F5EF] hover:text-[#05080D] border border-[#D6A83F]/30 transition-all cursor-pointer shadow-xl"
                title="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Footer & Inquiry Action */}
            <div className="p-4 sm:p-5 border-t border-[#0B2745] bg-[#071522] flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1 max-w-lg">
                <p className="text-xs sm:text-sm text-[#F7F5EF] font-light">
                  {selectedItem.description}
                </p>
                {selectedItem.origin && (
                  <span className="text-[11px] font-mono text-[#D6A83F]">
                    Source Origin: {selectedItem.origin}
                  </span>
                )}
              </div>

              {onInquireItem && (
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onInquireItem(selectedItem.title);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] hover:from-[#F0D27A] hover:to-[#D6A83F] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Inquire on Specimen
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </section>
  );
};
