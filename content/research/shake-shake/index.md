---
title: "Shake-Shake Regularization in ResNet Architectures"
tags:
  - "deep-learning"
  - "regularization"
  - "resnet"
  - "computer-vision"
date: 2023-05-01
venue: "Course project, University of Michigan (Qing Qu)"
authors:
  - name: "Liam Cawley"
excerpt: "A CIFAR-10 course project comparing CNN configurations with Cutout and Mixup and a custom ResNet with Shake-Shake. The report records configuration-level accuracy differences, without a controlled ranking of the regularizers."
selected: false
priority: 5
links:
  - name: "paper"
    url: "/research/shake-shake/shake-shake.pdf"
  - name: "source"
    url: "/research/shake-shake/shake-shake.tex"
---

This course project compared several CNN and residual-network configurations on CIFAR-10. It considered three forms of regularization: masking input patches with Cutout, interpolating images and labels with Mixup, and stochastically weighting parallel residual branches with Shake-Shake.

## Methods

**Shake-Shake** uses two parallel residual branches. During training, the forward pass mixes them with one random coefficient and the backward pass uses a separately sampled coefficient. At evaluation, the branches are averaged. This requires a modified residual block; an ordinary single-branch ResNet does not already supply that structure.

**Mixup** linearly interpolates both inputs and labels between training pairs.

**Cutout** masks random patches of an input image during training.

## Reported configurations

| Model | Reported accuracy |
|-------|:---:|
| Three-layer CNN | 78% |
| Ten-layer CNN | 85% |
| Ten-layer CNN with Cutout | 87% |
| Ten-layer CNN with Mixup | 88% |
| Custom ResNet-50 | 92% |
| Custom ResNet-50 with Shake-Shake | 93% |

These values come from Table 1 of the original report. The 78-to-88 comparison includes both a depth change and Mixup. It was incorrectly described on this page as a combined-regularization result.

The report gives one value per configuration without repeated-seed uncertainty. It contains no GradCAM study, small-data sweep, or experiment combining all three methods. Those earlier claims have been removed.

The corrected TeX source also fixes the ResNet layer count and residual-gradient formula and makes Shake-Shake's separate backward coefficient explicit. The recorded comparison supports differences among these configurations; isolating the effect of a regularizer would require a fixed architecture and training protocol across repeated runs.
