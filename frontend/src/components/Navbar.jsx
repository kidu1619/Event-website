import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Users, 
  ShieldCheck, 
  Compass, 
  PlusCircle, 
  Layers,
  Building2,
  Smartphone,
  Sun,
  Moon,
  X,
  ArrowRight,
  Star,
  Image as ImageIcon
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  boardCount,
  onOpenRoadmap,
  onOpenNewBoard,
  onOpenMobileConnect,
  theme = 'light',
  toggleTheme,
  onSearchSubmit,
  vendors = [],
  inspirations = [],
  onOpenInspiration,
  onOpenVendor
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsDropdownOpen(false);
    if (activeTab !== 'feed' && activeTab !== 'vendors') {
      setActiveTab('feed');
    }
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  // Live filter matches for autocomplete dropdown
  const q = searchQuery.toLowerCase().trim();
  const matchedVendors = q ? vendors.filter(v => {
    const nameMatch = v.name && v.name.toLowerCase().includes(q);
    const bioMatch = v.bio && v.bio.toLowerCase().includes(q);
    const specMatch = v.specialties && v.specialties.some(s => s.toLowerCase().includes(q));
    const subMatch = v.subcategories && v.subcategories.some(s => s.toLowerCase().includes(q));
    const catMatch = v.category && v.category.toLowerCase().includes(q);
    const locMatch = v.location && v.location.toLowerCase().includes(q);
    return nameMatch || bioMatch || specMatch || subMatch || catMatch || locMatch;
  }).slice(0, 3) : [];

  const matchedInspirations = q ? inspirations.filter(item => {
    const titleMatch = item.title && item.title.toLowerCase().includes(q);
    const descMatch = item.description && item.description.toLowerCase().includes(q);
    const catMatch = item.category && item.category.toLowerCase().includes(q);
    const eventMatch = item.eventType && item.eventType.toLowerCase().includes(q);
    const vendorName = item.vendorId?.name && item.vendorId.name.toLowerCase().includes(q);
    const tagMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
    return titleMatch || descMatch || catMatch || eventMatch || vendorName || tagMatch;
  }).slice(0, 3) : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-colors duration-200">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 min-w-0">
          
          {/* 1. Brand Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0 select-none" 
            onClick={() => setActiveTab('feed')}
            title="AURA Events Addis Ababa"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-gold-600 dark:from-stone-800 dark:via-stone-700 dark:to-gold-500 flex items-center justify-center text-white shadow-md shadow-gold-500/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">AURA</span>
                <span className="text-[10px] sm:text-xs font-sans tracking-widest text-gold-700 dark:text-gold-400 font-semibold uppercase">Events</span>
              </div>
              <div className="hidden 2xl:flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-gold-100 dark:bg-gold-950/60 text-gold-800 dark:text-gold-300 border border-gold-300/60 dark:border-gold-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 dark:bg-gold-400 mr-1"></span>
                  Verified Platform
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500">Addis Ababa</span>
              </div>
            </div>
          </div>

          {/* 2. Prominent Spacious Search Bar with Live Suggestions */}
          <div ref={searchContainerRef} className="flex-1 min-w-[160px] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <button
                type="submit"
                aria-label="Submit search"
                title="Search inspirations and vendors"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-gold-600 dark:hover:text-gold-400 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onFocus={() => {
                  setIsFocused(true);
                  if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
                }}
                onBlur={() => setIsFocused(false)}
                onChange={handleInputChange}
                placeholder="Search wedding stages, vendors..."
                className="w-full pl-9 pr-20 sm:pl-10 sm:pr-24 py-2 sm:py-2.5 bg-stone-100/90 hover:bg-stone-100 focus:bg-white dark:bg-stone-900/90 dark:hover:bg-stone-900 dark:focus:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-xs sm:text-sm rounded-full border border-stone-200/90 dark:border-stone-700/90 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all shadow-inner-xs"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    title="Clear search"
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-full cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-800 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-[11px] sm:text-xs font-semibold rounded-full transition shadow-xs cursor-pointer flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Search Instant Dropdown */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Search className="w-3.5 h-3.5 text-gold-500" />
                    Searching for <strong className="text-stone-900 dark:text-white">"{searchQuery}"</strong>
                  </span>
                  <span className="text-[11px] text-stone-400">Press Enter for all results</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80">
                  {/* Matching Curated Vendors */}
                  {matchedVendors.length > 0 && (
                    <div className="p-2.5">
                      <div className="text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wider px-2.5 py-1 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Curated Vendors ({matchedVendors.length})</span>
                      </div>
                      {matchedVendors.map(v => (
                        <div
                          key={v._id}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onOpenVendor) {
                              onOpenVendor(v);
                            } else {
                              setActiveTab('vendors');
                            }
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition group"
                        >
                          <img
                            src={v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={v.name}
                            className="w-8 h-8 rounded-full object-cover border border-gold-400 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 truncate">{v.name}</span>
                              {v.isVerified && <ShieldCheck className="w-3 h-3 text-gold-500 flex-shrink-0" />}
                            </div>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{v.category} • {v.location || 'Addis Ababa'}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gold-600 font-semibold flex-shrink-0">
                            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                            <span>{v.rating || 5.0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Visual Concepts / Inspirations */}
                  {matchedInspirations.length > 0 && (
                    <div className="p-2.5">
                      <div className="text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wider px-2.5 py-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Inspiration Feed Concepts ({matchedInspirations.length})</span>
                      </div>
                      {matchedInspirations.map(item => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onOpenInspiration) {
                              onOpenInspiration(item);
                            } else {
                              setActiveTab('feed');
                            }
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition group"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 truncate block">{item.title}</span>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                              {item.category} • {item.eventType} • by {item.vendorId?.name || 'Curated Studio'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedVendors.length === 0 && matchedInspirations.length === 0 && (
                    <div className="p-6 text-center text-xs text-stone-500 dark:text-stone-400">
                      Press Search or Enter to find all matches for "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Quick Navigation Footer */}
                <div className="p-2 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setActiveTab('feed');
                      if (onSearchSubmit) onSearchSubmit(searchQuery);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition flex items-center justify-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5 text-gold-500" />
                    <span>View in Inspiration Feed</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setActiveTab('vendors');
                      if (onSearchSubmit) onSearchSubmit(searchQuery);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition flex items-center justify-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5 text-gold-500" />
                    <span>View in Curated Vendors</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'feed'
                  ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <span>Inspiration Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('vendors')}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'vendors'
                  ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <span>Curated Vendors</span>
              <span className="hidden xl:inline px-1.5 py-0.2 rounded-full bg-gold-500/10 dark:bg-gold-400/20 text-gold-700 dark:text-gold-300 text-[9px] font-bold border border-gold-500/20">
                Verified
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vendor-hub')}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'vendor-hub'
                  ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <span>Vendor Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('boards')}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'boards'
                  ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <span>Boards</span>
              {boardCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-gold-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {boardCount}
                </span>
              )}
            </button>
          </nav>

          {/* 4. Action & Utility Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
            
            {/* Roadmap Icon Button */}
            <button
              onClick={onOpenRoadmap}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-gold-50 dark:hover:bg-stone-800 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-300/60 dark:hover:border-gold-700/60 transition shadow-xs cursor-pointer flex-shrink-0"
              title="Platform Scaling Roadmap (V2/V3 Logistics & 3D Spatial Tools)"
              aria-label="Platform Roadmap"
            >
              <Layers className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            </button>

            {/* Light / Dark Theme Toggle Icon Button */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition shadow-xs cursor-pointer flex-shrink-0"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            )}

            {/* Mobile Phone QR Button */}
            {onOpenMobileConnect && (
              <button
                onClick={onOpenMobileConnect}
                className="flex items-center justify-center gap-1 px-2 sm:px-2.5 lg:px-3 h-8 sm:h-9 lg:h-10 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 transition shadow-xs cursor-pointer flex-shrink-0"
                title="Connect from your Mobile Phone via QR code"
                aria-label="Connect from your Mobile Phone via QR code"
              >
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                <span className="hidden xl:inline text-[11px] sm:text-xs">Mobile QR</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 lg:px-3 h-8 sm:h-9 lg:h-10 rounded-xl text-xs font-semibold transition border cursor-pointer flex-shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-gold-50 dark:bg-gold-950/70 text-gold-900 dark:text-gold-300 border-gold-400 dark:border-gold-600 ring-2 ring-gold-400/20'
                  : 'text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
              title="Administrator Curation Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
              <span className="hidden sm:inline text-[11px] sm:text-xs">Admin</span>
            </button>

            {/* Create New Board Button */}
            <button
              onClick={onOpenNewBoard}
              aria-label="Create New Board"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 lg:px-3.5 h-8 sm:h-9 lg:h-10 rounded-xl text-[11px] sm:text-xs font-semibold bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white shadow-xs shadow-gold-600/30 transition transform active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>New Board</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar & Tab Strip */}
        <div className="pb-3 md:hidden space-y-2">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-gold-600 dark:hover:text-gold-400"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inspiration & curated vendors..."
              aria-label="Search inspiration, vendors and styles"
              className="w-full pl-10 pr-20 py-2.5 bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm rounded-full border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gold-500/30 min-h-[44px]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 w-6 h-6 flex items-center justify-center rounded-full text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1 bg-stone-900 dark:bg-gold-600 text-white text-xs font-semibold rounded-full shadow-xs cursor-pointer"
              >
                Go
              </button>
            </div>
          </form>

          {/* Quick Mobile Navigation Pills */}
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar"
            role="tablist"
            aria-label="Quick Category Tabs"
          >
            <button
              onClick={() => setActiveTab('feed')}
              role="tab"
              aria-selected={activeTab === 'feed'}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap min-h-[36px] transition cursor-pointer ${
                activeTab === 'feed' ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Inspiration Feed
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              role="tab"
              aria-selected={activeTab === 'vendors'}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap min-h-[36px] transition cursor-pointer ${
                activeTab === 'vendors' ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Curated Vendors
            </button>
            <button
              onClick={() => setActiveTab('vendor-hub')}
              role="tab"
              aria-selected={activeTab === 'vendor-hub'}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap min-h-[36px] transition cursor-pointer ${
                activeTab === 'vendor-hub' ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Vendor Hub
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              role="tab"
              aria-selected={activeTab === 'boards'}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap min-h-[36px] transition cursor-pointer ${
                activeTab === 'boards' ? 'bg-stone-900 dark:bg-gold-600 text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              Mood Boards ({boardCount})
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
