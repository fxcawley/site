---
title: "Steiner Networks, or, the Price of Fault Tolerance"
tags: ["optimization", "networks", "graph-theory", "linear-programming", "approximation"]
date: 2025-02-17
excerpt: Notes on what happens to LP relaxations when connectivity requirements go from uniform to non-uniform, and how Jain's iterative rounding recovers a 2-approximation. From EECS 598 with Euiwoong Lee.
---

When a hospital loses grid power, the margin for error is measured in minutes. Operating rooms, ventilators, and the refrigerators holding blood and vaccines all depend on the supply staying up, and the same is true of emergency dispatch centers, water treatment plants, and the networks that carry financial transactions. Utilities and network operators guard against this by building in redundancy, so that no single failed line, severed cable, or fallen tree can isolate a critical site. That redundancy is expensive: every additional cable or transmission line has to be paid for and maintained, and the sites do not all need the same amount of it. A hospital might have to survive several simultaneous failures, an ordinary substation only one, a storage yard none at all. Designing the least-cost network that still meets every site's reliability requirement is, in the abstract, the Steiner Network Design problem, and the step from connecting everything to connecting everything with varying degrees of redundancy marks a sharp jump in computational difficulty.

<NetworkRedundancy />

The Steiner Network Design problem asks for the cheapest subgraph of a given graph that meets prescribed edge-connectivity requirements between specified pairs of vertices. When those requirements are all equal to 1 and every vertex participates, this reduces to the minimum spanning tree, which is solvable in polynomial time. When the requirements are allowed to vary, the problem becomes NP-hard, and the clean structure that makes MST exactly solvable no longer applies.

<MstToSteiner />

To understand what breaks when requirements vary, it helps to see MST through the lens of linear programming. A linear program (LP) is an optimization problem with a linear objective and linear constraints, but with variables allowed to take continuous values rather than being restricted to integers. Many combinatorial problems can be written as integer programs; their LP relaxations drop the integrality requirement, often yielding problems that are efficiently solvable. When the relaxation happens to have integral optimal solutions, the original hard problem becomes tractable. MST is one such case, although, as the next section shows, the formulation responsible is a more careful one than the cut relaxation.

What makes the problem worth studying in some detail, at least in the context of this course, is that the transition from MST to general Steiner networks is unusually clean. The structural properties that make MST tractable (submodularity of cut functions, the matroid structure that makes the spanning-tree polytope integral) do not vanish entirely; they degrade in a way that can be precisely characterized, and the 2-approximation algorithm due to Jain (2001) exploits exactly what remains.

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

It is tempting to expect this relaxation to be integral, but it is not. On the triangle with unit edge costs, setting every $x_e = 1/2$ satisfies all three cut constraints at cost $3/2$, while any spanning tree costs $2$; on the $n$-cycle the same construction gives cost $n/2$ against a tree cost of $n-1$, so the ratio approaches $2$. What actually makes MST tractable is not this formulation but the matroid structure of spanning trees. Edmonds' spanning-tree polytope, described by the rank constraints $\sum_{e \subseteq S} x_e \leq |S| - 1$ together with $\sum_e x_e = |V| - 1$, is integral, and greedy algorithms like Kruskal's optimize over it directly. The cut-covering LP written above is the weaker relaxation that generalizes to the Steiner setting, and its worst-case looseness, already a factor of $2$ on the cycle, is what the rest of this post is about.

## The general problem

Now suppose the connectivity requirements are non-uniform. A function $r: V \times V \to \mathbb{Z}_{\geq 0}$ specifies, for each pair $(u,v)$, the number of edge-disjoint paths required between them.

> **Steiner Network Design.** Given $G = (V, E)$ with costs $c(e) \geq 0$ and requirements $r(u,v)$, find the minimum-cost subgraph $H \subseteq G$ such that the edge-connectivity $\lambda_H(u,v) \geq r(u,v)$ for all pairs.

