---
title: "StableGLM: Rashomon Sets for Generalized Linear Models"
tags:
  - "interpretability"
  - "rashomon-sets"
  - "generalized-linear-models"
  - "stability"
date: 2026-01-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A stability audit for fitted scikit-learn linear and logistic regression models. Computes coefficient ranges and label-flip tests over a loss-tolerance set, with explicit comparisons against sampling and quadratic approximations."
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/fxcawley/StableGLM"
  - name: "package"
    url: "https://pypi.org/project/rashomon-py/"
---

StableGLM, published as `rashomon-py`, asks how much a fitted model's coefficients and predictions can change while its loss remains close to optimal. Correlated features can admit substantially different coefficients with similar predictions, even when regularization gives the fitting problem a unique optimum.

The public entry point is `rashomon.audit(model, X, y)`. It accepts a fitted scikit-learn linear or logistic regression model, including supported preprocessing pipelines, and reconstructs its objective before examining the alternatives.

## Setup

For a regularized loss $L(\theta)$ and fitted optimum $\hat\theta$, the $\varepsilon$-Rashomon set is

$$\mathcal{R}_\varepsilon = \{\theta : L(\theta) \leq L(\hat\theta) + \varepsilon\}.$$

This is a convex sublevel set. Near the optimum, the Hessian $H = \nabla^2 L(\hat\theta)$ provides a local ellipsoidal approximation:

$$\mathcal{E}_\varepsilon = \{\hat\theta + \Delta : \Delta^\top H \Delta \leq 2\varepsilon\}.$$

For positive-definite $H$, the range of $s^\top\theta$ over the ellipsoid is $s^\top\hat\theta \pm \sqrt{2\varepsilon\,s^\top H^{-1}s}$. This gives a fast approximation to coefficient and linear-predictor ranges. For logistic loss, the ellipsoid can miss the true boundary on either side.

## What the toolkit computes

**Coefficient ranges.** Constrained convex optimization finds the minimum and maximum of each coefficient over the true loss sublevel set. The audit uses these exact optimizations within its computation budget and labels sampled ranges when it falls back to sampling.

**Label-flip tests.** For each classification row, the toolkit tests whether a model within the loss tolerance can reach the decision boundary. The fraction of rows that can flip is ambiguity. Each row may require a different competing model.

**Sampled quantities.** Hit-and-run sampling supplies prediction ranges, disagreement estimates, and permutation-importance distributions. Extremes over the visited models are inner bounds on the full set's extremes. Effective sample size is reported because a long, poorly mixed chain can still explore little of the set.

## Evaluation

The [evaluation script](https://github.com/fxcawley/StableGLM/blob/main/scripts/evaluate.py) compares exact optimization, sampling, and the Hessian approximation. At a 3% relative increase in the regularized loss, the saved classification results are:

| Dataset | Exact ambiguity | Sampled ambiguity | Ellipsoid estimate |
|---|---|---|---|
| Breast Cancer, 569 rows, 30 features | 6.2% | 2.5% | 6.7% |
| German Credit, 1,000 rows, 61 features | 82.9% | 41.7% | 84.8% |
| Adult Census subsample, 5,000 rows, 101 features | 67.8% | 14.8% | 72.6% |

The sampler used 2,000 draws. On Adult, its minimum effective sample size was about four. The evaluation therefore uses exact extrema as its reference; a sampled interval being much narrower than an ellipsoid interval does not establish that the ellipsoid is too wide.

These numbers depend on preprocessing, regularization, and tolerance. They describe the fitted classification problems, including a 0.5 probability threshold.

## Calibrating ε

The audit defaults to a loss tolerance of one standard error of cross-validated loss. It also accepts relative or absolute loss tolerances and likelihood-ratio calibrations under their statistical assumptions. The earlier purported high-dimensional likelihood-ratio correction was removed from the current implementation.

For an $\ell_2$-penalized likelihood, the quadratic Rashomon set is a highest-posterior-density region of the Laplace posterior $N(\hat\theta,(nH)^{-1})$. The corresponding prior precision is $n\lambda$ on the penalized coefficients. The analysis is mathematically related to uncertainty intervals; its practical use here is to compute explicit alternative coefficients and decisions at a stated loss tolerance.

The [benchmark post](/posts/stableglm-findings) explains the corrections to the sampling and interval comparisons in more detail.
