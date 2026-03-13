---
title: "Context Manipulation Attack Benchmark"
tags:
  - "adversarial"
  - "safety"
  - "language-models"
  - "benchmark"
date: 2024-10-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A benchmark for evaluating language model robustness to context manipulation attacks — adversarial perturbations to in-context examples, system prompts, and retrieved documents that exploit the model's reliance on context."
selected: false
priority: 8
links:
  - name: "code"
    url: "https://github.com/cawley/context-manipulation-attack-benchmark"
---

# Context Manipulation Attack Benchmark

## Problem

Language models are increasingly deployed in settings where they consume external context: retrieved documents (RAG), user-provided examples (ICL), and system prompts. Each of these context channels is a potential attack surface.

Context manipulation attacks craft adversarial inputs for these channels to induce targeted misbehavior — incorrect answers, policy violations, or information leakage — without modifying the model's weights.

## Benchmark Design

We evaluate robustness across three attack surfaces:

### 1. In-Context Example Poisoning
Adversarial few-shot examples that steer the model toward incorrect or harmful outputs while appearing benign.

### 2. System Prompt Injection
Inputs designed to override or subvert the system prompt's behavioral constraints.

### 3. Retrieved Document Manipulation
Adversarial documents injected into a RAG pipeline to control the model's outputs on downstream queries.

## Metrics

- **Attack success rate** across prompt templates and model scales
- **Detection difficulty**: How hard is it for a classifier to distinguish adversarial from benign contexts?
- **Defense transferability**: Do defenses trained against one attack type generalize?

## Goals

The benchmark aims to make it easy to:
1. Evaluate new models against known attack patterns
2. Test proposed defenses under controlled conditions
3. Track progress in robustness over time
