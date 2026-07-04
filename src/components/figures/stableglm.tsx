/* Inline SVG figures for the StableGLM thread. */

import { TEAL, RED, SLATE, svgStyle, figureCss } from './common';

export function RashomonSet() {
  const root = 'fig-rash';
  const near = [[240, 200], [352, 232], [300, 182], [360, 206], [255, 238], [330, 190]];
  return (
    <svg viewBox="0 0 760 360" style={svgStyle} className={root} role="img"
      aria-label="A loss landscape whose flat valley contains many parameter settings that all fit nearly as well as the best one.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="358" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Many parameter settings fit almost equally well</text>
      <text className="sub" x="28" y="64" fontSize="13">The shaded valley holds every model within ε of the best loss. Any of them could be the one your solver returns.</text>

      <g transform="translate(300,220)">
        <ellipse className="edge" cx="0" cy="0" rx="240" ry="82" strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="182" ry="62" fill={TEAL} fillOpacity="0.16" stroke={TEAL} strokeDasharray="5 4" />
        <ellipse className="edge" cx="0" cy="0" rx="118" ry="40" strokeWidth="1.5" />
      </g>

      {near.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={TEAL} />
      ))}
      <circle cx="300" cy="220" r="6" fill="var(--accent)" />
      <text className="lbl" x="300" y="205" fontSize="12" textAnchor="middle" fontWeight="600">best fit</text>

      <circle cx="300" cy="112" r="5" fill={SLATE} />
      <text className="mut" x="316" y="116" fontSize="12">worse fit, outside the set</text>

      <g transform="translate(548,120)">
        <ellipse cx="10" cy="4" rx="14" ry="9" fill={TEAL} fillOpacity="0.16" stroke={TEAL} strokeDasharray="4 3" />
        <text className="lbl" x="34" y="8" fontSize="12">loss ≤ best + ε</text>
        <circle cx="10" cy="40" r="5" fill={TEAL} />
        <text className="lbl" x="34" y="44" fontSize="12">a near-optimal model</text>
        <circle cx="10" cy="72" r="6" fill="var(--accent)" />
        <text className="lbl" x="34" y="76" fontSize="12">the model that was fit</text>
      </g>
    </svg>
  );
}

export function TwoUncertainties() {
  const root = 'fig-unc';
  return (
    <svg viewBox="0 0 760 360" style={svgStyle} className={root} role="img"
      aria-label="With more data the bootstrap interval narrows while the Rashomon interval stays wide.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="358" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Two different kinds of uncertainty</text>
      <text className="sub" x="28" y="64" fontSize="13">More data shrinks sampling noise. It does not shrink the ambiguity over which near-optimal model to pick.</text>

      {/* bootstrap band, narrowing */}
      <text className="lbl" x="150" y="104" fontSize="13" fontWeight="600">bootstrap CI (sampling noise)</text>
      <polygon points="150,120 620,150 620,158 150,196" fill={TEAL} fillOpacity="0.28" />
      <line x1="150" y1="158" x2="620" y2="154" stroke={TEAL} strokeWidth="2" strokeDasharray="5 4" />

      {/* model multiplicity band, constant */}
      <text className="lbl" x="150" y="238" fontSize="13" fontWeight="600">Rashomon interval (model multiplicity)</text>
      <polygon points="150,252 620,252 620,312 150,312" fill={RED} fillOpacity="0.18" />
      <line x1="150" y1="282" x2="620" y2="282" stroke={RED} strokeWidth="2" strokeDasharray="5 4" />

      {/* x axis */}
      <line className="edge" x1="150" y1="330" x2="620" y2="330" strokeWidth="1.5" />
      <text className="mut" x="150" y="348" fontSize="12">little data</text>
      <text className="mut" x="620" y="348" fontSize="12" textAnchor="end">more data →</text>
    </svg>
  );
}

