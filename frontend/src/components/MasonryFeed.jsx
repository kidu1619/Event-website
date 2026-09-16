import React from 'react';
import { 
  Heart, 
  Bookmark, 
  Eye, 
  MessageSquareText, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Search, 
  X,
  Users,
  ArrowRight,
  Star
} from 'lucide-react';

export default function MasonryFeed({
  inspirations,
  loading,
  onOpenInspiration,
  onOpenVendor,
  onPinToBoard,
  onLikeInspiration,
  onQuickInquire,
  activeCategory,
  onResetFilters,
  searchQuery,
  vendors = [],
  onSwitchToVendors
}) {
  // Find matching vendors for the current search query
  const q = (searchQuery || '').toLowerCase().trim();
  const matchingVendors = q ? vendors.filter(v => {
    const nameMatch = v.name && v.name.toLowerCase().includes(q);
    const bioMatch = v.bio && v.bio.toLowerCase().includes(q);
    const taglineMatch = v.tagline && v.tagline.toLowerCase().includes(q);
    const specMatch = v.specialties && v.specialties.some(s => s.toLowerCase().includes(q));
    const subMatch = v.subcategories && v.subcategories.some(s => s.toLowerCase().includes(q));
    const catMatch = v.category && v.category.toLowerCase().includes(q);
    const locMatch = v.location && v.location.toLowerCase().includes(q);
    return nameMatch || bioMatch || taglineMatch || specMatch || subMatch || catMatch || locMatch;
  }) : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 animate-spin mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-stone-600 dark:text-stone-300 font-medium">Loading curated visual inspiration...</p>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Connecting to MongoDB database</p>
      </div>
    );
  }

  if (inspirations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-16 px-4 text-center">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gold-50 dark:bg-stone-800 text-gold-600 dark:text-gold-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">No Visual Inspirations Found</h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto mb-6">
            We couldn't find inspiration concepts matching {searchQuery ? `"${searchQuery}"` : 'the current filters'}.
          </p>

          {/* If matching vendors were found despite 0 inspiration posts */}
          {matchingVendors.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gold-50/80 dark:bg-stone-800/80 border border-gold-200 dark:border-gold-800/60 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gold-900 dark:text-gold-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  Found {matchingVendors.length} Matching Curated Studio(s) in Vendor Directory:
                </span>
                {onSwitchToVendors && (
                  <button
                    onClick={onSwitchToVendors}
                    className="text-xs font-bold text-gold-700 dark:text-gold-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingVendors.slice(0, 4).map(v => (
                  <div
                    key={v._id}
                    onClick={() => onOpenVendor(v)}
                    className="flex items-center gap-2.5 p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-gold-400 cursor-pointer transition"
                  >
                    <img
                      src={v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={v.name}
                      className="w-8 h-8 rounded-full object-cover border border-gold-400"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">{v.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{v.category} • {v.location || 'Addis Ababa'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onResetFilters}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Reset Filters & View All
            </button>
            {matchingVendors.length > 0 && onSwitchToVendors && (
              <button
                onClick={onSwitchToVendors}
                className="px-6 py-2.5 rounded-full bg-gold-100 dark:bg-gold-950/80 hover:bg-gold-200 dark:hover:bg-gold-900 text-gold-900 dark:text-gold-200 text-xs font-bold border border-gold-300 dark:border-gold-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Go to Matching Vendors ({matchingVendors.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Active Search & Matching Vendors Hub */}
      {searchQuery && (
        <div className="mb-8 p-5 bg-gradient-to-r from-gold-50/90 via-amber-50/60 to-gold-50/90 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-900 rounded-3xl border border-gold-200/90 dark:border-gold-800/60 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold-200/60 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold-600 text-white flex items-center justify-center shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400">Search Results for:</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white bg-gold-100 dark:bg-gold-950/70 px-2.5 py-0.5 rounded-lg border border-gold-300/60 dark:border-gold-700/60">
                    "{searchQuery}"
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Showing <strong>{inspirations.length}</strong> inspiration concepts
                  {matchingVendors.length > 0 && (
                    <span> and <strong>{matchingVendors.length}</strong> curated vendor profile(s)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {matchingVendors.length > 0 && onSwitchToVendors && (
                <button
                  onClick={onSwitchToVendors}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-200 dark:border-stone-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>Curated Vendors ({matchingVendors.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={onResetFilters}
                className="px-3 py-1.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Quick-Access Matching Curated Creators Strip */}
          {matchingVendors.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gold-800 dark:text-gold-300 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Matching Curated Creators ({matchingVendors.length}):</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {matchingVendors.map(v => (
                  <div
                    key={v._id}
                    onClick={() => onOpenVendor(v)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-gold-50 dark:hover:bg-stone-700/80 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-gold-400 shadow-xs cursor-pointer transition flex-shrink-0 group"
                  >
                    <img
                      src={v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={v.name}
                      className="w-6 h-6 rounded-full object-cover border border-gold-400"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 truncate max-w-[140px]">{v.name}</span>
                        {v.isVerified && <ShieldCheck className="w-3 h-3 text-gold-600 dark:text-gold-400 flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{v.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standard Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {searchQuery ? 'Matching Inspiration Concepts' : (activeCategory === 'All' ? 'Curated Visual Feed' : `${activeCategory} Collection`)}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
            Showing {inspirations.length} admin-verified decor installations and media portfolios
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-stone-400 dark:text-stone-500">Click any card to inspect full palette, specs, and vendor</span>
        </div>
      </div>

      {/* Masonry Columns */}
      <div className="masonry-grid">
        {inspirations.map((item) => {
          const vendor = item.vendorId || {};
          return (
            <div
              key={item._id}
              className="masonry-item group relative bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div 
                className="relative overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800"
                onClick={() => onOpenInspiration(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {item.eventType || item.category}
                  </span>
                  
                  {item.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold-500/90 backdrop-blur-md text-white border border-gold-300 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  
                  {/* Top Right Save Pin Button */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPinToBoard(item);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                      title="Save to Mood Board"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>Save Pin</span>
                    </button>
                  </div>

                  {/* Bottom Quick Actions & Palette */}
                  <div>
                    {/* Color Palette preview swatches */}
                    {item.palette && item.palette.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {item.palette.slice(0, 4).map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        <span className="text-[10px] text-stone-300 ml-1">Palette</span>
                      </div>
                    )}

                    <h4 className="font-serif text-base font-bold text-white line-clamp-2 drop-shadow-sm mb-1">
                      {item.title}
                    </h4>

                    <p className="text-stone-300 text-xs line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeInspiration(item._id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-stone-200 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Heart className="w-4 h-4 hover:fill-rose-500" />
                        <span>{item.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickInquire(vendor);
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-gold-200 transition underline underline-offset-4 cursor-pointer"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>Request Quote</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer: Verified Vendor Info & Mobile Touch Actions */}
              <div className="p-3.5 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2 sm:mb-0">
                  <div 
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition min-h-[40px]"
                    onClick={() => onOpenVendor(vendor)}
                    role="button"
                    aria-label={`View ${vendor.name || 'vendor'} profile`}
                  >
                    <img
                      src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={vendor.name || 'Vendor avatar'}
                      className="w-8 h-8 rounded-full object-cover border border-gold-400"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">{vendor.name || 'Elite Studio'}</span>
                        {vendor.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{vendor.location || 'Addis Ababa'}</span>
                    </div>
                  </div>

                  {/* Desktop View Details Icon */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenInspiration(item)}
                      className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                      title="View Details"
                      aria-label="View inspiration details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile-Friendly Quick Action Bar */}
                <div className="flex sm:hidden items-center justify-between pt-2.5 border-t border-stone-100/90 dark:border-stone-800 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeInspiration(item._id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-rose-600 text-xs font-semibold transition min-h-[44px]"
                    aria-label={`Like ${item.title}`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{item.likesCount || 0}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinToBoard(item);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-50 dark:bg-gold-950/60 hover:bg-gold-100 dark:hover:bg-gold-900/60 text-gold-900 dark:text-gold-300 text-xs font-bold transition min-h-[44px] flex-1 justify-center border border-gold-200 dark:border-gold-800/60"
                    aria-label={`Save ${item.title} to mood board`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current text-gold-700 dark:text-gold-400" />
                    <span>Save Pin</span>
                  </button>

                  <button
                    onClick={() => onOpenInspiration(item)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-stone-900 dark:bg-gold-600 text-white min-h-[44px] min-w-[44px]"
                    aria-label="View full visual details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
