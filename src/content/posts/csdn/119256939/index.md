---
title: "pytorch学习08：拼接与拆分"
published: 2021-07-30
description: ''
image: ''
tags: ["Python", "PyTorch", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# cat
矩阵拼接操作，将符合要求的不同矩阵在某一维度上进行拼接。

cat要求进行拼接的矩阵在**非拼接维度上完全相同**。
```python
import torch

a1 = torch.rand(4, 3, 32, 32)
a2 = torch.rand(5, 3, 32, 32)
a3 = torch.rand(4, 1, 32, 32)
a4 = torch.rand(4, 3, 16, 32)

# 要求其他维度必须相同
print("torch.cat([a1, a2], dim=0): ",
      torch.cat([a1, a2], dim=0).shape)
print("torch.cat([a1, a3], dim=1): ",
      torch.cat([a1, a3], dim=1).shape)
print("torch.cat([a1, a4], dim=2): ",
      torch.cat([a1, a4], dim=2).shape)
```

![在这里插入图片描述](/images/csdn/adfdd7f18699521dc6808f63.png)



- ***只有需要拼接的维度可以不同，其他维度必须相同***

# stack
矩阵堆叠，将若干维度完全相同的句子在某一维度上进行堆叠。

stack操作会在指定维度前**增加一个维度**，然后让后面的维度堆叠起来。

要求堆叠的**矩阵维度完全相同**。
```python
import torch

a1 = torch.rand(4, 3, 16, 32)
a2 = torch.rand(4, 3, 16, 32)
print("torch.cat([a1, a2], dim=2): ",
      torch.cat([a1, a2], dim=2).shape)

# stack会新插入一个维度，使其他维度保持不变
# stack要求两个矩阵维度完全一致
print("torch.stack([a1, a2], dim=2): ",
      torch.stack([a1, a2], dim=2).shape)

a = torch.rand(32, 8)
b = torch.rand(32, 8)
print("torch.stack([a, b], dim=0): ",
      torch.stack([a, b], dim=0).shape)
# 可用于将两个相同的表整合起来，且会保持两张表的独立性
```

![请添加图片描述](/images/csdn/92ff39a6ea938637ecbe44ad.png)
- ***要求两个矩阵维度完全相同***

# split
split可对矩阵按长度进行分割。

split有两种分割模式：

1. **输入列表**：会根据列表中的值进行分割，**要求列表值之和等于被分割维度元素个数。**
2. **输入数值**：会根据数值进行分割，会分割出若干个等长的矩阵，当剩余长度小于指定长度时，也会将加入返回列表。**要求输入数值小于等于被分割维度元素个数。**
```python
import torch

a = torch.rand(32, 8)
c = torch.stack([a, a, a, a, a, a], dim=0)

print("c.shape: ", c.shape)

def showSplits(ms):
    for index, m in enumerate(ms):
        print("第{}个tensor的shape为 {}".format(
            index + 1, m.shape
        ))
    print()

# 自定义拆分，列表中每个数表示拆分后目标维度的长度
# 要求列表元素和等于目标维度拆分前的长度
ms = c.split([1, 2, 1, 1, 1], dim=0)
print("c.split([1, 2, 1, 1, 1], dim=0):")
showSplits(ms)

# 按长度拆分，输入的值表示每个拆分后的tensor的目标维度的长度
# 最后一个tensor如果长度不够也会返回
ms = c.split(4, dim=0)
print("c.split(4, dim=0):")
showSplits(ms)

ms = c.split(8, dim=1)
print("c.split(8, dim=1):")
showSplits(ms)

ms = c.split(32, dim=1)
print("c.split(32, dim=1):")
showSplits(ms)
```

![请添加图片描述](/images/csdn/a50e11063e1b5b8918170698.png)


# chunck
chunck可按照数量对矩阵进行分割，**将矩阵分割为指定个数**。

**若矩阵可被均匀分割**，则返回指定个数的相同维度矩阵。

**若不可被均匀分割**，则返回的最后一个矩阵维度会较低。
```python
import torch

a = torch.rand(32, 8)
c = torch.stack([a, a, a, a, a, a], dim=0)

print("c.shape: ", c.shape)

def showSplits(ms):
    for index, m in enumerate(ms):
        print("第{}个tensor的shape为 {}".format(
            index + 1, m.shape
        ))
    print()

# 按个数拆分，输入拆分的个数和维度
ms = c.chunk(2, dim=0)
print("c.chunk(2, dim=0):")
showSplits(ms)

ms = c.chunk(3, dim=0)
print("c.chunk(3, dim=0):")
showSplits(ms)

ms = c.chunk(5, dim=1)
print("c.chunk(5, dim=0):")
showSplits(ms)
```

![在这里插入图片描述](/images/csdn/a03cd754569852ac0fdbd9db.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119256939)
