---
title: "Alternative Data and Prediction Markets"
tags: ["alternative-data", "prediction-markets", "nlp", "kalshi", "anomaly-detection"]
date: 2026-04-13
excerpt: SEC filing sentiment, CFTC positioning, and early experiments with Kalshi data, with attention to publication times, evaluation leakage, and trading costs.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 3
---

The [previous post](/posts/ml-trading-log-2) found no statistically significant alpha among the price-based strategies tested. [alt-strats](https://github.com/fxcawley/alt-strats) extends the search to filings, positioning reports, and macro data. A separate [Kalshi project](https://github.com/fxcawley/march-madness) compares predictions with event-contract prices.

## Alternative data pipelines

The alt-strats project implements three signal pipelines:

<AltPipelines />

**NLP on SEC filings.** The pipeline downloads 10-K and 10-Q filings from EDGAR, parses the Management Discussion & Analysis section, and computes a composite score from Loughran-McDonald sentiment, negative and uncertainty word ratios, readability (Gunning Fog index), quarter-over-quarter sentiment change, and embedding distance (via sentence-transformers) signed by the direction of sentiment change. The signal is dated to the filing's submission to the SEC. Dating it to the financial period's end would make the backtest trade on a document that had yet to be published. Stale signals decay after 120 days.

**CFTC positioning.** The Commitments of Traders reports, published weekly by the CFTC, disclose aggregate futures positioning by trader category. The signal is contrarian: when net speculator positioning in a given commodity or index future reaches an extreme (measured as a 52-week z-score), the strategy takes the opposite side. The usual Friday release describes Tuesday's positions, so the backtest makes the signal available on publication. VIX futures are excluded from the mapping to SPY; the direction of a VIX positioning signal cannot be assumed to translate directly into an equity-return signal.

**Satellite and macro.** VIIRS nighttime lights data (with a 90-day publication lag), Google Trends stress indicators, and FRED macro surprises are combined into a composite signal for country and sector rotation. The Google Trends component uses rolling 12-month fetch windows to avoid the normalization trap: Google retroactively rescales search volume relative to the peak in the requested window, so fetching a multi-year range contaminates historical values with future information.

The validation code checks rank information coefficient, monotonic quintile returns, positive walk-forward Sharpe, a cross-period Sharpe spread below 0.3, and incremental $R^2$ above the cross-sectional momentum baseline. That baseline has a Sharpe of 0.69 to 0.74 across the comparison periods. At the time of these experiments, I had not collected enough data to run the full validation on all three signals; the CFTC signal was furthest along because its data was accessible without API keys.

<ValidationGates />

## Prediction markets

Prediction markets price binary events, such as whether a team will win or Bitcoin will close above a specified price. Across a group of comparable contracts priced at $0.70, a calibrated set of prices would correspond to about 70% "yes" resolutions. Calibration errors are candidates for further testing after accounting for fees and executable prices.

The results here describe the project's [early demo-API experiment](https://github.com/fxcawley/march-madness/blob/c919d301f67a98005162148802a91077258faea3/README.md). It fetched roughly 40,000 markets and computed price, liquidity, duration, category, and spread features. The strategies tested calibration bias, favorite-longshot bias, fading sports bettors, QuickSettle pricing, and crypto mean reversion, alongside logistic regression and gradient boosting. After filtering and excluding QuickSettle, the ML comparison used 197 markets: 136 for training and 59 for testing.

The initial version appeared to show a 2.8x improvement in Brier score over market prices. Category bias had been computed using test outcomes, QuickSettle's deterministic markets distorted the market baseline, and 31 features were being fit on 277 training samples. After correcting the evaluation and reducing the feature set, market prices had a Brier score of 0.233, compared with 0.246 for logistic regression and 0.315 for gradient boosting (lower is better). Their AUCs were 0.611, 0.531, and 0.584, respectively.

<KalshiCalibration />

Selling favorites (betting against contracts priced above 85 cents) reported a 354% net ROI on 22 simulated trades, amounting to $4.71 in net profit. The reported Sharpe was 0.44. Calibration bias and fading sports bettors reported Sharpes of 0.08 and 0.11 after modeled costs. These small demo-data samples provide little evidence about returns available in live markets.

The transaction cost model separates platform fees, crossing the spread, and slippage. Its fee assumption is 7% of $\min(p,1-p)$ per contract, where $p$ is the contract price; spread and slippage estimates also depend on liquidity and trade size. In the early sample, modeled costs consumed about 52% of calibration-bias gross profit and 46% of fade-sports gross profit.

<CostEatsAlpha />

## Anomaly detection

The strat-testing repo also contains an [anomaly detection module](https://github.com/fxcawley/strat-testing/blob/main/src/analysis/anomaly.py) with rolling z-score flags, Isolation Forest on a standard feature set (1-day and 5-day returns, 10-day volatility, volume ratio, high-low range, open-to-previous-close gap), and volume spike detection. It has yet to be integrated into the strategy pipeline.

The hypothesis is that conditioning on unusual activity may isolate episodes with more predictable subsequent returns. Testing it requires measuring what follows a flag, comparing those outcomes with the baseline, and accounting for the cost of trading them. Detecting an unusual observation alone establishes none of those relationships.
