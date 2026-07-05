---
title: "MetaRepICL: Is In-Context Learning Kernel Regression?"
tags: ["in-context-learning", "kernel-methods", "transformers", "representation-learning"]
date: 2025-11-01
excerpt: Recent theory shows that linear-attention transformers doing in-context learning implement kernel ridge regression via gradient descent. MetaRepICL asks whether this characterization survives softmax attention, learned representations, and distribution shift.
thread: "metarepicl"
threadTitle: "MetaRepICL"
threadOrder: 1
---

## The short version

In-context learning is the mechanism behind few-shot prompting. A trained model is shown a handful of worked examples inside its prompt (an input paired with its correct answer, repeated a few times) followed by a new input, and it produces an answer for that new input. The notable part is that nothing about the model changes while this happens: no gradient steps, no fine-tuning, no updated weights. The examples go in as ordinary text, and the answer comes out.

<IclMechanism />

It is worth being precise about what "without changing weights" means, because the weights are usually thought of as where a model's knowledge lives. The weights fix a procedure; they stay the same when the prompt changes. What changes is the input that procedure is run on. A pocket calculator is an imperfect but useful comparison: its circuitry never changes, yet its output depends entirely on the numbers entered. In-context learning is the network applying one fixed, learned procedure to whatever examples happen to be in the prompt, and the aim of this project is to work out what that procedure is.

## Learning by comparison

A good place to start is one of the older ideas in statistics: to predict the answer for a new input, look at the examples already in hand and let the ones most similar to the new input have the most say. A forecast for today that averages the most similar past days, weighted by how similar they were, works this way. The rule that decides "how similar" is called a *kernel*, and the weighted-average predictor built from it is *kernel regression*.

<WeightedVote />

The reason this is relevant is a line of recent theory showing that a simplified transformer, doing in-context learning, computes something close to kernel regression over its examples. Under the right simplifications the two computations coincide exactly. That is a strong claim, and much of this project is about how much of it survives once the simplifications are removed.

## Faster than the obvious method

There is a second thread worth setting up. The natural way to solve the least-squares problem underneath all of this is gradient descent: nudge the current guess a little in the downhill direction, and repeat. It works, but on stretched-out, ill-conditioned problems it zig-zags and needs many steps. Trained transformers reach the answer in far fewer steps than gradient descent would require, which means they are not running the obvious method. They appear to use something closer to the methods numerical analysts turn to when gradient descent is too slow, such as conjugate gradients.

<GdVsCg />

Identifying exactly which of these faster methods best describes a trained model is harder than it first appears, and that difficulty is the subject of the [second post in this thread](/posts/metarepicl-findings). The rest of this post states the same ideas more precisely and lays out the two aims of the project.

## In more precise terms

When a transformer performs in-context learning (receiving a sequence of $(x_i, y_i)$ pairs followed by a query $x_*$ and producing a prediction $\hat y_*$ without any weight updates) there is a natural question about what computation it is actually performing. The model's weights are fixed; only the context changes. So whatever function maps the context and query to the prediction is implicitly encoded in the architecture and the learned parameters. Understanding that function is a problem of building a self-model: a description of the system's own internal computation that is detailed enough to be predictive.

Recent theoretical work, beginning with von Oswald et al. (2023) and Akyürek et al. (2023), has established that for single-layer linear attention, in-context learning implements one step of gradient descent on a least-squares objective defined by the in-context examples. By extension, a depth-$t$ linear-attention transformer implements $t$ steps of preconditioned gradient descent, which converges to the kernel ridge regression (KRR) solution. This is a surprisingly clean correspondence that the transformer is a kernel method under linear attention.

MetaRepICL asks how far this correspondence extends once the simplifying assumptions are relaxed: softmax attention instead of linear, learned representations instead of raw inputs, and distribution shift between training and evaluation.

## Aim 1: an explicit construction for linear attention

