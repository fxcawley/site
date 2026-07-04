---
title: "Trained Models, Probing, and Silent Failures"
tags: ["in-context-learning", "kernel-methods", "transformers", "probing", "silent-failure"]
date: 2026-03-15
excerpt: Training transformers on in-context regression and testing them against six named iterative solvers. The model converges far faster than gradient descent, but conjugate gradients, preconditioned CG, and preconditioned GD are statistically indistinguishable as descriptions of it. Softmax ICL fails silently at high dimension.
thread: "metarepicl"
threadTitle: "MetaRepICL"
threadOrder: 2
---

The [initial post](/posts/metarepicl) described two aims: a constructive mapping from linear attention to conjugate gradient (CG), and an investigation of whether the correspondence survives softmax attention. Both of those were analytical. This post describes what happened when I moved from hand-wired constructions to trained transformers, and the results are less clean than the theory would suggest.

## Training setup

The model is a 12-layer GPT-style transformer (pre-norm, 256-dim, 4 heads, roughly 9.5M parameters) trained on synthetic in-context regression tasks for 50,000 steps. The training data is drawn from linear regression problems with controllable condition number $\kappa$ of the design matrix. The first set of experiments uses isotropic tasks ($\kappa \approx 1$); the second trains on a mixture of $\kappa \in \{1, 10, 50, 100, 500\}$. Training takes about 20 minutes on a single GPU.

## Which algorithm? Testing six candidates

To ask what the trained model computes, I compared it against six named iterative solvers for the in-context least-squares problem: vanilla gradient descent (GD), conjugate gradients (CG), preconditioned GD (Jacobi), heavy ball, Chebyshev iteration, and preconditioned CG. Each solver runs in feature space for as many steps as the model has layers, and at each step I read off its prediction on the query. The comparison metric is the $R^2$ between the model's per-layer prediction and each solver's per-step prediction, computed across test problems and stratified by condition number $\kappa$, since well-conditioned problems are solved quickly by everything and only the ill-conditioned ones separate the candidates. All $R^2$ values carry bootstrap 95% confidence intervals (200 resamples).

The $\kappa$-weighted results at the larger scale ($p = 20$, $24$ layers) are:

| Algorithm | Weighted $R^2$ | 95% CI |
|---|---|---|
| Preconditioned CG | 0.922 | $\pm$ 0.008 |
| CG | 0.918 | $\pm$ 0.009 |
| Preconditioned GD | 0.910 | $\pm$ 0.011 |
| Chebyshev | 0.780 | $\pm$ 0.042 |
| GD | 0.721 | $\pm$ 0.060 |
| Heavy Ball | 0.581 | $\pm$ 0.046 |

![Algorithm identification summary](/research/metarepicl/algo_id_summary.png)

![Algorithm identification R² heatmap by condition number](/research/metarepicl/algo_id_r2_heatmap.png)

Two things stand out. The first is a clear separation between the CG-class methods (CG, preconditioned CG, preconditioned GD, all above 0.90) and vanilla GD at 0.72. The 0.20 gap is stable across condition numbers and both model scales, and it is the same phenomenon Fu et al. (2023) report: the model converges at a rate GD cannot produce. That much I am fairly confident in.

The second is less convenient. The top three algorithms sit within 0.004 of one another, well inside their combined confidence interval of 0.017. Which one comes out on top depends on the condition number (CG at $\kappa = 1$ and $500$, preconditioned CG at $\kappa = 50$ and $100$) and on the choice of metric, since an MSE-profile distance disagrees with $R^2$ at several $\kappa$ values. At these scales the data does not distinguish them. Preconditioned GD, the algorithm Ahn et al. (2024) identify, is one member of this indistinguishable cluster; the observation here does not contradict their result so much as show that "CG" and "preconditioned CG" are equally consistent with the same behavior.

The reason appears to be structural rather than statistical. With $p = 20$ features and 24 layers, every CG-class method converges in at most $p$ steps, so the last several layers are past convergence and carry no discriminating signal: the converged solvers all approach the same ridge solution and their late-layer predictions agree by construction. Distinguishing them would require a regime where $p \gg L$, so that each algorithm is still mid-convergence at every layer. Until those experiments are run, the description I am willing to defend is a convergence class (CG-like, second-order) rather than a specific named algorithm.

## Probing: a mismatch between representation and behavior

