import React from 'react';

/**
 * Traditional Kuba / Shoowa Velvet Cloth Geometric Motifs
 * Iconic traditional art form from the Kuba Kingdom (Kasaï / Central DRC).
 * Interlocking diamond hatches and chevron paths representing heritage, truth and unity.
 */
export const KubaPatternOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Kuba Cloth Diamond Interlock Pattern */}
          <pattern
            id="kuba-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Diamond frame */}
            <path
              d="M 40 0 L 80 40 L 40 80 L 0 40 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />
            {/* Inner Hatching chevrons (Kuba Shoowa motif) */}
            <path
              d="M 40 10 L 70 40 L 40 70 L 10 40 Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M 40 20 L 60 40 L 40 60 L 20 40 Z"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1"
            />
            {/* Center Royal Motif */}
            <circle cx="40" cy="40" r="3" fill="#D4AF37" />
            <path
              d="M 0 0 L 15 15 M 65 15 L 80 0 M 80 80 L 65 65 M 15 65 L 0 80"
              stroke="#D4AF37"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#kuba-pattern)" />
      </svg>
    </div>
  );
};

export const KubaBorderDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center py-1 opacity-80 ${className}`}>
      <svg className="w-full h-3" preserveAspectRatio="none" viewBox="0 0 400 12">
        <pattern id="kuba-border" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M 0 6 L 6 0 L 12 6 L 18 0 L 24 6 L 18 12 L 12 6 L 6 12 Z" fill="#D4AF37" opacity="0.4" />
          <path d="M 6 0 L 12 6 L 6 12 L 0 6 Z" fill="#3B82F6" opacity="0.3" />
        </pattern>
        <rect width="100%" height="12" fill="url(#kuba-border)" />
      </svg>
    </div>
  );
};
