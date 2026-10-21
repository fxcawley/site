---
title: "Steiner Networks, or, the Price of Fault Tolerance"
tags: ["optimization", "networks", "graph-theory", "linear-programming", "approximation"]
date: 2025-02-17
excerpt: Notes on what happens to LP relaxations when connectivity requirements go from uniform to non-uniform, and how Jain's iterative rounding recovers a 2-approximation. From EECS 598 with Euiwoong Lee.
---

A minimum spanning tree connects every vertex at the least cost, but loses connectivity when any edge fails. A simple graph model of fault tolerance assigns a required number of edge-disjoint paths between selected pairs: perhaps three from a source to a hospital, two to a substation, and one to a depot.

<NetworkRedundancy />

The Steiner Network Design problem asks for the cheapest subgraph of a given graph that meets these pairwise edge-connectivity requirements. Requiring one path between every pair of vertices gives the minimum spanning tree problem. Requiring connectivity only among a specified set of terminals gives Steiner Tree, which is already NP-hard; allowing higher requirements adds redundancy to the design.

<MstToSteiner />

Linear programming gives a way to compare these problems. A linear program (LP) has a linear objective and linear constraints, with variables allowed to take continuous values. Many combinatorial problems can be written as integer programs; their LP relaxations drop the integrality requirement. An efficiently solvable integral relaxation gives an exact algorithm for the integer problem. MST has such a formulation, though the simpler cut relaxation below can have fractional optima.

