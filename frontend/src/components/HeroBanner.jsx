import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Camera, Palette, Crown, Calendar, Building2, Smartphone } from 'lucide-react';

export default function HeroBanner({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedEventType, 
  setSelectedEventType,
  onExploreClick,
  onJoinAsVendor,
  onOpenMobileConnect,
  stats
}) {
  const categories = [
    { id: 'All', label: 'All Visuals', icon: Sparkles },
    { id: 'Decor', label: 'Modern Decor & Stages', icon: Palette },
    { id: 'Traditional', label: 'Traditional Melse', icon: Crown },
    { id: 'Media', label: 'Cinema & Photography', icon: Camera },
    { id: 'Floral Art', label: 'Floral Architecture', icon: Heart },
    { id: 'Lighting & Stage', label: 'Gala Lighting & LED', icon: Sparkles }
  ];

  const eventTypes = [
    'All Events',
    'Modern Wedding',
    'Traditional Melse',
    'Corporate Gala',
    'Private Celebration'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-champagne-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ethiopia's Premier Event Hub • Verified Creators</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-stone-50">
            Inspire Your Celebration. <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-champagne-200 bg-clip-text text-transparent">
              Discover Top Event Creators.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Find the best stage decorators, traditional Melse stylists, 4K cinematographers, and luxury event vendors in Addis Ababa. Browse real visual portfolios and get direct quotes.
          </p>

          {/* Action CTAs: Vendor Registration & Mobile Access */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {onJoinAsVendor && (
              <button
                onClick={onJoinAsVendor}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-600/90 to-amber-600/90 hover:from-gold-600 hover:to-amber-600 text-white border border-gold-400/40 text-xs font-bold transition transform hover:scale-[1.02] shadow-lg shadow-gold-600/20 min-h-[44px]"
              >
                <Building2 className="w-4 h-4 text-gold-200" />
                <span>Are you a Vendor? Join Here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenMobileConnect && (
              <button
                onClick={onOpenMobileConnect}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-800/90 hover:bg-stone-700/90 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition transform hover:scale-[1.02] min-h-[44px]"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Open on Mobile Phone (QR)</span>
              </button>
            )}
          </div>

          {/* Key Metrics Chips */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-stone-800/50 backdrop-blur-xs border border-stone-700/60 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-serif font-bold text-gold-400">{stats.inspirationsCount || '150+'}</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Curated Concepts</span>
            </div>
            <div className="bg-stone-800/50 backdrop-blur-xs border border-stone-700/60 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-serif font-bold text-white">100%</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Admin-Verified</span>
            </div>
            <div className="bg-stone-800/50 backdrop-blur-xs border border-stone-700/60 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-serif font-bold text-gold-400">{stats.vendorsCount || '18'}</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Elite Studios</span>
            </div>
            <div className="bg-stone-800/50 backdrop-blur-xs border border-stone-700/60 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-serif font-bold text-white">Direct</span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider">Quote Inquiries</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-stone-800/80 backdrop-blur-md rounded-2xl p-4 border border-stone-700/80 shadow-2xl max-w-5xl mx-auto">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar border-b border-stone-700/50">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-md shadow-gold-700/30 ring-1 ring-gold-400/50'
                      : 'bg-stone-900/60 text-stone-300 hover:text-white hover:bg-stone-700/60 border border-stone-700/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gold-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Event Type Filter Sub-Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs text-stone-400 font-medium whitespace-nowrap flex items-center gap-1.5 pl-1">
                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                Event Type:
              </span>
              {eventTypes.map((type) => {
                const isTypeActive = (selectedEventType === type) || (type === 'All Events' && selectedEventType === 'All');
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedEventType(type === 'All Events' ? 'All' : type)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      isTypeActive
                        ? 'bg-stone-100 text-stone-900 font-semibold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/40'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 ml-auto pr-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Version 1: Visual Core</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