export function FlatDirection() {
  const root = 'fig-flat';
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="An elongated Rashomon ellipsoid: along its long flat axis the model can change a lot without raising the loss, so explanations are unstable there.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Flat directions are where explanations wobble</text>
      <text className="sub" x="28" y="64" fontSize="13">A small curvature (Hessian eigenvalue) means the coefficients can drift far while the loss barely changes.</text>

      <defs>
        <marker id="flat-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>

      {/* axes */}
      <line className="edge" x1="90" y1="205" x2="510" y2="205" strokeWidth="1.5" />
      <line className="edge" x1="300" y1="300" x2="300" y2="110" strokeWidth="1.5" />
      <text className="mut" x="512" y="209" fontSize="12">θ₁</text>
      <text className="mut" x="300" y="104" fontSize="12" textAnchor="middle">θ₂</text>

      <ellipse cx="300" cy="205" rx="185" ry="52" fill="var(--accent)" fillOpacity="0.14" stroke="var(--accent)" />
      <circle cx="300" cy="205" r="5" fill="var(--accent)" />

      {/* flat (major) axis arrow */}
      <line x1="128" y1="205" x2="472" y2="205" stroke="var(--fg-muted)" strokeWidth="1.5" markerStart="url(#flat-arrow)" markerEnd="url(#flat-arrow)" />
      {/* steep (minor) axis arrow */}
      <line x1="300" y1="160" x2="300" y2="250" stroke="var(--fg-muted)" strokeWidth="1.5" markerStart="url(#flat-arrow)" markerEnd="url(#flat-arrow)" />

      <g transform="translate(540,150)">
        <text className="lbl" x="0" y="0" fontSize="13" fontWeight="600">flat direction</text>
        <text className="mut" x="0" y="20" fontSize="12">model changes a lot,</text>
        <text className="mut" x="0" y="36" fontSize="12">loss barely moves</text>
        <text className="lbl" x="0" y="78" fontSize="13" fontWeight="600">steep direction</text>
        <text className="mut" x="0" y="98" fontSize="12">loss rises quickly,</text>
        <text className="mut" x="0" y="114" fontSize="12">explanation is stable</text>
      </g>
    </svg>
  );
}

export function SignFlipCloud() {
  const root = 'fig-vic';
  const feats = [
    { name: 'feature 1', lo: 0.20, hi: 0.92, flip: false },
    { name: 'feature 2', lo: -0.42, hi: 0.58, flip: true },
    { name: 'feature 3', lo: 0.06, hi: 0.70, flip: false },
    { name: 'feature 4', lo: -0.70, hi: 0.22, flip: true },
    { name: 'feature 5', lo: 0.30, hi: 1.00, flip: false },
    { name: 'feature 6', lo: -0.55, hi: 0.50, flip: true },
  ];
  const zero = 420;
  const scale = 235;
  const px = (v: number) => zero + v * scale;
  return (
    <svg viewBox="0 0 760 380" style={svgStyle} className={root} role="img"
      aria-label="Variable importance cloud: each feature's coefficient range across the near-optimal set; several ranges cross zero, meaning the sign can flip.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="378" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">A coefficient's sign can flip across equally good models</text>
      <text className="sub" x="28" y="64" fontSize="13">Each bar is one feature's coefficient range over the Rashomon set. Bars that cross zero have no stable sign.</text>

      {/* zero line */}
      <line x1={zero} y1="90" x2={zero} y2="330" stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text className="mut" x={zero} y="350" fontSize="12" textAnchor="middle">0</text>
      <text className="mut" x="120" y="350" fontSize="12">helps less / hurts</text>
      <text className="mut" x="700" y="350" fontSize="12" textAnchor="end">helps more</text>

      {feats.map((f, i) => {
        const y = 112 + i * 38;
        const color = f.flip ? RED : TEAL;
        return (
          <g key={f.name}>
            <text className="lbl" x="36" y={y + 5} fontSize="12">{f.name}</text>
            <rect x={px(f.lo)} y={y - 8} width={px(f.hi) - px(f.lo)} height="16" rx="8" fill={color} fillOpacity="0.85" />
          </g>
        );
      })}

      <g transform="translate(560,104)">
        <rect x="0" y="-8" width="22" height="14" rx="7" fill={TEAL} fillOpacity="0.85" />
        <text className="lbl" x="30" y="4" fontSize="12">sign stable</text>
        <rect x="0" y="18" width="22" height="14" rx="7" fill={RED} fillOpacity="0.85" />
        <text className="lbl" x="30" y="30" fontSize="12">sign flips</text>
      </g>
    </svg>
  );
}
