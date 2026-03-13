---
title: "Scope and Setup"
tags: ["ml", "trading", "time-series"]
date: 2025-03-01
excerpt: Defining the project, the data pipeline, and what counts as a win.
thread: "ml-trading"
threadTitle: "ML Trading Strategy"
threadOrder: 1
---

I've been wanting to test whether a simple ML pipeline can generate consistent alpha on daily equity data. Not HFT, not crypto, nothing exotic. Just: can a model trained on public features (price, volume, some fundamentals) beat a buy-and-hold baseline after transaction costs?

This thread will track the project as it evolves. Each post is a checkpoint.

## Ground rules

1. **Universe**: S&P 500 constituents. Survivorship bias handled by using point-in-time membership lists.
2. **Horizon**: daily rebalance, target holding period 5-20 days.
3. **Benchmark**: SPY buy-and-hold over the same period.
4. **Cost model**: 5 bps per side, no market impact (position sizes are small).
5. **No lookahead**: all features use strictly past data. Train/val/test split is temporal, not random.

## Data pipeline

Pulling from a mix of free sources:

- **Price/volume**: Yahoo Finance via `yfinance`. Adjusted closes.
- **Fundamentals**: quarterly EPS, book value, etc. from SEC EDGAR bulk downloads.
- **Macro**: Fed funds rate, VIX, yield curve slope from FRED.

Everything lands in a local DuckDB instance. One table per source, joined on `(ticker, date)` at query time. Nothing fancy, but it's fast enough for backtesting and the schema is easy to extend.

## Feature set (v0)

Starting deliberately simple:

- Returns: 1d, 5d, 20d, 60d
- Volatility: 20d rolling std of returns
- Volume: 20d average, plus ratio of today's volume to that average
- RSI(14)
- 50d / 200d moving average cross (binary)
- Earnings surprise: actual vs consensus for last quarter

That's ~12 features per ticker per day. The point isn't to be clever yet; it's to get the pipeline end-to-end and make sure the evaluation framework works before adding complexity.

## What's next

The next post will cover the model (starting with gradient-boosted trees) and the backtesting framework.
