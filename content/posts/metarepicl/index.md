---
title: "MetaRepICL: Is In-Context Learning Kernel Regression?"
tags: ["in-context-learning", "kernel-methods", "transformers", "representation-learning"]
date: 2025-02-01
excerpt: Recent theory shows that linear-attention transformers doing in-context learning implement kernel ridge regression via gradient descent. MetaRepICL asks whether this characterization survives softmax attention, learned representations, and distribution shift.
thread: "self-models"
threadTitle: "Self-Models"
threadOrder: 2
---

When a transformer performs in-context learning (receiving a sequence of $(x_i, y_i)$ pairs followed by a query $x_*$ and producing a prediction $\hat y_*$ without any weight updates) there is a natural question about what computation it is actually performing. The model's weights are fixed; only the context changes. So whatever function maps the context and query to the prediction is implicitly encoded in the architecture and the learned parameters. Understanding that function is a problem of building a self-model: a description of the system's own internal computation that is detailed enough to be predictive.

Recent theoretical work, beginning with von Oswald et al. (2023) and Akyürek et al. (2023), has established that for single-layer linear attention, in-context learning implements one step of gradient descent on a least-squares objective defined by the in-context examples. By extension, a depth-$t$ linear-attention transformer implements $t$ steps of preconditioned gradient descent, which converges to the kernel ridge regression (KRR) solution. This is a surprisingly clean correspondence — the transformer is not merely *similar to* a kernel method; under linear attention, it *is* one.

MetaRepICL asks how far this correspondence extends once the simplifying assumptions are relaxed: softmax attention instead of linear, learned representations instead of raw inputs, and distribution shift between training and evaluation.

## Aim 1: an explicit construction for linear attention

The first part of the project makes the linear-attention–KRR correspondence constructive. Rather than proving an existence result, it builds an explicit transformer architecture whose layers implement conjugate gradient (CG) iterations for the KRR normal equations

$$(\mathbf{K} + \lambda I)\alpha = \mathbf{y}$$

where $\mathbf{K}$ is the kernel matrix over the support representations. The construction uses three components:

- Attention heads that compute kernel matrix-vector products $(K\mathbf{p})_j$ through query-key-value projections over the support tokens.
- Aggregator tokens that compute global reductions needed by CG: residual norms, step sizes, and conjugacy corrections.
- MLP blocks that perform the per-token state updates for the CG iterates ($\alpha$, $r$, $p$).

A linear-attention transformer of depth $t$ built this way runs $t$ CG iterations, and CG converges at a rate governed by the condition number $\kappa$ of $\mathbf{K}$. So the architecture can approximate the KRR solution to arbitrary precision given sufficient depth. The construction also makes explicit what limits convergence: the effective rank of the kernel matrix and the width of the attention heads, which together determine how accurately the matrix-vector products are computed.

## Aim 2: the softmax extension

Softmax attention computes $\text{softmax}(QK^\top / \sqrt{d})V$, which, unlike linear attention, does not correspond to a simple inner-product kernel. The softmax operation induces something closer to an exponential kernel $k(x, x') \propto \exp(x^\top x' / \sqrt{d})$, though the correspondence is not exact because of the normalization.

The question is whether the ICL prediction under softmax attention still approximates KRR under this induced kernel. MetaRepICL measures this by computing the operator-norm distance $\lVert \tilde{K} - K_{\exp} \rVert_2$ between the attention-induced similarity matrix and the exponential kernel matrix on the support set.

## Findings so far

Three observations, all preliminary:

1. The constructive CG mapping works as expected: the hand-wired linear-attention stack converges to the KRR solution at the predicted CG rate on synthetic regression tasks.

2. Width matters in a specific way. Under a rank-$m$ random projection simulating finite head dimension, the prediction error approaches the oracle KRR solution as $m$ increases, and the convergence tracks the effective dimension $d_{\text{eff}}(\lambda) = \text{tr}(\mathbf{K}(\mathbf{K} + \lambda I)^{-1})$.

3. The softmax-kernel alignment holds for in-distribution tasks but degrades on out-of-distribution prompts. This suggests that the learned kernel specializes to the training distribution; the transformer learns to approximate KRR on tasks it has seen, but the approximation does not transfer robustly.

The third finding is, I think, the most interesting, and also the most preliminary. It suggests that the mechanistic story "ICL is kernel regression" is true in a distribution-dependent sense: the transformer implements something close to KRR on the task distribution it was trained on, but the correspondence is a property of the training distribution, not of the architecture alone.

## Connection to the broader theme

The companion post on [StableGLM](/posts/stableglm) asks whether model explanations are stable across the set of near-optimal models. This post asks a related question: whether our mechanistic understanding of what a model *computes* is stable across input distributions. In both cases, the answer is conditional — explanations and mechanistic descriptions hold within certain regions of parameter space or input space, and break down outside them.

The shared premise is that understanding a model is not a binary. There is a continuum between "we have a complete mechanistic account" and "we have no idea what it is doing," and the useful work is in characterizing where on that continuum a given description sits, and what causes it to degrade.
