import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  ListMusic,
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function FloatingPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  favorites = [],
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onToggleMute,
  onOpenPlaylist
}) {
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeStr = formatTime(duration || currentTrack?.durationSec || 225);
  const currentTimeStr = formatTime(currentTime);
  const isFav = currentTrack ? favorites.includes(currentTrack.id) : false;

  // Pointer-based seeking with drag support, touch-action: none, and pointer capture
  const progressRef = useRef(null);
  const activeSeekElRef = useRef(null);
  const draggingRef = useRef(false);

  const seekAtEvent = (clientX) => {
    const el = activeSeekElRef.current || progressRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    const maxDuration = duration || currentTrack?.durationSec || 200;
    const newTime = pct * maxDuration;
    onSeek(newTime);
  };

  const handlePointerDown = (e) => {
    try {
      e.preventDefault();
      activeSeekElRef.current = e.currentTarget;
      if (e.currentTarget && e.pointerId != null && e.currentTarget.setPointerCapture) {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
      }
      draggingRef.current = true;
      seekAtEvent(e.clientX);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } catch (err) {
      // ignore
    }
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    seekAtEvent(e.clientX);
  };

  const handlePointerUp = (e) => {
    try {
      draggingRef.current = false;
      if (activeSeekElRef.current && e?.pointerId != null && activeSeekElRef.current.releasePointerCapture) {
        try { activeSeekElRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      activeSeekElRef.current = null;
    } finally {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <aside
      aria-label="Audio Player"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.25rem)] sm:w-[94%] max-w-3xl transition-all duration-300 pointer-events-auto"
    >
      {/* PILL SHAPED GLASS CONTAINER */}
      <div className="glass-panel px-3 py-2 sm:px-5 sm:py-3 md:px-7 md:py-3.5 rounded-[24px] sm:rounded-[36px] md:rounded-[40px] shadow-2xl border border-white/20 bg-black/55 backdrop-blur-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-4 md:gap-6">
        
        {/* SECTION 1: ALBUM ART + TRACK INFO + INLINE SEEK (DESKTOP) / HEADER (MOBILE) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 min-w-0 flex-1">
          
          {/* Circular Vinyl Cover */}
          <div
            onClick={onOpenPlaylist}
            className="relative flex-shrink-0 cursor-pointer group select-none touch-manipulation"
            title="Click to view playlist"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-white/30 overflow-hidden shadow-lg bg-black/60 transition-transform ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
              <img
                src={currentTrack?.cover}
                alt={currentTrack?.title || 'Kishore Kumar Song'}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23fff' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                }}
              />
            </div>
            {/* Center vinyl center hole */}
            <div className="absolute inset-0 m-auto w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black border border-white/60"></div>
          </div>

          {/* Song Meta + Desktop Seek bar */}
          <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide truncate font-sans">
                {currentTrack?.title || 'Selected Track'}
              </h4>
              {/* Mobile Favorite button inline */}
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(currentTrack?.id)}
                className="sm:hidden p-1.5 text-stone-400 hover:text-rose-500 active:scale-125 transition-transform"
                title={isFav ? "Remove Favorite" : "Add to Favorites"}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-white/70 truncate font-medium">
              {currentTrack?.movie ? `${currentTrack.movie} • ${currentTrack.artist}` : currentTrack?.artist}
            </p>

            {/* PROGRESS BAR (Shown on Tablet / Desktop in column) */}
            <div className="hidden sm:block">
              <div
                ref={progressRef}
                style={{ touchAction: 'none' }}
                className="relative w-full py-2 cursor-pointer group flex items-center select-none"
                onPointerDown={handlePointerDown}
              >
                {/* Track background line */}
                <div className="w-full h-1.5 group-hover:h-2 bg-white/20 group-hover:bg-white/30 rounded-full transition-all overflow-hidden relative">
                  {/* Filled progress bar */}
                  <div
                    className="h-full bg-gradient-to-r from-[#D49A32] via-[#E8B85C] to-[#F5E6C8] rounded-full transition-[width] duration-75"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* Glowing Seek Knob / Thumb Indicator */}
                <div
                  className="absolute w-3.5 h-3.5 rounded-full bg-[#F5E6C8] border-2 border-[#D49A32] shadow-md shadow-[#D49A32]/60 pointer-events-none transform -translate-x-1/2 transition-opacity opacity-90 group-hover:opacity-100 group-hover:scale-125"
                  style={{ left: `${progressPercent}%` }}
                ></div>
              </div>

              {/* TIMESTAMPS: 0:01 / 5:14 */}
              <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#F5E6C8]/75 tracking-wider flex items-center justify-between -mt-1">
                <span>{currentTimeStr}</span>
                <span>{totalTimeStr}</span>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE FULL-WIDTH PROGRESS BAR */}
        <div className="block sm:hidden w-full px-0.5">
          <div
            style={{ touchAction: 'none' }}
            className="relative w-full py-2 cursor-pointer group flex items-center select-none"
            onPointerDown={handlePointerDown}
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#D49A32] via-[#E8B85C] to-[#F5E6C8] rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-[#F5E6C8] border-2 border-[#D49A32] shadow-md shadow-[#D49A32]/60 pointer-events-none transform -translate-x-1/2"
              style={{ left: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-[10px] font-mono font-semibold text-[#F5E6C8]/75 flex items-center justify-between -mt-1 px-0.5">
            <span>{currentTimeStr}</span>
            <span>{totalTimeStr}</span>
          </div>
        </div>

        {/* SECTION 2: CONTROLS (SHUFFLE, PREV, PLAY/PAUSE, NEXT, DRAWER, MUTE) */}
        <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 md:gap-3 flex-shrink-0 pt-0.5 sm:pt-0">
          
          {/* Shuffle Toggle */}
          <button
            onClick={onToggleShuffle}
            className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isShuffle ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
            aria-label="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevious}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            title="Previous Track"
            aria-label="Previous Track"
          >
            <SkipBack className="w-4.5 h-4.5 fill-current" />
          </button>

          {/* MAIN SOLID WHITE CIRCULAR PLAY / PAUSE BUTTON */}
          <button
            onClick={onTogglePlayPause}
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 min-w-[40px] min-h-[40px] rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            title="Next Track"
            aria-label="Next Track"
          >
            <SkipForward className="w-4.5 h-4.5 fill-current" />
          </button>

          {/* Desktop Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(currentTrack?.id)}
            className="hidden sm:flex min-w-[44px] min-h-[44px] rounded-full items-center justify-center text-white/80 hover:text-rose-400 hover:bg-white/10 active:scale-90 transition-all"
            title={isFav ? "Remove Favorite" : "Add to Favorites"}
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Mute Toggle Button */}
          <button
            onClick={onToggleMute}
            className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isMuted ? 'text-amber-400 bg-amber-400/20' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={isMuted ? "Unmute" : "Mute"}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Playlist Drawer Toggle Button */}
          <button
            onClick={onOpenPlaylist}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            title="Open Playlist"
            aria-label="Open Playlist Drawer"
          >
            <ListMusic className="w-4.5 h-4.5 text-[#D49A32]" />
          </button>

        </div>

      </div>

    </aside>
  );
}
