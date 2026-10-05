---
title: "pytorch学习10：统计运算"
published: 2021-08-03
description: ''
image: ''
tags: ["Python", "深度学习", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 范数 norm

```python
import torch

a = torch.ones(8)
b = torch.ones(2, 4)
c = torch.ones(2, 3, 4)

print("a:\n{}".format(a))
print("b:\n{}".format(b))
print("c:\n{}".format(c))

# norm1 = sum(|x|)
print("a.norm(1): {}, b.norm(1): {}, c.norm(1): {}".format(
    a.norm(1), b.norm(1), c.norm(1)
))

# norm2 = sqrt(sum(x**2))
print("a.norm(2): {}\nb.norm(2): {}\nc.norm(2): {}".format(
    a.norm(2), b.norm(2), c.norm(2)
))

print("b.norm(1, dim=1): ", b.norm(1, dim=1))
print("b.norm(2, dim=1): ", b.norm(2, dim=1))
print("c.norm(1, dim=0): \n", c.norm(1, dim=0))
print("c.norm(2, dim=0): \n", c.norm(2, dim=1))
```

![请添加图片描述](/images/csdn/5b96b5025b3ef07327924405.png)


- dim指定哪个维度就会在哪个维度上求范数
- 如：[2, 3, 4]
    - dim = 0  → [3, 4]
    - dim = 1 → [2, 4]
    - dim = 2 → [2, 3]

# 平均、求和、最小、最大、累乘

```python
import torch

a = torch.arange(8).view(2, 4).float() + 1
print("a:\n{}\n".format(a))

# 最小值
print("a.min(): ", a.min())
# 最小值
print("a.max(): ", a.max())
# 平均值
print("a.mean(): ", a.mean())
# 累乘
print("a.prod(): ", a.prod())
# 求和
print("a.sum(): ", a.sum())
# 最大值的索引
# 若不带参数，argmax和argmin会把矩阵打平
print("a.argmax(): ", a.argmax())
# 最小值的索引
print("a.argmin(): ", a.argmin())
```

![请添加图片描述](/images/csdn/4ca8cb21422283edc3a29860.png)


# argmin、argmax

```python
import torch

a = torch.arange(8).view(2, 4).float() + 1
print("a:\n{}\n".format(a))

print("a.argmax(): ",a.argmax())
# dim 指定在哪一位上取最大值或最小值索引
print("a.argmax(dim=0): ", a.argmax(dim=0))
print("a.argmin(dim=1): ", a.argmin(dim=1))
```

![请添加图片描述](/images/csdn/eca696021e3614b6d47875da.png)


# dim和keepdim

```python
import torch

a = torch.randn(4, 10)
print("a.max(dim=1):\n{}\n".format(a.max(dim=1)))
print("a.argmax(dim=1): ", a.argmax(dim=1), "\n")

# keepdim=True 会使结果维数不变
# 有时可以方便运算
print("a.max(dim=1, keepdim=True):\n{}\n".format(
    a.max(dim=1, keepdim=True))
)

print("a.argmax(dim=0, keepdim=True):\n{}\n".format(
    a.argmax(dim=0, keepdim=True))
)
```

![请添加图片描述](/images/csdn/80d8375ae5d689b65e0cee59.png)


# top-k 和 k-th

```python
import torch

a = torch.randn(4, 10)
# 在第二维最大前三个
print("a.topk(3, dim=1):\n{}\n".format(a.topk(3, dim=1)))
# 在第二维取最小前三个
print("a.topk(3, dim=1, largest=False):\n{}\n".format(
    a.topk(3, dim=1, largest=False))
)

# 在第二维上取第八大的值
print("a.kthvalue(8, dim=1):\n{}\n".format(
    a.kthvalue(8, dim=1)
))

# 在第一维上取第三大的值
print("a.kthvalue(3, dim=0):\n{}\n".format(
    a.kthvalue(3, dim=0)
))
```

![请添加图片描述](/images/csdn/31bfde687d4965e7f791f43c.png)


# 比较运算

```python
import torch

a = torch.arange(-4, 4).view(2, 4)

print("a:\n{}\n".format(a))
print("a>0:\n{}\n".format(a>0))
# gt -> greater 大于
print("torch.equal(a>0, torch.gt(a, 0)):",
      torch.equal(a>0, torch.gt(a, 0)))

print("a==0:\n{}\n".format(a==0))
# eq(a, b) 会返回一个矩阵，矩阵每个元素表示该位置的元素是否相等
# equal(a, b) 会返回一个 布尔值，表示两矩阵是否完全相等
print("torch.equal(a==0, torch.eq(a, 0)):",
      torch.equal(a==0, torch.eq(a, 0)))

print("a>=0:\n{}\n".format(a>=0))
# ge greater or equal
print("torch.equal(a>=0, torch.ge(a, 0)):",
      torch.equal(a>=0, torch.ge(a, 0)))
```

![请添加图片描述](/images/csdn/5de2d2493d2da65ad6ef9a0c.png)


- 小于和小于等于可直接使用符号 `< <=` 或在 `ge gt`时将矩阵反转

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119360285)
