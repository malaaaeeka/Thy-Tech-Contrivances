"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Caveat } from "next/font/google";
import PaperLayer from "./PaperLayer";

const hand = Caveat({ subsets: ["latin"], weight: ["500"] });

const ROT = [-6, 4, -3, 7, -5, 3, -4, 6];
const LIFT = [0.02, -0.04, 0.03, -0.02, 0.04, -0.03, 0.02, -0.04];

/**
 * Edit this list when you send me your real services.
 * Numbers come from the order (1, 2, 3 ...). `image` is optional.
 * Five services fits the camera path best (see buildPath).
 */
type Service = { title: string; text: string; note: string; image?: string };
const SERVICES: Service[] = [
  {
    title: "AI & automation",
    text: "We design AI assistants and chatbots that answer routine questions and turn plain-language requests into actions. We also automate the repetitive work around them, such as WhatsApp and email reminders, document printing and Excel or PDF reports. We move your records from paper and spreadsheets into one system.",
    note: "plain words in, action out",
  },
  {
    title: "AR, VR & XR",
    text: "We build immersive augmented, virtual and mixed reality experiences for headsets and the web. From concept and 3D design through to deployment, we deliver polished, performance-tuned experiences that your audience can step into.",
    note: "from a headset to the browser",
  },
  {
    title: "Software & custom websites",
    text: "We build custom business software and websites around how your company actually works, covering record keeping, accounts, sales and reporting. This includes portals and dashboards for your customers and staff. Every system is secure, role-based and built to grow with you.",
    note: "built around your workflow",
  },
  {
    title: "Stores & billing",
    text: "We set up online stores with secure card payments and order management, and point-of-sale systems for billing, stock and daily reports with receipt printing. We also deliver FBR-compliant digital invoicing, so your business stays compliant without extra effort.",
    note: "Invoy is live with FBR",
  },
  {
    title: "Projection mapping",
    text: "We turn buildings, stages, products and objects into moving displays by projecting animated visuals that fit their exact shape. From concept and 3D content through to on-site setup and playback, we handle the whole show for launches, events, exhibitions and retail spaces.",
    note: "light that fits any surface",
  },
  {
    title: "Video & marketing",
    text: "We produce animated explainers, product videos and motion graphics, alongside posters and social media content that promote your company and products. Everything is designed and created in-house, so your brand stays consistent across every channel.",
    note: "made in-house, start to finish",
  },
];

/* ---------- camera path: right, down, right, up, right, ... then down ---------- */
type Dir = "R" | "D" | "U";
const CYCLE: Dir[] = ["R", "D", "R", "U"];
const step = (p: { x: number; y: number }, d: Dir) => ({
  x: p.x + (d === "R" ? 1 : 0),
  y: p.y + (d === "D" ? 1 : d === "U" ? -1 : 0),
});

function buildPath(n: number) {
  const cells = [{ x: 0, y: 0 }]; // 0 = intro, 1..n = services, n+1 = closing
  const dirs: Dir[] = [];
  for (let i = 0; i < n; i++) {
    const d = CYCLE[i % 4];
    dirs.push(d);
    cells.push(step(cells[cells.length - 1], d));
  }
  const last = cells[cells.length - 1];
  const down = step(last, "D");
  const taken = cells.some((c) => c.x === down.x && c.y === down.y);
  const d: Dir = taken ? "R" : "D"; // finish by moving down whenever that cell is free
  dirs.push(d);
  cells.push(step(last, d));
  return { cells, dirs };
}

const DWELL = 0.35; // share of each stage spent holding still on a cell
const SPAN = 0.7; // extra stage length so the last cell is held
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- hand-drawn pieces ---------- */
const DIGITS: Record<number, string> = {
  1: "M12 20 C16 16 20 12 25 8 C25 22 25 38 24 52",
  2: "M10 20 C10 8 32 6 32 20 C32 30 18 40 10 52 C18 51 28 51 36 52",
  3: "M10 12 C20 4 34 10 30 22 C28 28 20 29 18 29 C28 29 36 34 33 44 C30 54 14 54 8 46",
  4: "M28 6 C22 20 14 34 6 40 C16 40 28 40 38 40 M28 6 C28 24 28 40 27 54",
  5: "M32 8 C26 8 18 8 12 8 C12 16 11 24 10 28 C20 22 34 28 34 40 C34 52 18 56 8 48",
  6: "M30 8 C20 16 10 30 10 42 C10 56 32 56 32 42 C32 30 16 30 10 40",
};
const RING =
  "M62 10 C96 8 114 34 112 62 C110 92 84 112 56 108 C26 104 8 82 10 56 C12 28 34 12 66 14 C78 15 88 20 94 28";

