// SVG product illustrations. One <ProductImage variant="..." /> per product.

import { JSX } from 'react';

interface BackdropProps {
  from: string;
  to: string;
  gradId: string;
}

function Backdrop({ from, to, gradId }: BackdropProps): JSX.Element {
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill={`url(#${gradId})`} />
      <ellipse cx="200" cy="290" rx="160" ry="14" fill="rgba(0,0,0,0.18)" />
    </>
  );
}

function SprayBottle(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#dee5d4" to="#9aab8e" gradId="prod-spray-bg" />
      {/* mist */}
      <g fill="#f5ead8" opacity="0.7">
        <circle cx="320" cy="120" r="6" />
        <circle cx="340" cy="100" r="4" />
        <circle cx="350" cy="130" r="5" />
        <circle cx="365" cy="115" r="3" />
        <circle cx="330" cy="145" r="3" />
      </g>
      {/* trigger sprayer */}
      <g fill="#3a3528">
        <rect x="170" y="80" width="60" height="38" rx="6" />
        <path d="M180 118 L180 145 L155 162 L150 158 Z" />
        <rect x="225" y="98" width="60" height="10" rx="3" />
        <rect x="285" y="100" width="6" height="6" />
      </g>
      {/* bottle */}
      <path
        d="M150 130 L250 130 L260 160 L260 270 Q260 290 240 290 L160 290 Q140 290 140 270 L140 160 Z"
        fill="#7a4a1d"
      />
      <path
        d="M150 130 L250 130 L260 160 L260 270 Q260 290 240 290 L160 290 Q140 290 140 270 L140 160 Z"
        fill="url(#prod-spray-shine)"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="prod-spray-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* label */}
      <rect x="143" y="178" width="114" height="84" rx="3" fill="#f5ead8" />
      <rect x="143" y="178" width="114" height="18" fill="#5c3d11" />
      <text x="200" y="192" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="2" fill="#f5ead8">PHEROMONE LURE</text>
      <text x="200" y="222" textAnchor="middle" fontSize="13" fontWeight="700" fill="#5c3d11">SASQ-O-TRON</text>
      <text x="200" y="238" textAnchor="middle" fontSize="9" fill="#5c3d11" opacity="0.75">3000™</text>
      <line x1="160" y1="246" x2="240" y2="246" stroke="#5c3d11" strokeWidth="0.5" opacity="0.4" />
      <text x="200" y="256" textAnchor="middle" fontSize="6" fill="#5c3d11" opacity="0.6">6 FL OZ · KEEP UPWIND</text>
    </svg>
  );
}

function GhillieSuit(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#cfd9c5" to="#7a8a72" gradId="prod-ghillie-bg" />
      {/* hooded figure */}
      <ellipse cx="200" cy="100" rx="40" ry="42" fill="#3a4a2e" />
      <path d="M155 140 Q140 195 145 270 L255 270 Q260 195 245 140 Q235 130 200 130 Q165 130 155 140 Z" fill="#3a4a2e" />
      {/* fronds — many small irregular shapes */}
      <g fill="#4a5e3a">
        {Array.from({ length: 80 }).map((_, i) => {
          const r = (i * 137) % 1000;
          const x = 145 + ((i * 17) % 110);
          const y = 70 + ((i * 23) % 220);
          const rot = (i * 41) % 360;
          const w = 4 + ((i * 5) % 6);
          const h = 14 + ((i * 7) % 18);
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={w}
              ry={h}
              fill={i % 3 === 0 ? "#5a7345" : i % 3 === 1 ? "#384a2a" : "#6a8855"}
              transform={`rotate(${rot} ${x} ${y})`}
              opacity={0.85 + (r % 100) / 700}
            />
          );
        })}
      </g>
      {/* face hole shadow */}
      <ellipse cx="200" cy="105" rx="14" ry="18" fill="#0a0e08" opacity="0.6" />
    </svg>
  );
}

