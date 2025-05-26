export default function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

     
    </>
  );
}