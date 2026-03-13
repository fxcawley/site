---
title: "Unembedding Steering Benchmark"
tags:
  - "interpretability"
  - "steering"
  - "language-models"
  - "benchmark"
date: 2024-11-01
venue: ""
authors:
  - name: "Hugh van Deventer"
  - name: "Liam Cawley"
excerpt: "A benchmark for evaluating unembedding-based steering methods in language models. Systematic evaluation of representation engineering approaches for controlling model behavior through the unembedding matrix."
selected: false
priority: 7
links:
  - name: "code"
    url: "https://github.com/hughvd/unembedding-steering-benchmark"
---

# Unembedding Steering Benchmark

## Overview

Steering methods modify a language model's internal representations at inference time to control its behavior — e.g., increasing truthfulness, reducing toxicity, or shifting style. Many recent approaches operate through the unembedding matrix, exploiting its role as the final linear projection from residual stream to vocabulary space.

This benchmark provides:

- **Standardized evaluation** of unembedding-based steering across tasks and models
- **Controlled comparisons** between steering vectors derived via different methods (mean difference, PCA, DAS, etc.)
- **Metrics** for steering strength, coherence preservation, and task specificity

## Motivation

The field lacks consensus on how to evaluate steering methods. Published results often use different models, datasets, and metrics, making direct comparison impossible. This benchmark fixes the experimental setup so that steering methods can be compared on equal footing.

## Evaluation Dimensions

1. **Effectiveness**: Does the steering vector reliably shift model behavior in the intended direction?
2. **Coherence**: Does the steered model still produce fluent, on-topic text?
3. **Specificity**: Does the steering affect only the targeted behavior, or does it have unintended side effects?
4. **Transferability**: Do steering vectors generalize across prompts, tasks, and model scales?
