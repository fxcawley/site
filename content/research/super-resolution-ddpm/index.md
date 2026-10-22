---
title: "DDPM-Inspired Single Image Super Resolution"
tags:
  - "deep-learning"
  - "computer-vision"
  - "super-resolution"
  - "diffusion-models"
date: 2024-04-30
venue: "Course project, University of Michigan"
authors:
  - name: "Sophia Tesic"
  - name: "Liam Cawley"
  - name: "Alexandra Lavacek"
  - name: "Namitha John"
  - name: "Dennis Lin"
excerpt: "A course project exploring direct image-to-image models for 2× super resolution. Review of the retained notebook exposed training/evaluation overlap and a pixel-range error; the published record now includes corrected evaluation code and reproducible checks."
selected: false
priority: 4
links:
  - name: "paper"
    url: "/research/super-resolution-ddpm/442_final_report-combined.pdf"
  - name: "evaluation code"
    url: "/research/super-resolution-ddpm/evaluation.py"
  - name: "correction source"
    url: "/research/super-resolution-ddpm/corrections.tex"
---

This team course project explored $2\times$ single-image super resolution using DIV2K. The models mapped a low-resolution image directly to a larger image. Diffusion models were an architectural reference; the implementation had no noise-conditioned reverse-diffusion sampling chain.

The retained report includes notebook code and training output. Reviewing that code exposed evaluation errors that invalidate the earlier interpretation of its performance table.

## Models explored

The simple model used convolutional layers, transposed-convolution upsampling, and a tanh output. A second model used six residual blocks with channel attention, pixel-shuffle upsampling, and a global connection from the bilinearly upsampled input. Later configurations increased the number of residual blocks and considered VGG-19 feature loss alongside a pixel loss.

These configurations changed several architectural and training choices together. The record does not isolate the contribution of residual learning, attention, or perceptual loss.

## Errors reproduced in the evaluation

The function named `train_and_evaluate_model` passed `val_dataset` to `model.fit` and then scored the same dataset. The calling cell loaded DIV2K's validation split. The resulting numbers therefore do not establish held-out performance.

The simple model also had incompatible preprocessing in the final comparison. It was trained on inputs and targets in $[-1,1]$, then given raw pixel inputs during evaluation. Its signed output was clipped to $[0,255]$ and cast directly to an 8-bit image, without inverse normalization.

The range error is reproducible without model training: a perfect signed-range prediction of a synthetic RGB gradient receives **4.77054 dB** under the old cast. Applying the inverse transform reconstructs the reference to numerical precision. The reported 4.80 dB consequently cannot support the earlier claim that direct image prediction inherently failed.

## Corrected evaluation

The [replacement code](/research/super-resolution-ddpm/evaluation.py) requires separate training and evaluation image IDs, applies explicit input and output conventions, and computes metrics in RGB float space with a fixed range. It scores the model and bicubic baseline on every supplied evaluation image and retains per-image results. The [checks](/research/super-resolution-ddpm/evaluation_checks.json) verify range handling and reject overlapping splits before training.

The original checkpoints are not in the available source bundle, so these repairs do not produce a replacement held-out score. The previously quoted PSNR/SSIM table is withdrawn as evidence of generalization. The [report](/research/super-resolution-ddpm/442_final_report-combined.pdf) now begins with the correction and retains the original notebook afterward.
