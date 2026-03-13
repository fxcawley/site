---
title: "MetaRepICL"
tags:
  - "in-context-learning"
  - "kernel-methods"
  - "transformers"
  - "representation-learning"
date: 2025-01-15
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "Does a transformer performing in-context learning implement kernel ridge regression on learned hidden representations? We investigate the mechanistic relationship between ICL and KRR through the lens of learned feature maps."
selected: true
priority: 2
links:
  - name: "code"
    url: "https://github.com/cawley/MetaRepICL"
---

# MetaRepICL

## Motivation

In-context learning (ICL) allows transformers to adapt to new tasks at inference time without gradient updates. Recent theoretical work has drawn connections between ICL and kernel ridge regression (KRR), but these analyses typically assume linear attention or single-layer architectures.

We ask: **does a trained transformer's ICL mechanism implement KRR on learned hidden representations?**

## Approach

We study this question empirically by:

1. Training small transformers on synthetic regression tasks where the ground truth function class is known
2. Extracting the hidden representations at each layer
3. Comparing the transformer's predictions against KRR applied to those learned representations
4. Measuring alignment between the implicit kernel induced by the transformer and standard kernels (RBF, polynomial, neural tangent)

## Key Observations

The transformer's ICL behavior closely mirrors KRR when:
- The representations are taken from intermediate layers (not the final layer)
- The task distribution has low intrinsic dimensionality
- The context length is sufficient relative to the task complexity

The alignment breaks down for out-of-distribution tasks, suggesting the learned kernel is specialized to the training distribution rather than implementing a universal regression algorithm.

## Implications

This work connects two bodies of theory — meta-learning and kernel methods — through the concrete mechanism of learned representations. Understanding when and why ICL resembles KRR informs both interpretability (what is the model actually computing?) and capability evaluation (when should we expect ICL to succeed or fail?).
