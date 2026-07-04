/* Inline SVG figures for the MetaRepICL posts. */

import { TEAL, RED, svgStyle, figureCss } from './common';

export function IclMechanism() {
  const root = 'fig-icl';
  const rows = [
    { y: 158, ex: '(x\u2081, y\u2081)', s: 0.82, sv: '0.82', w: 0.55, wv: '0.55' },
    { y: 206, ex: '(x\u2082, y\u2082)', s: 0.30, sv: '0.30', w: 0.12, wv: '0.12' },
    { y: 254, ex: '(x\u2083, y\u2083)', s: 0.58, sv: '0.58', w: 0.33, wv: '0.33' },
  ];
  return (
    <svg viewBox="0 0 760 320" style={svgStyle} className={root} role="img"
      aria-label="In-context learning scores each example by how well it matches the query, then predicts the weighted average of the example outputs.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="icl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="318" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">How in-context learning turns examples into an answer</text>
      <text className="sub" x="28" y="64" fontSize="13">Each example is scored by how well its input matches the query x★.</text>
      <text className="sub" x="28" y="82" fontSize="13">The prediction is the weighted average of the example outputs yᵢ.</text>

      {/* column headers */}
      <text className="mut" x="28" y="128" fontSize="12">example</text>
      <text className="mut" x="150" y="128" fontSize="12">match score sᵢ</text>
      <text className="mut" x="372" y="128" fontSize="12">weight wᵢ (after softmax)</text>

      {/* softmax label between columns */}
      <text className="mut" x="332" y="212" fontSize="11" textAnchor="middle" transform="rotate(-90 332 212)">softmax</text>

      {rows.map((r) => (
        <g key={r.ex}>
          {/* example chip */}
          <rect className="track" x="24" y={r.y - 16} width="104" height="32" rx="7" />
          <text className="lbl" x="76" y={r.y + 5} fontSize="13" textAnchor="middle">{r.ex}</text>
          <line className="flow" x1="132" y1={r.y} x2="148" y2={r.y} markerEnd="url(#icl-arrow)" strokeWidth="1.5" />

          {/* score bar */}
          <rect className="track" x="150" y={r.y - 11} width="150" height="22" rx="6" />
          <rect x="150" y={r.y - 11} width={150 * r.s} height="22" rx="6" fill={TEAL} />
          <text className="lbl" x="308" y={r.y + 5} fontSize="12">{r.sv}</text>

          {/* softmax arrow */}
          <line className="flow" x1="348" y1={r.y} x2="368" y2={r.y} markerEnd="url(#icl-arrow)" strokeWidth="1.5" />

          {/* weight bar */}
          <rect className="track" x="372" y={r.y - 11} width="150" height="22" rx="6" />
          <rect x="372" y={r.y - 11} width={150 * r.w} height="22" rx="6" fill="var(--accent)" />
          <text className="lbl" x="530" y={r.y + 5} fontSize="12">{r.wv}</text>

          {/* to result */}
          <path className="flow" d={`M556 ${r.y} C 590 ${r.y}, 600 206, 620 206`} strokeWidth="1.5" markerEnd="url(#icl-arrow)" />
        </g>
      ))}

      {/* result box */}
      <rect className="edge" x="622" y="170" width="114" height="72" rx="10" fill="var(--surface)" />
      <text className="ttl" x="679" y="202" fontSize="20" textAnchor="middle">ŷ★</text>
      <text className="lbl" x="679" y="226" fontSize="13" textAnchor="middle">= Σ wᵢ·yᵢ</text>
    </svg>
  );
}

export function WeightedVote() {
  const root = 'fig-vote';
  return (
    <svg viewBox="0 0 760 380" style={svgStyle} className={root} role="img"
      aria-label="Prediction as a weighted vote: examples closer to the query carry more weight.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="378" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">A guess is a weighted vote of the examples</text>
      <text className="sub" x="28" y="64" fontSize="13">Examples close to the query count more, where the kernel is the measure of &ldquo;closeness&rdquo;.</text>

      <rect className="track" x="40" y="86" width="420" height="266" rx="8" />

      {/* far points */}
      <circle cx="110" cy="140" r="7" fill="#94a3b8" opacity="0.55" />
      <circle cx="430" cy="120" r="6" fill="#94a3b8" opacity="0.5" />
      <circle cx="410" cy="320" r="7" fill="#94a3b8" opacity="0.55" />
      <circle cx="90" cy="300" r="6" fill="#94a3b8" opacity="0.5" />
      {/* mid */}
      <circle cx="200" cy="180" r="11" fill={TEAL} opacity="0.75" />
      <circle cx="330" cy="250" r="11" fill={TEAL} opacity="0.75" />
      {/* near */}
      <circle cx="250" cy="230" r="17" fill={TEAL} />
      <circle cx="290" cy="190" r="16" fill={TEAL} />

      {/* query */}
      <circle cx="270" cy="210" r="9" fill="var(--accent)" />
      <circle cx="270" cy="210" r="20" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="270" cy="210" r="34" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="270" cy="210" r="50" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.18" />
      <text className="lbl" x="270" y="182" fontSize="12" fontWeight="600" textAnchor="middle">query x★</text>

      {/* legend */}
      <g transform="translate(500,110)">
        <circle cx="10" cy="6" r="15" fill={TEAL} />
        <text className="lbl" x="36" y="10" fontSize="13">nearby example</text>
        <text className="mut" x="36" y="28" fontSize="12">large weight</text>

        <circle cx="10" cy="66" r="7" fill="#94a3b8" opacity="0.55" />
        <text className="lbl" x="36" y="62" fontSize="13">far example</text>
        <text className="mut" x="36" y="80" fontSize="12">small weight</text>

        <circle cx="10" cy="126" r="9" fill="var(--accent)" />
        <text className="lbl" x="36" y="122" fontSize="13">the query</text>
        <text className="mut" x="36" y="140" fontSize="12">what we predict for</text>
      </g>

      <text className="lbl" x="500" y="300" fontSize="13" fontWeight="600">prediction</text>
      <text x="500" y="322" fontSize="15" fontWeight="700" fill={TEAL}>ŷ★ = Σ wᵢ · yᵢ</text>
      <text className="mut" x="500" y="344" fontSize="12">bigger circle → bigger wᵢ</text>
    </svg>
  );
}

