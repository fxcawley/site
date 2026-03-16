---
title: "Trained Models, Probing, and Silent Failures"
tags: ["in-context-learning", "kernel-methods", "transformers", "probing", "silent-failure"]
date: 2026-03-15
excerpt: Training a 12-layer transformer and probing its internals. The model outperforms gradient descent by orders of magnitude but does not cleanly implement conjugate gradient either. Softmax ICL fails silently at high dimension.
thread: "metarepicl"
threadTitle: "MetaRepICL"
threadOrder: 2
---

The [initial post](/posts/metarepicl) described two aims: a constructive mapping from linear attention to conjugate gradient (CG), and an investigation of whether the correspondence survives softmax attention. Both of those were analytical. This post describes what happened when I moved from hand-wired constructions to trained transformers, and the results are less clean than the theory would suggest.

## Training setup

The model is a 12-layer GPT-style transformer (pre-norm, 256-dim, 4 heads, roughly 9.5M parameters) trained on synthetic in-context regression tasks for 50,000 steps. The training data is drawn from linear regression problems with controllable condition number $\kappa$ of the design matrix. The first set of experiments uses isotropic tasks ($\kappa \approx 1$); the second trains on a mixture of $\kappa \in \{1, 10, 50, 100, 500\}$. Training takes about 20 minutes on a single GPU.

## Probing: GD-like representations, CG-like predictions

To identify what algorithm the trained model implements, I fit linear probes at each layer to predict the intermediate states of both gradient descent (GD) and conjugate gradient (CG) applied to the same in-context regression problem. The probe measures cosine similarity between the model's hidden states and the iterates of each reference algorithm.

On isotropic training, the result is that the model's internal representations are more GD-like than CG-like. The mean CG probe similarity is 0.184; the mean GD probe similarity is 0.298. Both decline with depth, and at layer 12 neither probe explains much of the hidden state variance (CG: 0.032, GD: 0.156). Random baselines are near zero throughout.

This does not mean the model *is* doing gradient descent. On mixed-$\kappa$ training, the model's final-layer prediction error is 2--5$\times$ worse than feature-space CG across all condition numbers, but 3--1000$\times$ better than GD, with the gap growing as $\kappa$ increases. At $\kappa = 500$, GD produces an MSE of 54.2 while the model achieves 0.054. CG reaches 0.020. The model outperforms GD by three orders of magnitude in the ill-conditioned regime, which rules out GD as a description of the model's algorithm, even though the representations look more GD-like to the probes.

## Algorithm identification

A more systematic comparison tests the trained model against six named algorithms: GD, CG, preconditioned GD, Heavy Ball, Chebyshev iteration, and preconditioned CG. The metric is the $R^2$ between the model's per-layer predictions and each algorithm's iterates, averaged across condition numbers and weighted by $\kappa$.

At the smaller scale ($n = 20$ support points, $p = 10$ features), preconditioned CG achieves the highest weighted $R^2$ at 0.853 $(\pm 0.036)$, followed by vanilla CG at 0.826 $(\pm 0.035)$ and preconditioned GD at 0.814 $(\pm 0.033)$. GD and Heavy Ball trail at 0.513 and 0.323 respectively. At a larger scale ($n = 40$, $p = 20$), the same ranking holds with tighter confidence intervals: preconditioned CG at 0.922, CG at 0.918. The gap between preconditioned CG and vanilla CG is not statistically significant in either configuration, so the data does not distinguish between them.

The practical summary is that the trained model's layer-wise predictions most closely track some variant of CG, even though its internal representations do not obviously correspond to CG iterates. This is a somewhat unsatisfying conclusion, but it is consistent with the possibility that the model has found an algorithm that achieves CG-like convergence rates through a different computational pathway.

## Silent failure of softmax ICL

The most practically relevant finding is about failure modes. When the input dimension $p$ grows, softmax attention's approximation of the kernel degrades in a way that is not visible in aggregate error metrics.

At $p = 64$, the rank correlation between the softmax ICL predictions and the oracle KRR solution drops to 0.18, which is close to random. However, the RMSE remains moderate because the softmax model's predictions cluster around the mean rather than producing large outliers. A practitioner monitoring only RMSE would see acceptable performance; a practitioner checking rank correlation would see that the model has lost the ability to distinguish which queries should receive high predictions from which should receive low ones. Linear-attention CG maintains rank correlation above 0.999 at the same dimension.

The failure also depends on the attention temperature $\tau$ and the conditioning of the kernel. The safe zone for $\tau$ (the range within which the softmax approximation is reasonable) narrows as $p$ increases. At $\kappa = 500$, the oracle itself becomes unstable, and the softmax model produces plausible-looking but essentially uncorrelated predictions (rank correlation 0.24).

Context length partially mitigates the problem: at $n = 128$ support points, rank correlation recovers to 0.90 even at moderate $p$. But the general pattern is that softmax ICL can degrade in ways that standard evaluation metrics do not detect, and the degradation is worst in exactly the high-dimensional, ill-conditioned settings where the KRR characterization was supposed to be most useful.

## Where this leaves the project

The constructive result from the first post holds: for linear attention, the CG mapping is exact and convergence follows the predicted rate. The trained-model experiments add a more complicated picture. The model learns something CG-like in its input-output behavior but not in its internal representations, and the softmax extension introduces failure modes that are silent under standard metrics.

The next steps are probing pretrained language models (GPT-2, LLaMA) for similar optimization signatures, and extending the CG construction to nonlinear GLMs (logistic, Poisson). The formal proofs also have gaps that need to be closed before this is ready for a venue submission. Five proof stubs remain open, covering tight constants, formal preconditioner analysis, multi-output extension, numerical stability, and the interaction between causal masking and the CG iteration.
