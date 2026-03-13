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
  - name: "Liam Cawley"
  - name: "Alexandra Lavacek"
  - name: "Sophia Tesic"
excerpt: "Adapting denoising diffusion concepts to single-image super resolution. We progressively build from a naive upsampler to a residual architecture with channel attention and perceptual loss, achieving 34.0 dB PSNR on DIV2K at 2x upscaling."
selected: false
priority: 4
links:
  - name: "paper"
    url: "/research/super-resolution-ddpm/442_final_report-combined.pdf"
---

# DDPM-Inspired Single Image Super Resolution

## Motivation

Denoising diffusion probabilistic models (DDPMs) generate high-quality images by learning to reverse a noise process. The core idea --- iteratively refining a corrupted signal toward a clean target --- is naturally suited to super resolution, where the low-resolution input can be viewed as a degraded version of the high-resolution target.

We adapt this perspective to build a single-image super resolution model, drawing on the residual denoising structure of DDPMs without the full iterative sampling chain.

## Approach

We trained three models of increasing complexity on DIV2K (800 training images, 2x downsampling factor):

1. **Baseline**: Direct upsampling with a shallow convolutional network. This establishes the floor and fails catastrophically (4.8 dB PSNR), confirming that naive regression to the mean is insufficient.

2. **Residual model**: Eight residual blocks with channel attention. The network predicts the residual between bilinear upsampling and the ground truth. This alone raises PSNR to 33.7 dB, demonstrating that the residual formulation --- learning the correction rather than the image --- is the dominant factor.

3. **DDPM-inspired model**: Adds U-Net-style skip connections and replaces pixel-wise MSE loss with a perceptual loss (VGG-19 feature matching) plus a small MSE term. The perceptual loss encourages the model to recover high-frequency texture rather than blurring. Final PSNR: 34.0 dB, SSIM: 0.927.

## Results

| Model | PSNR | SSIM |
|-------|:----:|:----:|
| Bicubic interpolation | 32.29 | 0.904 |
| Baseline (direct) | 4.80 | 0.025 |
| Residual + attention | 33.71 | 0.924 |
| DDPM-inspired (full) | 34.00 | 0.927 |

## Takeaway

The iterative refinement framing from diffusion models is useful even in a single-pass architecture. The two critical ingredients are (1) predicting residuals rather than pixels, and (2) perceptual loss to avoid regression-to-the-mean blurring. The gap between our best model and the bicubic baseline (+1.7 dB) is meaningful but modest; closing it further likely requires either the full iterative diffusion process or substantially more training data.
