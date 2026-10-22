---
title: "Trained Models, Probing, and Silent Failures"
tags: ["in-context-learning", "kernel-methods", "transformers", "probing", "silent-failure"]
date: 2026-03-15
excerpt: Comparing trained regression models with iterative solvers, then testing whether the agreement survives a permutation of the input coordinates.
thread: "metarepicl"
threadTitle: "MetaRepICL"
threadOrder: 2
threadTransition:
  label: "Test the proposed computation"
  description: >-
    The construction motivates comparisons with trained transformers.
    Coordinate permutations then test whether agreement with a solver's
    prediction trajectory identifies the computation.
---

The [initial post](/posts/metarepicl) described a proposed mapping from linear attention to conjugate gradient (CG), together with numerical checks and a softmax extension. This post compares trained transformers with iterative solvers for the same regression problems.

*Updated October 2026: the coordinate-permutation control below supersedes the original algorithm-identification claim. The early comparison scores are retained as measurements of agreement on the training distribution.*

## Training setup

The initial model is a 12-layer transformer (pre-norm, 256-dim, 4 heads, full attention, roughly 9.5M parameters) trained on synthetic in-context regression tasks for 50,000 steps. The training data is drawn from linear regression problems with controllable condition number $\kappa$ of the feature covariance. The first set of experiments uses isotropic tasks ($\kappa \approx 1$); the second trains on a mixture of $\kappa \in \{1, 10, 50, 100, 500\}$. Training takes about 20 minutes on a single GPU.

## Which algorithm? Testing six candidates

To ask what the trained model computes, I compared it against six iterative solvers for the regularized in-context least-squares problem: vanilla gradient descent (GD), conjugate gradients (CG), preconditioned GD (Jacobi), heavy ball, Chebyshev iteration, and preconditioned CG. Each solver runs in feature space for as many steps as the model has layers. Separate linear readout heads, trained with the transformer frozen, map each layer's activations to a query prediction. The comparison metric is the $R^2$ between these predictions and each solver's per-step predictions, computed across test problems and stratified by $\kappa$. Ill-conditioned problems give the solvers more opportunity to differ before convergence. The reported intervals use 200 bootstrap resamples.

The $\kappa$-weighted results at the larger scale ($p = 20$, $24$ layers, $30{,}000$ training steps) are:

| Algorithm | Weighted $R^2$ | Reported 95% CI |
|---|---|---|
| Preconditioned CG | 0.922 | $\pm$ 0.008 |
| CG | 0.918 | $\pm$ 0.009 |
| Preconditioned GD | 0.909 | $\pm$ 0.011 |
| Chebyshev | 0.780 | $\pm$ 0.042 |
| GD | 0.721 | $\pm$ 0.060 |
| Heavy Ball | 0.581 | $\pm$ 0.046 |

![Algorithm identification summary](/research/metarepicl/algo_id_summary.png)

![Algorithm identification R² heatmap by condition number](/research/metarepicl/algo_id_r2_heatmap.png)

CG, preconditioned CG, and preconditioned GD each score above 0.90, compared with 0.72 for vanilla GD. On these problems, their prediction trajectories fit the readouts better than the reference GD trajectory does.

The top two scores differ by about 0.004; the top three span about 0.013 and have overlapping reported intervals. Their ordering also depends on the condition number and metric: an MSE-profile distance disagrees with $R^2$ at several $\kappa$ values. These comparisons did not identify a specific algorithm.

There is a limitation in this experimental regime. With $p = 20$ features and 24 layers, CG and preconditioned CG terminate within $p$ iterations in exact arithmetic. Once solvers approach the same ridge solution, their predictions provide little evidence about the path taken to reach it. Preconditioned GD has no corresponding finite-step guarantee. The later permutation control exposed a further problem with interpreting the agreement as evidence for an algorithm.

## Probing the internal states

A separate question is whether the model's internal states, not just its predictions, resemble any of these algorithms. I fit linear probes from each layer's activations to the state variables of GD and CG (weight vectors, residuals, CG iterates) on the mixed-$\kappa$ model.

![Probe cosine similarity by condition number](/research/metarepicl/probe_by_kappa.png)

GD probes achieve higher cosine similarity than CG probes at every condition number (means around 0.11 versus 0.06). Both are weak matches, despite the relatively high agreement between the model's predictions and several solvers' predictions.

