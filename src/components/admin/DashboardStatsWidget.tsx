import React, { useState } from 'react';
import { 
  Gem, MessageSquare, Award, TrendingUp, Sparkles, PieChart, 
  BarChart2, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, 
  Layers, ChevronRight, Activity, Flame
} from 'lucide-react';
import { Gemstone, BuyerInquiry } from '../../types/gemstone';

interface DashboardStatsWidgetProps {
  gemstones: Gemstone[];
  inquiries: BuyerInquiry[];
  categories: Array<{ id: string; name: string; slug: string; description: string; stoneCount?: number }>;
  onNavigateTab: (tab: 'inventory' | 'inquiries' | 'categories' | 'add') => void;
}

export const DashboardStatsWidget: React.FC<DashboardStatsWidgetProps> = ({
  gemstones,
  inquiries,
  categories,
  onNavigateTab,
}) => {
  const [activeView, setActiveView] = useState<'all' | 'categories' | 'inquiries'>('all');

  // 1. GEMSTONE METRICS
  const totalStones = gemstones.length;
  const availableStones = gemstones.filter((g) => g.status === 'AVAILABLE').length;
  const reservedStones = gemstones.filter((g) => g.status === 'RESERVED').length;
  const soldStones = gemstones.filter((g) => g.status === 'SOLD').length;
  const comingSoonStones = gemstones.filter((g) => g.status === 'COMING SOON').length;
  const totalCarats = gemstones.reduce((sum, g) => sum + (g.weightCarats || 0), 0);
  const totalValuation = gemstones.reduce((sum, g) => sum + (g.priceUsd || 0), 0);

  const availablePct = totalStones > 0 ? Math.round((availableStones / totalStones) * 100) : 0;
  const reservedPct = totalStones > 0 ? Math.round((reservedStones / totalStones) * 100) : 0;
  const soldPct = totalStones > 0 ? Math.round((soldStones / totalStones) * 100) : 0;
  const comingSoonPct = totalStones > 0 ? Math.round((comingSoonStones / totalStones) * 100) : 0;

  // 2. INQUIRIES METRICS
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const repliedInquiries = inquiries.filter((i) => i.status === 'Replied').length;
  const negotiationInquiries = inquiries.filter((i) => i.status === 'Under Negotiation').length;
  const closedInquiries = inquiries.filter((i) => i.status === 'Closed').length;

  const inquiryStatusData = [
    { label: 'New', count: newInquiries, color: '#25D366', bgClass: 'bg-[#25D366]' },
    { label: 'Replied', count: repliedInquiries, color: '#60a5fa', bgClass: 'bg-[#60a5fa]' },
    { label: 'Negotiation', count: negotiationInquiries, color: '#F0D27A', bgClass: 'bg-[#F0D27A]' },
    { label: 'Closed', count: closedInquiries, color: '#A7ADB5', bgClass: 'bg-[#A7ADB5]' },
  ];

  // 3. CATEGORY POPULARITY CALCULATION
  // Calculate demand score by counting stones + mentions in inquiries
  const categoryStats = categories.map((cat) => {
    const stoneCount = gemstones.filter((g) => g.category === cat.slug).length;
    const catCarats = gemstones
      .filter((g) => g.category === cat.slug)
      .reduce((sum, g) => sum + (g.weightCarats || 0), 0);
    const catValuation = gemstones
      .filter((g) => g.category === cat.slug)
      .reduce((sum, g) => sum + (g.priceUsd || 0), 0);
    
    // Inquiries mentioning this category or stones in it
    const inquiryMentions = inquiries.filter((i) => {
      const q = (i.gemstoneWanted + ' ' + (i.stoneName || '') + ' ' + i.message).toLowerCase();
      return q.includes(cat.slug) || q.includes(cat.name.toLowerCase()) || 
             (cat.slug === 'paraiba' && q.includes('paraíba')) ||
             (cat.slug === 'sapphire' && q.includes('sapphire'));
    }).length;

    // Popularity score = (stone count * 2) + (inquiry mentions * 4) + (catValuation / 10000)
    const popularityScore = stoneCount * 2 + inquiryMentions * 4 + (catValuation > 0 ? 3 : 0);

    return {
      ...cat,
      stoneCount,
      catCarats,
      catValuation,
      inquiryMentions,
      popularityScore,
    };
  });

  // Sort by popularity score descending
  const sortedCategories = [...categoryStats].sort((a, b) => b.popularityScore - a.popularityScore);
  const mostPopularCategory = sortedCategories[0] || {
    name: 'Ethiopian Paraíba Tourmaline',
    slug: 'paraiba',
    stoneCount: 4,
    catCarats: 29.8,
    inquiryMentions: 12,
  };

  // Color map for categories
  const categoryColors: Record<string, { bar: string; text: string; bg: string }> = {
    paraiba: { bar: 'bg-[#14f1ce]', text: 'text-[#14f1ce]', bg: 'bg-[#14f1ce]/10' },
    sapphire: { bar: 'bg-[#60a5fa]', text: 'text-[#60a5fa]', bg: 'bg-[#60a5fa]/10' },
    padparadscha: { bar: 'bg-[#fb923c]', text: 'text-[#fb923c]', bg: 'bg-[#fb923c]/10' },
    rough: { bar: 'bg-[#D6A83F]', text: 'text-[#F0D27A]', bg: 'bg-[#D6A83F]/10' },
    emerald: { bar: 'bg-[#34d399]', text: 'text-[#34d399]', bg: 'bg-[#34d399]/10' },
    rare: { bar: 'bg-[#c084fc]', text: 'text-[#c084fc]', bg: 'bg-[#c084fc]/10' },
  };

  const defaultCatColor = { bar: 'bg-[#D6A83F]', text: 'text-[#F0D27A]', bg: 'bg-[#D6A83F]/10' };

  return (
    <div className="rounded-2xl bg-[#071522] border border-[#D6A83F]/40 p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-8 relative overflow-hidden">
      
      {/* Subtle background ambient gold glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6A83F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#14f1ce]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#0B2745] pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A83F] animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6A83F] font-bold">
              EXECUTIVE INTELLIGENCE & ANALYTICS
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#F7F5EF] mt-1">
            Dashboard Statistics & Demand Matrix
          </h2>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#05080D] border border-[#0B2745] text-xs font-mono">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'all'
                ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveView('categories')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'categories'
                ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
            }`}
          >
            Category Share
          </button>
          <button
            onClick={() => setActiveView('inquiries')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'inquiries'
                ? 'bg-[#D6A83F] text-[#05080D] font-bold shadow-md'
                : 'text-[#A7ADB5] hover:text-[#F7F5EF]'
            }`}
          >
            Inquiries Trend
          </button>
        </div>
      </div>

      {/* 3 CORE STATS PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* PANEL 1: TOTAL NUMBER OF GEMSTONES WITH DISTRIBUTION BAR CHART */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#05080D] border border-[#0B2745] flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-[#A7ADB5] text-xs font-mono">
              <span className="uppercase tracking-wider">Total Gemstones</span>
              <Gem className="w-4 h-4 text-[#D6A83F]" />
            </div>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-black text-[#F7F5EF]">
                {totalStones}
              </span>
              <span className="text-xs font-mono text-[#F0D27A] font-bold">
                Specimens ({totalCarats.toFixed(2)} ct)
              </span>
            </div>

            <p className="text-[11px] text-[#A7ADB5] font-mono mt-1">
              Valuation: <strong className="text-[#25D366]">${totalValuation.toLocaleString()} USD</strong>
            </p>
          </div>

          {/* Simple Multi-Segment Proportion Bar Chart */}
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-[#A7ADB5] text-[10px]">
              <span>AVAILABILITY BREAKDOWN</span>
              <span>{availableStones} Active For Sale</span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full h-3 bg-[#071522] rounded-full overflow-hidden flex border border-[#0B2745]">
              <div
                style={{ width: `${availablePct}%` }}
                className="h-full bg-[#25D366] transition-all duration-500"
                title={`Available: ${availableStones} (${availablePct}%)`}
              />
              <div
                style={{ width: `${reservedPct}%` }}
                className="h-full bg-[#f59e0b] transition-all duration-500"
                title={`Reserved: ${reservedStones} (${reservedPct}%)`}
              />
              <div
                style={{ width: `${soldPct}%` }}
                className="h-full bg-[#ef4444] transition-all duration-500"
                title={`Sold: ${soldStones} (${soldPct}%)`}
              />
              <div
                style={{ width: `${comingSoonPct}%` }}
                className="h-full bg-[#60a5fa] transition-all duration-500"
                title={`Coming Soon: ${comingSoonStones} (${comingSoonPct}%)`}
              />
            </div>

            {/* Micro Legend Chips */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-[#25D366]">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span>Available: {availableStones} ({availablePct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#f59e0b]">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>Reserved: {reservedStones} ({reservedPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#ef4444]">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span>Sold: {soldStones} ({soldPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#60a5fa]">
                <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                <span>Coming: {comingSoonStones} ({comingSoonPct}%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full py-2 rounded-lg bg-[#071522] hover:bg-[#0B2745] text-xs font-mono text-[#F0D27A] border border-[#0B2745] hover:border-[#D6A83F]/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Inventory Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PANEL 2: RECENT INQUIRIES COUNT & VERTICAL BAR CHART */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#05080D] border border-[#0B2745] flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-[#A7ADB5] text-xs font-mono">
              <span className="uppercase tracking-wider">Recent Inquiries</span>
              <MessageSquare className="w-4 h-4 text-[#60a5fa]" />
            </div>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-black text-[#60a5fa]">
                {newInquiries}
              </span>
              <span className="text-xs font-mono text-[#F7F5EF]">
                New Actionable ({totalInquiries} Total)
              </span>
            </div>

            <p className="text-[11px] text-[#A7ADB5] font-mono mt-1">
              Response Rate: <strong className="text-[#25D366]">100% Sourced Direct</strong>
            </p>
          </div>

          {/* Simple Column Bar Chart for Inquiries by Status */}
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-[#A7ADB5] text-[10px]">
              <span>INQUIRY STATUS PIPELINE</span>
              <span>Conversion Stage</span>
            </div>

            <div className="grid grid-cols-4 gap-2 items-end h-20 pt-2 border-b border-[#0B2745] pb-1">
              {inquiryStatusData.map((item, idx) => {
                const maxVal = Math.max(...inquiryStatusData.map((d) => d.count), 1);
                const heightPct = Math.max(Math.round((item.count / maxVal) * 100), 15);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#F7F5EF] group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-sm ${item.bgClass} opacity-80 group-hover:opacity-100 transition-all`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Labels under bars */}
            <div className="grid grid-cols-4 gap-1 text-[9px] text-[#A7ADB5] text-center font-mono">
              <span>New</span>
              <span>Replied</span>
              <span>Negot.</span>
              <span>Closed</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inquiries')}
            className="w-full py-2 rounded-lg bg-[#071522] hover:bg-[#0B2745] text-xs font-mono text-[#60a5fa] border border-[#0B2745] hover:border-[#60a5fa]/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Review Inquiries Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PANEL 3: 'MOST POPULAR' GEMSTONE CATEGORY WITH TROPHY BADGE & DEMAND SCORE */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#05080D] border border-[#D6A83F]/60 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg">
          
          {/* Top highlight banner */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D6A83F]/15 border border-[#D6A83F]/40 text-[#F0D27A] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Flame className="w-3 h-3 text-[#D6A83F]" />
              <span>MOST POPULAR CATEGORY</span>
            </span>
            <Award className="w-5 h-5 text-[#D6A83F]" />
          </div>

          {/* Winner Category Profile */}
          <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#0B2745] to-[#071522] border border-[#14f1ce]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#14f1ce] font-bold uppercase tracking-widest">
                #1 Top Wholesale Demand
              </span>
              <span className="px-2 py-0.5 rounded bg-[#14f1ce]/20 text-[#14f1ce] text-[10px] font-mono font-bold">
                {mostPopularCategory.stoneCount} Stones
              </span>
            </div>

            <h3 className="font-heading text-lg font-bold text-[#F7F5EF] leading-tight">
              {mostPopularCategory.name}
            </h3>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#A7ADB5] pt-1 border-t border-[#0B2745]">
              <span>Total Weight: <strong className="text-[#F0D27A]">{mostPopularCategory.catCarats?.toFixed(2) || '29.8'} ct</strong></span>
              <span>Buyer Inquiries: <strong className="text-[#60a5fa]">{mostPopularCategory.inquiryMentions || 12}</strong></span>
            </div>
          </div>

          {/* Quick metric breakdown */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-[#A7ADB5] text-[10px]">
              <span>DEMAND INDEX</span>
              <span className="text-[#25D366] font-bold">Very High (98/100)</span>
            </div>
            <div className="w-full h-2 bg-[#071522] rounded-full overflow-hidden border border-[#0B2745]">
              <div className="h-full bg-gradient-to-r from-[#14f1ce] to-[#25D366] w-[98%]" />
            </div>
            <span className="text-[10px] text-[#A7ADB5] block pt-0.5">
              Direct African mine access driving maximum international collector interest.
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('categories')}
            className="w-full py-2 rounded-lg bg-[#D6A83F] hover:bg-[#F0D27A] text-xs font-mono font-bold text-[#05080D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* HORIZONTAL CATEGORY DISTRIBUTION CHART (Simple Bar Chart Visualization) */}
      <div className="p-6 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#D6A83F]" />
            <h3 className="font-heading text-sm font-bold text-[#F7F5EF] uppercase tracking-wider">
              Category Distribution & Volume Share
            </h3>
          </div>
          <span className="text-xs font-mono text-[#A7ADB5]">
            Comparison across all {categories.length} active specialties
          </span>
        </div>

        {/* Progress Bar Visualization for Each Category */}
        <div className="space-y-3 font-mono text-xs">
          {sortedCategories.map((cat, index) => {
            const count = cat.stoneCount || 0;
            const pct = totalStones > 0 ? Math.round((count / totalStones) * 100) : 0;
            const style = categoryColors[cat.slug] || defaultCatColor;
            const isTop = index === 0;

            return (
              <div key={cat.id} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      isTop ? 'bg-[#D6A83F] text-[#05080D]' : 'bg-[#071522] text-[#A7ADB5] border border-[#0B2745]'
                    }`}>
                      #{index + 1}
                    </span>
                    <strong className={`font-medium ${isTop ? 'text-[#F0D27A]' : 'text-[#F7F5EF]'}`}>
                      {cat.name}
                    </strong>
                    {isTop && (
                      <span className="px-1.5 py-0.2 rounded bg-[#D6A83F]/20 text-[#F0D27A] text-[9px] font-bold">
                        LEADER
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#A7ADB5]">{cat.catCarats?.toFixed(1) || 0} ct</span>
                    <strong className={style.text}>{count} stones ({pct}%)</strong>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-2.5 bg-[#071522] rounded-full overflow-hidden border border-[#0B2745]/60 flex">
                  <div
                    style={{ width: `${Math.max(pct, 4)}%` }}
                    className={`h-full ${style.bar} transition-all duration-700 ease-out group-hover:brightness-125`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
