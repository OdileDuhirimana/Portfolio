"use client";
import ContactForm from "@/components/ContactForm";
import { Github, Instagram, MessageCircle, Twitter, Mail, Phone } from "lucide-react";

export default function ContactPageClient() {
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-2 text-(--muted)">Send me a message and I will get back to you.</p>

      <div className="mt-6 grid gap-8 md:grid-cols-2 items-start">
        <div>
          <ContactForm />
        </div>
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-6 overflow-hidden max-w-full">
          <h2 className="font-semibold mb-3">Connect</h2>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/OdileDuhirimana" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><Github className="w-4 h-4"/> GitHub</a>
            <a href="https://wa.me/250798980237?text=Hi%20Odile%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><MessageCircle className="w-4 h-4"/> WhatsApp</a>
            <a href="https://twitter.com/duhirimanaOdile" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><Twitter className="w-4 h-4"/> X</a>
            <a href="mailto:odileduhirimana@gmail.com" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><Mail className="w-4 h-4"/> Email</a>
            <a href="https://www.instagram.com/sky_lla320/" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><Instagram className="w-4 h-4"/> Instagram</a>
            <a href="tel:+250798980237" className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap"><Phone className="w-4 h-4"/> +250 798 980 237</a>
          </div>
        </div>
      </div>
    </main>
  );
}
