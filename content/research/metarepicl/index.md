---
title: "MetaRepICL: In-Context Learning as Kernel Regression on Learned Representations"
tags:
  - "in-context-learning"
  - "kernel-methods"
  - "transformers"
  - "representation-learning"
date: 2025-01-15
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "Investigating whether transformer in-context learning implements kernel ridge regression on learned hidden representations. We construct explicit linear-attention-to-conjugate-gradient mappings and study the softmax extension."
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/fxcawley/MetaRepICL"
---

# MetaRepICL: In-Context Learning as Kernel Regression on Learned Representations

## Question

A transformer performing in-context learning (ICL) takes a sequence of $(x_i, y_i)$ pairs followed by a query $x_*$ and produces a prediction $\hat y_*$ --- all without updating its weights. Recent theory has shown that single-layer linear attention implements one step of gradient descent on a least-squares objective, and by extension, that a depth-$t$ linear-attention transformer implements $t$ steps of preconditioned gradient descent, which converges to the kernel ridge regression (KRR) solution.

We ask whether this connection extends to trained transformers with softmax attention operating on learned representations.

## Approach

The project has two aims:

**Aim 1: Constructive mapping (linear attention).** We build an explicit transformer architecture whose layers exactly implement conjugate gradient (CG) iterations for solving the KRR normal equations $(\mathbf{K} + \lambda I)\alpha = \mathbf{y}$, where $\mathbf{K}$ is the kernel matrix over support representations. The construction uses:
- Attention heads that compute kernel matrix-vector products $(K\mathbf{p})_j$ via query-key-value projections over support tokens
- Aggregator tokens that compute global reductions (residual norms, step sizes)
- MLP blocks that perform the per-token CG state updates ($\alpha, r, p$)

This demonstrates that a linear-attention transformer of depth $t$ can represent $t$-step CG --- which converges at a rate determined by the condition number $\kappa$ of $\mathbf{K}$ --- and therefore approximates KRR to arbitrary precision given sufficient depth.

**Aim 2: Softmax extension.** Softmax attention computes $\text{softmax}(QK^\top / \sqrt{d})V$, which induces an exponential kernel $k(x, x') \propto \exp(x^\top x' / \sqrt{d})$ rather than a linear one. We study whether the softmax-attention ICL prediction matches KRR under this exponential kernel, measuring operator-norm proximity $\lVert \tilde{K} - K_{\exp} \rVert_2$ on the support set.

## Current findings

- The constructive CG mapping works: a hand-wired linear-attention stack converges to the KRR solution at the expected CG rate on synthetic tasks.
- Width matters: under a rank-$m$ random projection (simulating finite head dimension), prediction error approaches the oracle as $m$ increases, tracking the effective dimension $d_{\text{eff}}(\lambda)$.
- The softmax-kernel alignment holds for in-distribution tasks but degrades on out-of-distribution prompts, suggesting the learned kernel specializes to the training distribution.

## Takeaway

The connection between ICL and kernel regression is not merely an analogy: for linear attention, it is an exact correspondence mediated by conjugate gradient. The softmax case introduces an exponential kernel that the transformer approximates but does not exactly implement. Understanding this gap --- when it is small and when it blows up --- is key to predicting where ICL will succeed and where it will fail silently.
