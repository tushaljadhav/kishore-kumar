import React, { useState } from 'react';
import { Play, Pause, Heart, Sparkles, Music2, Quote } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function GreatestHitsGrid({
  currentTrackIndex,
  isPlaying,
  onPlayTrack,
  favorites,
  onToggleFavorite
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Romantic', 'Emotional', 'Energetic', 'Classic'];

  const displayedSongs = playlist.filter((song) => {
    if (activeFilter === 'All') return true;
    return song.mood && song.mood.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="hits" className="relative z-10 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-12">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F5E6C8]/15 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D49A32]/20 border border-[#D49A32]/30 text-xs font-mono text-[#D49A32]">
            <Music2 className="w-3.5 h-3.5" />
            <span>SECTION 1 • TIMLESS MELODIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Playfair_Display'] text-[#F5E6C8]">
            Greatest <span className="gold-gradient-text">Hits</span>
          </h2>
          <p className="text-sm text-stone-300 max-w-xl">
            Explore immortal melodies that defined Hindi cinema for four decades. Click any record to play immediately in the vinyl player.
          </p>
        </div>

        {/* FILTER BUTTONS WITH VISIBLE GOLDEN HORIZONTAL SCROLLBAR & WHEEL LISTENERS */}
        <div
          onWheel={(e) => {
            if (e.currentTarget) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2.5 overflow-x-auto py-2 px-1.5 custom-horizontal-scroll max-w-full scroll-smooth bg-[#17110C]/60 p-1.5 rounded-2xl border border-[#D49A32]/20 pb-2.5"
        >
          {filters.map((f) => {
            const count = f === 'All' ? playlist.length : playlist.filter((s) => s.mood === f).length;
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={(e) => {
                  setActiveFilter(f);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D49A32] to-[#C87925] text-black shadow-lg shadow-[#D49A32]/30 scale-105 font-bold'
                    : 'glass-panel text-[#F5E6C8]/75 hover:text-white hover:border-[#D49A32]/40 hover:bg-[#2A1F16]'
                }`}
              >
                <span>{f}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${isActive ? 'bg-black/25 text-black font-bold' : 'bg-[#D49A32]/20 text-[#D49A32]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSongs.map((song) => {
          const globalIndex = playlist.findIndex((s) => s.id === song.id);
          const isActive = globalIndex === currentTrackIndex;
          const isFav = favorites.includes(song.id);

          return (
            <div
              key={song.id}
              onClick={() => onPlayTrack(globalIndex)}
              className={`group glass-panel p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-[#D49A32] shadow-2xl bg-gradient-to-b from-[#241812]/80 to-[#111111]/90'
                  : 'border-[#F5E6C8]/15 hover:border-[#D49A32]/50'
              }`}
            >
              {/* TOP HEADER */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-[#F5E6C8]/20 flex-shrink-0 group-hover:scale-105 transition-transform bg-[#1A140E]">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23D49A32' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${isActive ? 'bg-[#D49A32] text-black shadow-[#D49A32]/40' : 'bg-black/60 text-[#D49A32] border border-[#D49A32]/50'}`}>
                      {isActive && isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-3.5 w-4">
                          <span className="w-0.5 bg-black rounded-t eq-bar-1"></span>
                          <span className="w-0.5 bg-black rounded-t eq-bar-2"></span>
                          <span className="w-0.5 bg-black rounded-t eq-bar-3"></span>
                        </div>
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#111]/80 text-[#D49A32] border border-[#D49A32]/30">
                    {song.year}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFav ? 'text-rose-500 fill-rose-500' : 'text-stone-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* TITLE & DETAILS */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D49A32]">
                  {song.mood}
                </span>
                <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#F5E6C8] group-hover:text-[#D49A32] transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-stone-300">
                  Movie: <span className="font-semibold text-white">{song.movie}</span>
                </p>
              </div>

              {/* LYRIC SNIPPET */}
              <div className="p-3 rounded-xl bg-[#111111]/60 border border-[#F5E6C8]/10 text-xs italic text-stone-300 flex items-start gap-2">
                <Quote className="w-4 h-4 text-[#D49A32] flex-shrink-0 mt-0.5" />
                <p className="line-clamp-2 font-['Rozha_One']">{song.lyricSnippet}</p>
              </div>

              {/* FOOTER */}
              <div className="mt-4 pt-3 border-t border-[#F5E6C8]/10 flex items-center justify-between text-xs text-stone-400">
                <span>Duration: {song.duration}</span>
                <span className="text-[#D49A32] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Play Record →
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
