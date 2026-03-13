---
title: "Scope and Setup"
tags: ["ml", "trading", "time-series"]
date: 2025-03-01
excerpt: Defining the project scope, data sources, and evaluation criteria for an ML-based equity trading strategy.
thread: "ml-trading"
threadTitle: "ML Trading Strategy"
threadOrder: 1
---

The goal of this project is to determine whether a straightforward ML pipeline, trained on publicly available features, can outperform a passive equity benchmark after accounting for transaction costs. The setting is deliberately conventional — daily-frequency data on large-cap US equities — so that any signal (or lack thereof) is not attributable to exotic market structure or thin liquidity.

This thread will serve as a running log. Each post corresponds to a stage of the project.

## Constraints

1. **Universe**: S&P 500 constituents, using point-in-time membership lists to avoid survivorship bias.
2. **Horizon**: daily rebalancing, with a target holding period of 5–20 days.
3. **Benchmark**: SPY buy-and-hold over the same evaluation window.
4. **Cost model**: 5 basis points per side. No market impact modeling; position sizes are assumed small enough to justify this.
5. **No lookahead**: all features are computed from strictly past data. The train/validation/test split is temporal.

## Data

The pipeline draws from three sources:

- **Price and volume**: adjusted closes from Yahoo Finance via `yfinance`.
- **Fundamentals**: quarterly EPS, book value, and related items from SEC EDGAR bulk downloads.
- **Macro indicators**: Fed funds rate, VIX, and the 10y–2y yield curve slope from FRED.

These are stored in a local DuckDB instance, one table per source, joined on `(ticker, date)` at query time.

## Initial feature set

The first iteration uses a deliberately minimal feature set:

- Returns over 1, 5, 20, and 60 trading days
- 20-day rolling standard deviation of returns
- 20-day average volume, and the ratio of current volume to that average
- RSI(14)
- A binary indicator for whether the 50-day moving average exceeds the 200-day
- Most recent quarterly earnings surprise (actual minus consensus)

This gives roughly 12 features per ticker per day. The intent is to establish a working end-to-end pipeline and a credible evaluation framework before introducing more complex features.

## Next

The following post covers the choice of model and the backtesting procedure.
