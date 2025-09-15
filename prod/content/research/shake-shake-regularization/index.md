---
title: "Comparative Analysis of Shake-Shake Regularization in a ResNet-Like Architecture for CIFAR-10 Image Classification"
tags:
  - "deep-learning"
  - "regularization"
  - "resnet"
  - "neural-networks"
  - "computer-vision"
date: 2023-12-01
venue: University Research Project under Qing Qu
authors:
- name: "Liam Cawley"
  url: "mailto:cawleyl@umich.edu"
path: "research/shake-shake-regularization"
excerpt: Investigation of effectiveness of non-ERM based methods in improving ResNet performance on image classification tasks. In the field of machine learning, especially in image classification, the challenge of overfitting and underperformance on new data is persistent. This research addresses the critical need for effective regularization techniques that enhance the generalization ability of models without compromising their performance. Utilizing the CIFAR-10 dataset, we evaluate the effectiveness of techniques such as Shake-Shake, Mixup, and Cutout in improving the performance of Convolutional Neural Networks (CNNs) and Residual Networks (ResNet).
selected: false
cover: "./shake_preview.png"
links:
- name: "paper"
  file: "./shake-shake.pdf"
- name: "code"
  url: "https://github.com/"
priority: 5
---

# Advanced Regularization Techniques for Neural Networks 🧠

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Introduction 🎯

This research explores advanced regularization techniques for neural networks, specifically focusing on improving model generalization in image classification tasks. We investigate the effectiveness of Shake-Shake regularization, Mixup, and Cutout techniques when applied to Convolutional Neural Networks (CNNs) and ResNet architectures.

## Project Overview 📊

Our work addresses the persistent challenge of overfitting in deep learning models through the implementation and comparison of various regularization strategies. Using the CIFAR-10 dataset as our testing ground, we demonstrate significant improvements in model performance and generalization capabilities.

### Key Features 🌟

- Implementation of multiple regularization techniques
- Comparative analysis across different model architectures
- Comprehensive performance metrics and evaluation
- Modular and extensible codebase
- Detailed documentation and examples

## Technical Implementation 💻

### Basic CNN Architecture

The foundational CNN model implements the following key components:

```python
class BasicCNN(nn.Module):
    def __init__(self):
        super().__init__()
        # Core convolution operation
        # F_ij = sum(sum(I[i+m][j+n] * K[m][n]))
        self.conv1 = nn.Conv2d(3, 64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(64)
        self.conv2 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        self.fc = nn.Linear(128 * 8 * 8, 10)
        
    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.max_pool2d(x, 2)
        x = F.relu(self.bn2(self.conv2(x)))
        x = F.max_pool2d(x, 2)
        x = x.view(x.size(0), -1)
        return self.fc(x)
```

### Advanced Regularization Implementations

#### Cutout
```python
def cutout(image, mask_size):
    """Applies random cutout augmentation to the input image.
    
    Args:
        image: Input tensor of shape (C, H, W)
        mask_size: Size of the square mask
    Returns:
        Augmented image tensor
    """
    h, w = image.size(1), image.size(2)
    mask = torch.ones_like(image)
    x = torch.randint(0, w - mask_size, (1,))
    y = torch.randint(0, h - mask_size, (1,))
    mask[:, y:y + mask_size, x:x + mask_size] = 0
    return image * mask
```

#### Mixup
```python
def mixup_data(x, y, alpha=1.0):
    """Performs mixup on the input data and labels.
    
    Args:
        x: Input data tensor
        y: Target labels
        alpha: Mixup interpolation coefficient
    Returns:
        Mixed input, pair of targets, and lambda
    """
    lam = np.random.beta(alpha, alpha)
    batch_size = x.size()[0]
    index = torch.randperm(batch_size)
    
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam
```

#### Shake-Shake Regularization
```python
class ShakeShakeBlock(nn.Module):
    """Implementation of Shake-Shake regularization block."""
    def forward(self, x):
        if self.training:
            alpha = torch.rand(1)
            beta = torch.rand(1)
        else:
            alpha = beta = 0.5
            
        y = alpha * self.branch1(x) + (1 - alpha) * self.branch2(x)
        return x + beta * y
```

## Performance Results 📈

Our experiments yielded the following results:

| Model | Accuracy | Precision | Recall | F1 Score |
|-------|----------|-----------|---------|-----------|
| ResNet50 (Base) | 92% | 91% | 90% | 90.5% |
| + Shake-Shake | 93% | 92% | 91% | 91.5% |
| Basic CNN | 78% | 75% | 77% | 76% |
| + Advanced Regularization | 88% | 86% | 87% | 85.5% |

### Key Findings 🔍

1. Shake-Shake regularization provided consistent performance improvements across all metrics
2. Combined regularization techniques showed complementary benefits
3. Deeper architectures demonstrated superior learning capacity
4. Regularization significantly improved model generalization

## Getting Started 🚀

### Prerequisites

```bash
python >= 3.8
torch >= 1.8.0
torchvision >= 0.9.0
numpy >= 1.19.2
```

### Installation

```bash
git clone https://github.com/cawley/neural-regularization
cd neural-regularization
pip install -r requirements.txt
```

### Basic Usage

```python
from models import ResNet50WithShakeShake
from regularization import cutout, mixup_data

# Initialize model
model = ResNet50WithShakeShake()

# Training with regularization
for inputs, targets in train_loader:
    # Apply cutout
    inputs = cutout(inputs, mask_size=16)
    
    # Apply mixup
    inputs, targets_a, targets_b, lam = mixup_data(inputs, targets)
    
    # Forward pass with shake-shake enabled
    outputs = model(inputs)
```

## Contributing 🤝

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation 📚

If you use this code in your research, please cite:

```bibtex
@article{cawley2023regularization,
  title={Comparative Analysis of Shake-Shake Regularization in ResNet-Like Architecture},
  author={Cawley, Liam},
  journal={arXiv preprint},
  year={2023}
}
```

## Contact 📧

Liam Cawley - cawleyl@umich.edu

Project Link: [https://github.com/cawley/neural-regularization](https://github.com/cawley/neural-regularization)