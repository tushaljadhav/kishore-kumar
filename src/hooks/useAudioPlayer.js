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

  // Restore last played timestamp from localStorage (only for initial state)
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
  const [userInteracted, setUserInteracted] = useState(false);

  // Favorites stored in localStorage under 'kishore-favorites'
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [playlist[0]?.id || 'roop-tera-mastana'];
    } catch (e) {
      return [playlist[0]?.id || 'roop-tera-mastana'];
    }
  });

  // Single Audio object instance and Web Audio API refs
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  // State synchronization refs to prevent stale closures in audio event listeners
  const currentTrackIndexRef = useRef(currentTrackIndex);
  const isPlayingRef = useRef(isPlaying);
  const repeatModeRef = useRef(repeatMode);
  const isShuffleRef = useRef(isShuffle);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  // Guard ref so saved position from previous song is ONLY restored on initial page load, NEVER on track changes
  const initialPositionRestoredRef = useRef(false);

  // Keep refs synchronized with state on every render
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
    try {
      localStorage.setItem(LAST_TRACK_STORAGE_KEY, currentTrackIndex.toString());
    } catch (e) {}
  }, [currentTrackIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : volume;
    }
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volumeRef.current;
    }
  }, [isMuted]);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Callback refs to break stale closure in permanent event listeners
  const handleEndedRef = useRef(null);
  const handleLoadedMetadataRef = useRef(null);
  const handleTimeUpdateRef = useRef(null);
  const handleErrorRef = useRef(null);

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
      console.warn('[Audio Manager] Web Audio API info:', err.message);
    }
  }, []);

  // Core track switcher: updates src, resets position, and immediately initiates playback
  const changeTrack = useCallback((newIndex, shouldPlay = true) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (newIndex < 0 || newIndex >= playlist.length) {
      console.warn(`[Audio Player] Invalid track index: ${newIndex}`);
      return;
    }

    const nextTrack = playlist[newIndex];
    console.log(`[Audio Player] 2. next index calculated: ${newIndex} ("${nextTrack.title}")`);

    currentTrackIndexRef.current = newIndex;
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
    setAudioError(null);

    try {
      localStorage.setItem(LAST_POSITION_STORAGE_KEY, '0');
    } catch (e) {}

    audio.pause();
    audio.currentTime = 0;
    audio.src = nextTrack.audio;
    audio.preload = 'auto';
    audio.load();
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    console.log(`[Audio Player] 3. src set to: ${nextTrack.audio}`);

    // Preload next track metadata for instantaneous transition on next switch
    const aheadIndex = (newIndex + 1) % playlist.length;
    const aheadTrack = playlist[aheadIndex];
    if (aheadTrack && aheadTrack.audio) {
      const preload = new Audio();
      preload.src = aheadTrack.audio;
      preload.preload = 'metadata';
    }

    if (shouldPlay) {
      setupAudioContext();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      console.log('[Audio Player] 4. play() called');
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Audio Player] 5. play() resolved successfully');
            setIsPlaying(true);
            isPlayingRef.current = true;
            setAudioError(null);
          })
          .catch((err) => {
            // Ignore AbortError caused when user pauses or skips while loading
            if (err.name === 'AbortError') {
              console.log('[Audio Player] Play aborted by pause/skip action');
              return;
            }
            if (err.name === 'NotAllowedError') {
              console.warn('[Audio Player] Autoplay policy blocked.');
              setIsPlaying(false);
              isPlayingRef.current = false;
              return;
            }
            console.error('[Audio Player] 5. play() rejected:', err);
            setAudioError(`Audio file unavailable or blocked: "${nextTrack.title}"`);
            setIsPlaying(false);
            isPlayingRef.current = false;
          });
      } else {
        setIsPlaying(true);
        isPlayingRef.current = true;
      }
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [setupAudioContext]);

  // Audio 'ended' event handler
  const handleEnded = useCallback(() => {
    const curIdx = currentTrackIndexRef.current;
    const curTrack = playlist[curIdx] || playlist[0];
    console.log(`[Audio Player] 1. ended fired for track: "${curTrack.title}" (index: ${curIdx})`);

    const mode = repeatModeRef.current;
    const shuffle = isShuffleRef.current;

    // Single track repeat mode
    if (mode === 'track') {
      const audio = audioRef.current;
      if (audio) {
        console.log(`[Audio Player] Repeat track mode: replaying index ${curIdx}`);
        audio.currentTime = 0;
        console.log('[Audio Player] 4. play() called');
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('[Audio Player] 5. play() resolved successfully');
              setIsPlaying(true);
              isPlayingRef.current = true;
            })
            .catch((err) => {
              console.error('[Audio Player] 5. play() rejected:', err);
            });
        }
      }
      return;
    }

    // Repeat OFF mode and reached last track
    if (mode === 'off' && curIdx === playlist.length - 1) {
      console.log('[Audio Player] Playlist ended (repeat off)');
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Calculate next track index
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (nextIndex === curIdx && playlist.length > 1) {
        nextIndex = (curIdx + 1) % playlist.length;
      }
    } else {
      nextIndex = (curIdx + 1) % playlist.length;
    }

    changeTrack(nextIndex, true);
  }, [changeTrack]);

  // Audio 'loadedmetadata' event handler
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration || 200);
    setAudioError(null);

    // ONLY restore saved position on initial app load, NEVER during track transitions
    if (!initialPositionRestoredRef.current) {
      initialPositionRestoredRef.current = true;
      try {
        const storedPos = localStorage.getItem(LAST_POSITION_STORAGE_KEY);
        if (storedPos !== null) {
          const pos = parseFloat(storedPos);
          if (!isNaN(pos) && pos > 0 && pos < audio.duration) {
            audio.currentTime = pos;
            setCurrentTime(pos);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Audio 'timeupdate' event handler
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const curTime = audio.currentTime || 0;
    setCurrentTime(curTime);
    try {
      localStorage.setItem(LAST_POSITION_STORAGE_KEY, curTime.toString());
    } catch (e) {}
  }, []);

  // Audio 'error' event handler
  const handleError = useCallback((e) => {
    const audio = audioRef.current;
    if (audio && audio.error) {
      // code 1: MEDIA_ERR_ABORTED - fetching process aborted by user (pause, new load)
      if (audio.error.code === 1) return;
    }
    const curIdx = currentTrackIndexRef.current;
    const track = playlist[curIdx] || playlist[0];
    console.error(`[Audio Manager] Audio element error for "${track?.title}":`, e);
    setAudioError(`Audio file unavailable: "${track?.title}"`);
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // Keep callback refs updated with the latest function definitions on every render
  useEffect(() => {
    handleEndedRef.current = handleEnded;
    handleLoadedMetadataRef.current = handleLoadedMetadata;
    handleTimeUpdateRef.current = handleTimeUpdate;
    handleErrorRef.current = handleError;
  });

  // Initialize HTML5 Audio Element ONCE on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    };
    const onPause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };
    const onTimeUpdate = () => handleTimeUpdateRef.current?.();
    const onLoadedMetadata = () => handleLoadedMetadataRef.current?.();
    const onEnded = () => handleEndedRef.current?.();
    const onError = (e) => handleErrorRef.current?.(e);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    // Eagerly load initial track metadata
    const initialTrack = playlist[currentTrackIndexRef.current] || playlist[0];
    if (initialTrack && initialTrack.audio) {
      audio.src = initialTrack.audio;
      audio.load();
    }

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  // Bulletproof Play / Pause Toggle using audio.paused
  const togglePlayPause = useCallback(() => {
    setUserInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src || audio.src === '' || audio.src.endsWith('/')) {
      const curTrack = playlist[currentTrackIndexRef.current] || playlist[0];
      if (curTrack && curTrack.audio) {
        audio.src = curTrack.audio;
        audio.load();
      }
    }

    if (!audio.paused) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioError(null);
          })
          .catch((err) => {
            if (err.name === 'AbortError' || err.name === 'NotAllowedError') return;
            // Retry once with fresh load
            audio.load();
            audio.play().catch((e) => {
              if (e.name === 'AbortError' || e.name === 'NotAllowedError') return;
              const curIdx = currentTrackIndexRef.current;
              const track = playlist[curIdx] || playlist[0];
              setAudioError(`Audio playback failed: "${track?.title}"`);
            });
          });
      }
    }
  }, []);

  // Play specific track index or toggle play/pause if already active
  const playTrack = useCallback((index) => {
    setUserInteracted(true);
    if (index === currentTrackIndexRef.current && audioRef.current) {
      togglePlayPause();
      return;
    }
    changeTrack(index, true);
  }, [changeTrack, togglePlayPause]);

  // Next Track Logic
  const nextTrack = useCallback(() => {
    const curIdx = currentTrackIndexRef.current;
    let nextIndex;
    if (isShuffleRef.current) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (nextIndex === curIdx && playlist.length > 1) {
        nextIndex = (curIdx + 1) % playlist.length;
      }
    } else {
      nextIndex = (curIdx + 1) % playlist.length;
    }
    changeTrack(nextIndex, isPlayingRef.current || true);
  }, [changeTrack]);

  // Previous Track Logic
  const handlePreviousTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const curIdx = currentTrackIndexRef.current;
    const prevIndex = (curIdx - 1 + playlist.length) % playlist.length;
    changeTrack(prevIndex, isPlayingRef.current || true);
  }, [changeTrack]);

  // Seek to position
  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clampedTime = Math.max(0, Math.min(seconds, audio.duration || Infinity));
    
    if (audio.readyState >= 1) {
      try {
        audio.currentTime = clampedTime;
      } catch (e) {}
    } else {
      const onReady = () => {
        try {
          audio.currentTime = Math.min(clampedTime, audio.duration || clampedTime);
        } catch (e) {}
        audio.removeEventListener('loadedmetadata', onReady);
      };
      audio.addEventListener('loadedmetadata', onReady);
    }
    setCurrentTime(clampedTime);
    try {
      localStorage.setItem(LAST_POSITION_STORAGE_KEY, clampedTime.toString());
    } catch (e) {}
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

  // Save Favorites to localStorage
  const toggleFavorite = useCallback((songId) => {
    setFavorites((prev) => {
      const updated = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('[Audio Manager] localStorage error:', e);
      }
      return updated;
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
    nextTrack,
    previousTrack: handlePreviousTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite
  };
}