function CastingKit(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#e6dcc6" to="#a89472" gradId="prod-cast-bg" />
      {/* mud puddle with footprint */}
      <ellipse cx="130" cy="240" rx="80" ry="22" fill="#4a3a2a" />
      <ellipse cx="130" cy="238" rx="60" ry="14" fill="#3a2c1e" />
      {/* footprint impression in mud */}
      <g fill="#1a1006">
        <ellipse cx="130" cy="240" rx="22" ry="34" />
        <circle cx="118" cy="208" r="4.5" />
        <circle cx="124" cy="202" r="5" />
        <circle cx="132" cy="200" r="5.5" />
        <circle cx="140" cy="202" r="5" />
        <circle cx="146" cy="208" r="4.5" />
      </g>
      {/* dental stone bucket */}
      <path d="M250 160 L320 160 L315 270 Q310 285 285 285 Q260 285 255 270 Z" fill="#3a3528" />
      <ellipse cx="285" cy="160" rx="35" ry="8" fill="#5a5040" />
      <ellipse cx="285" cy="160" rx="30" ry="5" fill="#e8e2d2" />
      <rect x="262" y="195" width="46" height="28" fill="#f5ead8" />
      <text x="285" y="213" textAnchor="middle" fontSize="9" fontWeight="700" fill="#5c3d11">DENTAL</text>
      <text x="285" y="223" textAnchor="middle" fontSize="9" fontWeight="700" fill="#5c3d11">STONE</text>
      {/* brush */}
      <g transform="translate(220, 220) rotate(-25)">
        <rect x="0" y="0" width="60" height="10" rx="2" fill="#5c3d11" />
        <rect x="-12" y="-2" width="14" height="14" rx="2" fill="#a89472" />
      </g>
    </svg>
  );
}

function Monocular(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#1f2a32" to="#0a1218" gradId="prod-mono-bg" />
      {/* night-vision green halo */}
      <circle cx="200" cy="160" r="120" fill="#2d6a3e" opacity="0.18" />
      {/* monocular body */}
      <g transform="translate(80, 130)">
        <rect x="0" y="20" width="180" height="60" rx="14" fill="#1a1a1a" />
        <rect x="0" y="20" width="180" height="60" rx="14" fill="url(#prod-mono-shine)" opacity="0.5" />
        <rect x="60" y="14" width="60" height="6" rx="2" fill="#3a3a3a" />
        {/* eyepiece */}
        <rect x="-22" y="34" width="28" height="32" rx="6" fill="#0a0a0a" />
        <circle cx="-8" cy="50" r="10" fill="#1a3a25" />
        <circle cx="-8" cy="50" r="6" fill="#3a8a55" />
        {/* objective lens */}
        <circle cx="190" cy="50" r="22" fill="#0a0a0a" />
        <circle cx="190" cy="50" r="18" fill="#1a3a25" />
        <circle cx="190" cy="50" r="14" fill="#2d6a3e" />
        <circle cx="184" cy="44" r="3" fill="#a8d8b8" opacity="0.7" />
        {/* IR illuminator */}
        <circle cx="40" cy="50" r="9" fill="#220a0a" />
        <circle cx="40" cy="50" r="5" fill="#882020" />
        {/* knobs */}
        <circle cx="90" cy="50" r="8" fill="#3a3a3a" />
        <circle cx="130" cy="50" r="8" fill="#3a3a3a" />
      </g>
      <defs>
        <linearGradient id="prod-mono-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Branch(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#dad2bc" to="#8b7656" gradId="prod-branch-bg" />
      {/* main branch */}
      <g fill="#5c3d11">
        <path d="M60 240 Q140 220 220 200 Q280 188 340 170 L342 178 Q282 196 222 208 Q142 228 62 248 Z" />
        {/* small fork */}
        <path d="M220 200 Q230 175 245 160 L249 162 Q236 178 226 202 Z" />
        {/* knot */}
        <ellipse cx="170" cy="218" rx="5" ry="4" fill="#3a2410" />
        <ellipse cx="270" cy="192" rx="4" ry="3" fill="#3a2410" />
      </g>
      {/* bark texture */}
      <g stroke="#3a2410" strokeWidth="0.8" opacity="0.5" fill="none">
        <path d="M70 240 Q140 224 210 208" />
        <path d="M75 244 Q145 228 215 212" />
        <path d="M80 248 Q150 232 220 216" />
      </g>
      {/* tag with twine */}
      <g transform="translate(280, 175)">
        <line x1="0" y1="0" x2="20" y2="40" stroke="#ccb88c" strokeWidth="1.5" />
        <rect x="14" y="36" width="44" height="28" rx="2" fill="#f5ead8" transform="rotate(8 14 36)" />
        <g transform="rotate(8 14 36)">
          <text x="36" y="48" textAnchor="middle" fontSize="7" fontWeight="700" fill="#5c3d11">RR-WK</text>
          <text x="36" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#5c3d11">#0042</text>
        </g>
      </g>
    </svg>
  );
}

