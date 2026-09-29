import React, { forwardRef } from "react";

/**
 * StatBox Component
 * Displays a single metric / stat with percentage/value and short description.
 * Compact responsive padding and typography to prevent viewport clipping.
 */
const StatBox = forwardRef(function StatBox(
  { value, label, subtext, className = "" },
  ref
) {
  return (
    <div
      ref={ref}
      className={`stat-box-item group relative rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 sm:p-4 backdrop-blur-md transition-colors duration-300 hover:border-cyan-500/50 hover:bg-neutral-900/70 will-change-transform ${className}`}
    >
      {/* Top ambient highlight gradient */}
      <div className="pointer-events-none absolute -top-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Metric Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-cyan-400">
          {value}
        </span>
      </div>

      {/* Description / Label */}
      <p className="mt-0.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-300 transition-colors">
        {label}
      </p>

      {/* Optional subtext */}
      {subtext && (
        <span className="mt-1 block text-[10px] sm:text-[11px] font-mono text-cyan-400/70 truncate">
          {subtext}
        </span>
      )}
    </div>
  );
});

export default StatBox;
