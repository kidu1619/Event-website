import React, { useState } from 'react';
import axios from 'axios';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  MessageSquareText, 
  Layers, 
  FolderPlus,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function MoodBoards({
  boards,
  activeBoardId,
  setActiveBoardId,
  onCreateBoard,
  onRemovePin,
  onDeleteBoard,
  onOpenInspiration,
  onInquireVendor,
  onOpenVendor
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEventType, setNewEventType] = useState('Modern Wedding');

  const activeBoard = boards.find(b => b._id === activeBoardId) || boards[0];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateBoard({
      title: newTitle,
      description: newDescription,
      eventType: newEventType
    });
    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  // Extract unique vendors across saved pins in this board
  const boardVendors = [];
  if (activeBoard && activeBoard.inspirations) {
    const seen = new Set();
    activeBoard.inspirations.forEach(item => {
      const v = item.vendorId;
      if (v && v._id && !seen.has(v._id)) {
        seen.add(v._id);
        boardVendors.push(v);
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Board Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-2 border border-gold-300/40 dark:border-gold-700/40">
            <Bookmark className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            Client Visual Concepts
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            My Event Mood Boards
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Organize aesthetic concepts, stage architectures, and build your bespoke wedding or gala shortlist.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white text-xs font-bold shadow-md shadow-gold-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New Board</span>
        </button>
      </div>

      {/* Board Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {boards.map((b) => {
          const isActive = b._id === activeBoard?._id;
          return (
            <button
              key={b._id}
              onClick={() => setActiveBoardId(b._id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-stone-900 dark:bg-gold-600 text-white border-stone-900 dark:border-gold-500 shadow-md ring-2 ring-gold-500/30'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400 dark:text-white' : 'text-stone-400'}`} />
              <span>{b.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-gold-500 dark:bg-stone-950 text-stone-950 dark:text-gold-300 font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                {b.inspirations?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Board Content */}
      {activeBoard ? (
        <div>
          {/* Active Board Hero Summary Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-stone-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">
                <span>{activeBoard.eventType || 'Event Board'}</span>
                <span>•</span>
                <span>{activeBoard.inspirations?.length || 0} Saved Concepts</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                {activeBoard.title}
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                {activeBoard.description || 'Personalized visual curation for this upcoming celebration.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {boards.length > 1 && (
                <button
                  onClick={() => onDeleteBoard(activeBoard._id)}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 border border-stone-700 text-xs font-semibold transition cursor-pointer"
                  title="Delete this Board"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Aggregated Creators Shortlist (From pins in this board) */}
          {boardVendors.length > 0 && (
            <div className="mb-10 bg-gold-50/50 dark:bg-stone-900/60 rounded-3xl p-6 border border-gold-200/80 dark:border-stone-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900 dark:text-gold-300">
                    Curated Vendors In This Mood Board ({boardVendors.length})
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">These verified studios created the concepts you saved above.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {boardVendors.map((v) => (
                  <div key={v._id} className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-gold-200/70 dark:border-stone-750 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onOpenVendor(v)}>
                      <img src={v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={v.name} className="w-10 h-10 rounded-full object-cover border border-gold-400" />
                      <div>
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block line-clamp-1">{v.name}</span>
                        <span className="text-[10px] text-gold-800 dark:text-gold-400 uppercase font-semibold">{v.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onInquireVendor(v)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-gold-600 dark:hover:bg-gold-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Pins Grid */}
          {activeBoard.inspirations?.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-dashed border-stone-300 dark:border-stone-800">
              <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-3" />
              <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-1">Your Board is Empty</h4>
              <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
                Browse the Inspiration Feed and click "Save Pin" to collect stage designs, Melse setups, and film concepts here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBoard.inspirations.map((item) => {
                const vendor = item.vendorId || {};
                return (
                  <div key={item._id} className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-card hover:shadow-card-hover transition group flex flex-col justify-between">
                    <div>
                      <div className="relative h-64 bg-stone-100 dark:bg-stone-800 overflow-hidden cursor-pointer" onClick={() => onOpenInspiration(item)}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePin(activeBoard._id, item._id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition shadow-md cursor-pointer"
                          title="Remove Pin from Board"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-4">
                        <span className="text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase block mb-1">
                          {item.eventType || item.category}
                        </span>
                        <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-1 mb-2">
                          {item.title}
                        </h4>
                        
                        {/* Palette preview */}
                        {item.palette && (
                          <div className="flex items-center gap-1.5 mb-3">
                            {item.palette.slice(0, 4).map((c, i) => (
                              <span key={i} className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-700" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onOpenVendor(vendor)}>
                        <img src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt={vendor.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1">{vendor.name || 'Studio'}</span>
                      </div>
                      <button
                        onClick={() => onInquireVendor(vendor)}
                        className="text-xs font-bold text-gold-700 dark:text-gold-400 hover:text-gold-900 dark:hover:text-gold-300 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-stone-500 dark:text-stone-400">No boards created yet.</p>
        </div>
      )}

      {/* Create New Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-1">Create New Mood Board</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">Group your favorite decor, photography, and traditional setups.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Board Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Bole Grand Wedding 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Event Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Modern Wedding">Modern Wedding</option>
                  <option value="Traditional Melse">Traditional Melse</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Private Celebration">Private Celebration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Description (Optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes on color theme, venue ideas, and target aesthetic..."
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
