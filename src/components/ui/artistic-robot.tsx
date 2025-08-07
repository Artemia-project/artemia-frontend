import React from 'react';

interface ArtisticRobotProps {
  className?: string;
  size?: number;
}

export const ArtisticRobot: React.FC<ArtisticRobotProps> = ({ 
  className = "", 
  size = 16 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head with gradient */}
      <defs>
        <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      
      {/* Main body */}
      <rect
        x="5"
        y="8"
        width="14"
        height="12"
        rx="3"
        fill="url(#robotGradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      {/* Head */}
      <rect
        x="7"
        y="4"
        width="10"
        height="8"
        rx="2"
        fill="url(#robotGradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      {/* Antenna */}
      <circle
        cx="12"
        cy="2"
        r="1"
        fill="hsl(var(--accent))"
        className="animate-pulse"
      />
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="4"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* Eyes with glow effect */}
      <circle
        cx="10"
        cy="7"
        r="1.5"
        fill="url(#eyeGlow)"
        className="animate-pulse"
      />
      <circle
        cx="14"
        cy="7"
        r="1.5"
        fill="url(#eyeGlow)"
        className="animate-pulse"
      />
      
      {/* Eye pupils */}
      <circle cx="10" cy="7" r="0.5" fill="white" />
      <circle cx="14" cy="7" r="0.5" fill="white" />
      
      {/* Mouth - artistic curved line */}
      <path
        d="M 9 9.5 Q 12 11 15 9.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Arms */}
      <rect
        x="3"
        y="10"
        width="2"
        height="6"
        rx="1"
        fill="hsl(var(--accent))"
        opacity="0.8"
      />
      <rect
        x="19"
        y="10"
        width="2"
        height="6"
        rx="1"
        fill="hsl(var(--accent))"
        opacity="0.8"
      />
      
      {/* Body details - chest panel */}
      <rect
        x="8"
        y="11"
        width="8"
        height="4"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
      />
      
      {/* Control buttons */}
      <circle cx="9" cy="13" r="0.5" fill="hsl(var(--primary))" opacity="0.7" />
      <circle cx="11" cy="13" r="0.5" fill="hsl(var(--accent))" opacity="0.7" />
      <circle cx="13" cy="13" r="0.5" fill="hsl(var(--primary))" opacity="0.7" />
      <circle cx="15" cy="13" r="0.5" fill="hsl(var(--accent))" opacity="0.7" />
      
      {/* Legs */}
      <rect
        x="8"
        y="20"
        width="2"
        height="3"
        rx="1"
        fill="hsl(var(--accent))"
        opacity="0.8"
      />
      <rect
        x="14"
        y="20"
        width="2"
        height="3"
        rx="1"
        fill="hsl(var(--accent))"
        opacity="0.8"
      />
    </svg>
  );
};