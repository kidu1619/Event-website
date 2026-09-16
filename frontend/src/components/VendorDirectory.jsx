import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Sparkles, 
  MessageSquareText, 
  ArrowUpRight, 
  CheckCircle2, 
  Palette, 
  Camera, 
  Layers,
  Search,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function VendorDirectory({
  vendors,
  loading,
  searchQuery = '',
  onClearSearch,
  onOpenVendor,
  onInquireVendor,
  onViewRoadmap,
  onSwitchToFeed,
  inspirationsCount
}) {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredVendors = vendors.filter(v => {
    const matchesCategory = filterCategory === 'All' || v.category === filterCategory;
    if (!matchesCategory) return false;
    if (!searchQuery || !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = v.name && v.name.toLowerCase().includes(q);
    const bioMatch = v.bio && v.bio.toLowerCase().includes(q);
    const taglineMatch = v.tagline && v.tagline.toLowerCase().includes(q);
    const locMatch = v.location && v.location.toLowerCase().includes(q);
    const specMatch = v.specialties && v.specialties.some(s => s.toLowerCase().includes(q));
    const subMatch = v.subcategories && v.subcategories.some(s => s.toLowerCase().includes(q));
    return nameMatch || bioMatch || taglineMatch || locMatch || specMatch || subMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Directory Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/70 text-gold-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-2 border border-gold-200 dark:border-gold-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            100% Platform Admin-Curated & Verified
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50">
            Curated Vendor Directory
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 max-w-xl">
            Strictly vetted decor architects and media visual studios. Zero unverified listings or social media algorithms.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterCategory === 'All'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Creators ({vendors.length})
          </button>
          <button
            onClick={() => setFilterCategory('Decor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterCategory === 'Decor'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
            Decor & Styling
          </button>
          <button
            onClick={() => setFilterCategory('Media')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterCategory === 'Media'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
            Cinema & Photo
          </button>
        </div>
      </div>

      {/* Active Search Notification Banner */}
      {searchQuery && (
        <div className="mb-6 p-4 rounded-2xl bg-gold-50 dark:bg-stone-900/90 border border-gold-200 dark:border-gold-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gold-900 dark:text-gold-200">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
            <span>
              Searching for: <strong className="font-semibold text-stone-900 dark:text-white">"{searchQuery}"</strong> • Found <strong>{filteredVendors.length}</strong> matching studio(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onSwitchToFeed && (
              <button
                onClick={onSwitchToFeed}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-stone-950 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View in Inspiration Feed</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold shadow-xs border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid of Curated Vendors */}
      {loading ? (
        <div className="py-20 text-center text-stone-500 dark:text-stone-400">
          <Sparkles className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-2" />
          <p>Loading curated vendor profiles...</p>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 max-w-lg mx-auto">
          <Search className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-stone-900 dark:text-white text-lg">No Matching Vendors Found</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 mb-4">
            No creators match the current category filter and search term "{searchQuery}".
          </p>
          <div className="flex items-center justify-center gap-2">
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Reset Search Query
              </button>
            )}
            {onSwitchToFeed && (
              <button
                onClick={onSwitchToFeed}
                className="px-4 py-2 bg-gold-100 dark:bg-gold-950/80 hover:bg-gold-200 text-gold-900 dark:text-gold-300 text-xs font-bold rounded-xl border border-gold-300 dark:border-gold-700 transition cursor-pointer flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Check Inspiration Feed</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image & Category Badge */}
                <div className="relative h-48 bg-stone-900 overflow-hidden cursor-pointer" onClick={() => onOpenVendor(vendor)}>
                  <img
                    src={vendor.coverImage || vendor.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-stone-900 shadow-xs flex items-center gap-1">
                      {vendor.category === 'Decor' ? <Palette className="w-3 h-3 text-gold-600" /> : <Camera className="w-3 h-3 text-gold-600" />}
                      {vendor.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-500 text-stone-950 flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      {vendor.badge || 'Admin Verified'}
                    </span>
                  </div>

                  {/* Rating & Location on Cover */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                      <span className="font-bold">{vendor.rating || 5.0}</span>
                      <span className="text-stone-300">({vendor.reviewsCount || 24})</span>
                    </div>

                    <div className="flex items-center gap-1 text-stone-200">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span>{vendor.location || 'Addis Ababa'}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  {/* Avatar + Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={vendor.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-gold-400/80 shadow-xs flex-shrink-0 -mt-8 relative z-10 bg-white dark:bg-stone-800"
                    />
                    <div>
                      <h3 
                        onClick={() => onOpenVendor(vendor)}
                        className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-gold-700 dark:group-hover:text-gold-400 cursor-pointer transition line-clamp-1"
                      >
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {vendor.tagline || vendor.subcategories?.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-stone-600 dark:text-stone-300 text-xs line-clamp-2 leading-relaxed mb-4">
                    {vendor.bio}
                  </p>

                  {/* Specialties Pills */}
                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {vendor.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium border border-stone-200/60 dark:border-stone-700/60">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Stats Bar */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3 flex items-center justify-between text-xs border border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 block uppercase font-semibold">Starting From</span>
                      <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {vendor.startingPrice || 'On Request'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 block uppercase font-semibold">Events Done</span>
                      <span className="font-bold text-gold-700 dark:text-gold-400">
                        {vendor.completedEvents || 100}+ Celebrations
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2 border-t border-stone-100 dark:border-stone-800 mt-2">
                <button
                  onClick={() => onOpenVendor(vendor)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onInquireVendor(vendor)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquareText className="w-3.5 h-3.5 text-gold-400 dark:text-stone-950" />
                  <span>Get Quote</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Version Roadmap Teaser Banner */}
      <div className="mt-16 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-stone-700/80 dark:border-stone-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4 border border-gold-500/30">
            <Layers className="w-3.5 h-3.5" />
            Upcoming Phased Rollout
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Expanding to Catering, AV & Venues in V2 & V3
          </h3>
          <p className="text-stone-300 text-sm leading-relaxed mb-6">
            We are currently rolling out Version 1 (Decor & Media). Logistics, sound crews, gourmet catering, and 3D venue floorplans are queued for the upcoming versions.
          </p>
          <button
            onClick={onViewRoadmap}
            className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Explore Roadmap & Future Capabilities
          </button>
        </div>
      </div>

    </div>
  );
}
