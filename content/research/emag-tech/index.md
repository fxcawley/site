---
title: "Novel Optimizer for Phased Array Calibration"
tags:
  - "metaheuristic-optimization"
  - "computer-vision"
  - "neural-networks"
  - "research"
date: 2023-07-01
venue: EMag Technologies, Inc.
authors:
  - name: "Liam Cawley"
  - name: "Gabe Ronan"
excerpt: This Python repository focuses on creating a calibrator application that optimizes the amplitude of a phased array by adjusting the phase shift and attenuator positions of Anokiwave AWS-0103 beamformers. We use several metaheuristic algorithms including PSO, GA, Simulated Annealing, and Quantum Annealing.
selected: false
priority: 3
links: []
---

# Phased Array Calibrator

## Project Overview

This Python repository focuses on creating a calibrator application that optimizes the amplitude of a phased array by adjusting the phase shift and attenuator positions of Anokiwave AWS-0103 beamformers.

## Our Approaches

- **Memoryless Machine Learning** — Metaheuristic algorithms (GA, PSO, SARR, QA) take inspiration from natural phenomena to optimize poorly defined functions for which traditional derivatives are not applicable.
- **Weighted and Cached Machine Learning** — Memory, multithreading, encodings, caching and other optimization strategies built on to each metaheuristic algorithm to help scale up to large-N input size.
- **Linear Model Approach** — Linear learning models like XGB, RFR and GBM proved not to have the complexity necessary to accurately model these nonlinear systems.
- **Reinforcement Learning Approach** — Reinforcement learning models create a set of actions called an Agent, and create an optimal strategy called a policy based on a reward system.
- **Nonlinear Output Prediction via Convolutional Neural Net** — We encode the state of the phased array as an image where each cell is a pixel and apply the calculated optimal improvements based on historical data.

## Problem Statement

Given the complex and multidimensional nature of our problem, we don't have a well-defined function relating the beamformer wave magnitude to the phase shifter and attenuator values. As a result, we use metaheuristic algorithms to search the solution space for an optimal solution efficiently.

## Solution Approach

The main bottleneck in our problem is the calls to the fitness function because each call requires us to loop through the entire system: from the beamformer to grab the state, through the Software Defined Radio (SDR) to digitize the signal, and then back to the Python program to rate its efficacy.

## Authors

- [Liam Cawley](https://github.com/cawley)
- [Gabe Ronan](https://github.com/ronangabriel)
