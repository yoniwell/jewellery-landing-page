import { Gemstone, GalleryItem, BuyerInquiry } from '../types/gemstone';

export const INITIAL_GEMSTONES: Gemstone[] = [
  // --- ETHIOPIAN PARAÍBA TOURMALINES ---
  {
    id: 'AG-PB-001',
    name: '5.20 ct Ethiopian Paraíba Tourmaline Cushion',
    category: 'paraiba',
    weightCarats: 5.20,
    dimensions: '11.45 x 9.80 x 6.42 mm',
    shapeCut: 'Cushion Modified Brilliant',
    color: 'Electric Neon Blue-Green (Vivid)',
    origin: 'Ethiopia (Oromia Region)',
    treatment: 'Natural / Disclosed Minor Clarity Enhancement None / Unheated',
    clarity: 'Eye Clean (VVS Grade)',
    priceUsd: null, // Price on Request
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: false,
    description: 'An exceptional museum-grade Ethiopian Paraíba Tourmaline exhibiting the signature electric neon turquoise-green luminescence. Sourced directly from our East African field operations and cut to precise master proportions with extraordinary internal scintillation and zero windowing.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glimmer-of-lights-in-a-dark-room-41983-large.mp4',
    has360View: true,
    featured: true,
    dateAdded: '2026-03-01'
  },
  {
    id: 'AG-PB-002',
    name: '2.35 ct Neon Lagoon Paraíba Tourmaline Cushion',
    category: 'paraiba',
    weightCarats: 2.35,
    dimensions: '8.82 x 7.30 x 4.88 mm',
    shapeCut: 'Cushion Brilliant',
    color: 'Neon Blue-Green',
    origin: 'Ethiopia',
    treatment: 'Natural / Disclose accurately (Unheated)',
    clarity: 'Eye Clean',
    priceUsd: 14800,
    priceFormatted: '$14,800 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Vibrant neon blue-green Ethiopian Paraíba tourmaline with astonishing saturation and crisp facet symmetry. Certified natural cuprian tourmaline with vivid fire in daylight and low lighting.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-02-15'
  },
  {
    id: 'AG-PB-003',
    name: '3.88 ct Electric Cyan Paraíba Tourmaline Oval',
    category: 'paraiba',
    weightCarats: 3.88,
    dimensions: '10.50 x 8.20 x 5.60 mm',
    shapeCut: 'Oval Mixed Cut',
    color: 'Electric Cyan Blue',
    origin: 'Ethiopia',
    treatment: 'Natural / Unheated',
    clarity: 'VVS (Exceptional)',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'RESERVED',
    isRough: false,
    description: 'Pure electric cyan tourmaline with glowing neon saturation. One of the cleanest Ethiopian pieces yielded from our Q4 2025 rough parcel.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-01-10'
  },
  {
    id: 'AG-PB-004',
    name: '18.40 ct Rough Ethiopian Paraíba Crystal Specimen',
    category: 'rough',
    subCategory: 'Rough Paraíba Tourmaline',
    weightCarats: 18.40,
    dimensions: '22.1 x 14.5 x 11.2 mm',
    shapeCut: 'Natural Prismatic Crystal',
    color: 'Electric Mint to Turquoise Blue',
    origin: 'Ethiopia (Direct Source)',
    treatment: 'Natural Untreated Rough',
    clarity: 'Semi-Transparent to Transparent Core',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: true,
    cuttingPotential: 'Estimated 6.5 - 7.5 ct primary finished gem or two high-value precision stones.',
    description: 'Untouched collector-grade Ethiopian Paraíba tourmaline crystal with lustrous striations and intact prism terminations. Deeply saturated electric blue-green core with high yield potential for expert lapidaries.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-03-05'
  },

  // --- NATURAL SAPPHIRES ---
  {
    id: 'AG-SP-001',
    name: '7.15 ct Royal Blue Sapphire Cushion',
    category: 'sapphire',
    subCategory: 'Royal Blue',
    weightCarats: 7.15,
    dimensions: '12.10 x 10.45 x 6.80 mm',
    shapeCut: 'Cushion Modified Brilliant',
    color: 'Velvety Royal Blue (Vivid)',
    origin: 'Natural Certified Deposit',
    treatment: 'Natural / No Heat (Unheated)',
    clarity: 'Eye Clean (VVS)',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: false,
    description: 'A benchmark Royal Blue sapphire displaying deep velvety blue bodycolor with explosive dispersion. Unheated and free from zoning, cut by master lapidaries to maintain optimal optical performance.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-02-28'
  },
  {
    id: 'AG-SP-002',
    name: '4.82 ct Cornflower Blue Sapphire Oval',
    category: 'sapphire',
    subCategory: 'Cornflower Blue',
    weightCarats: 4.82,
    dimensions: '11.02 x 8.75 x 5.40 mm',
    shapeCut: 'Oval Brilliant / Step Cut Pavilion',
    color: 'Intense Cornflower Blue',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural / Unheated',
    clarity: 'Eye Clean',
    priceUsd: 22500,
    priceFormatted: '$22,500 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Vibrant and bright Cornflower Blue sapphire. Displays open tone and vivid saturation under all lighting environments.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: false,
    dateAdded: '2026-02-10'
  },
  {
    id: 'AG-SP-003',
    name: '3.42 ct Padparadscha Sapphire Oval',
    category: 'sapphire',
    subCategory: 'Padparadscha',
    weightCarats: 3.42,
    dimensions: '9.65 x 7.80 x 5.10 mm',
    shapeCut: 'Oval Mixed Cut',
    color: 'Sunset Lotus (Pinkish-Orange)',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural / Unheated (Certified)',
    clarity: 'Eye Clean (VVS)',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: false,
    description: 'An exquisitely balanced Padparadscha sapphire presenting the coveted 55/45 blend of delicate lotus blossom pink and golden sunrise orange. Unheated with prominent laboratory certification.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-03-02'
  },
  {
    id: 'AG-SP-004',
    name: '5.10 ct Bi-Color Sapphire Emerald Cut',
    category: 'sapphire',
    subCategory: 'Bi-Color',
    weightCarats: 5.10,
    dimensions: '11.20 x 8.10 x 5.90 mm',
    shapeCut: 'Emerald Cut Octagon',
    color: 'Cobalt Blue & Golden Yellow Zoned',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural / Unheated',
    clarity: 'Eye Clean',
    priceUsd: 11200,
    priceFormatted: '$11,200 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Striking natural geometric zoning featuring deep cobalt ocean blue adjacent to warm canary golden honey. Step-cut faceting showcases the crisp color boundary.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: false,
    featured: false,
    dateAdded: '2026-01-28'
  },
  {
    id: 'AG-SP-005',
    name: '6.80 ct Vivid Yellow Sapphire Cushion',
    category: 'sapphire',
    subCategory: 'Yellow Sapphire',
    weightCarats: 6.80,
    dimensions: '11.80 x 10.10 x 6.20 mm',
    shapeCut: 'Cushion Brilliant',
    color: 'Canary Golden Yellow',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural / Unheated',
    clarity: 'Eye Clean (VVS)',
    priceUsd: 16500,
    priceFormatted: '$16,500 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Pure radiant canary yellow sapphire without brown or green secondary overtones. Exceptional brilliance and luster.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: false,
    dateAdded: '2026-02-04'
  },
  {
    id: 'AG-SP-006',
    name: '8.90 ct Natural Star Sapphire Cabochon',
    category: 'sapphire',
    subCategory: 'Star Sapphire',
    weightCarats: 8.90,
    dimensions: '12.40 x 10.90 x 7.10 mm',
    shapeCut: 'High Dome Oval Cabochon',
    color: 'Silvery Cornflower Blue (6-Ray Star)',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural / Unheated',
    clarity: 'Translucent Asterism',
    priceUsd: 18900,
    priceFormatted: '$18,900 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Crisp, sharp, centered 6-ray star gliding seamlessly over an even translucent blue body. An authentic collector classic.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: false,
    dateAdded: '2026-01-19'
  },

  // --- ROUGH GEMSTONES ---
  {
    id: 'AG-RG-001',
    name: '42.50 ct Rough Blue Sapphire Parcel',
    category: 'rough',
    subCategory: 'Rough Sapphire',
    weightCarats: 42.50,
    dimensions: 'Mixed crystal parcel (12 - 22 mm pieces)',
    shapeCut: 'Natural Bipyramidal Rough Crystals',
    color: 'Cornflower to Royal Blue',
    origin: 'Natural Gem Deposit',
    treatment: 'Natural Untreated Rough',
    clarity: 'Gem Grade Clean Centers',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'AVAILABLE',
    isRough: true,
    cuttingPotential: 'High recovery yield for precision calibrated gems and freeform singles.',
    description: 'Premium rough sapphire parcel selected from direct artisanal miners. Clean crystalline structure with high internal transparency and excellent color core saturation.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-03-04'
  },
  {
    id: 'AG-RG-002',
    name: '28.80 ct Rough African Emerald Matrix Specimen',
    category: 'rough',
    subCategory: 'Rough Emerald',
    weightCarats: 28.80,
    dimensions: '26.0 x 18.2 x 14.0 mm',
    shapeCut: 'Hexagonal Crystal on Quartz Matrix',
    color: 'Intense Lush Forest Green',
    origin: 'Zambia / East Africa',
    treatment: 'Natural / No Oil',
    clarity: 'Transparent Hexagonal Crystal',
    priceUsd: 13500,
    priceFormatted: '$13,500 USD',
    status: 'AVAILABLE',
    isRough: true,
    cuttingPotential: 'Ideal as collector display specimen or yield for a 6+ ct step-cut emerald.',
    description: 'Deeply saturated green beryl with natural hexagonal crystal habit preserved. Exceptional color saturation direct from African source operations.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-02-25'
  },

  // --- AFRICAN EMERALDS & RARE STONES ---
  {
    id: 'AG-EM-001',
    name: '4.15 ct African Emerald Octagon Step Cut',
    category: 'emerald',
    weightCarats: 4.15,
    dimensions: '10.80 x 8.60 x 5.75 mm',
    shapeCut: 'Classic Octagon Emerald Cut',
    color: 'Vivid Deep Green (Bluish Undertones)',
    origin: 'Zambia (Direct African Sourcing)',
    treatment: 'Minor Traditional Cedar Oil (Disclosed)',
    clarity: 'VS (Minor Jardin)',
    priceUsd: 28000,
    priceFormatted: '$28,000 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'A regal African emerald displaying the prized bluish-green velvety depth. Expert lapidary finishing with minimal inclusions and brilliant crystal luster.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: true,
    dateAdded: '2026-02-12'
  },
  {
    id: 'AG-RS-001',
    name: '9.40 ct Rare Tanzanian Spessartite Mandarin Garnet',
    category: 'rare',
    weightCarats: 9.40,
    dimensions: '13.20 x 11.50 x 7.40 mm',
    shapeCut: 'Cushion Brilliant',
    color: 'Electrifying Mandarin Orange',
    origin: 'Tanzania / East Africa',
    treatment: 'Natural / 100% Untreated',
    clarity: 'Eye Clean (Flawless Face)',
    priceUsd: 9800,
    priceFormatted: '$9,800 USD',
    status: 'AVAILABLE',
    isRough: false,
    description: 'Fiery Mandarin Spessartite garnet of singular purity. Rare in weights above 5 carats with complete absence of brownish extinction.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: true,
    featured: false,
    dateAdded: '2026-01-30'
  },
  {
    id: 'AG-RS-002',
    name: '3.10 ct Exceptional Mozambique / African Ruby Cushion',
    category: 'rare',
    weightCarats: 3.10,
    dimensions: '8.90 x 7.60 x 5.10 mm',
    shapeCut: 'Cushion Brilliant',
    color: 'Vivid Pigeon Blood Red',
    origin: 'Mozambique',
    treatment: 'Natural / Unheated',
    clarity: 'Eye Clean',
    priceUsd: null,
    priceFormatted: 'Price on Request',
    status: 'SOLD',
    isRough: false,
    description: 'Archived showcase stone. Certified unheated Pigeon Blood ruby sold to a private European collector.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'
    ],
    has360View: false,
    featured: false,
    dateAdded: '2025-11-15'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-01',
    title: '5.20 ct Electric Ethiopian Paraíba Tourmaline',
    category: 'Paraíba',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    description: 'Master cut cushion featuring intense copper-induced neon cyan fire.',
    origin: 'Ethiopia (Oromia Region)'
  },
  {
    id: 'gal-02',
    title: 'Royal Blue Velvet Sapphire',
    category: 'Sapphires',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    description: 'Unheated 7.15 ct cushion with velvety royal blue color saturation.',
    origin: 'Natural Certified Deposit'
  },
  {
    id: 'gal-03',
    title: 'Rare Padparadscha Sapphire',
    category: 'Sapphires',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=600&auto=format&fit=crop',
    description: 'Delicate harmonious balance of sunset lotus salmon pink and warm gold.',
    origin: 'Natural Certified Deposit'
  },
  {
    id: 'gal-04',
    title: 'Untouched Paraíba Tourmaline Rough Crystal',
    category: 'Rough Stones',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    description: 'Striated prismatic crystal showing intense neon transparency before faceting.',
    origin: 'Ethiopia'
  },
  {
    id: 'gal-05',
    title: '4.15 ct Octagon African Emerald',
    category: 'Emeralds',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    description: 'Vivid deep forest green crystal with exceptional transparency.',
    origin: 'Zambia / East Africa'
  },
  {
    id: 'gal-06',
    title: 'Precision Diamond Wheel Lapidary Faceting',
    category: 'Cutting & Polishing',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Master cutter aligning pavilion angles for maximum light return.',
    origin: 'Abel Gemstone Lapidary Studio'
  },
  {
    id: 'gal-07',
    title: 'Direct Geological Sourcing in East Africa',
    category: 'Mining & Sourcing',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
    description: 'Field gemologists appraising freshly extracted rough parcels at source.',
    origin: 'East Africa'
  },
  {
    id: 'gal-08',
    title: '9.40 ct Fiery Spessartite Mandarin Garnet',
    category: 'Rare Stones',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    description: 'Pure neon mandarin orange with zero brown extinction.',
    origin: 'Tanzania'
  }
];

