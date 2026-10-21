---
title: "Twenty Strategies, No Alpha"
tags: ["backtesting", "factor-investing", "transaction-costs", "time-series"]
date: 2026-03-10
excerpt: Testing about 20 strategy variants across 20 years of ETF and equity data, correcting the backtest, and comparing the surviving momentum and trend strategies across three periods.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 2
---

The [strat-testing](https://github.com/fxcawley/strat-testing) project is a backtesting sandbox that went through four major iterations before producing results I was willing to trust.

## Iteration 1: everything shows significant alpha

The first version had four problems:

1. The engine applied fixed target weights daily, introducing daily rebalancing even when a strategy had requested no trade.
2. The buy-and-hold baseline returned constant weights on every call and became a constant-mix strategy. A buy-and-hold benchmark must let its weights drift as prices change.
3. The analyst-ratings strategy used today's consensus ratings applied retroactively, which is a form of lookahead bias.
4. The universe was a hand-picked set of 25 mega-cap winners (AAPL, MSFT, AMZN, etc.), introducing survivorship bias.

Every strategy showed "statistically significant alpha," with p-values below 0.05. Those tests were being applied to returns produced by the flawed backtest.

<FakeAlpha />

## Iteration 2: correcting the backtest

The engine was rewritten with share-count-based position tracking (positions drift with prices between rebalances), proportional transaction costs (10 bps per trade on dollar value), and a point-in-time analyst consensus reconstruction from upgrade/downgrade events. The universe was expanded to a 100-stock random sample from the current S&P 500 list. As the [universe module](https://github.com/fxcawley/strat-testing/blob/main/src/data/universe.py) notes, a current membership list still omits historical constituents and retains survivorship bias.

With these corrections, no strategy showed significant alpha, and the buy-and-hold baseline underperformed SPY.

## Iteration 3: more strategies, same result

I implemented mean reversion (z-score oversold), breakout (Donchian channel + volume), pullback (buy dips in uptrends), swing (stochastic/MACD crossovers), and several composites and regime-routing ensembles. All underperformed SPY after costs. The runs reported cumulative transaction costs between $20K and $93K on accounts starting at $100K.

<CostByFrequency />

A separate issue surfaced here: the `generate_signals` interface returns `None` to mean "keep existing positions" and `{}` to mean "go to cash." Returning `{}` on days without a new signal made intermittently active strategies liquidate their holdings. The distinction needed to be tested across a sequence of signal and no-signal days.

## Iteration 4: factor strategies on ETFs

The next iteration used liquid ETFs and factors documented in the academic literature. The universe is 21 ETFs covering US equities (SPY, QQQ, IWM, sector ETFs), international (EFA, EEM, EWJ), fixed income (TLT, IEF, SHY, LQD), and gold (GLD). The backtest assumes transaction costs of 3 bps. Rebalancing is monthly with a 2% weight-change threshold to reduce churn.

Two strategies produced positive Sharpe ratios in all three historical periods (2005–2013, 2014–2019, and 2020 through the March 2026 run):

**Cross-sectional momentum** (Jegadeesh-Titman 12-1): rank ETFs by trailing 12-month return excluding the most recent month, go long the top 30%. This captures the well-documented momentum premium.

**Trend following** (Moskowitz time-series momentum): for each asset, go long if its trailing return is positive, then size the position inversely to realized volatility. This implementation uses a 252-trading-day lookback ending 21 trading days before the rebalance, with a 10% volatility target per position. It reduces equity exposure when the measured trend turns negative, with a delay determined by the lookback.

A 50/50 static blend of these two, run with [`run_blend.py`](https://github.com/fxcawley/strat-testing/blob/main/run_blend.py):

| Period | CAGR | Sharpe | Max DD | Total Cost | SPY Return |
|---|---|---|---|---|---|
| 2005–2013 (GFC) | 9.5% | 0.84 | -21% | $1,099 | +83% |
| 2014–2019 | 7.8% | 0.78 | -19% | $839 | +97% |
| 2020–2026 | 9.5% | 0.69 | -24% | $1,033 | +124% |

The blend underperforms SPY in both bull-market periods while allocating some capital to bonds and gold through the trend component. It outperforms over 2005–2013, when the trend rule reduces equity exposure during the financial crisis. The Sharpe spread across the three periods is 0.15 (0.69 to 0.84). Reporting the periods separately makes the strategy's dependence on the market regime visible; all three were available during development.

<RegimeEquity />

## What this means

I did not find statistically significant alpha among the variants tested. The surviving strategies implement momentum and trend factors documented in the literature, and their positive Sharpe ratios alone do not establish an informational advantage.

The blend's 0.69–0.84 Sharpe range supplies a baseline for the alternative-data experiments. Those experiments reuse the engine's share-count tracking, transaction cost model, and rebalance threshold.
