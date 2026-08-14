import React, { useState, useEffect } from 'react';
import { Search, ListMusic, Radio, Maximize, Minimize, Share2 } from 'lucide-react';
import VisualizerCanvas from './VisualizerCanvas';

export default function Navbar({
  isPlaying,
  userInteracted,
  analyser,
  onOpenPlaylist,
  onOpenSearch,
  onShowToast
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
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Kishore Kumar - Golden Era Radio',
      text: 'Listen to timeless songs & vinyl player dedicated to Kishore Kumar!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      if (onShowToast) onShowToast('✨ Link copied to clipboard!');
    } catch (e) {
      if (onShowToast) onShowToast('✨ Share: ' + window.location.href);
    }
  };

  const getStatusText = () => {
    if (!userInteracted) return { label: 'READY', class: 'status-dot-ready' };
    if (isPlaying) return { label: 'PLAYING', class: 'status-dot-active' };
    return { label: 'PAUSED', class: 'status-dot-paused' };
  };

  const status = getStatusText();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill px-3.5 sm:px-5 py-2 sm:py-2.5 pointer-events-auto shadow-xl">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#D49A32] to-[#C87925] p-0.5 shadow-md">
            <div className="w-full h-full bg-[#1A120B] rounded-full flex items-center justify-center">
              <Radio className={`w-4 h-4 text-[#D49A32] ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div>
            <div className="font-['Playfair_Display'] text-sm sm:text-lg font-black tracking-wider text-[#F5E6C8] flex items-center gap-1">
              <span>KISHORE</span>
              <span className="text-[#D49A32] font-normal text-xs sm:text-sm tracking-widest font-sans uppercase">RADIO</span>
            </div>
          </div>
        </div>

        {/* CENTER LIVE CANVAS VISUALIZER / STATUS (Adaptive) */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1 rounded-full bg-[#111111]/70 border border-[#F5E6C8]/15 shadow-inner max-w-xs w-64 h-8">
          <span className={status.class}></span>
          <div className="flex-1 h-6">
            <VisualizerCanvas analyser={analyser} isPlaying={isPlaying} height={24} barCount={20} />
          </div>
        </div>

        {/* RIGHT ACTION BUTTONS (44px touch targets) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* SEARCH BUTTON */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full text-[#F5E6C8]/90 hover:text-[#D49A32] hover:bg-[#F5E6C8]/10 flex items-center justify-center transition-all active:scale-90"
            title="Search Songs (F)"
            aria-label="Search Songs"
          >
            <Search className="w-4.5 h-4.5 text-[#D49A32]" />
          </button>

          {/* MOBILE SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="sm:hidden w-9 h-9 min-w-[36px] min-h-[36px] rounded-full text-[#F5E6C8]/90 hover:text-[#D49A32] hover:bg-[#F5E6C8]/10 flex items-center justify-center transition-all active:scale-90"
            title="Share Website"
            aria-label="Share Website"
          >
            <Share2 className="w-4 h-4 text-[#D49A32]" />
          </button>

          {/* PLAYLIST BUTTON */}
          <button
            onClick={onOpenPlaylist}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[40px] rounded-full bg-gradient-to-r from-[#D49A32]/25 to-[#C87925]/35 border border-[#D49A32]/40 text-[#F5E6C8] hover:border-[#D49A32] active:scale-95 transition-all text-xs font-medium"
            title="Open Playlist (P)"
            aria-label="Open Playlist"
          >
            <ListMusic className="w-4 h-4 text-[#D49A32]" />
            <span className="font-semibold text-xs">Playlist</span>
          </button>

          {/* FULLSCREEN BUTTON (Desktop) */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-9 h-9 min-w-[40px] min-h-[40px] rounded-full items-center justify-center bg-[#111]/60 text-[#F5E6C8]/90 hover:text-white border border-[#F5E6C8]/20 hover:border-[#D49A32] active:scale-90 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
