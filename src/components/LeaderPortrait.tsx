import { PortraitConfig } from '../types';

interface LeaderPortraitProps {
  portrait?: PortraitConfig;
  leaderName?: string;
  partyShortName?: string;
  size?: number | string;
  className?: string;
}

// Global presets for real-life party leaders
export const LEADER_PRESETS: Record<string, PortraitConfig> = {
  'AK Parti': {
    hairType: 'classic',
    hairColor: '#a1a1aa',
    glassesType: 'none',
    mustacheType: 'political',
    skinTone: '#fed7aa',
    suitColor: '#0f172a',
    tieColor: '#ea580c',
    expression: 'serious'
  },
  'CHP': {
    hairType: 'parted',
    hairColor: '#374151',
    glassesType: 'classic',
    mustacheType: 'none',
    skinTone: '#ffedd5',
    suitColor: '#1e293b',
    tieColor: '#dc2626',
    expression: 'confident'
  },
  'MHP': {
    hairType: 'shaved',
    hairColor: '#eaeaea',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#ffeedd',
    suitColor: '#0f172a',
    tieColor: '#991b1b',
    expression: 'serious'
  },
  'DEM Parti': {
    hairType: 'wavy',
    hairColor: '#111827',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#fed7aa',
    suitColor: '#4f46e5',
    tieColor: '#10b981',
    expression: 'happy'
  },
  'İYİ Parti': {
    hairType: 'parted',
    hairColor: '#d1d5db',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#ffedd5',
    suitColor: '#1e3a8a',
    tieColor: '#0ea5e9',
    expression: 'confident'
  },
  'YRP': {
    hairType: 'full',
    hairColor: '#1f2937',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#ffedd5',
    suitColor: '#0f172a',
    tieColor: '#22c55e',
    expression: 'confident'
  },
  'Zafer': {
    hairType: 'shaved',
    hairColor: '#9ca3af',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#fed7aa',
    suitColor: '#1f2937',
    tieColor: '#b91c1c',
    expression: 'serious'
  },
  'TİP': {
    hairType: 'full',
    hairColor: '#111827',
    glassesType: 'none',
    mustacheType: 'thick',
    skinTone: '#fcd34d',
    suitColor: '#1e293b',
    tieColor: '#be123c',
    expression: 'serious'
  },
  'Saadet': {
    hairType: 'classic',
    hairColor: '#4b5563',
    glassesType: 'bold',
    mustacheType: 'thin',
    skinTone: '#ffedd5',
    suitColor: '#0f172a',
    tieColor: '#f97316',
    expression: 'confident'
  },
  'DEVA': {
    hairType: 'parted',
    hairColor: '#27272a',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#ffedd5',
    suitColor: '#1e3a8a',
    tieColor: '#2563eb',
    expression: 'happy'
  },
  'VP': {
    hairType: 'shaved',
    hairColor: '#f3f4f6',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#fee2e2',
    suitColor: '#0f172a',
    tieColor: '#dc2626',
    expression: 'serious'
  },
  'TKP': {
    hairType: 'classic',
    hairColor: '#4b5563',
    glassesType: 'classic',
    mustacheType: 'none',
    skinTone: '#fed7aa',
    suitColor: '#1e293b',
    tieColor: '#b91c1c',
    expression: 'serious'
  },
  'A Parti': {
    hairType: 'parted',
    hairColor: '#18181b',
    glassesType: 'none',
    mustacheType: 'none',
    skinTone: '#ffedd5',
    suitColor: '#0f172a',
    tieColor: '#14b8a6',
    expression: 'confident'
  }
};

const DEFAULT_PORTRAIT: PortraitConfig = {
  hairType: 'classic',
  hairColor: '#4b5563',
  glassesType: 'none',
  mustacheType: 'none',
  skinTone: '#fed7aa',
  suitColor: '#1e293b',
  tieColor: '#2563eb',
  expression: 'neutral'
};

