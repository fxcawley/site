---
title: "Alternative Data and Prediction Markets"
tags: ["alternative-data", "prediction-markets", "nlp", "kalshi", "anomaly-detection"]
date: 2025-03-13
excerpt: Pushing beyond price data with SEC filing NLP, CFTC positioning, and Kalshi prediction market edge detection. Also, the beginning of an anomaly detection scaffolding.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 3
---

The [previous post](/posts/ml-trading-log-2) established that price-based strategies on liquid ETFs produce diversified risk premia but no alpha. The natural next step is to look for information that is not already reflected in prices. This post covers two projects that pursue that direction: [alt-strats](https://github.com/fxcawley/alt-strats), which builds alternative-data signal pipelines for equities and ETFs, and a [Kalshi prediction market](https://github.com/fxcawley/march-madness) project that tests edge detection on event contracts.

## Alternative data pipelines

The alt-strats project implements three signal pipelines, each targeting a different source of information that public price data cannot provide.

**NLP on SEC filings.** The pipeline downloads 10-K and 10-Q filings from EDGAR, parses out the Management Discussion & Analysis section, and computes a composite score from seven features: Loughran-McDonald sentiment, negative and uncertainty word ratios, readability (Gunning Fog index), quarter-over-quarter sentiment change, and embedding distance (via sentence-transformers) signed by the direction of sentiment change. The key design constraint is point-in-time correctness: the signal uses the filing date (the date the document was submitted to the SEC), not the period-end date, and stale signals decay after 120 days.

**CFTC order flow.** The Commitments of Traders reports, published weekly by the CFTC, disclose aggregate futures positioning by trader category. The signal is contrarian: when net speculator positioning in a given commodity or index future reaches an extreme (measured as a 52-week z-score), the strategy takes the opposite side. The COT report is published on Friday but reflects positioning as of the prior Tuesday, so the signal uses the publication date, not the report date. VIX futures are deliberately not mapped to SPY because the relationship between VIX positioning and equity returns is more ambiguous than it appears.

**Satellite and macro.** VIIRS nighttime lights data (with a 90-day publication lag), Google Trends stress indicators, and FRED macro surprises are combined into a composite signal for country and sector rotation. The Google Trends component uses rolling 12-month fetch windows to avoid the normalization trap: Google retroactively rescales search volume relative to the peak in the requested window, so fetching a multi-year range contaminates historical values with future information.

Each signal must pass a five-gate validation framework before it is considered tradeable: minimum rank information coefficient, monotonic quintile returns, positive walk-forward Sharpe, cross-period robustness (Sharpe spread below 0.3), and incremental R-squared above the XS Momentum baseline. The baseline to beat is a Sharpe of 0.69 to 0.74. I have not yet collected enough data to run the full validation on all three signals; the CFTC flow signal is the furthest along because the data is freely available without API keys or network constraints.

## Prediction markets

The Kalshi project is a separate but related experiment. Prediction markets price binary events (will Team X win? will Bitcoin close above $Y?), which makes them a clean setting for calibration analysis: a contract priced at $0.70 should resolve "yes" about 70% of the time. When it doesn't, there may be a tradeable mispricing.

The project fetches roughly 40,000 markets from the Kalshi demo API, computes features (price, liquidity, duration, sport/category indicators, bid-ask spread), and tests six strategies: calibration bias exploitation, favorite-longshot bias, fade-sports-bettors, QuickSettle arbitrage, crypto mean reversion, and two ML models (logistic regression and gradient boosting).

The headline result: **the ML models do not beat market prices.** The initial version appeared to show a 2.8x improvement in Brier score over the market, but this was due to three bugs: target leakage in category bias computation (computed on the full dataset including test data), QuickSettle contamination (deterministic markets with inverted price-outcome relationships that destroyed the market AUC baseline), and overfitting (31 features on 277 training samples). After correction, the market's AUC is 0.611 and the best ML model achieves 0.531.

The rule-based strategies fare slightly better. Selling favorites (betting against contracts priced above 85 cents) shows a 354% net ROI and 0.44 Sharpe, but on only 22 trades. Calibration bias and fading sports bettors show Sharpe ratios of 0.08 to 0.11 after realistic transaction costs (Kalshi taker fees of ~7% of risk price plus estimated bid-ask crossing), which is not distinguishable from noise at this sample size.

The most useful output of the project is the transaction cost model, which decomposes all-in trading costs into platform fees (variable by price level, capped at 7 cents), spread crossing (estimated by price level and liquidity), and slippage (square-root market impact). Under realistic Kalshi costs, 50–80% of gross alpha is consumed by fees for most strategies.

## Anomaly detection scaffolding

The strat-testing repo contains the beginning of an anomaly detection module (`src/analysis/anomaly.py`) with three components: rolling z-score flags, Isolation Forest on a standard feature set (1-day and 5-day returns, 10-day volatility, volume ratio, high-low range, open-to-previous-close gap), and volume spike detection. This is scaffolding, not yet integrated into the strategy pipeline, but it represents the direction I intend to take the project: treating unusual market behavior as the primary signal rather than trend or momentum, and applying the same detection-and-characterization approach that I use in my professional work.

The hypothesis, which is preliminary and untested, is that anomaly detection may be better suited to markets than traditional alpha models because it does not require a stable predictive relationship between features and returns. It only requires that the model of "normal" be accurate enough that genuine deviations are detectable, and that some fraction of those deviations precede significant price moves. Whether this is true, and whether it can be made to work after transaction costs, is the subject of future posts.
