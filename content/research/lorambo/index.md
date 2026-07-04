---
title: "LoRAMBo: Fighting LoRA Memory Bottlenecks with Optimized Rank Selection"
tags:
  - "deep-learning"
  - "machine-learning"
  - "language-models"
  - "optimization"
date: 2024-11-01
venue: ICLR Workshop 2025
authors:
  - name: "Liam Cawley"
    url: "https://cawley.dev"
excerpt: "An undergraduate project (Nov 2024) framing LoRA rank allocation as a budgeted resource-allocation problem, with offline curvature-aware and online greedy algorithms. Added in retrospect with notes on where the original claims outrun the evidence."
selected: true
priority: 1
links:
  - name: "paper"
    url: "/research/lorambo/lora_master.pdf"
  - name: "code"
    url: "https://github.com/fxcawley/lorambo"
---

# LoRAMBo: Fighting LoRA Memory Bottlenecks Through Optimized Rank Selection

## Context

This is an undergraduate project, written in November 2024 and later submitted to an ICLR workshop. I am adding this note in retrospect because the original framing claimed more than the results support: the "near-optimality guarantees" hold only under assumptions that the experiments do not verify, and several of the reported improvements are within the range one might attribute to run-to-run variance. I have left the original numbers unchanged and flagged where the claims outrun the evidence.

LoRA (low-rank adaptation) is a method for fine-tuning large models cheaply. Instead of updating every weight, it adds a small trainable low-rank correction to each layer and freezes everything else, which reduces both the memory and the number of parameters that have to be stored per fine-tuned task. The question this project takes up is a narrow one: LoRA normally gives every layer the same amount of low-rank capacity, and it is not obvious that a uniform split is the best use of a fixed budget.

## Problem

LoRA fine-tunes large language models by injecting trainable low-rank updates $\Delta W = AB^\top$ at each layer, reducing the number of trainable parameters relative to full fine-tuning. The standard practice assigns a uniform rank $r$ to every layer. Layers may vary in how much they benefit from additional rank, and the parameter budget $\sum_i r_i(d_i + k_i)$ is finite, so a uniform split is not obviously optimal.

The question is: given a total parameter budget, how should rank be distributed across layers to minimize task loss?

## Approach

We develop three complementary views of this allocation problem, then unify them.

**Approximation-theoretic.** The Eckart--Young--Mirsky theorem gives the optimal rank-$r$ approximation to a matrix under Frobenius or operator norm. Treating each layer's ideal weight update $\Delta W_i^*$ as known, the per-layer approximation error decomposes as a sum of discarded singular values. The optimal allocation minimizes total error subject to a budget constraint --- a variant of the classical water-filling problem.

**Curvature-aware.** Not all approximation errors are equal: a rank deficit in a high-curvature layer incurs more loss than the same deficit in a flat region. We replace the Frobenius norm with a data-dependent norm weighted by the layer-wise Hessian, $\lVert \Delta W \rVert_H^2 = \mathrm{tr}(\Delta W^\top H_i \Delta W)$. The resulting allocation sends more rank to layers where the loss landscape is sharply curved.

**Online adaptive.** In practice neither the optimal updates $\Delta W_i^*$ nor the Hessians are known in advance. We formulate a greedy online algorithm that, after each training step, estimates the marginal benefit of incrementing each layer's rank by one and allocates accordingly. If the marginal-benefit function is assumed to be submodular, the standard analysis gives a $(1 - 1/e)$ approximation. That assumption is plausible for a diminishing-returns quantity but is not something the experiments here establish, so the guarantee should be read as a property of the idealized problem rather than of the trained models.

## Results

Under matched parameter budgets, the combined framework (offline curvature-aware initialization + online adaptation) matches or slightly exceeds uniform-rank LoRA on the settings tested.

| Setting | Uniform LoRA | LoRAMBo |
|---------|-------------|---------|
| RoBERTa-base / QNLI | 89.32 | 89.45 |
| T5-base / SST-2 | 90.82 | 92.58 |
| WikiText-103 PPL (12M params) | 26.4 | 24.9 |
| WikiText-103 PPL (24M params) | 25.1 | 23.8 |

The QNLI difference (89.32 vs 89.45) is small enough that I would not read much into it without repeated runs and variance estimates, which this project did not collect. The larger gaps on SST-2 and WikiText-103 are more suggestive, and they are largest when the budget is tight relative to the model size. In the runs measured, the curvature-aware term contributed most in the first few hundred steps, after which the online adjustment accounted for most of the difference; I did not test how sensitive that split is to the learning-rate schedule or the choice of tasks.

## Takeaway

Uniform rank allocation is a strong baseline, and the improvements from reallocation here are modest. The framing that seems worth keeping is that rank allocation is a resource-allocation problem with diminishing returns, which is why submodular optimization is a natural language for it. The practical version of the algorithm is simple: maintain running estimates of per-layer sensitivity and reallocate periodically. Whether the gains justify the added machinery over uniform LoRA is not something these experiments settle.
