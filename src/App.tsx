/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { HomeGemstoneVault } from './components/HomeGemstoneVault';
import { SourcingStory } from './components/SourcingStory';
import { CuttingPolishingStory } from './components/CuttingPolishingStory';
import { GallerySection } from './components/GallerySection';
import { InternationalBuyersSection } from './components/InternationalBuyersSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BuyerInquiryModal } from './components/BuyerInquiryModal';

// Dedicated Admin Components
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Pages
import { GemstonesPage } from './pages/GemstonesPage';
import { GemstoneInspectionPage } from './pages/GemstoneInspectionPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Data & API Service
import { INITIAL_GEMSTONES, INITIAL_INQUIRIES } from './data/gemstoneInventory';
import { Gemstone, BuyerInquiry, GemCertificate } from './types/gemstone';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [previousPage, setPreviousPage] = useState<string>('home');
  const [gemstones, setGemstones] = useState<Gemstone[]>(INITIAL_GEMSTONES);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>(INITIAL_INQUIRIES);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Modals
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);
  const [inquiryPrefillName, setInquiryPrefillName] = useState<string | undefined>(undefined);

  const [selectedStone, setSelectedStone] = useState<Gemstone | null>(null);

  // Fetch initial data & verify session on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const stones = await api.getGemstones();
        if (Array.isArray(stones)) {
          setGemstones(stones);
        }
      } catch (err) {
        console.warn('API init using fallback seed inventory');
      }

      try {
        const authCheck = await api.checkAuth();
        if (authCheck.authenticated && authCheck.user) {
          setAdminUser(authCheck.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Not authenticated
      }
    };

    loadInitialData();

    // Check URL hash for direct admin routing (e.g. #admin)
    if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
  }, []);

  // WhatsApp Handler
  const handleOpenWhatsApp = (customText?: string) => {
    const text = customText || 'Hello Abel Gemstone, I am interested in your gemstones. I would like to know what is currently available.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/251911000000?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWhatsAppWithStone = (stoneName: string) => {
    handleOpenWhatsApp(`Hello Abel Gemstone, I am inquiring about the ${stoneName}. Please provide price and available gemological reports.`);
  };

  // Inquiry Handler
  const handleOpenInquiry = (stoneName?: string) => {
    setInquiryPrefillName(stoneName);
    setInquiryModalOpen(true);
  };

  const handleSubmitInquiry = async (newInquiry: BuyerInquiry) => {
    try {
      const saved = await api.submitInquiry(newInquiry);
      setInquiries([saved, ...inquiries]);
    } catch (err) {
      setInquiries([newInquiry, ...inquiries]);
    }
  };

  // Stone Selection Handler - Navigates directly to dedicated full Inspection Page
  const handleSelectStone = (stone: Gemstone) => {
    setSelectedStone(stone);
    if (currentPage !== 'inspect') {
      setPreviousPage(currentPage);
    }
    setCurrentPage('inspect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Navigation Trigger
  const handleOpenAdminPortal = () => {
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    api.logout();
    setAdminUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  // IF ADMIN ROUTE IS ACTIVE
  if (currentPage === 'admin') {
    if (isAuthenticated) {
      return (
        <AdminDashboard
          user={adminUser}
          onLogout={handleLogout}
          onViewPublicSite={() => {
            setCurrentPage('home');
            window.location.hash = '';
          }}
        />
      );
    } else {
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => {
            setCurrentPage('home');
            window.location.hash = '';
          }}
        />
      );
    }
  }

  // PUBLIC WEBSITE INTERFACE
  return (
    <div className="min-h-screen bg-[#05080D] text-[#F7F5EF] flex flex-col justify-between selection:bg-[#D6A83F]/30 selection:text-[#F0D27A]">
      
      {/* Universal Fixed Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (page !== 'admin') window.location.hash = '';
        }}
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* HOMEPAGE matching Section 39 exact sequence */}
        {currentPage === 'home' && (
          <>
            {/* 1 & 2. Hero Gemstone Image & Main Headline strictly from Brief */}
            <HeroSection
              gemstones={gemstones}
              onExploreParaiba={() => {
                setCurrentPage('gemstones');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactUs={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectStone={handleSelectStone}
              featuredStone={gemstones[0] || INITIAL_GEMSTONES[0]}
            />

            {/* 3. Trust Strip (4 gold icon points) */}
            <TrustStrip />

            {/* 4. Live Gemstone Vault Showcase (Comprehensive & Category-Free) */}
            <HomeGemstoneVault
              gemstones={gemstones}
              onSelectStone={handleSelectStone}
              onInquireStone={handleOpenInquiry}
              onViewAllStones={() => {
                setCurrentPage('gemstones');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 5. Provenance & Direct From African Sources */}
            <SourcingStory />

            {/* 6. Lapidary Workshop: ROUGH → CUTTING → FINISHED GEMSTONE */}
            <CuttingPolishingStory />

            {/* 10. Luxury Lightbox Gallery */}
            <GallerySection gemstones={gemstones} onInquireItem={(title) => handleOpenInquiry(title)} />

            {/* 11 & 12. International Buyers Section, Commitment & Homepage Final Section */}
            <InternationalBuyersSection
              onOpenInquiry={() => handleOpenInquiry()}
              onOpenWhatsApp={() => handleOpenWhatsApp()}
            />
          </>
        )}

        {/* UNIFIED DEDICATED GEMSTONES COLLECTION PAGE */}
        {(currentPage === 'gemstones' || currentPage === 'collection' || currentPage === 'paraiba' || currentPage === 'sapphires' || currentPage === 'rough') && (
          <GemstonesPage
            gemstones={gemstones}
            onSelectStone={handleSelectStone}
            onOpenInquiry={handleOpenInquiry}
            onOpenWhatsAppWithStone={handleOpenWhatsAppWithStone}
          />
        )}

        {/* DEDICATED ABOUT US & SOURCING PAGE */}
        {currentPage === 'about' && (
          <AboutPage
            onOpenInquiry={() => handleOpenInquiry()}
            onOpenWhatsApp={() => handleOpenWhatsApp()}
          />
        )}

        {/* DEDICATED GALLERY FULL PAGE */}
        {currentPage === 'gallery' && (
          <div className="pt-28 pb-12">
            <GallerySection gemstones={gemstones} onInquireItem={(title) => handleOpenInquiry(title)} />
          </div>
        )}

        {/* DEDICATED FULL-PAGE GEMSTONE INSPECTION PAGE */}
        {currentPage === 'inspect' && (
          <GemstoneInspectionPage
            stone={selectedStone}
            allStones={gemstones}
            onBack={() => {
              setCurrentPage(previousPage || 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectStone={handleSelectStone}
            onOpenInquiry={handleOpenInquiry}
            onOpenWhatsAppWithStone={handleOpenWhatsAppWithStone}
            previousPageName={previousPage === 'gemstones' || previousPage === 'collection' ? 'Collection' : 'Home'}
          />
        )}

        {/* DEDICATED CONTACT & INQUIRY PAGE */}
        {currentPage === 'contact' && (
          <ContactPage
            onSubmitInquiry={handleSubmitInquiry}
            onOpenWhatsApp={() => handleOpenWhatsApp()}
          />
        )}

      </main>

      {/* Luxury Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenInquiry={() => handleOpenInquiry()}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Floating WhatsApp Quick Desk Widget */}
      <FloatingWhatsApp onDirectChat={() => handleOpenWhatsApp()} />

      {/* Modals */}
      <BuyerInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        prefillStoneName={inquiryPrefillName}
        onSubmitInquiry={handleSubmitInquiry}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

    </div>
  );
}
