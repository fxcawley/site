---
title: "Shake-Shake Regularization in ResNet Architectures"
tags:
  - "deep-learning"
  - "regularization"
  - "resnet"
  - "computer-vision"
date: 2023-12-01
venue: "Course project, University of Michigan (Qing Qu)"
authors:
  - name: "Liam Cawley"
excerpt: "An empirical comparison of stochastic regularization methods --- Shake-Shake, Mixup, and Cutout --- in residual networks on CIFAR-10, with analysis of when and why each technique helps."
selected: false
priority: 5
links:
  - name: "paper"
    url: "/research/shake-shake/shake-shake.pdf"
---

# Shake-Shake Regularization in ResNet Architectures

## Context

Standard empirical risk minimization (ERM) on finite training sets overfits. Regularization methods address this, but the landscape of non-ERM techniques for deep networks is fragmented: dropout operates on activations, weight decay on parameters, and data augmentation on inputs. A newer family of methods --- Shake-Shake, Mixup, Cutout --- intervenes at different points in the forward pass and has distinct inductive biases.

This project compares these methods on CIFAR-10, not merely in terms of final accuracy, but to understand the mechanism by which each improves generalization.

## Methods

**Shake-Shake** stochastically interpolates the outputs of two residual branches with random coefficients during training, then uses a fixed 0.5/0.5 blend at test time. This injects noise into the forward pass at the level of feature maps, acting as an implicit ensemble over exponentially many sub-architectures.

**Mixup** linearly interpolates both inputs and labels between random training pairs. Unlike standard augmentation, it operates in the input-label space simultaneously, encouraging the model to learn linear behavior between training examples.

**Cutout** zeroes out random rectangular patches of the input image, forcing the network to use spatially distributed features rather than relying on any single discriminative region.

## Findings

| Model | Test Accuracy |
|-------|:---:|
| ResNet-50 (baseline) | 92.0% |
| + Shake-Shake | 93.0% |
| Basic CNN (baseline) | 78.0% |
| + Combined regularization | 88.0% |

The methods are not interchangeable. Shake-Shake provides the largest marginal gain on ResNets, where the multi-branch architecture gives it a natural hook. Cutout helps most when the model is overfitting to localized features (visible via GradCAM analysis showing more distributed attention maps). Mixup's benefit is largest at small data sizes, consistent with its role as a data-efficient regularizer.

Combining all three methods yields diminishing returns --- the regularization effects partially overlap, particularly Shake-Shake and Mixup, which both smooth the loss landscape in complementary ways.

## Conclusion

The choice of regularizer should be informed by the failure mode. If the model memorizes spatially localized cues, Cutout is most effective. If the decision boundary is overly sharp, Mixup or Shake-Shake smooth it. The practical takeaway: Shake-Shake is the strongest single addition to a ResNet, but only because it exploits the multi-branch topology that ResNets already provide.
