import type { CSSProperties } from "react";
import PaperLayer from "./PaperLayer";
import Image from "next/image";

const ROT = [-6, 4, -3, 7, -5, 3, -4, 6];
const LIFT = [0.02, -0.04, 0.03, -0.02, 0.04, -0.03, 0.02, -0.04];

type Word = { text: string; boxed?: boolean };

//  Change the words here
const TAGLINE = ["Thy Tech Contrivances"];
const LEFT_WORD = "WE'RE";
const RIGHT_WORD = "HERE TO";
const LINES: Word[][] = [
  [{ text: "BUILD" }],
  [{ text: "WITH" }, { text: "YOU" }],
];

const HERO_CSS = `
.hero-letter {
  display: inline-block;
  transform: translateY(calc(var(--y) * 1em)) rotate(calc(var(--r) * 1deg)) scale(1);
  text-shadow: var(--sh);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.35s;
  will-change: transform;
}
.hero-letter:hover {
  transform: translateY(calc(var(--y) * 1em - 0.07em)) rotate(calc(var(--r) * 1deg + 5deg)) scale(1.14);
}

/* ---------- responsive sizing ---------- */
.hero-fp   { left: 2vw; top: 4vh; width: 16vw; }
.hero-top  { font-size: min(5vw, 7.5vh); }
.hero-h1   { font-size: min(17vw, 29vh); }
.hero-tag  { font-size: 0.875rem; }

/* tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero-fp  { left: 3vw; top: 3vh; width: 20vw; }
  .hero-top { font-size: min(6vw, 6vh); }
  .hero-h1  { font-size: min(19vw, 24vh); }
}

/* phones: stack everything and fill the screen */
@media (max-width: 767px) {
  .hero-fp  { left: 4vw; top: 3vh; width: 30vw; }
  .hero-tag { font-size: 0.65rem; }
  .hero-top {
    flex-direction: column;
    gap: 0 !important;
    font-size: min(14vw, 8vh);
    line-height: 1.05 !important;
  }
  .hero-h1  { font-size: min(28vw, 18vh); }
  .hero-line {
    flex-direction: column;
    gap: 0.03em !important;
  }
  .hero-content {
    padding: 0 8vw 10vh;
    width: 100%;
  }
}
`;

const SHADOW_ON_LIGHT = "none";
const SHADOW_ON_DARK = "0.03em 0.035em 0 rgba(1, 2, 46, 0.55)";

export default function Hero() {
  let n = 0;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#caf0f8] text-[#03045e]">
      <style>{HERO_CSS}</style>
      <PaperLayer seed={34} strength={0.5} className="z-[6]" />

      {/* fingerprint with the tagline written across it */}
      <div className="hero-fp absolute z-20">
        <Image
          src="/thumbs/2-plain-whorl-darkblue.png"
          alt=""
          aria-hidden
          width={520}
          height={680}
          priority
          className="pointer-events-none select-none"
          style={{ width: "100%", height: "auto", transform: "rotate(-10deg)", opacity: 0.9 }}
        />
        <div
          className="hero-tag absolute -left-[4%] top-[44%] whitespace-nowrap border-l-2 border-dotted border-[#03045e] pl-3 font-extrabold uppercase leading-tight tracking-wide"
          style={{ textShadow: "0 0 8px #caf0f8, 0 0 3px #caf0f8, 0 0 3px #caf0f8" }}
        >
          {TAGLINE.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>
      </div>

      <div className="hero-content relative z-10 flex flex-col items-center px-4">
        {/* WE'RE HERE TO */}
        <div
          className="hero-top flex items-center justify-center gap-[0.35em]"
          style={{ fontFamily: "var(--font-heading)", lineHeight: 1 }}
        >
          <span>{LEFT_WORD}</span>
          <span>{RIGHT_WORD}</span>
        </div>

        {/* Giant headline */}
        <h1
          aria-label="Build with you"
          className="hero-h1 mt-[1.5vh] flex flex-col items-center uppercase"
          style={{
            fontFamily: "var(--font-heading)",
            lineHeight: 0.82,
            letterSpacing: "0.01em",
          }}
        >
          {LINES.map((line, li) => (
            <span
              key={li}
              aria-hidden
              className="hero-line flex items-center justify-center gap-[0.22em]"
              style={{ marginTop: li ? "0.03em" : 0 }}
            >
              {line.map((word) => (
                <span
                  key={word.text}
                  className="inline-flex"
                  style={
                    word.boxed
                      ? {
                          background: "#03045e",
                          color: "#caf0f8",
                          padding: "0.02em 0.1em 0.05em",
                          transform: "rotate(-2deg)",
                        }
                      : undefined
                  }
                >
                  {word.text.split("").map((ch) => {
                    const i = n++;
                    return (
                      <span
                        key={i}
                        className="hero-letter"
                        style={
                          {
                            "--r": ROT[i % ROT.length],
                            "--y": LIFT[i % LIFT.length],
                            "--sh": word.boxed ? SHADOW_ON_DARK : SHADOW_ON_LIGHT,
                          } as CSSProperties
                        }
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* round bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[20vh] overflow-hidden"
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
            background: "#caf0f8",
          }}
        />
      </div>
    </section>
  );
}