import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sun/moon switch, a quiet hairline icon button like the contact icons. Its look is driven by the `dark` class on <html> (set before
 * paint by the script in __root), so it is right on first render; React state
 * only mirrors it for aria-checked.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked: the switch still works for this visit.
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      className={`group relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${className}`}
    >
      <Sun
        aria-hidden
        strokeWidth={1.5}
        className="absolute size-[18px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-90 motion-reduce:transition-none dark:scale-50 dark:-rotate-90 dark:opacity-0"
      />
      <Moon
        aria-hidden
        strokeWidth={1.5}
        className="absolute size-[18px] scale-50 rotate-90 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-90 motion-reduce:transition-none dark:scale-100 dark:rotate-0 dark:opacity-100"
      />
    </button>
  );
}
