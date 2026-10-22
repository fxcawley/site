---
title: "Why Markets"
tags: ["anomaly-detection", "world-modeling", "markets"]
date: 2026-02-01
excerpt: Using public market data to test anomaly detection, with transaction costs and benchmark returns as part of the evaluation.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 1
threadOverview: >-
  Applying anomaly-detection ideas to market data.
  The posts move from defining the evaluation to repairing price-based
  backtests, then to alternative-data pipelines and early prediction-market
  experiments, with costs and benchmarks included throughout.
---

I work in anomaly detection. While specifics vary, the general shape of the problem is: build a model of what "normal" looks like, then flag deviations from that model and decide which deviations matter. The choice of what counts as normal determines which changes the detector will notice and which it will treat as noise.

<AnomalyLoop />

Financial markets offer public data on which to test this approach outside my professional work.

Price and volume history is available through Yahoo Finance, regulatory filings through EDGAR, macro indicators through FRED, and weekly Commitments of Traders reports through the CFTC. These sources keep the cost of a backtesting environment low. They suit experiments at daily or monthly horizons, where access to the fastest feed is less of a constraint.

Markets also provide a way to test whether a detected pattern is useful: construct a portfolio and measure its performance against a benchmark after transaction costs. An anomaly may be too expensive to trade, may disappear before a trade can be placed, or may owe its apparent predictive value to future information accidentally included in a feature. The backtest has to represent when the information became available and what acting on it would have cost.

<BeliefToReturns />

Other participants are trying to exploit the same patterns. A relationship found in historical data can weaken as trading changes prices, so the evaluation also has to test whether it persists across periods.

<WhyMarkets />

This thread documents a series of projects in this domain, starting with conventional price-based strategies, extending to alternative data sources, and eventually moving toward prediction markets. The long-term goal is to build a general anomaly detection framework that transfers what I have learned in my professional work to a domain where the evaluation criteria are explicit and the data is public.

Most strategies I have tested have not produced statistically significant alpha. Several early positive results disappeared after corrections to rebalancing, the stock universe, and feature timestamps; the [next post](/posts/ml-trading-log-2) describes those corrections.
