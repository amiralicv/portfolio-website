import { useEffect, useRef } from "react";

// Adapted from React Bits <LetterGlitch />. Changed for performance:
// - only cells that changed are repainted, never the whole canvas per frame;
// - frames are capped at FPS and the device pixel ratio at 1;
// - the loop stops while the tab is hidden, and never starts
//   under prefers-reduced-motion (one static frame is drawn instead).

type Rgb = { r: number; g: number; b: number };
type Letter = { char: string; rgb: Rgb; from: Rgb; to: Rgb; progress: number };

const FONT_SIZE = 16;
const CHAR_W = 10;
const CHAR_H = 20;
const FPS = 30;
/** Share of letters re-rolled per glitch tick. */
const GLITCH_RATIO = 0.05;
/** Colour fade step per frame when `smooth` is on (1 / step frames per fade). */
const FADE_STEP = 0.08;

// Glowing words: at most MAX_WORDS on screen, a new one tried every WORD_EVERY ms.
const MAX_WORDS = 2;
const WORD_EVERY = 2200;
const WORD_IN = 700;
const WORD_HOLD = 2600;
const WORD_OUT = 900;
const WORD_GLOW = 14;

type Word = { text: string; row: number; col: number; born: number; shown: number };

const hexToRgb = (hex: string): Rgb => {
  const full = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => r + r + g + g + b + b,
  );
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 255, g: 255, b: 255 };
};

