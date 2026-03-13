---
title: "StableGLM: Rashomon Sets for Generalized Linear Models"
tags:
  - "interpretability"
  - "rashomon-sets"
  - "generalized-linear-models"
  - "stability"
date: 2025-01-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A toolkit for computing ε-Rashomon sets, membership certificates, and set-level interpretability metrics for GLMs. Addresses the question: when many models fit the data equally well, which explanations are stable?"
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/fxcawley/StableGLM"
---

# StableGLM: Rashomon Sets for Generalized Linear Models

## Problem

Interpretability methods typically report properties of a single fitted model. But in practice, many parameter vectors achieve nearly the same loss --- the Rashomon effect. If a feature appears important under one near-optimal model but irrelevant under another, the explanation is an artifact of model selection, not a property of the data.

StableGLM makes this concrete for generalized linear models by characterizing the full set of near-optimal models and computing interpretability metrics over that set.

## Setup

For a GLM with convex loss $L(\theta) = \frac{1}{n}\sum_i \ell(y_i, x_i^\top\theta) + \frac{\lambda}{2}\lVert\theta\rVert^2$, the ε-Rashomon set is

$$\mathcal{R}_\varepsilon = \{\theta : L(\theta) \leq L(\hat\theta) + \varepsilon\}.$$

This is a convex sublevel set. Near the optimum, the Hessian $H = \nabla^2 L(\hat\theta)$ provides a local ellipsoidal approximation:

$$\mathcal{E}_\varepsilon = \{\hat\theta + \Delta : \Delta^\top H \Delta \leq 2\varepsilon\}.$$

The ellipsoid is cheap to work with analytically. For arbitrary linear functionals $s^\top\theta$, the extrema over $\mathcal{E}_\varepsilon$ have closed forms involving $\lVert s \rVert_{H^{-1}}$. For exact (non-approximate) computations, we sample uniformly from $\mathcal{R}_\varepsilon$ using hit-and-run with a membership oracle.

## What the toolkit computes

**Per-point prediction bands.** For each data point, the range of predictions $[p_i^{\min}, p_i^{\max}]$ across all models in $\mathcal{R}_\varepsilon$. Points with wide bands are *ambiguous*: the model's prediction depends on which near-optimal $\theta$ was chosen.

**Variable Importance Clouds (VIC).** The range of each coefficient $\theta_j$ across the Rashomon set, and Shapley-weighted variants that account for feature correlations.

**Model Class Reliance (MCR).** The range of permutation-based feature importance scores across the set, answering: could this feature be unimportant under some near-optimal model?

**Predictive multiplicity metrics.** Ambiguity (fraction of points whose predicted label changes across $\mathcal{R}_\varepsilon$), discrepancy (maximum pairwise disagreement), and Rashomon capacity (effective volume of the set).

## Calibrating ε

The choice of $\varepsilon$ determines the size of the set. We support three calibration modes: (1) percent loss slack ($\varepsilon = \rho \cdot L(\hat\theta)$), (2) likelihood-ratio inversion ($2n\varepsilon \approx \chi^2_{d,1-\alpha}$), and (3) a high-dimensional correction for the $d/n \not\ll 1$ regime.

## Takeaway

For any GLM fit on correlated or noisy features, single-model explanations are likely unstable. The Rashomon set makes this instability visible and quantifiable. The practical message: before trusting a feature importance ranking, check whether it survives across near-optimal models. If it doesn't, the ranking reflects optimization noise, not signal.
