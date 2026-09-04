// Inline SVG illustrations for the Round Rock Sasquatch Society.
// All art is hand-built with SVG primitives; no external image deps.

import { JSX, ReactNode } from 'react';

interface PineClusterProps {
  x: number;
  y: number;
  count?: number;
  baseHeight?: number;
  fill: string;
}

function PineCluster({ x, y, count = 8, baseHeight = 38, fill }: PineClusterProps): JSX.Element {
  const trees: JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    const tx = x + i * 44;
    const h = baseHeight + ((i * 7) % 22);
    const w = 18 + ((i * 3) % 6);
    trees.push(
      <polygon
        key={i}
        points={`${tx},${y} ${tx + w},${y - h} ${tx + w * 2},${y}`}
        fill={fill}
      />
    );
  }
  return <g>{trees}</g>;
}

interface PineTreeProps {
  x: number;
  y: number;
  h?: number;
  fill?: string;
}

function PineTree({ x, y, h = 90, fill = "#070c0c" }: PineTreeProps): JSX.Element {
  // A layered conifer: trunk + three triangle tiers
  const w = h * 0.42;
  const cx = x;
  return (
    <g fill={fill}>
      <rect x={cx - 3} y={y - h * 0.12} width="6" height={h * 0.18} fill="#1c1410" />
      <polygon points={`${cx},${y - h} ${cx - w * 0.5},${y - h * 0.55} ${cx + w * 0.5},${y - h * 0.55}`} />
      <polygon points={`${cx},${y - h * 0.78} ${cx - w * 0.7},${y - h * 0.32} ${cx + w * 0.7},${y - h * 0.32}`} />
      <polygon points={`${cx},${y - h * 0.55} ${cx - w},${y - h * 0.08} ${cx + w},${y - h * 0.08}`} />
    </g>
  );
}

interface BigfootProps {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
}

function Bigfoot({ x, y, scale = 1, fill = "#0a0908" }: BigfootProps): JSX.Element {
  // Stylized hairy bipedal silhouette, anchored at feet (x, y)
  return (
    <g transform={`translate(${x - 22 * scale}, ${y - 102 * scale}) scale(${scale})`} fill={fill}>
      <ellipse cx="22" cy="14" rx="12" ry="13" />
      <path d="M 9 25 L 35 25 L 38 72 L 6 72 Z" />
      <path d="M 5 28 L 0 72 L 8 72 L 12 30 Z" />
      <path d="M 39 28 L 44 72 L 36 72 L 32 30 Z" />
      <rect x="11" y="70" width="9" height="30" />
      <rect x="24" y="70" width="9" height="30" />
      <ellipse cx="14" cy="102" rx="9" ry="3" />
      <ellipse cx="29" cy="102" rx="9" ry="3" />
      {/* fur tufts along outline */}
      <g opacity="0.85">
        <circle cx="11" cy="20" r="2" />
        <circle cx="33" cy="20" r="2" />
        <circle cx="6" cy="44" r="2" />
        <circle cx="38" cy="44" r="2" />
        <circle cx="4" cy="60" r="1.8" />
        <circle cx="40" cy="60" r="1.8" />
      </g>
    </g>
  );
}

interface FootprintProps {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  fill?: string;
  opacity?: number;
}

function Footprint({ x, y, rotate = 0, scale = 1, fill = "#5c3d11", opacity = 0.7 }: FootprintProps): JSX.Element {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      fill={fill}
      opacity={opacity}
    >
      <ellipse cx="0" cy="6" rx="11" ry="18" />
      <circle cx="-7" cy="-15" r="2.4" />
      <circle cx="-3" cy="-19" r="2.8" />
      <circle cx="2" cy="-21" r="3.2" />
      <circle cx="7" cy="-19" r="2.8" />
      <circle cx="11" cy="-15" r="2.4" />
    </g>
  );
}

interface StarFieldProps {
  count?: number;
  w?: number;
  h?: number;
}

function StarField({ count = 9, w = 1200, h = 120 }: StarFieldProps): JSX.Element {
  const stars: JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    const sx = ((i * 137) % w);
    const sy = ((i * 53) % h) + 10;
    const sr = 0.8 + ((i * 7) % 10) / 10;
    stars.push(<circle key={i} cx={sx} cy={sy} r={sr} fill="#f5ead8" />);
  }
  return <g opacity="0.85">{stars}</g>;
}

