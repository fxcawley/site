---
title: "LoRAMBo: Fighting LoRA Memory Bottlenecks with Optimized Rank Selection"
tags:
  - "deep-learning"
  - "machine-learning"
  - "language-models"
  - "optimization"
date: 2024-06-01
venue: "Working note"
authors:
  - name: "Liam Cawley"
    url: "https://cawley.dev"
excerpt: "A working note on allocating LoRA ranks under a parameter budget. The corrected derivation and reproducible matrix tests establish properties of a weighted approximation problem; the earlier unverified model-performance tables are withdrawn."
selected: true
priority: 1
links:
  - name: "paper"
    url: "/research/lorambo/lora_master.pdf"
  - name: "code"
    url: "/research/lorambo/verify_allocation.py"
  - name: "source"
    url: "/research/lorambo/lora_master.tex"
---

LoRA trains low-rank updates to a model's weights. For a layer with dimensions $d_i\times k_i$, a rank-$r_i$ adapter stores $r_i(d_i+k_i)$ parameters. This note asks how to allocate those ranks under a total parameter budget.

The earlier draft's GLUE, WikiText-103, and ImageNet tables are withdrawn because they are not backed by verified runs. The revised paper repairs the mathematical formulation and includes reproducible checks of the allocation code. It makes no claim of improved model accuracy, perplexity, or peak training memory.

## A weighted approximation problem

Let $D_i$ be a specified target update and let $G_i,A_i$ be positive-definite weighting matrices. The approximation error for an adapter $U_iV_i$ is

$$
\left\|G_i^{1/2}(D_i-U_iV_i)A_i^{1/2}\right\|_F^2.
$$

For fixed weights and rank, truncated SVD of $G_i^{1/2}D_iA_i^{1/2}$ gives an optimum of this surrogate. The discarded squared singular values give its error. Estimating a useful target update and curvature metric during actual fine-tuning remains a separate problem.

## What needed correction

Choosing rank increments by gain per parameter can fail when layer costs differ. With costs 2 and 3, gains 3 and 4, and budget 3, this greedy rule chooses gain 3 while the feasible optimum is 4. Extending the example to a second layer with cost and gain $B$ makes the ratio $3/B$, so the rule has no general constant-factor guarantee. The earlier near-optimality and $(1-1/e)$ claims did not hold for the stated allocator.

The corrected implementation provides an exact dynamic program for the separable integer-budget problem. The paper also retains the gradient term and curvature-approximation error in its local loss bound, uses a symmetric operator for spectral estimation, and treats LoRA factor training as a nonconvex problem in factor coordinates.

## Verified checks

The [verification script](/research/lorambo/verify_allocation.py) reproduces the greedy counterexamples, checks the weighted SVD identity, and compares the dynamic program against exhaustive enumeration on 100 small generated instances. The [saved results](/research/lorambo/allocation_checks.json) record those checks. They establish the behavior of the specified surrogate and allocator; a comparison against existing LoRA methods on trained models remains open.

The [earlier PDF](/research/lorambo/lora_master_legacy.pdf) is retained as an archive with withdrawn experimental claims. The main paper link points to the corrected working note.
