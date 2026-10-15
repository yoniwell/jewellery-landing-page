import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit3, Shield, Gem, Check, Save, 
  Search, RefreshCw, Mail, Phone, Lock, Eye, ArrowRight, Tag
} from 'lucide-react';
import { Gemstone, BuyerInquiry, ProductStatus, GemstoneCategory } from '../types/gemstone';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gemstones: Gemstone[];
  inquiries: BuyerInquiry[];
  onAddGemstone: (stone: Gemstone) => void;
  onUpdateGemstone: (stone: Gemstone) => void;
  onDeleteGemstone: (id: string) => void;
  onUpdateInquiryStatus: (id: string, status: BuyerInquiry['status']) => void;
}

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  isOpen,
  onClose,
  gemstones,
  inquiries,
  onAddGemstone,
  onUpdateGemstone,
  onDeleteGemstone,
  onUpdateInquiryStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'inquiries'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStone, setEditingStone] = useState<Gemstone | null>(null);

  // New Stone Form State
  const [newStone, setNewStone] = useState<Partial<Gemstone>>({
    name: '',
    category: 'paraiba',
    subCategory: '',
    dimensions: '9.5 x 7.8 x 5.2 mm',
    shapeCut: 'Cushion Brilliant',
    color: 'Electric Neon Blue-Green',
    origin: 'Ethiopia',
    treatment: 'Natural / Disclosed (Unheated)',
    clarity: 'Eye Clean (VVS)',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: false,
    cuttingPotential: '',
    description: '',
    images: [],
    featured: true,
  });

  if (!isOpen) return null;

  const handleCreateStone = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Gemstone = {
      id: `AG-${Date.now().toString().slice(-4)}`,
      name: newStone.name || 'New Selected Gemstone',
      category: newStone.category as GemstoneCategory || 'paraiba',
      subCategory: newStone.subCategory,
      weightCarats: 0,
      dimensions: newStone.dimensions || 'N/A',
      shapeCut: newStone.shapeCut || 'Faceted',
      color: newStone.color || 'Vivid',
      origin: newStone.origin || 'Ethiopia',
      treatment: newStone.treatment || 'Natural',
      clarity: newStone.clarity || 'Eye Clean',
      priceUsd: newStone.priceUsd ? Number(newStone.priceUsd) : null,
      priceFormatted: newStone.priceFormatted || 'Price on Request',
      status: (newStone.status as ProductStatus) || 'AVAILABLE',
      isRough: Boolean(newStone.isRough),
      cuttingPotential: newStone.cuttingPotential,
      description: newStone.description || 'Fine gemological specimen sourced directly by Abel Gemstone.',
      images: newStone.images && newStone.images.length > 0 ? newStone.images : [],
      featured: Boolean(newStone.featured),
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    onAddGemstone(created);
    setActiveTab('inventory');
    alert('Gemstone successfully published to online inventory!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStone) return;
    onUpdateGemstone(editingStone);
    setEditingStone(null);
  };

  const filteredGemstones = gemstones.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-6xl w-full bg-[#071522] border border-[#D6A83F]/50 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top CMS Header */}
        <div className="p-4 sm:p-6 bg-[#05080D] border-b border-[#0B2745] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B2745] border border-[#D6A83F]/40 flex items-center justify-center text-[#F0D27A]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#D6A83F] uppercase tracking-widest block">
                ABEL GEMSTONE DEALER SYSTEM (CMS)
              </span>
              <h2 className="font-heading text-xl font-bold text-[#F7F5EF]">
                Inventory Management & Buyer Inquiries
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('inventory'); setEditingStone(null); }}
              className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold'
                  : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              Inventory ({gemstones.length})
            </button>

            <button
              onClick={() => { setActiveTab('add'); setEditingStone(null); }}
              className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold'
                  : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Stone</span>
            </button>

            <button
              onClick={() => { setActiveTab('inquiries'); setEditingStone(null); }}
              className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                activeTab === 'inquiries'
                  ? 'bg-[#D6A83F] text-[#05080D] font-bold'
                  : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF]'
              }`}
            >
              <span>Buyer Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#071522] ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CMS Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Search & Stats Bar */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#A7ADB5] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, color, origin..."
                    className="w-full pl-9 pr-4 py-2 rounded bg-[#05080D] border border-[#0B2745] text-xs text-[#F7F5EF] outline-none focus:border-[#D6A83F]"
                  />
                </div>

                <div className="text-xs font-mono text-[#A7ADB5]">
                  Showing <strong className="text-[#F0D27A]">{filteredGemstones.length}</strong> active stones
                </div>
              </div>

              {/* Editing Form Modal if active */}
              {editingStone && (
                <form onSubmit={handleSaveEdit} className="p-5 rounded-xl bg-[#05080D] border border-[#D6A83F] space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-[#F0D27A]">
                      Editing: {editingStone.name} ({editingStone.id})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingStone(null)}
                      className="text-xs text-[#A7ADB5] hover:text-[#F7F5EF]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[#A7ADB5] font-mono mb-1">Status</label>
                      <select
                        value={editingStone.status}
                        onChange={(e) => setEditingStone({ ...editingStone, status: e.target.value as ProductStatus })}
                        className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="SOLD">SOLD</option>
                        <option value="COMING SOON">COMING SOON</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] font-mono mb-1">Price / Display</label>
                      <input
                        type="text"
                        value={editingStone.priceFormatted || ''}
                        onChange={(e) => setEditingStone({ ...editingStone, priceFormatted: e.target.value })}
                        className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A7ADB5] font-mono mb-1">Dimensions</label>
                      <input
                        type="text"
                        value={editingStone.dimensions || ''}
                        onChange={(e) => setEditingStone({ ...editingStone, dimensions: e.target.value })}
                        className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Stone Table */}
              <div className="rounded-xl border border-[#0B2745] overflow-hidden bg-[#05080D]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#071522] text-[#A7ADB5] border-b border-[#0B2745] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Stone</th>
                      <th className="p-3">Shape / Cut</th>
                      <th className="p-3">Color / Origin</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Wholesale Price</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B2745]/60 text-[#F7F5EF]">
                    {filteredGemstones.map((stone) => (
                      <tr key={stone.id} className="hover:bg-[#071522]/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img src={stone.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-[#0B2745]" />
                          <div>
                            <span className="font-bold block text-[#F7F5EF]">{stone.name}</span>
                            <span className="text-[10px] text-[#A7ADB5]">#{stone.id}</span>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-[#F0D27A]">{stone.shapeCut}</td>
                        <td className="p-3">
                          <span className="text-[#14f1ce] block">{stone.color}</span>
                          <span className="text-[10px] text-[#A7ADB5]">{stone.origin}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stone.status === 'AVAILABLE' ? 'bg-[#25D366]/20 text-[#25D366]' :
                            stone.status === 'SOLD' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                            stone.status === 'RESERVED' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                            'bg-[#60a5fa]/20 text-[#60a5fa]'
                          }`}>
                            {stone.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#F0D27A]">{stone.priceFormatted || 'On Request'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setEditingStone(stone)}
                            className="p-1.5 rounded bg-[#071522] hover:bg-[#0B2745] text-[#D6A83F] cursor-pointer"
                            title="Edit Stone"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove stone #${stone.id} (${stone.name})?`)) {
                                onDeleteGemstone(stone.id);
                              }
                            }}
                            className="p-1.5 rounded bg-[#071522] hover:bg-[#ef4444]/20 text-[#ef4444] cursor-pointer"
                            title="Delete Stone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: PUBLISH NEW GEMSTONE */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateStone} className="space-y-4 max-w-4xl mx-auto">
              <h3 className="font-heading text-lg font-bold text-[#F0D27A]">
                Publish New Gemstone / Parcel to Inventory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Stone Title / Heading *</label>
                  <input
                    type="text"
                    required
                    value={newStone.name}
                    onChange={(e) => setNewStone({ ...newStone, name: e.target.value })}
                    placeholder="e.g., 4.50 ct Ethiopian Paraíba Tourmaline Cushion"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Gemstone Type *</label>
                  <select
                    value={newStone.category}
                    onChange={(e: any) => setNewStone({ ...newStone, category: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  >
                    <option value="paraiba">Ethiopian Paraíba Tourmaline</option>
                    <option value="sapphire">Sapphire</option>
                    <option value="padparadscha">Padparadscha Sapphire</option>
                    <option value="rough">Rough Gemstones</option>
                    <option value="emerald">African Emerald</option>
                    <option value="rare">Rare & Collector Stone</option>
                  </select>
                </div>


                <div>
                  <label className="block text-[#A7ADB5] mb-1">Shape / Cut *</label>
                  <input
                    type="text"
                    required
                    value={newStone.shapeCut}
                    onChange={(e) => setNewStone({ ...newStone, shapeCut: e.target.value })}
                    placeholder="e.g., Cushion Modified Brilliant"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Color Description *</label>
                  <input
                    type="text"
                    required
                    value={newStone.color}
                    onChange={(e) => setNewStone({ ...newStone, color: e.target.value })}
                    placeholder="e.g., Neon Lagoon Blue-Green"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Geographic Origin *</label>
                  <input
                    type="text"
                    required
                    value={newStone.origin}
                    onChange={(e) => setNewStone({ ...newStone, origin: e.target.value })}
                    placeholder="e.g., Ethiopia / Madagascar / East Africa"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Treatment Disclosure *</label>
                  <input
                    type="text"
                    required
                    value={newStone.treatment}
                    onChange={(e) => setNewStone({ ...newStone, treatment: e.target.value })}
                    placeholder="e.g., Natural / Unheated"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Wholesale Price / Display *</label>
                  <input
                    type="text"
                    required
                    value={newStone.priceFormatted}
                    onChange={(e) => setNewStone({ ...newStone, priceFormatted: e.target.value })}
                    placeholder="e.g., $18,500 USD or Price on Request"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7ADB5] text-xs font-mono mb-1">Stone Description & Character</label>
                <textarea
                  rows={3}
                  value={newStone.description}
                  onChange={(e) => setNewStone({ ...newStone, description: e.target.value })}
                  placeholder="Detailed gemological description, luster, facet precision, inclusions notes..."
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-xs text-[#F7F5EF]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 rounded bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold text-xs uppercase tracking-widest font-mono cursor-pointer"
                >
                  Publish Stone to Live Site
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BUYER INQUIRIES INBOX */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-[#F7F5EF]">
                  Direct Wholesale Inquiries Desk
                </h3>
                <span className="text-xs font-mono text-[#A7ADB5]">
                  Routed to: info@abelgemstone.com
                </span>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-3"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#D6A83F] font-bold">#{inq.id}</span>
                          <strong className="text-sm font-heading text-[#F7F5EF]">{inq.name}</strong>
                          {inq.company && (
                            <span className="text-xs text-[#A7ADB5]">({inq.company})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-[#A7ADB5] mt-1">
                          <span>Country: <strong className="text-[#F7F5EF]">{inq.country}</strong></span>
                          <span>Email: <strong className="text-[#F7F5EF]">{inq.email}</strong></span>
                          {inq.whatsapp && <span>WhatsApp: <strong className="text-[#25D366]">{inq.whatsapp}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          inq.status === 'New' ? 'bg-[#25D366]/20 text-[#25D366]' :
                          inq.status === 'Replied' ? 'bg-[#60a5fa]/20 text-[#60a5fa]' :
                          'bg-[#D6A83F]/20 text-[#D6A83F]'
                        }`}>
                          {inq.status}
                        </span>
                        <select
                          value={inq.status}
                          onChange={(e: any) => onUpdateInquiryStatus(inq.id, e.target.value)}
                          className="text-[10px] bg-[#071522] border border-[#0B2745] rounded p-1 text-[#F7F5EF]"
                        >
                          <option value="New">New</option>
                          <option value="Replied">Replied</option>
                          <option value="Under Negotiation">Under Negotiation</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#071522] border border-[#0B2745] text-xs font-mono space-y-1">
                      <div className="flex justify-between text-[#D6A83F]">
                        <span>Gemstone Wanted: <strong>{inq.gemstoneWanted}</strong></span>
                        <span>Budget: <strong>{inq.budgetRange}</strong></span>
                      </div>
                      <p className="text-[#A7ADB5] font-light mt-1 text-xs">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A7ADB5]">
                      <span>Received: {inq.timestamp}</span>
                      <a
                        href={`mailto:${inq.email}?subject=Abel Gemstone Inquiry #${inq.id}`}
                        className="text-[#D6A83F] hover:underline"
                      >
                        Reply via Email →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
