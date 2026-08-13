import React, { useState, useEffect } from 'react';
import { Search, ListMusic, Radio, Maximize, Minimize } from 'lucide-react';

export default function Navbar({
  isPlaying,
  userInteracted,
  onOpenPlaylist,
  onOpenSearch
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => console.log(err));
      }
    }
  };

  const getStatusText = () => {
    if (!userInteracted) return { label: 'READY TO PLAY', class: 'status-dot-ready' };
    if (isPlaying) return { label: 'NOW PLAYING', class: 'status-dot-active' };
    return { label: 'PAUSED', class: 'status-dot-paused' };
  };

  const status = getStatusText();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill px-5 py-2.5">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D49A32] to-[#C87925] p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#1A120B] rounded-full flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#D49A32] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-['Playfair_Display'] text-xl font-black tracking-wider text-[#F5E6C8] flex items-center gap-1.5">
              <span>KISHORE</span>
              <span className="text-[#D49A32] font-normal text-sm tracking-widest font-sans uppercase">KUMAR</span>
            </div>
            <p className="text-[10px] text-amber-200/60 tracking-widest uppercase font-mono">
              Digital Vinyl Radio
            </p>
          </div>
        </div>

        {/* CENTER STATUS INDICATOR PILL */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111111]/60 border border-[#F5E6C8]/15 shadow-inner">
          <span className={status.class}></span>
          <span className="text-xs font-semibold tracking-wider text-[#F5E6C8] font-mono">
            {status.label}
          </span>
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {/* FULL SCREEN TOGGLE BUTTON */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
              isFullscreen
                ? 'bg-gradient-to-r from-[#D49A32] to-[#C87925] text-white border-[#F5E6C8]/50 shadow-lg shadow-[#D49A32]/40'
                : 'bg-[#111]/50 text-[#F5E6C8]/90 hover:text-white border-[#F5E6C8]/20 hover:border-[#D49A32]'
            }`}
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-[#F5E6C8]/80 hover:text-[#D49A32] hover:bg-[#F5E6C8]/10 transition-all"
            title="Search Songs"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPlaylist}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D49A32]/20 to-[#C87925]/30 border border-[#D49A32]/40 text-[#F5E6C8] hover:border-[#D49A32] transition-all text-xs font-medium"
            title="Open Playlist"
          >
            <ListMusic className="w-4 h-4 text-[#D49A32]" />
            <span className="hidden sm:inline">Playlist</span>
          </button>
        </div>
      </div>
    </header>
  );
}
