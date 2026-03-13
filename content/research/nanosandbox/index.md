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
excerpt: A small distributed training setup for nanoGPT to play around with MIG, NCCL, k8s, and other infrastructure primitives for multi-GPU and multi-node language model training.
selected: false
priority: 6
links:
  - name: "code"
    url: "https://github.com/cawley/nanoSandbox"
---

# nanoSandbox

A minimal distributed training sandbox built around nanoGPT. The goal is to provide a small, hackable environment for experimenting with GPU infrastructure primitives without the overhead of full-scale training frameworks.

## Scope

- **MIG (Multi-Instance GPU)**: Partitioning a single GPU into isolated instances for concurrent workloads
- **NCCL**: Collective communication primitives for multi-GPU gradient synchronization
- **Kubernetes**: Container orchestration for multi-node training jobs
- **Mixed precision**: FP16/BF16 training with loss scaling

## Design

The setup wraps nanoGPT's training loop with minimal distributed infrastructure:

```python
# DDP initialization
dist.init_process_group(backend='nccl')
local_rank = int(os.environ['LOCAL_RANK'])
torch.cuda.set_device(local_rank)

model = GPT(config)
model = DDP(model, device_ids=[local_rank])
```

The k8s manifests define training jobs as stateful sets with RDMA-capable networking for low-latency inter-node communication.

## Notes

This is a learning sandbox, not a production training framework. The emphasis is on understanding the infrastructure stack from bare metal up through the orchestration layer.
