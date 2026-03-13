---
title: "Steiner Networks, or, the Price of Fault Tolerance"
tags: ["optimization", "networks", "graph-theory", "linear-programming", "approximation"]
date: 2025-02-17
excerpt: How the jump from spanning trees to fault-tolerant network design breaks everything nice about LP relaxations, and what Jain figured out to get a 2-approximation anyway. Notes from EECS 598 with Euiwoong Lee.
---

You want to wire up a chip. Pins need connecting, copper costs money. If you just need *one* path between every pair of pins, that's a minimum spanning tree and Kruskal will solve it before your coffee gets cold.

But chips fail. Links fail. If you need two independent paths between certain pairs of pins so a single fault doesn't kill the connection, you have a Steiner Network problem, and things get ugly fast.

These are reworked notes from EECS 598-001 (Hardness of Approximation) with Euiwoong Lee. I've tried to organize them around a single question: what exactly breaks when you move from MST to Steiner networks, and how much can you recover?

---

## MST as an LP

Start with the easy case. $G = (V, E)$, edge costs $c: E \to \mathbb{R}_{\geq 0}$, and you want the cheapest connected spanning subgraph. Put a binary variable $x_e$ on each edge:

$$
\begin{aligned}
\min \quad & \sum_{e \in E} c(e)\, x_e \\
\text{s.t.} \quad & \sum_{e \in \delta(S)} x_e \geq 1 \quad \forall\; \emptyset \subset S \subset V \\
& x_e \in \{0, 1\} \quad \forall\; e \in E
\end{aligned}
$$

Each constraint says: no matter how you split the vertices into two groups, at least one edge crosses. That's connectivity.

The nice thing about MST is that if you drop the integrality requirement and just ask $x_e \geq 0$, you still get integer solutions. The constraint matrix is totally unimodular, so every extreme point of the LP polytope is integral. Kruskal's is basically solving this LP without knowing it.

This won't last.

## Steiner Networks

Now let requirements vary. A function $r: V \times V \to \mathbb{Z}_{\geq 0}$ specifies, for each pair, how many edge-disjoint paths you need between them.

> **Steiner Network Design.** Given $G = (V, E)$ with costs $c(e) \geq 0$ and requirements $r(u,v)$, find the cheapest subgraph $H \subseteq G$ with edge-connectivity $\lambda_H(u,v) \geq r(u,v)$ for all pairs.

If all requirements are 0 or 1 and only some vertices need connecting, you get the Steiner Tree problem (already NP-hard). Requirements $\geq 2$ puts you into Steiner Network territory.

The motivation for higher connectivity requirements is Menger's theorem: $r(u,v) = k$ means $u$ and $v$ stay connected even after removing any $k-1$ edges. That's the whole point. One cut fiber shouldn't partition a city. One dead trace on a board shouldn't brick a chip.

## The LP and what goes wrong

Same approach as MST. Define **cut demand** for a set $S$:

$$r(S) = \max_{\substack{u \in S,\; v \notin S}} r(u, v)$$

The integer program:

$$
\begin{aligned}
\min \quad & \sum_{e \in E} c(e)\, x_e \\
\text{s.t.} \quad & \sum_{e \in \delta(S)} x_e \geq r(S) \quad \forall\; \emptyset \subset S \subset V \\
& x_e \in \{0, 1, 2, \ldots\} \quad \forall\; e \in E
\end{aligned}
$$

Relax to $x_e \geq 0$. Exponentially many constraints, but the ellipsoid method with a min-cut separation oracle handles it.

Now the question: how much does relaxing integrality cost us? The ratio $\text{OPT}_{\text{IP}} / \text{OPT}_{\text{LP}}$ is the integrality gap. For MST it's 1. For Steiner Tree it's conjectured around $\ln 4 / \ln 3 \approx 1.10$. For general Steiner Network, the best anyone's shown is that it's at most 2 (Jain, 2001). Nobody has improved this in over twenty years.

## What survives: submodularity and uncrossing

OK, so the LP doesn't give integer solutions anymore. The question is whether there's enough structure left to round fractional solutions without blowing up the cost too badly. Turns out there is.

**Submodularity.** Cut capacity (edges crossing a cut) is submodular:

$$f(A) + f(B) \geq f(A \cup B) + f(A \cap B)$$

This is the diminishing-returns inequality. It's what makes min-cut computable in polynomial time, which is what lets us solve the LP at all despite having $2^{|V|}$ constraints.

Meanwhile the demand $r(S)$ is supermodular:

$$r(A) + r(B) \leq r(A \cup B) + r(A \cap B)$$

The tension between these two is where all the action is.

**Uncrossing.** A family of sets $\mathcal{F} \subseteq 2^V$ is **laminar** if any two members are disjoint or one contains the other. These families are tree-shaped and have size $\leq 2|V| - 1$.

At an optimal LP extreme point, some constraints are tight (binding with equality). If two tight cuts $S$ and $T$ cross, the sub/supermodularity pairing lets you replace them with $S \cap T$ and $S \cup T$ without losing tightness:

$$r(S \cap T) + r(S \cup T) \geq r(S) + r(T)$$

$$|\delta(S \cap T)| + |\delta(S \cup T)| \leq |\delta(S)| + |\delta(T)|$$

Repeat until nothing crosses. You end up with a laminar family of tight constraints. Exponentially many constraints have been tamed into a tree of at most $2|V| - 1$ sets.

This is the key structural fact that makes everything else work.

## Jain's 2-approximation

Jain's algorithm is almost offensively simple:

1. Solve the LP.
2. Find any edge with $x_e \geq 1/2$. Round it up to $\lceil x_e \rceil$. Fix it.
3. Reduce the problem. Repeat.

Why does this work? The laminar structure of tight constraints bounds the number of fractional variables at any extreme point, and a counting argument shows at least one variable must be $\geq 1/2$. So the loop always makes progress.

Since each edge gets rounded up by at most a factor of 2, the total cost is at most $2 \cdot \text{OPT}_{\text{LP}} \leq 2 \cdot \text{OPT}_{\text{IP}}$.

A 2-approximation. You can build a network guaranteed to cost at most twice optimal, in polynomial time, for a problem that's NP-hard to solve exactly. For something like chip wiring or telecom backbone design, that's a useful guarantee.

## Why I think this matters

The progression from MST to Steiner Network is a clean example of what approximation algorithms are really about. MST is trivially polynomial. Add non-uniform connectivity requirements and you're NP-hard. But the problem doesn't become structureless; the submodularity and laminar family machinery from MST degrades but doesn't die. Jain's rounding exploits exactly what's left.

The tools here (submodularity, uncrossing, iterative rounding) show up everywhere in combinatorial optimization. Learning them on Steiner networks is a good investment because the setting is concrete enough to see what's happening but general enough that the techniques transfer directly to survivable network design, facility location, and a bunch of other problems covered later in the course.
