import { useState, useEffect, useRef, useCallback } from 'react';
import { playlist } from '../data/playlist';

const FAVORITES_STORAGE_KEY = 'kishore-favorites';
const LAST_TRACK_STORAGE_KEY = 'kishore-last-track-index';
const LAST_POSITION_STORAGE_KEY = 'kishore-last-track-position';

export function useAudioPlayer() {
  // Restore last played track index from localStorage (default 0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    try {
      const stored = localStorage.getItem(LAST_TRACK_STORAGE_KEY);
      if (stored !== null) {
        const idx = parseInt(stored, 10);
        if (!isNaN(idx) && idx >= 0 && idx < playlist.length) {
          return idx;
        }
      }
    } catch (e) {}
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Restore last played timestamp from localStorage
  const [currentTime, setCurrentTime] = useState(() => {
    try {
      const stored = localStorage.getItem(LAST_POSITION_STORAGE_KEY);
      if (stored !== null) {
        const pos = parseFloat(stored);
        if (!isNaN(pos) && pos >= 0) {
          return pos;
        }
      }
    } catch (e) {}
    return 0;
  });

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('playlist'); // 'off' | 'track' | 'playlist'
  const [audioError, setAudioError] = useState(null);

  // Save currentTrackIndex to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LAST_TRACK_STORAGE_KEY, currentTrackIndex.toString());
    } catch (e) {}
  }, [currentTrackIndex]);

  // Favorites stored in localStorage under 'kishore-favorites'
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [playlist[0]?.id || 'roop-tera-mastana'];
    } catch (e) {
      return [playlist[0]?.id || 'roop-tera-mastana'];
    }
  });

  const [userInteracted, setUserInteracted] = useState(false);
  
  // Single Audio object instance
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Initialize HTML5 Audio Element ONCE
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata'; // Performance: only load metadata into memory
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      const curTime = audio.currentTime || 0;
      setCurrentTime(curTime);
      try {
        localStorage.setItem(LAST_POSITION_STORAGE_KEY, curTime.toString());
      } catch (e) {}
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 200);
      setAudioError(null);

      // Restore saved playback position if available
      try {
        const storedPos = localStorage.getItem(LAST_POSITION_STORAGE_KEY);
        if (storedPos !== null) {
          const pos = parseFloat(storedPos);
          if (!isNaN(pos) && pos > 0 && pos < audio.duration) {
            audio.currentTime = pos;
          }
        }
      } catch (e) {}
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = (e) => {
      const trackName = playlist[currentTrackIndex]?.title || 'Selected Track';
      console.error(`[Audio Manager] File unavailable: ${playlist[currentTrackIndex]?.audio}`, e);
      setAudioError(`Audio file unavailable: "${trackName}"`);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update track source when currentTrackIndex changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    
    audio.pause();
    audio.src = currentTrack.audio;
    audio.preload = 'metadata';
    audio.volume = isMuted ? 0 : volume;
    setCurrentTime(0);
    setAudioError(null);

    // Preload next track metadata for fast transitions
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack && nextTrack.audio) {
      const nextPreload = new Audio();
      nextPreload.src = nextTrack.audio;
      nextPreload.preload = 'metadata';
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio Manager] Playback deferred or file missing:', err.message);
        });
      }
    }
  }, [currentTrackIndex]);

  // Volume & Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Save Favorites to localStorage
  const toggleFavorite = useCallback((songId) => {
    setFavorites((prev) => {
      const updated = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage error:', e);
      }
      return updated;
    });
  }, []);

  // Setup Web Audio Analyser
  const setupAudioContext = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      
      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
      }

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch (err) {
      console.warn("Web Audio API info:", err.message);
    }
  }, []);

  // Play / Pause Toggle
  const togglePlayPause = useCallback(() => {
    setUserInteracted(true);
    setupAudioContext();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioError(null);
          })
          .catch((err) => {
            console.error('[Audio Manager] Play error:', err);
            setAudioError(`Audio file unavailable: "${currentTrack.title}"`);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentTrack, setupAudioContext]);

  // Play specific track index
  const playTrack = useCallback((index) => {
    setUserInteracted(true);
    setupAudioContext();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, [setupAudioContext]);

  // Next Track Logic (Handles Shuffle & Repeat modes)
  const handleNextTrack = useCallback(() => {
    if (repeatMode === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * playlist.length);
      if (randomIndex === currentTrackIndex && playlist.length > 1) {
        randomIndex = (currentTrackIndex + 1) % playlist.length;
      }
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
  }, [repeatMode, isShuffle, currentTrackIndex]);

  // Previous Track Logic
  const handlePreviousTrack = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [currentTime]);

  // Seek
  const seekTo = useCallback((seconds) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const clampedTime = Math.max(0, Math.min(seconds, audio.duration || Infinity));
    
    // readyState >= 1 means metadata is loaded and seeking is safe
    if (audio.readyState >= 1) {
      try {
        audio.currentTime = clampedTime;
      } catch (e) {
        // Some browsers throw on invalid seeks — ignore
      }
    } else {
      // Audio not ready yet — wait for metadata then seek
      const onReady = () => {
        try {
          audio.currentTime = Math.min(clampedTime, audio.duration || clampedTime);
        } catch (e) {}
        audio.removeEventListener('loadedmetadata', onReady);
      };
      audio.addEventListener('loadedmetadata', onReady);
    }
    setCurrentTime(clampedTime);
  }, []);

  // Set Volume
  const setVolumeLevel = useCallback((val) => {
    setVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  // Toggle Repeat Mode ('off' -> 'playlist' -> 'track' -> 'off')
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'playlist';
      if (prev === 'playlist') return 'track';
      return 'off';
    });
  }, []);

  return {
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
    analyser: analyserRef.current,
    togglePlayPause,
    playTrack,
    nextTrack: handleNextTrack,
    previousTrack: handlePreviousTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite
  };
}
