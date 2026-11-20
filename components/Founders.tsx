"use client";

import { useState } from "react";
import Image from "next/image";
import PaperLayer from "./PaperLayer";


const HEADING = { fontFamily: "var(--font-heading)" } as const;
const BG = "#023e8a"; // same background for every founder

//  Edit names, roles and the short bios here
const FOUNDERS = [
  {
    name: "Nargis Niaz",
    first: "NARGIS",
    second: "NIAZ",
    role: "Chair Person",
    img: "/founders/Mother.png",
    bio: "الدعوات وراء كل شيء",
  },
  {
    name: "Muhammad Khalid",
    first: "MUHAMMAD",
    second: "KHALID",
    role: "Chief Executive Officer",
    img: "/founders/Baba.png",
    bio: "The vision behind every build.",
  },
  {
    name: "Muhammad Adam Khan",
    first: "MUHAMMAD",
    second: "ADAM",
    role: "Board Of Director",
    img: "/founders/Adam.png",
    bio: "A firm hand on strategy, A steady mind on direction..",
  },
  {
    name: "Malaika Khalid",
    first: "MALAIKA",
    second: "KHALID",
    role: "Board Of Director",
    img: "/founders/Malaika.png",
    bio: "Forging Systems, Courting Reverie, Questioning Why.",
  },
];

const CSS = `
@keyframes founder-in {
  from { opacity: 0; transform: translateY(0.35em) rotate(-3deg); }
  to { opacity: 1; transform: none; }
}
.founder-in { animation: founder-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes ring-spin { to { transform: rotate(360deg); } }
.ring-spin { animation: ring-spin 24s linear infinite; }
.f-photo { width: min(44vw, 26vh); }
@media (min-width: 768px) {
  .f-photo { width: min(max(28vw, 200px), 36vh); }
}

`;

export default function Founders() {
  const [active, setActive] = useState(0);
  const current = FOUNDERS[active];
  const next = () => setActive((a) => (a + 1) % FOUNDERS.length);

  const [nudge, setNudge] = useState({ x: 0, y: 0, r: 0, s: 1 });

  const hoverNudge = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    // leans away from the cursor, follows it smoothly
    setNudge({ x: -dx * 12, y: -dy * 12, r: dx * 3, s: 1.02 });
  };

  const resetNudge = () => setNudge({ x: 0, y: 0, r: 0, s: 1 });
  // big curved names behind the photo
