---
title: "pytorch学习12：自动求导"
published: 2021-08-16
description: ''
image: ''
tags: ["深度学习", "Python", "人工智能", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# autograd.grad

**示例：**

使用损失函数为均方差

原函数形式为：$y = wx+b$

```python
import torch.nn.functional as F
import torch

x = torch.tensor(2)
# 可以在初始化时声明需要参数
# 即设置 requires_grad=True
# 若此时不声明，则需要执行 w.requires_grad_() 声明
w = torch.full([1], 2, requires_grad=True, dtype=torch.float)
b = torch.tensor([1], dtype=torch.float)

# 需要执行 requires_grad_() 方法表示需要梯度
# 否则会报错
# RuntimeError: element 0 of tensors does not require grad and does not have a grad_fn
# w.requires_grad_()
b.requires_grad_()

# 想要获得梯度，必须在计算误差之间声明需要梯度
y_ = x*w+b
# 这里 data 表示只输出数据
# 若不加，则会输出 tensor([5.], grad_fn=<AddBackward0>)
print("x*w+b = ", y_.data)

# 假设真实 y = 1
mse = F.mse_loss(torch.ones(1), y_)
print("mse:", mse.data)

w_grad, b_grad = torch.autograd.grad(mse, [w, b])
print("w_grad:", w_grad)
print("b_grad:", b_grad)
```

![在这里插入图片描述](/images/csdn/74c83a600f3abec9d38161ae.png)

# loss.backward

backward方法会将梯度直接应用在变量上，通过 **`.grad`** 来获得梯度

示例：

```python
import torch.nn.functional as F
import torch

x = torch.tensor(2)
w = torch.full([1], 2, requires_grad=True, dtype=torch.float)
b = torch.tensor([1], dtype=torch.float)

b.requires_grad_()

y_ = x*w+b
print("x*w+b = ", y_.data)

mse = F.mse_loss(torch.ones(1), y_)
print("mse:", mse.data)

# 使用backword来自动求导
mse.backward()

# 通过 .grad 获得梯度
print("w_grad:", w.grad)
print("b_grad:", b.grad)
```

![在这里插入图片描述](/images/csdn/dc6bd268834729f91e057881.png)


# 其他操作

使用 `.requires_gard_()` 可以改变张量的 `requires_gard` 属性。

```python
import torch

a = torch.randn(2, 2)
a = ((a * 3) / (a - 1))
print(a.requires_grad)
a.requires_grad_(True)
print(a.requires_grad)
```
![在这里插入图片描述](/images/csdn/162dd164ac7cbd27d14ee201.png)



# 一些其他示例

## softmax自动求导

```python
import torch.nn.functional as F
import torch

x = torch.tensor([2, 1, 0.1], requires_grad=True)
print("x:", x)
output_ = F.softmax(x, dim=0)
print("output_:", output_)

# 会报错，显示：只能为标量输出隐式创建梯度
# o.backward()

# 会报错，显示：只能为标量输出隐式创建梯度
# 不能直接写 torch.autograd.grad(output_, x)

# 对 softmax[0] 求梯度
# 因为 x 有三个数，所以会有 3 个梯度
o0_grad = torch.autograd.grad(output_[0], x)
print(o0_grad)
print("p0 * (1 - p0) = ", (output_[0] * (1 - output_[0])).data)
print("-(p0 * p1) = ", (- output_[0] *  output_[1]).data)
print("-(p0 * p2) = ", (- output_[0] *  output_[2]).data)
```
![在这里插入图片描述](/images/csdn/f8e393c4e9ebfbb3820a9259.png)



## 链式法则

```python
import torch.nn.functional as F
import torch

x = torch.tensor(3)
b1 = torch.tensor(1)
w1 = torch.tensor(2., requires_grad=True)
b2 = torch.tensor(1)
w2 = torch.tensor(2., requires_grad=True)

u = x*w1 + b1
y = u*w2 + b2

def d(y, x):
    # retain_graph=True 表示可以反复求导，否则只能求一次
    return torch.autograd.grad(y, x, retain_graph=True)

# 通过 pytorch 直接求导
print("dy_dw1 = ", d(y, w1))
# 通过链式法则求导
print("dy_du * du_dw1 = %s * %s" % (d(y, u), d(u, w1)))
```

![在这里插入图片描述](/images/csdn/724aba9610e3b49df16d2957.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119742227)
