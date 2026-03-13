---
title: "Phased Array Calibration via Metaheuristic and Learned Optimizers"
tags:
  - "optimization"
  - "phased-arrays"
  - "neural-networks"
  - "metaheuristics"
date: 2023-07-01
venue: "EMAG Technologies, Inc."
authors:
  - name: "Liam Cawley"
  - name: "Gabe Ronan"
excerpt: "Calibration of Anokiwave phased array beamformers by searching over phase-shift and attenuator configurations. We compare metaheuristic search (PSO, GA, simulated annealing), gradient-boosted regressors, reinforcement learning, and a CNN-based predictor."
selected: false
priority: 3
links: []
---

# Phased Array Calibration via Metaheuristic and Learned Optimizers

## Problem

A phased array antenna steers its beam by adjusting per-element phase shifts and attenuator settings. For an $N$-element Anokiwave AWS-0103 array, the mapping from control parameters to far-field beam pattern is nonlinear, noisy, and expensive to evaluate: each candidate configuration requires a physical measurement cycle through the beamformer, an SDR digitizer, and back.

The calibration task is to find the configuration that produces a target beam pattern. Classical gradient methods are inapplicable because no closed-form model of the system exists; each function evaluation costs real wall-clock time on hardware.

## Approaches

**Metaheuristic search.** We implemented particle swarm optimization (PSO), genetic algorithms (GA), simulated annealing, and a quantum-inspired annealing variant. These methods treat the calibration as black-box optimization. The main engineering challenge is amortizing the cost of hardware-in-the-loop evaluations --- we added caching, parallel evaluations via multithreading, and warm-starting from previous calibration runs.

**Supervised learning.** Gradient-boosted models (XGBoost, random forests) trained on historical (configuration, measurement) pairs. These models achieve reasonable interpolation accuracy but struggle to extrapolate, particularly when the array is reconfigured or environmental conditions change.

**CNN predictor.** We encode the array state as a 2D image (one pixel per element, channels for phase and attenuation) and train a convolutional network to predict the resulting beam pattern. The predicted pattern is then used as a differentiable surrogate for gradient-based optimization. This approach outperforms the tabular models on out-of-distribution configurations.

## Outcome

The metaheuristic methods converge reliably but slowly; the CNN surrogate converges faster once trained but requires a substantial data collection phase. In practice, the best strategy is a two-phase approach: collect an initial dataset with PSO, train the surrogate, then fine-tune with surrogate-guided search. The key bottleneck throughout is measurement throughput, not compute.
