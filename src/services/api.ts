import { Gemstone, BuyerInquiry, GalleryItem } from '../types/gemstone';

const getAuthToken = () => {
  return localStorage.getItem('ag_admin_token') || '';
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      localStorage.setItem('ag_admin_token', data.token);
      localStorage.setItem('ag_admin_user', JSON.stringify(data.user));
    }
    return data;
  },

  async checkAuth() {
    const token = getAuthToken();
    if (!token) return { authenticated: false };
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { authenticated: false };
    }
  },

  logout() {
    localStorage.removeItem('ag_admin_token');
    localStorage.removeItem('ag_admin_user');
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const token = getAuthToken();
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password update failed');
    return data;
  },

  // Gemstones
  async getGemstones(params?: { category?: string; status?: string; isRough?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.isRough !== undefined) query.append('isRough', String(params.isRough));

    const res = await fetch(`/api/gemstones?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch gemstones');
    return data.data as Gemstone[];
  },

  async createGemstone(stoneData: Partial<Gemstone>) {
    const token = getAuthToken();
    const res = await fetch('/api/gemstones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stoneData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create gemstone');
    return data.data as Gemstone;
  },

  async updateGemstone(id: string, stoneData: Partial<Gemstone>) {
    const token = getAuthToken();
    const res = await fetch(`/api/gemstones/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stoneData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update gemstone');
    return data.data as Gemstone;
  },

  async deleteGemstone(id: string) {
    const token = getAuthToken();
    const res = await fetch(`/api/gemstones/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete gemstone');
    return data;
  },

  // Inquiries
  async getInquiries() {
    const token = getAuthToken();
    const res = await fetch('/api/inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch inquiries');
    return data.data as BuyerInquiry[];
  },

  async submitInquiry(inquiryData: Partial<BuyerInquiry>) {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');
    return data.data as BuyerInquiry;
  },

  async updateInquiry(id: string, updateData: Partial<BuyerInquiry>) {
    const token = getAuthToken();
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update inquiry');
    return data.data as BuyerInquiry;
  },

  async deleteInquiry(id: string) {
    const token = getAuthToken();
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete inquiry');
    return data;
  },

  // Categories
  async getCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data.data as Array<{ id: string; name: string; slug: string; description: string; stoneCount?: number }>;
  },

  async createCategory(categoryData: { name: string; description?: string }) {
    const token = getAuthToken();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data.data;
  },

  async deleteCategory(id: string) {
    const token = getAuthToken();
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  // Stats
  async getStats() {
    const token = getAuthToken();
    const res = await fetch('/api/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics');
    return data.data;
  },

  // Gallery
  async getGallery() {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch gallery');
    return data.data as GalleryItem[];
  },

  async addGalleryItem(itemData: Partial<GalleryItem>) {
    const token = getAuthToken();
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add gallery item');
    return data.data as GalleryItem;
  },

  async updateGalleryItem(id: string, itemData: Partial<GalleryItem>) {
    const token = getAuthToken();
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update gallery item');
    return data.data as GalleryItem;
  },

  async deleteGalleryItem(id: string) {
    const token = getAuthToken();
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete gallery item');
    return data;
  },
};
