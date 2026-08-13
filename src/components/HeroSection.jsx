import React from 'react';
import { Play, Pause, Disc, Sparkles, Music, Award, Radio } from 'lucide-react';
import VisualizerCanvas from './VisualizerCanvas';

export default function HeroSection({
  currentTrack,
  isPlaying,
  userInteracted,
  onTogglePlayPause,
  analyser,
  onOpenPlaylist
}) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
      
      {/* RICH USER ARTWORK BACKGROUND OVERLAY WITH GRADIENT VIGNETTE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/hero-bg.jpg"
          alt="Kishore Kumar Greatest Hits Master Collage"
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-90 saturate-125 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B] via-[#120E0B]/60 to-[#120E0B]/80"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#120E0B]/50 to-[#120E0B]"></div>
      </div>

      {/* TOP DECORATIVE VINTAGE EMBLEM */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 text-xs tracking-widest text-[#F5E6C8]/70 uppercase font-mono">
          <span className="w-8 h-[1px] bg-[#D49A32]"></span>
          <span>Golden Era Bollywood • 1946–1987</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#D49A32] bg-[#111111]/40 px-3 py-1 rounded-full border border-[#D49A32]/20">
          <Award className="w-3.5 h-3.5" />
          <span>8x Filmfare Winner</span>
        </div>
      </div>

      {/* CENTER HERO CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* LEFT COLUMN: VINTAGE POSTER TYPOGRAPHY */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111111]/70 border border-[#D49A32]/30 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D49A32]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D49A32]">
              THE VOICE OF AN ERA
            </span>
          </div>

          {/* Dual Hindi & English Typography */}
          <div className="space-y-1">
            <h2 className="font-['Rozha_One'] text-4xl sm:text-5xl lg:text-6xl text-[#F5E6C8] tracking-wider leading-tight opacity-90">
              किशोर कुमार
            </h2>
            <h1 className="font-['Playfair_Display'] text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
              KISHORE <span className="gold-gradient-text">KUMAR</span>
            </h1>
          </div>

          {/* Supporting Tagline */}
          <p className="text-base sm:text-xl font-light text-[#F5E6C8]/85 max-w-xl italic leading-relaxed">
            "Timeless songs. Unforgettable memories."
          </p>

          {/* Animated Waveform & Quick Track Pill */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3">
              <VisualizerCanvas analyser={analyser} isPlaying={isPlaying} />
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D49A32]">
                {isPlaying ? 'Currently Playing' : 'Featured Track'}
              </span>
              <span className="text-sm font-semibold text-[#F5E6C8] truncate max-w-[220px]">
                {currentTrack.title}
              </span>
              <span className="text-xs text-stone-400">
                {currentTrack.movie}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CIRCULAR PROMINENT HERO PLAY BUTTON & VINYL BADGE */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center pt-6 lg:pt-0">
          
          <div className="relative group flex items-center justify-center">
            
            {/* Outer Rotating Vinyl Ring Accent */}
            <div className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-[#D49A32]/40 absolute flex items-center justify-center ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-[#F5E6C8]/10"></div>
            </div>

            {/* Glowing Backdrop Pulse */}
            <div className="absolute inset-0 bg-[#D49A32]/20 rounded-full blur-2xl group-hover:bg-[#D49A32]/35 transition-all duration-500"></div>

            {/* MAIN PROMINENT PLAY BUTTON */}
            <button
              onClick={onTogglePlayPause}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#D49A32] via-[#C87925] to-[#241812] p-1 shadow-2xl group-hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#D49A32]/50 flex items-center justify-center"
              aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              <div className="w-full h-full bg-[#16100C] rounded-full flex flex-col items-center justify-center gap-1 group-hover:bg-[#1A120D] transition-colors border border-[#F5E6C8]/20">
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-[#F5E6C8] fill-[#F5E6C8] animate-pulse" />
                ) : (
                  <Play className="w-12 h-12 text-[#F5E6C8] fill-[#F5E6C8] ml-2 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[11px] font-bold tracking-widest text-[#D49A32] uppercase font-mono mt-1">
                  {isPlaying ? 'PAUSE' : 'PLAY NOW'}
                </span>
              </div>
            </button>
          </div>

          {/* Status Label beneath button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onOpenPlaylist}
              className="glass-pill px-5 py-2 text-xs font-semibold tracking-wider text-[#F5E6C8] hover:text-[#D49A32] hover:border-[#D49A32]/50 transition-all flex items-center gap-2"
            >
              <Disc className={`w-4 h-4 text-[#D49A32] ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{!userInteracted ? '● Click Play to Start Experience' : isPlaying ? '● Now Playing Radio' : '● Paused — Click to Resume'}</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}