export default function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  smooth = true,
  outerVignette = true,
  centerVignette = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
  words = [],
  wordColor = "#61dca3",
  className = "",
}: {
  glitchColors?: string[];
  glitchSpeed?: number;
  smooth?: boolean;
  outerVignette?: boolean;
  centerVignette?: boolean;
  characters?: string;
  /** Surface now and then in the field, glowing, then dissolve back. */
  words?: string[];
  wordColor?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorsKey = glitchColors.join();
  const wordsKey = words.join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const chars = Array.from(characters);
    const palette = glitchColors.map(hexToRgb);
    const randChar = () => chars[(Math.random() * chars.length) | 0];
    const randRgb = () => palette[(Math.random() * palette.length) | 0];
    const css = ({ r, g, b }: Rgb) => `rgb(${r},${g},${b})`;

    const wordList = words.map((w) => w.toUpperCase());
    const glowRgb = hexToRgb(wordColor);
    const dimRgb = palette[0];

    let cols = 0;
    let rows = 0;
    let letters: Letter[] = [];
    // Cells owned by a word (the word plus a calm margin): the glitch leaves them alone.
    let locked = new Uint8Array(0);
    let active: Word[] = [];
    // Cells to repaint this frame; a Set so a cell picked twice paints once.
    const dirty = new Set<number>();
    const fading = new Set<number>();

    const paint = (i: number) => {
      const l = letters[i];
      const x = (i % cols) * CHAR_W;
      const y = ((i / cols) | 0) * CHAR_H;
      ctx.fillStyle = "#000";
      ctx.fillRect(x, y, CHAR_W, CHAR_H);
      ctx.fillStyle = css(l.rgb);
      ctx.fillText(l.char, x, y);
    };

    const setup = () => {
      const { width, height } = canvas.parentElement!.getBoundingClientRect();
      // ponytail: DPR fixed at 1 — letters are background texture, crispness not worth 4x fill cost.
      canvas.width = Math.ceil(width);
      canvas.height = Math.ceil(height);
      cols = Math.ceil(width / CHAR_W);
      rows = Math.ceil(height / CHAR_H);
      letters = Array.from({ length: cols * rows }, () => {
        const rgb = randRgb();
        return { char: randChar(), rgb, from: rgb, to: rgb, progress: 1 };
      });
      locked = new Uint8Array(cols * rows);
      active = [];
      dirty.clear();
      fading.clear();
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < letters.length; i++) paint(i);
    };

    const glitch = () => {
      const count = Math.max(1, (letters.length * GLITCH_RATIO) | 0);
      for (let n = 0; n < count; n++) {
        const i = (Math.random() * letters.length) | 0;
        if (locked[i]) continue;
        const l = letters[i];
        l.char = randChar();
        l.from = l.rgb;
        l.to = randRgb();
        if (smooth) {
          l.progress = 0;
          fading.add(i);
        } else {
          l.rgb = l.to;
        }
        dirty.add(i);
      }
    };

    const fade = () => {
      for (const i of fading) {
        const l = letters[i];
        l.progress = Math.min(1, l.progress + FADE_STEP);
        const t = l.progress;
        l.rgb = {
          r: Math.round(l.from.r + (l.to.r - l.from.r) * t),
          g: Math.round(l.from.g + (l.to.g - l.from.g) * t),
          b: Math.round(l.from.b + (l.to.b - l.from.b) * t),
        };
        if (t >= 1) fading.delete(i);
        dirty.add(i);
      }
    };

    // A word's box: the word plus one row above/below and two columns each side,
    // wide enough that its glow never gets cut by a neighbouring cell repaint.
    const box = (w: Word) => ({
      r0: w.row - 1,
      r1: w.row + 1,
      c0: w.col - 2,
      c1: w.col + w.text.length + 1,
    });

    const setLock = (w: Word, v: 0 | 1) => {
      const { r0, r1, c0, c1 } = box(w);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) locked[r * cols + c] = v;
    };

    // Repaint the whole box at once so the glow is drawn over a clean patch.
    const paintWord = (w: Word, p: number) => {
      const { r0, r1, c0, c1 } = box(w);
      ctx.fillStyle = "#000";
      ctx.fillRect(c0 * CHAR_W, r0 * CHAR_H, (c1 - c0 + 1) * CHAR_W, (r1 - r0 + 1) * CHAR_H);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (r === w.row && c >= w.col && c < w.col + w.text.length) continue;
          const l = letters[r * cols + c];
          ctx.fillStyle = css(l.rgb);
          ctx.fillText(l.char, c * CHAR_W, r * CHAR_H);
        }
      }
      const rgb = {
        r: Math.round(dimRgb.r + (glowRgb.r - dimRgb.r) * p),
        g: Math.round(dimRgb.g + (glowRgb.g - dimRgb.g) * p),
        b: Math.round(dimRgb.b + (glowRgb.b - dimRgb.b) * p),
      };
      ctx.fillStyle = css(rgb);
      ctx.shadowColor = css(glowRgb);
      ctx.shadowBlur = WORD_GLOW * p;
      ctx.fillText(w.text, w.col * CHAR_W, w.row * CHAR_H);
      ctx.shadowBlur = 0;
    };

    const spawnWord = (now: number) => {
      const text = wordList[(Math.random() * wordList.length) | 0];
      // Wide screens: right half only, the hero copy covers the left.
      const minCol = cols >= 100 ? (cols / 2) | 0 : 2;
      const maxCol = cols - text.length - 2;
      if (maxCol < minCol || rows < 5) return;
      for (let attempt = 0; attempt < 6; attempt++) {
        const w: Word = {
          text,
          row: 2 + ((Math.random() * (rows - 4)) | 0),
          col: minCol + ((Math.random() * (maxCol - minCol + 1)) | 0),
          born: now,
          shown: -1,
        };
        const { r0, r1, c0, c1 } = box(w);
        let free = true;
        for (let r = r0 - 1; r <= r1 + 1 && free; r++)
          for (let c = c0; c <= c1 && free; c++) if (locked[r * cols + c]) free = false;
        if (!free) continue;
        setLock(w, 1);
        active.push(w);
        return;
      }
    };

    const updateWords = (now: number) => {
      active = active.filter((w) => {
        const age = now - w.born;
        if (age >= WORD_IN + WORD_HOLD + WORD_OUT) {
          // Hand the cells back as ordinary letters; per-cell repaint also wipes the glow.
          setLock(w, 0);
          const { r0, r1, c0, c1 } = box(w);
          for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) paint(r * cols + c);
          return false;
        }
        const p =
          age < WORD_IN
            ? age / WORD_IN
            : age < WORD_IN + WORD_HOLD
              ? 1
              : 1 - (age - WORD_IN - WORD_HOLD) / WORD_OUT;
        // Held words cost nothing: only repaint when the glow level changed.
        if (p !== w.shown) {
          paintWord(w, p);
          w.shown = p;
        }
        return true;
      });
    };

    setup();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastFrame = 0;
    let lastGlitch = 0;
    let lastWord = 0;
    const frameMs = 1000 / FPS;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastFrame < frameMs) return;
      lastFrame = now;
      if (now - lastGlitch >= glitchSpeed) {
        glitch();
        lastGlitch = now;
      }
      if (smooth) fade();
      for (const i of dirty) if (!locked[i]) paint(i);
      dirty.clear();
      if (wordList.length) {
        if (now - lastWord >= WORD_EVERY && active.length < MAX_WORDS) {
          spawnWord(now);
          lastWord = now;
        }
        updateWords(now);
      }
    };

    const start = () => {
      if (!raf && !reduceMotion && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    start();

    const onVisibility = () => (document.hidden ? stop() : start());
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 150);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
    // glitchColors is tracked through colorsKey so a new array literal each render does not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsKey, wordsKey, wordColor, glitchSpeed, smooth, characters]);

  return (
    <div className={`relative size-full overflow-hidden bg-black ${className}`}>
      <canvas ref={canvasRef} className="block size-full" />
      {outerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,#000_100%)]" />
      )}
      {centerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(0_0_0/0.8)_0%,transparent_60%)]" />
      )}
    </div>
  );
}
