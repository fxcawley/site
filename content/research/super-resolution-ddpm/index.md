---
title: "DDPM for Super Resolution"
tags:
  - "deep-learning"
  - "computer-vision"
  - "super-resolution"
  - "ddpm"
  - "neural-networks"
date: 2024-04-30
venue: University Research Project
authors:
  - name: "Liam Cawley"
  - name: "Alexandra Lavacek"
  - name: "Sophia Tesic"
excerpt: This research explores novel approaches for single image super resolution using deep learning techniques inspired by Denoising Diffusion Probabilistic Models (DDPM). We introduce several unique features and modifications that adapt DDPM concepts to the super resolution domain.
selected: false
priority: 4
links:
  - name: "pdf"
    url: "/research/super-resolution-ddpm/442_final_report-combined.pdf"
---

# DDPM-Inspired Super Resolution

This research focuses on developing an enhanced super resolution model that adapts key concepts from DDPMs. While DDPMs are typically used for image generation tasks, we've modified their architecture to specifically tackle the challenges of super resolution.

## Technical Approach

### Dataset: DIV2K
Our models are trained and evaluated on the DIV2K dataset:
- 800 high-quality training images
- 100 test images
- Created with downsampling factor of 2

### Model Architecture Evolution

We developed three increasingly sophisticated models:

#### Model 1: Basic Architecture
```python
model = Sequential([
    Conv2D(64, (3, 3), padding='same'),
    LeakyReLU(alpha=0.2),
    Conv2DTranspose(64, (3, 3), strides=(2, 2), padding='same'),
    Conv2D(3, (3, 3), padding='same', activation='tanh')
])
```

#### Model 2: Enhanced Architecture
```python
def residual_block(x, filters):
    residual = x
    x = Conv2D(filters, (3, 3), padding='same')(x)
    x = LeakyReLU(alpha=0.2)(x)
    x = channel_attention(x)
    return Add()([x, residual])
```

#### Model 3: Advanced DDPM-Inspired Architecture
- Eight residual blocks with sophisticated channel attention
- U-Net like skip connections
- Perceptual loss using VGG19 features
- Global residual learning
- Data augmentation and exponential learning rate decay

## Results

| Model | PSNR | SSIM |
|-------|------|------|
| Bicubic Baseline | 32.29 | 0.904 |
| Model 3 (Advanced) | 34.00 | 0.927 |
| Model 2 | 33.71 | 0.924 |
| Model 1 | 4.80 | 0.025 |

## Citation

```bibtex
@article{DDPM_SuperRes_2024,
    title={Denoising Diffusion Probabilistic Model Inspired Deep Learning for Single Image Super Resolution},
    author={Cawley, Liam and Tesic, Sophia and Lavacek, Alexandra},
    year={2024}
}
```
