---
title: "Benchmarks, Tightness, and What the Data Says"
tags: ["interpretability", "rashomon-sets", "generalized-linear-models", "benchmarks", "predictive-multiplicity"]
date: 2026-03-15
excerpt: Comparing exact coefficient ranges and label-flip tests with sampling and the Hessian approximation on three classification datasets.
thread: "stableglm"
threadTitle: "StableGLM"
threadOrder: 2
threadTransition:
  label: "Compare against exact optimization"
  description: >-
    The geometric approximation and sampled summaries need a reference.
    The benchmarks compare them with exact coefficient ranges and label-flip
    tests, revising the earlier interpretation of sampling and interval widths.
---

The [initial post](/posts/stableglm) described the toolkit's design: characterize the set of near-optimal GLMs, then measure how much their coefficients and predictions can vary. The evaluation compares three ways of computing those quantities: constrained optimization over the loss sublevel set, hit-and-run sampling, and a Hessian-based ellipsoidal approximation.

*Updated October 2026 using the current `rashomon-py` evaluation. The earlier version treated sampled ranges as if they were exact extrema and described the ellipsoid as a certified outer bound. Both interpretations were incorrect.*

## Benchmark datasets

The evaluation fits scikit-learn $\ell_2$-regularized logistic regression on standardized features, choosing $C$ by five-fold cross-validation on log-loss. The three datasets below are Wisconsin Breast Cancer ($n = 569$, $d = 30$), German Credit ($n = 1{,}000$, $d = 61$), and a 5,000-row subsample of Adult Census ($d = 101$ after encoding). The selected values of $C$ are 1, 0.03, and 0.03, respectively.

At $\varepsilon = 0.03 \cdot L(\hat\theta)$, a 3% increase in the regularized loss, the [saved evaluation](https://github.com/fxcawley/StableGLM/blob/main/docs/_static/evaluation.json) reports:

| Dataset | Exact ambiguity | Sampled ambiguity | Ellipsoid estimate |
|---|---|---|---|
| Breast Cancer ($d = 30$) | 6.2% | 2.5% | 6.7% |
| German Credit ($d = 61$) | 82.9% | 41.7% | 84.8% |
| Adult Census ($d = 101$) | 67.8% | 14.8% | 72.6% |

<AmbiguityBars />

Ambiguity is the fraction of rows whose label can change across the set, using a probability threshold of 0.5. For each of 82.9% of German Credit rows, some near-optimal model can reverse the fitted label. A different model may be needed for each row; finding one model that changes many labels is a separate optimization problem.

The exact flip test minimizes loss subject to the row's logit being on the decision boundary, $x_i^\top\theta = 0$, and compares that loss with $L(\hat\theta)+\varepsilon$. The sampled calculation only checks the 2,000 models visited by the chain, so it gives a lower bound on ambiguity.

## Ellipsoid tightness

The ellipsoidal approximation replaces the true convex sublevel set $\mathcal{R}_\varepsilon$ with a quadratic approximation $\mathcal{E}_\varepsilon$ defined by the Hessian at the optimum. Linear-functional extrema over this ellipsoid have closed forms. For logistic loss, the true set can extend beyond the ellipsoid in some directions and fall short of it in others.

The earlier comparison divided ellipsoid interval widths by sampled interval widths and called the ratio "tightness." That confounded approximation error with the sampler's failure to find extreme points. At 3% tolerance, the median sampled coefficient range covers:

- **Breast Cancer:** 52% of the exact range.
- **German Credit:** 40% of the exact range.
- **Adult Census:** 19% of the exact range.

<TightnessVsDim />

The median ratios of ellipsoid width to exact width are 1.00, 1.00, and 0.96 on the same datasets. These medians conceal errors in individual coefficients and in the positions of interval endpoints. An accurate width does not ensure that an interval contains the true extremes. Coefficient signs should be checked using the constrained optimization result when it is affordable.

On Adult, the minimum effective sample size is only about 4 for 2,000 draws. The chain mixes poorly there, and its ranges and disagreement measurements substantially understate the variation in the set.

## Variable importance stability

At 3% tolerance, the exact coefficient ranges retain the fitted sign for 3 of 30 Breast Cancer features, 0 of 61 German Credit features, and 1 of 101 Adult features. For the other coefficients, the set contains parameter vectors on both sides of zero. These are statements about fitted associations under a specified loss tolerance.

Permutation importance requires a separate calculation: permute a feature and measure the change in a model's evaluation score. The toolkit estimates its range over sampled models. A negative value means that the permutation improved the score for that model on those data. The earlier claim that "no feature is indispensable" went beyond this measurement.

The earlier Bayesian comparison also used the wrong prior scaling. For an objective defined as mean loss plus $\lambda\lVert\theta\rVert^2/2$, the corresponding prior precision is $n\lambda$ on the penalized coefficients. The Laplace posterior covariance is $(nH)^{-1}$, and the half-width of coefficient $j$'s range over the quadratic Rashomon set is $\sqrt{2n\varepsilon}$ times its posterior standard deviation. Differences from bootstrap widths depend on the tolerance and the penalty; they do not measure an additional, independent source of uncertainty.

## Epsilon sensitivity

For the 30-feature Breast Cancer model, exact ambiguity is 2.8% at a 1% relative loss tolerance and 6.2% at 3%. The default cross-validation rule gives a much larger tolerance on this dataset, 26.3% of the optimal loss, with 27.6% ambiguity. The sets are nested, so ambiguity must be nondecreasing with $\varepsilon$.

<EpsilonSweep />

Regularization must be recorded as well. The audit reconstructs scikit-learn's logistic objective using $\lambda = 1/(Cn)$ with an unpenalized intercept. The lower-level `RashomonSet.C` uses a different convention, so passing the same numerical $C$ to both interfaces would define different sets.

## Scaling

In the evaluation, exact coefficient ranges take about 0.3 seconds at $d=10$ and up to 19 seconds on the Adult subsample ($n=5{,}000$, $d=101$). The exact flip test takes under a second on the Breast Cancer datasets and about 45 seconds on Adult. The audit chooses exact computations within configured cost limits and labels sampled quantities when it falls back to sampling.

## Reproducing the results

The package is available as `rashomon-py`. [`scripts/evaluate.py`](https://github.com/fxcawley/StableGLM/blob/main/scripts/evaluate.py) generates the benchmark measurements, and the [evaluation documentation](https://github.com/fxcawley/StableGLM/blob/main/docs/evaluation.md) records the preprocessing, tolerances, and comparisons with exact extrema. The tutorial's numerical claims are regenerated by a separate script and checked in CI.
