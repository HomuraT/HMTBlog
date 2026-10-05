---
title: "pytorch学习03：张量数据类型和一些操作"
published: 2021-07-23
description: ''
image: ''
tags: ["PyTorch", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 张量数据类型
|  Data type | dtype | CPU tensor | GPU  tensor  |
|--|--|--|--|
| 32-bit floating point|torch.float32 or torch.float|torch.FloatTensor|torch.cuda.FloatTensor |
|64-bit floating point|torch.float64 or torch.double|torch.DoubleTensor|torch.cuda.DoubleTensor|
|16-bit floating point|torch.float16 or torch.half|torch.HalfTensor|torch.cuda.HalfTensor|
|8-bit integer(unsigned)|torch.uint8|torch.ByteTensor|torch.cuda.ByteTensor|
|8-bit integer(signed)|torch.int8|torch.CharTensor|torch.cuda.CharTensor|
|16-bit integer(signed)|torch.int16 or torch.short|torch.ShortTensor|torch.cuda.ShortTensor|
|32-bit integer(signed)|torch.int32 or torch.int|torch.IntTensor|torch.cuda.IntTensor|
|64-bit integer(signed)|torch.int64 or torch.long|torch.LongTensor|torch.cuda.LongTensor|

# 类型使用

**示例1：类型比较**

```python
import torch

# 随机初始化
a = torch.randn(2, 3)

print("a.type(): ", a.type())
print("type(a): ", type(a))
print("type of 'a' is torch.FloatTensor: ",
      isinstance(a, torch.FloatTensor))
```
![在这里插入图片描述](/images/csdn/f46a6dcb2c10bde6ec0ad27e.png)



**示例2：同一数据被部署在CPU和GPU上类型不同**

```python
import torch

# 随机初始化
a = torch.randn(2, 3)

print(isinstance(a, torch.cuda.FloatTensor))
# 如果没有开启cuda会报错
a = a.cuda()
print(isinstance(a, torch.cuda.FloatTensor))
```
![在这里插入图片描述](/images/csdn/bacc89d314ad24ea24bd5015.png)



**示例3：标量**

```python
import torch

a = torch.tensor(1.)
print("a: ", a)

b = torch.tensor(1.3)
print("b: ", b)
```
![在这里插入图片描述](/images/csdn/14940afb20a7191698289d68.png)


**示例4：标量的shape**

```python
import torch

a = torch.tensor(2.2)
print("a.shape: ", a.shape)
print("len(a.shape): ", len(a.shape))
print("a.dim(): ", a.dim())
print("a.size(): ", a.size())
```
![在这里插入图片描述](/images/csdn/cebea02b7478ebe0880a5c26.png)



**示例5：一维张量**

```python
import numpy as np
import torch

print(torch.tensor([1.1]))
print(torch.tensor([1.1, 2.2]))
print(torch.FloatTensor(1))
print(torch.FloatTensor(2))

data = np.ones(2)
print("data: ", data)
data = torch.from_numpy(data)
print("tensor from numpy:", data)

print("data.shape: ", data.shape)
print("data.dim(): ", data.dim())
print("data.size(): ", data.size())
```
![在这里插入图片描述](/images/csdn/de2580e2b9465f3e48aeb711.png)



**示例6：二位张量**

```python
import torch

a = torch.randn(2, 3)
print("a:", a)
print("a.shape:", a.shape)
print("a.size():", a.size())
print("a.size(0):", a.size(0))
print("a.size(1):", a.size(1))
print("a.shape[1]:", a.shape[1])
print("a.dim():", a.dim())
```
![在这里插入图片描述](/images/csdn/75ee5ec29883069be72fe6e0.png)



**示例7：三维张量**

```python
import torch

# 随机均匀分布初始化
a = torch.rand(2, 2, 3)

print("a:", a)
print("list(a.shape):", list(a.shape))
print("a.size():", a.size())
print("a.size(0):", a.size(0))
print("a.size(1):", a.size(1))
print("a.shape[1]:", a.shape[1])
print("a.dim():", a.dim())
```

![在这里插入图片描述](/images/csdn/02a684967a786ac011ddbc33.png)

**示例8：获得总元素个数**

```python
import torch

# 随机均匀分布初始化
a = torch.rand(2, 2, 3)

# 返回a的总元素个数 2 * 2 * 3
print("a.numel():", a.numel())
```
![在这里插入图片描述](/images/csdn/1ee2e4f2ca45be6b731fc4a1.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119033339)