The absolute similarities, roughly 0.06 to 0.14, are too low to support a claim that either solver's state has been recovered. Linear probes can miss a nonlinear encoding, but an invertible linear rotation alone would not hide a representation from an unrestricted linear probe. These results leave the internal computation unresolved.

## Numerical tests of softmax smoothing

A separate [numerical experiment](https://github.com/fxcawley/MetaRepICL/blob/main/experiments/silent_failure.py) compares three estimators on synthetic regression data. Softmax smoothing predicts $\sum_i w_i y_i$ with normalized weights $w_i \propto \exp(x_q^\top x_i / \tau)$, a Nadaraya–Watson estimator. The other two estimators are exponential-kernel and linear-kernel ridge regression, computed by direct linear solves. This experiment uses no trained transformer.

*October 2026 correction: the original generator restarted its random-number stream, making the target weight vector equal to the first support example. That invalidated the near-perfect high-dimensional linear baseline. The generator has been repaired and these measurements rerun with independent target weights.*

![Predictions from the softmax smoother and exponential-kernel ridge solve on five synthetic examples](/research/metarepicl/silent_failure_demo.png)

The [saved examples](https://github.com/fxcawley/MetaRepICL/blob/main/figures/silent_failure/silent_failure_results.json), with 32 support points and seed 42, report:

| Regime | Softmax RMSE | Exponential KRR RMSE | Linear ridge RMSE | Softmax rank corr. $\rho$ |
|---|---|---|---|---|
| Reference ($\tau=1$, $p=8$) | 1.63 | 5.97 | 0.067 | 0.65 |
| High dimension ($p=64$) | 8.43 | 7.81 | 4.218 | 0.46 |
| Low temperature ($\tau=0.05$) | 1.82 | $1.53 \times 10^{24}$ | 0.067 | 0.65 |
| Ill-conditioned ($\kappa=500$, $\tau=0.5$) | 4.52 | $6.82 \times 10^{12}$ | 0.069 | 0.88 |

At $p=64$, softmax's RMSE of 8.43 exceeds the 7.81 obtained by predicting zero. The corrected linear baseline has RMSE 4.218, compared with the earlier 0.087. In the ill-conditioned example, softmax's rank correlation is now 0.88; the earlier collapse to 0.24 is not reproduced. The exponential-kernel reference is severely ill-conditioned in the low-temperature and ill-conditioned cases, so a small RMSE ratio against it is not a useful success criterion.

The dimension sweep draws unnormalized Gaussian features while keeping $\tau$ fixed, so increasing $p$ also changes the scale of the attention logits. It does not isolate dimension from kernel bandwidth, and it does not support the earlier explanation that the weights become uniform because inner products approach zero.

The [correction record](https://github.com/fxcawley/MetaRepICL/blob/main/docs/experiments/silent_failure.md) links the original values, corrected data, and regression tests. The previous interpretation of these examples as evidence for silent failures in trained softmax transformers is withdrawn.

## The coordinate-permutation control

The original training generator used diagonal covariances with a fixed variance ordering: coordinate 0 always had the largest variance. This allowed the transformer to specialize its input scaling to particular coordinate positions. A test of the solver interpretation must change that ordering while preserving the regression problem's spectrum.

The October 2026 [basis-dependence experiment](https://github.com/fxcawley/MetaRepICL/blob/main/docs/experiments/basis_dependence.md) does this. At $\kappa=500$, the 24-layer model's mean squared error is about $3\times$ the ridge baseline on the training basis and about $69{,}000\times$ after a random coordinate permutation. CG's predictions are invariant to this permutation. The original model's agreement with CG on the training distribution therefore failed to predict its behavior under this control.

Retraining the same architecture with a random covariance basis per problem largely removes the permutation sensitivity while preserving accuracy on the original task distribution. Further tests still find errors under changes to the eigenvalue spectrum. The controls establish dependence on the training distribution's coordinate ordering; they leave a general algorithmic account of the retrained model open.

## Where this leaves the project

The project closed in October 2026, with the earlier CG-class interpretation withdrawn. The coordinate dependence is consistent with prior work on regression transformers, including Bordelon, Letey, and Pehlevan (2025); Fu et al. (2023) randomized the covariance basis in their experiments to avoid this dependence.

The [experiment record](https://github.com/fxcawley/MetaRepICL/blob/main/ACTION_PLAN.md) retains the predictions, controls, and failed predictions. The constructive side remains a collection of numerical implementations and proof sketches, with the formal gaps described in the first post.