export const INITIAL_INQUIRIES: BuyerInquiry[] = [
  {
    id: 'INQ-901',
    name: 'Maximilian Von Berg',
    company: 'Geneva Haute Joaillerie SA',
    country: 'Switzerland',
    email: 'm.vonberg@genevajoaillerie.ch',
    whatsapp: '+41 79 400 8821',
    gemstoneWanted: 'Ethiopian Paraíba Tourmaline 4+ ct Eye Clean',
    stoneId: 'AG-PB-001',
    stoneName: '5.20 ct Ethiopian Paraíba Tourmaline Cushion',
    roughOrFinished: 'Finished Gemstone',
    approximateCarat: '4.5 - 6.0 ct',
    budgetRange: '$50,000 - $100,000',
    message: 'We are preparing a bespoke high jewelry necklace for a private client. Please share GIA/SSEF lab scan and high-res video in daylight.',
    timestamp: '2026-03-04 14:22 GMT',
    status: 'New'
  },
  {
    id: 'INQ-902',
    name: 'Tariq Al-Mansoor',
    company: 'Al-Mansoor Royal Gems',
    country: 'United Arab Emirates (Dubai)',
    email: 'tariq@almansoorgems.ae',
    whatsapp: '+971 50 123 4567',
    gemstoneWanted: 'Ceylon Royal Blue Sapphires (Unheated)',
    stoneId: 'AG-SP-001',
    stoneName: '7.15 ct Ceylon Royal Blue Sapphire Cushion',
    roughOrFinished: 'Finished Gemstone',
    approximateCarat: '7 - 10 ct',
    budgetRange: '$75,000 - $150,000',
    message: 'Seeking top color Royal Blue unheated with Gübelin or SSEF origin certification. Can arrange viewing in Dubai or Zurich.',
    timestamp: '2026-03-05 09:15 GMT',
    status: 'Replied'
  }
];
