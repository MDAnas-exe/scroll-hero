import React, { forwardRef } from "react";

/**
 * Car Component
 * Renders an inline SVG high-performance sports car with headlight illumination.
 * Uses forwardRef so GSAP can animate its transform property with zero layout reflow.
 */
const Car = forwardRef(function Car({ className = "" }, ref) {
  return (
    <div
      ref={ref}
      aria-label="Sports Car"
      className={`will-change-transform select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Headlight beam gradient */}
          <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>

          {/* Car body metallic finish */}
          <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="35%" stopColor="#0f172a" />
            <stop offset="75%" stopColor="#020617" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Roof & Cockpit glass */}
          <linearGradient id="cockpitGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#0369a1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </linearGradient>

          {/* Neon accent strip */}
          <linearGradient id="neonStrip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="40%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Wheel rim gradient */}
          <radialGradient id="wheelRim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* Headlight projector beam projecting forward */}
        <polygon
          points="188,38 240,24 240,56 188,44"
          fill="url(#headlightBeam)"
          className="opacity-90"
        />

        {/* Car shadow under chassis */}
        <ellipse cx="100" cy="62" rx="90" ry="5" fill="#000000" opacity="0.6" />

        {/* Rear aerodynamic wing / spoiler */}
        <path
          d="M 12 28 L 22 28 L 28 35 L 16 35 Z"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="0.8"
        />
        <path d="M 18 35 L 16 42" stroke="#64748b" strokeWidth="1.5" />

        {/* Main Body Silhouette */}
        <path
          d="M 14 42
             C 14 38, 24 35, 38 35
             C 45 35, 52 33, 62 26
             C 74 18, 92 15, 120 16
             C 142 17, 155 24, 168 33
             C 176 34, 184 36, 192 40
             C 196 42, 196 46, 193 49
             C 190 52, 185 54, 178 54
             L 165 54
             C 165 47, 158 41, 150 41
             C 142 41, 135 47, 135 54
             L 65 54
             C 65 47, 58 41, 50 41
             C 42 41, 35 47, 35 54
             L 16 54
             C 13 54, 12 50, 12 47
             Z"
          fill="url(#carBodyGrad)"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* Cockpit Canopy / Windows */}
        <path
          d="M 66 26
             C 75 20, 92 18, 118 19
             C 136 20, 146 25, 156 33
             L 66 33
             Z"
          fill="url(#cockpitGrad)"
          stroke="#38bdf8"
          strokeWidth="0.5"
        />
        {/* Window Pillar divider */}
        <line x1="108" y1="18" x2="105" y2="33" stroke="#0f172a" strokeWidth="2.5" />

        {/* Aerodynamic Body Side Crease & Neon Stripe */}
        <path
          d="M 32 38 Q 95 38 184 41"
          stroke="url(#neonStrip)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 38 43 Q 100 44 172 45"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Front Headlight Cluster */}
        <polygon
          points="186,37 194,40 188,43 182,41"
          fill="#38bdf8"
          className="animate-pulse"
        />
        <circle cx="188" cy="40" r="2.5" fill="#e0f2fe" />

        {/* Rear Taillight Strip */}
        <path
          d="M 13 41 L 18 41 L 17 44 L 13 44 Z"
          fill="#f43f5e"
          filter="drop-shadow(0 0 4px #f43f5e)"
        />

        {/* Rear Wheel */}
        <g transform="translate(50, 52)">
          <circle cx="0" cy="0" r="13" fill="#090d16" stroke="#334155" strokeWidth="2" />
          <circle cx="0" cy="0" r="9" fill="url(#wheelRim)" />
          {/* Wheel Spokes */}
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="-5" y1="5" x2="5" y2="-5" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#38bdf8" />
        </g>

        {/* Front Wheel */}
        <g transform="translate(150, 52)">
          <circle cx="0" cy="0" r="13" fill="#090d16" stroke="#334155" strokeWidth="2" />
          <circle cx="0" cy="0" r="9" fill="url(#wheelRim)" />
          {/* Wheel Spokes */}
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="-5" y1="5" x2="5" y2="-5" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#38bdf8" />
        </g>

        {/* Front bumper aero splitter */}
        <path d="M 180 54 L 195 54 L 192 52 Z" fill="#0f172a" />
      </svg>
    </div>
  );
});

export default Car;
