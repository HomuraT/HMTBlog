---
title: "pytorch学习06：Tensor维度变换"
published: 2021-07-28
description: ''
image: ''
tags: ["PyTorch", "Python", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# view reshape 重塑

```python
import torch

a = torch.rand(4, 1, 28, 28)

print("a.shape:", a.shape)
print("a.view(4, 28*28):", a.view(4, 28*28).shape)
print("a.view(4*28, 28):", a.view(4*28, 28).shape)
print("a.view(4, 28, 28):", a.view(4, 28, 28).shape)
print("a.reshape(4, 28, 28):", a.reshape(4, 28, 28).shape)
```
![在这里插入图片描述](/images/csdn/bd11e66ac956e4cad739cd62.png)



- 注意：view的维度乘积与原来维度乘积不同会报错
- view可用reshape相互替换

# unsqueeze 展开

```python
import torch

a = torch.rand(4, 3, 28, 28)

print("a.shape:", a.shape)
# [0] 4 [1] 3 [2] 28 [3] 28 [4]
# 在[0]处添加一个维度
print("a.unsqueeze(0).shape", a.unsqueeze(0).shape)
# 在最后一个，即[4]处添加一个维度
print("a.unsqueeze(-1).shape", a.unsqueeze(-1).shape)
# 在[4]处添加一维
print("a.unsqueeze(4).shape", a.unsqueeze(4).shape)
# 在倒数第四，即[1]处添加一维
print("a.unsqueeze(-4).shape", a.unsqueeze(-4).shape)
# 在倒数第五，即[0]处添加一维
print("a.unsqueeze(-5).shape", a.unsqueeze(-5).shape)
```
![在这里插入图片描述](/images/csdn/31bfbe9659d0064660dd99e2.png)



# squeeze 挤压

```python
import torch

a = torch.rand(1, 32, 1, 1)

# 不给参数会删除所有能删减的维度
# 给了参数会删除特定的维度
print("a.squeeze().shape:", a.squeeze().shape)
print("a.squeeze(0).shape:", a.squeeze(0).shape)
print("a.squeeze(-1).shape:", a.squeeze(-1).shape)
print("a.squeeze(1).shape:", a.squeeze(1).shape)
print("a.squeeze(-4).shape:", a.squeeze(-4).shape)
```

![在这里插入图片描述](/images/csdn/abc986cda6cff5da7b7d7db5.png)


# expand 扩展1：广播

并没有增加内存，只是使用时进行复制

```python
import torch

b = torch.rand(1, 3, 1, 1)

# 只有值为1的维度参能扩展
print("b.expand([2, 3, 2, 2]).shape: ",
      b.expand([2, 3, 2, 2]).shape)

# -1 表示维度保持不变
print("b.expand([-1, -1, -1, -1]).shape: ",
      b.expand([-1, -1, -1, -1]).shape)

# 这个 -4 没有意义且使用时会报错
print("b.expand([-1, 3, -1, -4]).shape: ",
      b.expand([-1, 3, -1, -4]).shape)
```
![在这里插入图片描述](/images/csdn/65544e6c07542af04e5f6978.png)



# repeat 扩展2：复制

复制了数据，增加了内存

```python
import torch

b = torch.rand(1, 3, 1, 1)

# repaet的参数并不是扩展后的维度，而是数据复制的数量
print("b.repeat(2, 3, 2, 2).shape:", b.repeat(2, 3, 2, 2).shape)
print("b.repeat(2, 1, 2, 1).shape:", b.repeat(2, 1, 2, 1).shape)
```
![在这里插入图片描述](/images/csdn/8ff958950408870130b88ec3.png)



# .t 转置

```python
import torch

b = torch.tensor([[1,2,3],
                  [4,5,6]])

print("b:\n", b)
print("b.t():\n", b.t())
```
![在这里插入图片描述](/images/csdn/2d49a3af6b34ab92cca6d1c3.png)



- 注意：转置只适用于2维矩阵

# transpose 维度交换

```python
import torch

a = torch.rand(4, 3, 28, 14)
print("a.transpose(1,3).shape", a.transpose(1,3).shape)

# transpose改变维度并不会改变数据底层存储
# contiguous可用让底层存储与改变后的维度相关
a1 = a.transpose(1,3).contiguous().view(4, 3*28*14).view(4, 3, 28, 14)
a2 = a.transpose(1,3).contiguous().view(4, 3*28*14).view(4, 14, 28, 3).transpose(1, 3)

# 判断元素是否全部相等
print("a == a1? ", torch.all(torch.eq(a, a1)))
print("a == a2? ", torch.all(torch.eq(a, a2)))

# 后三维合并后，在原始数据中的表示为 [14, 28, 3]
# 如果直接重塑为 [3, 28, 14] 会丢失数据原有意义，因此 a 与 a1 不相等
# 先转换成[14, 28, 3]，再交换 14 和 3，就会恢复原始数据，因此 a 与 a2 相等
```
![在这里插入图片描述](/images/csdn/f80cb5e660136f6c60edffad.png)



# permute 维度重排

```python
import torch

a = torch.rand(4, 3, 28, 14)
# 将维度按参数顺序重排列
print("a.permute(3, 2, 1, 0): ", a.permute(3, 2, 1, 0).shape)
print("a.permute(1, 3, 0, 2): ", a.permute(1, 3, 0, 2).shape)
```

![在这里插入图片描述](/images/csdn/5532ac56fedb20ac1d3076b9.png)


- 注意：permute不会改变底层数据存储，需要使用 contiguous 来修改存储方式。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119191109)
