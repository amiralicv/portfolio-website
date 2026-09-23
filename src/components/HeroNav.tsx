import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, Github, Mail, Menu, X } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { getLenis } from "@/hooks/use-lenis";
import { useScrollY } from "@/hooks/use-scroll";

type NavItem = { id: string; label: string };

/** Matches the offset the anchor handler in use-lenis scrolls to. */
const SCROLL_OFFSET = -96;

const PILL =
  "inline-flex items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-md transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none";

export function HeroNav({
  items,
  heroRef,
}: {
  items: NavItem[];
  heroRef: RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState(false);
  // Past the hero the bar tightens into a compact pill instead of disappearing,
  // so there is still a way to navigate from a desktop screen.
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(items[0]?.id ?? "");
  const stateRef = useRef({ compact: false, active: items[0]?.id ?? "" });

  const onScroll = useCallback(
    (scrollY: number) => {
      const hero = heroRef.current;
      const heroEnd = (hero?.offsetHeight ?? window.innerHeight) * 0.6;
      const isCompact = scrollY > heroEnd;
      if (isCompact !== stateRef.current.compact) {
        stateRef.current.compact = isCompact;
        setCompact(isCompact);
      }

      // Whichever section's top has most recently passed under the bar wins.
      // Matches where an anchor jump parks a section top (scroll-mt + nav height).
      const line = scrollY + 240;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top + scrollY <= line) current = item.id;
      }
      // At the very bottom the last section's top may never cross the line, so
      // claim it explicitly — otherwise Contact can never light up.
      const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = items[items.length - 1]?.id ?? current;

      if (current !== stateRef.current.active) {
        stateRef.current.active = current;
        setActive(current);
      }
    },
    [heroRef, items],
  );

  useScrollY(onScroll);

  // The highlight is one pill that slides to whichever tab is active, so the
  // change reads as movement rather than two separate fades.
  const listRef = useRef<HTMLUListElement | null>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const link = linkRefs.current.get(active);
      if (!list || !link) return;
      setPill({ left: link.offsetLeft, width: link.offsetWidth, ready: true });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [active, compact, items]);

  const goTo = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;

    // The dialog locks body scroll while it is open, so let it close first.
    window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, {
          offset: SCROLL_OFFSET,
          duration: 1.3,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        // No Lenis means reduced motion — jump, don't animate.
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET,
        });
      }
      // No hash written to the URL, so a reload still starts at the top.
    }, 200);
  };

  return (
    <>
      {/* Desktop — z-30 keeps it above the hero panel so the links stay clickable */}
      <nav
        className={`fixed inset-x-0 top-0 z-30 hidden justify-center px-5 transition-all duration-500 ease-out sm:flex ${
          compact ? "pt-3" : "pt-6"
        }`}
      >
        <ul
          ref={listRef}
          className={`nav-pill relative flex w-max items-center rounded-full border border-border bg-background/70 backdrop-blur-xl transition-all duration-500 ease-out ${
            compact ? "gap-0.5 px-1.5 py-1.5" : "gap-1 px-2 py-2 lg:px-3 lg:py-2.5"
          }`}
        >
          <span
            aria-hidden
            className="absolute top-1/2 left-0 h-[calc(100%-0.75rem)] rounded-full bg-secondary ring-1 ring-primary/35 transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              width: `${pill.width}px`,
              transform: `translate(${pill.left}px, -50%)`,
              opacity: pill.ready ? 1 : 0,
            }}
          />
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  ref={(el) => {
                    if (el) linkRefs.current.set(item.id, el);
                    else linkRefs.current.delete(item.id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full font-medium whitespace-nowrap transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none ${
                    compact
                      ? "px-3.5 py-1.5 text-xs"
                      : "px-4 py-1.5 text-xs lg:px-5 lg:py-2 lg:text-sm"
                  } ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile — the menu is the only way to navigate here, so it never fades out */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger
          aria-label="Open menu"
          className={`${PILL} fixed top-4 right-4 z-30 size-11 sm:hidden`}
        >
          <Menu className="size-5" />
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-background/70 backdrop-blur-xl duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:hidden" />

          <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col px-6 pt-20 pb-10 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:hidden">
            <DialogPrimitive.Title className="sr-only">Site navigation</DialogPrimitive.Title>

            <DialogPrimitive.Close
              aria-label="Close menu"
              className={`${PILL} absolute top-4 right-4 size-11`}
            >
              <X className="size-5" />
            </DialogPrimitive.Close>

            <nav className="flex flex-col">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  style={{ animationDelay: `${80 + i * 35}ms` }}
                  className="menu-row-in group flex w-full items-center justify-between gap-4 border-b border-border/60 py-5 text-left transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl font-semibold text-foreground">{item.label}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-active:-translate-y-0.5 group-active:translate-x-0.5" />
                </button>
              ))}
            </nav>

            <div
              className="menu-row-in mt-auto flex flex-wrap items-center gap-3 pt-10"
              style={{ animationDelay: `${80 + items.length * 35}ms` }}
            >
              <a
                href="https://github.com/amiraliverse"
                target="_blank"
                rel="noreferrer noopener"
                className={`${PILL} gap-2 px-4 py-2.5 text-xs font-medium`}
              >
                <Github className="size-4" />
                GitHub
              </a>
              <a
                href="mailto:abbasigudarzi@gmail.com"
                className={`${PILL} gap-2 px-4 py-2.5 text-xs font-medium`}
              >
                <Mail className="size-4" />
                Email
              </a>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
