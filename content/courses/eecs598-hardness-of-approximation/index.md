---
title: "Hardness of Approximation"
code: "EECS 598-001"
term: "Winter 2025"
date: 2025-01-06
excerpt: Lecture notes and problem sets from Prof. Euiwoong Lee's course on hardness of approximation.
topics:
  - "PCP Theorem"
  - "Unique Games Conjecture"
  - "Steiner Network"
  - "LP Relaxations"
  - "Integrality Gaps"
---

# EECS 598: Hardness of Approximation

Lecture notes and selected problem sets from the Winter 2025 offering.

## Topics Covered

- **Steiner Network Design**: LP formulations, submodularity, laminar families, iterative rounding
- **PCP Theorem**: Probabilistically checkable proofs and inapproximability
- **Unique Games Conjecture**: Implications for optimal approximation ratios
- **Semidefinite Programming**: SDP relaxations and rounding techniques
- **Vertex Cover & Set Cover**: Classical approximation algorithms and hardness results

## Notes

These are personal lecture notes — not official course materials. They may contain errors or omissions. Use at your own risk.

### Steiner Network Design

See the [companion blog post](/posts/steiner-network-formal) for a self-contained introduction to the LP formulation and key structural results (submodularity, uncrossing, laminar families).

The key insight: for crossing violating cuts $S, T$, we can replace them with $S \cap T$ and $S \cup T$ while maintaining feasibility. This **uncrossing lemma** is the engine that reduces exponentially many constraints to a polynomial-sized laminar family.

### From MST to General Steiner

The MST LP is totally unimodular with integrality gap 1. Moving to general connectivity requirements $r(u,v) > 1$ breaks this structure, and the integrality gap becomes the central difficulty.

$$r(S) = \max_{u \in S, v \notin S} r(u,v)$$

The iterative rounding approach: solve the LP, find a variable $x_e \geq 1/2$ (guaranteed to exist by the structure of tight constraints), round it up, and repeat.
