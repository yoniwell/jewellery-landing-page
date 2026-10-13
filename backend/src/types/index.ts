export type GemstoneCategory = 
  | 'paraiba' 
  | 'sapphire' 
  | 'padparadscha' 
  | 'rough' 
  | 'emerald' 
  | 'rare'
  | string;

export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING SOON';

export interface GemCertificate {
  laboratory: string;
  reportNumber: string;
  date: string;
  weight: number;
  shape: string;
  dimensions: string;
  color: string;
  origin: string;
  treatment: string;
  comments: string;
  certificateImageUrl?: string;
  verified: boolean;
}

export interface Gemstone {
  id: string;
  name: string;
  category: GemstoneCategory;
  subCategory?: string;
  weightCarats: number;
  dimensions: string;
  shapeCut: string;
  color: string;
  origin: string;
  treatment: string;
  clarity: string;
  priceUsd: number | null;
  priceFormatted?: string;
  status: ProductStatus;
  isRough: boolean;
  cuttingPotential?: string;
  description: string;
  images: string[];
  videoUrl?: string;
  has360View?: boolean;
  featured: boolean;
  certificate?: GemCertificate;
  dateAdded: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuyerInquiry {
  id: string;
  name: string;
  company?: string;
  country: string;
  email: string;
  whatsapp?: string;
  gemstoneWanted: string;
  stoneId?: string;
  stoneName?: string;
  roughOrFinished: 'Finished Gemstone' | 'Rough Material' | 'Both / Portfolio Consultation' | string;
  approximateCarat?: string;
  budgetRange: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Replied' | 'Under Negotiation' | 'Closed' | string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  stoneCount?: number;
  createdAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  origin?: string;
  isVideo?: boolean;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}
