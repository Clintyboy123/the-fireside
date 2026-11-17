import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from 'lucide-react';
import { tracks } from '../content/music';
import { easyEase } from '../utils/motion';

// The fireside soundtrack: a small player fixed bottom left.
// It starts by itself when the site loads, fading in. Browsers block sound until the
// visitor has interacted with the page, so if that first attempt is blocked, the music starts on the
// visitor's first click, tap or key press. A visitor who pauses it is remembered: no autoplay for them again.
// Play and pause fade the sound in and out; the volume is remembered for the next visit.

const STORE = 'fireside-volume';
const readVolume = () => {
  try {
    const v = parseFloat(localStorage.getItem(STORE));
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.5;
  } catch {
    return 0.5;
  }
};

const OFF = 'fireside-music-off';
const musicOff = () => {
  try {
    return localStorage.getItem(OFF) === '1';
  } catch {
    return false;
  }
};
const rememberOff = (off) => {
  try {
    if (off) localStorage.setItem(OFF, '1');
    else localStorage.removeItem(OFF);
  } catch {
    /* storage unavailable */
  }
};

const time = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

// Three bars that dance while music is playing.
function Bars({ playing, className = '' }) {
  return (
    <span className={`flex h-3.5 items-end gap-[3px] ${className}`} aria-hidden="true">
      {[0.9, 0.5, 0.75].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-[1px] bg-gold"
          initial={false}
          animate={playing ? { height: ['30%', '100%', '45%', '85%', '30%'] } : { height: `${h * 40}%` }}
          transition={playing ? { duration: 1.1 + i * 0.25, repeat: Infinity, ease: easyEase } : { duration: 0.4 }}
        />
      ))}
    </span>
  );
}

const iconButton = 'bevel flex size-11 items-center justify-center text-cream transition-colors duration-300 hover:text-gold';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(readVolume);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const target = muted ? 0 : volume;

  // Smoothly ramp the audio volume to a level, then run `done`.
  const fadeTo = useCallback((level, ms, done) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = t * t * (3 - 2 * t);
      audio.volume = from + (level - from) * eased;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  // Resolves true when the music is playing, false when the browser blocked it.
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    audio.volume = 0;
    return audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(target, 2000);
        return true;
      })
      .catch(() => {
        setPlaying(false);
        return false;
      });
  }, [fadeTo, target]);

  const pause = useCallback(() => {
    setPlaying(false);
    rememberOff(true);
    fadeTo(0, 450, () => audioRef.current?.pause());
  }, [fadeTo]);

  const toggle = () => {
    if (playing) return pause();
    rememberOff(false);
    return play();
  };

  // Autoplay: as soon as the site loads. If the browser blocks sound, wait for the visitor's first real
  // interaction (click, tap or key) and start then.
  const autoTried = useRef(false);
  useEffect(() => {
    if (autoTried.current || musicOff()) return undefined;
    autoTried.current = true;
    const events = ['pointerdown', 'keydown', 'touchend'];
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start, true));
      if (audioRef.current?.paused && !musicOff()) play();
    };
    play().then((ok) => {
      if (!ok) events.forEach((e) => window.addEventListener(e, start, true));
    });
    return () => events.forEach((e) => window.removeEventListener(e, start, true));
  }, [play]);

  const go = (step) => setIndex((i) => (i + step + tracks.length) % tracks.length);

  // Changing track: load it, and keep playing if we were.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const audio = audioRef.current;
    audio.load();
    if (playing) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Volume and mute changes apply straight away (no fade while dragging the slider).
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && playing) {
      cancelAnimationFrame(fadeRef.current);
      audio.volume = target;
    }
    try {
      localStorage.setItem(STORE, String(volume));
    } catch {
      /* storage unavailable: the volume simply isn't remembered */
    }
  }, [target, volume, playing]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onLauncher = () => {
    if (!open && !playing && progress.current === 0) {
      rememberOff(false);
      play();
    }
    setOpen((o) => !o);
  };

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const track = tracks[index];
  const pct = progress.duration ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6">
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onEnded={() => go(1)}
        onTimeUpdate={(e) => setProgress({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration })}
        onLoadedMetadata={(e) => setProgress({ current: 0, duration: e.currentTarget.duration })}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="music-panel"
            role="region"
            aria-label="Music player"
            className="bevel absolute bottom-full left-0 mb-3 w-[min(20rem,calc(100vw-2rem))] border border-cream/15 bg-coal/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: easyEase } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.3, ease: easyEase } }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="label text-gold">By the fire</p>
                <p className="mt-2 truncate font-display text-[1.5rem] leading-tight text-cream" aria-live="polite">
                  {track.title}
                </p>
                <p className="mt-1 text-small text-ash">
                  Track {index + 1} of {tracks.length}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className={`${iconButton} -mr-3 -mt-2 text-smoke`} aria-label="Close music player">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* progress */}
            <div className="mt-5">
              <div className="h-px w-full bg-cream/15">
                <div className="h-px bg-gold transition-[width] duration-300 ease-linear" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[0.6875rem] tabular-nums text-ash">
                <span>{time(progress.current)}</span>
                <span>{time(progress.duration)}</span>
              </div>
            </div>

            {/* transport */}
            <div className="mt-2 flex items-center justify-center gap-4">
              <button type="button" onClick={() => go(-1)} className={iconButton} aria-label="Previous track">
                <SkipBack className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={toggle}
                className="bevel btn-shadow flex size-12 items-center justify-center bg-gold text-coal transition-colors duration-300 ease-site hover:bg-ember hover:text-white"
                aria-label={playing ? 'Pause music' : 'Play music'}
              >
                {playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="ml-0.5 size-5" aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => go(1)} className={iconButton} aria-label="Next track">
                <SkipForward className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* volume */}
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => setMuted((m) => !m)} className={`${iconButton} -ml-3 text-smoke`} aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted}>
                <VolumeIcon className="size-4" aria-hidden="true" />
              </button>
              <label htmlFor="music-volume" className="sr-only">
                Volume
              </label>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="range flex-1"
                style={{ '--fill': `${(muted ? 0 : volume) * 100}%` }}
              />
              <span className="w-9 text-right text-[0.6875rem] tabular-nums text-ash">{Math.round((muted ? 0 : volume) * 100)}%</span>
            </div>

            {/* playlist */}
            <ol className="mt-4 border-t border-line pt-3">
              {tracks.map((t, i) => (
                <li key={t.src}>
                  <button
                    type="button"
                    onClick={() => (i === index ? toggle() : (setIndex(i), !playing && setTimeout(play, 0)))}
                    className={`flex min-h-10 w-full items-center justify-between gap-3 text-left text-small transition-colors duration-300 ${
                      i === index ? 'text-cream' : 'text-smoke hover:text-cream'
                    }`}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-4 text-[0.6875rem] tabular-nums text-ash">{String(i + 1).padStart(2, '0')}</span>
                      {t.title}
                    </span>
                    {i === index && <Bars playing={playing} />}
                  </button>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onLauncher}
        aria-expanded={open}
        aria-controls="music-panel"
        aria-label={playing ? 'Music playing: open the music player' : 'Play music'}
        title={playing ? 'Now playing' : 'Music'}
        className="icon-float flex size-12 items-center justify-center text-gold"
      >
        {playing ? <Bars playing /> : <Music className="size-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
