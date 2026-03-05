---
title: "LoRAMBo: Fighting LoRA Memory Bottlenecks with Optimized Rank Selection"
tags:
  - "deep-learning"
  - "machine-learning"
  - "language-models"
  - "optimization"
  - "neurips"
date: 2024-12-01
venue: ICLR Workshop 2025
authors:
  - name: "Liam Cawley"
    url: "https://cawleyl.github.io"
excerpt: Low-Rank Adaptation (LoRA) efficiently fine-tunes large pre-trained language models through low-rank weight updates, significantly reducing memory usage compared to full fine-tuning. However, the problem of how to optimally allocate low-rank parameters across model layers remains challenging. This paper presents an extended theoretical framework that unifies classical matrix approximation perspectives with data- and curvature-aware approaches, developing both offline and online rank-allocation algorithms with near-optimality guarantees.
selected: true
priority: 1
links:
  - name: "paper"
    url: "/research/lorambo/lora_master.pdf"
  - name: "code"
    url: "https://github.com/cawley/lorambo"
---

# LoRAMBo: Fighting LoRA Memory Bottlenecks Through Optimized Rank Selection

## Introduction

Low-Rank Adaptation (LoRA) has emerged as a powerful technique for efficient fine-tuning of large language models. However, determining the optimal allocation of low-rank parameters across model layers remains a significant challenge. This research presents a comprehensive theoretical framework for optimizing rank selection in LoRA, leading to improved memory efficiency without compromising model performance.

## Key Innovations

Our work unifies multiple theoretical perspectives to create a robust framework for LoRA rank selection:

1. **Classical Matrix Approximation**: We leverage the Eckart-Young-Mirsky theorem to establish fundamental error bounds for low-rank approximations.

2. **Curvature-Aware Allocation**: We introduce Hessian-based sensitivity measures to ground "layer importance" in second-order optimization theory.

3. **Data-Dependent Optimization**: Novel data-weighted norms provide tighter approximation bounds when the data manifold resides in a low-rank subspace.

4. **Adaptive Online Algorithm**: We develop an iterative rank-allocation strategy with proven near-optimality guarantees.

## Theoretical Framework

### Matrix Approximation Foundations

At the core of LoRA lies the weight update equation:

```python
def lora_update(W, A, B):
    """
    W: Original weight matrix (d x k)
    A: Low-rank factor (d x r)
    B: Low-rank factor (r x k)
    r: Rank of the update (r << min(d,k))
    """
    return W + torch.matmul(A, B)
```

The optimal rank allocation follows our derived formula:

```python
def optimal_rank_allocation(layer_sensitivity, dim_d, dim_k, total_budget):
    """Calculate optimal rank for each layer based on sensitivity and dimensions"""
    r_i = (total_budget / L) * (
        (layer_sensitivity**0.5 * (dim_d + dim_k)**-0.5) / 
        sum(s**0.5 * (d + k)**-0.5 for s, d, k in layer_params)
    )
    return int(round(r_i))
```

### Hessian-Based Sensitivity Analysis

We compute layer sensitivity using Hessian approximations:

```python
def compute_hessian_sensitivity(layer, data_batch):
    """Estimate layer sensitivity via Hessian trace approximation"""
    def hvp(v):  # Hessian-vector product
        grad = torch.autograd.grad(loss, layer.parameters(), create_graph=True)
        return torch.autograd.grad(sum((g * v).sum() for g in grad), 
                                 layer.parameters())
    
    # Power iteration to approximate largest eigenvalue
    v = torch.randn_like(layer.weight)
    for _ in range(num_power_iterations):
        v = hvp(v)[0]
        v = v / v.norm()
    
    return v.norm()  # Approximates Tr(H) or ||H||_op
```

## Implementation Details

### Online Rank Allocation Algorithm

Our adaptive rank selection process:

```python
class LoRAMBoOptimizer:
    def __init__(self, model, total_budget):
        self.model = model
        self.budget = total_budget
        self.current_ranks = {l: 0 for l in model.layers}
    
    def update_ranks(self, loss_improvement_threshold=1e-4):
        """Iteratively allocate ranks to layers with highest benefit"""
        while self.used_budget < self.budget:
            benefits = []
            for layer in self.model.layers:
                if self.can_increment_rank(layer):
                    delta = self.estimate_improvement(layer)
                    benefits.append((delta, layer))
            
            if not benefits or max(b[0] for b in benefits) < loss_improvement_threshold:
                break
                
            best_layer = max(benefits, key=lambda x: x[0])[1]
            self.increment_rank(best_layer)
```

## Experimental Results

Our approach demonstrates significant improvements across various tasks:

### GLUE Benchmark Performance

| Model | Task | Accuracy | Memory (MB) |
|-------|------|----------|-------------|
| RoBERTa-base + Uniform LoRA | QNLI | 89.32 | 5.58 |
| RoBERTa-base + LoRAMBo | QNLI | 89.45 | 6.21 |
| T5-base + Uniform LoRA | SST-2 | 90.82 | 7.74 |
| T5-base + LoRAMBo | SST-2 | 92.58 | 8.41 |

### WikiText-103 Results

| Method | Pmax=12M PPL | Pmax=24M PPL |
|--------|--------------|--------------|
| Uniform LoRA | 26.4 | 25.1 |
| LoRAMBo | 24.9 | 23.8 |

## Citation

```bibtex
@article{cawley2024lorambo,
  title={LoRAMBo: Fighting LoRA Memory Bottlenecks With Optimized Rank Selection},
  author={Cawley, Liam},
  journal={arXiv preprint arXiv:2024.xxxxx},
  year={2024}
}
```