function PencilNumber({ n }: { n: number }) {
  return (
    <svg className="svc-num draw" viewBox="0 0 120 120" aria-hidden>
      <path className="ring" pathLength={1} d={RING} />
      {DIGITS[n] ? (
        <g transform="translate(40 24) scale(1.15)">
          <path className="dig" pathLength={1} d={DIGITS[n]} />
        </g>
      ) : (
        <text x="60" y="76" textAnchor="middle" fontSize="48" fill="currentColor" style={{ fontFamily: "var(--hand)" }}>
          {n}
        </text>
      )}
    </svg>
  );
}

function Arrow({ dir }: { dir: Dir }) {
  return (
    <svg className={`svc-arrow draw arr-${dir}`} viewBox="0 0 240 120" aria-hidden>
      <path pathLength={1} d="M8 70 C70 10 150 12 222 78" />
      <path pathLength={1} d="M222 78 L194 76 M222 78 L212 52" />
    </svg>
  );
}

function Note({ text }: { text: string }) {
  return (
    <div className="svc-note">
      <svg className="draw" viewBox="0 0 200 130" aria-hidden>
        <path pathLength={1} d="M4 22 C60 14 130 10 196 6" />
        <path pathLength={1} d="M20 4 C22 40 22 90 18 126" />
      </svg>
      <p>{text}</p>
    </div>
  );
}



function CurvedTitle({ title, k }: { title: string; k: number }) {
  const words = title.toUpperCase().split(" ");
  // split the words into two lines of similar length
  let best = 1;
  let diff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    if (Math.abs(a - b) < diff) {
      diff = Math.abs(a - b);
      best = i;
    }
  }
  const first = words.slice(0, best).join(" ");
  const second = words.slice(best).join(" ");
  const fs = Math.min(110, 520 / (Math.max(first.length, second.length) * 0.5));
  const topPath = "M 40 200 A 380 380 0 0 1 560 200";
  const bottomPath = "M 40 200 A 420 420 0 0 0 560 200";
  const style = { fontFamily: "var(--font-condensed)", fontSize: fs, letterSpacing: fs * 0.05 };

  return (
    <svg className="curve" viewBox="0 0 600 400" aria-label={title}>
      <defs>
        <path id={`c-top-${k}`} d={topPath} />
        <path id={`c-bottom-${k}`} d={bottomPath} />
      </defs>
      <text className="curve-text" textAnchor="middle" style={style}>
        <textPath href={`#c-top-${k}`} startOffset="50%">{first}</textPath>
      </text>
      <text className="curve-text" textAnchor="middle" style={style}>
        <textPath href={`#c-bottom-${k}`} startOffset="50%">{second}</textPath>
      </text>
    </svg>
  );
}

/* ---------- thumbprints: 1 central pocket, 2 plain whorl, 3 ulnar loop, 4 accidental, 5 double loop, 6 radial loop ---------- */
const loopSet = (n: number, cy: number, h0: number, hs: number, x0: number, xs: number, mirror = false) =>
  Array.from({ length: n }, (_, i) => {
    const h = h0 + i * hs;
    const x = x0 - i * xs;
    return mirror
      ? `M 0 ${cy + h} C ${100 - x} ${cy + h}, ${100 - x} ${cy - h}, 0 ${cy - h}`
      : `M 100 ${cy + h} C ${x} ${cy + h}, ${x} ${cy - h}, 100 ${cy - h}`;
  });
const archesTop = (ys: number[]) => ys.map((b) => `M 0 ${b + 18} Q 55 ${b - 12} 100 ${b}`);
const linesBottom = (ys: number[]) => ys.map((b) => `M 0 ${b - 16} Q 55 ${b + 12} 100 ${b}`);

type Ring = [number, number, number, number, number]; // cx, cy, rx, ry, rotation