export function GdVsCg() {
  const root = 'fig-gd';
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Two solvers on an ill-conditioned problem: plain gradient descent zig-zags over many steps while a second-order method reaches the solution in a few.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Steps to reach the same solution</text>

      {/* contours */}
      <g transform="translate(300,190)">
        <ellipse className="edge" cx="0" cy="0" rx="230" ry="70" strokeWidth="1.5" />
        <ellipse className="edge" cx="0" cy="0" rx="175" ry="52" strokeWidth="1.5" />
        <ellipse className="edge" cx="0" cy="0" rx="120" ry="35" strokeWidth="1.5" />
        <ellipse className="edge" cx="0" cy="0" rx="65" ry="19" strokeWidth="1.5" />
      </g>
      <circle cx="300" cy="190" r="5" fill="var(--fg)" />
      <text className="lbl" x="300" y="178" fontSize="12" textAnchor="middle" fontWeight="600">solution</text>

      <circle cx="118" cy="128" r="5" fill={RED} />
      <text x="118" y="116" fontSize="12" textAnchor="middle" fill={RED}>start</text>

      {/* gradient descent zig-zag */}
      <polyline points="118,128 175,225 205,145 232,218 252,160 268,208 280,173 289,201 296,182 300,190"
        fill="none" stroke={RED} strokeWidth="2.5" strokeLinejoin="round" />

      {/* second-order path */}
      <polyline points="118,128 250,220 300,190" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="250" cy="220" r="4" fill="var(--accent)" />

      {/* legend */}
      <g transform="translate(560,120)">
        <line x1="0" y1="0" x2="30" y2="0" stroke={RED} strokeWidth="3" />
        <text className="lbl" x="40" y="4" fontSize="13">plain gradient descent</text>
        <text className="mut" x="40" y="22" fontSize="12">many small steps, zig-zags</text>

        <line x1="0" y1="52" x2="30" y2="52" stroke="var(--accent)" strokeWidth="3" />
        <text className="lbl" x="40" y="56" fontSize="13">second-order / CG-like</text>
        <text className="mut" x="40" y="74" fontSize="12">few decisive steps</text>
      </g>
    </svg>
  );
}

export function KernelShift() {
  const root = 'fig-shift';
  const inPts = [
    [70, 70], [110, 118], [150, 150], [200, 205], [235, 232], [265, 268], [300, 298],
  ];
  const ooPts = [
    [95, 210], [140, 95], [185, 300], [230, 130], [275, 240], [300, 175], [250, 90],
  ];
  // plot maps data (0..340) to screen; origin at (60, 330), top-right at (400, 90)
  const px = (x: number) => 60 + x;
  const py = (y: number) => 330 - y;
  return (
    <svg viewBox="0 0 760 380" style={svgStyle} className={root} role="img"
      aria-label="In-distribution, the model's predictions match the kernel oracle and sit on the diagonal; out-of-distribution, they scatter off it.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="378" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">The kernel match is learned, not automatic</text>
      <text className="sub" x="28" y="64" fontSize="13">On familiar tasks the model tracks the kernel prediction; on unfamiliar ones it drifts off.</text>

      {/* axes */}
      <line className="edge" x1="60" y1="90" x2="60" y2="330" strokeWidth="1.5" />
      <line className="edge" x1="60" y1="330" x2="400" y2="330" strokeWidth="1.5" />
      <text className="mut" x="230" y="360" fontSize="12" textAnchor="middle">kernel-oracle prediction</text>
      <text className="mut" x="30" y="210" fontSize="12" textAnchor="middle" transform="rotate(-90 30 210)">model prediction</text>

      {/* perfect-agreement diagonal */}
      <line x1={px(0)} y1={py(0)} x2={px(300)} y2={py(300)} stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text className="mut" x={px(255)} y={py(300) + 4} fontSize="11">agreement</text>

      {inPts.map(([x, y], i) => (
        <circle key={`in-${i}`} cx={px(x)} cy={py(y)} r="6" fill={TEAL} />
      ))}
      {ooPts.map(([x, y], i) => (
        <circle key={`oo-${i}`} cx={px(x)} cy={py(y)} r="6" fill={RED} opacity="0.85" />
      ))}

      {/* legend */}
      <g transform="translate(470,140)">
        <circle cx="10" cy="6" r="7" fill={TEAL} />
        <text className="lbl" x="30" y="10" fontSize="13">in-distribution task</text>
        <text className="mut" x="30" y="28" fontSize="12">model ≈ kernel oracle</text>

        <circle cx="10" cy="66" r="7" fill={RED} />
        <text className="lbl" x="30" y="70" fontSize="13">out-of-distribution task</text>
        <text className="mut" x="30" y="88" fontSize="12">agreement breaks down</text>
      </g>
    </svg>
  );
}
