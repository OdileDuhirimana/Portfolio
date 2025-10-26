export default function Footer() {
  return (
    <footer className="mt-14 border-t border-(--line)">
      <div className="container mx-auto px-6 md:px-8 py-8 text-sm text-(--muted) flex items-center justify-between">
        <p>© {new Date().getFullYear()} Odile Duhirimana</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/OdileDuhirimana" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://twitter.com/duhirimanaOdile" target="_blank" rel="noreferrer">X</a>
          <a href="mailto:odileduhirimana@gmail.com">Email</a>
          <a href="https://wa.me/250798980237?text=Hi%20Odile%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="https://www.instagram.com/sky_lla320/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
