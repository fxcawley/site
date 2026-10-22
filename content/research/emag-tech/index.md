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
excerpt: "Hardware-in-the-loop phased-array calibration using discrete search, cached measurements, and a CNN surrogate. The tested configurations achieved a 6.5× reduction in beam-synthesis error relative to the SMI baseline."
selected: false
priority: 3
links: []
---

At EMAG Technologies, I worked on a closed-loop calibration application for an active electronically scanned phased-array radar. The task was to choose discrete phase and attenuation settings that brought the measured beam pattern closer to a target.

A phased array steers its beam by controlling the relative phase and amplitude of its elements. Mutual coupling and imperfections in the electronics make the physical response differ from the ideal pattern. The setup used a $16\times16$ aperture controlled through Anokiwave AWS-0103 beamforming ICs, with 6-bit phase-shifter and attenuator states.

## The measurement loop

Each candidate required programming the beamformers over SPI, digitizing the response through an SDR, and calculating beam-synthesis error. Measurement latency limited how many candidates a search could evaluate.

Genetic algorithms and particle swarm optimization searched the discrete control space without requiring an analytic derivative of that measurement loop. A cache reused previously measured configurations within the search, avoiding redundant hardware programming and captures. Warm starts from previous calibrations reduced the number of fresh configurations needed.

## Surrogate-guided calibration

The CNN surrogate represented the phase and attenuation settings as a two-dimensional grid matching the aperture. This preserved spatial relationships between elements while providing a software approximation for calibration search.

The workflow collected an initial dataset with PSO, trained the surrogate, and used it to guide further search, returning to hardware measurements near the final configuration. Once trained, the surrogate reduced the physical evaluations needed during refinement. It incurred an initial measurement and training cost.

## Measured outcome

In the hardware-in-the-loop configurations tested, post-calibration beam-synthesis error was reduced by a factor of $6.5$ relative to the Sample Matrix Inversion baseline. This comparison concerns the tested calibration setup; it is not a general convergence guarantee for either optimizer.
