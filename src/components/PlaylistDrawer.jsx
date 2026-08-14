import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Play, Pause, Heart, Music, Disc, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { playlist } from '../data/playlist';

export default function PlaylistDrawer({
  isOpen,
  onClose,
  currentTrackIndex,
  isPlaying,
  onPlayTrack,
  onToggleFavorite,
  favorites = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const tabsRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      const scrollAmount = direction === 'left' ? -160 : 160;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredSongs = playlist.filter((song) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      song.title.toLowerCase().includes(term) ||
      song.movie.toLowerCase().includes(term) ||
      (song.mood && song.mood.toLowerCase().includes(term)) ||
      (song.year && song.year.includes(term));

    if (!matchesSearch) return false;

    if (selectedTab === 'All') return true;
    if (selectedTab === 'Favorites') return favorites.includes(song.id);
    return song.mood && song.mood.toLowerCase() === selectedTab.toLowerCase();
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 touch-none"
      onClick={onClose}
    >
      {/* DRAWER CONTAINER */}
      <div
        className="w-full sm:max-w-lg h-full bg-[#120E0B]/95 backdrop-blur-2xl border-l border-[#D49A32]/25 px-4 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col justify-between overflow-hidden shadow-2xl relative touch-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER SECTION */}
        <div className="space-y-3.5 pb-3.5 border-b border-[#F5E6C8]/15 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#D49A32]/30 to-[#C87925]/10 border border-[#D49A32]/50 flex items-center justify-center shadow-lg shadow-[#D49A32]/10 shrink-0">
                <Disc className={`w-5 h-5 sm:w-6 sm:h-6 text-[#D49A32] ${isPlaying ? 'animate-spin' : ''}`} />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D49A32] animate-ping opacity-75"></div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold font-['Playfair_Display'] gold-gradient-text tracking-wide truncate">
                  Kishore Kumar
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#D49A32] uppercase tracking-widest font-semibold">
                    Master Collection
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#D49A32]/20 border border-[#D49A32]/30 text-[9px] sm:text-[10px] font-mono text-[#F5E6C8]">
                    48 Tracks
                  </span>
                </div>
              </div>
            </div>

            {/* CLOSE BUTTON (44x44px touch target) */}
            <button
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#F5E6C8]/75 hover:text-white active:scale-95 transition-all"
              aria-label="Close Playlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH INPUT (Font size 16px to prevent iOS auto-zoom) */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D49A32] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search song, movie, mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-[#1A140E]/90 border border-[#D49A32]/30 text-base sm:text-sm text-[#F5E6C8] placeholder-[#F5E6C8]/40 focus:outline-none focus:border-[#D49A32] focus:ring-2 focus:ring-[#D49A32]/20 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-xs text-stone-300 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* HORIZONTAL CATEGORY TABS (Swipeable & touch friendly) */}
          <div className="relative flex items-center gap-1 group/tabs px-1 py-1 bg-[#1A140E]/70 rounded-2xl border border-[#D49A32]/20 shadow-inner">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollTabs('left')}
              className="hidden sm:flex z-10 w-7 h-7 rounded-xl bg-[#241B13] border border-[#D49A32]/30 text-[#D49A32] items-center justify-center shrink-0 shadow-md hover:bg-[#D49A32] hover:text-black transition-colors"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={tabsRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar scroll-smooth w-full flex-nowrap -webkit-overflow-scrolling-touch"
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
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D49A32] to-[#C87925] text-black font-bold shadow-md shadow-[#D49A32]/30 scale-[1.03]'
                        : 'bg-[#120E0B]/80 text-[#F5E6C8]/75 hover:text-[#F5E6C8] hover:bg-[#2A1F16] border border-[#F5E6C8]/10'
                    }`}
                  >
                    <span>{cat.name === 'Favorites' ? `❤️ Favs` : cat.name}</span>
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
              className="hidden sm:flex z-10 w-7 h-7 rounded-xl bg-[#241B13] border border-[#D49A32]/30 text-[#D49A32] items-center justify-center shrink-0 shadow-md hover:bg-[#D49A32] hover:text-black transition-colors"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SONG LIST SCROLLABLE (Independent scroll container) */}
        <div
          className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 custom-drawer-scroll min-h-0"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          {filteredSongs.length === 0 ? (
            <div className="text-center py-14 text-stone-400 space-y-3">
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
            filteredSongs.map((song) => {
              const globalIndex = playlist.findIndex((s) => s.id === song.id);
              const isActive = globalIndex === currentTrackIndex;
              const isFav = favorites.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => onPlayTrack(globalIndex)}
                  className={`group relative p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 touch-manipulation ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D49A32]/30 via-[#C87925]/20 to-[#1A140E]/80 border-[#D49A32]/70 shadow-lg shadow-[#D49A32]/10'
                      : 'bg-[#15100B]/60 border-[#F5E6C8]/10 hover:bg-[#1F1710] hover:border-[#D49A32]/40'
                  }`}
                >
                  {/* TRACK NO + ALBUM COVER + DETAILS */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#D49A32] min-w-[20px] text-right shrink-0">
                      {(globalIndex + 1).toString().padStart(2, '0')}
                    </span>

                    {/* ALBUM ART THUMBNAIL */}
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden flex-shrink-0 border border-[#F5E6C8]/20 bg-[#1A140E] shadow-md">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23D49A32' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                        }}
                      />
                      
                      {/* OVERLAY FOR ACTIVE / PLAYING STATE */}
                      {isActive && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center">
                          {isPlaying ? (
                            <div className="flex items-end justify-center gap-0.5 h-3.5 w-4">
                              <span className="w-1 bg-[#D49A32] rounded-t eq-bar-1"></span>
                              <span className="w-1 bg-[#F5E6C8] rounded-t eq-bar-2"></span>
                              <span className="w-1 bg-[#C87925] rounded-t eq-bar-3"></span>
                            </div>
                          ) : (
                            <Play className="w-3.5 h-3.5 text-[#D49A32] fill-current ml-0.5" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* SONG TITLE & MOVIE */}
                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className={`text-xs sm:text-sm font-semibold truncate ${isActive ? 'text-[#D49A32] font-bold' : 'text-[#F5E6C8] group-hover:text-white'}`}>
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[11px] text-stone-400 truncate">
                          {song.movie}
                        </span>
                        {song.year && (
                          <span className="text-[9px] font-mono px-1 rounded bg-[#D49A32]/10 border border-[#D49A32]/20 text-[#D49A32] shrink-0">
                            {song.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DURATION, LIKE & PLAY BUTTON (44px touch targets) */}
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-stone-400 hidden xs:inline">
                      {song.duration}
                    </span>

                    {/* FAVORITE BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className="w-9 h-9 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full flex items-center justify-center transition-transform active:scale-125"
                      title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                      aria-label="Toggle Favorite"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-stone-500 hover:text-rose-400'}`} />
                    </button>

                    {/* PLAY / PAUSE BUTTON */}
                    <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive && isPlaying
                        ? 'bg-[#D49A32] text-black shadow-md shadow-[#D49A32]/40'
                        : 'bg-[#D49A32]/15 text-[#D49A32] group-hover:bg-[#D49A32] group-hover:text-black'
                    }`}>
                      {isActive && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-2.5 border-t border-[#F5E6C8]/15 flex items-center justify-between text-[11px] sm:text-xs text-stone-400 flex-shrink-0">
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
