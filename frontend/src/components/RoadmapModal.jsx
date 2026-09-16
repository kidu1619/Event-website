import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Palette, 
  Camera, 
  Utensils, 
  Music, 
  Building2, 
  Box, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function RoadmapModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden max-h-[92vh] overflow-y-auto text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-300/40 dark:border-gold-700/40">
            <Layers className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            3-Tier Phased Platform Roadmap
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
            Platform Vision & Scaling Phases
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Eliminating local market fragmentation through a measured, quality-controlled rollout.
          </p>
        </div>

        {/* 3 Versions Grid */}
        <div className="space-y-6">
          
          {/* VERSION 1 (LIVE) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-gold-50/80 via-white to-gold-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 border-2 border-gold-400/80 dark:border-gold-500/60 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-gold-500 text-stone-950 font-bold text-[11px] rounded-bl-2xl shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              LIVE NOW • Version 1
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 text-stone-950 flex items-center justify-center flex-shrink-0 font-serif font-bold text-lg shadow-sm">
                V1
              </div>
              <div className="flex-1 pr-12">
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-gold-300">
                  The Visual Core (Decorators & Media)
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-xs mt-1 leading-relaxed">
                  Focus: High-demand visual inspiration, solving search friction for modern weddings, traditional Melse designs, and cinematic media.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                    <span>Pinterest-style Masonry Inspiration Feed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                    <span>Admin-Curated Verified Vendor Profiles</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                    <span>Client Mood Boards & Pin Collections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                    <span>Direct Quote Inquiries & Admin Curation Gate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERSION 2 (UPCOMING) */}
          <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700 relative">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-[11px] rounded-bl-2xl">
              Phase 2 • Coming Next
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center flex-shrink-0 font-serif font-bold text-lg">
                V2
              </div>
              <div className="flex-1 pr-12">
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Logistics, Sound & Catering Expansion
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 leading-relaxed">
                  Focus: Scale marketplace to handle technical AV production, sound systems, highland floral distributors, and gourmet banquet catering.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>Gourmet Catering & Speciality Cocktail Bars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>Sound Systems, Truss Lighting & Concert AV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>Multi-Vendor Unified Quote Cart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>Standardized Hospitality Service Packages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERSION 3 (FUTURE) */}
          <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700 relative">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-[11px] rounded-bl-2xl">
              Phase 3 • Enterprise
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center flex-shrink-0 font-serif font-bold text-lg">
                V3
              </div>
              <div className="flex-1 pr-12">
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Venue Integration & 3D Spatial Tools
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 leading-relaxed">
                  Focus: Comprehensive directory of luxury ballrooms, conference halls, and resorts with interactive spatial layouts and enterprise tools.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>Ballroom & Hall Spatial Capacity Index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                    <span>3D Interactive Floorplan Seating Planners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center pt-6 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Explore Version 1 (Visual Core)
          </button>
        </div>

      </div>
    </div>
  );
}
