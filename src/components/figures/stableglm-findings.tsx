/* Inline SVG figures for the StableGLM findings post. */

import { TEAL, RED, AMBER, svgStyle, figureCss } from './common';

export function AmbiguityBars() {
  const root = 'fig-amb';
  const base = 290;
  const top = 100;
  const span = base - top;
  const data = [
    { n: 'Breast Cancer', d: 'd = 30', v: 18.4, x: 190, c: TEAL },
    { n: 'German Credit', d: 'd = 61', v: 85.4, x: 380, c: RED },
    { n: 'Adult Census', d: 'd = 104', v: 63.8, x: 570, c: AMBER },
  ];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Ambiguity at 3 percent loss tolerance: 18 percent for Breast Cancer, 85 percent for German Credit, 64 percent for Adult Census.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">How many predictions are up for grabs (at 3% loss tolerance)</text>
      <text className="sub" x="28" y="64" fontSize="13">Share of points whose predicted label could change depending on which near-optimal model is chosen.</text>

      {[0, 25, 50, 75, 100].map((g) => {
        const y = base - (g / 100) * span;
        return (
          <g key={g}>
            <line className="edge" x1="90" y1={y} x2="690" y2={y} strokeWidth="1" opacity="0.5" />
            <text className="mut" x="80" y={y + 4} fontSize="11" textAnchor="end">{g}%</text>
          </g>
        );
      })}

      {data.map((b) => {
        const h = (b.v / 100) * span;
        return (
          <g key={b.n}>
            <rect x={b.x - 45} y={base - h} width="90" height={h} rx="4" fill={b.c} fillOpacity="0.85" />
            <text className="lbl" x={b.x} y={base - h - 10} fontSize="14" textAnchor="middle" fontWeight="700">{b.v}%</text>
            <text className="lbl" x={b.x} y={base + 20} fontSize="13" textAnchor="middle">{b.n}</text>
            <text className="mut" x={b.x} y={base + 38} fontSize="12" textAnchor="middle">{b.d}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TightnessVsDim() {
  const root = 'fig-tight';
  const py = (r: number) => 300 - (r / 13) * 200;
  const pts = [
    { d: 'd = 30', x: 200, lo: 2.8, hi: 3.7 },
    { d: 'd = 61', x: 400, lo: 4.4, hi: 6.2 },
    { d: 'd = 104', x: 600, lo: 8.2, hi: 12.3 },
  ];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="The certificate tightness ratio grows with dimension: about 3x at d=30, 5x at d=61, and 10x at d=104.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">The fast certificate gets looser in higher dimensions</text>
      <text className="sub" x="28" y="64" fontSize="13">Ratio of the closed-form interval to the true (sampled) interval. Closer to 1 means tighter.</text>

      <line className="edge" x1="90" y1="300" x2="690" y2="300" strokeWidth="1.5" />
      <line className="edge" x1="90" y1="100" x2="90" y2="300" strokeWidth="1.5" />
      {[1, 5, 10].map((r) => (
        <g key={r}>
          <line className="edge" x1="90" y1={py(r)} x2="690" y2={py(r)} strokeWidth="1" opacity="0.5" strokeDasharray={r === 1 ? '4 4' : undefined} />
          <text className="mut" x="80" y={py(r) + 4} fontSize="11" textAnchor="end">{r}×</text>
        </g>
      ))}
      <text className="mut" x="694" y={py(1) + 4} fontSize="11">tight</text>

      {pts.map((p) => (
        <g key={p.d}>
          <line x1={p.x} y1={py(p.lo)} x2={p.x} y2={py(p.hi)} stroke={AMBER} strokeWidth="10" strokeLinecap="round" opacity="0.85" />
          <text className="lbl" x={p.x + 22} y={(py(p.lo) + py(p.hi)) / 2 + 4} fontSize="12">{p.lo}–{p.hi}×</text>
          <text className="lbl" x={p.x} y="320" fontSize="13" textAnchor="middle">{p.d}</text>
        </g>
      ))}
    </svg>
  );
}

export function McrBars() {
  const root = 'fig-mcr';
  const zero = 430;
  const scale = 210;
  const px = (v: number) => zero + v * scale;
  const feats = [
    { name: 'feature 1', lo: -0.15, hi: 0.85 },
    { name: 'feature 2', lo: -0.30, hi: 0.62 },
    { name: 'feature 3', lo: -0.08, hi: 0.74 },
    { name: 'feature 4', lo: -0.42, hi: 0.55 },
    { name: 'feature 5', lo: -0.22, hi: 0.90 },
    { name: 'feature 6', lo: -0.12, hi: 0.48 },
  ];
  return (
    <svg viewBox="0 0 760 360" style={svgStyle} className={root} role="img"
      aria-label="Model class reliance ranges: every feature's range dips below zero, so no feature is indispensable.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="358" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">No feature is indispensable</text>
      <text className="sub" x="28" y="64" fontSize="13">Every feature's importance range (MCR) dips below zero: some near-optimal model finds it unhelpful.</text>

      <line x1={zero} y1="88" x2={zero} y2="316" stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text className="mut" x={zero} y="336" fontSize="12" textAnchor="middle">0</text>
      <text className="mut" x="130" y="336" fontSize="12">MCR⁻ (harmful)</text>
      <text className="mut" x="700" y="336" fontSize="12" textAnchor="end">MCR⁺ (helpful)</text>

      {feats.map((f, i) => {
        const y = 104 + i * 34;
        return (
          <g key={f.name}>
            <text className="lbl" x="36" y={y + 5} fontSize="12">{f.name}</text>
            <rect x={px(f.lo)} y={y - 7} width={px(f.hi) - px(f.lo)} height="14" rx="7" fill={TEAL} fillOpacity="0.8" />
            <rect x={px(f.lo)} y={y - 7} width={zero - px(f.lo)} height="14" rx="7" fill={RED} fillOpacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

export function EpsilonSweep() {
  const root = 'fig-eps';
  const pxX = (e: number) => 90 + (e / 10) * 600;
  const pxY = (a: number) => 300 - (a / 100) * 200;
  const curve = [
    [0.5, 8.8], [1, 12], [2, 25], [3, 38], [5, 50], [7, 56], [10, 60.8],
  ];
  const pts = curve.map(([e, a]) => `${pxX(e)},${pxY(a)}`).join(' ');
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Ambiguity versus loss tolerance on Breast Cancer: it rises fastest in the 1 to 5 percent band.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Ambiguity rises fastest in a narrow tolerance band</text>
      <text className="sub" x="28" y="64" fontSize="13">Breast Cancer: how ambiguity grows as the loss tolerance ε is loosened.</text>

      {/* phase transition band */}
      <rect x={pxX(1)} y="100" width={pxX(5) - pxX(1)} height="200" fill={AMBER} fillOpacity="0.12" />
      <text className="mut" x={(pxX(1) + pxX(5)) / 2} y="118" fontSize="11" textAnchor="middle">rapid-change region</text>

      <line className="edge" x1="90" y1="300" x2="690" y2="300" strokeWidth="1.5" />
      <line className="edge" x1="90" y1="100" x2="90" y2="300" strokeWidth="1.5" />
      {[0, 25, 50, 75].map((a) => (
        <text key={a} className="mut" x="80" y={pxY(a) + 4} fontSize="11" textAnchor="end">{a}%</text>
      ))}
      {[0.5, 1, 3, 5, 10].map((e) => (
        <text key={e} className="mut" x={pxX(e)} y="320" fontSize="11" textAnchor="middle">{e}%</text>
      ))}
      <text className="mut" x="390" y="336" fontSize="12" textAnchor="middle">loss tolerance ε</text>

      <polyline points={pts} fill="none" stroke={TEAL} strokeWidth="2.5" />
      {curve.map(([e, a]) => (
        <circle key={e} cx={pxX(e)} cy={pxY(a)} r="4" fill={TEAL} />
      ))}
    </svg>
  );
}
