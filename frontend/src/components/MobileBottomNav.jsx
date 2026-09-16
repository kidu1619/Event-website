import React from 'react';
import { 
  Compass, 
  Users, 
  Bookmark, 
  Building2, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  boardCount = 0,
  onOpenMobileConnect,
  onOpenAdmin
}) {
  const tabs = [
    {
      id: 'feed',
      label: 'Inspiration',
      icon: Compass,
      ariaLabel: 'Open Inspiration Feed'
    },
    {
      id: 'vendors',
      label: 'Vendors',
      icon: Users,
      ariaLabel: 'Open Curated Vendors Directory'
    },
    {
      id: 'boards',
      label: 'Boards',
      icon: Bookmark,
      badge: boardCount > 0 ? boardCount : null,
      ariaLabel: `Open Mood Boards (${boardCount} saved)`
    },
    {
      id: 'vendor-hub',
      label: 'Vendor Hub',
      icon: Building2,
      ariaLabel: 'Open Vendor Hub Portal'
    }
  ];

  return (
    <aside 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-lg border-t border-stone-200/90 dark:border-stone-800 shadow-2xl pb-safe transition-colors duration-200"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.ariaLabel}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] ${
                isActive 
                  ? 'text-gold-700 dark:text-gold-400 font-bold' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-gold-500 to-amber-600 rounded-full animate-scale-up" />
              )}

              <div className="relative mt-1">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-gold-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-stone-950 shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[68px] ${isActive ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Mobile Phone QR & Info Action Trigger */}
        <button
          onClick={onOpenMobileConnect}
          role="button"
          aria-label="Open Mobile Connection QR Code and Setup"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-stone-500 hover:text-gold-700 dark:hover:text-gold-400 min-h-[48px] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gold-500/10 dark:bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-700 dark:text-gold-400 mt-0.5">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-semibold text-gold-800 dark:text-gold-300 tracking-tight mt-0.5">
            Phone QR
          </span>
        </button>
      </div>
    </aside>
  );
}
