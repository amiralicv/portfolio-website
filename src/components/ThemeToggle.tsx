import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sun/moon switch. Its look is driven by the `dark` class on <html> (set before
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
      className={`group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-secondary p-0.5 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${className}`}
    >
      {/* Two tiny stars that twinkle in only at night. */}
      <span
        aria-hidden
        className="absolute top-1.5 left-2.5 size-[3px] rounded-full bg-foreground/60 opacity-0 transition-opacity delay-150 duration-300 dark:opacity-100"
      />
      <span
        aria-hidden
        className="absolute bottom-2 left-4 size-[2px] rounded-full bg-foreground/40 opacity-0 transition-opacity delay-200 duration-300 dark:opacity-100"
      />
      {/* Knob: glides across (ease-out-quint, same curve family as the rest of the page) and carries the icon. */}
      <span className="relative grid size-6 place-items-center rounded-full bg-background shadow-[0_1px_3px_rgb(0_0_0/0.18)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-90 motion-reduce:transition-none dark:translate-x-6">
        <Sun
          aria-hidden
          className="absolute size-3.5 text-amber-500 transition-all duration-500 dark:scale-50 dark:-rotate-90 dark:opacity-0"
        />
        <Moon
          aria-hidden
          className="absolute size-3.5 scale-50 rotate-90 text-foreground opacity-0 transition-all duration-500 dark:scale-100 dark:rotate-0 dark:opacity-100"
        />
      </span>
    </button>
  );
}
