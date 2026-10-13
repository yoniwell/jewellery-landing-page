import { Gemstone, GalleryItem, BuyerInquiry } from '../types/gemstone';

// Empty default inventory - real gemstones are added dynamically by the administrator
export const INITIAL_GEMSTONES: Gemstone[] = [];

// Empty default gallery - images are populated dynamically from gemstones and admin uploads
export const GALLERY_ITEMS: GalleryItem[] = [];

// Inquiries start clean with 0 mock inquiries
export const INITIAL_INQUIRIES: BuyerInquiry[] = [];
