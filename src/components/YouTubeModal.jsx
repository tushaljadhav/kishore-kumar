import React from 'react';
import { X, Youtube } from 'lucide-react';

export default function YouTubeModal({ isOpen, onClose, currentTrack }) {
  if (!isOpen || !currentTrack) return null;

  const videoId = currentTrack.youtubeId || 'yIzCBU0_LyY';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-panel p-6 rounded-3xl border border-[#D49A32]/40 shadow-2xl space-y-4 relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F5E6C8] font-['Playfair_Display']">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-stone-400">
                {currentTrack.movie} ({currentTrack.year}) • Kishore Kumar YouTube Original
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* YOUTUBE IFRAME EMBED */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={currentTrack.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-white/10">
          <span>Official Music Video Embed</span>
          <span className="text-[#D49A32] font-mono">Kishore Kumar Radio</span>
        </div>

      </div>
    </div>
  );
}
