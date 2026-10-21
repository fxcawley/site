"""Numerical checks for the corrected LoRAMBo working note.

Requires NumPy. Run: python verify_allocation.py --output allocation_checks.json
These are matrix/allocator checks, not language-model training experiments.
"""

import argparse
from functools import lru_cache
from itertools import product
import json
from pathlib import Path

import numpy as np


def exact_allocation(gains, costs, budget):
    """Maximize prefix gains under an integer parameter budget."""
    if budget < 0 or any(c <= 0 or int(c) != c for c in costs):
        raise ValueError("Use a nonnegative budget and positive integer costs")
    if len(gains) != len(costs):
        raise ValueError("One cost is required per layer")
    values = [np.r_[0.0, np.cumsum(layer)] for layer in gains]

    @lru_cache(None)
    def solve(i, remaining):
        if i == len(gains):
            return 0.0, ()
        choices = []
        for rank in range(min(len(gains[i]), remaining // costs[i]) + 1):
            value, ranks = solve(i + 1, remaining - costs[i] * rank)
            choices.append((float(values[i][rank] + value), (rank,) + ranks))
        return max(choices, key=lambda choice: choice[0])

    value, ranks = solve(0, budget)
    return ranks, value


def greedy_allocation(gains, costs, budget):
    """Choose the best affordable next increment by gain per parameter."""
    ranks = [0] * len(gains)
    remaining = budget
    value = 0.0
    while True:
        candidates = [
            i for i in range(len(gains))
            if ranks[i] < len(gains[i]) and costs[i] <= remaining
        ]
        if not candidates:
            break
        i = max(candidates, key=lambda j: gains[j][ranks[j]] / costs[j])
        value += float(gains[i][ranks[i]])
        ranks[i] += 1
        remaining -= costs[i]
    return tuple(ranks), value


def positive_root(matrix, inverse=False):
    values, vectors = np.linalg.eigh(matrix)
    if values.min() <= 0:
        raise ValueError("The weighted SVD check requires positive-definite factors")
    return (vectors * (values ** (-0.5 if inverse else 0.5))) @ vectors.T


def verify():
    gains, costs, budget = [[3.0], [4.0]], [2, 3], 3
    greedy_ranks, greedy_value = greedy_allocation(gains, costs, budget)
    exact_ranks, exact_value = exact_allocation(gains, costs, budget)
    assert greedy_ranks == (1, 0) and greedy_value == 3
    assert exact_ranks == (0, 1) and exact_value == 4

    rng = np.random.default_rng(42)
    max_svd_error = 0.0
    max_operator_error = 0.0
    for _ in range(100):
        d, k = 4, 3
        update = rng.normal(size=(d, k))
        left = rng.normal(size=(d, d))
        left = left @ left.T + np.eye(d)
        right = rng.normal(size=(k, k))
        right = right @ right.T + np.eye(k)
        left_root, right_root = positive_root(left), positive_root(right)
        whitened = left_root @ update @ right_root
        u, singular, vh = np.linalg.svd(whitened, full_matrices=False)
        for rank in range(min(d, k) + 1):
            truncated = (u[:, :rank] * singular[:rank]) @ vh[:rank]
            approximation = positive_root(left, True) @ truncated @ positive_root(right, True)
            error = update - approximation
            measured = np.trace(left @ error @ right @ error.T)
            expected = np.sum(singular[rank:] ** 2)
            np.testing.assert_allclose(measured, expected, rtol=1e-10, atol=1e-10)
            max_svd_error = max(max_svd_error, float(abs(measured - expected)))
        operator = right_root @ update.T @ left @ update @ right_root
        eigenvalues = np.linalg.eigvalsh(operator)[::-1]
        np.testing.assert_allclose(eigenvalues, singular ** 2, rtol=1e-10, atol=1e-10)
        max_operator_error = max(max_operator_error, float(abs(eigenvalues - singular ** 2).max()))

        shapes = rng.integers(1, 5, size=(3, 2))
        layer_costs = [int(a + b) for a, b in shapes]
        layer_gains = [np.sort(rng.uniform(0, 10, min(a, b)))[::-1] for a, b in shapes]
        limit = int(rng.integers(0, 20))
        ranks, optimum = exact_allocation(layer_gains, layer_costs, limit)
        enumerated = max(
            sum(float(sum(g[:r])) for g, r in zip(layer_gains, candidate))
            for candidate in product(*(range(len(g) + 1) for g in layer_gains))
            if sum(c * r for c, r in zip(layer_costs, candidate)) <= limit
        )
        np.testing.assert_allclose(optimum, enumerated, atol=1e-12)
        assert sum(c * r for c, r in zip(layer_costs, ranks)) <= limit
        _, equal_greedy = greedy_allocation(layer_gains, [4] * 3, limit)
        _, equal_exact = exact_allocation(layer_gains, [4] * 3, limit)
        np.testing.assert_allclose(equal_greedy, equal_exact, atol=1e-12)

    actual_increase = 0.5 * (1.1 ** 2 - 1)
    quadratic_only = 0.5 * 0.1 ** 2
    corrected_bound = 1.0 * 0.1 + quadratic_only
    assert actual_increase > quadratic_only
    np.testing.assert_allclose(actual_increase, corrected_bound)
    return {
        "scope": "synthetic mathematical checks; no model-training results",
        "seed": 42,
        "random_instances_checked": 100,
        "greedy_counterexample": {
            "costs": costs, "gains": gains, "budget": budget,
            "greedy_ranks": greedy_ranks, "greedy_gain": greedy_value,
            "optimal_ranks": exact_ranks, "optimal_gain": exact_value,
        },
        "missing_gradient_example": {
            "actual_loss_increase": actual_increase,
            "quadratic_term_only": quadratic_only,
            "corrected_bound": corrected_bound,
        },
        "max_weighted_svd_error": max_svd_error,
        "max_symmetric_operator_error": max_operator_error,
        "dynamic_program_matches_enumeration": True,
        "equal_cost_greedy_matches_dynamic_program": True,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = json.dumps(verify(), indent=2, allow_nan=False) + "\n"
    if args.output:
        args.output.write_text(report, encoding="utf-8")
    print(report, end="")
