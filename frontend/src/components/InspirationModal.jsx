import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Heart, 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageSquareText, 
  Phone, 
  Globe, 
  Calendar, 
  Tag, 
  Sparkles,
  ExternalLink,
  Share2
} from 'lucide-react';

export default function InspirationModal({
  item,
  onClose,
  onOpenVendor,
  onPinToBoard,
  onLike,
  onInquireVendor,
  relatedInspirations = [],
  onSelectRelated
}) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [liked, setLiked] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const vendor = item.vendorId || {};

  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike(item._id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-insp-title"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 my-4 sm:my-8 flex flex-col md:flex-row max-h-[92vh] text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details modal"
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-stone-900/70 hover:bg-stone-900 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-white backdrop-blur-md flex items-center justify-center transition shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-Resolution Visual */}
        <div className="md:w-3/5 bg-stone-950 relative flex items-center justify-center min-h-[260px] sm:min-h-[350px] md:min-h-[550px] overflow-hidden group">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full max-h-[85vh] object-contain"
          />

          {/* Floating bottom tag on photo */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10">
              {item.eventType || 'Event Setup'}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10">
              Admin Verified Curation
            </span>
          </div>
        </div>

        {/* Right Side: Details, Creator & Palette */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-stone-900">
          <div>
            {/* Action Bar: Save Pin & Like */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    liked 
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' 
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{(item.likesCount || 0) + (liked ? 1 : 0)}</span>
                </button>
              </div>

              <button
                onClick={() => onPinToBoard(item)}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold shadow-sm flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 fill-current" />
                <span>Save to Board</span>
              </button>
            </div>

            {/* Title & Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 border border-gold-300/40 dark:border-gold-700/40">
                  {item.category}
                </span>
                {item.subCategory && (
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    • {item.subCategory}
                  </span>
                )}
              </div>
              <h3 id="modal-insp-title" className="font-serif text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                {item.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6">
              {item.description || 'Curated event scenography and visual inspiration setup.'}
            </p>

            {/* Color Palette Extract */}
            {item.palette && item.palette.length > 0 && (
              <div className="mb-6 p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold block mb-2">
                  Extracted Color Palette (Click to Copy Hex)
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {item.palette.map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyColor(hex)}
                      className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xs hover:border-gold-500 transition cursor-pointer"
                      title={`Copy ${hex}`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-600 shadow-inner"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300">{hex}</span>
                      {copiedHex === hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                      ) : (
                        <Copy className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Creator Card */}
            <div className="p-4 bg-gradient-to-br from-gold-50/60 to-champagne-50/60 dark:from-stone-950 dark:to-stone-800/80 rounded-2xl border border-gold-200/70 dark:border-stone-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 dark:text-gold-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  Admin-Curated Creator
                </span>
                <span className="text-xs font-semibold text-gold-900 dark:text-gold-300 bg-gold-200/60 dark:bg-gold-950/80 px-2 py-0.5 rounded-full border border-gold-400/30">
                  ★ {vendor.rating || 4.9} Rating
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={vendor.name || 'Vendor'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-400 shadow-xs"
                />
                <div>
                  <h4 
                    onClick={() => {
                      onClose();
                      onOpenVendor(vendor);
                    }}
                    className="font-serif font-bold text-stone-900 dark:text-gold-300 hover:text-gold-700 dark:hover:text-gold-200 cursor-pointer text-base"
                  >
                    {vendor.name || 'Elite Studio'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{vendor.location || 'Addis Ababa'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenVendor(vendor);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-semibold transition cursor-pointer"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onInquireVendor(vendor);
                  }}
                  className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquareText className="w-3.5 h-3.5 text-gold-400 dark:text-white" />
                  <span>Request Quote</span>
                </button>
              </div>
            </div>

          </div>

          {/* Related Items Mini Preview */}
          {relatedInspirations.length > 0 && (
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">More Like This</span>
              <div className="grid grid-cols-3 gap-2">
                {relatedInspirations.slice(0, 3).map((rel) => (
                  <div
                    key={rel._id}
                    onClick={() => onSelectRelated(rel)}
                    className="cursor-pointer rounded-xl overflow-hidden aspect-square relative group bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1 text-center">
                      <span className="text-[10px] text-white font-medium line-clamp-2">{rel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
