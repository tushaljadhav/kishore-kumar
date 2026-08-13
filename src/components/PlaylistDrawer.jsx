import React, { useState, useRef } from 'react';
import { X, Search, Play, Pause, Heart, Music, Disc, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function PlaylistDrawer({
  isOpen,
  onClose,
  currentTrackIndex,
  isPlaying,
  onPlayTrack,
  onToggleFavorite,
  favorites
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const tabsRef = useRef(null);

  if (!isOpen) return null;

  const categories = [
    { name: 'All', count: playlist.length },
    { name: 'Romantic', count: playlist.filter((s) => s.mood === 'Romantic').length },
    { name: 'Emotional', count: playlist.filter((s) => s.mood === 'Emotional').length },
    { name: 'Energetic', count: playlist.filter((s) => s.mood === 'Energetic').length },
    { name: 'Classic', count: playlist.filter((s) => s.mood === 'Classic').length },
    { name: 'Favorites', count: favorites.length }
  ];

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWheelScroll = (e) => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  const filteredSongs = playlist.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.movie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.mood && song.mood.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTab === 'All') return true;
    if (selectedTab === 'Favorites') return favorites.includes(song.id);
    return song.mood && song.mood.toLowerCase() === selectedTab.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* DISMISS BACKGROUND */}
      <div className="flex-1 cursor-pointer" onClick={onClose}></div>

      {/* DRAWER CONTAINER */}
      <div className="w-full max-w-md sm:max-w-lg h-full bg-[#120E0B]/95 backdrop-blur-2xl border-l border-[#D49A32]/25 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* HEADER SECTION */}
        <div className="space-y-4 pb-4 border-b border-[#F5E6C8]/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#D49A32]/30 to-[#C87925]/10 border border-[#D49A32]/50 flex items-center justify-center shadow-lg shadow-[#D49A32]/10">
                <Disc className={`w-6 h-6 text-[#D49A32] ${isPlaying ? 'animate-spin' : ''}`} />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D49A32] animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold font-['Playfair_Display'] gold-gradient-text tracking-wide">
                  Kishore Kumar
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#D49A32] uppercase tracking-widest font-semibold">
                    Master Collection
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#D49A32]/20 border border-[#D49A32]/30 text-[10px] font-mono text-[#F5E6C8]">
                    48 Tracks
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#F5E6C8]/70 hover:text-white transition-all transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D49A32] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search song, movie, or mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-[#1A140E]/90 border border-[#D49A32]/30 text-sm text-[#F5E6C8] placeholder-[#F5E6C8]/40 focus:outline-none focus:border-[#D49A32] focus:ring-2 focus:ring-[#D49A32]/20 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* SLEEK HORIZONTAL CATEGORY TABS WITH SCROLL BUTTONS & WHEEL SCROLL */}
          <div className="relative flex items-center gap-1 group/tabs px-1 py-1 bg-[#1A140E]/70 rounded-2xl border border-[#D49A32]/20 shadow-inner">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollTabs('left')}
              className="z-10 w-7 h-7 rounded-xl bg-[#241B13] border border-[#D49A32]/30 text-[#D49A32] flex items-center justify-center shrink-0 shadow-md hover:bg-[#D49A32] hover:text-black transition-colors"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={tabsRef}
              onWheel={handleWheelScroll}
              className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-horizontal-scroll scroll-smooth w-full pb-2"
            >
              {categories.map((cat) => {
                const isActive = selectedTab === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={(e) => {
                      setSelectedTab(cat.name);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D49A32] to-[#C87925] text-black font-bold shadow-lg shadow-[#D49A32]/30 scale-105'
                        : 'bg-[#120E0B]/80 text-[#F5E6C8]/75 hover:text-[#F5E6C8] hover:bg-[#2A1F16] border border-[#F5E6C8]/10'
                    }`}
                  >
                    <span>{cat.name === 'Favorites' ? `❤️ Favorites` : cat.name}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                        isActive
                          ? 'bg-black/25 text-black font-bold'
                          : 'bg-[#D49A32]/20 text-[#D49A32]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => scrollTabs('right')}
              className="z-10 w-7 h-7 rounded-xl bg-[#241B13] border border-[#D49A32]/30 text-[#D49A32] flex items-center justify-center shrink-0 shadow-md hover:bg-[#D49A32] hover:text-black transition-colors"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SONG LIST SCROLLABLE */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1.5 custom-drawer-scroll">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <Music className="w-10 h-10 text-[#D49A32] mx-auto opacity-50 animate-bounce" />
              <p className="text-sm font-medium">No songs match your search or filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTab('All');
                }}
                className="text-xs text-[#D49A32] underline hover:text-amber-300"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredSongs.map((song, idx) => {
              const globalIndex = playlist.findIndex((s) => s.id === song.id);
              const isActive = globalIndex === currentTrackIndex;
              const isFav = favorites.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => onPlayTrack(globalIndex)}
                  className={`group relative p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D49A32]/30 via-[#C87925]/20 to-[#1A140E]/80 border-[#D49A32]/70 shadow-xl shadow-[#D49A32]/10 translate-x-1'
                      : 'bg-[#15100B]/60 border-[#F5E6C8]/10 hover:bg-[#1F1710] hover:border-[#D49A32]/40 hover:translate-x-1'
                  }`}
                >
                  {/* TRACK NO + ALBUM COVER + DETAILS */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-[#D49A32] min-w-[22px] text-right">
                      {(globalIndex + 1).toString().padStart(2, '0')}
                    </span>

                    {/* ALBUM ART THUMBNAIL */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-[#F5E6C8]/20 bg-[#1A140E] shadow-md group-hover:scale-105 transition-transform">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23D49A32' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                        }}
                      />
                      
                      {/* OVERLAY FOR ACTIVE / PLAYING STATE */}
                      {isActive && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center">
                          {isPlaying ? (
                            /* ANIMATED EQUALIZER BARS */
                            <div className="flex items-end justify-center gap-0.5 h-4 w-5">
                              <span className="w-1 bg-[#D49A32] rounded-t eq-bar-1"></span>
                              <span className="w-1 bg-[#F5E6C8] rounded-t eq-bar-2"></span>
                              <span className="w-1 bg-[#C87925] rounded-t eq-bar-3"></span>
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-[#D49A32] fill-current ml-0.5" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* SONG TITLE & MOVIE */}
                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-[#D49A32] font-bold' : 'text-[#F5E6C8] group-hover:text-white'}`}>
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs text-stone-400 truncate">
                          {song.movie}
                        </span>
                        {song.year && (
                          <span className="text-[10px] font-mono px-1.5 py-0.1 rounded bg-[#D49A32]/10 border border-[#D49A32]/20 text-[#D49A32] shrink-0">
                            {song.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DURATION, LIKE & PLAY BUTTON */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono text-stone-400 hidden sm:inline">
                      {song.duration}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className={`p-1.5 rounded-full transition-transform active:scale-125 ${
                        isFav ? 'text-rose-500 fill-rose-500 scale-110' : 'text-stone-500 hover:text-rose-400'
                      }`}
                      title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive && isPlaying
                        ? 'bg-[#D49A32] text-black shadow-lg shadow-[#D49A32]/40'
                        : 'bg-[#D49A32]/15 text-[#D49A32] group-hover:bg-[#D49A32] group-hover:text-black'
                    }`}>
                      {isActive && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-[#F5E6C8]/15 flex items-center justify-between text-xs text-stone-400">
          <span className="font-mono text-stone-400">
            Showing <strong className="text-[#D49A32]">{filteredSongs.length}</strong> of 48 Songs
          </span>
          <span className="font-mono text-[#D49A32] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Kishore Kumar Radio
          </span>
        </div>

      </div>
    </div>
  );
}
