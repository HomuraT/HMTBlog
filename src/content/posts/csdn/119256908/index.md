---
title: "pytorch学习07：Broadcast广播——自动扩展"
published: 2021-07-30
description: ''
image: ''
tags: ["人工智能", "Python", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

pytorch在矩阵相加时，会自动根据矩阵的阶数进行自动扩展。

在一定条件下，可用让阶数不同的矩阵相加。

示例：

```python
import torch

a1 = torch.tensor([
    [0, 0, 0],
    [10, 10, 10],
    [20, 20, 20],
    [30, 30, 30]
])

b1 = torch.tensor([
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 2]
])

b2 = torch.tensor([
    [0, 1, 2]
])

a2 = torch.tensor([
    [0],
    [10],
    [20],
    [30]
])

print("a1+b1= \n", a1+b1)
print("a1+b2= \n", a1+b2)
print("a2+b2= \n", a2+b2)
```

![请添加图片描述](/images/csdn/8a84254acfdc35b31a881efb.png)
![请添加图片描述](/images/csdn/1e9631bd6a5b2aa99bc4961a.png)


**Broadcast的优点：**

- 可用使运算更方便
- 可用节省内存空间

一些样例：

```python
[4, 32, 14, 14]
[1, 32, 1, 1] => [4, 32, 14, 14]

[4, 32, 14, 14]
[14, 14] => [1, 1, 14, 14] => [4, 32, 14, 14]

[4, 32, 14, 14]
[2, 32, 14, 14] # 不能自动扩展，需要自己扩展
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119256908)
