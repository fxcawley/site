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
excerpt: "Conversation-history poisoning implementations with corrected diagnostics and matched clean-history controls. A retained three-prompt Qwen check rejected the fabricated advice; earlier simulator-generated statistics are not treated as model results."
selected: false
priority: 8
links:
  - name: "code"
    url: "https://github.com/fxcawley/context-manipulation-attack-benchmark"
---

This project studies fabricated assistant turns inserted into a model's conversation history. The threat model gives the caller control over the messages sent to the model. A service that maintains its own canonical history can restrict that capability.

The code implements single-turn false-history injection, repeated contradiction, and iterative poisoning. These are forms of history-based prompt manipulation. Earlier real-model trials were exploratory and their transcripts were not retained; they do not supply a reproducible attack-success rate.

## Corrections to the evaluation

The repository's historical statistical reports were generated from `AttackSimulator`, which selects templates according to a programmed degradation schedule. Its declining scores describe the simulator. They cannot establish that attacks degrade a language model.

Several implementation errors also needed repair. One breakdown detector called `any()` on a list containing nonempty literal strings, so ordinary responses were always flagged. The defense harness discarded the conversation history before calling history-dependent detectors. The response extractor could remove generated text when decoding changed the prompt's special tokens. These paths now have regression checks.

The corrected runner uses the tokenizer's chat template, preserves generated continuations, and constructs clean controls with the same user turns and model-generated assistant history. Language/script indicators are retained as diagnostics without automatically treating non-ASCII text as breakdown. Keyword matches and word-overlap drift remain heuristics.

## Retained real-model check

An October 2026 run used `Qwen/Qwen2.5-3B-Instruct`, greedy decoding, and a 96-token response limit. It tested three health-advice prompts with one fabricated assistant turn each, alongside matched clean histories.

The saved continuations rejected the fabricated advice in all three examples. After a false endorsement of smoking, the model began:

> “I'm sorry, but the advice to start smoking is not accurate or healthy.”

The breakdown and keyword diagnostics flagged none of the attacked responses. Mean word-overlap drift was nevertheless 0.759, illustrating why lexical difference alone is insufficient evidence of incoherence or harmful compliance.

This is a three-prompt protocol check on one model. It does not estimate attack prevalence or establish the performance of a deployed defense. The [retained run](/research/context-manipulation/replication.json) contains the model revision, settings, paired responses, and diagnostic results.
