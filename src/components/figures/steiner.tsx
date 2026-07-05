/* Inline SVG figures for the Steiner Networks post. */

import { TEAL, RED, AMBER, svgStyle, figureCss } from './common';

export function NetworkRedundancy() {
  const root = 'fig-redund';
  return (
    <svg viewBox="0 0 760 360" style={svgStyle} className={root} role="img"
      aria-label="A power source feeding three sites: a hospital reached by three independent lines (one failed, two intact), a substation by two lines, and a depot by one. Critical sites keep more redundancy.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="358" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Critical sites need more redundancy than ordinary ones</text>
      <text className="sub" x="28" y="64" fontSize="13">The goal is the cheapest network that keeps every site connected, even when lines fail.</text>

      {/* hospital: 3 paths, lowest one failed */}
      <path d="M120 210 C 270 120, 460 90, 590 110" className="edge" fill="none" stroke={TEAL} strokeWidth="2.5" />
      <path d="M120 210 C 290 165, 470 130, 590 110" className="edge" fill="none" stroke={TEAL} strokeWidth="2.5" />
      <path d="M120 210 C 300 220, 470 160, 590 110" fill="none" stroke={RED} strokeWidth="2.5" strokeDasharray="7 5" opacity="0.8" />
      <g stroke={RED} strokeWidth="3">
        <line x1="352" y1="176" x2="372" y2="196" />
        <line x1="372" y1="176" x2="352" y2="196" />
      </g>
      <text x="362" y="214" fontSize="11" textAnchor="middle" style={{ fill: RED }}>line down</text>

      {/* substation: 2 paths */}
      <path d="M120 210 C 300 245, 470 220, 590 218" fill="none" stroke={TEAL} strokeWidth="2.5" />
      <path d="M120 210 C 300 285, 470 250, 590 218" fill="none" stroke={TEAL} strokeWidth="2.5" />

      {/* depot: 1 path */}
      <path d="M120 210 C 300 320, 470 320, 590 306" fill="none" stroke={TEAL} strokeWidth="2.5" />

      {/* source */}
      <circle cx="120" cy="210" r="15" fill="var(--accent)" />
      <text x="120" y="215" fontSize="12" textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>src</text>
      <text className="mut" x="120" y="248" fontSize="12" textAnchor="middle">power source</text>

      {/* destinations */}
      <circle cx="590" cy="110" r="14" fill="var(--accent)" />
      <text className="lbl" x="616" y="106" fontSize="13" fontWeight="600">hospital</text>
      <text className="mut" x="616" y="124" fontSize="11.5">needs 3 lines</text>

      <circle cx="590" cy="218" r="14" fill="var(--accent)" />
      <text className="lbl" x="616" y="214" fontSize="13" fontWeight="600">substation</text>
      <text className="mut" x="616" y="232" fontSize="11.5">needs 2 lines</text>

      <circle cx="590" cy="306" r="14" fill="var(--accent)" />
      <text className="lbl" x="616" y="302" fontSize="13" fontWeight="600">depot</text>
      <text className="mut" x="616" y="320" fontSize="11.5">needs 1 line</text>
    </svg>
  );
}

export function MstToSteiner() {
  const root = 'fig-mst';
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Left: uniform connectivity gives a minimum spanning tree, solvable exactly. Right: non-uniform requirements make the problem NP-hard.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">From spanning tree to fault-tolerant network</text>
      <text className="sub" x="28" y="64" fontSize="13">When every pair needs one path, the answer is a minimum spanning tree. Non-uniform requirements make the problem NP-hard.</text>

      {/* left: MST */}
      <text className="lbl" x="190" y="104" fontSize="13" textAnchor="middle" fontWeight="600">uniform (r = 1)</text>
      <text className="mut" x="190" y="122" fontSize="12" textAnchor="middle">minimum spanning tree  poly-time</text>
      <g stroke={TEAL} strokeWidth="2.5">
        <line x1="110" y1="180" x2="200" y2="160" />
        <line x1="200" y1="160" x2="280" y2="200" />
        <line x1="200" y1="160" x2="180" y2="260" />
        <line x1="180" y1="260" x2="270" y2="280" />
      </g>
      {[[110, 180], [200, 160], [280, 200], [180, 260], [270, 280]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="var(--accent)" />
      ))}

      {/* divider */}
      <line className="edge" x1="390" y1="96" x2="390" y2="300" strokeWidth="1.5" />

      {/* right: general Steiner */}
      <text className="lbl" x="570" y="104" fontSize="13" textAnchor="middle" fontWeight="600">non-uniform (r varies)</text>
      <text className="mut" x="570" y="122" fontSize="12" textAnchor="middle">general Steiner network  NP-hard</text>
      <g stroke={AMBER} strokeWidth="2.5">
        <line x1="490" y1="180" x2="580" y2="160" />
        <line x1="580" y1="160" x2="660" y2="200" />
        <line x1="580" y1="160" x2="560" y2="260" />
        <line x1="560" y1="260" x2="650" y2="280" />
      </g>
      {/* redundant edge for r=2 pair */}
      <path d="M490 180 C 540 120, 620 120, 660 200" fill="none" stroke={RED} strokeWidth="2.5" strokeDasharray="6 4" />
      <text x="575" y="140" fontSize="12" textAnchor="middle" style={{ fill: RED }}>r = 2</text>
      {[[490, 180], [580, 160], [660, 200], [560, 260], [650, 280]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="var(--accent)" />
      ))}
    </svg>
  );
}

