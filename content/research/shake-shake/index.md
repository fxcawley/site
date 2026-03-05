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
excerpt: Investigation of effectiveness of non-ERM based methods in improving ResNet performance on image classification tasks. Utilizing the CIFAR-10 dataset, we evaluate the effectiveness of techniques such as Shake-Shake, Mixup, and Cutout in improving the performance of CNNs and Residual Networks.
selected: false
priority: 5
links:
  - name: "paper"
    url: "/research/shake-shake/shake-shake.pdf"
  - name: "code"
    url: "https://github.com/"
---

# Advanced Regularization Techniques for Neural Networks

## Introduction

This research explores advanced regularization techniques for neural networks, specifically focusing on improving model generalization in image classification tasks. We investigate the effectiveness of Shake-Shake regularization, Mixup, and Cutout techniques when applied to CNNs and ResNet architectures.

## Technical Implementation

### Basic CNN Architecture

```python
class BasicCNN(nn.Module):
    def __init__(self):
        super().__init__()
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

### Cutout
```python
def cutout(image, mask_size):
    h, w = image.size(1), image.size(2)
    mask = torch.ones_like(image)
    x = torch.randint(0, w - mask_size, (1,))
    y = torch.randint(0, h - mask_size, (1,))
    mask[:, y:y + mask_size, x:x + mask_size] = 0
    return image * mask
```

### Mixup
```python
def mixup_data(x, y, alpha=1.0):
    lam = np.random.beta(alpha, alpha)
    batch_size = x.size()[0]
    index = torch.randperm(batch_size)
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam
```

### Shake-Shake Regularization
```python
class ShakeShakeBlock(nn.Module):
    def forward(self, x):
        if self.training:
            alpha = torch.rand(1)
            beta = torch.rand(1)
        else:
            alpha = beta = 0.5
        y = alpha * self.branch1(x) + (1 - alpha) * self.branch2(x)
        return x + beta * y
```

## Performance Results

| Model | Accuracy | Precision | Recall | F1 Score |
|-------|----------|-----------|---------|-----------|
| ResNet50 (Base) | 92% | 91% | 90% | 90.5% |
| + Shake-Shake | 93% | 92% | 91% | 91.5% |
| Basic CNN | 78% | 75% | 77% | 76% |
| + Advanced Regularization | 88% | 86% | 87% | 85.5% |

## Citation

```bibtex
@article{cawley2023regularization,
  title={Comparative Analysis of Shake-Shake Regularization in ResNet-Like Architecture},
  author={Cawley, Liam},
  journal={arXiv preprint},
  year={2023}
}
```