// (the drawing area is 3x the photo, and the photo's radius is 50)
const fitName = (t: string) => Math.max(34, Math.min(64, 190 / (t.length * 0.56)));
const fsTop = fitName(current.first);
const fsBottom = fitName(current.second);
const CAP = 0.86; // letter height relative to font size
const R_TOP = 280;
const R_BOTTOM = 330;
const HALF = 135;
const topCy = 88 + 0.26 * CAP * fsTop + R_TOP;
const topEdgeY = topCy - Math.sqrt(R_TOP ** 2 - HALF ** 2);
const bottomCy = 214 + 0.74 * CAP * fsBottom - R_BOTTOM;
const bottomEdgeY = bottomCy + Math.sqrt(R_BOTTOM ** 2 - HALF ** 2);
const topPath = `M ${150 - HALF} ${topEdgeY} A ${R_TOP} ${R_TOP} 0 0 1 ${150 + HALF} ${topEdgeY}`;
const bottomPath = `M ${150 - HALF} ${bottomEdgeY} A ${R_BOTTOM} ${R_BOTTOM} 0 0 0 ${150 + HALF} ${bottomEdgeY}`;

  return (
    <section
  className="relative isolate min-h-[100svh] overflow-hidden text-[#03045e]"
  style={{ backgroundColor: BG }}
>
      <style>{CSS}</style>
      <PaperLayer seed={12} strength={0.5} className="z-[16]" />

      {/* round top edge: services blue dips into this section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-[20vh] overflow-hidden"
      >
        <div
          className="absolute"
          style={{
            left: "-10vw",
            width: "120vw",
            top: "-20vh",
            height: "40vh",
            borderRadius: "50%",
            overflow: "hidden",
            background: BG,
          }}
        />
      </div>

      {/* top tag */}
      <div
  className="absolute left-1/2 top-[6vh] z-20 -translate-x-1/2 -rotate-2 whitespace-nowrap rounded-md bg-[#ade8f4] px-3 py-2 text-xs font-normal uppercase tracking-wide text-[#03045e] shadow-md md:px-4 md:text-sm"
  style={HEADING}
>
        <span className="mr-2 opacity-60">⋮</span>Meet the people behind it
      </div>

      {/* left: role chip + bio */}
      <div className="absolute left-4 top-[34%] z-20 hidden md:block">
        <div
  className="rounded-md bg-[#ade8f4] px-3 py-2 text-sm font-normal uppercase tracking-wide text-[#03045e] shadow-md"
  style={HEADING}
>
  <span className="mr-2 opacity-60">⋮</span>
  {current.role}
</div>
      </div>
      <p
        key={`bio-${active}`}
        className="founder-in absolute bottom-[24%] left-4 z-20 hidden max-w-[20vw] text-lg font-bold leading-snug text-[#caf0f8] md:block"
      >
        {current.bio}
            </p>

      {/* phone: role + bio under the photo */}
      <div className="absolute inset-x-0 bottom-[22vh] z-20 flex flex-col items-center gap-2 px-8 text-center md:hidden">
        <div
          className="rounded-md bg-[#ade8f4] px-3 py-2 text-xs font-normal uppercase tracking-wide text-[#03045e] shadow-md"
          style={HEADING}
        >
          <span className="mr-2 opacity-60">⋮</span>
          {current.role}
        </div>
        <p
          key={`bio-m-${active}`}
          className="founder-in text-base font-bold leading-snug text-[#caf0f8]"
        >
          {current.bio}
        </p>
      </div>

      {/* centre: photo + explore badge + name */}
      <div className="relative z-[17] flex min-h-[100svh] flex-col items-center justify-center px-4 pb-[14vh] md:pb-0">
  <div
    className="f-photo relative"
    style={{ aspectRatio: "1 / 1" }}
  >
{/* big curved names, sitting behind the photo */}
<svg
  key={`names-${active}`}
  aria-hidden
  viewBox="0 0 300 300"
  className="founder-in pointer-events-none absolute -left-full -top-full z-0 h-[300%] w-[300%] overflow-visible"
>
  <defs>
    <path id="name-top" d={topPath} />
    <path id="name-bottom" d={bottomPath} />
  </defs>
  <text
    fill="rgba(202,240,248,0.55)"
    textAnchor="middle"
    style={{ fontFamily: "var(--font-condensed)", fontSize: fsTop, letterSpacing: fsTop * 0.04 }}
  >
    <textPath href="#name-top" startOffset="50%">
      {current.first}
    </textPath>
  </text>
  <text
    fill="rgba(202,240,248,0.55)"
    textAnchor="middle"
    style={{ fontFamily: "var(--font-condensed)", fontSize: fsBottom, letterSpacing: fsBottom * 0.1 }}
  >
    <textPath href="#name-bottom" startOffset="50%">
      {current.second}
    </textPath>
  </text>
</svg>
          {/* soft halo */}
          <div className="absolute inset-[-7%] rounded-full bg-[rgba(202,240,248,0.35)]" />

          {/* the photos: all stacked, the active one pops in */}
          <div
            onPointerMove={hoverNudge}
            onPointerLeave={resetNudge}
            className="absolute inset-0 cursor-pointer select-none overflow-hidden rounded-full border-[6px] border-[#caf0f8] bg-[#023e8a] shadow-2xl"
            style={{
              transform: `translate(${nudge.x}px, ${nudge.y}px) rotate(${nudge.r}deg) scale(${nudge.s})`,
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {FOUNDERS.map((f, i) => (
              <div
                key={f.name}
                aria-hidden={i !== active}
                className="absolute inset-0"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "rotate(0deg) scale(1)" : "rotate(-14deg) scale(0.7)",
                  transition:
                    "opacity 0.45s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <Image
                  src={f.img}
                  alt={f.name}
                  fill
                  sizes="(max-width: 768px) 70vw, 40vw"
                  className="object-cover"
                  priority={i === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* EXPLORE badge: the small arrow button changes the founder */}
          <div
            className="absolute -right-[26%] -top-[8%] z-20 aspect-square w-[46%]"
            style={{ containerType: "inline-size" }}
          >
            <div className="absolute inset-0 rounded-full bg-[#caf0f8] shadow-xl" />
            <div className="ring-spin absolute inset-[7%] rounded-full border-2 border-dotted border-[#03045e]" />
            <span
              className="absolute inset-0 flex -rotate-[12deg] items-center justify-center pb-[14%] uppercase text-[#03045e]"
              style={{ ...HEADING, fontSize: "17cqw" }}
            >
              Explore
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next founder"
              className="absolute left-1/2 top-[62%] grid h-[24%] w-[24%] -translate-x-1/2 place-items-center rounded-full bg-[#03045e] text-[#caf0f8] shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-1/2 w-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* right: clickable thumbnails */}
      <div className="absolute bottom-[8vh] left-1/2 z-20 flex -translate-x-1/2 flex-row items-center gap-3 md:bottom-auto md:left-auto md:right-3 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:gap-[1.6vh]">
        <span
          className="-rotate-12 text-xs font-extrabold uppercase tracking-wide text-[#caf0f8]"
          style={HEADING}
        >
          Browse
        </span>
        {FOUNDERS.map((f, i) => (
          <button
            key={f.name}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${f.name}`}
            className={`relative overflow-hidden rounded-full border-4 transition-all ${
              i === active
                ? "scale-110 border-[#caf0f8] ring-2 ring-[#caf0f8]/60"
                : "border-[#caf0f8] opacity-80 hover:scale-105 hover:opacity-100"
            }`}
            style={{ width: "min(max(7vw, 44px), 10vh)", height: "min(max(7vw, 44px), 10vh)" }}
          >
            <Image src={f.img} alt="" fill sizes="120px" className="object-cover" unoptimized />
          </button>
        ))}
      </div>

      {/* round bottom edge: founders blue bulges down into the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[20vh] overflow-hidden"
        style={{ background: "#03045e" }}
      >
        <div
          className="absolute"
          style={{
            left: "-10vw",
            width: "120vw",
            top: "-20vh",
            height: "40vh",
            borderRadius: "50%",
            overflow: "hidden",
            background: BG,
          }}
        />
      </div>
    </section>
  );
}