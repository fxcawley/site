---
title: "Context Manipulation Attack Benchmark"
tags:
  - "adversarial"
  - "safety"
  - "language-models"
  - "benchmark"
date: 2025-03-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A benchmark for conversation history poisoning attacks on language models. We evaluate false conversation injection, gaslighting, and iterative context poisoning, measuring coherence collapse, safety bypass rates, and attention failure modes."
selected: false
priority: 8
links:
  - name: "code"
    url: "https://github.com/fxcawley/context-manipulation-attack-benchmark"
---

# Context Manipulation Attack Benchmark

## Problem

Language models treat their entire context window as trusted input. In a multi-turn conversation, the model has no cryptographic or stateful mechanism to distinguish its own prior responses from fabricated ones. An attacker who controls the conversation history can inject false assistant turns --- making it appear that the model has already provided harmful advice or contradicted its safety training --- and use this fabricated context to steer subsequent generations.

This is distinct from prompt injection, which targets instruction-following; context manipulation targets the model's implicit trust in its own conversational history.

## Attack Variants

**False conversation injection.** Insert fabricated assistant responses into the conversation history. For example, a false turn in which the model enthusiastically endorses a harmful action, followed by a user turn asking it to elaborate. The model, seeing "its own" prior endorsement, is more likely to comply.

**Gaslighting.** Repeatedly contradict the model's actual outputs with false context claiming it said something different. Over multiple turns, this can destabilize the model's generation, producing semantic drift and eventually degenerate output.

**Iterative context poisoning.** A compounding variant: each round injects a slightly more extreme fabricated response, gradually shifting the Overton window of what the model treats as its established position. After 3--5 rounds, the model may produce outputs it would categorically refuse in a clean context.

## Breakdown Phenomena

Successful attacks produce observable failure modes:
- **Coherence collapse**: loss of grammatical structure, random token emission, unexpected language switching
- **Safety bypass**: the model agreeing with or elaborating on harmful content it would normally refuse
- **Attention failure**: the model unable to maintain consistent reasoning across the manipulated context, producing contradictions within a single response

## Evaluation

We measure attack success rate, coherence degradation (perplexity and entropy spikes), safety bypass rate, and semantic drift across GPT-2 family models and Gemma-2 (2B/9B). The benchmark provides standardized attack implementations, prompt templates, and scoring scripts to enable controlled comparison of defense mechanisms.

## Takeaway

Context manipulation is a category of attack that is underexplored relative to its severity. Unlike prompt injection, it requires no special tokens or formatting tricks --- only the ability to edit conversation history, which is trivially available in most chat interfaces. Effective defenses likely require changes to the serving infrastructure (cryptographic turn signing, server-side history tracking) rather than model-level alignment, because the model fundamentally cannot distinguish real from fabricated context using in-context information alone.
