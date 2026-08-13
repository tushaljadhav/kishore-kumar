import React, { useState, useEffect, useCallback } from 'react';
import FloatingPlayer from './components/FloatingPlayer';
import PlaylistDrawer from './components/PlaylistDrawer';
import SearchModal from './components/SearchModal';
import SocialFloatingControls from './components/SocialFloatingControls';
import { useAudioPlayer } from './hooks/useAudioPlayer';

export default function App() {
  const {
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    favorites,
    userInteracted,
    audioError,
    analyser,
    togglePlayPause,
    playTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite
  } = useAudioPlayer();

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Toast notifier
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Display toast when audio file is unavailable
  useEffect(() => {
    if (audioError) {
      showToast(`⚠️ ${audioError}`);
    }
  }, [audioError, showToast]);


  // Keyboard accessibility controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
        showToast(isPlaying ? '⏸️ Paused' : '▶️ Playing');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextTrack();
        showToast('⏭️ Next Track');
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        previousTrack();
        showToast('⏮️ Previous Track');
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
        showToast(isMuted ? '🔊 Unmuted' : '🔇 Muted');
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaylistOpen((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, nextTrack, previousTrack, toggleMute, isPlaying, isMuted, showToast]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-[#F5E6C8] selection:bg-[#D49A32] selection:text-black">
      
      {/* 1. STATIC FULLSCREEN KISHORE KUMAR ARTWORK COLLAGE BACKGROUND */}
      <div className="hero-background-wrapper">
        <img
          src="/assets/hero-bg.jpg"
          alt="Kishore Kumar Background Collage"
          className="hero-bg-img"
        />
      </div>


      {/* 4. FLOATING GLASS MUSIC PLAYER CARD AT BOTTOM */}
      <FloatingPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        favorites={favorites}
        analyser={analyser}
        onTogglePlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onSeek={seekTo}
        onSetVolume={setVolumeLevel}
        onToggleMute={toggleMute}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleFavorite={toggleFavorite}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
      />

      {/* 5. PLAYLIST DRAWER */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onPlayTrack={playTrack}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
      />

      {/* 7. SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPlayTrack={playTrack}
      />

      {/* 8. SHARE & INSTAGRAM FLOATING CONTROLS */}
      <SocialFloatingControls
        onShowToast={showToast}
        instagramUrl="https://www.instagram.com/tushal_jadhav_123/?hl=en"
      />

      {/* 9. TOAST NOTIFICATIONS */}
      {toastMessage && (
        <div className="toast-container animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="glass-pill px-5 py-2.5 text-xs font-semibold text-[#F5E6C8] border border-[#D49A32]/50 shadow-2xl flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
