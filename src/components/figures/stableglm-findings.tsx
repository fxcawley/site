/* Inline SVG figures for the StableGLM findings post. */

import { TEAL, RED, AMBER, svgStyle, figureCss } from './common';

export function AmbiguityBars() {
  const root = 'fig-amb';
  const base = 290;
  const top = 100;
  const span = base - top;
  // StableGLM/docs/_static/evaluation.json, tolerance 0.03 (October 2026).
  const data = [
    { n: 'Breast Cancer', d: 'd = 30', v: 6.2, x: 190, c: TEAL },
    { n: 'German Credit', d: 'd = 61', v: 82.9, x: 380, c: RED },
    { n: 'Adult Census', d: 'd = 101; n = 5,000', v: 67.8, x: 570, c: AMBER },
  ];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Exact ambiguity at 3 percent loss tolerance: 6.2 percent for Breast Cancer, 82.9 percent for German Credit, and 67.8 percent for the Adult Census subsample.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Rows whose predicted label can change (3% loss tolerance)</text>
      <text className="sub" x="28" y="64" fontSize="13">Exact flip tests at a probability threshold of 0.5. Each row may require a different competing model.</text>

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
  const py = (r: number) => 300 - (r / 100) * 200;
  // Median sampled width / exact width, from the same 3% evaluation.
  const pts = [
    { d: 'Breast Cancer (d = 30)', x: 200, coverage: 52 },
    { d: 'German Credit (d = 61)', x: 400, coverage: 40 },
    { d: 'Adult (d = 101)', x: 600, coverage: 19 },
  ];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="At 3 percent loss tolerance, sampled coefficient ranges cover a median of 52 percent of the exact width on Breast Cancer, 40 percent on German Credit, and 19 percent on Adult.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">How much of the coefficient range the samples cover</text>
      <text className="sub" x="28" y="64" fontSize="13">Median sampled width / exact width, with 2,000 draws at a 3% loss tolerance.</text>

      <line className="edge" x1="90" y1="300" x2="690" y2="300" strokeWidth="1.5" />
      <line className="edge" x1="90" y1="100" x2="90" y2="300" strokeWidth="1.5" />
      {[0, 25, 50, 75, 100].map((r) => (
        <g key={r}>
          <line className="edge" x1="90" y1={py(r)} x2="690" y2={py(r)} strokeWidth="1" opacity="0.5" />
          <text className="mut" x="80" y={py(r) + 4} fontSize="11" textAnchor="end">{r}%</text>
        </g>
      ))}
      {pts.map((p) => (
        <g key={p.d}>
          <rect x={p.x - 40} y={py(p.coverage)} width="80" height={300 - py(p.coverage)} rx="4" fill={AMBER} fillOpacity="0.85" />
          <text className="lbl" x={p.x} y={py(p.coverage) - 10} fontSize="13" textAnchor="middle">{p.coverage}%</text>
          <text className="lbl" x={p.x} y="320" fontSize="12" textAnchor="middle">{p.d}</text>
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
  const pxX = (e: number) => 90 + (e / 30) * 600;
  const pxY = (a: number) => 300 - (a / 35) * 200;
  // Breast Cancer full, C=1: 1%, 3%, and the CV tolerance in evaluation.json.
  const curve = [
    [1, 2.8], [3, 6.2], [26.3, 27.6],
  ];
  const pts = curve.map(([e, a]) => `${pxX(e)},${pxY(a)}`).join(' ');
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Exact ambiguity on Breast Cancer is 2.8 percent at 1 percent relative loss tolerance, 6.2 percent at 3 percent, and 27.6 percent at the 26.3 percent cross-validation tolerance.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Ambiguity at three loss tolerances</text>
      <text className="sub" x="28" y="64" fontSize="13">Breast Cancer, 30 features, C = 1. Exact flip rates; the rightmost point uses the CV tolerance.</text>

      <line className="edge" x1="90" y1="300" x2="690" y2="300" strokeWidth="1.5" />
      <line className="edge" x1="90" y1="100" x2="90" y2="300" strokeWidth="1.5" />
      {[0, 10, 20, 30].map((a) => (
        <text key={a} className="mut" x="80" y={pxY(a) + 4} fontSize="11" textAnchor="end">{a}%</text>
      ))}
      {[0, 5, 10, 20, 30].map((e) => (
        <text key={e} className="mut" x={pxX(e)} y="320" fontSize="11" textAnchor="middle">{e}%</text>
      ))}
      <text className="mut" x="390" y="336" fontSize="12" textAnchor="middle">tolerance as a percentage of optimal loss</text>

      <polyline points={pts} fill="none" stroke={TEAL} strokeWidth="2.5" />
      {curve.map(([e, a]) => (
        <circle key={e} cx={pxX(e)} cy={pxY(a)} r="4" fill={TEAL} />
      ))}
    </svg>
  );
}
