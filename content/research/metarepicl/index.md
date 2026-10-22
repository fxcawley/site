---
title: "MetaRepICL: In-Context Learning as Kernel Regression on Learned Representations"
tags:
  - "in-context-learning"
  - "kernel-methods"
  - "transformers"
  - "representation-learning"
date: 2026-01-15
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "Regression transformers matched iterative solvers on their training distribution but failed under coordinate permutations. The controls exposed dependence on a fixed ordering of feature variances and overturned the original CG identification claim."
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/fxcawley/MetaRepICL"
---

MetaRepICL began by asking whether kernel regression could describe a transformer's in-context computation. The project moved from hand-written numerical constructions to trained regression transformers, then to controls testing whether the proposed algorithm predicted behavior beyond the training distribution.

## Trained models and solver comparisons

The experiments trained small transformers on synthetic linear regression tasks with controlled feature covariances. A 12-layer model used ten features; a larger 24-layer model used twenty. Separately trained linear readouts produced query predictions from intermediate layers, which were compared with iterative least-squares solvers.

On the original task distribution, conjugate gradient (CG), preconditioned CG, and preconditioned gradient descent fit those readouts better than the reference vanilla GD trajectory. This agreement initially motivated a CG-class interpretation. The later controls contradicted it.

## Changing the coordinate basis

The training generator used diagonal covariances with a fixed variance ordering: coordinate zero always had the largest variance. A model could exploit that ordering to rescale particular inputs.

The [basis-dependence experiment](https://github.com/fxcawley/MetaRepICL/blob/main/docs/experiments/basis_dependence.md) changed the coordinate basis while retaining the covariance spectrum. For the twenty-feature model at $\kappa=500$, the recorded ratios of model MSE to the reference ridge MSE were approximately:

| Input basis | Model MSE / reference ridge MSE |
|---|---|
| Training coordinates | $3\times$ |
| Random coordinate permutation | $69{,}000\times$ |
| Random rotation | $72{,}000\times$ |

The reference uses ridge coefficient $\lambda=0.1$. CG predictions are invariant to a coordinate permutation applied consistently to support and query inputs. The trained model's failure under that transformation rules out the original solver interpretation for this model.

Retraining with a random covariance basis per task substantially reduced the permutation sensitivity while preserving performance on the original task distribution. Tests with different eigenvalue spectra still produced degradation. Removing the fixed coordinate ordering addressed one dependence in the training data.

## Construction sketches and corrected numerical checks

The constructive work implements CG and attention-style matrix-vector products in NumPy. The mapping to transformer blocks remains a proof sketch, with unresolved details concerning masking, numerical precision, and architecture. A working numerical solver alone does not establish that a trained network implements it.

A separate comparison of fixed kernel estimators contained a random-number error: restarting the generator made the regression weight vector equal to the first support example. This artificially strengthened the linear baseline. The generator has been corrected, the comparison rerun, and regression tests now check the independence of target weights and the numerical stability of softmax. The [correction record](https://github.com/fxcawley/MetaRepICL/blob/main/docs/experiments/silent_failure.md) includes the revised measurements. These numerical comparisons contain no trained transformer.

The project closed in October 2026 with the original CG identification claim withdrawn. The coordinate dependence is consistent with prior work on regression transformers; it is not presented as a new general result about language models. The [experiment log](https://github.com/fxcawley/MetaRepICL/blob/main/ACTION_PLAN.md) records the controls and failed predictions, and the [blog thread](/posts/metarepicl-findings) gives a longer account.
