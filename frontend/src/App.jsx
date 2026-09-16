import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MasonryFeed from './components/MasonryFeed';
import InspirationModal from './components/InspirationModal';
import VendorDirectory from './components/VendorDirectory';
import VendorProfileModal from './components/VendorProfileModal';
import MoodBoards from './components/MoodBoards';
import InquiryModal from './components/InquiryModal';
import AdminPortal from './components/AdminPortal';
import VendorPortal from './components/VendorPortal';
import RoadmapModal from './components/RoadmapModal';
import PinToBoardModal from './components/PinToBoardModal';
import MobileBottomNav from './components/MobileBottomNav';
import MobileConnectModal from './components/MobileConnectModal';
import Toast from './components/Toast';

import { Sparkles, Heart, ShieldCheck, Layers, ArrowUp, Smartphone } from 'lucide-react';

import { API_BASE } from './config/api';

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'vendors' | 'boards' | 'admin' | 'vendor-hub'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Theme Management (Light & Dark)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_theme');
      return saved ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Vendor Session State
  const [currentVendor, setCurrentVendor] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_vendor');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleVendorChange = (vendor) => {
    setCurrentVendor(vendor);
    if (vendor) {
      localStorage.setItem('aura_vendor', JSON.stringify(vendor));
    } else {
      localStorage.removeItem('aura_vendor');
    }
  };

  // Data States
  const [inspirations, setInspirations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [relatedInspirations, setRelatedInspirations] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [inquireVendor, setInquireVendor] = useState(null);
  const [pinItem, setPinItem] = useState(null);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [mobileConnectOpen, setMobileConnectOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Inspirations
  const fetchInspirations = useCallback(() => {
    setLoading(true);
    let url = `${API_BASE}/inspirations?`;
    if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedEventType !== 'All') url += `eventType=${encodeURIComponent(selectedEventType)}&`;
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

    axios.get(url)
      .then(res => {
        setInspirations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading inspirations:', err);
        setLoading(false);
      });
  }, [selectedCategory, selectedEventType, searchQuery]);

  // Fetch Vendors
  const fetchVendors = () => {
    axios.get(`${API_BASE}/vendors`)
      .then(res => setVendors(res.data))
      .catch(err => console.error('Error loading vendors:', err));

    if (currentVendor?._id) {
      axios.get(`${API_BASE}/vendors/${currentVendor._id}`)
        .then(res => {
          if (res.data?.vendor && res.data.vendor.status !== currentVendor.status) {
            handleVendorChange(res.data.vendor);
          }
        })
        .catch(() => {});
    }
  };

  // Fetch Boards
  const fetchBoards = () => {
    axios.get(`${API_BASE}/boards`)
      .then(res => {
        setBoards(res.data);
        if (res.data.length > 0 && !activeBoardId) {
          setActiveBoardId(res.data[0]._id);
        }
      })
      .catch(err => console.error('Error loading boards:', err));
  };

  // Initial Load
  useEffect(() => {
    fetchInspirations();
    fetchVendors();
    fetchBoards();
  }, [fetchInspirations]);

  // Handle Opening Inspiration Detail
  const handleOpenInspiration = (item) => {
    axios.get(`${API_BASE}/inspirations/${item._id}`)
      .then(res => {
        setSelectedInspiration(res.data.inspiration);
        setRelatedInspirations(res.data.related || []);
      })
      .catch(() => {
        setSelectedInspiration(item);
        setRelatedInspirations([]);
      });
  };

  // Handle Like Inspiration
  const handleLikeInspiration = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/inspirations/${id}/like`);
      setInspirations(prev => prev.map(item => 
        item._id === id ? { ...item, likesCount: res.data.likesCount } : item
      ));
      if (selectedInspiration && selectedInspiration._id === id) {
        setSelectedInspiration(prev => ({ ...prev, likesCount: res.data.likesCount }));
      }
      showToast('Liked inspiration!', 'success');
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  // Handle Save Pin to Board
  const handleSavePinToBoard = async (boardId, inspirationId) => {
    try {
      const res = await axios.post(`${API_BASE}/boards/${boardId}/pins`, { inspirationId });
      setBoards(prev => prev.map(b => b._id === boardId ? res.data : b));
      setPinItem(null);
      showToast('Saved pin to board successfully!', 'success');
    } catch (err) {
      console.error('Error saving pin:', err);
      showToast('Failed to save pin', 'error');
    }
  };

  // Handle Create Board & Pin
  const handleCreateBoardAndPin = async (title, inspirationId) => {
    try {
      const res = await axios.post(`${API_BASE}/boards`, {
        title,
        initialInspirationId: inspirationId
      });
      fetchBoards();
      setPinItem(null);
      showToast(`Created board "${title}" and pinned inspiration!`, 'success');
    } catch (err) {
      console.error('Error creating board:', err);
      showToast('Failed to create board', 'error');
    }
  };

  // Handle Create Board
  const handleCreateBoard = async (boardData) => {
    try {
      const res = await axios.post(`${API_BASE}/boards`, boardData);
      setBoards([res.data, ...boards]);
      setActiveBoardId(res.data._id);
      showToast(`Created board "${res.data.title}"!`, 'success');
    } catch (err) {
      console.error('Error creating board:', err);
      showToast('Failed to create board', 'error');
    }
  };

  // Handle Remove Pin from Board
  const handleRemovePin = async (boardId, pinId) => {
    try {
      await axios.delete(`${API_BASE}/boards/${boardId}/pins/${pinId}`);
      fetchBoards();
      showToast('Pin removed from board', 'success');
    } catch (err) {
      console.error('Error removing pin:', err);
      showToast('Failed to remove pin', 'error');
    }
  };

  // Handle Delete Board
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this mood board?')) return;
    try {
      await axios.delete(`${API_BASE}/boards/${boardId}`);
      const updated = boards.filter(b => b._id !== boardId);
      setBoards(updated);
      if (updated.length > 0) setActiveBoardId(updated[0]._id);
      showToast('Board deleted', 'success');
    } catch (err) {
      console.error('Error deleting board:', err);
    }
  };

  // Handle Search Submit from Header
  const handleSearchSubmit = (query) => {
    if (activeTab !== 'feed' && activeTab !== 'vendors') {
      setActiveTab('feed');
    }
    // When executing a search query, reset category/event filters so all matching results appear
    if (query && query.trim()) {
      setSelectedCategory('All');
      setSelectedEventType('All');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-gold-500/20 pb-20 md:pb-0 transition-colors duration-200">
      
      {/* Top Navigation with Theme Switcher & Search Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        boardCount={boards.length}
        onOpenRoadmap={() => setRoadmapOpen(true)}
        onOpenNewBoard={() => setActiveTab('boards')}
        onOpenMobileConnect={() => setMobileConnectOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchSubmit={handleSearchSubmit}
        vendors={vendors}
        inspirations={inspirations}
        onOpenInspiration={handleOpenInspiration}
        onOpenVendor={(v) => setSelectedVendor(v)}
      />

      {/* Main App Body */}
      <main className="flex-1">
        
        {/* TAB 1: Inspiration Feed */}
        {activeTab === 'feed' && (
          <div>
            <HeroBanner
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedEventType={selectedEventType}
              setSelectedEventType={setSelectedEventType}
              onExploreClick={() => {}}
              onJoinAsVendor={() => setActiveTab('vendor-hub')}
              onOpenMobileConnect={() => setMobileConnectOpen(true)}
              stats={{
                inspirationsCount: inspirations.length,
                vendorsCount: vendors.length
              }}
            />

            <MasonryFeed
              inspirations={inspirations}
              loading={loading}
              searchQuery={searchQuery}
              onOpenInspiration={handleOpenInspiration}
              onOpenVendor={(v) => setSelectedVendor(v)}
              onPinToBoard={(item) => setPinItem(item)}
              onLikeInspiration={handleLikeInspiration}
              onQuickInquire={(v) => setInquireVendor(v)}
              activeCategory={selectedCategory}
              onResetFilters={() => {
                setSelectedCategory('All');
                setSelectedEventType('All');
                setSearchQuery('');
              }}
              vendors={vendors}
              onSwitchToVendors={() => setActiveTab('vendors')}
            />
          </div>
        )}

        {/* TAB 2: Curated Vendors */}
        {activeTab === 'vendors' && (
          <VendorDirectory
            vendors={vendors}
            loading={loading}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onOpenVendor={(v) => setSelectedVendor(v)}
            onInquireVendor={(v) => setInquireVendor(v)}
            onViewRoadmap={() => setRoadmapOpen(true)}
            onSwitchToFeed={() => setActiveTab('feed')}
            inspirationsCount={inspirations.length}
          />
        )}

        {/* TAB 3: Mood Boards */}
        {activeTab === 'boards' && (
          <MoodBoards
            boards={boards}
            activeBoardId={activeBoardId}
            setActiveBoardId={setActiveBoardId}
            onCreateBoard={handleCreateBoard}
            onRemovePin={handleRemovePin}
            onDeleteBoard={handleDeleteBoard}
            onOpenInspiration={handleOpenInspiration}
            onInquireVendor={(v) => setInquireVendor(v)}
            onOpenVendor={(v) => setSelectedVendor(v)}
          />
        )}

        {/* TAB 4: Administrator Portal */}
        {activeTab === 'admin' && (
          <AdminPortal
            vendors={vendors}
            onRefreshData={() => {
              fetchInspirations();
              fetchVendors();
            }}
            onShowToast={showToast}
          />
        )}

        {/* TAB 5: Vendor Self-Service & Portfolio Studio */}
        {activeTab === 'vendor-hub' && (
          <VendorPortal
            vendors={vendors}
            currentVendor={currentVendor}
            onVendorChange={handleVendorChange}
            onOpenVendorProfile={(v) => setSelectedVendor(v)}
            onRefreshData={() => {
              fetchInspirations();
              fetchVendors();
            }}
            onShowToast={showToast}
          />
        )}

      </main>

      {/* Modals */}
      {selectedInspiration && (
        <InspirationModal
          item={selectedInspiration}
          onClose={() => setSelectedInspiration(null)}
          onOpenVendor={(v) => setSelectedVendor(v)}
          onPinToBoard={(item) => setPinItem(item)}
          onLike={handleLikeInspiration}
          onInquireVendor={(v) => setInquireVendor(v)}
          relatedInspirations={relatedInspirations}
          onSelectRelated={(item) => handleOpenInspiration(item)}
        />
      )}

      {selectedVendor && (
        <VendorProfileModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onInquireVendor={(v) => setInquireVendor(v)}
          onOpenInspiration={handleOpenInspiration}
          onShowToast={showToast}
        />
      )}

      {inquireVendor && (
        <InquiryModal
          vendor={inquireVendor}
          onClose={() => setInquireVendor(null)}
          onSuccess={() => {
            showToast(`Quote request successfully sent to ${inquireVendor.name}!`, 'success');
          }}
        />
      )}

      {pinItem && (
        <PinToBoardModal
          item={pinItem}
          boards={boards}
          onClose={() => setPinItem(null)}
          onSaveToBoard={handleSavePinToBoard}
          onCreateBoardAndPin={handleCreateBoardAndPin}
        />
      )}

      {roadmapOpen && (
        <RoadmapModal
          onClose={() => setRoadmapOpen(false)}
        />
      )}

      {/* Mobile Connect QR Modal */}
      <MobileConnectModal
        isOpen={mobileConnectOpen}
        onClose={() => setMobileConnectOpen(false)}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        boardCount={boards.length}
        onOpenMobileConnect={() => setMobileConnectOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Footer */}
      <footer className="bg-stone-950 text-white pt-16 pb-12 border-t border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-600 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-stone-950" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">AURA</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Ethiopia's premier visual event inspiration and admin-curated vendor discovery platform. Bridging creative imagination with trusted execution.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  Version 1: Visual Core (Live)
                </span>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-200 mb-4">Core Visual Sectors</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li className="hover:text-gold-400 cursor-pointer" onClick={() => { setActiveTab('feed'); setSelectedCategory('Decor'); }}>
                  Modern Luxury Stage Decor
                </li>
                <li className="hover:text-gold-400 cursor-pointer" onClick={() => { setActiveTab('feed'); setSelectedCategory('Traditional'); }}>
                  Royal Traditional Melse Setups
                </li>
                <li className="hover:text-gold-400 cursor-pointer" onClick={() => { setActiveTab('feed'); setSelectedCategory('Media'); }}>
                  4K Cinematic Wedding Films
                </li>
                <li className="hover:text-gold-400 cursor-pointer" onClick={() => { setActiveTab('feed'); setSelectedCategory('Floral Art'); }}>
                  Artisanal Highland Floral Canopies
                </li>
              </ul>
            </div>

            {/* Column 3: Roadmap */}
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-200 mb-4">Version Roadmap</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li className="flex items-center gap-1.5 text-gold-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                  V1: Visual Core (Decorators & Media)
                </li>
                <li className="flex items-center gap-1.5 hover:text-stone-300 cursor-pointer" onClick={() => setRoadmapOpen(true)}>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-600"></span>
                  V2: Catering, Sound & AV Production
                </li>
                <li className="flex items-center gap-1.5 hover:text-stone-300 cursor-pointer" onClick={() => setRoadmapOpen(true)}>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-600"></span>
                  V3: Venue Integrations & 3D Spatial Maps
                </li>
              </ul>
            </div>

            {/* Column 4: Quality Guarantee & Mobile Access */}
            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Curation Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
                All portfolios and studio profiles are strictly inspected and published by the platform administration team to eliminate marketplace noise.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('vendor-hub')}
                  className="text-xs font-bold text-gold-400 hover:text-gold-300 text-left underline underline-offset-4"
                >
                  Join as a Vendor & Register Portfolio →
                </button>
                <button
                  onClick={() => setMobileConnectOpen(true)}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 text-left flex items-center gap-1.5 mt-1"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Connect Mobile Phone via QR Code →</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-xs font-semibold text-stone-400 hover:text-stone-300 text-left"
                >
                  Access Admin Portal →
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} Habesha Event Hub & AURA Scenography. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted for high-end celebrations in Addis Ababa</span>
              <Heart className="w-3.5 h-3.5 text-gold-500 fill-current" />
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}