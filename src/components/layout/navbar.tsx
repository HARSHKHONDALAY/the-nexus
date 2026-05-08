export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="text-xl font-semibold">
          The Nexus
        </div>

        <nav className="flex gap-6 text-sm text-white/70">
          <a href="#">Home</a>
          <a href="#">Events</a>
          <a href="#">Community</a>
        </nav>
      </div>
    </header>
  );
}