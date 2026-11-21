"use client";

import { useState } from "react";

const HEADING = { fontFamily: "var(--font-heading)" } as const;
const TO = "your@email.com"; // 👉 where messages should go

const field =
  "w-full rounded-[1.75rem] bg-[#c6eef8] px-6 py-5 text-[#03045e] uppercase tracking-wide placeholder:text-[#03045e]/50 outline-none focus:ring-2 focus:ring-[#03045e]";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  // No backend yet: this opens the visitor's email app with the message filled in.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Name: ${d.get("name")}\nCompany: ${d.get("company")}\nPhone: ${d.get("phone")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_220px]" style={HEADING}>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required placeholder="Name" className={field} style={HEADING} />
        <input name="company" placeholder="Company" className={field} style={HEADING} />
        <input name="phone" type="tel" placeholder="Phone number" className={field} style={HEADING} />
        <input name="email" type="email" required placeholder="Email" className={field} style={HEADING} />
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Message"
          className={`${field} md:col-span-2`}
          style={HEADING}
        />
      </div>
      <button
        type="submit"
        className="min-h-[72px] rounded-[2rem] bg-[#48cae4] text-2xl uppercase tracking-wide text-[#03045e] shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
      >
        {sent ? "Thank you" : "Send"}
      </button>
    </form>
  );
}