function Thumb({ kind }: { kind: number }) {
  const k = kind % 6;
  let paths: string[] = [];
  let rings: Ring[] = [];
  let flip = false;

  if (k === 0) {
    // central pocket loop: tilted loops inside concentric rings
    for (let i = 3; i <= 6; i++) rings.push([50, 65, 5 + i * 7.5, 7 + i * 10, 0]);
    for (let j = 0; j < 3; j++) rings.push([50, 65, 4 + j * 5, 10 + j * 7, -25]);
  } else if (k === 1) {
    // plain whorl: concentric rings
    for (let i = 0; i < 7; i++) rings.push([50, 65, 5 + i * 7.5, 7 + i * 10, 0]);
  } else if (k === 2 || k === 5) {
    // ulnar loop (opens right); radial loop is the mirror image (opens left)
    paths = [...loopSet(7, 70, 4, 6, 60, 17), ...archesTop([24, 14, 4]), ...linesBottom([118, 128])];
    flip = k === 5;
  } else if (k === 3) {
    // accidental: a loop, a tilted whorl and tented arches mixed together
    paths = [
      ...loopSet(3, 28, 3, 5, 55, 22, true),
      "M 0 112 Q 50 98 100 112",
      "M 0 121 Q 50 107 100 121",
    ];
    for (let i = 0; i < 3; i++) rings.push([50, 70, 5 + i * 7, 8 + i * 9, 25]);
  } else {
    // double loop: one loop opens right, one opens left, interlocking
    paths = [
      ...loopSet(4, 46, 3, 5, 55, 22),
      ...loopSet(4, 84, 3, 5, 55, 22, true),
      ...archesTop([20, 10, 0]),
      ...linesBottom([118, 128]),
    ];
  }

  const id = `thumb-clip-${kind}`;
  return (
    <svg className="thumb" viewBox="0 0 100 130" aria-hidden>
      <defs>
        <clipPath id={id}>
          <ellipse cx="50" cy="65" rx="45" ry="61" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={flip ? "translate(100 0) scale(-1 1)" : undefined}>
          {paths.map((d, i) => (
            <path key={`p${i}`} d={d} />
          ))}
          {rings.map(([cx, cy, rx, ry, rot], i) => (
            <ellipse key={`r${i}`} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

const THUMBS = [
  "/thumbs/1-central-pocket.png",
  "/thumbs/2-plain-whorl.png",
  "/thumbs/3-ulnar-loop.png",
  "/thumbs/4-accidental.png",
  "/thumbs/5-double-loop.png",
  "/thumbs/6-radial-loop.png",
];

function Bouncy({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} aria-hidden>
          <span className="word">
            {word.split("").map((c, ci) => {
              const i = n++;
              return (
                <span
                  key={ci}
                  className="bl"
                  style={{
                    ["--r" as string]: ROT[i % ROT.length],
                    ["--y" as string]: LIFT[i % LIFT.length],
                  } as CSSProperties}
                >
                  <span className="lt">{c}</span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

/* ---------- component ---------- */
export default function Services() {
  const { cells, dirs } = useMemo(() => buildPath(SERVICES.length), []);
  const m = cells.length - 1;
  const maxX = Math.max(...cells.map((c) => c.x));
  const maxY = Math.max(...cells.map((c) => c.y));

  const secRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sec = secRef.current!;
    const world = worldRef.current!;
    const stage = sec.querySelector<HTMLElement>(".svc-stage")!;
    let sw = stage.clientWidth;
    let sh = stage.clientHeight;
    let target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let raf = 0;

    const paint = () => {
      world.style.transform = `translate3d(${-cur.x * sw}px, ${-cur.y * sh}px, 0)`;
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.14;
      cur.y += (target.y - cur.y) * 0.14;
      paint();
      if (Math.abs(target.x - cur.x) > 0.0005 || Math.abs(target.y - cur.y) > 0.0005) {
        raf = requestAnimationFrame(loop);
      } else {
        cur = { ...target };
        paint();
        raf = 0;
      }
    };
    const read = () => {
      const r = sec.getBoundingClientRect();
      const total = Math.max(r.height - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const u = p * (m + SPAN);
      const s = Math.min(Math.floor(u), m);
      const f = s >= m ? 0 : u - s;
      let x = cells[s].x;
      let y = cells[s].y;
      if (s < m && f > DWELL) {
        const t = ease((f - DWELL) / (1 - DWELL));
        x += (cells[s + 1].x - cells[s].x) * t;
        y += (cells[s + 1].y - cells[s].y) * t;
      }
      target = { x, y };
      const now = s < m && f > 0.6 ? s + 1 : s;
      setActive((prev) => (prev === now ? prev : now));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const measure = () => {
      sw = stage.clientWidth;
      sh = stage.clientHeight;
      sec.style.setProperty("--sw", `${sw}px`);
      sec.style.setProperty("--sh", `${sh}px`);
      read();
    };

    measure();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [cells, m]);

  const pos = (i: number): CSSProperties => ({
    left: `calc(var(--sw) * ${cells[i].x})`,
    top: `calc(var(--sh) * ${cells[i].y})`,
  });

  const HEADING = "WHAT WE DO";

  return (
    <section
      ref={secRef}
      className="svc"
      aria-label="What we provide"
      style={{ height: `calc(${(m + SPAN) * 90}vh + 100vh)`, ["--hand" as string]: hand.style.fontFamily } as CSSProperties}
    >
      <style>{css}</style>

      {/* pencil roughness shared by every drawing */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="svc-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </svg>

      <div className="svc-stage">
  <PaperLayer seed={21} strength={0.18} className="z-0" />
  <div
    ref={worldRef}
          className="svc-world"
          style={{ width: `calc(var(--sw) * ${maxX + 1})`, height: `calc(var(--sh) * ${maxY + 1})` }}
        >
          {/* 0: intro */}
          <div className="cell cell-intro" data-on={active === 0 ? 1 : 0} style={pos(0)}>
            <span className="svc-tag">
              <i aria-hidden>⋮</i> Our services
            </span>
           <h2 className="svc-intro-title" aria-label={HEADING}>
  {HEADING.split(" ").map((word, wi, words) => {
    const offset = words.slice(0, wi).join(" ").length + (wi > 0 ? 1 : 0);
    return (
      <span key={wi} aria-hidden>
        <span className="word">
          {word.split("").map((c, ci) => (
            <span
              key={ci}
              className="letter"
              style={{
                transitionDelay: `${(offset + ci) * 45}ms`,
                ["--r" as string]: ROT[(offset + ci) % ROT.length],
                ["--y" as string]: LIFT[(offset + ci) % LIFT.length],
              } as CSSProperties}
            >
              <span className="lt">{c}</span>
            </span>
          ))}
        </span>
        {wi < words.length - 1 && " "}
      </span>
    );
  })}
</h2>
            {/* <p className="svc-hint">keep scrolling</p> */}
            <Arrow dir={dirs[0]} />
          </div>

          {/* 1..n: services */}
          {SERVICES.map((s, k) => {
            const i = k + 1;
            const flip = k % 2 === 1;
            return (
              <div
                key={s.title}
                className={`cell cell-svc ${flip ? "flip" : ""}`}
                data-on={active === i ? 1 : 0}
                style={pos(i)}
              >
                <PencilNumber n={k + 1} />
                <h2 className="big">{s.title.toUpperCase()}</h2>

                <div className="svc-card">
                  <img className="thumb" src={THUMBS[k % THUMBS.length]} alt="" />
                  {s.image && <img src={s.image} alt="" />}
                </div>
{/* 
                <Note text={s.note} /> */}
                <p className="svc-text">{s.text}</p>
                <Arrow dir={dirs[i]} />
              </div>
            );
          })}

          {/* closing */}
          <div className="cell cell-end" data-on={active === m ? 1 : 0} style={pos(m)}>
            <div className="svc-panel">
  <h2 aria-label="WE STAY AFTER LAUNCH.">
    <Bouncy text="WE STAY AFTER LAUNCH." />
  </h2>
 <p>Hosting, backups, security and ongoing support, handled by the same team that built it.</p>
</div>
          </div>
        </div>
      </div>

      {/* round bottom edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "20vh",
          overflow: "hidden",
          zIndex: 10,
          pointerEvents: "none",
          background: "#023e8a",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-10vw",
            width: "120vw",
            top: "-20vh",
            height: "40vh",
            borderRadius: "50%",
            background: "#0077B6",
          }}
        />
      </div>
    </section>
  );
}

/* Palette: lighter blues from your Coolors set, none used by hero/founders/footer. */
const css = `
.svc{--bg:#0077B6;--blue:#48CAE4;--ink:#CAF0F8;--accent:#CAF0F8;--tape:#90E0EF;
  --sw:100vw;--sh:100vh;position:relative;background:var(--bg);color:var(--ink)}
.svc-stage{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--bg)}
.svc-world{position:absolute;left:0;top:0;will-change:transform}
.cell{position:absolute;width:var(--sw);height:var(--sh)}

/* pencil drawings */
.draw{filter:url(#svc-rough);overflow:visible;pointer-events:none}
.draw path{fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.1s cubic-bezier(.6,0,.3,1) .2s}
.cell[data-on="1"] .draw path{stroke-dashoffset:0}
.svc-num .ring{stroke-width:3.5}
.svc-num .dig{stroke:var(--accent);stroke-width:6;transition-delay:.55s}

/* intro */
.cell-intro{display:grid;place-content:center;justify-items:center;text-align:center;padding:0 5vw}
.svc-tag{background:var(--ink);color:var(--bg);font-weight:800;padding:10px 18px;border-radius:10px;transform:rotate(-2deg)}
.svc-tag i{font-style:normal;opacity:.6;margin-right:8px}
.svc-intro-title{margin:26px 0 0;font-weight:900;line-height:.92;letter-spacing:-.01em;
  font-size:clamp(48px,min(12vw,22vh),190px);max-width:11ch;color:var(--accent)}
.letter{display:inline-block;opacity:0;transform:translateY(60%) rotate(6deg);
  transition:opacity .5s ease,transform .7s cubic-bezier(.2,1.4,.4,1)}
.cell[data-on="1"] .letter{opacity:1;transform:none}
.svc-hint{position:absolute;left:50%;bottom:7%;transform:translateX(-50%) rotate(-3deg);margin:0;
  font-family:var(--hand);font-size:clamp(20px,2.2vw,32px)}

/* service cells */
.big{position:absolute;left:50%;top:50%;width:92%;margin:0;text-align:center;font-weight:900;line-height:.86;
  font-size:clamp(60px,min(19vw,30vh),300px);color:rgba(202,240,248,.55);z-index:1;
  transform:translate(-50%,-50%) scale(.9);opacity:.25;transition:transform .8s cubic-bezier(.2,.9,.3,1),opacity .6s}
.cell[data-on="1"] .big{transform:translate(-50%,-50%) scale(1);opacity:1}

.svc-num{position:absolute;left:2%;top:1%;width:clamp(60px,7vw,110px);height:auto;z-index:3}
.flip .svc-num{left:auto;right:2%}

.svc-card{position:absolute;right:9%;top:24%;width:clamp(150px,21vw,380px);aspect-ratio:4/5;z-index:2;
  --rot:5deg;background:none;box-shadow:none;
  opacity:0;transform:translateY(60px) rotate(-14deg) scale(.88);
  transition:opacity .7s ease .3s,transform .9s cubic-bezier(.2,1.2,.4,1) .3s}
.flip .svc-card{right:auto;left:9%;--rot:-5deg}
.cell[data-on="1"] .svc-card{opacity:1;transform:rotate(var(--rot))}
.svc-card img,.svc-card .ph{width:100%;height:100%;object-fit:cover;border-radius:inherit}
.svc-card .ph{display:grid;place-items:center;font-family:var(--hand);font-size:clamp(20px,2vw,30px);color:var(--accent)}
.tape{position:absolute;left:50%;top:-5%;width:62%;height:11%;transform:translateX(-50%) rotate(-3deg);
  background:var(--tape);opacity:.9;z-index:3;box-shadow:0 2px 0 rgba(3,4,94,.12)}

.svc-note{position:absolute;left:50%;bottom:5%;margin-left:6%;width:clamp(150px,15vw,240px);aspect-ratio:200/130;z-index:3}
.flip .svc-note{left:auto;right:50%;margin-left:0;margin-right:6%}
.svc-note svg{position:absolute;inset:0;width:100%;height:100%}
.svc-note p{position:relative;margin:0;padding:24px 8px 0 36px;font-family:var(--hand);
  font-size:clamp(15px,1.3vw,21px);line-height:1.05;transform:rotate(-4deg)}

.svc-text{position:absolute;left:7%;bottom:9%;margin:0;max-width:30ch;z-index:3;font-weight:600;color:#FFFFFF;
  font-size:clamp(15px,1.5vw,21px);line-height:1.45}
.flip .svc-text{left:auto;right:7%;text-align:right}

/* arrows */
.svc-arrow{position:absolute;width:clamp(120px,16vw,260px);height:auto;z-index:3}
.svc-arrow path{stroke-width:2.6}
.arr-R{right:2%;top:60%}
.arr-D{left:50%;bottom:6vw;transform:translateX(-50%) rotate(90deg)}
.arr-U{left:50%;top:6vw;transform:translateX(-50%) rotate(-90deg)}

/* closing */
.cell-end{display:grid;place-items:center}
.svc-panel{position:relative;width:min(80%,1300px);height:76%;display:grid;place-content:center;text-align:center;
  background:none;color:#CAF0F8;
  transform:scale(.92) rotate(-1deg);opacity:.4;transition:transform .9s cubic-bezier(.2,1.2,.4,1),opacity .6s}
.cell-end[data-on="1"] .svc-panel{transform:none;opacity:1}
.svc-panel h2{margin:0;font-weight:900;line-height:.9;font-size:clamp(44px,min(10vw,17vh),170px)}
.svc-panel p{margin:18px auto 0;max-width:36ch;font-weight:600;font-size:clamp(16px,1.8vw,26px)}
.svc-panel .tape{left:-3%;top:40%;width:9%;height:24%;transform:rotate(-4deg);background:#48CAE4}

@media (max-width:700px){
  .svc-card{right:6%;top:30%;width:34vw}
  .flip .svc-card{left:6%}
  .svc-text{bottom:14%;max-width:24ch}
  .svc-note{display:none}
}
@media (prefers-reduced-motion:reduce){
  .draw path{transition:none;stroke-dashoffset:0}
  .letter,.big,.svc-card,.svc-panel{transition:none;opacity:1;transform:none}
  .svc-card{transform:rotate(var(--rot))}
  .big{transform:translate(-50%,-50%)}
}

.big,.svc-panel h2{font-family:var(--font-condensed);font-weight:400}
.svc-tag{font-family:var(--font-heading);font-weight:400}


/* thumbprints */
.thumb{position:absolute;right:4%;top:-14%;width:36%;height:auto;z-index:3;
  transform:rotate(-14deg);opacity:.9;pointer-events:none}
.flip .thumb{right:auto;left:4%;transform:rotate(14deg)}

.word{display:inline-block;white-space:nowrap}
.cell[data-on="1"] .letter{opacity:1;transform:translateY(calc(var(--y) * 1em)) rotate(calc(var(--r) * 1deg))}
.svc .svc-intro-title{font-family:var(--font-heading);font-weight:400;max-width:none;
  line-height:.82;letter-spacing:.01em;font-size:min(15vw,29vh);color:var(--accent)}
.svc .svc-intro-title .letter,.svc .svc-intro-title .lt{font-family:inherit;font-weight:inherit}
.svc .svc-intro-title .lt{display:inline-block;
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);will-change:transform}
.svc .svc-intro-title .lt:hover{
  transform:translateY(-.07em) rotate(5deg) scale(1.14)}

.svc .svc-panel h2{font-family:var(--font-heading);font-weight:400;line-height:.9;letter-spacing:.01em;
  font-size:clamp(44px,min(11vw,19vh),190px)}
.svc .svc-panel p{font-family:var(--font-heading);font-weight:400;line-height:1.25;letter-spacing:.02em;
  max-width:34ch;font-size:clamp(20px,2.2vw,32px)}

.svc .bl{display:inline-block;
  transform:translateY(calc(var(--y) * 1em)) rotate(calc(var(--r) * 1deg))}
.svc .bl .lt{display:inline-block;font-family:inherit;font-weight:inherit;
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);will-change:transform}
.svc .bl .lt:hover{transform:translateY(-.07em) rotate(5deg) scale(1.14)}

`;