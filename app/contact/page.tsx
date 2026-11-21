import Image from "next/image";
import PaperLayer from "@/components/PaperLayer";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const HEADING = { fontFamily: "var(--font-heading)" } as const;

//  Replace with the real emails and phone numbers
const PEOPLE = [
  { name: "Muhammad Khalid", email: "khalidkhankhan.kk5@gmail.com", phone: "+92 344 9131363", rot: 3, bg: "#90e0ef", thumb: "/thumbs/3-ulnar-loop.png" },
  { name: "Muhammad Adam Khan", email: "adammkhann07@gmail.com", phone: "+92 343 7321876", rot: -2.5, bg: "#ade8f4", thumb: "/thumbs/4-accidental.png" },
  { name: "Malaika Khalid", email: "malaekakhalid85@gmail.com", phone: "+92 346 6228457", rot: 2, bg: "#90e0ef", thumb: "/thumbs/6-radial-loop.png" },
];

const CSS = `
.ct-dots{height:12px;background-image:radial-gradient(circle,#48cae4 3.5px,transparent 4px);
  background-size:26px 12px;background-repeat:repeat-x}
`;

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#caf0f8] px-4 pb-[24vh] pt-40 text-[#03045e] md:px-8">
        <style>{CSS}</style>
        <PaperLayer seed={34} strength={0.5} className="z-[6]" />

        {/* fingerprint with the tagline written across it, same as the hero */}
        <div className="absolute left-[2vw] top-[4vh] z-20 w-[22vw] md:w-[14vw]">
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
            className="absolute -left-[4%] top-[44%] whitespace-nowrap border-l-2 border-dotted border-[#03045e] pl-3 text-[0.65rem] font-extrabold uppercase leading-tight tracking-wide md:text-sm"
            style={{ textShadow: "0 0 8px #caf0f8, 0 0 3px #caf0f8, 0 0 3px #caf0f8" }}
          >
            Thy Tech Contrivances
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* card + notes */}
          <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-0">
            {/* form card */}
            <div className="order-2 lg:order-1 relative z-10 rounded-[2.5rem] bg-[#e8f9fd] px-6 pb-10 pt-0 shadow-xl md:px-12 lg:mr-[-60px] lg:pr-24">
              <div className="ct-dots mx-[-1rem] mt-6 md:mx-[-2rem]" />
              <h2
                className="mb-8 mt-12 uppercase"
                style={{ ...HEADING, fontSize: "clamp(30px,3.6vw,50px)", lineHeight: 0.95 }}
              >
                Drop us a
                <br />
                message
              </h2>
              <ContactForm />
            </div>

            {/* notes with fingerprints */}
            <div className="order-1 lg:order-2 relative z-20 flex flex-col gap-10 lg:mt-0 lg:gap-0">
              {PEOPLE.map((p, i) => (
                <div
                  key={p.name}
                  className="relative p-6 shadow-[6px_12px_20px_rgba(1,2,46,0.28)] lg:-mt-6 lg:first:mt-0"
                  style={{ background: p.bg, transform: `rotate(${p.rot}deg)`, zIndex: i }}
                >
                  <Image
                    src={p.thumb}
                    alt=""
                    aria-hidden
                    width={160}
                    height={200}
                    className="pointer-events-none absolute -top-10 right-4 w-16 -rotate-12 select-none opacity-90"
                  />
             <h3 className="whitespace-nowrap uppercase" style={{ ...HEADING, fontSize: "clamp(16px,1.6vw,22px)", lineHeight: 1 }}>
  {p.name}
</h3>

                  <span
                    className="mt-4 inline-block rounded-md bg-[#03045e] px-2 py-1 text-[11px] uppercase tracking-wide text-[#caf0f8]"
                    style={HEADING}
                  >
                    <span className="mr-1 opacity-60">⋮</span>Email
                  </span>
                  <a href={`mailto:${p.email}`} className="block break-all pb-2 text-sm font-extrabold lowercase">
                    {p.email}
                  </a>
                  <div className="border-t-2 border-dashed border-[#03045e]/50" />

                  <span
                    className="mt-3 inline-block rounded-md bg-[#03045e] px-2 py-1 text-[11px] uppercase tracking-wide text-[#caf0f8]"
                    style={HEADING}
                  >
                    <span className="mr-1 opacity-60">⋮</span>Phone
                  </span>
                  <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="block pb-1 text-sm font-extrabold">
                    {p.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* round bottom edge, same as the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[20vh] overflow-hidden"
          style={{ background: "#03045e" }}
        >
          <div
            className="absolute"
            style={{ left: "-10vw", width: "120vw", top: "-20vh", height: "40vh", borderRadius: "50%", background: "#caf0f8" }}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}