---
title: "Twenty Strategies, No Alpha"
tags: ["backtesting", "factor-investing", "transaction-costs", "time-series"]
date: 2025-03-10
excerpt: Testing ~20 strategy variants across 20 years of ETF and equity data. Four iterations of bug-fixing. The finding is that there are robust risk premia but no alpha.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 2
---

The [strat-testing](https://github.com/fxcawley/strat-testing) project is a backtesting sandbox that went through four major iterations before producing results I was willing to trust. The trajectory is probably more instructive than the final numbers.

## Iteration 1: everything shows significant alpha

The first version had at least four bugs, none of which were obvious from the code alone:

1. The engine applied fixed target weights daily, which amounted to implicit daily rebalancing. Any mean-reverting strategy looked profitable because the engine was constantly buying low and selling high on its behalf.
2. The buy-and-hold baseline returned constant weights on every call, making it a constant-mix strategy rather than a true buy-and-hold. This biased all alpha estimates upward.
3. The analyst-ratings strategy used today's consensus ratings applied retroactively, which is a form of lookahead bias.
4. The universe was a hand-picked set of 25 mega-cap winners (AAPL, MSFT, AMZN, etc.), introducing survivorship bias.

Every strategy showed "statistically significant alpha" under this setup. The p-values were all below 0.05. This was fake.

## Iteration 2: honest infrastructure

The engine was rewritten with share-count-based position tracking (positions drift with prices between rebalances), proportional transaction costs (10 bps per trade on dollar value), and a point-in-time analyst consensus reconstruction from upgrade/downgrade events. The universe was expanded to a 100-stock random sample from the S&P 500.

With these corrections, no strategy showed significant alpha, and the buy-and-hold baseline underperformed SPY.

## Iteration 3: more strategies, same result

I implemented mean reversion (z-score oversold), breakout (Donchian channel + volume), pullback (buy dips in uptrends), swing (stochastic/MACD crossovers), and several composites and regime-routing ensembles. All underperformed SPY after costs. Transaction costs at weekly frequency on individual stocks were between $20K and $93K annually on a $100K account, which is obviously untenable.

A separate issue surfaced here: the `generate_signals` interface returns `None` to mean "keep existing positions" and `{}` to mean "go to cash." Strategies that were only intermittently active would whipsaw between fully invested and 100% cash, destroying performance. This is the kind of API semantics problem that doesn't show up in unit tests.

## Iteration 4: factor strategies on ETFs

The shift that produced the first credible results was moving from individual stocks to liquid ETFs and from ad hoc signals to well-documented academic factors. The universe is 21 ETFs covering US equities (SPY, QQQ, IWM, sector ETFs), international (EFA, EEM, EWJ), fixed income (TLT, IEF, SHY, LQD), and gold (GLD). Transaction costs are 3 bps, which is realistic for ETFs. Rebalancing is monthly with a 2% weight-change threshold to reduce churn.

Two strategies survive three-period out-of-sample validation (2005–2013, 2014–2019, 2020–2026):

**Cross-sectional momentum** (Jegadeesh-Titman 12-1): rank ETFs by trailing 12-month return excluding the most recent month, go long the top 30%. This captures the well-documented momentum premium.

**Trend following** (Moskowitz time-series momentum): for each asset, go long if the trailing 12-month return is positive, weighted inversely by realized volatility with a 10% volatility target. This captures the trend premium and provides natural crisis protection by exiting equities during drawdowns.

A 50/50 static blend of these two:

| Period | CAGR | Sharpe | Max DD | Annual Cost | SPY Return |
|---|---|---|---|---|---|
| 2005–2013 (GFC) | 9.5% | 0.84 | -21% | $1,099 | +83% |
| 2014–2019 | 7.8% | 0.78 | -19% | $839 | +97% |
| 2020–2026 | 9.5% | 0.69 | -24% | $1,033 | +124% |

The blend underperforms SPY in both bull-market periods because it allocates to bonds and gold via the trend component. It outperforms during the 2008 crash because trend following exits equities before the worst of the drawdown. The Sharpe spread across the three periods is 0.15 (0.69 to 0.84), which I consider acceptably tight for a strategy that has not been optimized to any particular period.

## What this means

The finding is that there are no alpha-generating price signals in this universe and at this frequency that survive honest out-of-sample testing. The surviving strategies capture well-known risk premia (momentum, trend) that have been documented in the academic literature for decades. The Sharpe ratios of 0.60–0.84 are consistent with diversified factor exposure, not with genuine edge.

This is a useful null result for the broader project. It establishes a baseline (XS Momentum + Trend Following at 0.69–0.84 Sharpe) against which any future signal must be evaluated, and it provides a backtesting engine with share-count tracking, realistic cost modeling, and a rebalance-threshold filter that I trust enough to use for subsequent work.
