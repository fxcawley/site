---
title: "First Model and Backtest"
tags: ["ml", "trading", "xgboost", "backtesting"]
date: 2025-03-10
excerpt: XGBoost on the v0 feature set, and building a backtest that doesn't lie to you.
thread: "ml-trading"
threadTitle: "ML Trading Strategy"
threadOrder: 2
---

Got the first model running end-to-end. Posting results and the things I got wrong on the first attempt.

## Model

XGBoost classifier. Target: will the stock's 10-day forward return beat the median stock's 10-day forward return? Binary classification. I tried regression first (predict the actual return) but the signal-to-noise ratio is brutal and classification is more forgiving.

Hyperparameters are nothing special yet:

```python
params = {
    "max_depth": 4,
    "learning_rate": 0.05,
    "n_estimators": 300,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
}
```

Training window: expanding, starting from 2 years of history. Retrained monthly.

## Backtest framework

Walk-forward: train on all data up to month $t$, predict month $t+1$, advance. No peeking.

Each day, rank stocks by predicted probability of outperformance. Go long the top decile, equal-weight. Rebalance daily (in practice most positions carry over, turnover is ~15%/day).

Tracking:
- Cumulative return vs SPY
- Sharpe ratio (annualized, excess over risk-free)
- Max drawdown
- Average turnover and realized transaction costs

## Results (2020-01-01 to 2024-12-31)

| Metric | Strategy | SPY |
|---|---|---|
| Annualized return | 14.2% | 12.8% |
| Sharpe | 0.71 | 0.62 |
| Max drawdown | -28.1% | -33.7% |
| Avg daily turnover | 14.8% | — |
| Return after costs | 12.9% | 12.8% |

So: marginally positive before costs, basically flat after. The 5bps-per-side cost model eats most of the edge. Not surprised for a v0 with generic features, but it's a working baseline.

## Things I got wrong

1. **Leaky features**: my first pass accidentally included the current day's close in the feature matrix. Caught it because the Sharpe was 2.3, which should be an immediate red flag.
2. **Median target calculation**: initially computed the median across the full dataset, not per-date. Subtle lookahead.
3. **Rebalance timing**: was using close-to-close returns but assuming I could trade at the close. Switched to next-open execution which is more realistic and shaved ~1% annually.

## What's next

The feature set is the obvious lever. Next post will cover adding some less standard features (order flow proxies, sector momentum) and whether they move the needle.
