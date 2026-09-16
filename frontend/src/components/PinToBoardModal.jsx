import React, { useState } from 'react';
import { Bookmark, Plus, Check, X, Sparkles, FolderPlus } from 'lucide-react';

export default function PinToBoardModal({
  item,
  boards,
  onClose,
  onSaveToBoard,
  onCreateBoardAndPin
}) {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleCreateAndPin = (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    onCreateBoardAndPin(newBoardTitle, item._id);
    setNewBoardTitle('');
    setShowNewBoardInput(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
            <div>
              <h4 id="pin-modal-title" className="font-serif font-bold text-stone-900 dark:text-white text-sm line-clamp-1">Save to Board</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">{item.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close modal"
            className="w-9 h-9 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Boards List */}
        <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {boards.map((b) => {
            const isAlreadySaved = b.inspirations?.some(insp => (insp._id === item._id || insp === item._id));
            return (
              <button
                key={b._id}
                onClick={() => onSaveToBoard(b._id, item._id)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-gold-400 dark:hover:border-gold-600 hover:bg-gold-50/40 dark:hover:bg-stone-800/60 transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:bg-gold-500 group-hover:text-stone-950 transition">
                    <Bookmark className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">{b.title}</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500">{b.inspirations?.length || 0} Pins</span>
                  </div>
                </div>

                {isAlreadySaved ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40 flex items-center gap-1">
                    <Check className="w-3-5 h-3-5" /> Saved
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-stone-900 dark:bg-gold-600 group-hover:bg-gold-500 group-hover:text-stone-950 text-white transition">
                    Save
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick New Board Form */}
        {showNewBoardInput ? (
          <form onSubmit={handleCreateAndPin} className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">New Board Name</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="e.g. Modern Table Decors"
                className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-gold-500"
                autoFocus
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Create & Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowNewBoardInput(true)}
            className="w-full py-2.5 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-400 dark:hover:border-stone-500 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            <span>Create New Board</span>
          </button>
        )}
      </div>
    </div>
  );
}