[Jain's (2001) algorithm](https://doi.org/10.1007/s004930170004) uses the structure of tight cut constraints to find an edge whose fractional value is at least $1/2$. Selecting such edges one at a time gives a solution costing at most twice the LP optimum.

These are reworked notes from EECS 598-001 (Hardness of Approximation) with Euiwoong Lee, organized around that transition.

---

## MST as an LP

Given a graph $G = (V, E)$ with edge costs $c: E \to \mathbb{R}_{\geq 0}$, the minimum spanning tree problem can be formulated as an integer program. Assign a binary variable $x_e$ to each edge:

$$
\begin{aligned}
\min \quad & \sum_{e \in E} c(e)\, x_e \\
\text{s.t.} \quad & \sum_{e \in \delta(S)} x_e \geq 1 \quad \forall\; \emptyset \subset S \subset V \\
& x_e \in \{0, 1\} \quad \forall\; e \in E
\end{aligned}
$$

Each constraint requires that for every proper nonempty subset $S$ of $V$, at least one selected edge crosses the cut $(S, V \setminus S)$. This is equivalent to requiring connectivity.

Relaxing the variables to $0 \leq x_e \leq 1$ permits fractional solutions. On the triangle with unit edge costs, setting every $x_e = 1/2$ satisfies all three cut constraints at cost $3/2$, while any spanning tree costs $2$. On the $n$-cycle the same construction gives cost $n/2$ against a tree cost of $n-1$, so the ratio approaches $2$.

Edmonds' spanning-tree polytope uses stronger constraints: $x_e \geq 0$, $\sum_{e \subseteq S}x_e \leq |S|-1$ for nonempty $S \subseteq V$, and $\sum_e x_e = |V|-1$. It is integral, reflecting the matroid structure of spanning trees. The weaker cut-covering relaxation is the one that extends to Steiner networks.

## The general problem

Now allow non-uniform requirements in an undirected graph. A symmetric function $r: V \times V \to \mathbb{Z}_{\geq 0}$ specifies, for each pair of distinct vertices $(u,v)$, the number of edge-disjoint paths required between them.

> **Steiner Network Design.** Given $G = (V, E)$ with costs $c(e) \geq 0$ and requirements $r(u,v)$, find the minimum-cost subgraph $H \subseteq G$ such that the edge-connectivity $\lambda_H(u,v) \geq r(u,v)$ for all pairs.

Steiner Tree is the special case with $r(u,v)=1$ for every pair in a terminal set $T$, and zero otherwise. Arbitrary required pairs with demands in $\{0,1\}$ give Steiner Forest. Higher demands require redundant paths.

The practical motivation for higher connectivity requirements comes from Menger's theorem: requiring $r(u,v) = k$ edge-disjoint paths is equivalent to requiring that $u$ and $v$ remain connected after the removal of any $k-1$ edges. This is the standard formalization of fault tolerance in network design.

<FaultTolerance />

## The LP relaxation and the integrality gap

The integer program follows the same pattern as MST. Define the **cut demand** for a vertex set $S$ as the maximum requirement crossing the cut:

$$r(S) = \max_{\substack{u \in S,\; v \notin S}} r(u, v)$$

Set $r(\emptyset)=r(V)=0$. Each available edge can be selected once:

$$
\begin{aligned}
\min \quad & \sum_{e \in E} c(e)\, x_e \\
\text{s.t.} \quad & \sum_{e \in \delta(S)} x_e \geq r(S) \quad \forall\; \emptyset \subset S \subset V \\
& x_e \in \{0, 1\} \quad \forall\; e \in E
\end{aligned}
$$

Relaxing to $0 \leq x_e \leq 1$ gives exponentially many cut constraints. They can be checked in polynomial time by finding a minimum $u$–$v$ cut with capacities $x_e$ for each pair with positive demand. Any cut with capacity below $r(u,v)$ violates a constraint. This separation oracle allows the ellipsoid method to solve the LP without listing every cut.

The LP optimum $\text{OPT}_{\text{LP}}$ lower-bounds the integer optimum $\text{OPT}_{\text{IP}}$. The integrality gap is the worst-case ratio $\text{OPT}_{\text{IP}}/\text{OPT}_{\text{LP}}$. The $n$-cycle gives ratios approaching $2$, even with all requirements equal to $1$. Jain's rounding supplies the matching upper bound, so this relaxation's integrality gap is exactly $2$.

Approximation guarantees for the underlying problems can be better than this cut LP's gap. MST is solved exactly. Steiner Tree admits a $\ln 4+\varepsilon$ approximation for any fixed $\varepsilon>0$ (Byrka, Grandoni, Rothvoß, and Sanità, 2010), using a stronger relaxation. Jain's guarantee for general Steiner Network is $2$.

<IntegralityGapLadder />

## Submodularity and uncrossing

The rounding argument uses two properties of cuts: submodularity of their capacities and an uncrossing property of tight constraints.

**Submodularity.** For fixed nonnegative capacities $x_e$, the cut capacity $f(S)=\sum_{e\in\delta(S)}x_e$ is submodular:

$$f(A) + f(B) \geq f(A \cup B) + f(A \cap B)$$

Undirected cut capacities also satisfy $f(A)+f(B)\geq f(A\setminus B)+f(B\setminus A)$.

The demand function $r(S) = \max_{u \in S,\, v \notin S} r(u,v)$ is *weakly* (skew) supermodular: for any two sets $A$ and $B$, at least one of

$$r(A) + r(B) \leq r(A \cup B) + r(A \cap B) \qquad \text{or} \qquad r(A) + r(B) \leq r(A \setminus B) + r(B \setminus A)$$

holds. The alternative involving set differences is needed when the union/intersection inequality fails.

**Uncrossing.** A family of sets $\mathcal{F} \subseteq 2^V$ is **laminar** if any two members are either disjoint or nested. A laminar family of nonempty sets has size at most $2|V| - 1$.

A cut $S$ is *tight* when its constraint holds with equality, $f(S)=r(S)$. Suppose tight cuts $S$ and $T$ cross. In the branch of weak supermodularity involving their intersection and union, feasibility and submodularity give:

$$
\begin{aligned}
r(S)+r(T) &= f(S)+f(T) \\
&\geq f(S\cap T)+f(S\cup T) \\
&\geq r(S\cap T)+r(S\cup T) \\
&\geq r(S)+r(T).
\end{aligned}
$$

Equality must hold throughout, so the intersection and union are tight. In the other branch, the same argument makes $S\setminus T$ and $T\setminus S$ tight.

Uncrossing allows the tight cut constraints needed to describe an extreme point to be chosen as a laminar family, after accounting for variables at their bounds. The LP still contains all its cut constraints; the laminar basis is used in the analysis of the selected extreme point.

<Uncrossing />

## Jain's iterative rounding

The iterative rounding algorithm is:

1. Solve the residual LP and obtain an optimal extreme point. Discard edges with $x_e=0$.
2. Select an edge with $x_e\geq 1/2$ and fix its value to $1$.
3. Remove that edge from the remaining instance, reduce the demand of each cut it crosses by one, and repeat until the selected edges satisfy all requirements.

Jain's theorem guarantees the edge required in step 2 whenever the residual problem is nontrivial. Its proof uses a counting argument on the laminar basis; the bound on the family's size alone is insufficient. [Chekuri's lecture notes](https://courses.grainger.illinois.edu/cs598csc/sp2009/lectures/lecture_14_draft.pdf) give the full argument.

Selecting an edge costs at most twice its current fractional contribution. The remaining fractional solution stays feasible for the residual demands, and reoptimizing can only reduce its cost. Charging each selected edge against the corresponding decrease in the LP objective gives

$$\text{cost} \leq 2 \cdot \text{OPT}_{\text{LP}} \leq 2 \cdot \text{OPT}_{\text{IP}}.$$

Each iteration removes an edge from the residual instance, so the algorithm makes at most $|E|$ LP solves and gives a polynomial-time 2-approximation.

## Remarks

The factor $2$ is tight relative to this cut relaxation, as the cycle example shows. A hardness-of-approximation bound would require a separate argument about the underlying problem; MST has the same cut-LP gap and admits an exact algorithm.
