---
title: "nanoSandbox"
tags:
  - "distributed-training"
  - "infrastructure"
  - "nanoGPT"
  - "kubernetes"
date: 2025-02-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A minimal distributed training sandbox for nanoGPT. Experiments with MIG partitioning, NCCL collectives, Kubernetes orchestration, and mixed-precision training on small-scale hardware."
selected: false
priority: 6
links:
  - name: "code"
    url: "https://github.com/fxcawley/nanoSandbox"
---

# nanoSandbox

## Purpose

Production distributed training frameworks (Megatron-LM, DeepSpeed, FSDP) are complex enough that it is difficult to reason about what any single component is doing. This project strips the stack down to its essentials: nanoGPT's training loop, PyTorch DDP, and raw NCCL, running on a small cluster orchestrated by Kubernetes.

The goal is not to train a useful model. It is to build intuition for the infrastructure primitives by working with them directly, at a scale where every gradient synchronization and memory allocation is visible.

## Components

**MIG (Multi-Instance GPU).** NVIDIA's Multi-Instance GPU partitions a single A100 into isolated GPU instances, each with its own memory and compute. We use MIG to simulate multi-GPU training on a single card --- useful for testing DDP logic without needing multiple physical GPUs, and for understanding the performance implications of memory bandwidth partitioning.

**NCCL collectives.** All-reduce, reduce-scatter, and all-gather are the building blocks of gradient synchronization. We instrument the training loop to log per-collective latency and bandwidth utilization, and experiment with different algorithmic choices (ring vs. tree all-reduce) to understand their scaling behavior.

**Kubernetes orchestration.** Training jobs run as StatefulSets with RDMA-capable networking (where available). The manifests handle node affinity, GPU resource requests, and checkpoint storage on persistent volumes. The emphasis is on understanding pod scheduling and inter-node communication rather than on high-availability production patterns.

**Mixed precision.** FP16 and BF16 training with dynamic loss scaling. We profile the memory and throughput differences between precision modes and document the cases where FP16 loss scaling fails (gradient underflow at low learning rates).

## Takeaway

The single most important thing this project clarified is that distributed training performance is dominated by communication, not compute. On a small cluster, the ratio of time spent in NCCL collectives to time spent in forward/backward passes is surprisingly high, and most "optimization" at this scale is really about hiding communication latency behind compute.
