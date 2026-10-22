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
  - name: "Itamar Pres"
  - name: "Liam Cawley"
excerpt: "Sentiment-steering experiments comparing learned directions with token-unembedding baselines. The evaluator now counterbalances answer positions, and a retained Qwen recheck measures a preset intervention against an unsteered baseline."
selected: false
priority: 7
links:
  - name: "code"
    url: "https://github.com/hughvd/unembedding-steering-benchmark"
---

This collaboration with Hugh van Deventer and Itamar Pres asks how learned activation-steering directions compare with simpler directions built from token unembeddings. The concrete experiments in the repository focus on sentiment.

My contributions included the initial experiment runner and a prototype that penalizes overlap with positive-token directions. The shared evaluation data, probes, and layer/scale searches were collaborative work.

## Original retained experiments

The saved Gemma-2-2b grids cover 26 layers and ten steering strengths on 48 multiple-choice sentiment prompts. They include token-unembedding averages, contrastive activation differences, linear probes, and probes trained with an overlap penalty.

The original score was the next-token logit difference between options A and B, with the positive answer always assigned to A. That confounded the intended preference with answer-position bias. Selecting the best cell from the same evaluation grid also does not provide a held-out performance estimate.

The repository does not establish the broader claims previously made here about DAS comparisons, human-rated coherence, cross-task specificity, or transfer across model scales.

## Evaluation repairs

The evaluator now presents both answer orders and averages logit differences oriented toward the positive answer. A regression check verifies that a fixed preference for A cancels. A zero-strength run supplies the unsteered reference.

The steering hooks now preserve tensor and tuple outputs and scale interventions separately for each example. The SAE prototypes also needed coordinate corrections: latent directions must be decoded before comparison with residual-space unembeddings or injection into a transformer layer. Their overlap penalty is a soft constraint; it does not establish exact orthogonality.

## Retained controlled recheck

A new check used the locally available `Qwen/Qwen2.5-3B-Instruct` on all 48 prompts. Layer 27 and strengths 0, 0.1, and 0.5 were preset. The direction averaged the unembeddings of ` good`, ` great`, and ` happy`; the scale multiplies each example's last-token residual norm.

| Strength | Mean counterbalanced score | Paired change from unsteered |
|---|---|---|
| 0 | 7.957 | 0 |
| 0.1 | 8.043 | +0.086 |
| 0.5 | 6.693 | −1.263 |

The larger intervention lowered this score. These values describe one choice-logit diagnostic on one model, not a ranking of steering methods or a measurement of free-generation sentiment. The [run record](/research/unembedding-steering/counterbalanced_results.json) includes both option-order scores for each prompt.

The original Gemma/probe sweeps have not been regenerated under the corrected protocol. They remain historical exploratory results, with the evaluation changes made explicit.
