import React, { useState } from 'react';
import { ArrowRight, Disc, Sparkles, Gem, CheckCircle, Sliders } from 'lucide-react';

export const CuttingPolishingStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      tag: 'PHASE 01',
      title: 'ROUGH GEMSTONE SELECTION',
      subtitle: 'Evaluating Optical Potential & Geometry',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      description: 'Sourced directly in East Africa and Sri Lanka. Gemologists examine crystalline axes, pleochroism, color saturation zones, and natural inclusions under 10x to 40x darkfield immersion microscopy.',
      metrics: [
        { label: 'Yield Assessment', val: '40% - 65% Target' },
        { label: 'Orientation', val: 'C-Axis Color Optimization' },
        { label: 'Origin Verification', val: 'Traceable Direct Sourcing' },
      ],
    },
    {
      step: 2,
      stepName: 'CUTTING',
      tag: 'PHASE 02',
      title: 'MASTER LAPIDARY FACETING',
      subtitle: 'Precision Proportions & Angle Symmetry',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      description: 'Hand-faceted by master gem cutters using ultra-fine diamond grinding wheels. Facet angles and pavilion depths are calculated mathematically to achieve total internal reflection without color extinction.',
      metrics: [
        { label: 'Facet Alignment', val: '0.01mm Precision Tolerance' },
        { label: 'Wheel Grits', val: '3,000 to 50,000 Diamond' },
        { label: 'Zero Windowing', val: '100% Critical Angle Integrity' },
      ],
    },
    {
      step: 3,
      stepName: 'FINISHED GEMSTONE',
      tag: 'PHASE 03',
      title: 'POLISHED & CERTIFIED GEMSTONE',
      subtitle: 'Lustrous Scintillation & International Certification',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      description: 'Final diamond-paste polishing produces mirror-like adamantine luster. The completed gemstone is sealed and submitted to leading independent gemological laboratories (GIA, SSEF, Gübelin, GRS).',
      metrics: [
        { label: 'Surface Polish', val: 'Vitreous to Adamantine' },
        { label: 'Lab Verification', val: 'GIA / GRS / Gübelin / SSEF' },
        { label: 'Market Readiness', val: 'International Wholesale Ready' },
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#071522] relative border-t border-[#D6A83F]/20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D6A83F]/30 bg-[#05080D] text-[#F0D27A] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest">
            <Disc className="w-3.5 h-3.5" />
            <span>LAPIDARY MASTERY</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-light text-[#F7F5EF]">
            From Rough to <span className="gold-gradient-text font-normal">Finished Stone</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#A7ADB5] font-light leading-relaxed">
            Understanding crystal orientation, angles, and polish to bring out full brilliance and optical fire.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent mx-auto mt-3" />
        </div>

        {/* Visual Sequence Bar: Segmented 3-Tab Control */}
        <div className="max-w-lg mx-auto mb-8 sm:mb-12">
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#05080D] border border-[#0B2745] rounded-xl">
            <button
              onClick={() => setActiveStep(1)}
              className={`py-2 sm:py-2.5 px-2 rounded-lg text-[10px] sm:text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
                activeStep === 1
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center text-[9px]">1</span>
              <span>ROUGH</span>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`py-2 sm:py-2.5 px-2 rounded-lg text-[10px] sm:text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
                activeStep === 2
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center text-[9px]">2</span>
              <span>CUTTING</span>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`py-2 sm:py-2.5 px-2 rounded-lg text-[10px] sm:text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
                activeStep === 3
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center text-[9px]">3</span>
              <span>FINISHED</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Stage Card */}
        {steps.map((s) => {
          if (s.step !== activeStep) return null;
          return (
            <div
              key={s.step}
              className="rounded-2xl overflow-hidden bg-[#05080D] border border-[#D6A83F]/30 p-4 sm:p-8 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <span className="px-2.5 py-0.5 rounded bg-[#071522] border border-[#D6A83F]/40 text-[#F0D27A] text-[9px] sm:text-[10px] font-mono tracking-widest">
                  {s.tag}
                </span>

                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#F7F5EF]">
                  {s.title}
                </h3>

                <p className="font-serif-lux text-base sm:text-lg text-[#D6A83F] italic">
                  {s.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-[#A7ADB5] font-light leading-relaxed">
                  {s.description}
                </p>

                <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 border-t border-[#0B2745]">
                  {s.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 sm:p-3 rounded-lg bg-[#071522] border border-[#0B2745]">
                      <span className="text-[9px] uppercase font-mono text-[#A7ADB5] block">{m.label}</span>
                      <strong className="text-xs text-[#F0D27A] font-mono mt-0.5 block truncate">{m.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-[#D6A83F]/40 shadow-xl group">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080D]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#F7F5EF] bg-[#05080D]/90 p-2 rounded backdrop-blur-md border border-[#0B2745]">
                    <span>Abel Gemstone Lapidary</span>
                    <span className="text-[#25D366]">Verified Stage</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};
