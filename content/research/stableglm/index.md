---
title: "StableGLM"
tags:
  - "interpretability"
  - "rashomon-sets"
  - "generalized-linear-models"
  - "stability"
date: 2025-01-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "ε-Rashomon sets, certificates, exact membership sampling, and set-level interpretability metrics for generalized linear models. Tools for reasoning about the multiplicity of near-optimal models."
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/fxcawley/StableGLM"
---

# StableGLM

## Overview

When multiple models achieve near-optimal loss, which one should we trust? The **Rashomon effect** — the existence of many nearly-equally-good models — is ubiquitous in practice but underexplored in terms of concrete tools.

StableGLM provides:

- **ε-Rashomon set characterization** for GLMs: exact geometric description of the set of parameter vectors within ε of the optimum
- **Certificates**: efficiently verifiable proofs that a given model lies inside (or outside) the Rashomon set
- **Exact membership sampling**: uniform sampling from the Rashomon set for downstream analysis
- **Set-level interpretability metrics**: feature importance scores that account for model multiplicity

## Why This Matters

Standard interpretability methods (SHAP, LIME, feature importance) report properties of a *single* model. But if many models fit the data equally well, these explanations may be artifacts of the particular model chosen rather than properties of the data.

Set-level metrics answer a different question: *across all near-optimal models, how important is this feature?* This gives more robust and trustworthy explanations.

## Technical Approach

For GLMs with convex loss, the Rashomon set $\mathcal{R}_\varepsilon = \{\theta : L(\theta) \leq L(\hat{\theta}) + \varepsilon\}$ is a convex sublevel set. We exploit this structure for:

1. **Membership testing** via a single convex optimization
2. **Sampling** via hit-and-run on the sublevel set
3. **Variable importance** via projection of $\mathcal{R}_\varepsilon$ onto each coordinate axis

The framework extends to regularized GLMs and handles both $\ell_1$ and $\ell_2$ penalties.
