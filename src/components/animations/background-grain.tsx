export default function BackgroundGrain() {
  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        z-[2]
        opacity-[0.05]
        mix-blend-soft-light
      "
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.06) 0.6px, transparent 0.6px)",
        backgroundSize: "3px 3px",
      }}
    />
  );
}