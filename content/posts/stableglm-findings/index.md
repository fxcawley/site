---
title: "Benchmarks, Tightness, and What the Data Says"
tags: ["interpretability", "rashomon-sets", "generalized-linear-models", "benchmarks", "predictive-multiplicity"]
date: 2026-03-15
excerpt: Running StableGLM on real datasets. The toolkit works, the bounds are useful in low dimension, and German Credit has 85% ambiguity at 3% loss tolerance. No feature is indispensable.
thread: "stableglm"
threadTitle: "StableGLM"
threadOrder: 2
---

The [initial post](/posts/stableglm) described the toolkit's design: ellipsoidal approximation, hit-and-run sampling, and a collection of interpretability metrics computed over the Rashomon set. This post covers what happened when the toolkit was applied to real data, and the results are more informative than I expected.

## Benchmark datasets

The evaluation uses three standard classification datasets of increasing size and dimensionality: Wisconsin Breast Cancer ($n = 569$, $d = 30$), German Credit ($n = 1{,}000$, $d = 61$), and Adult Census ($n = 30{,}162$, $d = 104$). All models are $\ell_2$-regularized logistic regression fitted by the toolkit's own solver, cross-checked against scikit-learn (accuracy within 2.2% on all datasets). The tolerance is set at $\varepsilon = 0.03 \cdot L(\hat\theta)$, which corresponds to a 3% relative increase in loss over the optimum.

The headline numbers at 3% tolerance:

| Dataset | Ambiguity | Discrepancy bound | Empirical discrepancy |
|---|---|---|---|
| Breast Cancer ($d = 30$) | 18.4% | 18.4% | 4.6% |
| German Credit ($d = 61$) | 85.4% | 85.4% | 2.6% |
| Adult Census ($d = 104$) | 63.8% | 63.8% | 3.6% |

Ambiguity here is the fraction of data points whose predicted label could change across the Rashomon set. German Credit is striking: at a 3% loss tolerance, 85% of data points receive a label that depends on which near-optimal model the solver happened to find. The empirical discrepancy (computed from sampled model pairs) is much lower because finite sampling rarely finds the extremal models, but the analytic bound confirms that those extremal models exist within the set.

## Ellipsoid tightness

The ellipsoidal approximation is central to the toolkit's speed. It replaces the true convex sublevel set $\mathcal{R}_\varepsilon$ with a quadratic approximation $\mathcal{E}_\varepsilon$ defined by the Hessian at the optimum, which makes all linear functional extrema available in closed form. The question is how conservative this approximation is.

The tightness ratio (certificate interval width divided by empirical interval width from hit-and-run sampling) varies with dimensionality in a consistent pattern:

- **Breast Cancer ($d = 30$):** ratio 2.8--3.7$\times$. The certificates are reasonably tight. If the ellipsoid says a coefficient could change sign, it almost certainly can.
- **German Credit ($d = 61$):** ratio 4.4--6.2$\times$. The certificates are valid upper bounds but overestimate the true range by a moderate factor. Still useful for screening.
- **Adult Census ($d = 104$):** ratio 8.2--12.3$\times$. The certificates are conservative. In this regime, the ellipsoid is a loose outer approximation, and supplementing with hit-and-run sampling is necessary for conclusions that depend on tight bounds.

This is not surprising. The ellipsoidal approximation becomes less accurate as the loss surface becomes less quadratic further from the optimum, and higher-dimensional sets have more room for the true sublevel set to deviate from the ellipsoidal shape. The practical implication is that for $d \leq 30$ or so, the fast closed-form certificates are sufficient; for $d > 100$, sampling is needed; and the intermediate range requires judgment.

## Variable importance stability

The Variable Importance Cloud (VIC) analysis on the Breast Cancer tutorial case study produces a finding that I consider the most important practical result so far: every single feature has $\text{MCR}^- < 0$. Model Class Reliance measures the range of permutation-based importance scores across the Rashomon set. An $\text{MCR}^-$ below zero means that there exists a near-optimal model under which that feature's contribution to accuracy is negative; it is not merely unimportant, but actively harmful according to at least one model in the set.

No feature is indispensable. Every feature importance ranking produced by a single fitted model is, strictly speaking, an artifact of the particular optimum that was found. This does not mean that all features are useless; the $\text{MCR}^+$ values (the maximum importance across the set) are positive for most features. It means that the sign and magnitude of a feature's importance depend on which near-optimal model is being queried.

The comparison against bootstrap confidence intervals is also informative. Bootstrap CIs are 4--11$\times$ narrower than VIC intervals. This is expected: bootstrap resampling explores variation due to data sampling noise, while VIC explores variation due to model selection ambiguity. These are different sources of uncertainty, and the VIC intervals being wider indicates that model selection ambiguity dominates data sampling noise for these problems. The Bayesian (Laplace approximation) intervals are wider still, reflecting the additional epistemic uncertainty captured by the prior.

## Epsilon sensitivity

The choice of $\varepsilon$ determines how much of the parameter space is explored. On the Breast Cancer dataset, ambiguity ranges from 8.8% at $\varepsilon = 0.5\%$ to 60.8% at $\varepsilon = 10\%$. The relationship is monotone but not linear; there is a phase-transition region (roughly 1--5% for this dataset) in which ambiguity increases rapidly. Below this range, the Rashomon set is small enough that most predictions are stable. Above it, the set admits models that are meaningfully different in their predictions.

A diagnostic sweep on German Credit with varying regularization strength illustrates the interaction between $\varepsilon$ and the model class. At $C = 0.1$ (strong regularization), the null model is inside the Rashomon set and ambiguity is 100% (a degenerate case: the set includes models that predict uniformly). At $C = 1.0$, the null model is excluded and ambiguity is 85.4%, reflecting genuine predictive multiplicity in the data. At $C = 5.0$, ambiguity drops slightly to 80.2%. The fact that it remains above 80% across a wide range of regularization strengths suggests that the multiplicity in German Credit is a property of the data and the model class, not an artifact of a particular regularization choice.

## Scaling

The toolkit handles moderate-scale data without difficulty. On Adult Census ($n = 30{,}162$, $d = 104$), fitting takes 0.25 seconds, ellipsoid sampling takes 0.05 seconds, and 500 hit-and-run steps take 6.8 seconds. The Hessian and its Cholesky factorization are cached after the first computation, so repeated queries (sampling, certificates, VIC) amortize the upfront cost. For problems at this scale, the toolkit is fast enough for interactive exploration.

## What remains

The core pipeline is functional and validated. MCR was cross-checked against an independent implementation of Fisher et al. (2019) with zero discrepancy. The areas that remain open are less about correctness than about completeness: Jupyter notebook tutorials, a PyPI release, Sphinx API documentation, fairness-oriented experiments (Shapley-VIC with protected attributes), and the red-team experiments (collinearity sweeps, proxy variable analysis) that would stress-test the toolkit's behavior in adversarial settings. There is also a draft of an MLOSS-style paper that has not been finalized.
