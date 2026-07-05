---
title: "Context Manipulation Attack Benchmark"
tags:
  - "adversarial"
  - "safety"
  - "language-models"
  - "benchmark"
date: 2023-10-01
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "An undergraduate benchmark for conversation-history poisoning attacks on language models, covering false conversation injection, gaslighting, and iterative context poisoning. Added in retrospect with notes on what the setup does and does not establish."
selected: false
priority: 8
links:
  - name: "code"
    url: "https://github.com/fxcawley/context-manipulation-attack-benchmark"
---

# Context Manipulation Attack Benchmark

## Context

This is an undergraduate project. I am adding this note in retrospect because the original write-up stated several things more firmly than the experiments warrant: the attacks were evaluated on a small set of open models, the "failure modes" were catalogued qualitatively rather than measured against a controlled baseline, and the threat model assumes an attacker who can edit the raw conversation history, which is a stronger assumption than a typical chat interface allows. The benchmark is best read as an exploratory catalogue of attack shapes rather than a rigorous measurement of their prevalence or severity.

## Problem

Language models treat their entire context window as trusted input. In a multi-turn conversation, the model has no cryptographic or stateful mechanism to distinguish its own prior responses from fabricated ones. An attacker who controls the conversation history can inject false assistant turns making it appear that the model has already provided harmful advice or contradicted its safety training and use this fabricated context to steer subsequent generations.

This is distinct from prompt injection, which targets instruction-following; context manipulation targets the model's implicit trust in its own conversational history.

## Attack Variants

**False conversation injection.** Insert fabricated assistant responses into the conversation history for example, a false turn in which the model endorses a harmful action, followed by a user turn asking it to elaborate. In the models tested, the presence of "its own" prior endorsement raised the rate of compliance relative to a clean context, though the effect size varied by model and prompt.

**Gaslighting.** Repeatedly contradict the model's actual outputs with false context claiming it said something different. Over multiple turns this sometimes destabilized generation, producing semantic drift and, in the more extreme cases, degenerate output. The behavior was not consistent across runs.

**Iterative context poisoning.** A compounding variant in which each round injects a slightly more extreme fabricated response. On some transcripts this shifted what the model treated as its established position over 3--5 rounds; on others it had little effect. I did not collect enough runs to characterize how often the escalation succeeds.

## Breakdown Phenomena

When the attacks succeeded, the failures fell into a few recurring shapes, catalogued qualitatively rather than scored against a controlled baseline:
- **Coherence collapse**: loss of grammatical structure, random token emission, unexpected language switching
- **Safety bypass**: the model agreeing with or elaborating on harmful content it would normally refuse
- **Reasoning breakdown**: the model failing to maintain consistent reasoning across the manipulated context, producing contradictions within a single response

## Evaluation

We measure attack success rate, coherence degradation (perplexity and entropy spikes), safety bypass rate, and semantic drift across GPT-2 family models and Gemma-2 (2B/9B). These are small open models, so the numbers should not be read as indicative of how frontier systems behave. The benchmark provides standardized attack implementations, prompt templates, and scoring scripts, with the aim of making comparisons between defenses reproducible.

## Takeaway

Context manipulation seems less studied than prompt injection, though I have not surveyed the literature carefully enough to claim it is neglected. The premise that motivates it is that a model has no in-context way to distinguish its genuine prior turns from fabricated ones, so an attacker who can rewrite the history has some leverage that instruction-level defenses do not obviously address. That points toward serving-side mitigations (signed or server-tracked turns) rather than model-level alignment, but the experiments here do not test any defense, so this is a direction rather than a result. It is also worth noting that editing raw conversation history requires API-level access or a permissive client; most consumer chat interfaces do not expose it.