function TrailCamera(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#3d4a3a" to="#1a2218" gradId="prod-cam-bg" />
      {/* tree trunk behind */}
      <rect x="0" y="0" width="80" height="320" fill="#2a1f12" opacity="0.7" />
      <rect x="0" y="40" width="80" height="6" fill="#3a2818" opacity="0.5" />
      <rect x="0" y="120" width="80" height="6" fill="#3a2818" opacity="0.5" />
      <rect x="0" y="220" width="80" height="6" fill="#3a2818" opacity="0.5" />
      {/* strap */}
      <rect x="60" y="140" width="220" height="6" fill="#1a1a1a" />
      <rect x="60" y="186" width="220" height="6" fill="#1a1a1a" />
      {/* camera body */}
      <rect x="120" y="120" width="180" height="120" rx="10" fill="#3a4a2e" />
      <rect x="120" y="120" width="180" height="120" rx="10" fill="url(#prod-cam-camo)" opacity="0.4" />
      <defs>
        <pattern id="prod-cam-camo" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#3a4a2e" />
          <ellipse cx="6" cy="6" rx="4" ry="3" fill="#5a6a48" />
          <ellipse cx="14" cy="14" rx="3" ry="4" fill="#2a3a22" />
        </pattern>
      </defs>
      {/* lens */}
      <circle cx="180" cy="180" r="28" fill="#0a0a0a" />
      <circle cx="180" cy="180" r="22" fill="#1a1a1a" />
      <circle cx="180" cy="180" r="16" fill="#2a3a32" />
      <circle cx="174" cy="174" r="4" fill="#a8c5b8" opacity="0.7" />
      {/* IR LED grid */}
      <g fill="#2a0a0a">
        {Array.from({ length: 9 }).map((_, i) => {
          const cx = 230 + (i % 3) * 18;
          const cy = 152 + Math.floor(i / 3) * 18;
          return <circle key={i} cx={cx} cy={cy} r="5" />;
        })}
      </g>
      {/* sensor + status LED */}
      <rect x="220" y="218" width="60" height="10" rx="2" fill="#1a1a1a" />
      <circle cx="280" cy="138" r="3" fill="#88dd55" />
    </svg>
  );
}

