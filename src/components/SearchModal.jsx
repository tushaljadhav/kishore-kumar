import React, { useState } from 'react';
import { Search, X, Play, Music, Disc } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function SearchModal({ isOpen, onClose, onPlayTrack }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? playlist.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.movie.toLowerCase().includes(query.toLowerCase()) ||
          s.mood.toLowerCase().includes(query.toLowerCase()) ||
          s.year.includes(query)
      )
    : playlist.slice(0, 6);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel p-6 rounded-3xl border border-[#D49A32]/40 shadow-2xl space-y-6 relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#D49A32]" />
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#F5E6C8]">
              Search Kishore Kumar Radio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* INPUT */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type song title (e.g., Roop Tera Mastana, Padosan, Aradhana)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full px-5 py-3 rounded-2xl bg-[#111111]/90 border border-[#F5E6C8]/20 text-base text-[#F5E6C8] placeholder-[#F5E6C8]/40 focus:outline-none focus:border-[#D49A32] shadow-inner"
          />
        </div>

        {/* RESULTS */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          <p className="text-xs font-mono uppercase text-[#D49A32] tracking-wider mb-2">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Tracks'}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              No matching Kishore Kumar songs found.
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
                  className="p-3 rounded-xl bg-[#111111]/50 hover:bg-[#111111]/90 border border-[#F5E6C8]/10 hover:border-[#D49A32]/50 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-[#1A140E]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23D49A32' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#F5E6C8] group-hover:text-[#D49A32] truncate">
                        {song.title}
                      </h4>
                      <p className="text-xs text-stone-400 truncate">
                        {song.movie} ({song.year})
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#D49A32]/20 text-[#D49A32] group-hover:bg-[#D49A32] group-hover:text-black flex items-center justify-center transition-all flex-shrink-0">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
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
