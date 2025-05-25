// frontend/src/app/components/AnimatedBackground.tsx

export default function AnimatedBackground() {
  return (
    <>
      {/* Subtle background pattern from your latest UI */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            // Consider making rgb(148 163 184) a Tailwind color for consistency if possible
            // e.g., if slate-400 is rgb(148 163 184) then:
            // backgroundImage: `radial-gradient(circle at 1px 1px, theme('colors.slate.400') 1px, transparent 0)`,
            // However, inline style with rgb is fine for this.
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      {/* Optional: Add back other animated blobs if desired */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-float delay-700"></div>
      </div> */}
    </>
  );
}