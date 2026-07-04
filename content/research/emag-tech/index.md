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
excerpt: "A closed-loop calibration application for an active electronically scanned phased-array radar, optimizing 6-bit phase-shifter and attenuator states on Anokiwave AWS-0103 beamformers with metaheuristic search and a CNN surrogate, reaching a 6.5x reduction in beam-synthesis error over a Sample Matrix Inversion baseline."
selected: false
priority: 3
links: []
---

# Phased Array Calibration via Metaheuristic and Learned Optimizers

## Context

This work was done at EMAG Technologies, an RF and microwave engineering company in Ann Arbor, Michigan (distinct from the industrial machine-tool maker of a similar name). The company's work is somewhere between electromagnetic theory and hardware: it builds simulation software that predicts how electromagnetic waves behave, optical instruments that measure those fields without disturbing them, and custom radio systems for applications like 5G, radar, and aerospace.

The relevant piece here is the last category. A phased array is an antenna made of many small elements whose signals combine to form a beam that can be steered electronically, without physically moving the antenna. The direction and shape of that beam depend on setting a phase and a signal level on every element correctly. In practice the hardware never behaves exactly as the design intends: elements interfere with their neighbors and the electronics introduce distortion, so the beam that comes out is not the one that was asked for.

Calibration is the process of correcting for that gap, finding the per-element settings that make the real beam match the intended one. Doing it well matters because a mis-shaped beam points energy in the wrong direction, which for a radar means worse detection and more interference. The difficulty, and the subject of this project, is that measuring how good a given set of settings actually is requires a slow round-trip to physical hardware, so the number of settings to try is enormous and each try is expensive.

## Problem

An active electronically scanned array (AESA) radar steers its beam by setting a phase shift and attenuation on each element. The array here is a 16$\times$16 aperture of Anokiwave AWS-0103 beamforming ICs, where each element's phase shifter and attenuator are 6-bit discrete controls. The mapping from those control words to the far-field beam pattern is nonlinear and noisy: mutual coupling between neighboring elements and non-linear AM/PM distortion in the beamformers mean the achieved pattern departs from the ideal one.

Calibration is the task of finding the control configuration that produces a target pattern. Classical gradient methods do not apply because there is no closed-form model of the system, and every candidate configuration is expensive to evaluate: each one requires programming the beamformers over SPI, digitizing the response through an SDR, and reducing it back to a beam-synthesis error. That measurement cycle, rather than compute, is the binding constraint on the whole loop.

## Approaches

**Metaheuristic search.** Genetic algorithms and particle swarm optimization (PSO) treat the calibration as black-box optimization over the discrete phase and attenuator states. Because each evaluation costs a full SPI-program-and-SDR-digitize cycle, the loop was engineered around that latency: a software-state caching layer records configurations that have already been measured so the search never reprograms the hardware or re-digitizes for a state it has seen, and warm-starting from previous calibration runs reduces the number of fresh measurements needed to converge.

**CNN surrogate.** To bypass the physical measurement entirely, the array state is encoded as a 2D grid matching the 16$\times$16 aperture, with channels for phase and attenuation, and a convolutional network is trained to predict the resulting pattern. The 2D encoding is chosen so the network can learn the spatially local structure of mutual coupling and the non-linear AM/PM distortion. Once trained, the surrogate predicts phase adjustments in software, replacing slow hardware evaluations during search.

## Outcome

Under representative hardware-in-the-loop test configurations, the calibrated array reached a 6.5$\times$ reduction in post-calibration beam-synthesis error relative to the baseline Sample Matrix Inversion (SMI) method. The metaheuristic search converges reliably but is bounded by measurement throughput, while the CNN surrogate converges faster once trained at the cost of an upfront data-collection phase. The practical workflow is two-phase: collect an initial dataset with PSO, train the surrogate, then use surrogate-guided search to refine, falling back to hardware measurements only near the final configuration. The bottleneck throughout is measurement throughput on the hardware, not compute.