export function ForestHero(): JSX.Element {
  return (
    <svg
      className="hero-svg"
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rrss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1a26" />
          <stop offset="55%" stopColor="#3d3247" />
          <stop offset="100%" stopColor="#7a4f35" />
        </linearGradient>
        <linearGradient id="rrss-creek" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a8597" />
          <stop offset="100%" stopColor="#2f4453" />
        </linearGradient>
        <radialGradient id="rrss-moonglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f5ead8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f5ead8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="360" fill="url(#rrss-sky)" />

      <circle cx="990" cy="80" r="90" fill="url(#rrss-moonglow)" />
      <circle cx="990" cy="80" r="34" fill="#f5ead8" />
      <circle cx="978" cy="74" r="5" fill="#d8c5a0" opacity="0.5" />
      <circle cx="1002" cy="88" r="4" fill="#d8c5a0" opacity="0.5" />
      <circle cx="985" cy="93" r="3" fill="#d8c5a0" opacity="0.4" />

      <StarField count={14} w={1200} h={140} />

      {/* far ridge */}
      <path
        d="M0,220 Q200,180 400,200 T800,195 T1200,190 L1200,360 L0,360 Z"
        fill="#1d2d2a"
      />

      {/* mid treeline */}
      <PineCluster x={-10} y={240} count={28} baseHeight={42} fill="#11201e" />

      {/* creek */}
      <path
        d="M0,290 Q200,268 400,282 T800,288 T1200,282 L1200,360 L0,360 Z"
        fill="url(#rrss-creek)"
      />
      <g stroke="#a3bccc" strokeWidth="1.2" fill="none" opacity="0.45">
        <path d="M40,308 Q160,302 280,308" />
        <path d="M380,318 Q500,313 620,318" />
        <path d="M780,310 Q900,304 1020,310" />
      </g>

      {/* foreground trees */}
      <PineTree x={70} y={340} h={150} />
      <PineTree x={140} y={340} h={120} />
      <PineTree x={1080} y={340} h={140} />
      <PineTree x={1140} y={340} h={110} />

      {/* bigfoot silhouette in mid distance */}
      <Bigfoot x={760} y={282} scale={0.7} fill="#060606" />

      {/* footprints along the bank */}
      <Footprint x={300} y={330} rotate={-10} scale={0.55} fill="#1a1006" opacity={0.6} />
      <Footprint x={360} y={336} rotate={5} scale={0.55} fill="#1a1006" opacity={0.6} />
      <Footprint x={420} y={332} rotate={-8} scale={0.55} fill="#1a1006" opacity={0.6} />
    </svg>
  );
}

interface HeroFrameProps {
  children: ReactNode;
  gradientId?: string;
  from?: string;
  via?: string;
  to?: string;
}

function HeroFrame({ children, gradientId = "rrss-sky-day", from = "#a8b8a4", via = "#d4c79e", to = "#8b6f4e" }: HeroFrameProps): JSX.Element {
  return (
    <svg
      className="article-hero-svg"
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={via} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="1200" height="220" fill={`url(#${gradientId})`} />
      {children}
    </svg>
  );
}

function TrailHero(): JSX.Element {
  return (
    <HeroFrame gradientId="rrss-trail-bg" from="#cdd5c4" via="#d6c79b" to="#7d5d3a">
      <PineCluster x={-10} y={150} count={28} baseHeight={36} fill="#2d3d2c" />
      <path d="M0,168 Q300,162 600,166 T1200,164 L1200,220 L0,220 Z" fill="#5a4a2c" />
      <path d="M0,180 Q300,174 600,178 T1200,176 L1200,220 L0,220 Z" fill="#3d2f1a" opacity="0.65" />
      <Bigfoot x={820} y={170} scale={0.7} fill="#1a1410" />
      <Footprint x={120} y={196} rotate={-12} scale={0.7} fill="#2a1a08" opacity={0.75} />
      <Footprint x={200} y={202} rotate={6} scale={0.7} fill="#2a1a08" opacity={0.7} />
      <Footprint x={290} y={196} rotate={-10} scale={0.7} fill="#2a1a08" opacity={0.65} />
      <Footprint x={380} y={202} rotate={4} scale={0.7} fill="#2a1a08" opacity={0.6} />
      <Footprint x={470} y={196} rotate={-8} scale={0.7} fill="#2a1a08" opacity={0.55} />
      <Footprint x={560} y={202} rotate={2} scale={0.7} fill="#2a1a08" opacity={0.5} />
    </HeroFrame>
  );
}

function CreekHero(): JSX.Element {
  return (
    <HeroFrame gradientId="rrss-creek-bg" from="#9eb5b8" via="#c1cabb" to="#6b7a72">
      <PineCluster x={-10} y={130} count={28} baseHeight={32} fill="#243a30" />
      <path d="M0,150 Q300,142 600,148 T1200,146 L1200,170 L0,170 Z" fill="#3a4d3a" />
      {/* creek */}
      <path d="M0,170 Q300,158 600,170 T1200,168 L1200,220 L0,220 Z" fill="#5d7a8c" />
      <g stroke="#cfdde4" strokeWidth="1.4" fill="none" opacity="0.5">
        <path d="M40,188 Q160,182 280,188" />
        <path d="M380,198 Q500,192 620,198" />
        <path d="M780,190 Q900,184 1020,190" />
      </g>
      {/* rocks */}
      <ellipse cx="180" cy="178" rx="14" ry="5" fill="#56463a" />
      <ellipse cx="430" cy="184" rx="18" ry="6" fill="#3e3128" />
      <ellipse cx="720" cy="180" rx="12" ry="4" fill="#56463a" />
      <ellipse cx="950" cy="186" rx="20" ry="6" fill="#3e3128" />
      {/* footprints crossing creek */}
      <Footprint x={300} y={172} rotate={-15} scale={0.65} fill="#1a1006" opacity={0.8} />
      <Footprint x={360} y={186} rotate={10} scale={0.65} fill="#1a1006" opacity={0.7} />
      <Footprint x={420} y={196} rotate={-12} scale={0.65} fill="#1a1006" opacity={0.6} />
    </HeroFrame>
  );
}

function GearHero(): JSX.Element {
  return (
    <HeroFrame gradientId="rrss-gear-bg" from="#0e1a26" via="#2c2740" to="#3e3a30">
      <StarField count={18} w={1200} h={150} />
      <circle cx="240" cy="64" r="60" fill="url(#rrss-moonglow)" />
      <circle cx="240" cy="64" r="26" fill="#f5ead8" />
      <PineCluster x={-10} y={170} count={28} baseHeight={32} fill="#0a1614" />
      <path d="M0,180 Q300,172 600,176 T1200,174 L1200,220 L0,220 Z" fill="#1a1310" />
      {/* tent silhouette */}
      <polygon points="700,178 770,118 840,178" fill="#3e2a18" />
      <polygon points="770,118 770,178 700,178" fill="#2a1c10" />
      {/* lantern */}
      <g transform="translate(880, 130)">
        <rect x="-4" y="0" width="8" height="20" fill="#4a3018" />
        <rect x="-7" y="20" width="14" height="14" fill="#d8a657" />
        <rect x="-7" y="20" width="14" height="14" fill="url(#rrss-moonglow)" />
        <rect x="-7" y="34" width="14" height="3" fill="#3a2410" />
      </g>
      <circle cx="880" cy="148" r="42" fill="#d8a657" opacity="0.18" />
    </HeroFrame>
  );
}

function LegendsHero(): JSX.Element {
  return (
    <HeroFrame gradientId="rrss-legends-bg" from="#0a0e16" via="#1f1a28" to="#241a14">
      <StarField count={22} w={1200} h={140} />
      <circle cx="940" cy="60" r="80" fill="url(#rrss-moonglow)" />
      <circle cx="940" cy="60" r="32" fill="#e8d5a8" />
      {/* gnarled trees - thicker, irregular */}
      <g fill="#0a0a08">
        <path d="M150,220 L150,90 Q140,80 132,70 Q142,75 150,82 L150,60 Q160,50 170,42 Q160,55 158,70 L158,220 Z" />
        <path d="M340,220 L340,80 Q352,72 358,60 Q352,75 348,90 L348,220 Z" />
        <path d="M580,220 L580,100 Q570,88 562,76 Q574,82 580,92 L580,68 Q590,58 602,50 Q592,62 588,78 L588,220 Z" />
      </g>
      <PineCluster x={-10} y={170} count={28} baseHeight={28} fill="#0d1a18" />
      {/* faint bigfoot deep in the trees */}
      <Bigfoot x={780} y={172} scale={0.5} fill="#050505" />
      {/* glowing eyes */}
      <circle cx="772" cy="120" r="2" fill="#f5e8a0" opacity="0.9" />
      <circle cx="780" cy="120" r="2" fill="#f5e8a0" opacity="0.9" />
    </HeroFrame>
  );
}

function SeasonsHero(): JSX.Element {
  return (
    <HeroFrame gradientId="rrss-seasons-bg" from="#cfd9d8" via="#e0d4b0" to="#8b6e48">
      <path d="M0,170 L1200,170 L1200,220 L0,220 Z" fill="#5a4a2c" />
      {/* sun + moon split */}
      <circle cx="120" cy="56" r="28" fill="#f0c97b" />
      <circle cx="1080" cy="56" r="28" fill="#e0e8ee" />
      {/* winter trees - bare */}
      <g fill="#1a1410" stroke="#1a1410" strokeWidth="2">
        <line x1="200" y1="170" x2="200" y2="100" />
        <line x1="200" y1="120" x2="180" y2="100" />
        <line x1="200" y1="118" x2="220" y2="98" />
        <line x1="200" y1="130" x2="186" y2="116" />
        <line x1="200" y1="128" x2="216" y2="114" />
      </g>
      {/* spring tree - light green */}
      <PineTree x={420} y={170} h={110} fill="#5a8a4a" />
      {/* summer tree - dark green */}
      <PineTree x={620} y={170} h={120} fill="#2d4a2b" />
      {/* fall tree - orange */}
      <g>
        <rect x="817" y="130" width="6" height="40" fill="#3a2410" />
        <circle cx="820" cy="118" r="28" fill="#c87a35" />
        <circle cx="808" cy="124" r="14" fill="#a85a25" />
        <circle cx="832" cy="122" r="16" fill="#d89a48" />
      </g>
      {/* footprints across the seasons */}
      <Footprint x={300} y={196} rotate={-8} scale={0.6} fill="#1a1006" opacity={0.7} />
      <Footprint x={520} y={200} rotate={6} scale={0.6} fill="#1a1006" opacity={0.7} />
      <Footprint x={720} y={196} rotate={-10} scale={0.6} fill="#1a1006" opacity={0.7} />
      <Footprint x={920} y={200} rotate={4} scale={0.6} fill="#1a1006" opacity={0.7} />
    </HeroFrame>
  );
}

export function ArticleHero({ variant = "trail" }: { variant?: string }): JSX.Element {
  switch (variant) {
    case "creek":
      return <CreekHero />;
    case "gear":
      return <GearHero />;
    case "legends":
      return <LegendsHero />;
    case "seasons":
      return <SeasonsHero />;
    case "trail":
    default:
      return <TrailHero />;
  }
}

export function FootprintDivider(): JSX.Element {
  return (
    <svg
      className="footprint-divider"
      viewBox="0 0 600 40"
      aria-hidden="true"
    >
      <Footprint x={80} y={28} rotate={-10} scale={0.45} fill="#5c3d11" opacity={0.5} />
      <Footprint x={170} y={32} rotate={6} scale={0.45} fill="#5c3d11" opacity={0.5} />
      <Footprint x={260} y={28} rotate={-8} scale={0.45} fill="#5c3d11" opacity={0.5} />
      <Footprint x={350} y={32} rotate={4} scale={0.45} fill="#5c3d11" opacity={0.5} />
      <Footprint x={440} y={28} rotate={-6} scale={0.45} fill="#5c3d11" opacity={0.5} />
      <Footprint x={520} y={32} rotate={8} scale={0.45} fill="#5c3d11" opacity={0.5} />
    </svg>
  );
}

export function HeaderMark(): JSX.Element {
  return (
    <svg
      className="header-mark"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rrss-mark-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d4a574" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#1a2620" />
      <circle cx="32" cy="32" r="30" fill="url(#rrss-mark-glow)" />
      <Bigfoot x={32} y={56} scale={0.45} fill="#f5ead8" />
    </svg>
  );
}
