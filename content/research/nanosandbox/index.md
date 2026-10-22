---
title: "nanoSandbox"
tags:
  - "distributed-training"
  - "infrastructure"
  - "nanoGPT"
  - "kubernetes"
date: 2024-05-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A nanoGPT notebook and deployment notes for a single Linux host with three A10 GPUs. The corrected CPU smoke configuration has been run; distributed-scaling and collective-performance results are not part of the retained record."
selected: false
priority: 6
links:
  - name: "code"
    url: "https://github.com/fxcawley/nanoSandbox"
---

nanoSandbox is a small environment for inspecting nanoGPT training and launch configurations. The public repository contains a Colab companion and deployment notes. The notes describe one Linux host with three physical NVIDIA A10 GPUs, with either one multi-GPU pod or three single-GPU pods.

The container builds and Kubernetes manifests referenced by the earlier README are not in the checkout. Those instructions have been replaced with an account of the available notebook and the documented deployment design.

## Notebook repairs

The optional DDP cell originally launched two CUDA workers whenever it detected any GPU. On a one-GPU VM, the second worker has no distinct device. The cell now requires two visible GPUs and sets gradient accumulation to a multiple of the world size.

The execution cells also mixed notebook Python with shell heredoc syntax. They now use ordinary Python subprocess calls. The setup retains the runtime's installed PyTorch build, and the CPU check explicitly selects float32 and disables compilation.

## What was run

The corrected CPU configuration was executed against Tiny Shakespeare using a two-layer, two-head model with embedding width 64, block size 128, and batch size 16. Training and evaluation completed through step 50. The [validation record](/research/nanosandbox/smoke-results.json) includes the upstream nanoGPT commit, software versions, configuration, and recorded losses.

The GPU-count guard was checked for zero, one, and two visible devices. A two-GPU training run was not performed on this machine. There are no retained measurements here of MIG partitioning, RDMA, precision-mode trade-offs, or NCCL collective performance, so the earlier claim that communication dominated this setup is withdrawn.
