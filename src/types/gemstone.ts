export type GemstoneCategory = 
  | 'paraiba' 
  | 'sapphire' 
  | 'padparadscha' 
  | 'rough' 
  | 'emerald' 
  | 'rare';

export type SapphireSubCategory = 
  | 'Royal Blue' 
  | 'Cornflower Blue' 
  | 'Padparadscha' 
  | 'Bi-Color' 
  | 'Yellow Sapphire' 
  | 'Pink Sapphire' 
  | 'Star Sapphire' 
  | 'Rough Sapphire';

export type RoughSubCategory =
  | 'Rough Paraíba Tourmaline'
  | 'Rough Sapphire'
  | 'Rough Emerald'
  | 'Other Rare Rough Stones';

export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING SOON';

export interface GemCertificate {
  laboratory: string; // e.g., 'GIA', 'GRS', 'SSEF', 'Gübelin', 'AIGS', 'ICA GemLab'
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
  dimensions: string; // e.g., "9.45 x 7.82 x 5.12 mm"
  shapeCut: string; // e.g., "Cushion Modified Brilliant", "Oval Faceted", "Natural Octahedral Crystal"
  color: string; // e.g., "Electric Neon Blue-Green", "Velvety Royal Blue", "Sunset Lotus Pink-Orange"
  origin: string; // e.g., "Ethiopia (Oromia Region)", "East Africa", "Zambia (Kagem)"
  treatment: string; // e.g., "Natural / No Indications of Heat Treatment (Unheated)", "Traditional Gentle Heat Disclosed"
  clarity: string; // e.g., "Eye Clean (VVS)", "Minor Natural Inclusions", "Transparent Gem Rough"
  priceUsd: number | null; // null for "Price on Request"
  priceFormatted?: string;
  status: ProductStatus;
  isRough: boolean;
  cuttingPotential?: string; // for rough stones
  description: string;
  images: string[];
  videoUrl?: string;
  has360View?: boolean;
  featured: boolean;
  certificate?: GemCertificate;
  dateAdded: string;
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
  roughOrFinished: 'Finished Gemstone' | 'Rough Material' | 'Both / Portfolio Consultation';
  approximateCarat?: string;
  budgetRange: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Replied' | 'Under Negotiation' | 'Closed';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Paraíba' | 'Sapphires' | 'Padparadscha' | 'Rough Stones' | 'Emeralds' | 'Rare Stones' | 'Cutting & Polishing' | 'Mining & Sourcing';
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  origin?: string;
  isVideo?: boolean;
}
