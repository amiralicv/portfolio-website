import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useScrollY } from "@/hooks/use-scroll";

const PixelBlast = lazy(() => import("./PixelBlast"));

/** Below this opacity the layer contributes nothing visible, so stop drawing it. */
const VISIBLE_EPSILON = 0.01;

/** Layer opacity at the top of the page. Lower it if the hero text fights the pixels. */
const MAX_OPACITY = 0.8;

/**
 * Fixed page background. PixelBlast owns the hero and nothing else: past the
 * hero the page sits on an opaque black panel, so the field is faded out and
 * its loop stopped rather than drawn underneath something that hides it.
 */
export function SceneBackground({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const [mounted, setMounted] = useState(false);
  const layer = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  // Mirror of the React state so the scroll path only calls setState when the
  // layer actually crosses its visibility threshold, not on every frame.
  const offRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const onScroll = useCallback(
    (scrollY: number) => {
      const hero = heroRef.current;
      const span = Math.max(1, (hero?.offsetHeight ?? window.innerHeight) * 0.75);
      const p = Math.min(1, Math.max(0, scrollY / span));
      const eased = p * p * (3 - 2 * p);
      const opacity = MAX_OPACITY * (1 - eased);

      if (layer.current) layer.current.style.opacity = String(opacity);

      const nextOff = opacity <= VISIBLE_EPSILON;
      if (nextOff !== offRef.current) {
        offRef.current = nextOff;
        setPaused(nextOff);
      }
    },
    [heroRef],
  );

  useScrollY(onScroll);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <div ref={layer} className="absolute inset-0" style={{ opacity: MAX_OPACITY }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#537d13"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.6}
          edgeFade={0.25}
          dpr={1}
          fps={30}
          paused={paused}
        />
      </div>
    </Suspense>
  );
}
