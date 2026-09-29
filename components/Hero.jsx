"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Car from "./Car";
import StatBox from "./StatBox";

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE_TEXT = "WELCOME ITZFIZZ";

const STATS_DATA = [
  {
    value: "99.4%",
    label: "Aero Efficiency",
    subtext: "Cd 0.208 tuned",
  },
  {
    value: "98%",
    label: "Torque Delivery",
    subtext: "Instant response",
  },
  {
    value: "300%",
    label: "Downforce Vector",
    subtext: "High-speed grip",
  },
  {
    value: "100%",
    label: "Electric Tri-Motor",
    subtext: "Carbon-sleeved rotor",
  },
];

export default function Hero() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const letterRefs = useRef([]);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const statsContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrollHintRef = useRef(null);
  const scrollTlRef = useRef(null);

  // Cached letter X positions (relative to road left edge)
  const cachedLetterPositions = useRef([]);
  // Cached road travel distance to prevent layout reads during scroll
  const cachedTravelDistance = useRef(0);
  // Track active illuminated state per letter to prevent redundant DOM operations
  const activeStates = useRef([]);

  // Travel distance calculation: strictly road.clientWidth (no minus carWidth).
  // Car starts at x=0 and ends fully outside right edge, clipped by road overflow-hidden.
  const getTravelDistance = () => {
    if (!roadRef.current) return 0;
    return roadRef.current.clientWidth;
  };

  useGSAP(
    () => {
      // Prevent browser from restoring scroll position midway on page reload
      if (typeof window !== "undefined") {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
      }

      const mm = gsap.matchMedia();

      // Initialize scaleX to 0 using gsap.set to eliminate inline style flash
      if (trailRef.current) gsap.set(trailRef.current, { scaleX: 0 });
      if (progressBarRef.current) gsap.set(progressBarRef.current, { scaleX: 0 });

      // Shared helper to toggle letter active / dormant visual classes
      const setLetterActiveState = (index, shouldBeActive) => {
        const letterEl = letterRefs.current[index];
        if (!letterEl) return;

        // Kill any pending loadTl tweens targeting this letter so opacity is not overridden to 0.25
        gsap.killTweensOf(letterEl);

        if (shouldBeActive) {
          gsap.set(letterEl, {
            opacity: 1,
            y: -4,
            overwrite: "auto",
          });
          letterEl.classList.add(
            "text-cyan-400",
            "drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]"
          );
          letterEl.classList.remove("text-neutral-500");
        } else {
          gsap.set(letterEl, {
            opacity: 0.25,
            y: 0,
            overwrite: "auto",
          });
          letterEl.classList.remove(
            "text-cyan-400",
            "drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]"
          );
          letterEl.classList.add("text-neutral-500");
        }
      };

      // Update letter states strictly without layout reads; toggles only on state change (or force)
      const updateLetters = (currentCarX, force = false) => {
        const positions = cachedLetterPositions.current;
        if (!positions.length) return;

        for (let i = 0; i < letterRefs.current.length; i++) {
          // Letter lights when car rear (currentCarX) >= cached letter center X
          const shouldBeActive = currentCarX >= positions[i];

          if (force || shouldBeActive !== activeStates.current[i]) {
            activeStates.current[i] = shouldBeActive;
            setLetterActiveState(i, shouldBeActive);
          }
        }
      };

      // Measurement function: caches letter center X coordinates and syncs current state
      const measurePositions = () => {
        if (!roadRef.current || !headlineRef.current) return;
        const roadRect = roadRef.current.getBoundingClientRect();

        cachedLetterPositions.current = letterRefs.current.map((span) => {
          if (!span) return 0;
          const rect = span.getBoundingClientRect();
          // Center X of the letter relative to road's left coordinate
          return rect.left - roadRect.left + rect.width / 2;
        });

        // Sync letters with current scroll progress
        cachedTravelDistance.current = getTravelDistance();
        const travel = cachedTravelDistance.current;
        const currentProgress = scrollTlRef.current?.scrollTrigger
          ? scrollTlRef.current.scrollTrigger.progress
          : 0;
        updateLetters(currentProgress * travel, true);
      };

      // Call ScrollTrigger.refresh() after web fonts are completely loaded
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          measurePositions();
          ScrollTrigger.refresh();
        });
      }

      // ----------------------------------------------------
      // DESKTOP WORKFLOW (>= 768px): Desktop/tablet behavior untouched
      // ----------------------------------------------------
      mm.add("(min-width: 768px)", () => {
        activeStates.current = new Array(letterRefs.current.length).fill(false);
        measurePositions();

        // Recalculate cached letter coordinates on ScrollTrigger refresh
        ScrollTrigger.addEventListener("refreshInit", measurePositions);

        // 1. Time-based Load Animation
        const loadTl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        // Headline letters fade in to dormant state (opacity: 0.25)
        loadTl.fromTo(
          letterRefs.current.filter(Boolean),
          { opacity: 0, y: 24 },
          {
            opacity: 0.25,
            y: 0,
            stagger: 0.03,
            duration: 0.7,
            onComplete: () => {
              // Ensure any letters passed during load are properly illuminated
              const currentProgress = scrollTlRef.current?.scrollTrigger
                ? scrollTlRef.current.scrollTrigger.progress
                : 0;
              updateLetters(currentProgress * cachedTravelDistance.current, true);
            },
          }
        );

        // Road track fade in
        if (roadRef.current) {
          loadTl.fromTo(
            roadRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
          );
        }

        // Stats appear ONE BY ONE, 0.15s stagger, power3.out
        loadTl.fromTo(
          ".stat-box-item",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        );

        // 2. Scrub-based Core Scroll Animation (pinned hero section)
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: () => "+=" + getTravelDistance() * 1.5,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            markers: false,
            onUpdate: (self) => {
              const currentCarX = self.progress * cachedTravelDistance.current;
              updateLetters(currentCarX);
            },
            onScrubComplete: (self) => {
              const currentCarX = self.progress * cachedTravelDistance.current;
              updateLetters(currentCarX);
            },
          },
        });

        scrollTlRef.current = scrollTl;

        // Car moves left-to-right via x transform (from 0 across full roadWidth)
        scrollTl.to(
          carRef.current,
          {
            x: () => getTravelDistance(),
            ease: "none",
          },
          0
        );

        // Trail: scaleX 0 to 1, origin-left, same ScrollTrigger, ease "none"
        scrollTl.to(
          trailRef.current,
          {
            scaleX: 1,
            ease: "none",
          },
          0
        );

        // Scroll Progress Bar: scaleX 0 to 1, origin-left
        if (progressBarRef.current) {
          scrollTl.to(
            progressBarRef.current,
            {
              scaleX: 1,
              ease: "none",
            },
            0
          );
        }

        // Scroll hint fades out on first scroll
        if (scrollHintRef.current) {
          scrollTl.to(
            scrollHintRef.current,
            {
              opacity: 0,
              y: -10,
              ease: "power1.out",
              duration: 0.15,
            },
            0
          );
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measurePositions);
        };
      });

      // ----------------------------------------------------
      // MOBILE WORKFLOW (< 768px): Pinned scrub with car & trail
      // ----------------------------------------------------
      mm.add("(max-width: 767px)", () => {
        activeStates.current = new Array(letterRefs.current.length).fill(false);
        measurePositions();

        // Recalculate cached letter coordinates on ScrollTrigger refresh and reset active states
        ScrollTrigger.addEventListener("refreshInit", measurePositions);

        // 1. Mobile load animation: letters to opacity 0.25, road and stats fade in
        const mobileTl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        mobileTl.fromTo(
          letterRefs.current.filter(Boolean),
          { opacity: 0, y: 20 },
          {
            opacity: 0.25,
            y: 0,
            stagger: 0.03,
            duration: 0.7,
            onComplete: () => {
              const currentProgress = scrollTlRef.current?.scrollTrigger
                ? scrollTlRef.current.scrollTrigger.progress
                : 0;
              updateLetters(currentProgress * cachedTravelDistance.current, true);
            },
          }
        );

        if (roadRef.current) {
          mobileTl.fromTo(
            roadRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
          );
        }

        mobileTl.fromTo(
          ".stat-box-item",
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        );

        // 2. Mobile scrub ScrollTrigger: pin: true, scrub: 1, end: "+=100%"
        const mobileScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            markers: false,
            onUpdate: (self) => {
              const currentCarX = self.progress * cachedTravelDistance.current;
              updateLetters(currentCarX);
            },
            onScrubComplete: (self) => {
              const currentCarX = self.progress * cachedTravelDistance.current;
              updateLetters(currentCarX);
            },
          },
        });

        scrollTlRef.current = mobileScrollTl;

        // Car moves across full road width
        mobileScrollTl.to(
          carRef.current,
          {
            x: () => getTravelDistance(),
            ease: "none",
          },
          0
        );

        // Trail scales from 0 to 1
        mobileScrollTl.to(
          trailRef.current,
          {
            scaleX: 1,
            ease: "none",
          },
          0
        );

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measurePositions);
        };
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen h-dvh w-full flex-col justify-between bg-neutral-950 px-4 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8 select-none"
    >
      {/* Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 origin-left will-change-transform z-50 pointer-events-none"
      />

      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.12),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-cyan-600/5 blur-[120px] rounded-full" />

      {/* Top Bar: Brand, Status, Tag */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-neutral-800/80 pb-3 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <span className="font-mono text-xs font-black text-cyan-400">FZ</span>
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
              ITZFIZZ MOTORSPORT
            </h2>
            <p className="text-[9px] sm:text-[10px] font-mono tracking-wider text-neutral-400">
              NEXT-GEN HYPERDRIVE PLATFORM
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-neutral-300">TELEMETRY ACTIVE</span>
        </div>
      </header>

      {/* Main Unified Dashboard: Headline + Road + Stats scaling dynamically with vh and filling tablet portrait */}
      <div className="relative z-10 my-auto flex w-full max-w-6xl mx-auto flex-col items-center justify-center py-[clamp(0.5rem,1.5vh,1.5rem)]">
        {/* Headline: fluid clamp scaling with both vw and vh, spanning full road width */}
        <div
          ref={headlineRef}
          aria-label={HEADLINE_TEXT}
          className="w-full flex items-center justify-between text-center select-none px-2"
        >
          {HEADLINE_TEXT.split("").map((char, index) => {
            if (char === " ") {
              return (
                <span
                  key={index}
                  ref={(el) => (letterRefs.current[index] = el)}
                  className="inline-block w-2 sm:w-3 md:w-5 lg:w-7"
                  aria-hidden="true"
                >
                  &nbsp;
                </span>
              );
            }

            return (
              <span
                key={index}
                ref={(el) => (letterRefs.current[index] = el)}
                className="headline-letter opacity-0 inline-block font-mono text-[clamp(1.4rem,min(4.5vw,7vh),4.5rem)] font-black tracking-widest will-change-transform text-neutral-500 transition-colors duration-150"
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Road Container: visible on all breakpoints (flex), h-14 on mobile, sm:h-24 md:h-28 lg:h-24 */}
        <div
          ref={roadRef}
          className="opacity-0 relative w-full overflow-hidden h-14 sm:h-24 md:h-28 lg:h-24 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md flex items-center mt-[clamp(1rem,3.5vh,2.5rem)] shadow-inner"
        >
          {/* Road center dashed line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-b border-dashed border-neutral-700/60" />

          {/* Glowing Trail: scaleX 0 to 1, origin-left, same ScrollTrigger, ease "none" */}
          <div
            ref={trailRef}
            className="absolute left-0 top-0 bottom-0 w-full origin-left will-change-transform bg-gradient-to-r from-transparent via-cyan-500/25 to-cyan-400/50 border-r-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] pointer-events-none"
          />

          {/* Car: absolute, left-0, inside it. w-20 on mobile, sm:w-36 md:w-48 lg:w-40 */}
          <Car
            ref={carRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-20 sm:w-36 md:w-48 lg:w-40 z-10"
          />
        </div>

        {/* Road Track Telemetry Labels (hidden on mobile, visible on desktop/tablet) */}
        <div className="hidden md:flex w-full justify-between px-2 mt-1.5 font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400">
          <span>00.0 KM/H [LAUNCH]</span>
          <span>VELOCITY TELEMETRY LANE</span>
          <span>480.0 KM/H [APEX]</span>
        </div>

        {/* Scroll hint that fades out on first scroll with vh scaling (hidden on mobile) */}
        <div
          ref={scrollHintRef}
          className="mt-[clamp(0.75rem,2vh,1.5rem)] hidden md:flex items-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-400 will-change-transform"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>SCROLL TO ACCELERATE</span>
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* Bottom Section: 4 Stat Boxes with vh-scaled top spacing, larger padding and value font size on md */}
        <footer
          ref={statsContainerRef}
          className="w-full mt-[clamp(1.5rem,4.5vh,3.5rem)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
            {STATS_DATA.map((stat, idx) => (
              <StatBox
                key={idx}
                value={stat.value}
                label={stat.label}
                subtext={stat.subtext}
                className="opacity-0 md:!p-5 lg:!p-4 md:[&_.font-extrabold]:!text-3xl lg:[&_.font-extrabold]:!text-2xl"
              />
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
