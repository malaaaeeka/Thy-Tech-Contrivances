"use client";

import { useState } from "react";

const HEADING = { fontFamily: "var(--font-heading)" } as const;

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Our People", href: "/#founders" },
  { label: "Contact", href: "/contact" },
];

const CSS = `
.pm-draw{filter:url(#pm-rough);overflow:visible;pointer-events:none}
.pm-draw path{fill:none;stroke:#03045e;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .8s cubic-bezier(.6,0,.3,1)}
.pm[data-open="1"] .pm-go path{stroke-dashoffset:0;transition-delay:.25s}
.pm-item:hover .pm-circle path,.pm-item:focus-visible .pm-circle path{stroke-dashoffset:0}

/* panel slides down from the top; the tab rides on its bottom edge */
.pm-panel{transform:translateY(-105%);opacity:0;pointer-events:none;
  transition:transform .55s cubic-bezier(.34,1.3,.5,1),opacity .3s}
.pm[data-open="1"] .pm-panel{transform:none;opacity:1;pointer-events:auto}
.pm-tab-wrap{transition:transform .55s cubic-bezier(.34,1.3,.5,1)}
.pm[data-open="1"] .pm-tab-wrap{transform:translateY(var(--panel-h))}
@media (prefers-reduced-motion:reduce){
  .pm-draw path{transition:none}
  .pm-panel,.pm-tab-wrap{transition:none}
}
`;

export default function PullMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="pm fixed right-3 top-0 z-[100] w-[min(88vw,380px)] md:right-6"
      data-open={open ? 1 : 0}
      style={{ ["--panel-h" as string]: "clamp(340px,52vh,470px)" }}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOpen(false)}
    >
      <style>{CSS}</style>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="pm-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </svg>

      {/* panel: full width of the wrapper, height matches --panel-h */}
      <nav
        className="pm-panel absolute inset-x-0 top-0 rounded-b-2xl bg-[#caf0f8] px-6 pb-6 pt-4 text-[#03045e] shadow-2xl"
        style={{ height: "var(--panel-h)" }}
        aria-label="Site menu"
      >
        <ul className="m-0 flex h-full list-none flex-col justify-between p-0">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              className={`flex flex-1 items-center ${i ? "border-t-2 border-dotted border-[#03045e]/70" : ""}`}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="pm-item relative flex w-full items-center justify-between uppercase"
                style={{ ...HEADING, fontSize: "clamp(26px,3.6vw,40px)", lineHeight: 1 }}
              >
                <span className="relative px-1">
                  {l.label}
                  <svg
                    className="pm-draw pm-circle absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]"
                    viewBox="0 0 200 80"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      pathLength={1}
                      d="M104 6 C152 3 197 18 195 41 C193 65 142 76 98 74 C52 72 5 62 7 38 C9 14 58 5 112 7 C132 8 148 12 160 18"
                    />
                  </svg>
                </span>
                <svg className="pm-draw pm-go h-7 w-7 shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path pathLength={1} d="M5 19 L19 5 M9 5 H19 V15" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* the tab: sits at the top when closed, rides down to the panel's bottom edge when open */}
      <div className="pm-tab-wrap relative z-10 flex justify-end">
        <div style={{ filter: "drop-shadow(0 4px 6px rgba(1,2,46,.35))" }}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="relative block w-[clamp(110px,11vw,170px)] bg-[#caf0f8] px-3 pb-8 pt-9 text-[#03045e]"
            style={{
              ...HEADING,
              clipPath: "polygon(0 0,100% 0,100% 100%,75% 82%,50% 100%,25% 82%,0 100%)",
            }}
          >
            <span className="absolute inset-x-3 top-3 border-t-2 border-dotted border-[#03045e]" />
            <span className="text-sm uppercase tracking-wide md:text-base">
              {open ? "Close" : "Pull me"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}