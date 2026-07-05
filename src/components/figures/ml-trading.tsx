/* Inline SVG figures for the World Modeling in Markets thread. */

import { TEAL, RED, AMBER, VIOLET, SLATE, svgStyle, figureCss } from './common';

/* ---------- Post 1: Why Markets ---------- */

export function AnomalyLoop() {
  const root = 'fig-loop';
  return (
    <svg viewBox="0 0 760 320" style={svgStyle} className={root} role="img"
      aria-label="Anomaly detection loop: model what normal looks like, flag deviations, decide which matter, then refine the model.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="318" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">The hard part is modeling &ldquo;normal&rdquo;</text>
      <text className="sub" x="28" y="64" fontSize="13">Knowing what normal looks like and articulating it in a reproducible process across all cases are not the same thing. </text>

      <rect x="60" y="160" width="210" height="64" rx="10" fill={TEAL} fillOpacity="0.16" stroke={TEAL} />
      <text className="lbl" x="165" y="188" fontSize="13" textAnchor="middle" fontWeight="600">model what</text>
      <text className="lbl" x="165" y="207" fontSize="13" textAnchor="middle" fontWeight="600">&ldquo;normal&rdquo; looks like</text>

      <rect x="500" y="104" width="220" height="56" rx="10" fill="var(--surface)" stroke="var(--border)" />
      <text className="lbl" x="610" y="138" fontSize="13" textAnchor="middle">flag deviations from it</text>

      <rect x="500" y="220" width="220" height="56" rx="10" fill="var(--surface)" stroke="var(--border)" />
      <text className="lbl" x="610" y="254" fontSize="13" textAnchor="middle">decide which ones matter</text>

      <path className="flow" d="M270 178 C 380 150, 420 138, 498 134" strokeWidth="1.5" markerEnd="url(#loop-arrow)" />
      <path className="flow" d="M610 160 L 610 218" strokeWidth="1.5" markerEnd="url(#loop-arrow)" />
      <path className="flow" d="M500 250 C 380 250, 330 224, 220 226" strokeWidth="1.5" markerEnd="url(#loop-arrow)" />
      <text className="mut" x="360" y="270" fontSize="12">refine the model</text>
    </svg>
  );
}

