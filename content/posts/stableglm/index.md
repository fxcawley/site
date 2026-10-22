---
title: "StableGLM: When Many Models Fit, Which Explanations Survive?"
tags: ["interpretability", "rashomon-sets", "generalized-linear-models", "stability"]
date: 2025-10-20
excerpt: The Rashomon effect means many parameter vectors achieve nearly the same loss. StableGLM characterizes this set for GLMs and asks which feature importance claims are stable across it.
thread: "stableglm"
threadTitle: "StableGLM"
threadOrder: 1
threadOverview: >-
  Auditing how coefficients and predicted labels vary among near-optimal GLMs.
  The thread develops the loss-set geometry and toolkit, then compares sampling
  and the quadratic approximation with exact optimization.
---

## The short version

When features are correlated or the signal is weak, many parameter vectors fit the data almost equally well, and they can disagree about which features matter. This can happen even when a regularized model has a unique optimum: the alternatives only need to fall within a chosen loss tolerance.

<RashomonSet />

This is the Rashomon effect, named by Breiman (2001) after the Kurosawa film of contradictory eyewitness accounts. [StableGLM](https://github.com/fxcawley/StableGLM) examines it in generalized linear models. The package is now published as `rashomon-py`; its entry point, `rashomon.audit(model, X, y)`, accepts a fitted scikit-learn linear or logistic regression model and reports which coefficient signs and predicted labels can change across the near-optimal set.

## Bootstrap intervals and the Rashomon set

Bootstrapping resamples the data, refits the estimator, and reports how much the estimates vary. A Rashomon analysis holds the data fixed and examines models within a specified loss tolerance. A narrow bootstrap interval can coexist with a wide range of coefficients across those models.

For an $\ell_2$-penalized GLM, these intervals are mathematically related. To second order, the Rashomon set is a highest-posterior-density region of the Laplace posterior under the prior implied by the penalty. The tolerance determines the region's posterior mass. Penalization also affects the bootstrap: it can hold coefficients close together across refits even along directions poorly determined by the data. Comparing interval widths therefore requires accounting for both the penalty and the tolerance.

The toolkit computes explicit alternatives: a model with a reversed coefficient sign, or one that assigns a different label to a particular row, while satisfying the loss constraint. The [benchmark post](/posts/stableglm-findings) compares these computations with sampling and the quadratic approximation.

The set may also contain a model that relies less on a problematic feature, at little cost in predictive performance. This possibility is relevant to Rudin's (2019) argument for interpretable models in consequential settings. The loss constraint supplies candidates; a fairness criterion still has to be specified and evaluated.

## The geometry of near-optimality

For a GLM with convex loss $L(\theta) = \frac{1}{n}\sum_i \ell(y_i, x_i^\top\theta) + \frac{\lambda}{2}\theta^\top M\theta$, where $M$ is diagonal with ones for penalized coefficients and zero for an unpenalized intercept, the $\varepsilon$-Rashomon set is

$$\mathcal{R}_\varepsilon = \bigl\{\theta : L(\theta) \leq L(\hat\theta) + \varepsilon\bigr\}.$$

Because the loss is convex, this is a convex sublevel set. Near the optimum, a second-order Taylor expansion gives an ellipsoidal approximation governed by the Hessian $H = \nabla^2 L(\hat\theta)$:

$$\mathcal{E}_\varepsilon = \bigl\{\hat\theta + \Delta : \Delta^\top H \Delta \leq 2\varepsilon\bigr\}.$$

When $H$ is positive definite, the range of any linear functional $s^\top\theta$ over the ellipsoid is $s^\top\hat\theta \pm \sqrt{2\varepsilon\,s^\top H^{-1}s}$. This gives coefficient ranges and ranges of the linear predictor in closed form. For logistic loss, the ellipsoid is a local approximation; `functional_range()` instead solves the constrained optimization problem over the true loss sublevel set. Hit-and-run sampling explores that set, but finite samples generally miss its extrema.

Small Hessian eigenvalues identify directions in which coefficients can move substantially with little increase in loss. Correlated features often produce such directions because changes in their coefficients can offset one another.

<FlatDirection />

## What gets computed

The toolkit reports:

**Prediction bands.** For each data point, a range of predictions $[p_i^{\min}, p_i^{\max}]$. The audit estimates these from sampled models, so the reported intervals can be narrower than the full ranges over $\mathcal{R}_\varepsilon$.

**Variable Importance Clouds.** The variation of each coefficient $\theta_j$ across the Rashomon set. A coefficient that changes sign has an unstable direction of association. The audit computes its extrema by convex optimization when the problem size allows, and labels sampled ranges when it uses them.

<SignFlipCloud />

**Model Class Reliance.** Following Fisher, Rudin, and Dominici (2019), this examines variation in permutation-based feature importance across the set. The implementation reports extrema over sampled models. A negative importance score means that permuting the feature improved the chosen evaluation score for that model; it does not establish that removing the feature and refitting would help.

**Predictive multiplicity metrics.** Ambiguity is the fraction of points whose label can change across $\mathcal{R}_\varepsilon$. A different model may account for each flip. Discrepancy asks how many labels a single competing model changes relative to the fitted model; the lower-level API also estimates maximum pairwise disagreement. The toolkit includes a volume diagnostic for the approximating ellipsoid.

## Calibrating the tolerance

The parameter $\varepsilon$ controls how much additional loss is acceptable. The audit defaults to one standard error of the cross-validated loss. It also accepts a proportional slack ($\varepsilon = \rho \cdot L(\hat\theta)$) and likelihood-ratio calibrations. For an unpenalized fit under the usual asymptotic assumptions, $2n\varepsilon = \chi^2_{d,1-\alpha}$ gives a joint confidence region; using $\chi^2_{1,1-\alpha}$ instead gives profile-likelihood intervals for individual coefficients.

Results should be reported with the tolerance. Whether the set shrinks as more data arrive depends on identifiability and on how $\varepsilon$ scales with sample size.

The companion post on [MetaRepICL](/posts/metarepicl) examines the stability of a different kind of explanation: an account of the algorithm a transformer implements, tested across input distributions.
