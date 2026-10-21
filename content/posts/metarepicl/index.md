---
title: "MetaRepICL: Is In-Context Learning Kernel Regression?"
tags: ["in-context-learning", "kernel-methods", "transformers", "representation-learning"]
date: 2025-11-01
excerpt: MetaRepICL studies how attention can carry out kernel regression, then tests whether that description predicts the behavior of trained transformers.
thread: "metarepicl"
threadTitle: "MetaRepICL"
threadOrder: 1
---

## The short version

In-context learning is the mechanism behind few-shot prompting. A trained model is shown a handful of worked examples inside its prompt (an input paired with its correct answer, repeated a few times) followed by a new input, and it produces an answer for that new input. Its weights stay fixed throughout.

<IclMechanism />

The weights fix a procedure; the prompt supplies its input. A pocket calculator is an imperfect but useful comparison: its circuitry never changes, yet its output depends on the numbers entered. [MetaRepICL](https://github.com/fxcawley/MetaRepICL) asks what procedure a transformer applies to the examples in its context.

## Learning by comparison

A kernel assigns a similarity value to a pair of inputs. One way to use it is to predict a new label by averaging the observed labels, with weights proportional to their inputs' similarity to the query. A forecast that averages the weather on similar past days works this way. This normalized weighted average is a *kernel smoother*.

<WeightedVote />

Kernel ridge regression (KRR) uses the matrix of pairwise similarities to fit coefficients through a regularized linear system. Its prediction generally differs from the weighted average above. Attention supplies related similarity computations, which suggests asking whether a sequence of attention layers can perform the KRR solve.

## Comparing iterative solvers

Gradient descent can solve the least-squares problem underlying KRR, but on an ill-conditioned problem it may need many steps. Conjugate gradients (CG) uses previous search directions to solve the same system more efficiently. Comparing these solvers gives reference trajectories against which to measure a trained transformer's predictions at successive layers.

<GdVsCg />

In the trained-model experiments, predictions reached low error in fewer layers than the reference GD solver needed iterations. The [second post](/posts/metarepicl-findings) describes this comparison and the later coordinate-permutation test that overturned its initial interpretation.

## The regression problem

The regression setting makes the question explicit: given support pairs $(x_i, y_i)$ and a query $x_*$, what computation produces $\hat y_*$?

Work by von Oswald et al. (2023) and Akyürek et al. (2023) gives transformer constructions that implement optimization steps for in-context regression. In particular, appropriately chosen linear-attention weights can carry out a gradient step on a least-squares objective. Extending this correspondence requires specifying the weights and state updates at each layer.

MetaRepICL asks how far this correspondence extends once the simplifying assumptions are relaxed: softmax attention instead of linear, learned representations instead of raw inputs, and distribution shift between training and evaluation.

## Aim 1: an explicit construction for linear attention

The first part of the project sketches how attention, reductions, and token-wise updates could implement CG iterations for the KRR system

$$(\mathbf{K} + \lambda I)\alpha = \mathbf{y}$$

where $\mathbf{K}$ is the kernel matrix over the support representations. The construction uses three components:

- Attention heads that compute kernel matrix-vector products $(K\mathbf{p})_j$ through query-key-value projections over the support tokens.
- Aggregator tokens that compute global reductions needed by CG: residual norms, step sizes, and conjugacy corrections.
- MLP blocks that perform the per-token state updates for the CG iterates ($\alpha$, $r$, $p$).

The [numerical implementation](https://github.com/fxcawley/MetaRepICL/blob/main/src/lat/cg_stack.py) simulates these operations in NumPy. With exact matrix-vector products, CG converges at a rate governed by $\kappa(\mathbf{K}+\lambda I)$. Restricting the feature representation to a smaller rank introduces additional approximation error.

The transformer mapping remains a proof sketch. The repository lists unresolved details concerning the preconditioner, finite precision, multi-output regression, and causal masking. The numerical checks establish that the implemented CG updates solve the stated system.

## Aim 2: the softmax extension

Softmax attention changes the similarity computation and normalizes its weights. The second aim is to work out how this affects the proposed correspondence.

Softmax attention computes $\text{softmax}(QK^\top / \sqrt{d})V$. With a shared query and key feature map, its unnormalized similarities take the exponential-kernel form $k(x, x') = \exp(\phi(x)^\top\phi(x') / \sqrt{d})$. A head using the support labels as values then computes the normalized kernel smoother illustrated above.

The experiments compare that smoother with exponential-kernel KRR. The proposed deeper construction also needs to recover the normalization factors and solve the ridge system. Comparing similarity matrices alone leaves the latter computation untested.

## Findings

The project contains numerical checks of the construction and experiments on trained transformers. Their conclusions have different scopes:

1. The hand-written CG implementation converges to the KRR solution on synthetic regression tasks. This checks the implementation of the solver and attention matrix-vector products.

2. Width experiments use rank-$m$ projections to simulate a restricted feature representation. They compare prediction error with the effective dimension $d_{\text{eff}}(\lambda) = \text{tr}(\mathbf{K}(\mathbf{K} + \lambda I)^{-1})$. These are experiments on projected kernels; the width bound remains a proof sketch.

3. The trained models fit regression tasks drawn from their training distribution, but models trained with a fixed ordering of feature variances fail when the input coordinates are permuted. The October 2026 controls traced this dependence to a coordinate-specific rescaling. This supersedes the earlier interpretation of their convergence as evidence for a CG-like algorithm.

<KernelShift />

The [follow-up](/posts/metarepicl-findings#the-coordinate-permutation-control) describes the permutation test and the controls trained on random covariance bases.

The companion project, [StableGLM](/posts/stableglm), tests explanation stability across near-optimal models. Here the test concerns whether a proposed algorithm predicts the same model's behavior after the inputs change.
