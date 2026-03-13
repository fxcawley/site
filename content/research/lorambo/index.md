---
title: "LoRAMBo: Fighting LoRA Memory Bottlenecks with Optimized Rank Selection"
tags:
  - "deep-learning"
  - "machine-learning"
  - "language-models"
  - "optimization"
date: 2024-12-01
venue: ICLR Workshop 2025
authors:
  - name: "Liam Cawley"
    url: "https://cawley.dev"
excerpt: "A theoretical framework unifying classical matrix approximation with curvature-aware rank allocation for LoRA. We derive offline and online algorithms with near-optimality guarantees for distributing low-rank capacity across layers."
selected: true
priority: 1
links:
  - name: "paper"
    url: "/research/lorambo/lora_master.pdf"
  - name: "code"
    url: "https://github.com/cawley/lorambo"
---

# LoRAMBo: Fighting LoRA Memory Bottlenecks Through Optimized Rank Selection

## Problem

LoRA fine-tunes large language models by injecting trainable low-rank updates $\Delta W = AB^\top$ at each layer, dramatically reducing the number of trainable parameters. The standard practice assigns a uniform rank $r$ to every layer. This is wasteful: layers vary substantially in how much they benefit from additional rank, and the parameter budget $\sum_i r_i(d_i + k_i)$ is finite.

The question is: given a total parameter budget, how should rank be distributed across layers to minimize task loss?

## Approach

We develop three complementary views of this allocation problem, then unify them.

**Approximation-theoretic.** The Eckart--Young--Mirsky theorem gives the optimal rank-$r$ approximation to a matrix under Frobenius or operator norm. Treating each layer's ideal weight update $\Delta W_i^*$ as known, the per-layer approximation error decomposes as a sum of discarded singular values. The optimal allocation minimizes total error subject to a budget constraint --- a variant of the classical water-filling problem.

**Curvature-aware.** Not all approximation errors are equal: a rank deficit in a high-curvature layer incurs more loss than the same deficit in a flat region. We replace the Frobenius norm with a data-dependent norm weighted by the layer-wise Hessian, $\lVert \Delta W \rVert_H^2 = \mathrm{tr}(\Delta W^\top H_i \Delta W)$. The resulting allocation sends more rank to layers where the loss landscape is sharply curved.

**Online adaptive.** In practice neither the optimal updates $\Delta W_i^*$ nor the Hessians are known in advance. We formulate a greedy online algorithm that, after each training step, estimates the marginal benefit of incrementing each layer's rank by one and allocates accordingly. We show this greedy procedure achieves a $(1 - 1/e)$-approximate solution to the submodular optimization problem.

## Results

The combined framework (offline curvature-aware initialization + online adaptation) consistently outperforms uniform-rank LoRA under matched parameter budgets.

| Setting | Uniform LoRA | LoRAMBo |
|---------|-------------|---------|
| RoBERTa-base / QNLI | 89.32 | 89.45 |
| T5-base / SST-2 | 90.82 | 92.58 |
| WikiText-103 PPL (12M params) | 26.4 | 24.9 |
| WikiText-103 PPL (24M params) | 25.1 | 23.8 |

The gains are largest when the budget is tight relative to the model size --- precisely the regime where LoRA is most useful. The curvature-aware term matters most in the first few hundred steps; thereafter the online algorithm dominates.

## Takeaway

Uniform rank allocation is a surprisingly strong baseline, but it leaves performance on the table. The key insight is that rank allocation is a resource-allocation problem with diminishing returns, and the right abstraction is submodular optimization over a matroid constraint. The practical algorithm is simple: maintain running estimates of per-layer sensitivity and reallocate periodically.
