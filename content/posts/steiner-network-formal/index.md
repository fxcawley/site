---
title: "Steiner Networks, or, the Price of Fault Tolerance"
tags: ["optimization", "networks", "graph-theory", "linear-programming", "approximation"]
date: 2025-02-17
excerpt: Notes on what happens to LP relaxations when connectivity requirements go from uniform to non-uniform, and how Jain's iterative rounding recovers a 2-approximation. From EECS 598 with Euiwoong Lee.
---

The Steiner Network Design problem asks for the cheapest subgraph of a given graph that meets prescribed edge-connectivity requirements between specified pairs of vertices. When those requirements are all equal to 1 and every vertex participates, this reduces to the minimum spanning tree, which is solvable in polynomial time. When the requirements are allowed to vary, the problem becomes NP-hard, and the natural LP relaxation is no longer integral.

What makes the problem worth studying in some detail, at least in the context of this course, is that the transition from MST to general Steiner networks is unusually clean. The structural properties that make MST tractable — submodularity of cut functions, total unimodularity of the constraint matrix — do not vanish entirely; they degrade in a way that can be precisely characterized, and the 2-approximation algorithm due to Jain (2001) exploits exactly what remains.

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

The LP relaxation, obtained by replacing $x_e \in \{0,1\}$ with $x_e \geq 0$, happens to have the same optimal value as the integer program. The constraint matrix is totally unimodular, so every extreme point of the LP polytope is integral. Combinatorial algorithms like Kruskal's are, in effect, solving this LP.

## The general problem

Now suppose the connectivity requirements are non-uniform. A function $r: V \times V \to \mathbb{Z}_{\geq 0}$ specifies, for each pair $(u,v)$, the number of edge-disjoint paths required between them.

> **Steiner Network Design.** Given $G = (V, E)$ with costs $c(e) \geq 0$ and requirements $r(u,v)$, find the minimum-cost subgraph $H \subseteq G$ such that the edge-connectivity $\lambda_H(u,v) \geq r(u,v)$ for all pairs.

When all non-zero requirements equal 1 and only a subset of vertices need to be connected, this is the Steiner Tree problem, which is already NP-hard. Allowing requirements of 2 or more yields the general Steiner Network problem.

The practical motivation for higher connectivity requirements comes from Menger's theorem: requiring $r(u,v) = k$ edge-disjoint paths is equivalent to requiring that $u$ and $v$ remain connected after the removal of any $k-1$ edges. This is the standard formalization of fault tolerance in network design.

## The LP relaxation and the integrality gap

The integer program follows the same pattern as MST. Define the **cut demand** for a vertex set $S$ as the maximum requirement crossing the cut:

$$r(S) = \max_{\substack{u \in S,\; v \notin S}} r(u, v)$$

Then:

$$
\begin{aligned}
\min \quad & \sum_{e \in E} c(e)\, x_e \\
\text{s.t.} \quad & \sum_{e \in \delta(S)} x_e \geq r(S) \quad \forall\; \emptyset \subset S \subset V \\
& x_e \in \{0, 1, 2, \ldots\} \quad \forall\; e \in E
\end{aligned}
$$

Relaxing to $x_e \geq 0$ gives exponentially many constraints, but the ellipsoid method with a min-cut separation oracle solves the LP in polynomial time.

The LP optimum $\text{OPT}_{\text{LP}}$ lower-bounds the integer optimum $\text{OPT}_{\text{IP}}$. The ratio $\text{OPT}_{\text{IP}} / \text{OPT}_{\text{LP}}$ — the integrality gap — measures how much is lost by relaxing integrality. For MST it is 1. For Steiner Tree it is conjectured to be near $\ln 4 / \ln 3 \approx 1.10$. For general Steiner Network, the best known bound is 2, due to Jain (2001). Whether the true gap is smaller remains open.

## Submodularity and uncrossing

The LP relaxation is no longer integral, but the question is how much structure remains. Two properties carry over from the MST setting.

**Submodularity.** The cut capacity function — the number of edges crossing a cut — is submodular:

$$f(A) + f(B) \geq f(A \cup B) + f(A \cap B)$$

This is what makes min-cut computable in polynomial time, and consequently what allows the LP to be solved despite having exponentially many constraints.

The demand function $r(S)$ is supermodular:

$$r(A) + r(B) \leq r(A \cup B) + r(A \cap B)$$

The interaction between submodular capacity and supermodular demand is what drives the analysis.

**Uncrossing.** A family of sets $\mathcal{F} \subseteq 2^V$ is **laminar** if any two members are either disjoint or nested. Laminar families have size at most $2|V| - 1$.

At an optimal LP extreme point, the tight constraints (those binding with equality) may initially cross in complicated ways. But if two tight cuts $S$ and $T$ cross, the sub/supermodularity pairing guarantees that replacing them with $S \cap T$ and $S \cup T$ preserves tightness:

$$r(S \cap T) + r(S \cup T) \geq r(S) + r(T)$$

$$|\delta(S \cap T)| + |\delta(S \cup T)| \leq |\delta(S)| + |\delta(T)|$$

Iterating this procedure yields a laminar family of tight constraints — a reduction from exponentially many constraints to at most $2|V| - 1$. This is the structural result that makes the rounding argument possible.

## Jain's iterative rounding

The algorithm itself is straightforward:

1. Solve the LP relaxation.
2. If any variable satisfies $x_e \geq 1/2$, round it up to $\lceil x_e \rceil$ and fix it.
3. Remove the fixed edge, update the problem, and repeat.

The argument that this terminates relies on the laminar structure established above: at every extreme point, the number of tight constraints is at most $2|V| - 1$, which bounds the number of fractional variables, and a counting argument ensures that at least one variable is $\geq 1/2$.

Since each variable is rounded up by at most a factor of 2 (from $\geq 1/2$ to at most 1), the total cost of the rounded solution satisfies

$$\text{cost} \leq 2 \cdot \text{OPT}_{\text{LP}} \leq 2 \cdot \text{OPT}_{\text{IP}}.$$

This gives a 2-approximation in polynomial time for a problem that is NP-hard to solve exactly. No improvement to this ratio has been found in over two decades for the general case.

## Remarks

The Steiner Network problem is useful as a case study in approximation because the gap between MST and the general problem isolates exactly what LP integrality buys and what it costs to lose it. The techniques involved — submodularity of cut functions, uncrossing to obtain laminar families, iterative rounding — appear repeatedly in the network design literature, including in work on survivable network design and related problems covered later in the course.

It is worth noting that the 2-approximation, while the best known, is not known to be tight. Whether the integrality gap for general Steiner Network is strictly less than 2 is an open question.
