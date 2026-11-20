"use client";

import { useEffect, useRef } from "react";
import type { ReactElement, CSSProperties } from "react";
import Matter from "matter-js";
import { generatePaper } from "./paperTexture";



const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-full w-full",
};

const WhatsApp = () => (
  <svg {...iconProps}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);
const Email = () => (
  <svg {...iconProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);

const Facebook = () => (
  <svg {...iconProps}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedIn = () => (
  <svg {...iconProps}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = () => (
  <svg {...iconProps}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

type Circle = {
  label: string;
  r: number;
  bg: string;
  inner?: string; // plain balls get a two-tone "tape roll" look
  url?: string;
  Icon?: () => ReactElement;
};

const LIGHT = "#caf0f8";

// 👉 Replace the social links with your own
const circles: Circle[] = [
  { label: "WhatsApp", url: "https://wa.me/1234567890", r: 98, bg: LIGHT, Icon: WhatsApp },
  { label: "Email", url: "mailto:your@email.com", r: 100, bg: LIGHT, Icon: Email },
  { label: "plain-1", r: 135, bg: "#0077b6" },
  { label: "Facebook", url: "https://facebook.com/your", r: 104, bg: LIGHT, Icon: Facebook },
  { label: "plain-2", r: 118, bg: "#00b4d8" },
  { label: "LinkedIn", url: "https://linkedin.com/in/your", r: 96, bg: LIGHT, Icon: LinkedIn },
  { label: "plain-3", r: 128, bg: "#3a86ff" },
  { label: "Instagram", url: "https://instagram.com/your", r: 102, bg: LIGHT, Icon: Instagram },
];

const STICKER_LINES = [
  { text: "LET'S", rot: [-7, 4, -3, 8, -5], lift: [0.02, -0.04, 0.03, -0.02, 0.04] },
  { text: "TALK", rot: [5, -6, 3, -5], lift: [-0.03, 0.03, -0.04, 0.02] },
];

const STICKER_CSS = `
.sticker-letter {
  display: inline-block;
  transform: translateY(calc(var(--y) * 1em)) rotate(calc(var(--r) * 1deg)) scale(1);
  text-shadow: 0.03em 0.035em 0 rgba(1, 2, 46, 0.35);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.35s;
  will-change: transform;
}
.sticker-letter.is-hover {
  transform: translateY(calc(var(--y) * 1em - 0.07em)) rotate(calc(var(--r) * 1deg + 5deg)) scale(1.14);
  text-shadow: 0.05em 0.06em 0 rgba(1, 2, 46, 0.45);
}

.sticker-h { font-size: min(22vw, 31vh); }
@media (max-width: 767px) {
  .sticker-h { font-size: min(30vw, 22vh); }
}

`;

function Headline() {
  return (
    <>
      <style>{STICKER_CSS}</style>
      <h2
        aria-label="Let's Talk"
        className="sticker-h absolute inset-x-0 top-[11vh] z-0 flex flex-col items-center uppercase"
        style={{
          fontFamily: "var(--font-heading)",
          lineHeight: 0.78,
          letterSpacing: "-0.01em",
          color: "#caf0f8",
        }}
      >
        {STICKER_LINES.map((line, li) => (
          <span
            key={li}
            aria-hidden
            className="flex"
            style={{ transform: li ? "translateX(0.06em)" : "none", marginTop: li ? "0.04em" : 0 }}
          >
            {line.text.split("").map((ch, i) => (
              <span
                key={i}
                className="sticker-letter"
                style={{ "--r": line.rot[i], "--y": line.lift[i] } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h2>
    </>
  );
}

function PaperTexture() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const W = 960;
    const H = 600;
    canvas.width = W;
    canvas.height = H;
    const id = window.setTimeout(() => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = ctx.createImageData(W, H);
      img.data.set(generatePaper(W, H, 34));
      ctx.putImageData(img, 0, 0);
      canvas.style.opacity = "1";
    }, 50);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
    />
  );
}

export default function Footer() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events, Query } = Matter;
    let started = false;
    let teardown: (() => void) | null = null;

    const build = () => {
      const w = zone.clientWidth;
      const h = zone.clientHeight;
      const scale = Math.max(0.4, Math.min(w / 1500, h / 800));

      // park every ball above the screen before it drops in
      elsRef.current.forEach((el) => {
        if (el) el.style.transform = "translate(0px, -800px)";
      });

      const engine = Engine.create();
      const t = 100;
      const walls = [
        Bodies.rectangle(w / 2, h + t / 2, w * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, h / 2, t, h * 8, { isStatic: true }),
        Bodies.rectangle(w + t / 2, h / 2, t, h * 8, { isStatic: true }),
      ];

      const bodies = circles.map((c, i) =>
        Bodies.circle(
          w * (0.1 + (((i * 3) % circles.length) / circles.length) * 0.8),
          -60 - i * 70 * scale,
          c.r * scale,
          { restitution: 0.45, friction: 0.1 }
        )
      );

      const mouse = Mouse.create(zone);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = mouse as any;
      zone.removeEventListener("wheel", m.mousewheel);
      zone.removeEventListener("mousewheel", m.mousewheel);
      zone.removeEventListener("DOMMouseScroll", m.mousewheel);

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });

      Composite.add(engine.world, [...walls, ...bodies, mouseConstraint]);

      // Ceiling added after the balls have dropped in, so nothing can leave the footer
      const ceilingTimer = setTimeout(() => {
        Composite.add(engine.world, Bodies.rectangle(w / 2, -t / 2, w * 2, t, { isStatic: true }));
      }, 4000);

      Events.on(engine, "afterUpdate", () => {
        bodies.forEach((b, i) => {
          const el = elsRef.current[i];
          if (!el) return;
          const r = circles[i].r * scale;
          el.style.width = `${r * 2}px`;
          el.style.height = `${r * 2}px`;
          el.style.transform = `translate(${b.position.x - r}px, ${b.position.y - r}px) rotate(${b.angle}rad)`;
        });
      });

      // ---------- pointer interaction ----------
      let down = { x: 0, y: 0, time: 0 };
      let hoveredBody: Matter.Body | undefined;
      let hoveredLetter: Element | null = null;

      const toPoint = (e: PointerEvent) => {
        const rect = zone.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      const setLetter = (el: Element | null) => {
        if (el === hoveredLetter) return;
        hoveredLetter?.classList.remove("is-hover");
        el?.classList.add("is-hover");
        hoveredLetter = el;
      };

      // Hop the ball in the direction the cursor is moving, plus a little jump up
      const hop = (body: Matter.Body, e: PointerEvent, pt: { x: number; y: number }) => {
        let dx = e.movementX;
        let dy = e.movementY;
        let len = Math.hypot(dx, dy);
        if (len < 2) {
          dx = body.position.x - pt.x;
          dy = body.position.y - pt.y;
          len = Math.hypot(dx, dy) || 1;
        }
        const power = 7 * Math.max(0.6, scale);
        const vx = (dx / len) * power;
        const vy = (dy / len) * power - 6 * Math.max(0.6, scale);
        const maxV = 16;
        Body.setVelocity(body, {
          x: Math.max(-maxV, Math.min(maxV, body.velocity.x + vx)),
          y: Math.max(-maxV, Math.min(maxV, body.velocity.y + vy)),
        });
        Body.setAngularVelocity(body, body.angularVelocity + (dx / len) * 0.08);
      };

      const onDown = (e: PointerEvent) => {
        down = { x: e.clientX, y: e.clientY, time: Date.now() };
      };

      const onUp = (e: PointerEvent) => {
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        if (moved > 6 || Date.now() - down.time > 500) return;
        const hit = Query.point(bodies, toPoint(e))[0];
        if (!hit) return;
        const url = circles[bodies.indexOf(hit)]?.url;
        if (url) {
  if (url.startsWith("mailto:")) window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
}
      };

      const lastHop = new Map<Matter.Body, number>();

const onMove = (e: PointerEvent) => {
  if (e.pointerType === "touch") return;
  const pt = toPoint(e);
  const hits = Query.point(bodies, pt);
  const hit =
    hits.length === 0
      ? undefined
      : hits.reduce((a, b) =>
          Math.hypot(a.position.x - pt.x, a.position.y - pt.y) <=
          Math.hypot(b.position.x - pt.x, b.position.y - pt.y)
            ? a
            : b
        );

  if (hit) {
    setLetter(null);
    zone.style.cursor = circles[bodies.indexOf(hit)]?.url ? "pointer" : "grab";

    // hop at most once every 450ms per ball, and never while dragging
    const now = performance.now();
    if (!mouseConstraint.body && now - (lastHop.get(hit) ?? 0) > 450) {
      lastHop.set(hit, now);
      hop(hit, e, pt);
    }
    hoveredBody = hit;
    return;
  }

  hoveredBody = undefined;
  zone.style.cursor = "default";
  const letter = document
    .elementsFromPoint(e.clientX, e.clientY)
    .find((el) => el.classList.contains("sticker-letter"));
  setLetter(letter ?? null);
};

      const onLeave = () => {
        hoveredBody = undefined;
        setLetter(null);
      };

      zone.addEventListener("pointerdown", onDown);
      zone.addEventListener("pointerup", onUp);
      zone.addEventListener("pointermove", onMove);
      zone.addEventListener("pointerleave", onLeave);

      const runner = Runner.create();
      Runner.run(runner, engine);

      return () => {
        clearTimeout(ceilingTimer);
        setLetter(null);
        zone.removeEventListener("pointerdown", onDown);
        zone.removeEventListener("pointerup", onUp);
        zone.removeEventListener("pointermove", onMove);
        zone.removeEventListener("pointerleave", onLeave);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    let lastW = 0;
    let lastH = 0;
    let timer: ReturnType<typeof setTimeout>;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          lastW = zone.clientWidth;
          lastH = zone.clientHeight;
          teardown = build();
        }
      },
      { threshold: 0 }
    );
    io.observe(zone);

    // rebuild only when the size really changes (window resize or zoom)
    const ro = new ResizeObserver(() => {
      if (!started) return;
      const w = zone.clientWidth;
      const h = zone.clientHeight;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      clearTimeout(timer);
      timer = setTimeout(() => {
        teardown?.();
        teardown = build();
      }, 300);
    });
    ro.observe(zone);

    return () => {
      clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <footer className="paper-bg relative h-[100svh] min-h-[560px] overflow-hidden bg-[#03045e] text-[#caf0f8]">
  <PaperTexture />
 

      <Headline />

      {/* Physics zone: balls rest on a floor above the copyright pill */}
      <div ref={zoneRef} className="absolute inset-x-0 top-0 bottom-[68px] z-10 touch-pan-y">
        {circles.map((c, i) => (
  <div
    key={`${c.label}-${i}`}
    ref={(el) => {
      elsRef.current[i] = el;
    }}
    aria-label={c.url ? c.label : undefined}
    className="pointer-events-none absolute left-0 top-0 flex select-none items-center justify-center rounded-full text-[#03045e] shadow-lg"
    style={{
      background: c.bg,
      width: c.r * 2,
      height: c.r * 2,
      transform: "translate(0px, -800px)",
    }}
  >
    {c.Icon && (
      <div className="h-[56%] w-[56%]">
        <c.Icon />
      </div>
    )}
  </div>
))}
      </div>

      {/* Copyright pill */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
        <p className="mx-4 rounded-full bg-[#01022e] px-4 py-2 text-center text-xs font-semibold tracking-wide text-[#caf0f8] shadow-md md:px-5 md:text-sm">
          Copyright © 2026. Thy Tech Contrivances
        </p>
      </div>
    </footer>
  );
}