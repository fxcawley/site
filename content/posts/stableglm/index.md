---
title: "StableGLM: When Many Models Fit, Which Explanations Survive?"
tags: ["interpretability", "rashomon-sets", "generalized-linear-models", "stability"]
date: 2025-01-20
excerpt: The Rashomon effect means many parameter vectors achieve nearly the same loss. StableGLM characterizes this set for GLMs and asks which feature importance claims are stable across it.
thread: "stableglm"
threadTitle: "StableGLM"
threadOrder: 1
---

Most interpretability work treats the fitted model as given and asks what it has learned. The implicit assumption is that the model is, in some meaningful sense, *the* model, the one that best explains the data, and whose internal structure therefore reflects the data's structure. But for many practical problems, especially those involving correlated or noisy features, many parameter vectors achieve nearly the same loss. This is the Rashomon effect, named by Breiman (2001) after the Kurosawa film in which several witnesses give contradictory but internally consistent accounts of the same event.

The difficulty this creates for interpretability is straightforward: if a feature appears important under one near-optimal model but irrelevant under another, the importance ranking is an artifact of which particular optimum the solver happened to find. It is a property of the optimization trajectory, not of the data.

## Why standard uncertainty quantification is not enough

The usual response to uncertainty about a fitted model is to compute bootstrap confidence intervals: resample the data, refit the model, and report the variability of the estimates. But bootstrap CIs address a specific question, namely how much the result depends on the particular sample of data that was collected. They assume that the model structure is correct and that only sampling noise matters. The Rashomon set addresses a different question: how much the result depends on which model was selected from the pool of near-optimal candidates. These are distinct sources of uncertainty, and the second can dominate even when the first is small.

Fisher, Rudin, and Dominici (2019) formalize this distinction through Model Class Reliance, showing that a variable's importance can range from strongly positive to strongly negative across models that all achieve nearly the same loss. A bootstrap interval around a single model's importance score will be tight if the sample is large, but it will not reveal that an equally good model assigns the opposite sign to the same feature. The Rashomon interval captures this model selection ambiguity that bootstrap intervals, by construction, cannot see.

The practical consequences extend beyond academic interest. In domains where models inform consequential decisions (credit scoring, clinical risk stratification, recidivism prediction) the Rashomon set has a direct implication for algorithmic fairness. If the set is large, there may exist a near-optimal model that relies less on ethically problematic features than the one the solver returned. Rudin (2019) argues that in such settings, the existence of interpretable and fair alternatives within the Rashomon set means that deploying a black-box model is a choice, not a necessity. The set makes that choice visible: if a less biased model with comparable loss exists, the decision to use the biased one requires justification.

There is also a subtlety about how these two kinds of uncertainty scale with data. Bootstrap CIs shrink as $n$ grows, because sampling noise decreases. Model multiplicity does not necessarily shrink, because it depends on the geometry of the loss surface rather than on the variance of the estimator. Semenova, Rudin, and Parr (2022) show that the Rashomon set can remain large even with abundant data if the underlying phenomenon is genuinely underspecified, that is, if the features and model class do not uniquely determine a mapping from inputs to outputs. In such cases, collecting more data resolves sampling uncertainty but leaves model selection ambiguity intact. A practitioner who monitors only bootstrap CIs will see increasing confidence in a result whose foundations remain arbitrary.

## The toolkit

StableGLM is a toolkit for making this problem concrete in the setting of generalized linear models. Rather than examining a single fitted $\hat\theta$, it characterizes the full $\varepsilon$-Rashomon set, the set of all parameter vectors whose loss is within $\varepsilon$ of optimal, and computes interpretability metrics over that set. The question shifts from "what did this model learn?" to "what do all near-optimal models agree on?"

## The geometry of near-optimality

For a GLM with convex loss $L(\theta) = \frac{1}{n}\sum_i \ell(y_i, x_i^\top\theta) + \frac{\lambda}{2}\lVert\theta\rVert^2$, the $\varepsilon$-Rashomon set is

$$\mathcal{R}_\varepsilon = \bigl\{\theta : L(\theta) \leq L(\hat\theta) + \varepsilon\bigr\}.$$

Because the loss is convex, this is a convex sublevel set. Near the optimum, a second-order Taylor expansion gives an ellipsoidal approximation governed by the Hessian $H = \nabla^2 L(\hat\theta)$:

$$\mathcal{E}_\varepsilon = \bigl\{\hat\theta + \Delta : \Delta^\top H \Delta \leq 2\varepsilon\bigr\}.$$

The ellipsoid is analytically tractable. For any linear functional $s^\top\theta$ (for instance, a single coefficient, or a linear combination corresponding to a prediction at a particular point) the extrema over $\mathcal{E}_\varepsilon$ have closed forms involving $\lVert s \rVert_{H^{-1}}$. For exact computations over the true (non-ellipsoidal) Rashomon set, the toolkit uses hit-and-run sampling with a membership oracle.

The shape of the ellipsoid is informative in itself. Directions in parameter space along which the Hessian has small eigenvalues correspond to "flat" directions of the loss landscape, directions in which the model can change substantially without incurring much additional loss. These are the directions along which explanations are least stable.

## What gets computed

The toolkit produces several quantities, each measuring a different aspect of explanation stability:

**Prediction bands.** For each data point, the range of predictions $[p_i^{\min}, p_i^{\max}]$ across all models in $\mathcal{R}_\varepsilon$. Points with wide bands are ambiguous in a precise sense: the model's output depends on which near-optimal parameter vector was selected.

**Variable Importance Clouds.** The range of each coefficient $\theta_j$ across the Rashomon set. A feature whose coefficient changes sign within $\mathcal{R}_\varepsilon$ has unstable importance: it could plausibly be either helpful or harmful, depending on the model.

**Model Class Reliance.** The range of permutation-based feature importance scores across the set. This addresses a slightly different question: not whether the coefficient is stable, but whether the feature's contribution to predictive accuracy is stable.

**Predictive multiplicity metrics.** Ambiguity (the fraction of points whose predicted label changes across $\mathcal{R}_\varepsilon$), discrepancy (maximum pairwise disagreement), and Rashomon capacity (a measure of the effective volume of the set).

## Calibrating the tolerance

The parameter $\varepsilon$ controls the size of the Rashomon set. Too small and the set contains only models indistinguishable from $\hat\theta$; too large and it admits models that are meaningfully worse. The toolkit supports three calibration strategies: a proportional slack ($\varepsilon = \rho \cdot L(\hat\theta)$), a likelihood-ratio inversion ($2n\varepsilon \approx \chi^2_{d,1-\alpha}$), and a high-dimensional correction for settings where $d/n$ is not negligible.

## Connection to the broader theme

This project is part of a broader interest in what I have been calling self-models — understanding a model's own computations, behaviors, and limitations, rather than just its predictions. StableGLM addresses this from the perspective of *explanation multiplicity*: when the model class admits many near-optimal solutions, how much of what we claim to have learned from the model is actually determined by the data?

The companion post on [MetaRepICL](/posts/metarepicl) approaches a related question from the opposite direction: rather than asking whether explanations are stable across models, it asks whether our mechanistic understanding of what a model *computes* is stable across input distributions. Both projects share the premise that understanding a model requires understanding the boundaries of that understanding.
