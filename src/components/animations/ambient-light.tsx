export default function AmbientLight() {
  return (
    <>
      {/* Top Glow */}
      <div
        className="
          pointer-events-none
          fixed
          top-[-200px]
          left-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-white/10
          blur-[140px]
          z-0
        "
      />

      {/* Bottom Glow */}
      <div
        className="
          pointer-events-none
          fixed
          bottom-[-300px]
          right-[-100px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-purple-500/10
          blur-[140px]
          z-0
        "
      />
    </>
  );
}