The idea here is to stop arguing that a transformer *could* be doing kernel regression and instead build one that provably does, by hand. If the layers can be wired to carry out the individual steps of a known solver, then there is nothing mysterious left to explain about that particular network.

The first part of the project makes the linear-attention–KRR correspondence constructive. Rather than proving an existence result, it builds an explicit transformer architecture whose layers implement conjugate gradient (CG) iterations for the KRR normal equations

$$(\mathbf{K} + \lambda I)\alpha = \mathbf{y}$$

where $\mathbf{K}$ is the kernel matrix over the support representations. The construction uses three components:

- Attention heads that compute kernel matrix-vector products $(K\mathbf{p})_j$ through query-key-value projections over the support tokens.
- Aggregator tokens that compute global reductions needed by CG: residual norms, step sizes, and conjugacy corrections.
- MLP blocks that perform the per-token state updates for the CG iterates ($\alpha$, $r$, $p$).

A linear-attention transformer of depth $t$ built this way runs $t$ CG iterations, and CG converges at a rate governed by the condition number $\kappa$ of $\mathbf{K}$. So the architecture can approximate the KRR solution to arbitrary precision given sufficient depth. The construction also makes explicit what limits convergence: the effective rank of the kernel matrix and the width of the attention heads, which together determine how accurately the matrix-vector products are computed.

## Aim 2: the softmax extension

Real transformers do not use the linear attention that makes the correspondence exact; they use softmax attention, which changes the similarity rule. The question is whether the clean picture survives the switch, or whether softmax quietly implements a different kernel that only sometimes behaves like the one the theory predicts.

Softmax attention computes $\text{softmax}(QK^\top / \sqrt{d})V$, which, unlike linear attention, does not correspond to a simple inner-product kernel. The softmax operation induces something closer to an exponential kernel $k(x, x') \propto \exp(x^\top x' / \sqrt{d})$, though the correspondence is not exact because of the normalization.

The question is whether the ICL prediction under softmax attention still approximates KRR under this induced kernel. MetaRepICL measures this by computing the operator-norm distance $\lVert \tilde{K} - K_{\exp} \rVert_2$ between the attention-induced similarity matrix and the exponential kernel matrix on the support set.

## Findings so far

The short version of the results: the hand-built construction behaves exactly as the theory says, and the trained softmax model behaves like kernel regression on the tasks it was trained on but not reliably outside them. Three observations, all preliminary:

1. The constructive CG mapping works as expected: the hand-wired linear-attention stack converges to the KRR solution at the predicted CG rate on synthetic regression tasks.

2. Width matters in a specific way. Under a rank-$m$ random projection simulating finite head dimension, the prediction error approaches the oracle KRR solution as $m$ increases, and the convergence tracks the effective dimension $d_{\text{eff}}(\lambda) = \text{tr}(\mathbf{K}(\mathbf{K} + \lambda I)^{-1})$.

3. The softmax-kernel alignment holds for in-distribution tasks but degrades on out-of-distribution prompts. This suggests that the learned kernel specializes to the training distribution; the transformer learns to approximate KRR on tasks it has seen, but the approximation does not transfer robustly.

<KernelShift />

The third finding is, I think, the most interesting, and also the most preliminary. It suggests that the mechanistic story "ICL is kernel regression" is true in a distribution-dependent sense: the transformer implements something close to KRR on the task distribution it was trained on, but the correspondence is a property of the training distribution, not of the architecture alone.

## Connection to the broader theme

The companion post on [StableGLM](/posts/stableglm) asks whether model explanations are stable across the set of near-optimal models. This post asks a related question: whether our mechanistic understanding of what a model *computes* is stable across input distributions. In both cases, the answer is conditional  explanations and mechanistic descriptions hold within certain regions of parameter space or input space, and break down outside them.

There is a continuum between "we have a complete mechanistic account" and "we have no idea what it is doing," and the useful work is in characterizing where on that continuum a given description sits, and what causes it to degrade.
