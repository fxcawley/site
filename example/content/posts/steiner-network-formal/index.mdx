---
title: "Steiner Network Design: A Formal Introduction"
tags: ["optimization", "networks", "algorithms", "graph-theory", "linear-programming"]
date: 2025-02-17
cover: "./steiner-tree-preview.png"
path: "posts/steiner-network-formal"
excerpt: What follows are some notes on Steiner Network Design, in accordance with my lectures in EECS 598-001 Hardness of Approximation with Prof. Euiwoong Lee. I'll start with formal definitions and work through the key theoretical components. This is part 1 of a series - future posts will expand on applications and implementation details.
---

## 1. Problem Definition

Let $G = (V, E)$ be an undirected graph with costs $c(e) \geq 0$ for each edge $e \in E$. Given connectivity requirements $r(u,v)$ for pairs $(u,v) \in V \times V$, we want to find a minimum-cost subgraph $H \subseteq G$ satisfying these requirements.

Formally:

**Input**: 
1. $G = (V,E)$ with $c(e) \geq 0$
2. $r: V \times V \to \mathbb{Z}_{\geq 0}$

**Output**: $H \subseteq G$ minimizing $\sum_{e \in E(H)} c(e)$

**Constraint**: For all pairs $(u,v)$, edge-connectivity $\lambda_H(u,v) \geq r(u,v)$

## 2. LP Formulation

The canonical approach uses cut-based linear programs. For each $e \in E$, let $x_e \geq 0$ indicate how "much" of edge $e$ we take.

First, define cut demand:

$$r(S) = \max_{u\in S,\;v\notin S} r(u,v)$$

This gives us:

$$
\begin{aligned}
\text{(IP)}\quad
&\min && \sum_{e\in E} c(e)x_e\\
&\text{s.t.} && \sum_{e \in \delta(S)} x_e \geq r(S) \quad &&\forall\,S \subset V,\; S\neq\emptyset,\,S\neq V,\\
&&& x_e \in \{0,1,\dots\}\quad &&\forall\,e \in E.
\end{aligned}
$$

Typically relaxed to $x_e \geq 0$.

## 3. Sub/Supermodularity 

This is where things get interesting. Many network design problems exhibit submodular or supermodular structure.

**Def**: $f: 2^V \to \mathbb{R}$ is submodular if for all $A,B \subseteq V$:

$$f(A) + f(B) \geq f(A \cup B) + f(A \cap B)$$

**Def**: $g$ is supermodular if $-g$ is submodular.

In network design:
- Cut capacity functions are often submodular
- Deficit/surplus functions across cuts can be supermodular
- These properties are crucial for:
  1. Uncrossing arguments
  2. Approximation bounds
  3. Integrality proofs

## 4. Laminar Families

A family $\mathcal{F} \subseteq 2^V$ is laminar if for any $S,T \in \mathcal{F}$:
- $S \subseteq T$, or
- $T \subseteq S$, or
- $S \cap T = \emptyset$

**Key Point**: Through uncrossing arguments, we can often reduce exponentially many constraints to a laminar family without losing optimality.

**Uncrossing Lemma**: For crossing violating cuts $S,T$, we can replace them with $S \cap T$ and $S \cup T$ while maintaining feasibility.

## 5. Integrality and Tightness

The LP relaxation usually isn't integral. Key questions:
1. What's the integrality gap?
2. How do we get integer solutions?

Standard approach:
1. Find optimal LP solution
2. Show tight sets form laminar family
3. Use iterative rounding or primal-dual

[More on this in a future post focusing on approximation algorithms.]

## 6. Applications

Quick hits (each deserves its own post):
- VLSI design
- Network infrastructure
- Phylogenetic trees
- Telecommunication networks

## Next Up

Planning posts on:
1. Approximation algorithms and tight examples
2. Implementation techniques 
3. Real-world applications
4. Extensions to directed/weighted cases

## 7. MST: The Base Case

Let's dig into the simplest non-trivial case: Minimum Spanning Tree (MST). This gives concrete intuition for the abstract machinery we've covered.

In MST, we have $r(u,v) = 1$ for all pairs $(u,v)$, and all vertices are terminals. This leads to:

$
\begin{aligned}
\min && \sum_{e\in E} c(e)x_e\\
\text{s.t.} && \sum_{e \in \delta(S)} x_e \geq 1 \quad &&\forall S \subset V,\\
&& x_e \in \{0,1\} &&\forall e \in E.
\end{aligned}
$

### 7.1 Quick Example

Take $V = \{A,B,C,D\}$ with edges:
$E = \{(A,B),(A,C),(B,C),(B,D),(C,D)\}$
$c(A,B) = 3, c(A,C) = 1, c(B,C) = 2, c(B,D) = 4, c(C,D) = 3$

Optimal solution: $\{(A,C),(B,C),(C,D)\}$ with cost 6.

### 7.2 The Cut Property

**Theorem**: If $e$ is the minimum-cost edge crossing cut $(S,V\setminus S)$, then some minimum spanning tree includes $e$.

This emerges from submodularity and leads to greedy algorithms like Kruskal's. Key insight: Crossing minimal edges are always safe to take.

### 7.3 Why MST is Special

1. The LP is totally unimodular
2. Integrality gap = 1
3. Extreme points are integral
4. Combinatorial algorithms (Kruskal/Prim) directly solve the LP

This "niceness" vanishes when:
- $r(u,v) > 1$ for some pairs
- Only certain vertices are terminals
- Edge capacities enter the picture

## 8. From MST to General Steiner

The jump from MST to general Steiner networks shows exactly where things get hard:

1. **LP Integrality**: MST's perfect integrality breaks
2. **Cut Structure**: Instead of uniform demands ($r(S) = 1$), we get complex requirements
3. **Solution Space**: The spanning tree polytope's structure is lost

Yet the tools persist:
- Submodularity guides cut-based arguments
- Uncrossing reduces to laminar families
- Iterative rounding replaces natural integrality

## Next Steps

1. Approximation algorithms and tight examples
2. Implementation techniques 
3. Real-world applications
4. Extensions to directed/weighted cases

[Comments enabled - hit me up with questions/corrections]