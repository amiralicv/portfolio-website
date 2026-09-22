import { useEffect, useRef } from "react";

// Adapted from React Bits <PixelCard />: just the pixel canvas, driven by an
// `active` prop so a parent (the profile card) decides when it shows.

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size = 0;
  sizeStep = Math.random() * 0.4;
  minSize = 0.5;
  maxSizeInteger = 2;
  maxSize: number;
  delay: number;
  counter = 0;
  counterStep: number;
  isIdle = false;
  isReverse = false;
  isShimmer = false;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = rand(0.1, 0.9) * speed;
    this.maxSize = rand(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) this.shimmer();
    else this.size += this.sizeStep;
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const effectiveSpeed = (value: number, reducedMotion: boolean) =>
  value <= 0 || reducedMotion ? 0 : Math.min(value, 100) * 0.001;

interface PixelCardProps {
  active: boolean;
  gap?: number;
  speed?: number;
  colors?: string;
  className?: string;
}

export default function PixelCard({
  active,
  gap = 6,
  speed = 30,
  colors = "#f8fafc,#f1f5f9,#cbd5e1",
  className = "",
}: PixelCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = () => {
      const width = Math.floor(canvas.clientWidth);
      const height = Math.floor(canvas.clientHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = width;
      canvas.height = height;
      const palette = colors.split(",");
      const pxs: Pixel[] = [];
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          const delay = reducedMotion ? 0 : Math.hypot(x - width / 2, y - height / 2);
          pxs.push(
            new Pixel(canvas, ctx, x, y, color, effectiveSpeed(speed, reducedMotion), delay),
          );
        }
      }
      pixelsRef.current = pxs;
    };

    init();
    const observer = new ResizeObserver(init);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [gap, speed, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    const step: "appear" | "disappear" = active ? "appear" : "disappear";
    const interval = 1000 / 60;
    let last = performance.now();

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (now - last < interval) return;
      last = now - ((now - last) % interval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allIdle = true;
      for (const pixel of pixelsRef.current) {
        pixel[step]();
        if (!pixel.isIdle) allIdle = false;
      }
      // Fully faded out: stop the loop until the next hover.
      if (allIdle) cancelAnimationFrame(frameRef.current);
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
