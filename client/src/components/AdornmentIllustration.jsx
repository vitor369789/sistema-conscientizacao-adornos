export const RingIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#ffed4e" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="40" fill="none" stroke="url(#ringGradient)" strokeWidth="8" />
    <circle cx="100" cy="60" r="15" fill="#ff6b6b" />
    <path d="M 100 100 L 150 150" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
    <circle cx="150" cy="150" r="8" fill="#dc2626" />
    <text x="100" y="180" textAnchor="middle" fill="#dc2626" fontSize="16" fontWeight="bold">⚠️ PERIGO</text>
  </svg>
);

export const WatchIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="watchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect x="60" y="70" width="80" height="60" rx="10" fill="url(#watchGradient)" />
    <circle cx="100" cy="100" r="25" fill="#fff" opacity="0.9" />
    <line x1="100" y1="100" x2="100" y2="85" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="100" x2="110" y2="100" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
    <path d="M 50 100 L 60 100" stroke="#1d4ed8" strokeWidth="4" />
    <path d="M 140 100 L 150 100" stroke="#1d4ed8" strokeWidth="4" />
    <path d="M 120 150 L 140 160" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
    <text x="100" y="185" textAnchor="middle" fill="#fbbf24" fontSize="20">⚡</text>
  </svg>
);

export const NecklaceIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="necklaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    <path d="M 50 80 Q 100 120 150 80" fill="none" stroke="url(#necklaceGradient)" strokeWidth="4" />
    <circle cx="100" cy="130" r="15" fill="url(#necklaceGradient)" />
    <path d="M 100 145 L 100 170" stroke="url(#necklaceGradient)" strokeWidth="3" />
    <circle cx="160" cy="100" r="30" fill="#9333ea" opacity="0.3" />
    <path d="M 145 85 L 175 115" stroke="#dc2626" strokeWidth="3" />
    <path d="M 175 85 L 145 115" stroke="#dc2626" strokeWidth="3" />
  </svg>
);

export const SafetyIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="safetyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M 100 30 L 140 50 L 140 100 Q 140 140 100 160 Q 60 140 60 100 L 60 50 Z" fill="url(#safetyGradient)" />
    <path d="M 80 100 L 95 115 L 120 80" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.3" strokeDasharray="5,5">
      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const MachineIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <rect x="40" y="80" width="120" height="80" fill="#64748b" rx="5" />
    <circle cx="100" cy="120" r="30" fill="#475569" />
    <circle cx="100" cy="120" r="20" fill="#1e293b" />
    <circle cx="100" cy="120" r="5" fill="#ef4444" />
    <path d="M 100 120 L 120 100" stroke="#ef4444" strokeWidth="3" />
    <rect x="60" y="60" width="80" height="15" fill="#94a3b8" rx="3" />
    <circle cx="170" cy="100" r="8" fill="#fbbf24">
      <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
    </circle>
    <text x="100" y="180" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">MÁQUINA</text>
  </svg>
);

export const WorkerIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="60" r="25" fill="#fbbf24" />
    <rect x="80" y="85" width="40" height="60" fill="#3b82f6" rx="5" />
    <rect x="60" y="90" width="20" height="50" fill="#3b82f6" rx="3" />
    <rect x="120" y="90" width="20" height="50" fill="#3b82f6" rx="3" />
    <rect x="85" y="145" width="12" height="40" fill="#1e293b" rx="2" />
    <rect x="103" y="145" width="12" height="40" fill="#1e293b" rx="2" />
    <circle cx="90" cy="55" r="3" fill="#1e293b" />
    <circle cx="110" cy="55" r="3" fill="#1e293b" />
    <path d="M 90 70 Q 100 75 110 70" fill="none" stroke="#1e293b" strokeWidth="2" />
    <rect x="70" y="35" width="60" height="15" fill="#fbbf24" rx="3" />
  </svg>
);
