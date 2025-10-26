export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur supports-backdrop-filter:bg-black/30 bg-black/30 border-b border-(--line)">
      <div className="container mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <a href="/" className="font-semibold">ODILE</a>
        <div className="flex items-center gap-4 text-sm">
          <a href="/projects" className="relative group">
            <span className="transition-colors group-hover:text-(--gold)">Projects</span>
            <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-(--gold) transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/about" className="relative group">
            <span className="transition-colors group-hover:text-(--gold)">About</span>
            <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-(--gold) transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/contact" className="relative group">
            <span className="transition-colors group-hover:text-(--gold)">Contact</span>
            <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-(--gold) transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/resume" className="rounded-lg border px-3 py-1.5 hover:bg-white/5">Resume</a>
        </div>
      </div>
    </nav>
  );
}
