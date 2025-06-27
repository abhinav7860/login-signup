import Aurora from "./Aurora";

export default function AuthLayout({ children }) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Animation */}
      <Aurora colorStops={["#0ea5e9", "#22d3ee", "#818cf8"]} />

      {/* Centered Card with Glass + Glow on Hover */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="group w-full max-w-md p-[2px] rounded-3xl transition-all duration-300">
          <div
            className="relative w-full rounded-3xl bg-white/10 backdrop-blur-xl p-8 shadow-xl border border-white/10 transition-all duration-500 group-hover:shadow-[0_0_30px_0_rgba(0,255,255,0.25),0_0_60px_0_rgba(0,153,255,0.15),0_0_100px_0_rgba(255,0,255,0.1)] group-hover:scale-[1.01]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent 70%)`,
              backgroundBlendMode: "overlay",
              willChange: "transform",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
