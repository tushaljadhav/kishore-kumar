import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  ListMusic
} from 'lucide-react';

export default function FloatingPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  isShuffle,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onToggleShuffle,
  onOpenPlaylist
}) {
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeStr = formatTime(duration || currentTrack.durationSec || 225);
  const currentTimeStr = formatTime(currentTime);

  // Improved pointer-based seeking with drag support and pointer capture
  const progressRef = useRef(null);
  const draggingRef = useRef(false);

  const seekAtEvent = (clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    const maxDuration = duration || currentTrack.durationSec || 200;
    const newTime = pct * maxDuration;
    onSeek(newTime);
  };

  const handlePointerDown = (e) => {
    try {
      e.preventDefault();
      if (progressRef.current && e.pointerId != null && progressRef.current.setPointerCapture) {
        progressRef.current.setPointerCapture(e.pointerId);
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
      if (progressRef.current && e.pointerId != null && progressRef.current.releasePointerCapture) {
        try { progressRef.current.releasePointerCapture(e.pointerId); } catch(_) {}
      }
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

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[95%] max-w-3xl transition-all duration-300">
      
      {/* PILL SHAPED GLASS CONTAINER */}
      <div className="glass-panel px-3 py-2.5 sm:px-5 sm:py-3.5 md:px-7 md:py-4 rounded-[28px] sm:rounded-[40px] shadow-2xl border border-white/20 bg-black/40 backdrop-blur-2xl flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        
        {/* LEFT SECTION: CIRCULAR ALBUM COVER + TITLE + PROGRESS BAR + TIMESTAMPS */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          
          {/* Circular Vinyl Cover */}
          <div
            onClick={onOpenPlaylist}
            className="relative flex-shrink-0 cursor-pointer group"
            title="Click to view playlist"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border border-white/30 overflow-hidden shadow-lg bg-black/60 transition-transform ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23fff' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23D49A32'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23111'/%3E%3C/svg%3E";
                }}
              />
            </div>
            {/* Center vinyl pin */}
            <div className="absolute inset-0 m-auto w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black border border-white/60"></div>
          </div>

          {/* Song Meta + Inline Progress Bar + Timestamp */}
          <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
            <h4 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide truncate font-sans">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/75 truncate font-medium">
              {currentTrack.artist}
            </p>

            {/* PROGRESS BAR WITH CLICK + DRAG SUPPORT */}
            <div
              ref={progressRef}
              style={{ touchAction: 'none' }}
              className="relative w-full py-3 cursor-pointer group flex items-center select-none my-0.5"
              onPointerDown={handlePointerDown}
            >
              {/* Track background line */}
              <div className="w-full h-1.5 group-hover:h-2.5 bg-white/20 group-hover:bg-white/30 rounded-full transition-all overflow-hidden relative">
                {/* Filled progress bar */}
                <div
                  className="h-full bg-gradient-to-r from-[#D49A32] via-[#E8B85C] to-[#F5E6C8] rounded-full transition-[width] duration-100"
                  style={{ width: `${duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0}%` }}
                ></div>
              </div>

              {/* Glowing Seek Knob / Thumb Indicator */}
              <div
                className="absolute w-4 h-4 rounded-full bg-[#F5E6C8] border-2 border-[#D49A32] shadow-lg shadow-[#D49A32]/60 pointer-events-none transform -translate-x-1/2 transition-opacity opacity-80 group-hover:opacity-100 group-hover:scale-125"
                style={{ left: `${duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0}%` }}
              ></div>
            </div>

            {/* TIMESTAMPS: 0:01 / 5:14 */}
            <div className="text-[11px] font-sans font-semibold text-[#F5E6C8]/80 tracking-wider flex items-center justify-between">
              <span>{currentTimeStr}</span>
              <span>{totalTimeStr}</span>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION: CONTROLS (SHUFFLE BUBBLE, PREV, WHITE SOLID PLAY CIRCLE, NEXT, PLAYLIST) */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          
          {/* Shuffle Button in Translucent Glass Bubble */}
          <button
            onClick={onToggleShuffle}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
              isShuffle ? 'bg-white text-black shadow-md' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
            title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevious}
            className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* MAIN SOLID WHITE CIRCULAR PLAY / PAUSE BUTTON */}
          <button
            onClick={onTogglePlayPause}
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current text-black ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Playlist Drawer Button */}
          <button
            onClick={onOpenPlaylist}
            className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
            title="Open Playlist"
          >
            <ListMusic className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
}
