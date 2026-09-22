import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface Project {
  title: string;
  description: string;
  href: string;
  label: string;
  image: string;
}

const linkText = (href: string) => {
  const { host, pathname } = new URL(href);
  return host === "github.com" ? `GitHub${pathname}` : host;
};

const navButton =
  "flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function ProjectSlider({ projects }: { projects: Project[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setCurrent(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ align: "start" }} aria-label="Projects">
      <CarouselContent className="-ml-5">
        {projects.map((p, i) => (
          <CarouselItem
            key={p.title}
            className="basis-[92%] pl-5 md:basis-[82%]"
            aria-label={`${i + 1} of ${projects.length}: ${p.title}`}
          >
            <article
              className={`h-full overflow-hidden rounded-3xl border border-border bg-card transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-45"
              }`}
            >
              <div className="aspect-[2/1] overflow-hidden border-b border-border bg-secondary">
                <img
                  src={p.image}
                  alt={`${p.title} website screenshot`}
                  width={1600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                <div className="max-w-xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <span className="label-glow rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wider text-primary uppercase">
                      {p.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  tabIndex={i === current ? 0 : -1}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:self-auto"
                >
                  {linkText(p.href)}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center">
          {projects.map((p, i) => (
            <button
              key={p.title}
              type="button"
              aria-current={i === current ? "true" : undefined}
              aria-label={`Show ${p.title}`}
              onClick={() => api?.scrollTo(i)}
              className="group flex h-11 items-center px-1.5 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground"
                }`}
              />
            </button>
          ))}
          <span
            className="ml-3 font-mono text-xs tracking-widest text-muted-foreground"
            aria-hidden
          >
            {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={navButton}
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous project"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            className={navButton}
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            aria-label="Next project"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </Carousel>
  );
}
