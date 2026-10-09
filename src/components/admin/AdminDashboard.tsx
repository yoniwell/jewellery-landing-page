import React, { useState, useEffect } from 'react';
import { 
  Gem, LayoutDashboard, Database, MessageSquare, PlusCircle, Settings, LogOut, 
  ExternalLink, Search, Filter, Edit, Trash2, Copy, Shield, CheckCircle, 
  TrendingUp, DollarSign, Eye, RefreshCw, Download, Phone, Mail, ArrowUpRight, 
  Save, X, AlertTriangle, KeyRound, Clock, User, Upload, Image as ImageIcon,
  Video, Tag, Layers, FileText, Check, Plus, AlertCircle, Camera
} from 'lucide-react';
import { Gemstone, BuyerInquiry, ProductStatus, GemCertificate, GalleryItem } from '../../types/gemstone';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'inquiries' | 'add' | 'categories' | 'gallery' | 'settings'>('overview');
  
  // Data States
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; description: string; stoneCount?: number }>>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('ALL');
  const [gallerySearch, setGallerySearch] = useState('');

  // Edit Modal State
  const [editingStone, setEditingStone] = useState<Gemstone | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Fetch all initial data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [stonesRes, inqRes, statsRes, catRes, galRes] = await Promise.all([
        api.getGemstones(),
        api.getInquiries(),
        api.getStats(),
        api.getCategories(),
        api.getGallery(),
      ]);
      setGemstones(stonesRes);
      setInquiries(inqRes);
      setStats(statsRes);
      setCategories(catRes);
      setGallery(galRes);
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
      fetchData(); // sync stats
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // 2. REMOVE SOLD STONES
  const handleDeleteStone = async (stoneId: string, stoneName: string) => {
    if (!confirm(`Are you sure you want to permanently remove stone #${stoneId} (${stoneName}) from database?`)) return;
    try {
      await api.deleteGemstone(stoneId);
      setGemstones((prev) => prev.filter((g) => g.id !== stoneId));
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
      alert(`Cloned successfully as #${created.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate gemstone');
    }
  };

  // 4. SAVE EDITED STONE (Weight, Price, Description, Images, Videos, Certificate)
  const handleSaveEditedStone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStone) return;
    try {
      const updated = await api.updateGemstone(editingStone.id, editingStone);
      setGemstones((prev) => prev.map((g) => (g.id === editingStone.id ? updated : g)));
      setEditingStone(null);
      fetchData();
      alert('Gemstone details, photos, and certificate updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    }
  };

  // 5. CREATE NEW CATEGORY
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategoryLoading(true);
    try {
      const created = await api.createCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
      setCategories([...categories, created]);
      setNewCatName('');
      setNewCatDesc('');
      alert(`Category "${created.name}" created successfully! You can now assign gemstones to it.`);
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Stones assigned to it will remain in inventory.`)) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      alert('Category removed.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
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

  // 7. GALLERY MANAGEMENT (Owner visual media CMS)
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const itemData: Partial<GalleryItem> = {
      title: form.title.value,
      category: form.category.value,
      imageUrl: form.imageUrl.value,
      thumbnailUrl: form.thumbnailUrl?.value || form.imageUrl.value,
      origin: form.origin.value,
      description: form.description.value,
      isVideo: Boolean(form.isVideo?.checked),
    };

    try {
      const created = await api.addGalleryItem(itemData);
      setGallery([created, ...gallery]);
      setShowAddGalleryModal(false);
      alert(`Media "${created.title}" published to live Gallery!`);
    } catch (err: any) {
      alert(err.message || 'Failed to add gallery item');
    }
  };

  const handleSaveEditedGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    try {
      const updated = await api.updateGalleryItem(editingGalleryItem.id, editingGalleryItem);
      setGallery(gallery.map((g) => (g.id === editingGalleryItem.id ? updated : g)));
      setEditingGalleryItem(null);
      alert('Gallery item updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id: string, title: string) => {
    if (!confirm(`Delete media item "${title}" from Gallery?`)) return;
    try {
      await api.deleteGalleryItem(id);
      setGallery(gallery.filter((g) => g.id !== id));
      alert('Gallery item removed.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete gallery item');
    }
  };

  // 8. PASSWORD UPDATE
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

  // Filtered Gemstones list
  const filteredGemstones = gemstones.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.origin.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      g.color.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || g.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const filteredInquiries = inquiries.filter((i) => {
    return inquiryStatusFilter === 'ALL' || i.status === inquiryStatusFilter;
  });

  const statusColors = {
    AVAILABLE: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30',
    RESERVED: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
    SOLD: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30',
    'COMING SOON': 'bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/30',
  };

  return (
    <div className="min-h-screen bg-[#05080D] text-[#F7F5EF] flex flex-col md:flex-row">
      
      {/* MOBILE TOP NAVIGATION BAR FOR ADMIN */}
      <div className="md:hidden bg-[#071522] border-b border-[#0B2745] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B2745] border border-[#D6A83F]/50 flex items-center justify-center">
            <Gem className="w-4 h-4 text-[#F0D27A]" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-[#F7F5EF] block">ABEL GEMSTONE</span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#D6A83F]">CMS ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="px-2.5 py-1.5 rounded bg-[#05080D] border border-[#0B2745] text-[11px] font-mono text-[#F0D27A] flex items-center gap-1 min-h-[36px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Site</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-[#ef4444] rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE TAB SCROLLER (HORIZONTAL) */}
      <div className="md:hidden bg-[#05080D] border-b border-[#0B2745] px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none sticky top-[57px] z-20">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'inventory', label: `Inventory (${gemstones.length})`, icon: Database },
          { id: 'add', label: 'Publish', icon: PlusCircle },
          { id: 'categories', label: 'Categories', icon: Tag },
          { id: 'gallery', label: 'Gallery', icon: Camera },
          { id: 'inquiries', label: `Inquiries (${inquiries.filter((i) => i.status === 'New').length})`, icon: MessageSquare },
          { id: 'settings', label: 'Security', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap flex items-center gap-1.5 min-h-[36px] transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-sm'
                  : 'bg-[#071522] text-[#A7ADB5] border border-[#0B2745]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* SIDEBAR NAVIGATION (DESKTOP) */}
      <aside className="hidden md:flex w-64 bg-[#071522] border-r border-[#0B2745] flex-col justify-between shrink-0">
        
        {/* Sidebar Header */}
        <div>
          <div className="p-6 border-b border-[#0B2745]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B2745] border border-[#D6A83F]/50 flex items-center justify-center shadow-lg">
                <Gem className="w-5 h-5 text-[#F0D27A]" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#F7F5EF] block">
                  ABEL GEMSTONE
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#D6A83F]">
                  EXECUTIVE CMS
                </span>
              </div>
            </div>

            {/* Logged-in Principal Badge */}
            <div className="mt-4 p-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#D6A83F]/20 text-[#D6A83F] flex items-center justify-center text-xs font-mono font-bold">
                AG
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#F7F5EF] truncate block">
                  {user?.name || 'Abel Gemstone Executive'}
                </span>
                <span className="text-[10px] text-[#A7ADB5] truncate block font-mono">
                  {user?.role || 'Managing Gemologist'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links strictly matching Section 34 */}
          <nav className="p-4 space-y-1 text-xs font-mono">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span>Inventory Catalog</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'inventory' ? 'bg-[#05080D]/20 text-[#05080D]' : 'bg-[#05080D] text-[#F0D27A]'
              }`}>
                {gemstones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Gemstone</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Category Manager</span>
              </div>
              <span className="text-[10px] text-[#A7ADB5] font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4" />
                <span>Gallery Manager</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'gallery' ? 'bg-[#05080D]/20 text-[#05080D]' : 'bg-[#05080D] text-[#14f1ce]'
              }`}>
                {gallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Buyer Inquiries</span>
              </div>
              {inquiries.filter((i) => i.status === 'New').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#25D366] text-[#05080D] font-bold">
                  {inquiries.filter((i) => i.status === 'New').length} NEW
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold shadow-md'
                  : 'text-[#A7ADB5] hover:text-[#F7F5EF] hover:bg-[#0B2745]/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Security & Passcode</span>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-[#0B2745] space-y-2 text-xs font-mono">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#05080D] border border-[#0B2745] text-[#A7ADB5] hover:text-[#F0D27A] hover:border-[#D6A83F]/40 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#0B2745] flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F7F5EF]">
              {activeTab === 'overview' && 'Executive Sourcing Desk Overview'}
              {activeTab === 'inventory' && 'Inventory Catalog & Availability Hub'}
              {activeTab === 'add' && 'Publish New Gemstone Specimen'}
              {activeTab === 'categories' && 'Dynamic Category & Specialty Manager'}
              {activeTab === 'inquiries' && 'International Buyer Inquiries Desk'}
              {activeTab === 'settings' && 'Dealer Security & System Settings'}
            </h1>
            <p className="text-xs text-[#A7ADB5] font-mono mt-1">
              Live Express REST API • No developer required for sales or updates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-2.5 rounded-lg bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/40 text-[#A7ADB5] hover:text-[#F7F5EF] transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#D6A83F]' : ''}`} />
              <span>Sync</span>
            </button>

            {activeTab === 'inventory' && (
              <>
                <button
                  onClick={handleBulkPurgeSold}
                  className="px-3.5 py-2 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 hover:bg-[#ef4444]/20 text-[#ef4444] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  title="Purge all sold stones"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Sold</span>
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Stone</span>
                </button>
              </>
            )}

            {activeTab === 'inquiries' && (
              <button
                onClick={handleExportInquiriesCsv}
                className="px-4 py-2 rounded-lg bg-[#071522] border border-[#D6A83F]/40 hover:border-[#D6A83F] text-[#F0D27A] text-xs font-mono flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Dashboard Statistics & Demand Matrix Chart Widget */}
            <DashboardStatsWidget
              gemstones={gemstones}
              inquiries={inquiries}
              categories={categories}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-2xl bg-[#071522] border border-[#0B2745] flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-heading text-sm font-bold text-[#F7F5EF]">Quick Management Tasks</h3>
                <p className="text-xs text-[#A7ADB5] font-mono mt-0.5">Frequent actions for the gemstone owner</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-4 py-2 rounded-lg bg-[#D6A83F] text-[#05080D] font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Gemstone</span>
                </button>
                <button
                  onClick={() => { setStatusFilter('SOLD'); setActiveTab('inventory'); }}
                  className="px-4 py-2 rounded-lg bg-[#05080D] border border-[#0B2745] text-xs font-mono text-[#ef4444] hover:border-[#ef4444]/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Review Sold Stones</span>
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-4 py-2 rounded-lg bg-[#05080D] border border-[#0B2745] text-xs font-mono text-[#14f1ce] hover:border-[#14f1ce]/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Manage Categories</span>
                </button>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="p-6 rounded-2xl bg-[#071522] border border-[#0B2745] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-[#F7F5EF]">Recent Executive Activity Stream</h3>
                <Clock className="w-4 h-4 text-[#D6A83F]" />
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-60 pr-2">
                {stats?.recentActivity?.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-lg bg-[#05080D] border border-[#0B2745] text-xs font-mono flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[#F0D27A] font-bold mr-2">{act.user}:</span>
                      <span className="text-[#A7ADB5]">{act.action}</span>
                    </div>
                    <span className="text-[10px] text-[#A7ADB5] shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. INVENTORY CATALOG TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter Toolbar */}
            <div className="p-4 rounded-xl bg-[#071522] border border-[#0B2745] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
              
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#A7ADB5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search by ID, name, origin, color..."
                  className="w-full pl-9 pr-4 py-2 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#A7ADB5]">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#A7ADB5]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="SOLD">SOLD</option>
                  <option value="COMING SOON">COMING SOON</option>
                </select>
              </div>

              <div className="text-xs text-[#F0D27A]">
                Showing <strong>{filteredGemstones.length}</strong> stones
              </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-2xl border border-[#0B2745] overflow-hidden bg-[#071522] shadow-2xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#05080D] text-[#A7ADB5] border-b border-[#0B2745] uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Specimen Details</th>
                    <th className="p-4">Weight / Dimensions</th>
                    <th className="p-4">Color & Origin</th>
                    <th className="p-4">Availability (1-Click Change)</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B2745]/60">
                  {filteredGemstones.map((stone) => (
                    <tr key={stone.id} className="hover:bg-[#05080D]/50 transition-colors">
                      
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#05080D] border border-[#0B2745] shrink-0 relative group">
                          <img src={stone.images[0]} alt="" className="w-full h-full object-cover" />
                          {stone.certificate && (
                            <span className="absolute bottom-0 right-0 bg-[#D6A83F] text-[#05080D] text-[8px] font-bold px-1 rounded-tl">
                              {stone.certificate.laboratory}
                            </span>
                          )}
                        </div>
                        <div>
                          <strong className="font-heading text-sm text-[#F7F5EF] block">{stone.name}</strong>
                          <span className="text-[10px] text-[#A7ADB5]">Ref: #{stone.id} • {stone.shapeCut}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#F0D27A] block">{stone.weightCarats} ct</span>
                        <span className="text-[11px] text-[#A7ADB5]">{stone.dimensions || 'N/A'}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-[#14f1ce] block font-semibold">{stone.color}</span>
                        <span className="text-[11px] text-[#A7ADB5]">{stone.origin}</span>
                      </td>

                      {/* 1-Click Availability changer */}
                      <td className="p-4">
                        <select
                          value={stone.status}
                          onChange={(e) => handleInlineStatusChange(stone, e.target.value as ProductStatus)}
                          className={`px-2.5 py-1.5 rounded text-[10px] font-bold border cursor-pointer ${statusColors[stone.status]}`}
                          title="Change availability status instantly"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                          <option value="COMING SOON">COMING SOON</option>
                        </select>
                      </td>

                      <td className="p-4 font-mono font-bold text-[#F0D27A]">
                        {stone.priceFormatted || 'Price on Request'}
                      </td>

                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => setEditingStone(stone)}
                          className="p-2 rounded bg-[#05080D] hover:bg-[#0B2745] text-[#D6A83F] border border-[#0B2745] transition-colors cursor-pointer"
                          title="Edit stone, photos, certificate, price & weight"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDuplicateStone(stone)}
                          className="p-2 rounded bg-[#05080D] hover:bg-[#0B2745] text-[#60a5fa] border border-[#0B2745] transition-colors cursor-pointer"
                          title="Duplicate Lot"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteStone(stone.id, stone.name)}
                          className="p-2 rounded bg-[#05080D] hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#0B2745] transition-colors cursor-pointer"
                          title="Delete / Remove stone"
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

        {/* 3. PUBLISH NEW GEMSTONE TAB */}
        {activeTab === 'add' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as any;
              
              // Certificate object if lab specified
              const certLab = form.certLab.value;
              const certReport = form.certReport.value;
              const certObj: GemCertificate | undefined = certLab && certReport ? {
                laboratory: certLab,
                reportNumber: certReport,
                date: form.certDate.value || new Date().toISOString().slice(0, 10),
                weight: parseFloat(form.weightCarats.value) || 0,
                shape: form.shapeCut.value,
                dimensions: form.dimensions.value,
                color: form.color.value,
                origin: form.origin.value,
                treatment: form.treatment.value,
                comments: form.certComments.value || 'Verified natural cuprian / corundum gemstone.',
                verified: true,
              } : undefined;

              const imageInputs = [form.imageUrl1.value, form.imageUrl2.value, form.imageUrl3.value].filter(Boolean);

              const stoneData: Partial<Gemstone> = {
                name: form.stoneName.value,
                category: form.category.value,
                subCategory: form.subCategory.value,
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
                isRough: form.category.value === 'rough' || form.isRough.checked,
                cuttingPotential: form.cuttingPotential.value,
                description: form.description.value,
                images: imageInputs.length > 0 ? imageInputs : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'],
                videoUrl: form.videoUrl.value || undefined,
                has360View: form.has360View.checked,
                featured: form.featured.checked,
                certificate: certObj,
              };

              try {
                const created = await api.createGemstone(stoneData);
                setGemstones([created, ...gemstones]);
                setActiveTab('inventory');
                fetchData();
                alert(`Published successfully as #${created.id}!`);
              } catch (err: any) {
                alert(err.message || 'Failed to publish');
              }
            }}
            className="p-8 rounded-2xl bg-[#071522] border border-[#D6A83F]/40 shadow-2xl space-y-6 max-w-4xl mx-auto animate-in fade-in"
          >
            <div className="border-b border-[#0B2745] pb-4">
              <span className="text-xs font-mono text-[#D6A83F] uppercase tracking-widest block">
                PUBLISH NEW SPECIMEN
              </span>
              <h2 className="font-heading text-xl font-bold text-[#F7F5EF] mt-1">
                Gemstone Specifications, Pricing & Certification
              </h2>
            </div>

            {/* Basic Spec Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              
              <div>
                <label className="block text-[#A7ADB5] mb-1">Stone Title / Heading *</label>
                <input
                  name="stoneName"
                  required
                  placeholder="e.g. 4.25 ct Ethiopian Paraíba Tourmaline Cushion"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Category *</label>
                <select
                  name="category"
                  defaultValue="paraiba"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Sub-Category (Optional)</label>
                <input
                  name="subCategory"
                  placeholder="e.g. Royal Blue, Padparadscha, Rough Crystal"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Carat Weight (ct) *</label>
                <input
                  name="weightCarats"
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 4.25"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Shape & Cut *</label>
                <input
                  name="shapeCut"
                  required
                  placeholder="e.g. Cushion Modified Brilliant"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Color Variety *</label>
                <input
                  name="color"
                  required
                  placeholder="e.g. Electric Neon Lagoon Blue-Green"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Geographic Origin *</label>
                <input
                  name="origin"
                  required
                  placeholder="e.g. Ethiopia (Oromia Region)"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Treatment Status *</label>
                <input
                  name="treatment"
                  required
                  placeholder="e.g. Natural / Unheated"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Clarity Grade</label>
                <input
                  name="clarity"
                  placeholder="e.g. Eye Clean (VVS Grade)"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Dimensions (mm)</label>
                <input
                  name="dimensions"
                  placeholder="e.g. 10.45 x 8.80 x 5.90 mm"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Wholesale Display Price *</label>
                <input
                  name="priceFormatted"
                  placeholder="e.g. $18,500 USD or Price on Request"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Valuation (USD Numeric)</label>
                <input
                  name="priceUsd"
                  type="number"
                  placeholder="e.g. 18500"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Availability Status</label>
                <select
                  name="status"
                  defaultValue="AVAILABLE"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="SOLD">SOLD</option>
                  <option value="COMING SOON">COMING SOON</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Cutting Potential (for Rough)</label>
                <input
                  name="cuttingPotential"
                  placeholder="e.g. Yield estimated 5+ ct finished gem"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

            </div>

            {/* Image & Video Upload Section strictly from Section 34 */}
            <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#D6A83F]">
                <ImageIcon className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider">Photographs & Video Showcase</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Primary Photo URL *</label>
                  <input
                    name="imageUrl1"
                    defaultValue="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
                    className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Photo 2 (Macro)</label>
                  <input
                    name="imageUrl2"
                    placeholder="https://..."
                    className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Photo 3 (Loupe)</label>
                  <input
                    name="imageUrl3"
                    placeholder="https://..."
                    className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Video Stream URL (MP4 / WebM / 360 Spin)</label>
                <input
                  name="videoUrl"
                  placeholder="e.g. https://assets.mixkit.co/videos/preview/..."
                  className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#F7F5EF]">
                  <input name="has360View" type="checkbox" defaultChecked className="rounded accent-[#D6A83F]" />
                  <span>Enable 360° Axis Interactive Viewer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#F7F5EF]">
                  <input name="featured" type="checkbox" defaultChecked className="rounded accent-[#D6A83F]" />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#F7F5EF]">
                  <input name="isRough" type="checkbox" className="rounded accent-[#D6A83F]" />
                  <span>Is Rough Material</span>
                </label>
              </div>
            </div>

            {/* Certificate Fields strictly from Section 29 & 34 */}
            <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#D6A83F]">
                <Shield className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider">Official Gemological Laboratory Certificate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Laboratory</label>
                  <select name="certLab" className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]">
                    <option value="">No Lab Certificate (Uncertified)</option>
                    <option value="GIA">GIA (Gemological Institute of America)</option>
                    <option value="GRS">GRS (GemResearch Swisslab)</option>
                    <option value="SSEF">SSEF (Swiss Gemmological Institute)</option>
                    <option value="Gübelin">Gübelin Gem Lab</option>
                    <option value="AIGS">AIGS (Asian Institute of Gemological Sciences)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Report Number</label>
                  <input name="certReport" placeholder="e.g. GIA-6224891045" className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]" />
                </div>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Report Date</label>
                  <input name="certDate" type="date" className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]" />
                </div>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Spectroscopic & Lab Comments</label>
                <input name="certComments" placeholder="e.g. Cuprian Tourmaline. Verified high copper & manganese content." className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#A7ADB5] text-xs font-mono mb-1">Gemological Description & Notes</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Include details about color depth, luster, facet precision, origin extraction, and brilliance..."
                className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-xs font-mono text-[#F7F5EF]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#0B2745]">
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="px-6 py-2.5 rounded bg-[#05080D] text-xs font-mono text-[#A7ADB5] hover:text-[#F7F5EF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer shadow-lg"
              >
                Publish Gemstone Lot
              </button>
            </div>
          </form>
        )}

        {/* 4. DYNAMIC CATEGORY MANAGER TAB strictly from Section 34 */}
        {activeTab === 'categories' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            
            {/* Create Category Form */}
            <div className="p-8 rounded-2xl bg-[#071522] border border-[#D6A83F]/40 shadow-2xl space-y-4">
              <div>
                <span className="text-xs font-mono text-[#D6A83F] uppercase tracking-widest block">
                  SECTION 34 • DYNAMIC CATEGORY MANAGEMENT
                </span>
                <h2 className="font-heading text-xl font-bold text-[#F7F5EF] mt-1">
                  Add New Gemstone Category
                </h2>
                <p className="text-xs text-[#A7ADB5] font-mono mt-1">
                  Add new gemstone specialties (e.g. Cobalt Spinel, Tanzanite, Demantoid, Aquamarine) without needing a developer.
                </p>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs font-mono pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A7ADB5] mb-1">Category Name *</label>
                    <input
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Tanzanian Spinel"
                      className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A7ADB5] mb-1">Brief Category Description</label>
                    <input
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g. Intense cobalt and neon pink spinels from Mahenge deposits."
                      className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={categoryLoading}
                    className="px-6 py-2.5 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer"
                  >
                    {categoryLoading ? 'Creating...' : '+ Add Category'}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Categories Table */}
            <div className="rounded-2xl border border-[#0B2745] overflow-hidden bg-[#071522] shadow-xl">
              <div className="p-4 bg-[#05080D] border-b border-[#0B2745] flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-[#F7F5EF]">Active Sourcing Categories ({categories.length})</span>
                <span className="text-[#D6A83F]">Dynamic System</span>
              </div>

              <div className="divide-y divide-[#0B2745]">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4 text-xs font-mono hover:bg-[#05080D]/40 transition-colors">
                    <div>
                      <strong className="text-sm font-heading text-[#F7F5EF] block">{cat.name}</strong>
                      <p className="text-[#A7ADB5] text-[11px] font-light mt-0.5">{cat.description}</p>
                      <span className="text-[10px] text-[#F0D27A] mt-1 block">Slug: <code>{cat.slug}</code></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#05080D] border border-[#0B2745] text-[11px] text-[#14f1ce] font-bold">
                        {cat.stoneCount || 0} stones
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 5. INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-[#071522] border border-[#0B2745] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#A7ADB5]">Filter Status:</span>
                {['ALL', 'New', 'Replied', 'Under Negotiation', 'Closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInquiryStatusFilter(s)}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      inquiryStatusFilter === s
                        ? 'bg-[#D6A83F] text-[#05080D] font-bold'
                        : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#60a5fa]">
                <strong>{filteredInquiries.length}</strong> inquiries matching filter
              </div>
            </div>

            <div className="space-y-4">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-6 rounded-2xl bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#D6A83F]">#{inq.id}</span>
                        <h3 className="font-heading text-base font-bold text-[#F7F5EF]">{inq.name}</h3>
                        {inq.company && (
                          <span className="text-xs text-[#A7ADB5] font-mono">({inq.company})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-[#A7ADB5] mt-1">
                        <span>Country: <strong className="text-[#F7F5EF]">{inq.country}</strong></span>
                        <span>Email: <strong className="text-[#F7F5EF]">{inq.email}</strong></span>
                        {inq.whatsapp && <span>WhatsApp: <strong className="text-[#25D366]">{inq.whatsapp}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e: any) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className={`text-xs font-mono px-3 py-1 rounded border font-bold ${
                          inq.status === 'New' ? 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/40' :
                          inq.status === 'Replied' ? 'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/40' :
                          'bg-[#D6A83F]/20 text-[#D6A83F] border-[#D6A83F]/40'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Replied">Replied</option>
                        <option value="Under Negotiation">Under Negotiation</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#F0D27A] flex-wrap gap-2">
                      <span>Gemstone Wanted: <strong>{inq.gemstoneWanted}</strong></span>
                      <span>Target Budget: <strong>{inq.budgetRange}</strong></span>
                      <span>Format: <strong>{inq.roughOrFinished}</strong></span>
                    </div>
                    <p className="text-[#A7ADB5] font-light leading-relaxed pt-1">
                      "{inq.message}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#0B2745] text-xs font-mono">
                    <span className="text-[#A7ADB5]">Received: {inq.timestamp}</span>

                    <div className="flex items-center gap-3">
                      {inq.whatsapp && (
                        <a
                          href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is Abel Gemstone replying to your wholesale inquiry #${inq.id} regarding ${inq.gemstoneWanted}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp Buyer</span>
                        </a>
                      )}

                      <a
                        href={`mailto:${inq.email}?subject=Abel Gemstone Inquiry Reply - Ref #${inq.id}&body=Dear ${inq.name},%0D%0A%0D%0AThank you for contacting Abel Gemstone regarding ${inq.gemstoneWanted}.`}
                        className="px-3 py-1.5 rounded bg-[#0B2745] hover:bg-[#D6A83F]/20 text-[#F0D27A] border border-[#D6A83F]/40 flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 6. GALLERY MANAGER TAB (Visual media & photography CMS) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Gallery Toolbar */}
            <div className="p-4 rounded-xl bg-[#071522] border border-[#0B2745] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#A7ADB5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search gallery media by title, origin, description..."
                  className="w-full pl-9 pr-4 py-2 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] outline-none focus:border-[#D6A83F]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#A7ADB5]">Category:</span>
                {['ALL', 'Paraíba', 'Sapphires', 'Padparadscha', 'Rough Stones', 'Emeralds', 'Rare Stones', 'Cutting & Polishing', 'Mining & Sourcing'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                      galleryCategoryFilter === cat
                        ? 'bg-[#D6A83F] text-[#05080D] font-bold'
                        : 'bg-[#05080D] text-[#A7ADB5] hover:text-[#F7F5EF]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 cursor-pointer shadow-lg ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Media</span>
              </button>
            </div>

            {/* Gallery Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.filter((item) => {
                const matchCat = galleryCategoryFilter === 'ALL' || item.category === galleryCategoryFilter;
                const matchSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                    (item.origin && item.origin.toLowerCase().includes(gallerySearch.toLowerCase())) ||
                                    item.description.toLowerCase().includes(gallerySearch.toLowerCase());
                return matchCat && matchSearch;
              }).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/50 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-[#05080D] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#05080D]/80 border border-[#D6A83F]/30 text-[9px] font-mono text-[#F0D27A] backdrop-blur-md">
                        {item.category}
                      </span>
                      {item.isVideo && (
                        <span className="px-1.5 py-0.5 rounded bg-[#14f1ce]/20 border border-[#14f1ce]/40 text-[9px] font-mono text-[#14f1ce]">
                          VIDEO
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-[#A7ADB5]">
                      <span className="truncate">{item.origin || 'Direct Sourcing'}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#F7F5EF] line-clamp-1 group-hover:text-[#F0D27A] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#A7ADB5] line-clamp-2 mt-1 font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#0B2745] text-xs font-mono">
                      <span className="text-[10px] text-[#A7ADB5]">ID: {item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingGalleryItem(item)}
                          className="p-1.5 rounded bg-[#05080D] hover:bg-[#0B2745] text-[#D6A83F] border border-[#0B2745] cursor-pointer"
                          title="Edit Media Item"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                          className="p-1.5 rounded bg-[#05080D] hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#0B2745] cursor-pointer"
                          title="Delete from Gallery"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 7. SECURITY & SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in">
            
            <div className="p-8 rounded-2xl bg-[#071522] border border-[#0B2745] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#0B2745]">
                <KeyRound className="w-5 h-5 text-[#D6A83F]" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#F7F5EF]">
                    Security Passcode Management
                  </h3>
                  <p className="text-xs text-[#A7ADB5] font-mono">
                    Update executive login credentials for API endpoint <code>/api/auth/change-password</code>
                  </p>
                </div>
              </div>

              {passwordStatus && (
                <div className={`p-3 rounded-lg text-xs font-mono ${
                  passwordStatus.type === 'success' ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30' : 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                }`}>
                  {passwordStatus.msg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Current Passcode</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current passcode"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">New Security Passcode (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new security passcode"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer"
                >
                  Update Passcode
                </button>
              </form>
            </div>

            {/* Profile Overview Card */}
            <div className="p-8 rounded-2xl bg-[#071522] border border-[#0B2745] space-y-4 text-xs font-mono">
              <h3 className="font-heading text-lg font-bold text-[#F7F5EF]">
                Direct Sourcing Desk Configuration
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-[#A7ADB5]">
                <div className="p-3 rounded bg-[#05080D] border border-[#0B2745]">
                  <span className="block text-[10px] uppercase text-[#D6A83F]">Main Email</span>
                  <strong className="text-[#F7F5EF]">info@abelgemstone.com</strong>
                </div>
                <div className="p-3 rounded bg-[#05080D] border border-[#0B2745]">
                  <span className="block text-[10px] uppercase text-[#D6A83F]">Sales Email</span>
                  <strong className="text-[#F7F5EF]">sales@abelgemstone.com</strong>
                </div>
                <div className="p-3 rounded bg-[#05080D] border border-[#0B2745]">
                  <span className="block text-[10px] uppercase text-[#D6A83F]">WhatsApp Number</span>
                  <strong className="text-[#25D366]">+251 91 100 0000</strong>
                </div>
                <div className="p-3 rounded bg-[#05080D] border border-[#0B2745]">
                  <span className="block text-[10px] uppercase text-[#D6A83F]">Default Currency</span>
                  <strong className="text-[#F7F5EF]">USD ($)</strong>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FULL EDIT STONE MODAL DIALOG (Weight, Price, Status, Certificate, Images, Video, Description) */}
      {editingStone && (
        <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-4xl w-full bg-[#071522] border border-[#D6A83F]/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#0B2745] pb-4">
              <div>
                <span className="text-xs font-mono text-[#D6A83F]">EDITING REFERENCE #{editingStone.id}</span>
                <h3 className="font-heading text-xl font-bold text-[#F7F5EF]">{editingStone.name}</h3>
              </div>
              <button onClick={() => setEditingStone(null)} className="p-2 text-[#A7ADB5] hover:text-[#F7F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedStone} className="space-y-5 text-xs font-mono">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Stone Title</label>
                  <input
                    value={editingStone.name}
                    onChange={(e) => setEditingStone({ ...editingStone, name: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Category</label>
                  <select
                    value={editingStone.category}
                    onChange={(e) => setEditingStone({ ...editingStone, category: e.target.value as any })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Availability Status</label>
                  <select
                    value={editingStone.status}
                    onChange={(e) => setEditingStone({ ...editingStone, status: e.target.value as ProductStatus })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="SOLD">SOLD</option>
                    <option value="COMING SOON">COMING SOON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Weight in Carats (ct)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingStone.weightCarats}
                    onChange={(e) => setEditingStone({ ...editingStone, weightCarats: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Wholesale Display Price</label>
                  <input
                    value={editingStone.priceFormatted || ''}
                    onChange={(e) => setEditingStone({ ...editingStone, priceFormatted: e.target.value })}
                    placeholder="$14,800 USD or Price on Request"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Valuation Numeric USD (optional)</label>
                  <input
                    type="number"
                    value={editingStone.priceUsd || ''}
                    onChange={(e) => setEditingStone({ ...editingStone, priceUsd: e.target.value ? Number(e.target.value) : null })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Dimensions (mm)</label>
                  <input
                    value={editingStone.dimensions}
                    onChange={(e) => setEditingStone({ ...editingStone, dimensions: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Shape / Cut</label>
                  <input
                    value={editingStone.shapeCut}
                    onChange={(e) => setEditingStone({ ...editingStone, shapeCut: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Color Description</label>
                  <input
                    value={editingStone.color}
                    onChange={(e) => setEditingStone({ ...editingStone, color: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Geographic Origin</label>
                  <input
                    value={editingStone.origin}
                    onChange={(e) => setEditingStone({ ...editingStone, origin: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Treatment Disclosure</label>
                  <input
                    value={editingStone.treatment}
                    onChange={(e) => setEditingStone({ ...editingStone, treatment: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Clarity Grade</label>
                  <input
                    value={editingStone.clarity}
                    onChange={(e) => setEditingStone({ ...editingStone, clarity: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              {/* Photos & Media */}
              <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-3">
                <span className="text-[#D6A83F] font-bold block">Photographs & Video URL</span>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Primary Image URL</label>
                  <input
                    value={editingStone.images[0] || ''}
                    onChange={(e) => {
                      const newImages = [...editingStone.images];
                      newImages[0] = e.target.value;
                      setEditingStone({ ...editingStone, images: newImages });
                    }}
                    className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Video Stream URL</label>
                  <input
                    value={editingStone.videoUrl || ''}
                    onChange={(e) => setEditingStone({ ...editingStone, videoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              {/* Certificate Section */}
              <div className="p-4 rounded-xl bg-[#05080D] border border-[#0B2745] space-y-3">
                <span className="text-[#D6A83F] font-bold block">Official Lab Certificate (GIA, SSEF, Gübelin, GRS)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#A7ADB5] mb-1">Laboratory</label>
                    <input
                      value={editingStone.certificate?.laboratory || ''}
                      onChange={(e) => setEditingStone({
                        ...editingStone,
                        certificate: {
                          laboratory: e.target.value,
                          reportNumber: editingStone.certificate?.reportNumber || '',
                          date: editingStone.certificate?.date || '',
                          weight: editingStone.weightCarats,
                          shape: editingStone.shapeCut,
                          dimensions: editingStone.dimensions,
                          color: editingStone.color,
                          origin: editingStone.origin,
                          treatment: editingStone.treatment,
                          comments: editingStone.certificate?.comments || '',
                          verified: true,
                        }
                      })}
                      placeholder="e.g. GIA, SSEF, Gübelin, GRS"
                      className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A7ADB5] mb-1">Report Number</label>
                    <input
                      value={editingStone.certificate?.reportNumber || ''}
                      onChange={(e) => setEditingStone({
                        ...editingStone,
                        certificate: {
                          ...editingStone.certificate,
                          laboratory: editingStone.certificate?.laboratory || 'GIA',
                          reportNumber: e.target.value,
                          date: editingStone.certificate?.date || '',
                          weight: editingStone.weightCarats,
                          shape: editingStone.shapeCut,
                          dimensions: editingStone.dimensions,
                          color: editingStone.color,
                          origin: editingStone.origin,
                          treatment: editingStone.treatment,
                          comments: editingStone.certificate?.comments || '',
                          verified: true,
                        }
                      })}
                      placeholder="e.g. GIA-6224891045"
                      className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A7ADB5] mb-1">Report Date</label>
                    <input
                      value={editingStone.certificate?.date || ''}
                      onChange={(e) => setEditingStone({
                        ...editingStone,
                        certificate: {
                          ...editingStone.certificate!,
                          date: e.target.value,
                        }
                      })}
                      placeholder="YYYY-MM-DD"
                      className="w-full p-2 rounded bg-[#071522] border border-[#0B2745] text-[#F7F5EF]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#A7ADB5] mb-1">Gemstone Description</label>
                <textarea
                  rows={3}
                  value={editingStone.description}
                  onChange={(e) => setEditingStone({ ...editingStone, description: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#0B2745]">
                <button
                  type="button"
                  onClick={() => setEditingStone(null)}
                  className="px-5 py-2.5 rounded bg-[#05080D] text-[#A7ADB5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GALLERY MEDIA MODAL */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-2xl w-full bg-[#071522] border border-[#D6A83F]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#0B2745] pb-4">
              <div>
                <span className="text-xs font-mono text-[#D6A83F] uppercase tracking-widest">GALLERY CURATION</span>
                <h3 className="font-heading text-xl font-bold text-[#F7F5EF] mt-1">Publish New Gallery Media</h3>
              </div>
              <button onClick={() => setShowAddGalleryModal(false)} className="p-2 text-[#A7ADB5] hover:text-[#F7F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A7ADB5] mb-1">Media Title / Caption *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. 6.10 ct Neon Blue Ethiopian Paraíba Macro"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF] focus:border-[#D6A83F] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Gallery Category *</label>
                  <select name="category" defaultValue="Paraíba" className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]">
                    <option value="Paraíba">Paraíba</option>
                    <option value="Sapphires">Sapphires</option>
                    <option value="Padparadscha">Padparadscha</option>
                    <option value="Rough Stones">Rough Stones</option>
                    <option value="Emeralds">Emeralds</option>
                    <option value="Rare Stones">Rare Stones</option>
                    <option value="Cutting & Polishing">Cutting & Polishing</option>
                    <option value="Mining & Sourcing">Mining & Sourcing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Geographic Origin</label>
                  <input
                    name="origin"
                    placeholder="e.g. Ethiopia (Oromia Region) / Sri Lanka"
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">High-Resolution Image URL *</label>
                <input
                  name="imageUrl"
                  required
                  defaultValue="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Gemological Description & Notes</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Master lapidary cutting close-up with vivid neon fire..."
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#F7F5EF]">
                  <input name="isVideo" type="checkbox" className="rounded accent-[#D6A83F]" />
                  <span>Mark as Video / 360 Spin Media</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#0B2745]">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-5 py-2.5 rounded bg-[#05080D] text-[#A7ADB5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded bg-gradient-to-r from-[#D6A83F] to-[#F0D27A] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GALLERY MEDIA MODAL */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-[#05080D]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-2xl w-full bg-[#071522] border border-[#D6A83F]/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#0B2745] pb-4">
              <div>
                <span className="text-xs font-mono text-[#D6A83F]">EDITING MEDIA #{editingGalleryItem.id}</span>
                <h3 className="font-heading text-xl font-bold text-[#F7F5EF] mt-1">{editingGalleryItem.title}</h3>
              </div>
              <button onClick={() => setEditingGalleryItem(null)} className="p-2 text-[#A7ADB5] hover:text-[#F7F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedGalleryItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#A7ADB5] mb-1">Title / Caption</label>
                <input
                  value={editingGalleryItem.title}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A7ADB5] mb-1">Category</label>
                  <select
                    value={editingGalleryItem.category}
                    onChange={(e: any) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  >
                    <option value="Paraíba">Paraíba</option>
                    <option value="Sapphires">Sapphires</option>
                    <option value="Padparadscha">Padparadscha</option>
                    <option value="Rough Stones">Rough Stones</option>
                    <option value="Emeralds">Emeralds</option>
                    <option value="Rare Stones">Rare Stones</option>
                    <option value="Cutting & Polishing">Cutting & Polishing</option>
                    <option value="Mining & Sourcing">Mining & Sourcing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADB5] mb-1">Geographic Origin</label>
                  <input
                    value={editingGalleryItem.origin || ''}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, origin: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Image URL</label>
                <input
                  value={editingGalleryItem.imageUrl}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value, thumbnailUrl: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADB5] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingGalleryItem.description}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#05080D] border border-[#0B2745] text-[#F7F5EF]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#F7F5EF]">
                  <input
                    type="checkbox"
                    checked={Boolean(editingGalleryItem.isVideo)}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, isVideo: e.target.checked })}
                    className="rounded accent-[#D6A83F]"
                  />
                  <span>Is Video Media</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#0B2745]">
                <button
                  type="button"
                  onClick={() => setEditingGalleryItem(null)}
                  className="px-5 py-2.5 rounded bg-[#05080D] text-[#A7ADB5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded bg-[#D6A83F] text-[#05080D] font-bold text-xs uppercase font-mono tracking-wider cursor-pointer"
                >
                  Save Gallery Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