export function BeliefToReturns() {
  const root = 'fig-funnel';
  const stages = [
    { w: 190, label: 'a real pattern in the data', leak: '' },
    { w: 156, label: 'survives out-of-sample', leak: 'overfit to the sample' },
    { w: 122, label: 'not already arbitraged away', leak: 'the edge is gone' },
    { w: 92, label: 'no lookahead in the features', leak: 'leakage from the future' },
    { w: 66, label: 'profitable after costs', leak: 'eaten by fees' },
  ];
  const cx = 260;
  return (
    <svg viewBox="0 0 760 380" style={svgStyle} className={root} role="img"
      aria-label="A funnel: a pattern must survive out-of-sample testing, arbitrage, lookahead checks, and transaction costs before it becomes a return.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="leak-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={RED} />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="378" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">You found a pattern... but is it worth anything?.</text>
      <text className="sub" x="28" y="64" fontSize="13">Each stage removes candidates, so, in theory, what reaches the bottom is risk-adjusted, tradeable edge.</text>

      {stages.map((s, i) => {
        const y = 96 + i * 52;
        const isLast = i === stages.length - 1;
        return (
          <g key={i}>
            <rect x={cx - s.w} y={y} width={s.w * 2} height="40" rx="8"
              fill={isLast ? 'var(--accent)' : TEAL} fillOpacity={isLast ? 0.9 : 0.18 + i * 0.12}
              stroke={isLast ? 'var(--accent)' : TEAL} />
            <text x={cx} y={y + 25} fontSize="12.5" textAnchor="middle"
              style={{ fill: isLast ? '#fff' : 'var(--fg)', fontWeight: isLast ? 600 : 400 }}>{s.label}</text>
            {s.leak && (
              <g>
                <line x1={cx + s.w} y1={y + 20} x2={cx + s.w + 60} y2={y + 20} stroke={RED} strokeWidth="1.5" markerEnd="url(#leak-arrow)" />
                <text x={cx + s.w + 68} y={y + 24} fontSize="12" style={{ fill: RED }}>{s.leak}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function WhyMarkets() {
  const root = 'fig-why';
  const cols = [
    { x: 130, t: 'abundant free data', a: 'Yahoo, EDGAR, FRED,', b: 'CFTC  all public', c: TEAL },
    { x: 380, t: 'built-in evaluation', a: 'backtest a portfolio,', b: 'measure vs a benchmark', c: AMBER },
    { x: 630, t: 'adversarial', a: 'others exploit the', b: 'same patterns', c: RED },
  ];
  return (
    <svg viewBox="0 0 760 300" style={svgStyle} className={root} role="img"
      aria-label="Three reasons markets are a good testbed: abundant free data, built-in evaluation, and an adversarial environment.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="298" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Why markets make a demanding testbed</text>
      <text className="sub" x="28" y="64" fontSize="13">Your mistakes cost you dearly. For an example, see the <a href="https://en.wikipedia.org/wiki/Naked_short_selling" target="_blank" rel="noopener noreferrer">naked short </a> case.</text>

      {cols.map((c) => (
        <g key={c.t}>
          <rect x={c.x - 105} y="104" width="210" height="150" rx="12" fill="var(--surface)" stroke="var(--border)" />
          <circle cx={c.x} cy="140" r="14" fill={c.c} fillOpacity="0.85" />
          <text className="lbl" x={c.x} y="184" fontSize="14" textAnchor="middle" fontWeight="600">{c.t}</text>
          <text className="mut" x={c.x} y="210" fontSize="12" textAnchor="middle">{c.a}</text>
          <text className="mut" x={c.x} y="228" fontSize="12" textAnchor="middle">{c.b}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Post 2: Twenty Strategies, No Alpha ---------- */

export function FakeAlpha() {
  const root = 'fig-fake';
  const bugs = [
    'implicit daily rebalancing',
    'biased buy-and-hold baseline',
    'lookahead in analyst ratings',
    'survivorship in the universe',
  ];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Four bugs  implicit rebalancing, a biased baseline, lookahead, and survivorship  combined to produce fake statistically significant alpha.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="fake-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Four bugs that manufactured alpha</text>
      <text className="sub" x="28" y="64" fontSize="13">In the first backtest engine every strategy showed p &lt; 0.05. This was a mistake on my part called seeing what I wanted to see.</text>

      {bugs.map((b, i) => {
        const y = 100 + i * 50;
        return (
          <g key={b}>
            <rect x="40" y={y} width="300" height="38" rx="8" fill={RED} fillOpacity="0.14" stroke={RED} />
            <text className="lbl" x="190" y={y + 24} fontSize="12.5" textAnchor="middle">{b}</text>
            <line className="flow" x1="342" y1={y + 19} x2="452" y2="170" strokeWidth="1.5" markerEnd="url(#fake-arrow)" />
          </g>
        );
      })}

      <rect x="454" y="128" width="266" height="86" rx="12" fill={RED} fillOpacity="0.2" stroke={RED} />
      <text className="lbl" x="587" y="162" fontSize="15" textAnchor="middle" fontWeight="700">&ldquo;significant alpha&rdquo;</text>
      <text className="mut" x="587" y="186" fontSize="12" textAnchor="middle">p &lt; 0.05 everywhere  an artifact</text>
    </svg>
  );
}

export function IterationLadder() {
  const root = 'fig-iter';
  const py = (a: number) => 290 - (a / 100) * 180;
  const bars = [
    { it: 'iter 1', a: 92, c: RED, note: 'bugs' },
    { it: 'iter 2', a: 6, c: SLATE, note: 'honest' },
    { it: 'iter 3', a: 4, c: SLATE, note: 'more strats' },
    { it: 'iter 4', a: 18, c: TEAL, note: 'risk premia' },
  ];
  const xs = [170, 330, 490, 650];
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Apparent alpha collapses as bugs are fixed across four iterations; only modest risk premia remain by iteration four.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Each fix removed the illusion of alpha</text>
      <text className="sub" x="28" y="64" fontSize="13">What survives my honest infrastructure is well-known risk premia, not edge.</text>

      <line className="edge" x1="100" y1="290" x2="700" y2="290" strokeWidth="1.5" />
      <text className="mut" x="92" y={py(0) + 4} fontSize="11" textAnchor="end">none</text>
      <text className="mut" x="92" y={py(100) + 4} fontSize="11" textAnchor="end">high</text>
      <text className="mut" x="60" y="180" fontSize="12" textAnchor="middle" transform="rotate(-90 60 180)">apparent alpha</text>

      {bars.map((b, i) => {
        const h = 290 - py(b.a);
        return (
          <g key={b.it}>
            <rect x={xs[i] - 40} y={py(b.a)} width="80" height={h} rx="4" fill={b.c} fillOpacity="0.85" />
            <text className="lbl" x={xs[i]} y="310" fontSize="13" textAnchor="middle">{b.it}</text>
            <text className="mut" x={xs[i]} y={py(b.a) - 8} fontSize="11" textAnchor="middle">{b.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function RegimeEquity() {
  const root = 'fig-regime';
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Schematic equity curves: the trend blend dips less than SPY during the 2008 crash but trails it through bull markets.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Steadier, not higher</text>
      <text className="sub" x="28" y="64" fontSize="13">Schematic. The blend gives up bull-market upside for shallower crash drawdowns.</text>

      <line className="edge" x1="80" y1="300" x2="700" y2="300" strokeWidth="1.5" />
      <line className="edge" x1="80" y1="100" x2="80" y2="300" strokeWidth="1.5" />

      {/* crash region */}
      <rect x="250" y="100" width="90" height="200" fill={RED} fillOpacity="0.1" />
      <text className="mut" x="295" y="118" fontSize="11" textAnchor="middle">2008</text>

      {/* SPY: rises, deep crash, recovers higher */}
      <polyline points="80,270 250,210 300,285 340,250 500,150 700,110" fill="none" stroke={SLATE} strokeWidth="2.5" />
      {/* blend: smoother, shallower dip, ends lower */}
      <polyline points="80,270 250,230 300,252 340,240 500,205 700,180" fill="none" stroke={TEAL} strokeWidth="2.5" />

      <g transform="translate(500,318)" />
      <g transform="translate(96,120)">
        <line x1="0" y1="0" x2="26" y2="0" stroke={SLATE} strokeWidth="3" />
        <text className="lbl" x="34" y="4" fontSize="13">SPY</text>
        <line x1="0" y1="24" x2="26" y2="24" stroke={TEAL} strokeWidth="3" />
        <text className="lbl" x="34" y="28" fontSize="13">momentum + trend blend</text>
      </g>
      <text className="mut" x="390" y="322" fontSize="12" textAnchor="middle">time →</text>
    </svg>
  );
}

export function CostByFrequency() {
  const root = 'fig-cost';
  // log scale for annual cost on a $100k account
  const pxY = (v: number) => 300 - (Math.log10(v) - 2) * 70; // 100 -> 300, 100000 -> 90
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Annual trading cost on a 100k account: 20 to 93 thousand dollars trading single stocks weekly, versus about 1 thousand trading ETFs monthly.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Trading frequency dominates cost</text>
      <text className="sub" x="28" y="64" fontSize="13">Annual cost on a $100k account (log scale). Weekly single-stock trading is untenable.</text>

      <line className="edge" x1="120" y1="300" x2="680" y2="300" strokeWidth="1.5" />
      {[100, 1000, 10000, 100000].map((v) => (
        <g key={v}>
          <line className="edge" x1="120" y1={pxY(v)} x2="680" y2={pxY(v)} strokeWidth="1" opacity="0.5" />
          <text className="mut" x="112" y={pxY(v) + 4} fontSize="11" textAnchor="end">${v.toLocaleString()}</text>
        </g>
      ))}

      {/* weekly stocks: range 20k-93k */}
      <rect x="230" y={pxY(93000)} width="120" height={300 - pxY(93000)} rx="6" fill={RED} fillOpacity="0.3" stroke={RED} />
      <text className="lbl" x="290" y={pxY(93000) - 26} fontSize="13" textAnchor="middle" fontWeight="700">$20K–$93K</text>
      <text className="lbl" x="290" y="322" fontSize="12.5" textAnchor="middle">weekly, single stocks</text>

      {/* monthly ETFs ~1k */}
      <rect x="470" y={pxY(1000)} width="120" height={300 - pxY(1000)} rx="6" fill={TEAL} fillOpacity="0.85" />
      <text className="lbl" x="530" y={pxY(1000) - 10} fontSize="13" textAnchor="middle" fontWeight="700">~$1K</text>
      <text className="lbl" x="530" y="322" fontSize="12.5" textAnchor="middle">monthly, ETFs</text>
    </svg>
  );
}

/* ---------- Post 3: Alternative Data and Prediction Markets ---------- */

export function AltPipelines() {
  const root = 'fig-alt';
  const srcs = [
    { t: 'SEC filing NLP', s: 'sentiment, readability', c: TEAL },
    { t: 'CFTC positioning', s: 'contrarian z-scores', c: AMBER },
    { t: 'satellite + macro', s: 'lights, trends, FRED', c: VIOLET },
  ];
  return (
    <svg viewBox="0 0 760 320" style={svgStyle} className={root} role="img"
      aria-label="Three alternative-data pipelines feed into a five-gate validation stage before a signal is considered tradeable.">
      <style>{figureCss(root)}</style>
      <defs>
        <marker id="alt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      <rect className="panel" x="1" y="1" width="758" height="318" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Three alt-data pipelines, one validation bar</text>
      <text className="sub" x="28" y="64" fontSize="13">Each looks for information price data cannot provide; each must clear the same gates.</text>

      {srcs.map((s, i) => {
        const y = 100 + i * 64;
        return (
          <g key={s.t}>
            <rect x="40" y={y} width="230" height="50" rx="10" fill={s.c} fillOpacity="0.16" stroke={s.c} />
            <text className="lbl" x="155" y={y + 22} fontSize="13" textAnchor="middle" fontWeight="600">{s.t}</text>
            <text className="mut" x="155" y={y + 40} fontSize="11.5" textAnchor="middle">{s.s}</text>
            <line className="flow" x1="272" y1={y + 25} x2="378" y2="164" strokeWidth="1.5" markerEnd="url(#alt-arrow)" />
          </g>
        );
      })}

      <rect x="380" y="128" width="150" height="72" rx="12" fill="var(--surface)" stroke="var(--border)" />
      <text className="lbl" x="455" y="160" fontSize="13" textAnchor="middle" fontWeight="600">5-gate</text>
      <text className="lbl" x="455" y="180" fontSize="13" textAnchor="middle" fontWeight="600">validation</text>
      <line className="flow" x1="530" y1="164" x2="600" y2="164" strokeWidth="1.5" markerEnd="url(#alt-arrow)" />
      <rect x="602" y="138" width="120" height="52" rx="10" fill={TEAL} fillOpacity="0.85" />
      <text x="662" y="169" fontSize="13" textAnchor="middle" style={{ fill: '#fff', fontWeight: 600 }}>tradeable</text>
    </svg>
  );
}

export function ValidationGates() {
  const root = 'fig-gates';
  const gates = [
    'rank information coefficient',
    'monotone quintile returns',
    'positive walk-forward Sharpe',
    'cross-period robust (spread < 0.3)',
    'beats the momentum baseline',
  ];
  const cx = 300;
  return (
    <svg viewBox="0 0 760 340" style={svgStyle} className={root} role="img"
      aria-label="Five validation gates a signal must pass, narrowing from many candidates to few.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="338" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Five gates before a signal is tradeable</text>
      <text className="sub" x="28" y="64" fontSize="13">A candidate must clear every gate; most do not survive the first two.</text>

      {gates.map((g, i) => {
        const w = 200 - i * 26;
        const y = 96 + i * 46;
        return (
          <g key={g}>
            <rect x={cx - w} y={y} width={w * 2} height="36" rx="8" fill={TEAL} fillOpacity={0.16 + i * 0.14} stroke={TEAL} />
            <text className="lbl" x={cx} y={y + 23} fontSize="12" textAnchor="middle">{g}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function KalshiCalibration() {
  const root = 'fig-kalshi';
  const px = (p: number) => 90 + p * 300;
  const py = (f: number) => 320 - f * 240;
  const market = [[0.2, 0.22], [0.35, 0.33], [0.5, 0.52], [0.65, 0.62], [0.8, 0.83], [0.9, 0.88]];
  const ml = [[0.2, 0.45], [0.35, 0.28], [0.5, 0.66], [0.65, 0.4], [0.8, 0.55], [0.9, 0.6]];
  return (
    <svg viewBox="0 0 760 380" style={svgStyle} className={root} role="img"
      aria-label="Calibration plot: market prices sit close to the diagonal while ML predictions scatter off it; market AUC 0.611 versus best ML 0.531.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="378" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">The ML models don&rsquo;t beat the market price</text>
      <text className="sub" x="28" y="64" fontSize="13">A well-calibrated price lies on the diagonal: a 70-cent contract resolves yes about 70% of the time.</text>

      <line className="edge" x1="90" y1="320" x2="90" y2="80" strokeWidth="1.5" />
      <line className="edge" x1="90" y1="320" x2="390" y2="320" strokeWidth="1.5" />
      <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text className="mut" x="230" y="352" fontSize="12" textAnchor="middle">predicted probability (price)</text>
      <text className="mut" x="40" y="200" fontSize="12" textAnchor="middle" transform="rotate(-90 40 200)">realized frequency</text>

      {market.map(([p, f], i) => <circle key={`m${i}`} cx={px(p)} cy={py(f)} r="6" fill={TEAL} />)}
      {ml.map(([p, f], i) => <circle key={`l${i}`} cx={px(p)} cy={py(f)} r="6" fill={RED} opacity="0.85" />)}

      <g transform="translate(470,120)">
        <circle cx="10" cy="6" r="6" fill={TEAL} />
        <text className="lbl" x="28" y="10" fontSize="13">market price</text>
        <text className="mut" x="28" y="28" fontSize="12">AUC 0.611</text>
        <circle cx="10" cy="66" r="6" fill={RED} />
        <text className="lbl" x="28" y="70" fontSize="13">best ML model</text>
        <text className="mut" x="28" y="88" fontSize="12">AUC 0.531</text>
      </g>
    </svg>
  );
}

export function CostEatsAlpha() {
  const root = 'fig-eat';
  const x0 = 100;
  const w = 560;
  const feePct = 0.65;
  return (
    <svg viewBox="0 0 760 260" style={svgStyle} className={root} role="img"
      aria-label="Fees consume 50 to 80 percent of gross alpha, leaving a small net remainder.">
      <style>{figureCss(root)}</style>
      <rect className="panel" x="1" y="1" width="758" height="258" rx="14" />
      <text className="ttl" x="28" y="40" fontSize="18">Fees consume most of the gross alpha</text>
      <text className="sub" x="28" y="64" fontSize="13">Under realistic Kalshi costs, 50–80% of gross alpha is gone before it reaches the account.</text>

      <rect x={x0} y="110" width={w} height="54" rx="8" fill={RED} fillOpacity="0.85" />
      <rect x={x0 + w * feePct} y="110" width={w * (1 - feePct)} height="54" rx="8" fill={TEAL} fillOpacity="0.9" />
      <text x={x0 + (w * feePct) / 2} y="143" fontSize="14" textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>fees (50–80%)</text>
      <text x={x0 + w * feePct + (w * (1 - feePct)) / 2} y="143" fontSize="13" textAnchor="middle" style={{ fill: '#fff', fontWeight: 600 }}>net</text>

      <line className="edge" x1={x0} y1="180" x2={x0 + w} y2="180" strokeWidth="1.5" />
      <text className="mut" x={x0} y="200" fontSize="12">gross alpha</text>
      <text className="mut" x={x0 + w} y="200" fontSize="12" textAnchor="end">100%</text>
    </svg>
  );
}
