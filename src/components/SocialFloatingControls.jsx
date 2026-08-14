import React, { useState, useEffect } from 'react';
import { Share2, Maximize, Minimize, Instagram } from 'lucide-react';

export default function SocialFloatingControls({
  onShowToast,
  instagramUrl = "https://www.instagram.com/tushal_jadhav_123/?hl=en"
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
      onShowToast('✨ Link copied to clipboard!');
    } catch (e) {
      onShowToast('✨ Share: ' + window.location.href);
    }
  };

  return (
    <>
      {/* MOBILE TOP FLOATING CONTROLS (SHARE & INSTAGRAM) */}
      <div className="flex sm:hidden fixed top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 z-40 items-center justify-between pointer-events-none">
        {/* MOBILE SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="pointer-events-auto glass-pill px-3.5 py-2 text-xs font-semibold text-[#F5E6C8] hover:text-[#D49A32] border border-[#F5E6C8]/25 hover:border-[#D49A32] flex items-center gap-1.5 shadow-xl transition-all active:scale-90"
          title="Share website"
          aria-label="Share Website"
        >
          <Share2 className="w-3.5 h-3.5 text-[#D49A32]" />
          <span className="tracking-wide">Share</span>
        </button>

        {/* MOBILE INSTAGRAM BUTTON */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto glass-pill px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] border border-white/30 flex items-center gap-1.5 shadow-xl shadow-red-500/20 active:scale-90 transition-transform"
          title="Open Instagram Profile"
          aria-label="Instagram Profile"
        >
          <Instagram className="w-3.5 h-3.5 text-white" />
          <span className="tracking-wide">Instagram</span>
        </a>
      </div>

      {/* DESKTOP BOTTOM-LEFT FLOATING CONTROLS (SHARE & FULLSCREEN) */}
      <div className="hidden sm:flex fixed bottom-6 left-6 z-40 items-center gap-2 pointer-events-auto">
        {/* SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="glass-pill px-4 py-2.5 text-xs font-semibold text-[#F5E6C8] hover:text-[#D49A32] border border-[#F5E6C8]/20 hover:border-[#D49A32] flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 group"
          title="Share website with friends"
          aria-label="Share Website"
        >
          <Share2 className="w-4 h-4 text-[#D49A32] group-hover:rotate-12 transition-transform" />
          <span>Share</span>
        </button>

        {/* FULL SCREEN TOGGLE FLOATING BUTTON */}
        <button
          onClick={toggleFullscreen}
          className={`glass-pill px-3.5 py-2.5 text-xs font-bold border flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 ${
            isFullscreen
              ? 'bg-gradient-to-r from-[#D49A32] to-[#C87925] text-white border-[#F5E6C8]/50 shadow-lg shadow-[#D49A32]/40'
              : 'text-[#F5E6C8] hover:text-[#D49A32] border-[#F5E6C8]/20 hover:border-[#D49A32]'
          }`}
          title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-[#D49A32]" />}
          <span className="hidden md:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
        </button>
      </div>

      {/* DESKTOP BOTTOM-RIGHT FLOATING INSTAGRAM BUTTON */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40 pointer-events-auto">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:brightness-110 border border-white/30 flex items-center gap-2 shadow-xl shadow-red-500/25 transition-all hover:scale-105 active:scale-95 group"
          title="Open Instagram Profile"
          aria-label="Instagram Profile"
        >
          <Instagram className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Instagram</span>
        </a>
      </div>
    </>
  );
}
