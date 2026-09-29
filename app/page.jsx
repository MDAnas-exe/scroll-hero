import Hero from "@/components/Hero";

export const metadata = {
  title: "ITZFIZZ // Scroll-Driven Hypercar Hero",
  description:
    "High-performance scroll-driven automotive hero section built with Next.js, Tailwind CSS, and GSAP ScrollTrigger.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* Scroll-Driven Pinned Hero Section */}
      <Hero />

      {/* Follow-up Showcase Section to allow smooth scrolling past the pinned hero */}
      <section className="relative z-20 border-t border-neutral-800/80 bg-neutral-950 py-24 px-6 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              {"// TELEMETRY & SPECIFICATIONS"}
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
              ENGINEERED FOR TERMINAL VELOCITY
            </h2>
            <p className="max-w-2xl text-base text-neutral-400 leading-relaxed">
              Every curve, surface, and aerodynamic foil has been sculpted to slice
              through air resistance. Driven by synchronized tri-motor powertrain
              delivering instantaneous vectoring down to the millisecond.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8">
              <span className="font-mono text-sm text-cyan-400">01 / DYNAMICS</span>
              <h3 className="mt-3 text-xl font-bold text-white">Adaptive Aero Foil</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Dual active spoilers automatically adjust angle of attack dynamically
                in response to velocity, cornering yaw, and braking deceleration.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8">
              <span className="font-mono text-sm text-cyan-400">02 / CHASSIS</span>
              <h3 className="mt-3 text-xl font-bold text-white">Monocoque Carbon Core</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Torsional rigidity exceeding 70,000 Nm/deg with ultra-lightweight
                aerospace carbon fiber weave structure.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8">
              <span className="font-mono text-sm text-cyan-400">03 / POWERTRAIN</span>
              <h3 className="mt-3 text-xl font-bold text-white">Sub-Zero Thermal Array</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Direct-cell dielectric cooling loops maintaining peak battery discharge
                even under sustained high-speed circuit laps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-6 sm:px-12 text-center font-mono text-xs text-neutral-400">
        <p>
          © {new Date().getFullYear()} ITZFIZZ MOTORSPORT. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