export default function LeaderPortrait({
  portrait,
  leaderName,
  partyShortName,
  size = 64,
  className = ''
}: LeaderPortraitProps) {
  // Determine portrait configuration
  let config = DEFAULT_PORTRAIT;
  if (portrait) {
    config = portrait;
  } else if (partyShortName && LEADER_PRESETS[partyShortName]) {
    config = LEADER_PRESETS[partyShortName];
  }

  const {
    hairType,
    hairColor,
    glassesType,
    mustacheType,
    skinTone,
    suitColor,
    tieColor,
    expression
  } = config;

  // Custom BitLife skull structure based on politician
  const renderSkullPath = () => {
    if (partyShortName === 'VP') {
      // Doğu Perinçek: bald dome on top, narrow energetic jaw
      return (
        <path
          d="M32,38 C32,22 68,22 68,38 C68,48 62,61 50,65 C38,61 32,48 32,38 Z"
          fill={skinTone}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      );
    }
    if (partyShortName === 'YRP' || partyShortName === 'Saadet' || partyShortName === 'A Parti') {
      // Obong tall head structure typical in BitLife
      return (
        <path
          d="M31,40 C31,22 69,22 69,40 C69,54 62,67 50,67 C38,67 31,54 31,40 Z"
          fill={skinTone}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      );
    }
    if (partyShortName === 'MHP' || partyShortName === 'İYİ Parti' || partyShortName === 'TİP') {
      // Round wide face structure
      return (
        <ellipse
          cx="50"
          cy="48"
          rx="19.5"
          ry="19.5"
          fill={skinTone}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      );
    }
    // Default smart oval face shape with solid contour
    return (
      <ellipse
        cx="50"
        cy="47.5"
        rx="18"
        ry="20"
        fill={skinTone}
        stroke="#0f172a"
        strokeWidth="2.5"
      />
    );
  };

  return (
    <div
      className={`relative inline-block overflow-hidden rounded-full border-2 border-slate-700 bg-slate-900 shadow-xl ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Gradient or Shadow */}
        <defs>
          <radialGradient id="avatarShade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Neck */}
        <path
          d="M43,69 L57,69 L55,81 L45,81 Z"
          fill={skinTone}
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Shadow under chin */}
        <ellipse cx="50" cy="71" rx="7" ry="2.2" fill="rgba(15,23,42,0.18)" />

        {/* Render precise skull shape */}
        {renderSkullPath()}

        {/* Ears */}
        <circle cx="30" cy="47.5" r="5" fill={skinTone} stroke="#0f172a" strokeWidth="2.2" />
        <circle cx="70" cy="47.5" r="5" fill={skinTone} stroke="#0f172a" strokeWidth="2.2" />

        {/* Back Hair support if wavy */}
        {hairType === 'wavy' && (
          <path
            d="M26,45 C18,55 22,75 30,75 C29,65 29,50 29,47.5"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}
        {hairType === 'wavy' && (
          <path
            d="M74,45 C82,55 78,75 70,75 C71,65 71,50 71,47.5"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}

        {/* Perinçek specific fluffy white rings (at ears level and sides of skull) */}
        {partyShortName === 'VP' && (
          <>
            <path d="M26,42 C20,44 19,53 26,52" fill="#fafafa" stroke="#0f172a" strokeWidth="1.8" />
            <path d="M74,42 C80,44 81,53 74,52" fill="#fafafa" stroke="#0f172a" strokeWidth="1.8" />
          </>
        )}

        {/* Eyebrows */}
        {expression === 'serious' ? (
          <>
            {/* Serious angry/focused slanted eyebrows */}
            <path d="M36,38 C39,40 42,40 45,39.5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M64,38 C61,40 58,40 55,39.5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'confident' ? (
          <>
            {/* Confident raised arched eyebrows */}
            <path d="M35,36 C39,35 42,37 45,39" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M65,36 C61,35 58,37 55,39" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Soft curious eyebrows */}
            <path d="M35,37 C39,36 42,36 44,38" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M65,37 C61,36 58,36 56,38" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Perinçek extra signature white bushy eyebrows! */}
        {partyShortName === 'VP' && (
          <>
            <path d="M34,35 C39,34 43,36 45,37" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M66,35 C61,34 57,36 55,37" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Big expressive pupils in Bitlife style with multi-point specular reflection */}
        <circle cx="41.5" cy="44.2" r="2.8" fill="#1e293b" />
        <circle cx="58.5" cy="44.2" r="2.8" fill="#1e293b" />
        {/* Specular catchlights */}
        <circle cx="42.5" cy="43.2" r="0.9" fill="#ffffff" />
        <circle cx="40.2" cy="45.5" r="0.4" fill="#ffffff" />
        <circle cx="59.5" cy="43.2" r="0.9" fill="#ffffff" />
        <circle cx="57.2" cy="45.5" r="0.4" fill="#ffffff" />

        {/* Simple cute rounded nose */}
        <path
          d="M48,43 L50,51.5 L47.5,52.5"
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mustache styling */}
        {mustacheType === 'thin' && (
          <path
            d="M44,55 C47,53.5 53,53.5 56,55 C53,54.2 47,54.2 44,55 Z"
            fill="#3f3f46"
            stroke="#111827"
            strokeWidth="1.8"
          />
        )}
        {mustacheType === 'political' && (
          // Strictly groomed AK Parti mustache
          <path
            d="M42,55 C45,53.5 55,53.5 58,55 C55,54.2 45,54.2 42,55"
            fill="#4b5563"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {mustacheType === 'thick' && (
          // Erkan Baş iconic heavy bushy mustache!
          <path
            d="M38,53.5 C42,51 58,51 62,53.5 C63,58 58,58.5 50,57.5 C42,58.5 37,58 38,53.5 Z"
            fill="#111827"
            stroke="#000000"
            strokeWidth="1.5"
          />
        )}

        {/* Expressive Mouth */}
        {expression === 'happy' ? (
          <path d="M42.5,58 C46.5,62.5 53.5,62.5 57.5,58" fill="none" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
        ) : expression === 'serious' ? (
          <line x1="43" y1="58.5" x2="57" y2="58.5" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          // Pleasant cartoon smile
          <path d="M43,58 C46.5,59.8 53.5,59.8 57,58" fill="none" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Spectacles or Glasses style with visible metal bridge */}
        {glassesType === 'classic' && (
          <>
            <rect x="32" y="40" width="14" height="8.5" rx="2.2" fill="none" stroke="#1e293b" strokeWidth="2.2" />
            <rect x="54" y="40" width="14" height="8.5" rx="2.2" fill="none" stroke="#1e293b" strokeWidth="2.2" />
            <line x1="46" y1="44" x2="54" y2="44" stroke="#1e293b" strokeWidth="2.2" />
            <line x1="32" y1="44" x2="30" y2="44" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="68" y1="44" x2="70" y2="44" stroke="#1e293b" strokeWidth="1.2" />
          </>
        )}
        {glassesType === 'bold' && (
          <>
            <rect x="32" y="39.5" width="14" height="9.5" rx="1.8" fill="none" stroke="#000000" strokeWidth="2.8" />
            <rect x="54" y="39.5" width="14" height="9.5" rx="1.8" fill="none" stroke="#000000" strokeWidth="2.8" />
            <line x1="46" y1="44.2" x2="54" y2="44.2" stroke="#000000" strokeWidth="2.8" />
          </>
        )}
        {glassesType === 'round' && (
          <>
            <circle cx="38" cy="44.2" r="6.8" fill="none" stroke="#000000" strokeWidth="2.2" />
            <circle cx="62" cy="44.2" r="6.8" fill="none" stroke="#000000" strokeWidth="2.2" />
            <line x1="44.8" y1="44.2" x2="55.2" y2="44.2" stroke="#000000" strokeWidth="2.2" />
          </>
        )}

        {/* Hairstyles blocks modeled like BitLife vector groupings */}
        {hairType === 'classic' && (
          <path
            d="M30,37 C32,29 42,24 50,26 C56,24 66,29 70,37 C73,33 69,24 58,23 C48,22 34,25 30,37 Z"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}
        {hairType === 'parted' && (
          <path
            d="M30,37 C30,25 44,22 50,26 C54,22 70,25 70,37 C70,33 62,26 50,27 C38,26 30,33 30,37 Z"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}
        {hairType === 'full' && (
          <path
            d="M28,38 C26,22 38,18 50,19 C62,18 74,22 72,38 C74,32 69,21 50,21 C31,21 26,32 28,38 Z"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}
        {hairType === 'wavy' && (
          <path
            d="M30,38 C28,27 38,20 50,22 C62,20 72,27 70,38 C73,34 66,24 50,24 C34,24 27,34 30,38 Z"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        )}
        {hairType === 'shaved' && partyShortName !== 'VP' && (
          // High receding temple line typically used for Elder Devlet Bahçeli or Ümit Özdağ
          <path
            d="M30,39 C30,37 33,33 36,33 C39,38 42,38 50,38 C58,38 61,38 64,33 C67,33 70,37 70,39 C68,32 63,30 50,30 C37,30 32,32 30,39 Z"
            fill={hairColor}
            stroke="#0f172a"
            strokeWidth="0.8"
          />
        )}

        {/* Bahçeli specific receding gray hair side locks */}
        {partyShortName === 'MHP' && (
          <path
            d="M29,43 C29,38 34,35 37,35 C32,38 29,41 29,43 M71,43 C71,38 66,35 63,35 C68,38 71,41 71,43 Z"
            fill="#eaeaea"
            stroke="#0f172a"
            strokeWidth="1"
          />
        )}

        {/* Suit & Shoulders style */}
        <path
          d="M21,81 L79,81 C79,81 76,98 50,98 C24,98 21,81 21,81 Z"
          fill={suitColor}
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Crisp White Shirt Collar */}
        <path
          d="M43,81 L50,88.5 L57,81 L50,79 Z"
          fill="#ffffff"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Tie (Kravat) with custom color matching party vibe */}
        <path
          d="M48,84.5 L52,84.5 L53.5,98 L46.5,98 Z"
          fill={tieColor}
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Tie Knot */}
        <polygon
          points="47.5,83.5 52.5,83.5 51,86.5 49,86.5"
          fill={tieColor}
          stroke="#0f172a"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
