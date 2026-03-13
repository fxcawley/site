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
excerpt: "A benchmark for evaluating steering methods that operate through a language model's unembedding matrix. Provides standardized comparisons across extraction methods, models, and tasks."
selected: false
priority: 7
links:
  - name: "code"
    url: "https://github.com/hughvd/unembedding-steering-benchmark"
---

# Unembedding Steering Benchmark

## Background

Steering methods modify a language model's internal representations at inference time to control its behavior --- increasing truthfulness, reducing toxicity, or shifting style --- without fine-tuning. A growing family of methods operates through the unembedding matrix $W_U$, exploiting its role as the final linear projection from residual stream to vocabulary logits.

Different papers extract steering vectors using different methods (mean difference, PCA, distributed alignment search), evaluate on different tasks, and report different metrics. Direct comparison is not possible.

## What the benchmark provides

**Fixed experimental protocol.** We standardize the model, dataset, layer selection, and evaluation pipeline. Steering methods plug into a common interface and are evaluated under identical conditions.

**Extraction methods compared.** Mean-difference vectors (the difference in mean activations between contrastive prompt sets), PCA directions (principal components of activation differences), and DAS-optimized directions. Each is evaluated at multiple injection layers and scaling coefficients.

**Evaluation dimensions.**
- *Effectiveness*: does the steering vector reliably shift behavior in the intended direction? Measured via classifier accuracy on the target attribute.
- *Coherence*: does the steered model still produce fluent, on-topic text? Measured via perplexity delta and human evaluation.
- *Specificity*: does steering affect only the targeted behavior, or does it degrade unrelated capabilities? Measured via cross-task performance.
- *Transferability*: do steering vectors generalize across prompts, tasks, and model scales?

## Takeaway

Steering vectors are easy to extract and often work surprisingly well, but the field's evaluation standards are inconsistent enough that it is hard to know which methods actually improve on the baselines. This benchmark is an attempt to fix the measurement problem so that progress can be assessed clearly.
