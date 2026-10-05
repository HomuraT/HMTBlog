---
title: "pytorch学习09：矩阵基本运算"
published: 2021-08-03
description: ''
image: ''
tags: ["PyTorch", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 四则运算

```python
import torch

a = torch.tensor([
    [1,2],
    [3,4]
])

b = torch.tensor([
    [10, 20]
])

# 加
print("torch.all(torch.eq(a+b, torch.add(a,b))):",
      torch.all(torch.eq(a+b, torch.add(a,b))))
print("a+b:\n{}\n".format(a+b))

# 减
print("torch.all(torch.eq(a-b, torch.sub(a,b))):",
      torch.all(torch.eq(a-b, torch.sub(a,b))))
print("a*b:\n{}\n".format(a-b))

# 乘（是点乘）
print("torch.all(torch.eq(a*b, torch.mul(a,b))):",
      torch.all(torch.eq(a*b, torch.mul(a,b))))
print("a*b:\n{}\n".format(a*b))

# 除
print("torch.all(torch.eq(a/b, torch.div(a,b))):",
      torch.all(torch.eq(a/b, torch.div(a,b))))
print("a*b:\n{}\n".format(a/b))
```

![请添加图片描述](/images/csdn/9c2a2a790b60bbd750c66e48.png)


# 矩阵相乘

```python
import torch

a = torch.tensor([
    [1],
    [3]
])

b = torch.tensor([
    [10, 20]
])

# mm只能运算至多二维矩阵
print("torch.mm(a, b):\n{}\n".format(torch.mm(a, b)))
# matmul可运算更高维矩阵
print("torch.matmul(a, b):\n{}\n".format(torch.matmul(a, b)))
print("a@b:\n{}\n".format(a@b))
```

![请添加图片描述](/images/csdn/2689da3a9b94b5f5f24bd0ed.png)

# 大于2维的矩阵相乘

```python
import torch

a1 = torch.rand(4, 3, 28, 64)
b1 = torch.rand(4, 3, 64, 32)

c1 = torch.matmul(a1, b1)
# 对最后两维进行乘法运算
# 可以理解为多个矩阵并行相乘
print("c1.shape: ", c1.shape)

a2 = torch.rand(4, 1, 28, 64)
b2 = torch.rand(4, 3, 64, 32)
c2 = torch.matmul(a2, b2)
# 这里用到了广播机制
print("c2.shape: ", c2.shape)
```

![请添加图片描述](/images/csdn/14803145dd4cedb2ef507040.png)


# 幂运算

```python
import torch

a = torch.tensor([
    [1, 2],
    [3, 4]
])

print("a.pow(2):\n{}\n".format(a.pow(2)))
print("a**2:\n{}\n".format(a**2))

print("a.pow(0.5):\n{}\n".format(a.pow(0.5)))
print("a.sqrt():\n{}\n".format(a.sqrt()))
# 平方根的倒数
print("a.rsqrt():\n{}\n".format(a.rsqrt()))
print("a**0.5:\n{}\n".format(a**0.5))
```

![请添加图片描述](/images/csdn/f612350475164b4f3b1bbdbc.png)


# exp log

```python
import torch

a = torch.tensor([
    [1, 2],
    [3, 4]
])

a_exp = torch.exp(a)
# e^x
print("torch.exp(a):\n{}\n".format(a_exp))
# ln x
# 以2为底：log2
# 以10为底：log10
print("torch.log(a_exp):\n{}\n".format(torch.log(a_exp)))
```

![请添加图片描述](/images/csdn/7e815816eb2c722c6824ec25.png)


# 近似值

```python
import torch

a = torch.tensor(1.67)

# 向下取整
print("a.floor():", a.floor())
# 向上取整
print("a.ceil():", a.ceil())
# 取整数部分
print("a.trunc():", a.trunc())
# 取小数部分
print("a.frac():", a.frac())
# 四舍五入
print("a.round():", a.round())
```

![请添加图片描述](/images/csdn/230e431c1b0bbb3d53d7dc0d.png)


# 最大值、最小值、中位数

```python
import torch

a = torch.rand(2,3)*20

print("a:\n{}\n".format(a))

# 最大值
print("a.max(): ", a.max())
# 中位数，偶数时不取平均，取从小到大第 length/2 个
print("a.median(): ", a.median())
# 最小值
print("a.min(): ", a.min())
```

![请添加图片描述](/images/csdn/805d72eb84a9be98ed499ae8.png)


# 限制区间

```python
import torch

a = torch.rand(2,3)*20

print("a:\n{}\n".format(a))

# clamp(min)，当有值小于 min 时，用 min 替换
print("a.clamp(10):\n{}\n".format(a.clamp(10)))
# clamp(min, max)，当有值小于 min 时，用 min 替换
# 当有值大于 max 时，用 max 替换
print("a.clamp(5, 10):\n{}\n".format(a.clamp(5, 10)))
```

![请添加图片描述](/images/csdn/917495ba5971468ee257c3a4.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119360199)