A separate question is whether the model's internal states, not just its predictions, resemble any of these algorithms. I fit linear probes from each layer's activations to the state variables of GD and CG (weight vectors, residuals, CG iterates) on the mixed-$\kappa$ model.

![Probe cosine similarity by condition number](/research/metarepicl/probe_by_kappa.png)

The result runs opposite to the behavioral finding. GD probes achieve higher cosine similarity than CG probes at every condition number (means around 0.11 versus 0.06), even though the model's convergence rate matches CG rather than GD. Read at face value, this says the representations are GD-like while the behavior is CG-like.

I do not think the face-value reading is warranted yet. The absolute similarities are low throughout (roughly 0.06 to 0.14), which suggests neither algorithm's state is strongly encoded in a linearly accessible form, and linear ridge probes can only detect structure that happens to align with the chosen basis. A CG computation stored in a rotated or otherwise nonlinear representation would look GD-like, or like nothing in particular, to a probe of this kind. Nonlinear probes, basis controls, and distribution-shift tests would be needed before reading anything mechanistic into the mismatch. I include it because it is exactly the sort of result that is easy to over-interpret, and I would rather flag it as unresolved than present it as evidence for a mechanism.

## Silent failure of softmax attention

Independent of the algorithm-identification question, softmax attention can be viewed as an approximate exponential-kernel regressor: it predicts $\sum_i w_i y_i$ with weights $w_i \propto \exp(x_q^\top x_i / \tau)$, which is a Nadaraya--Watson estimator. Comparing it against the exact exponential-kernel KRR oracle turns up failure modes that aggregate error metrics do not reveal.

![Silent failure demo](/research/metarepicl/silent_failure_demo.png)

![Rank correlation vs dimension](/research/metarepicl/sweep_dimension.png)

| Regime | RMSE ratio | Rank corr. $\rho$ |
|---|---|---|
| Healthy ($\tau=1$, $p=8$) | 0.38$\times$ | 0.71 |
| High dimension ($p=64$) | 1.19$\times$ | 0.22 |
| Low temperature ($\tau=0.05$) | 0.89$\times$ | 0.72 |
| Ill-conditioned ($\kappa=500$) | $\approx 0$ | 0.24 |

The high-dimensional and ill-conditioned rows are the concerning ones. In both, the RMSE relative to the oracle is comparable or better, yet rank correlation collapses to around 0.22--0.24, close to random. The prediction ordering is destroyed while the average error looks fine, so a practitioner monitoring RMSE alone would not notice. Linear-attention CG keeps rank correlation above 0.999 at the same dimension.

The mechanism in high dimensions is concentration: inner products between random features cluster near zero, so $\exp(x_q^\top x_i/\tau) \approx 1$ for all pairs, the softmax weights become nearly uniform, and the prediction collapses toward the label mean $\bar y$. That has low RMSE when the labels have low variance but no discriminative power. The safe range of $\tau$ narrows as $p$ grows, and longer context partially compensates (at $n = 128$ support points, rank correlation recovers to around 0.90 at moderate $p$). The general pattern is that softmax ICL can degrade in ways standard metrics miss, and the degradation is worst in exactly the high-dimensional, ill-conditioned settings where the kernel characterization was supposed to be most useful.

## Where this leaves the project

The constructive result from the first post is unaffected: for linear attention the CG mapping is exact and converges at the predicted rate. The trained-model experiments add a more qualified picture. Behaviorally the model belongs to the CG convergence class and is clearly not vanilla GD, but the specific member of that class is not identifiable at scales where $p \le L$. The probe results point, tentatively and against the behavior, toward GD-like representations, and I do not yet trust that signal enough to build on it. The softmax extension introduces failure modes that are invisible under RMSE and worst in exactly the high-dimensional, ill-conditioned settings where the kernel characterization was supposed to help most.

The most informative next steps are the ones that bear directly on these open questions: pushing to $p \gg L$ to see whether the top three algorithms separate, replacing the linear probes with nonlinear ones and proper basis controls, and testing whether any of this transfers to pretrained language models (GPT-2, LLaMA). The formal side still has gaps; several proof stubs remain open, covering tight constants, preconditioner analysis, the multi-output extension, numerical stability, and the interaction between causal masking and the CG iteration. I would not present the identification results as settled until the larger-scale experiments are run.
