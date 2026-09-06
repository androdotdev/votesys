export default function BallotIllustration() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
      <defs>
        <filter id="boxshadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.35"/>
        </filter>
        <filter id="papershadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
        </filter>
      </defs>

      <rect x="12" y="38" width="72" height="50" fill="#4338ca" filter="url(#boxshadow)"/>

      <polygon points="12,38 84,38 78,28 18,28" fill="#4f46e5"/>

      <polygon points="84,38 84,88 78,82 78,28" fill="#3730a3"/>

      <polygon points="36,34 60,34 58,30 38,30" fill="#1e1b4b"/>

      <g filter="url(#papershadow)">
        <g transform="rotate(-6, 48, 38)">
          <rect x="36" y="8" width="24" height="34" fill="#f8fafc"/>
          <line x1="40" y1="16" x2="56" y2="16" stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1="40" y1="22" x2="56" y2="22" stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1="40" y1="28" x2="56" y2="28" stroke="#cbd5e1" strokeWidth="1.5"/>
        </g>
      </g>

      <line x1="30" y1="14" x2="30" y2="26" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="square" opacity="0.7"/>
      <line x1="25" y1="18" x2="25" y2="28" stroke="#818cf8" strokeWidth="2" strokeLinecap="square" opacity="0.4"/>
    </svg>
  );
}
