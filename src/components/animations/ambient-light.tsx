export default function AmbientLight() {
  return (
    <>
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

      <div
        className="
          pointer-events-none
          fixed
          bottom-[-18.75rem]
          right-[-6.25rem]
          h-[25rem]
          w-[25rem]
          rounded-full
          bg-cyan-400/10
          blur-[140px]
          z-0
        "
      />
    </>
  );
}
