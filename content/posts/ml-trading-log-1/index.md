---
title: "Why Markets"
tags: ["anomaly-detection", "world-modeling", "markets"]
date: 2025-03-01
excerpt: Using financial markets as a testbed for world modeling and anomaly detection, and why this domain is worth the trouble.
thread: "ml-trading"
threadTitle: "World Modeling in Markets"
threadOrder: 1
---

I work in anomaly detection. The specifics of what I do at my day job are not something I can discuss here, but the general shape of the problem is: build a model of what "normal" looks like, then flag deviations from that model and decide which deviations matter. The interesting part is rarely the detection itself; it is the modeling of normal, which requires understanding the system well enough that genuine anomalies stand out from noise.

Financial markets are a useful setting in which to generalize this kind of thinking. Not the only setting, and probably not the best, but one with several properties that make it attractive as a personal research domain.

First, the data is abundant and free. Price and volume history for thousands of instruments going back decades is available through Yahoo Finance. Regulatory filings are on EDGAR. Macro indicators are on FRED. Commitments of Traders reports from the CFTC are published weekly. The infrastructure cost for a backtesting environment is essentially zero.

Second, markets provide a built-in evaluation criterion. If a model claims to have identified something real about the world, that claim can be tested by constructing a portfolio and measuring its performance against a benchmark. The feedback loop between belief and outcome is unusually tight. There are many layers of abstraction between "I have identified a real pattern" and "this pattern generates risk-adjusted returns after transaction costs," and those layers are themselves instructive. A model that detects a genuine anomaly in price data may still be worthless if the anomaly is too expensive to trade, or if it has already been arbitraged away, or if the detection depends on lookahead bias introduced during feature construction. Each failure mode teaches something about the relationship between a model and the system it claims to describe.

Third, financial markets are competitive and adversarial in a way that most detection problems are not. Other participants are actively trying to exploit the same patterns. This makes the domain a hard test for any modeling approach: signals that survive transaction costs and adversarial pressure are probably capturing something real about the underlying system, while signals that don't are probably capturing noise or artifacts.

This thread documents a series of projects in this domain, starting with conventional price-based strategies, extending to alternative data sources, and eventually moving toward prediction markets. The long-term goal is to build a general anomaly detection framework that transfers what I have learned in my professional work to a domain where the evaluation criteria are explicit and the data is public.

The results so far are largely negative, in the sense that most strategies I have tested do not produce statistically significant alpha. I consider this informative rather than discouraging. The negative results have taught me more about proper backtesting methodology, survivorship bias, transaction cost modeling, and out-of-sample validation than the positive results have.