function MembershipCard(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#2d3a30" to="#0e1612" gradId="prod-card-bg" />
      <g transform="translate(60, 90) rotate(-6 140 70)">
        {/* card */}
        <rect x="0" y="0" width="280" height="170" rx="12" fill="#1a2620" />
        <rect x="0" y="0" width="280" height="170" rx="12" fill="url(#prod-card-shine)" opacity="0.45" />
        {/* border emboss */}
        <rect x="6" y="6" width="268" height="158" rx="9" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.7" />
        {/* bigfoot mini icon */}
        <g transform="translate(28, 32) scale(0.5)" fill="#d4a574">
          <ellipse cx="22" cy="14" rx="11" ry="13" />
          <path d="M 9 25 L 35 25 L 38 72 L 6 72 Z" />
          <rect x="11" y="70" width="9" height="30" />
          <rect x="24" y="70" width="9" height="30" />
        </g>
        {/* text */}
        <text x="98" y="44" fontSize="10" letterSpacing="2.4" fill="#d4a574" fontWeight="700">ROUND ROCK</text>
        <text x="98" y="60" fontSize="10" letterSpacing="1.6" fill="#d4a574" fontWeight="700">SASQUATCH SOCIETY</text>
        <text x="20" y="108" fontSize="9" letterSpacing="1.5" fill="#a89572" opacity="0.85">LIFETIME MEMBER</text>
        <text x="20" y="134" fontSize="20" fontWeight="700" fill="#f5ead8">No. 0042</text>
        <text x="20" y="150" fontSize="7" letterSpacing="0.8" fill="#7a6a4a">EST. ALONG BRUSHY CREEK</text>
        {/* embossed seal */}
        <circle cx="232" cy="120" r="22" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.7" />
        <circle cx="232" cy="120" r="16" fill="none" stroke="#d4a574" strokeWidth="0.5" opacity="0.5" />
        <text x="232" y="124" textAnchor="middle" fontSize="13" fill="#d4a574" fontWeight="700">RRSS</text>
      </g>
      <defs>
        <linearGradient id="prod-card-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FieldJournal(): JSX.Element {
  return (
    <svg viewBox="0 0 400 320" className="product-svg" aria-hidden="true">
      <Backdrop from="#e8dec8" to="#a89272" gradId="prod-journal-bg" />
      {/* book shadow */}
      <rect x="118" y="60" width="170" height="220" rx="6" fill="rgba(0,0,0,0.25)" />
      {/* book cover */}
      <rect x="110" y="50" width="170" height="220" rx="6" fill="#5c3d11" />
      <rect x="110" y="50" width="170" height="220" rx="6" fill="url(#prod-book-shine)" opacity="0.4" />
      {/* spine */}
      <rect x="110" y="50" width="14" height="220" fill="#3a2410" />
      {/* embossed border */}
      <rect x="138" y="78" width="130" height="170" rx="2" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.7" />
      {/* embossed title */}
      <text x="203" y="148" textAnchor="middle" fontSize="13" fontWeight="700" fill="#d4a574" letterSpacing="2">BRUSHY CREEK</text>
      <text x="203" y="170" textAnchor="middle" fontSize="11" fill="#d4a574" letterSpacing="3" opacity="0.85">FIELD JOURNAL</text>
      {/* footprint emboss */}
      <g transform="translate(203, 200) scale(0.6)" fill="#d4a574" opacity="0.7">
        <ellipse cx="0" cy="6" rx="11" ry="18" />
        <circle cx="-7" cy="-15" r="2.4" />
        <circle cx="-3" cy="-19" r="2.8" />
        <circle cx="2" cy="-21" r="3.2" />
        <circle cx="7" cy="-19" r="2.8" />
        <circle cx="11" cy="-15" r="2.4" />
      </g>
      {/* ribbon bookmark */}
      <rect x="240" y="50" width="6" height="240" fill="#2d4a2b" />
      <polygon points="237,290 246,290 243,300" fill="#2d4a2b" />
      <defs>
        <linearGradient id="prod-book-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ProductImage({ variant }: { variant?: string }): JSX.Element {
  switch (variant) {
    case "spray":
      return <SprayBottle />;
    case "ghillie":
      return <GhillieSuit />;
    case "cast":
      return <CastingKit />;
    case "monocular":
      return <Monocular />;
    case "branch":
      return <Branch />;
    case "camera":
      return <TrailCamera />;
    case "card":
      return <MembershipCard />;
    case "journal":
      return <FieldJournal />;
    default:
      return <SprayBottle />;
  }
}
