import React from 'react';
import { 
  Gem, MessageSquare, ChevronRight, Sparkles, PlusCircle, ShieldCheck
} from 'lucide-react';
import { Gemstone, BuyerInquiry } from '../../types/gemstone';

interface DashboardStatsWidgetProps {
  gemstones: Gemstone[];
  inquiries: BuyerInquiry[];
  onNavigateTab: (tab: 'inventory' | 'inquiries' | 'add') => void;
}

export const DashboardStatsWidget: React.FC<DashboardStatsWidgetProps> = ({
  gemstones,
  inquiries,
  onNavigateTab,
}) => {
  // 1. GEMSTONE METRICS
  const totalStones = gemstones.length;
  const availableStones = gemstones.filter((g) => g.status === 'AVAILABLE').length;
  const reservedStones = gemstones.filter((g) => g.status === 'RESERVED').length;
  const soldStones = gemstones.filter((g) => g.status === 'SOLD').length;
  const comingSoonStones = gemstones.filter((g) => g.status === 'COMING SOON').length;
  const totalCarats = gemstones.reduce((sum, g) => sum + (g.weightCarats || 0), 0);
  const totalValuation = gemstones.reduce((sum, g) => sum + (g.priceUsd || 0), 0);
  const roughStones = gemstones.filter((g) => g.isRough).length;
  const finishedStones = totalStones - roughStones;

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
    { label: 'New', count: newInquiries, bgClass: 'bg-emerald-500' },
    { label: 'Replied', count: repliedInquiries, bgClass: 'bg-blue-500' },
    { label: 'Negotiation', count: negotiationInquiries, bgClass: 'bg-amber-500' },
    { label: 'Closed', count: closedInquiries, bgClass: 'bg-slate-400' },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] uppercase font-mono tracking-widest text-amber-700 font-bold">
              EXECUTIVE INTELLIGENCE & ANALYTICS
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Gemstone Inventory & Wholesale Intelligence
          </h2>
        </div>

        <button
          onClick={() => onNavigateTab('add')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Specimen</span>
        </button>
      </div>

      {/* 3 CORE STATS PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL 1: TOTAL NUMBER OF GEMSTONES WITH DISTRIBUTION BAR CHART */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span className="uppercase tracking-wider">Total Gemstones</span>
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Gem className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900">
                {totalStones}
              </span>
              <span className="text-xs font-mono text-amber-700 font-bold">
                Specimens ({totalCarats.toFixed(2)} ct)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-mono mt-1">
              Catalog Valuation: <strong className="text-emerald-600 font-bold">${totalValuation.toLocaleString()} USD</strong>
            </p>
          </div>

          {/* Simple Multi-Segment Proportion Bar */}
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>AVAILABILITY BREAKDOWN</span>
              <span className="text-slate-700 font-semibold">{availableStones} Active For Sale</span>
            </div>
            
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex border border-slate-300">
              <div
                style={{ width: `${availablePct}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`Available: ${availableStones} (${availablePct}%)`}
              />
              <div
                style={{ width: `${reservedPct}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Reserved: ${reservedStones} (${reservedPct}%)`}
              />
              <div
                style={{ width: `${soldPct}%` }}
                className="h-full bg-rose-500 transition-all duration-500"
                title={`Sold: ${soldStones} (${soldPct}%)`}
              />
              <div
                style={{ width: `${comingSoonPct}%` }}
                className="h-full bg-blue-500 transition-all duration-500"
                title={`Coming Soon: ${comingSoonStones} (${comingSoonPct}%)`}
              />
            </div>

            {/* Micro Legend Chips */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Available: {availableStones} ({availablePct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Reserved: {reservedStones} ({reservedPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Sold: {soldStones} ({soldPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Coming: {comingSoonStones} ({comingSoonPct}%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-mono font-semibold text-slate-800 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Open Inventory Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PANEL 2: RECENT INQUIRIES COUNT & VERTICAL BAR CHART */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span className="uppercase tracking-wider">Buyer Inquiries</span>
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {newInquiries}
              </span>
              <span className="text-xs font-mono text-slate-700 font-medium">
                New Actionable ({totalInquiries} Total)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-mono mt-1">
              Direct Wholesale Pipeline: <strong className="text-emerald-600 font-semibold">Active</strong>
            </p>
          </div>

          {/* Simple Column Bar Chart for Inquiries by Status */}
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>INQUIRY STATUS PIPELINE</span>
              <span className="text-slate-700 font-semibold">Conversion Stage</span>
            </div>

            <div className="grid grid-cols-4 gap-2 items-end h-20 pt-2 border-b border-slate-300 pb-1">
              {inquiryStatusData.map((item, idx) => {
                const maxVal = Math.max(...inquiryStatusData.map((d) => d.count), 1);
                const heightPct = Math.max(Math.round((item.count / maxVal) * 100), 15);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-700 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-sm ${item.bgClass} opacity-85 group-hover:opacity-100 transition-all`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Labels under bars */}
            <div className="grid grid-cols-4 gap-1 text-[9px] text-slate-500 text-center font-mono">
              <span>New</span>
              <span>Replied</span>
              <span>Negot.</span>
              <span>Closed</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inquiries')}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-mono font-semibold text-slate-800 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Review Inquiries Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PANEL 3: SOURCING & MATERIAL FORM BREAKDOWN */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-amber-50/50 border border-amber-300 flex flex-col justify-between space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>DIRECT SOURCING SPECIMENS</span>
            </span>
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-amber-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-widest">
                African Origin Guarantee
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-mono font-bold">
                100% Direct
              </span>
            </div>

            <h3 className="font-heading text-lg font-bold text-slate-900 leading-tight">
              Single-Source Sourced Vault
            </h3>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span>Faceted Finished: <strong className="text-slate-800">{finishedStones} Stones</strong></span>
              <span>Rough Crystals: <strong className="text-blue-700">{roughStones} Stones</strong></span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>MINED & VAULTED</span>
              <span className="text-emerald-700 font-bold">{totalCarats.toFixed(1)} Total Carats</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div className="h-full bg-gradient-to-r from-teal-500 to-amber-500 w-full" />
            </div>
            <span className="text-[10px] text-slate-500 block pt-0.5">
              Ethiopian Shakiso and East African primary deposits with direct custody.
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-xs font-mono font-bold text-slate-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>View All Specimens</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
