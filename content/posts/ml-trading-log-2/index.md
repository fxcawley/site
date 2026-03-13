---
title: "First Model and Backtest"
tags: ["ml", "trading", "xgboost", "backtesting"]
date: 2025-03-10
excerpt: An XGBoost classifier on the initial feature set, a walk-forward backtest, and several data leakage mistakes caught along the way.
thread: "ml-trading"
threadTitle: "ML Trading Strategy"
threadOrder: 2
---

This post covers the first complete model-and-backtest cycle. The results are not particularly encouraging, which is expected at this stage; the more useful output is a working evaluation framework and a catalog of mistakes made during the first pass.

## Model

The model is an XGBoost binary classifier. The target variable is whether a stock's 10-day forward return exceeds the cross-sectional median on that date. Classification was chosen over regression because the signal-to-noise ratio in individual return prediction is very low, and a relative-ranking formulation is somewhat more forgiving.

Hyperparameters for this iteration:

```python
params = {
    "max_depth": 4,
    "learning_rate": 0.05,
    "n_estimators": 300,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
}
```

The training window is expanding, starting from 2 years of history, with monthly retraining.

## Backtest procedure

Walk-forward evaluation: train on all available data up to month $t$, generate predictions for month $t+1$, advance. Each day, stocks are ranked by predicted outperformance probability, and the top decile is held long with equal weighting. Rebalancing is daily, though in practice most positions carry over; average daily turnover is around 15%.

Metrics tracked:
- Cumulative return relative to SPY
- Annualized Sharpe ratio (excess over risk-free rate)
- Maximum drawdown
- Realized transaction costs

## Results (2020-01-01 to 2024-12-31)

| Metric | Strategy | SPY |
|---|---|---|
| Annualized return | 14.2% | 12.8% |
| Sharpe | 0.71 | 0.62 |
| Max drawdown | -28.1% | -33.7% |
| Avg daily turnover | 14.8% | — |
| Return after costs | 12.9% | 12.8% |

Before transaction costs, the strategy shows a modest edge over the benchmark. After the 5 bps-per-side cost model is applied, the advantage is negligible. This is not surprising for a first iteration with generic features, but it establishes that the pipeline is functional and the evaluation is, to the extent I can verify, free of lookahead bias.

## Errors encountered

Three mistakes were caught and corrected during development:

1. **Feature leakage**: the initial feature matrix inadvertently included the current day's closing price as a predictor. This produced a Sharpe ratio of approximately 2.3, which prompted investigation.
2. **Target leakage**: the median used to define the binary target was initially computed over the full dataset rather than per-date, introducing a subtle form of lookahead.
3. **Execution timing**: returns were computed close-to-close, but the backtest assumed trades could be executed at the closing price. Switching to next-open execution reduced annualized return by roughly 1%.

## Next

The most straightforward path to improvement is the feature set. The next post will consider less standard features — order flow proxies, sector-relative momentum — and whether they produce a measurable change in out-of-sample performance.