export function FaultTolerance() {
  const root = 'fig-fault';
  return (
    <svg viewBox="0 0 760 300" style={svgStyle} className={root} role="img"
      aria-label="Two nodes joined by three edge-disjoint paths; cutting one still leaves two, so the pair tolerates one failure. Requiring k paths tolerates k minus one failures.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="298" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">A connectivity requirement is a failure budget</text>
      <text className="sub" x="28" y="64" fontSize="13">By Menger&rsquo;s theorem, requiring r(u,v) = k edge-disjoint paths means surviving any k − 1 edge failures.</text>

      {/* three paths */}
      <path d="M170 170 C 320 100, 520 100, 640 170" fill="none" stroke={TEAL} strokeWidth="3" />
      <path d="M170 170 L 640 170" fill="none" stroke={TEAL} strokeWidth="3" />
      <path d="M170 170 C 320 240, 520 240, 640 170" fill="none" stroke={RED} strokeWidth="3" strokeDasharray="2 0" opacity="0.5" />

      {/* cut on one path */}
      <g stroke={RED} strokeWidth="3">
        <line x1="395" y1="222" x2="415" y2="242" />
        <line x1="415" y1="222" x2="395" y2="242" />
      </g>
      <text x="405" y="270" fontSize="12" textAnchor="middle" style={{ fill: RED }}>one edge fails</text>

      <circle cx="170" cy="170" r="14" fill="var(--accent)" />
      <circle cx="640" cy="170" r="14" fill="var(--accent)" />
      <text x="170" y="175" fontSize="13" textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>u</text>
      <text x="640" y="175" fontSize="13" textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>v</text>
      <text className="mut" x="405" y="112" fontSize="12" textAnchor="middle">3 edge-disjoint paths → survives 2 failures</text>
    </svg>
  );
}

export function IntegralityGapLadder() {
  const root = 'fig-gap';
  const base = 290;
  const py = (g: number) => base - (g / 2) * 180;
  const bars = [
    { n: 'MST', g: 1.0, note: 'solved exactly', c: TEAL },
    { n: 'Steiner Tree', g: 1.39, note: '≈ ln 4, Byrka et al.', c: AMBER },
    { n: 'general Steiner', g: 2.0, note: 'Jain 2001', c: RED },
  ];
  const xs = [190, 380, 570];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Best known polynomial-time approximation ratios: 1 for MST, about 1.39 for Steiner Tree, 2 for general Steiner network.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">How hard each problem is to approximate</text>
      <text className="sub" x="28" y="64" fontSize="13">Best ratio achievable in polynomial time. A ratio of 1 means the problem is solved exactly.</text>

      {[1, 2].map((g) => (
        <g key={g}>
          <line className="edge" x1="90" y1={py(g)} x2="690" y2={py(g)} strokeWidth="1" opacity="0.5" strokeDasharray={g === 1 ? '4 4' : undefined} />
          <text className="mut" x="80" y={py(g) + 4} fontSize="11" textAnchor="end">{g}×</text>
        </g>
      ))}
      <line className="edge" x1="90" y1={base} x2="690" y2={base} strokeWidth="1.5" />

      {bars.map((b, i) => {
        const h = base - py(b.g);
        return (
          <g key={b.n}>
            <rect x={xs[i] - 45} y={py(b.g)} width="90" height={h} rx="4" fill={b.c} fillOpacity="0.85" />
            <text className="lbl" x={xs[i]} y={py(b.g) - 10} fontSize="14" textAnchor="middle" fontWeight="700">{b.g.toFixed(2)}×</text>
            <text className="lbl" x={xs[i]} y="312" fontSize="13" textAnchor="middle">{b.n}</text>
            <text className="mut" x={xs[i]} y="330" fontSize="11" textAnchor="middle">{b.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Uncrossing() {
  const root = 'fig-uncross';
  return (
    <svg viewBox="0 0 760 320" style={svgStyle} className={root} role="img"
      aria-label="Two crossing tight cuts are replaced by their intersection and union, which are nested, yielding a laminar family.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="unc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="318" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Uncrossing tight cuts into a laminar family</text>
      <text className="sub" x="28" y="64" fontSize="13">If tight cuts S and T cross, replacing them with S∩T and S∪T keeps them tight and no longer crossing.</text>

      {/* left: crossing */}
      <ellipse cx="150" cy="200" rx="90" ry="58" fill={TEAL} fillOpacity="0.18" stroke={TEAL} />
      <ellipse cx="240" cy="200" rx="90" ry="58" fill={AMBER} fillOpacity="0.18" stroke={AMBER} />
      <text className="lbl" x="110" y="204" fontSize="14" fontWeight="600">S</text>
      <text className="lbl" x="280" y="204" fontSize="14" fontWeight="600">T</text>
      <text className="mut" x="195" y="288" fontSize="12" textAnchor="middle">crossing</text>

      <line className="flow" x1="360" y1="200" x2="430" y2="200" strokeWidth="1.5" markerEnd="url(#unc-arrow)" />

      {/* right: nested (S∩T inside S∪T) */}
      <ellipse cx="590" cy="200" rx="120" ry="70" fill={AMBER} fillOpacity="0.14" stroke={AMBER} />
      <ellipse cx="590" cy="200" rx="52" ry="34" fill={TEAL} fillOpacity="0.22" stroke={TEAL} />
      <text className="lbl" x="590" y="204" fontSize="13" textAnchor="middle" fontWeight="600">S∩T</text>
      <text className="lbl" x="590" y="150" fontSize="13" textAnchor="middle" fontWeight="600">S∪T</text>
      <text className="mut" x="590" y="288" fontSize="12" textAnchor="middle">nested (laminar)</text>
    </svg>
  );
}
