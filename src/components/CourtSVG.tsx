import { motion } from 'motion/react';

interface Props {
  glow?: boolean;
}

export default function CourtSVG({ glow = false }: Props) {
  const color = glow ? 'rgba(255,215,0,0.15)' : 'rgba(255,107,0,0.08)';
  const colorBright = glow ? 'rgba(255,215,0,0.3)' : 'rgba(255,107,0,0.15)';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 0 }}
    >
      {/* Center circle */}
      <motion.circle
        cx="720"
        cy="450"
        r="120"
        fill="none"
        stroke={colorBright}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Center dot */}
      <motion.circle
        cx="720"
        cy="450"
        r="6"
        fill={colorBright}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />

      {/* Center line */}
      <motion.line
        x1="720"
        y1="100"
        x2="720"
        y2="800"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Outer rectangle (court boundary) */}
      <motion.rect
        x="120"
        y="100"
        width="1200"
        height="700"
        rx="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* Left free-throw arc */}
      <motion.path
        d="M 120 280 L 340 280 L 340 620 L 120 620"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.5 }}
      />
      <motion.circle
        cx="340"
        cy="450"
        r="90"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      {/* Right free-throw arc */}
      <motion.path
        d="M 1320 280 L 1100 280 L 1100 620 L 1320 620"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.5 }}
      />
      <motion.circle
        cx="1100"
        cy="450"
        r="90"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      {/* Left 3-point arc */}
      <motion.path
        d="M 120 180 Q 420 450 120 720"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Right 3-point arc */}
      <motion.path
        d="M 1320 180 Q 1020 450 1320 720"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Pulsing center glow */}
      <motion.circle
        cx="720"
        cy="450"
        r="120"
        fill={`url(#centerGlow)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <defs>
        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor={glow ? '#ffd700' : '#ff6b00'} stopOpacity="0.15" />
          <stop offset="100%" stopColor={glow ? '#ffd700' : '#ff6b00'} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
