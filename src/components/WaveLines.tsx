// Outline waves drifting behind the page. Each line repeats every 1000 units, so sliding the
// 2000-unit strip by half its width loops without a seam. Transform-only, so it stays on the GPU.
const LINES = 14;

function wave(i: number) {
  const base = 120 + (i * 560) / (LINES - 1);
  const amp = 22 + (i % 5) * 9;
  const p1 = i * 0.55;
  const p2 = i * 1.3;
  const pts: string[] = [];
  for (let x = 0; x <= 2000; x += 10) {
    const t = (x / 1000) * Math.PI * 2;
    const y = base + amp * Math.sin(t + p1) + amp * 0.45 * Math.sin(2 * t + p2);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

export default function WaveLines() {
  return (
    <div aria-hidden className="wave-lines">
      {Array.from({ length: LINES }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 2000 800"
          preserveAspectRatio="none"
          className="wave-line"
          style={{
            animationDuration: `${70 + (i % 6) * 18}s`,
            animationDirection: i % 2 ? "reverse" : "normal",
            opacity: i % 3 === 0 ? 0.4 : 0.16,
            color: i % 3 === 0 ? "var(--primary)" : "var(--foreground)",
          }}
        >
          <path
            d={wave(i)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
    </div>
  );
}