When all non-zero requirements equal 1 and only a subset of vertices need to be connected, this is the Steiner Tree problem, which is already NP-hard. Allowing requirements of 2 or more yields the general Steiner Network problem.

The practical motivation for higher connectivity requirements comes from Menger's theorem: requiring $r(u,v) = k$ edge-disjoint paths is equivalent to requiring that $u$ and $v$ remain connected after the removal of any $k-1$ edges. This is the standard formalization of fault tolerance in network design.

<FaultTolerance />

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

The LP optimum $\text{OPT}_{\text{LP}}$ lower-bounds the integer optimum $\text{OPT}_{\text{IP}}$. Their ratio, the integrality gap, measures how much is lost by relaxing integrality. For this cut-covering relaxation the gap is already $2$ in the worst case (the $n$-cycle above, even with all requirements equal to $1$), and Jain's rounding shows a factor of $2$ is achievable, so the gap of the relaxation is exactly $2$.

What does improve as the problem specializes is the best approximation ratio obtainable in polynomial time. Minimum spanning tree is solved exactly (ratio $1$). Steiner Tree admits a $\ln 4 \approx 1.39$ approximation (Byrka, Grandoni, Rothvoß, and Sanità, 2010), and its exact integrality gap for the strongest known relaxations is still open, with lower bounds around $1.2$. For general Steiner Network the best known ratio is $2$, due to Jain (2001), and whether a polynomial-time algorithm can beat $2$ remains open.

<IntegralityGapLadder />

## Submodularity and uncrossing

The LP relaxation is no longer integral, but the question is how much structure remains. The remaining structures will determine whether other approximation algorithms can still succeed.

The surviving structures are submodularity and uncrossing.

**Submodularity.** The cut capacity function, that is, the number of edges crossing a cut, is submodular:

$$f(A) + f(B) \geq f(A \cup B) + f(A \cap B)$$

This is what makes min-cut computable in polynomial time, and consequently what allows the LP to be solved despite having exponentially many constraints.

The demand function $r(S) = \max_{u \in S,\, v \notin S} r(u,v)$ is *weakly* (skew) supermodular: for any two sets $A$ and $B$, at least one of

$$r(A) + r(B) \leq r(A \cup B) + r(A \cap B) \qquad \text{or} \qquad r(A) + r(B) \leq r(A \setminus B) + r(B \setminus A)$$

holds. It is not supermodular in the full sense, but this weaker property is exactly what Jain's analysis requires. The interaction between the submodular capacity and the weakly supermodular demand is what drives the argument.

**Uncrossing.** A family of sets $\mathcal{F} \subseteq 2^V$ is **laminar** if any two members are either disjoint or nested. Laminar families have size at most $2|V| - 1$.

At an optimal LP extreme point, the tight constraints (those binding with equality) may initially cross in complicated ways. But if two tight cuts $S$ and $T$ cross, then the case of weak supermodularity that pairs $S \cap T$ with $S \cup T$ applies, and combined with submodularity of the capacity it forces both to be tight as well:

$$r(S \cap T) + r(S \cup T) \geq r(S) + r(T)$$

$$|\delta(S \cap T)| + |\delta(S \cup T)| \leq |\delta(S)| + |\delta(T)|$$

Iterating this procedure yields a laminar family of tight constraints, a reduction from exponentially many constraints to at most $2|V| - 1$. This structural result enables Jain's iterative rounding, which achieves the best known approximation bound of 2 for the general Steiner Network problem.

<Uncrossing />

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

The Steiner Network problem is useful as a case study in approximation because the gap between MST and the general problem isolates exactly what LP integrality buys and what it costs to lose it. The techniques involved (submodularity of cut functions, uncrossing to obtain laminar families, iterative rounding) appear repeatedly in the network design literature, including in work on survivable network design and related problems covered later in the course.

It is worth noting that the 2-approximation, while the best known, is not known to be tight. Whether the integrality gap for general Steiner Network is strictly less than 2 is an open question.
