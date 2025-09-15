---
title: "DDPM for Super Resolution"
tags:
  - "deep-learning"
  - "computer-vision" 
  - "super-resolution"
  - "ddpm"
  - "neural-networks"
  - "research"
date: 2024-04-30
venue: University Research Project
authors:
- name: "Liam Cawley"
- name: "Alexandra Lavacek"
- name: "Sophia Tesic"
path: "research/super-resolution-ddpm"
excerpt: This research explores novel approaches for single image super resolution using deep learning techniques inspired by Denoising Diffusion Probabilistic Models (DDPM). We introduce several unique features and modifications that adapt DDPM concepts to the super resolution domain. Our goal was to exceed baseline bicubic interpolation performance through architectural innovations combining residual blocks, channel attention mechanisms, and perceptual loss functions.
selected: false
cover: "./ddpm_preview.png"
links:
  - name: "pdf"
    file: "./442_final_report-combined.pdf"
priority: 4
---

# DDPM-Inspired Super Resolution 🔍

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

Welcome to our research implementation of a novel approach to single image super resolution using deep learning techniques inspired by Denoising Diffusion Probabilistic Models (DDPM)! We've explored the fascinating intersection of diffusion models and super resolution to create a system that can enhance image resolution while preserving critical details.

## Project Overview 🎯

This research focuses on developing an enhanced super resolution model that adapts key concepts from DDPMs. While DDPMs are typically used for image generation tasks, we've modified their architecture to specifically tackle the challenges of super resolution:

- Traditional DDPMs: Learn a reverse diffusion process to denoise images by iteratively estimating noise
- Our Approach: Directly maps low-resolution to high-resolution images while maintaining DDPM-inspired architectural elements

## Why This Matters 🌟

Super resolution has become increasingly critical in various fields:
- Medical imaging diagnostics
- Satellite imagery analysis
- Security surveillance systems
- Cost-effective hardware solutions

Current super resolution methods often struggle with:
- Unwanted artifacts in output images
- Blurred details
- Overly smooth textures

Our research aims to address these limitations through architectural innovations and smart combinations of traditional and modern techniques.

## Technical Approach 🔧

### Dataset: DIV2K
Our models are trained and evaluated on the DIV2K dataset:
- 800 high-quality training images
- 100 test images
- Created with downsampling factor of 2
- Diverse imagery for robust training

### Model Architecture Evolution

We've developed three increasingly sophisticated models:

#### Model 1: Basic Architecture
```python
# Simple encoder-decoder structure
model = Sequential([
    Conv2D(64, (3, 3), padding='same'),
    LeakyReLU(alpha=0.2),
    # ... convolution layers for downsampling
    Conv2DTranspose(64, (3, 3), strides=(2, 2), padding='same'),
    Conv2D(3, (3, 3), padding='same', activation='tanh')
])
```

Key features:
- Simple encoder-decoder structure
- Convolutional layers for downsampling
- Transposed convolutions for upsampling
- Mean squared error (MSE) loss
- Batch size of 1
- Adam optimizer with learning rate 1e-4

#### Model 2: Enhanced Architecture
```python
def residual_block(x, filters):
    residual = x
    x = Conv2D(filters, (3, 3), padding='same')(x)
    x = LeakyReLU(alpha=0.2)(x)
    x = channel_attention(x)  # Custom attention mechanism
    return Add()([x, residual])
```

Improvements:
- Six residual blocks with channel attention
- Skip connections between encoder-decoder
- LeakyReLU activation (alpha=0.2)
- 3x3 convolution filters
- Improved gradient flow

#### Model 3: Advanced DDPM-Inspired Architecture
Key enhancements:
- Eight residual blocks with sophisticated channel attention
- U-Net like skip connections
- Perceptual loss using VGG19 features
- Global residual learning
- Data augmentation techniques
  - Random rotations (20 degrees)
  - Horizontal/vertical shifts (10%)
  - Random flips
- Exponential learning rate decay
  - Initial rate: 1e-4
  - Decay rate: 0.95
  - Decay steps: 1000

## Results & Performance 📊

We evaluated our models against bicubic interpolation baseline:

| Model | PSNR | SSIM |
|-------|------|------|
| Bicubic Baseline | 32.29 | 0.904 |
| Model 3 (Advanced) | 34.00 | 0.927 |
| Model 2 | 33.71 | 0.924 |
| Model 1 | 4.80 | 0.025 |

Our advanced Model 3 demonstrated significant improvements in:
- Edge preservation
- Texture detail
- Reduced artifacts
- Natural appearance

## Installation & Usage 💻

### Prerequisites
```bash
pip install tensorflow
pip install scikit-image
pip install opencv-python
pip install pillow
```

### Running the Models
```python
# Basic usage example
from models.advanced_model import create_model
model = create_model(scale=2)
model.compile(optimizer=Adam(learning_rate=1e-4), 
             loss=['mean_absolute_error', perceptual_loss])
model.fit(val_dataset, epochs=100, steps_per_epoch=steps_per_epoch)
```

## Future Directions 🚀

We've identified several promising areas for future research:

- Investigation of alternative attention mechanisms
- Integration of transformer architectures
- Extension to video super resolution
- Real-time performance optimizations
- Exploration of self-supervised learning approaches

## Contributing 🤝

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes
- New features
- Documentation improvements
- Performance optimizations

## Citation 📚

If you use this code in your research, please cite:

```bibtex
@article{DDPM_SuperRes_2024,
    title={Denoising Diffusion Probabilistic Model Inspired Deep Learning for Single Image Super Resolution},
    author={Cawley, Liam, Tesic, Sophia, Lavacek, Alexandra},
    year={2024}
}
```

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors ✍️

- Sophia Tesic
- Liam Cawley
- Alexandra Lavacek

## Acknowledgments 🙏

Special thanks to:
- The DIV2K dataset team for providing high-quality training data
- The TensorFlow team for their excellent deep learning framework
- The computer vision research community for their foundational work in super resolution
