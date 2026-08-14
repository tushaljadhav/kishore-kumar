import React, { useState, useEffect } from 'react';
import { Search, X, Play, Music, Disc, Sparkles } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function SearchModal({ isOpen, onClose, onPlayTrack }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? playlist.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.movie.toLowerCase().includes(query.toLowerCase()) ||
          (s.mood && s.mood.toLowerCase().includes(query.toLowerCase())) ||
          (s.year && s.year.includes(query))
      )
    : playlist.slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#D49A32]/40 shadow-2xl space-y-4 sm:space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D49A32]/20 border border-[#D49A32]/40 flex items-center justify-center text-[#D49A32]">
              <Search className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-['Playfair_Display'] text-[#F5E6C8]">
                Search Kishore Kumar Radio
              </h3>
              <p className="text-[10px] text-stone-400 font-mono">
                Search 48 tracks by Title, Movie, Year or Mood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] min-h-[40px] text-stone-400 hover:text-white rounded-full hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* INPUT (16px font size on mobile to prevent iOS Safari auto-zoom) */}
        <div className="relative flex-shrink-0">
          <Search className="w-4 h-4 text-[#D49A32] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Type song title, movie (e.g. Aradhana, Kati Patang)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-11 pr-12 py-3 rounded-2xl bg-[#111111]/90 border border-[#F5E6C8]/20 text-base sm:text-sm text-[#F5E6C8] placeholder-[#F5E6C8]/40 focus:outline-none focus:border-[#D49A32] focus:ring-2 focus:ring-[#D49A32]/20 shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-stone-800 text-stone-300 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* RESULTS (Scrollable container) */}
        <div
          className="space-y-2 flex-1 overflow-y-auto min-h-0 pr-1 custom-drawer-scroll"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <p className="text-[11px] font-mono uppercase text-[#D49A32] tracking-wider mb-2 flex items-center justify-between">
            <span>{query.trim() ? `Search Results (${results.length})` : 'Popular Tracks'}</span>
            <span className="text-stone-400 font-sans normal-case text-[10px]">Tap to play instantly</span>
          </p>

          {results.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm space-y-2">
              <Music className="w-8 h-8 text-[#D49A32] mx-auto opacity-40" />
              <p>No matching Kishore Kumar songs found.</p>
            </div>
          ) : (
            results.map((song) => {
              const globalIndex = playlist.findIndex((s) => s.id === song.id);
              return (
                <div
                  key={song.id}
                  onClick={() => {
                    onPlayTrack(globalIndex);
                    onClose();
                  }}
                  className="p-2.5 sm:p-3 rounded-xl bg-[#111111]/60 hover:bg-[#1A140E] border border-[#F5E6C8]/10 hover:border-[#D49A32]/50 flex items-center justify-between gap-3 cursor-pointer group transition-all touch-manipulation"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-[#1A140E] border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23D49A32' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#F5E6C8] group-hover:text-[#D49A32] truncate">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate">
                        {song.movie} {song.year ? `(${song.year})` : ''} • {song.mood}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#D49A32]/20 text-[#D49A32] group-hover:bg-[#D49A32] group-hover:text-black flex items-center justify-center transition-all flex-shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
