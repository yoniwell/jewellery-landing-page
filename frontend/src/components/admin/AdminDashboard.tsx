import React, { useState, useEffect } from 'react';
import { 
  Gem, LayoutDashboard, Database, MessageSquare, Settings, LogOut, 
  ExternalLink, Search, Edit, Trash2, Copy, 
  RefreshCw, Download, Phone, Mail, 
  KeyRound, Image as ImageIcon,
  Layers, FileText, Plus, ArrowLeft, DollarSign, Tag,
  LayoutGrid, List, Sparkles, UploadCloud, Video, Play, Check, Loader2, X, Film
} from 'lucide-react';
import { Gemstone, BuyerInquiry, ProductStatus } from '../../types/gemstone';
import { api } from '../../services/api';
import { DashboardStatsWidget } from './DashboardStatsWidget';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onViewPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'inquiries' | 'add' | 'edit' | 'settings'>('inventory');
  
  // Data States
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Inventory Filters & View Mode (Default to Gallery Card View)
  const [inventorySearch, setInventorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');

  const [editingStone, setEditingStone] = useState<Gemstone | null>(null);

  // Media Upload States for Add Specimen Form (saved as files to /uploads folder)
  const [addImages, setAddImages] = useState<string[]>([]);
  const [addVideoUrl, setAddVideoUrl] = useState<string>('');
  const [isUploadingAddPhoto, setIsUploadingAddPhoto] = useState<boolean>(false);
  const [isUploadingAddVideo, setIsUploadingAddVideo] = useState<boolean>(false);

  // Media Upload States for Edit Specimen Form
  const [isUploadingEditPhoto, setIsUploadingEditPhoto] = useState<boolean>(false);
  const [isUploadingEditVideo, setIsUploadingEditVideo] = useState<boolean>(false);

  // File Upload Handlers (saved to server /uploads folder)
  const handlePhotoUpload = async (files: FileList | null, isEdit: boolean) => {
    if (!files || files.length === 0) return;
    try {
      if (isEdit) setIsUploadingEditPhoto(true);
      else setIsUploadingAddPhoto(true);

      const fileList = Array.from(files);
      const res = await api.uploadFiles(fileList);
      if (res.urls && res.urls.length > 0) {
        if (isEdit && editingStone) {
          setEditingStone({
            ...editingStone,
            images: [...editingStone.images, ...res.urls],
          });
        } else {
          setAddImages((prev) => [...prev, ...res.urls]);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo(s)');
    } finally {
      if (isEdit) setIsUploadingEditPhoto(false);
      else setIsUploadingAddPhoto(false);
    }
  };

  const handleVideoUpload = async (file: File | null, isEdit: boolean) => {
    if (!file) return;
    try {
      if (isEdit) setIsUploadingEditVideo(true);
      else setIsUploadingAddVideo(true);

      const res = await api.uploadFile(file);
      if (res.url) {
        if (isEdit && editingStone) {
          setEditingStone({
            ...editingStone,
            videoUrl: res.url,
            has360View: true,
          });
        } else {
          setAddVideoUrl(res.url);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload video file');
    } finally {
      if (isEdit) setIsUploadingEditVideo(false);
      else setIsUploadingAddVideo(false);
    }
  };

  // Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Fetch all initial data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [stonesRes, inqRes] = await Promise.all([
        api.getGemstones(),
        api.getInquiries(),
      ]);
      setGemstones(stonesRes);
      setInquiries(inqRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. CHANGE AVAILABILITY (Inline Status Changer)
  const handleInlineStatusChange = async (stone: Gemstone, newStatus: ProductStatus) => {
    try {
      const updated = await api.updateGemstone(stone.id, { status: newStatus });
      setGemstones((prev) => prev.map((g) => (g.id === stone.id ? updated : g)));
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // 2. REMOVE SOLD STONES
  const handleDeleteStone = async (stoneId: string, stoneName: string) => {
    if (!confirm(`Are you sure you want to permanently remove specimen #${stoneId} (${stoneName}) from the catalog?`)) return;
    try {
      await api.deleteGemstone(stoneId);
      setGemstones((prev) => prev.filter((g) => g.id !== stoneId));
      if (editingStone?.id === stoneId) {
        setEditingStone(null);
        setActiveTab('inventory');
      }
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete gemstone');
    }
  };

  const handleBulkPurgeSold = async () => {
    const soldStones = gemstones.filter((g) => g.status === 'SOLD');
    if (soldStones.length === 0) {
      alert('No stones currently marked as SOLD.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently purge all ${soldStones.length} SOLD stones from inventory?`)) return;
    
    try {
      for (const stone of soldStones) {
        await api.deleteGemstone(stone.id);
      }
      fetchData();
      alert(`Purged ${soldStones.length} sold stones successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error purging sold stones');
    }
  };

  // 2B. CLEAR ALL DEMO STONES
  const handleClearAllDemoStones = async () => {
    if (!confirm(`Are you sure you want to permanently delete all ${gemstones.length} demo gemstones?\n\nThis will clear the entire inventory so you can enter your own real gemstone data.`)) return;
    try {
      await api.clearAllGemstones();
      setGemstones([]);
      if (editingStone) setEditingStone(null);
      fetchData();
      alert('All demo gemstones have been deleted. You can now use "Add Gemstone" to input your real data.');
    } catch (err: any) {
      alert(err.message || 'Failed to clear gemstones');
    }
  };

  // 2C. LOAD AUTHENTIC REAL AFRICAN GEMSTONES
  const handleLoadRealData = async () => {
    if (!confirm('Load authentic, realistic African gemstone specimens (Ethiopian Paraíba, Sapphire, Emerald, Tsavorite, Rough crystals)?')) return;
    try {
      const loaded = await api.resetRealGemstones();
      setGemstones(loaded);
      fetchData();
      alert(`Loaded ${loaded.length} authentic African gemstone specimens.`);
    } catch (err: any) {
      alert(err.message || 'Failed to load gemstone inventory');
    }
  };

  // 3. DUPLICATE LOT
  const handleDuplicateStone = async (stone: Gemstone) => {
    try {
      const duplicateData: Partial<Gemstone> = {
        ...stone,
        name: `${stone.name} (Duplicate Specimen)`,
        status: 'AVAILABLE',
      };
      delete duplicateData.id;
      const created = await api.createGemstone(duplicateData);
      setGemstones([created, ...gemstones]);
      fetchData();
      alert(`Duplicated successfully as specimen #${created.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate gemstone');
    }
  };

  // 4. OPEN EDIT PAGE (Dedicated Page, NOT a modal)
  const handleStartEditStone = (stone: Gemstone) => {
    setEditingStone({ ...stone });
    setActiveTab('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. SAVE EDITED STONE (From dedicated Page)
  const handleSaveEditedStone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStone) return;
    try {
      const updated = await api.updateGemstone(editingStone.id, editingStone);
      setGemstones((prev) => prev.map((g) => (g.id === editingStone.id ? updated : g)));
      setEditingStone(null);
      setActiveTab('inventory');
      fetchData();
      alert('Gemstone details and specifications updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    }
  };

  // 6. INQUIRIES MANAGEMENT
  const handleUpdateInquiryStatus = async (id: string, status: BuyerInquiry['status']) => {
    try {
      const updated = await api.updateInquiry(id, { status });
      setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update inquiry');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm(`Delete inquiry record #${id}?`)) return;
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete inquiry');
    }
  };

  const handleExportInquiriesCsv = () => {
    if (inquiries.length === 0) return alert('No inquiries to export');
    const headers = ['ID', 'Date', 'Name', 'Company', 'Country', 'Email', 'WhatsApp', 'Gemstone', 'Rough/Cut', 'Budget', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      i.timestamp,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${i.country.replace(/"/g, '""')}"`,
      i.email,
      i.whatsapp || '',
      `"${i.gemstoneWanted.replace(/"/g, '""')}"`,
      i.roughOrFinished,
      `"${i.budgetRange.replace(/"/g, '""')}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Abel_Gemstone_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 7. PASSWORD UPDATE
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordStatus({ type: 'success', msg: 'Security passcode updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', msg: err.message || 'Failed to update passcode.' });
    }
  };

  // Filtered Gemstones list (Category-Free)
  const filteredGemstones = gemstones.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.origin.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.color.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.shapeCut.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredInquiries = inquiries.filter((i) => {
    return inquiryStatusFilter === 'ALL' || i.status === inquiryStatusFilter;
  });

  const statusColors: Record<ProductStatus, string> = {
    AVAILABLE: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    RESERVED: 'bg-amber-50 text-amber-800 border-amber-300',
    SOLD: 'bg-rose-50 text-rose-800 border-rose-300',
    'COMING SOON': 'bg-blue-50 text-blue-800 border-blue-300',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row selection:bg-amber-200 selection:text-amber-900">
      
      {/* MOBILE TOP NAVIGATION BAR FOR ADMIN (Crisp White) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-slate-900 block">ABEL GEMSTONE</span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-semibold">ADMIN PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-mono text-slate-700 flex items-center gap-1 min-h-[36px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Site</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE TAB SCROLLER (HORIZONTAL - No Gallery Tab) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none sticky top-[57px] z-20">
        {[
          { id: 'inventory', label: `Inventory Cards (${gemstones.length})`, icon: Database },
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'inquiries', label: `Inquiries (${inquiries.filter((i) => i.status === 'New').length})`, icon: MessageSquare },
          { id: 'settings', label: 'Security', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add') setEditingStone(null);
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap flex items-center gap-1.5 min-h-[36px] transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* SIDEBAR NAVIGATION (DESKTOP - Sticky, Clean White) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 shadow-sm z-20 sticky top-0 h-screen overflow-y-auto">
        
        {/* Sidebar Header & Navigation */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-slate-900 block">
                  ABEL GEMSTONE
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold">
                  EXECUTIVE CMS
                </span>
              </div>
            </div>

            {/* Logged-in Principal Badge */}
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold border border-amber-300">
                AG
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-900 truncate block">
                  {user?.name || 'Abel Gemstone Executive'}
                </span>
                <span className="text-[10px] text-slate-500 truncate block font-mono">
                  {user?.role || 'Managing Gemologist'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-mono">
            
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inventory' || activeTab === 'edit'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span>Inventory Catalog</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                activeTab === 'inventory' || activeTab === 'edit' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 text-slate-700'
              }`}>
                {gemstones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Buyer Inquiries</span>
              </div>
              {inquiries.filter((i) => i.status === 'New').length > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  {inquiries.filter((i) => i.status === 'New').length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Security & Settings</span>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50 shrink-0">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono font-semibold text-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* MAIN ADMIN DASHBOARD BODY (White Background & Clean Layout) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-bold block">
              MANAGEMENT CONSOLE
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
               {activeTab === 'overview' && 'Executive Overview & Analytics'}
              {activeTab === 'inventory' && 'Wholesale Gemstone Catalog'}
             
              {activeTab === 'add' && 'Add New Gemstone Specimen'}
              {activeTab === 'edit' && `Edit Gemstone #${editingStone?.id || ''}`}
              {activeTab === 'inquiries' && 'Direct Buyer Inquiries'}
              {activeTab === 'settings' && 'Security & Sourcing Configuration'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            {activeTab === 'inventory' && (
              <button
                onClick={() => {
                  setEditingStone(null);
                  setAddImages([]);
                  setAddVideoUrl('');
                  setActiveTab('add');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gemstone</span>
              </button>
            )}

            {activeTab === 'inquiries' && (
              <button
                onClick={handleExportInquiriesCsv}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono font-semibold text-slate-700 flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <DashboardStatsWidget
              gemstones={gemstones}
              inquiries={inquiries}
              onNavigateTab={(tab) => {
                if (tab === 'add') setEditingStone(null);
                setActiveTab(tab as any);
              }}
            />
          </div>
        )}

        {/* 2. INVENTORY CATALOG TAB (Visual Card Grid styled like Gallery Cards) */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter and Search Bar Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search by ID (#101), Name, Color, Shape, Origin..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses ({gemstones.length})</option>
                  <option value="AVAILABLE">Available ({gemstones.filter(g => g.status === 'AVAILABLE').length})</option>
                  <option value="RESERVED">Reserved ({gemstones.filter(g => g.status === 'RESERVED').length})</option>
                  <option value="SOLD">Sold ({gemstones.filter(g => g.status === 'SOLD').length})</option>
                  <option value="COMING SOON">Coming Soon ({gemstones.filter(g => g.status === 'COMING SOON').length})</option>
                </select>

                {/* View switcher: Cards vs Table */}
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-100 p-0.5">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'cards' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'table' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleBulkPurgeSold}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                  title="Purge all SOLD stones permanently"
                >
                  Purge Sold
                </button>
              </div>
            </div>

            {/* CARD GRID VIEW (Styled directly like the Gallery Cards!) */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGemstones.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Gem className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      {gemstones.length === 0 ? 'No Gemstones in Inventory' : 'No Gemstones Match Search Filter'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto font-mono">
                      {gemstones.length === 0 
                        ? 'Your inventory is currently empty. Click below to add a new gemstone.'
                        : 'Try adjusting your search query or status filter.'}
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setEditingStone(null);
                          setAddImages([]);
                          setAddVideoUrl('');
                          setActiveTab('add');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-sm transition-colors cursor-pointer"
                      >
                        + Add Gemstone
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredGemstones.map((stone) => (
                    <div
                      key={stone.id}
                      className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                    >
                      {/* Card Media Stage */}
                      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                        {stone.images && stone.images.length > 0 ? (
                          <img
                            src={stone.images[0]}
                            alt={stone.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : stone.videoUrl ? (
                          <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                            <video
                              src={stone.videoUrl}
                              muted
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-amber-400/40">
                              <Film className="w-3 h-3" />
                              <span>VIDEO</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-[10px] font-mono font-bold text-amber-400 backdrop-blur-md shadow-sm">
                            #{stone.id}
                          </span>
                          {stone.has360View && (
                            <span className="px-1.5 py-0.5 rounded-md bg-teal-500/90 text-slate-950 text-[9px] font-mono font-bold">
                              360°
                            </span>
                          )}
                          {stone.images.length > 1 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-white/80 text-slate-800 text-[9px] font-mono font-bold">
                              {stone.images.length} photos
                            </span>
                          )}
                        </div>

                        {/* Top Right: 1-Click Status Dropdown */}
                        <div className="absolute top-2.5 right-2.5">
                          <select
                            value={stone.status}
                            onChange={(e) => handleInlineStatusChange(stone, e.target.value as ProductStatus)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-pointer backdrop-blur-md shadow-sm ${statusColors[stone.status]}`}
                            title="Click to toggle availability"
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="RESERVED">RESERVED</option>
                            <option value="SOLD">SOLD</option>
                            <option value="COMING SOON">COMING SOON</option>
                          </select>
                        </div>

                        {/* Bottom Overlay Info Strip */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
                          <span className="font-bold text-amber-300 bg-slate-950/60 px-2 py-0.5 rounded">
                            {stone.weightCarats} ct
                          </span>
                          <span className="truncate max-w-[140px] text-right bg-slate-950/60 px-2 py-0.5 rounded">
                            {stone.origin}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                            {stone.name}
                          </h4>
                          
                          <div className="text-[11px] text-teal-700 font-mono mt-1 line-clamp-1">
                            {stone.color}
                          </div>

                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                            {stone.shapeCut} • {stone.dimensions || 'N/A'}
                          </div>
                        </div>

                        {/* Price & Actions Strip */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Wholesale:</span>
                            <span className="font-mono font-bold text-sm text-slate-900">
                              {stone.priceFormatted || 'Price on Request'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEditStone(stone)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-amber-800 border border-slate-200 flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
                              title="Edit Gemstone Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Specimen</span>
                            </button>

                            <button
                              onClick={() => handleDuplicateStone(stone)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                              title="Duplicate Specimen"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteStone(stone.id, stone.name)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                              title="Delete Specimen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TABLE VIEW (Optional Toggle) */}
            {viewMode === 'table' && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[11px] font-semibold">
                      <tr>
                        <th className="p-4">Specimen</th>
                        <th className="p-4">Weight / Dimensions</th>
                        <th className="p-4">Color / Origin</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4">Wholesale Price</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGemstones.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500 font-mono">
                            No gemstones in inventory. Click "+ Add Gemstone" above to create one.
                          </td>
                        </tr>
                      ) : (
                        filteredGemstones.map((stone) => (
                        <tr key={stone.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {stone.images && stone.images.length > 0 ? (
                                <img
                                  src={stone.images[0]}
                                  alt={stone.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                                />
                              ) : stone.videoUrl ? (
                                <video
                                  src={stone.videoUrl}
                                  muted
                                  autoPlay
                                  loop
                                  playsInline
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-900"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                                  <ImageIcon className="w-5 h-5 opacity-40" />
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-900 block font-heading text-sm">
                                  {stone.name}
                                </span>
                                <span className="text-[11px] text-slate-500">#{stone.id} • {stone.shapeCut}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-900 block">{stone.weightCarats} ct</span>
                            <span className="text-[11px] text-slate-500">{stone.dimensions || 'N/A'}</span>
                          </td>

                          <td className="p-4">
                            <span className="text-teal-700 font-semibold block">{stone.color}</span>
                            <span className="text-[11px] text-slate-500">{stone.origin}</span>
                          </td>

                          <td className="p-4">
                            <select
                              value={stone.status}
                              onChange={(e) => handleInlineStatusChange(stone, e.target.value as ProductStatus)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer ${statusColors[stone.status]}`}
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="RESERVED">RESERVED</option>
                              <option value="SOLD">SOLD</option>
                              <option value="COMING SOON">COMING SOON</option>
                            </select>
                          </td>

                          <td className="p-4 font-mono font-bold text-slate-900">
                            {stone.priceFormatted || 'Price on Request'}
                          </td>

                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleStartEditStone(stone)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                              title="Edit stone"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateStone(stone)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                              title="Duplicate Lot"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStone(stone.id, stone.name)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                              title="Delete specimen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. DEDICATED ADD NEW GEMSTONE PAGE (Category-Free, No Lab Report Section) */}
        {activeTab === 'add' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Breadcrumbs & Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Inventory</span>
                </button>
                <div className="text-xs font-mono text-slate-500">
                  <span>Inventory Catalog</span> <span className="text-slate-400">/</span> <strong className="text-slate-900">Add New Specimen</strong>
                </div>
              </div>
            </div>

            {/* Swiss Precision Add Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;

                const stoneData: Partial<Gemstone> = {
                  name: form.stoneName.value,
                  category: form.category?.value || 'paraiba',
                  weightCarats: parseFloat(form.weightCarats.value) || 1.0,
                  dimensions: form.dimensions.value,
                  shapeCut: form.shapeCut.value,
                  color: form.color.value,
                  origin: form.origin.value,
                  treatment: form.treatment.value,
                  clarity: form.clarity.value,
                  priceUsd: form.priceUsd.value ? Number(form.priceUsd.value) : null,
                  priceFormatted: form.priceFormatted.value || 'Price on Request',
                  status: form.status.value as ProductStatus,
                  isRough: form.isRough.checked,
                  description: form.description.value,
                  images: addImages,
                  videoUrl: addVideoUrl || undefined,
                  has360View: form.has360View.checked || Boolean(addVideoUrl),
                  featured: form.featured.checked,
                };

                try {
                  const created = await api.createGemstone(stoneData);
                  setGemstones([created, ...gemstones]);
                  setAddImages([]);
                  setAddVideoUrl('');
                  setActiveTab('inventory');
                  fetchData();
                  alert(`Specimen published successfully as #${created.id}!`);
                } catch (err: any) {
                  alert(err.message || 'Failed to publish gemstone');
                }
              }}
              className="space-y-6"
            >
              
              {/* Section 1: Specimen Identification */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">01</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Specimen Identification
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">Core Parameters</span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-mono">
                  <div className="sm:col-span-3">
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Specimen Title / Headline *</label>
                    <input
                      name="stoneName"
                      required
                      placeholder="e.g. 5.20 ct Ethiopian Paraíba Tourmaline Cushion"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Availability Status</label>
                    <select
                      name="status"
                      defaultValue="AVAILABLE"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs cursor-pointer"
                    >
                      <option value="AVAILABLE">AVAILABLE (For Sale)</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="SOLD">SOLD</option>
                      <option value="COMING SOON">COMING SOON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Carat Weight (ct) *</label>
                    <input
                      name="weightCarats"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 5.20"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Dimensions (mm)</label>
                    <input
                      name="dimensions"
                      placeholder="e.g. 10.45 x 8.80 x 5.92 mm"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Gemological Specifications */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">02</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Gemological Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">Physical Traits</span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-mono">
                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Shape & Cut *</label>
                    <input
                      name="shapeCut"
                      required
                      placeholder="e.g. Cushion Modified Brilliant"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Color Grade / Hue *</label>
                    <input
                      name="color"
                      required
                      placeholder="e.g. Neon Lagoon Blue-Green"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Clarity Grade</label>
                    <input
                      name="clarity"
                      placeholder="e.g. Eye Clean (VVS)"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Geographic Origin</label>
                    <input
                      name="origin"
                      placeholder="e.g. Ethiopia (Oromia Region)"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Treatment / Thermal Status</label>
                    <input
                      name="treatment"
                      placeholder="e.g. Natural / No Indications of Treatment (Unheated)"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Commercial Valuation */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">03</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Commercial Pricing & Valuation
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">B2B Terms</span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Public Display Price</label>
                    <input
                      name="priceFormatted"
                      placeholder="$14,800 USD or Price on Request"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Internal Numeric USD Valuation (Optional)</label>
                    <input
                      name="priceUsd"
                      type="number"
                      placeholder="14800"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Photography & Media Assets (File Uploads) */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">04</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Photography & 360 Media Assets
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Server Folder Storage
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* 4A: Gemstone Photos Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-900">
                        Specimen Photos ({addImages.length} attached) *
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        JPEG, JPEJ, JPG, PNG, WebP
                      </span>
                    </div>

                    {/* Streamlined Drag & Drop Zone */}
                    <div className="relative group border border-dashed border-slate-300 hover:border-slate-900 rounded-xl p-6 bg-slate-50/50 hover:bg-white transition-all text-center cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.jpeg,.jpg,.jpej,.png,.webp,.gif,.avif,.heic"
                        onChange={(e) => handlePhotoUpload(e.target.files, false)}
                        disabled={isUploadingAddPhoto}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        {isUploadingAddPhoto ? (
                          <>
                            <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                            <p className="text-xs font-mono font-bold text-slate-900">
                              Uploading photo file(s) to server...
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                              <UploadCloud className="w-5 h-5 text-slate-700" />
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold text-slate-900 block tracking-tight">
                                Click or Drag & Drop Photos to Upload
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                                Multiple angles allowed • Stored and linked automatically
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Photos Preview List */}
                    {addImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                        {addImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-2xs flex items-center justify-center">
                            <img
                              src={imgUrl}
                              alt={`Uploaded ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (imgUrl.startsWith('/uploads') && !target.dataset.retried) {
                                  target.dataset.retried = 'true';
                                  target.src = `http://localhost:5000${imgUrl}`;
                                }
                              }}
                            />
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono font-bold tracking-wider backdrop-blur-xs">
                              {idx === 0 ? 'PRIMARY' : `#${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAddImages(addImages.filter((_, i) => i !== idx))}
                              className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4B: Video / 360 Spin Upload */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-900">
                        360° Video Scan (Optional)
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        MP4, WebM, MOV (Max 150 MB)
                      </span>
                    </div>

                    {addVideoUrl ? (
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 font-bold">
                            <Film className="w-4 h-4 text-slate-700" />
                            <span className="truncate max-w-xs">{addVideoUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAddVideoUrl('')}
                            className="px-2.5 py-1 text-xs font-mono text-rose-600 hover:text-white hover:bg-rose-600 rounded border border-rose-200 transition-colors cursor-pointer"
                          >
                            Remove Video
                          </button>
                        </div>
                        <video src={addVideoUrl} controls className="max-h-44 rounded-lg bg-black mx-auto w-full object-contain" />
                      </div>
                    ) : (
                      <div className="relative group border border-dashed border-slate-300 hover:border-slate-900 rounded-xl p-5 bg-slate-50/50 hover:bg-white transition-all text-center">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e.target.files?.[0] || null, false)}
                          disabled={isUploadingAddVideo}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                          {isUploadingAddVideo ? (
                            <>
                              <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                              <p className="text-xs font-mono font-bold text-slate-900">
                                Uploading video file to server folder...
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                                <Video className="w-5 h-5 text-slate-700" />
                              </div>
                              <div>
                                <span className="text-xs font-mono font-bold text-slate-900 block tracking-tight">
                                  Click or Drag & Drop Video File to Upload
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                                  MP4, WebM, MOV — Uploads to server folder with video preview
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Toggles */}
                  <div className="flex items-center gap-6 pt-3 flex-wrap text-xs font-mono text-slate-700 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input name="has360View" type="checkbox" defaultChecked={Boolean(addVideoUrl)} className="rounded accent-slate-900 cursor-pointer" />
                      <span className="font-semibold text-slate-900">Enable 360° Axis Interactive Viewer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input name="featured" type="checkbox" defaultChecked className="rounded accent-slate-900 cursor-pointer" />
                      <span className="font-semibold text-slate-900">Feature on Homepage Vault</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input name="isRough" type="checkbox" className="rounded accent-slate-900 cursor-pointer" />
                      <span className="font-semibold text-slate-900">Rough Specimen Material</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Description & Field Notes */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">05</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Gemological Description & Field Notes
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">Narrative</span>
                </div>

                <div className="p-6">
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Include details about color depth, brilliance, facet precision, origin extraction, and clarity..."
                    className="w-full p-3.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="px-6 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  Cancel & Return
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs font-mono uppercase tracking-widest shadow-xs cursor-pointer transition-colors"
                >
                  Publish Specimen to Catalog
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 4. DEDICATED EDIT GEMSTONE PAGE (Category-Free, No Lab Report Section) */}
        {activeTab === 'edit' && editingStone && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Breadcrumbs & Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStone(null);
                    setActiveTab('inventory');
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Inventory</span>
                </button>
                <div className="text-xs font-mono text-slate-500">
                  <span>Inventory Catalog</span> <span className="text-slate-400">/</span> <strong className="text-slate-900">Edit Specimen #{editingStone.id}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteStone(editingStone.id, editingStone.name)}
                  className="px-3 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Specimen</span>
                </button>
              </div>
            </div>

            {/* Swiss Precision Edit Form */}
            <form onSubmit={handleSaveEditedStone} className="space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">01</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Specimen Identification
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-bold uppercase tracking-wider">
                    SPECIMEN REF #{editingStone.id}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-mono">
                  <div className="sm:col-span-3">
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Specimen Title / Headline *</label>
                    <input
                      value={editingStone.name}
                      onChange={(e) => setEditingStone({ ...editingStone, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Availability Status</label>
                    <select
                      value={editingStone.status}
                      onChange={(e) => setEditingStone({ ...editingStone, status: e.target.value as ProductStatus })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs cursor-pointer"
                    >
                      <option value="AVAILABLE">AVAILABLE (For Sale)</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="SOLD">SOLD</option>
                      <option value="COMING SOON">COMING SOON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Carat Weight (ct)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingStone.weightCarats}
                      onChange={(e) => setEditingStone({ ...editingStone, weightCarats: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Dimensions (mm)</label>
                    <input
                      value={editingStone.dimensions}
                      onChange={(e) => setEditingStone({ ...editingStone, dimensions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Gemological Specifications */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">02</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Gemological Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">Physical Traits</span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-mono">
                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Shape & Cut</label>
                    <input
                      value={editingStone.shapeCut}
                      onChange={(e) => setEditingStone({ ...editingStone, shapeCut: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Color Grade / Variety</label>
                    <input
                      value={editingStone.color}
                      onChange={(e) => setEditingStone({ ...editingStone, color: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Clarity Grade</label>
                    <input
                      value={editingStone.clarity}
                      onChange={(e) => setEditingStone({ ...editingStone, clarity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Geographic Origin</label>
                    <input
                      value={editingStone.origin}
                      onChange={(e) => setEditingStone({ ...editingStone, origin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Treatment / Thermal Status</label>
                    <input
                      value={editingStone.treatment}
                      onChange={(e) => setEditingStone({ ...editingStone, treatment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Commercial Pricing */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">03</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Commercial Pricing & Valuation
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">B2B Terms</span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Wholesale Display Price</label>
                    <input
                      value={editingStone.priceFormatted || ''}
                      onChange={(e) => setEditingStone({ ...editingStone, priceFormatted: e.target.value })}
                      placeholder="$14,800 USD or Price on Request"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-2">Numeric Valuation USD (Optional)</label>
                    <input
                      type="number"
                      value={editingStone.priceUsd || ''}
                      onChange={(e) => setEditingStone({ ...editingStone, priceUsd: e.target.value ? Number(e.target.value) : null })}
                      placeholder="14800"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Photography & Media Assets */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">04</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Photography & 360 Media Assets
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Live Media Storage
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* 4A: Photos List with File Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-900">
                        Specimen Photos ({editingStone.images.length} photos)
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Upload photo files (JPEG, JPEJ, JPG, PNG, WebP)
                      </span>
                    </div>

                    {/* Streamlined Upload More Photos Dropzone */}
                    <div className="relative group border border-dashed border-slate-300 hover:border-slate-900 rounded-xl p-5 bg-slate-50/50 hover:bg-white transition-all text-center cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.jpeg,.jpg,.jpej,.png,.webp,.gif,.avif,.heic"
                        onChange={(e) => handlePhotoUpload(e.target.files, true)}
                        disabled={isUploadingEditPhoto}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        {isUploadingEditPhoto ? (
                          <>
                            <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                            <p className="text-xs font-mono font-bold text-slate-900">
                              Uploading photo file(s) to server...
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                              <UploadCloud className="w-5 h-5 text-slate-700" />
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold text-slate-900 block tracking-tight">
                                + Upload Additional Specimen Photos as Files
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                                Photos are appended to this specimen's gallery
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Photo Thumbnails with Delete Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                      {editingStone.images.map((img, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-2xs flex items-center justify-center">
                          <img
                            src={img}
                            alt={`Angle ${i + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (img.startsWith('/uploads') && !target.dataset.retried) {
                                target.dataset.retried = 'true';
                                target.src = `http://localhost:5000${img}`;
                              }
                            }}
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono font-bold tracking-wider backdrop-blur-xs">
                            {i === 0 ? 'PRIMARY' : `#${i + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = editingStone.images.filter((_, idx) => idx !== i);
                              setEditingStone({ ...editingStone, images: filtered });
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4B: Video / 360 Spin Upload */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-900">
                        Gemstone 360° Video / Video Scan (File Upload)
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        MP4, WebM, MOV (Max 150 MB)
                      </span>
                    </div>

                    {editingStone.videoUrl ? (
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 font-bold">
                            <Film className="w-4 h-4 text-slate-700" />
                            <span className="truncate max-w-xs">{editingStone.videoUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingStone({ ...editingStone, videoUrl: '' })}
                            className="px-2.5 py-1 text-xs font-mono text-rose-600 hover:text-white hover:bg-rose-600 rounded border border-rose-200 transition-colors cursor-pointer"
                          >
                            Remove Video
                          </button>
                        </div>
                        <video src={editingStone.videoUrl} controls className="max-h-44 rounded-lg bg-black mx-auto w-full object-contain" />
                      </div>
                    ) : (
                      <div className="relative group border border-dashed border-slate-300 hover:border-slate-900 rounded-xl p-5 bg-slate-50/50 hover:bg-white transition-all text-center">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e.target.files?.[0] || null, true)}
                          disabled={isUploadingEditVideo}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                          {isUploadingEditVideo ? (
                            <>
                              <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                              <p className="text-xs font-mono font-bold text-slate-900">
                                Uploading video file to server folder...
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                                <Video className="w-5 h-5 text-slate-700" />
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-900 block tracking-tight">
                                Click or Drag & Drop Video File to Upload
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Description */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">05</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase font-mono">
                      Gemological Description & Field Notes
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">Narrative</span>
                </div>

                <div className="p-6">
                  <textarea
                    rows={4}
                    value={editingStone.description}
                    onChange={(e) => setEditingStone({ ...editingStone, description: e.target.value })}
                    className="w-full p-3.5 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-mono text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStone(null);
                    setActiveTab('inventory');
                  }}
                  className="px-6 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  Cancel & Return
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs font-mono uppercase tracking-widest shadow-xs cursor-pointer transition-colors"
                >
                  Save Changes to Specimen
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 5. INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 font-semibold">Filter Status:</span>
                {['ALL', 'New', 'Replied', 'Under Negotiation', 'Closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInquiryStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                      inquiryStatusFilter === s
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="text-xs text-blue-700 font-bold">
                {filteredInquiries.length} inquiries found
              </div>
            </div>

            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                  No buyer inquiries match this filter.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 space-y-4 shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            #{inq.id}
                          </span>
                          <h3 className="font-heading text-base font-bold text-slate-900">{inq.name}</h3>
                          {inq.company && (
                            <span className="text-xs text-slate-500 font-mono">({inq.company})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-1 flex-wrap">
                          <span>Country: <strong className="text-slate-800">{inq.country}</strong></span>
                          <span>Email: <strong className="text-slate-800">{inq.email}</strong></span>
                          {inq.whatsapp && <span>WhatsApp: <strong className="text-emerald-700">{inq.whatsapp}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e: any) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                            inq.status === 'New' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            inq.status === 'Replied' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Replied">Replied</option>
                          <option value="Under Negotiation">Under Negotiation</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-800 flex-wrap gap-2 font-medium">
                        <span>Gemstone Wanted: <strong className="text-amber-800">{inq.gemstoneWanted}</strong></span>
                        <span>Target Budget: <strong>{inq.budgetRange}</strong></span>
                        <span>Format: <strong>{inq.roughOrFinished}</strong></span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pt-1 italic">
                        "{inq.message}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono flex-wrap gap-3">
                      <span className="text-slate-400">Received: {inq.timestamp}</span>

                      <div className="flex items-center gap-3">
                        {inq.whatsapp && (
                          <a
                            href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is Abel Gemstone replying to your wholesale inquiry #${inq.id} regarding ${inq.gemstoneWanted}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-colors font-semibold"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Buyer</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${inq.email}?subject=Abel Gemstone Inquiry Reply - Ref #${inq.id}&body=Dear ${inq.name},%0D%0A%0D%0AThank you for contacting Abel Gemstone regarding ${inq.gemstoneWanted}.`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>Reply Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* 6. SECURITY & SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in">
            
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Security Passcode Management
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Update executive login credentials for API endpoint <code>/api/auth/change-password</code>
                  </p>
                </div>
              </div>

              {passwordStatus && (
                <div className={`p-3 rounded-lg text-xs font-mono ${
                  passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {passwordStatus.msg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Passcode</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current passcode"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Security Passcode (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new security passcode"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider cursor-pointer shadow-sm transition-colors"
                >
                  Update Passcode
                </button>
              </form>
            </div>

            {/* Profile Overview Card */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs font-mono">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Direct Sourcing Desk Configuration
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Main Email</span>
                  <strong className="text-slate-900">info@abelgemstone.com</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Sales Email</span>
                  <strong className="text-slate-900">sales@abelgemstone.com</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">WhatsApp Direct</span>
                  <strong className="text-emerald-700">+251 91 100 0000</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Settlement Currency</span>
                  <strong className="text-slate-900">USD ($)</strong>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
