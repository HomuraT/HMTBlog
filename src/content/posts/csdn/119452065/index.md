---
title: "pytorch学习11：where 和 gather"
published: 2021-08-06
description: ''
image: ''
tags: ["PyTorch", "人工智能", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# where

where语法：**`torch.where(condition, x, y)`**

- 要求：condition、x、y矩阵的阶数(shape)必须相同，返回值也是相同阶数的矩阵
- condition：条件矩阵，当元素为 **True** 时，填入 **x** 中对应的元素，否则填入 **y** 中对应的元素
- x：condition中元素为 True 时将从 x 中选取元素
- y：condition中元素为 False 时将从 y 中选取元素

**示例一：c = max(a, b)**

```python
import torch

a = torch.randn(3, 3)
b = torch.randn(3, 3)

print("a:\n{}\n".format(a))
print("b:\n{}\n".format(b))

c = torch.where(a>b, a, b)

print("c:\n{}\n".format(c))
```

![请添加图片描述](/images/csdn/db6f4d98cb081de796cfecdf.png)


**示例二：二分类预测**

```python
import torch

"""
假设 p 为二分类预测后的概率
当 p>0.5 时标识为 1
否则 标识为 0
"""

p = torch.rand(3, 3)

print("p:\n{}\n".format(p))

c = torch.where(p>0.5, 1, 0)

print("c:\n{}\n".format(c))
```

![请添加图片描述](/images/csdn/ecda5aa1f640c7b933ad0075.png)


# gather

gather语法：**`torch.gather(input, dim, index)`**，下面的变量说明是按自己理解写的

- input: 替换词典矩阵
- dim: 替换方向
- index: 需要替换的矩阵，**类型必须为 `int64`**

## 一维

示例：

```python
import torch

_index = torch.trunc(torch.rand(8) * 10).long()

_input = torch.tensor(
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

print("_index:\n{}\n".format(_index))

print("_input:\n{}\n".format(_input))
_output = torch.gather(_input, 0, _index)
print("_output:\n{}\n".format(_output))
```

![请添加图片描述](/images/csdn/96cdf1de7030d6ad05702848.png)


- 要求 input 的列数大于 index 中元素的最大值。
- 可以理解为把 **index** 中元素看作 **input** 的索引，用 **input** 中相应的元素替换 **index**，然后返回替换后的矩阵。
- 返回的矩阵与 **index** 阶数(shape)相同

## 二维

### dim=1

**示例一：input相同**

```python
import torch

_index = torch.trunc(torch.rand(2, 8) * 10).long()

_input = torch.tensor(
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

print("_index:\n{}\n".format(_index))

# 将 input 扩展为 2x10
_input = _input.expand(2, 10)
print("_input:\n{}\n".format(_input))
_output = torch.gather(_input, 1, _index)
print("_output:\n{}\n".format(_output))
```

![请添加图片描述](/images/csdn/d099614f86f0f8b75615291d.png)


- 要求 input 的行数与 index 相同，列数要求与一维一致
- 可以理解为两个一维的gather
- 对 index 的两行数据进行同中替换

**示例二：input不同**

```python
import torch

_index = torch.trunc(torch.rand(2, 8) * 10).long()

_input = torch.tensor(
    [[10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
     [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]])

print("_index:\n{}\n".format(_index))

print("_input:\n{}\n".format(_input))
_output = torch.gather(_input, 1, _index)
print("_output:\n{}\n".format(_output))
```

![请添加图片描述](/images/csdn/57b0bc5e1178ac14d1f71d76.png)


- 要求input行列与 **上个例子** 一致
- 可以理解为对 index 的两行以不同的标准进行替换

### dim=0

示例：

```python
import torch

_index = torch.trunc(torch.rand(2, 8) * 10).long()

_input = torch.tensor(
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

print("_index:\n{}\n".format(_index))

# 将 input 切换为列向量，且将列扩展到与 index 列相同
_input = _input.view(10, 1).expand(10, 8)
print("_input:\n{}\n".format(_input))
_output = torch.gather(_input, 0, _index)
print("_output:\n{}\n".format(_output))
```

![请添加图片描述](/images/csdn/0cce991e9aca032daeaf98ef.png)

- 与 **dim=1** 很类似，可以理解为对每列进行替换
- input 的要求也与 **dim=1** 一致

## 三维

```python
import torch

_index = torch.trunc(torch.rand(2, 2, 8) * 10).long()

_input = torch.tensor(
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

print("_index:\n{}\n".format(_index))

_input = _input.expand(2, 2, 10)
print("_input:\n{}\n".format(_input))
_output = torch.gather(_input, 2, _index)
print("_output:\n{}\n".format(_output))
```
![请添加图片描述](/images/csdn/0bd6ffa97ff006ad5a5e0950.png)


- 与一维和二维很类似

## 关于 gather 的一些理解

- **input 的要求为：**

    维数与index一致，且除了 dim 指定的维度外，每个维度的长度都要与 index 相应维度相同。

    dim指定的维度长度要大于 index 元素的最大值。

- **关于 input 每 行/列 是否相同：**

    虽然可以自定义让 input 不同 行/列 之间有所区别，从而让 index 替换的内容产生变化。但这样做的意义不大，且在高维度的时候自定义 input 会很麻烦。个人感觉用的最多的还是让 input 对所有要替换的 index 做同一替换。

- **关于 gather：**

    gather的使用可以理解为 **中文汉字和拼音的替换** ，一维表示对一个句子进行替换，二维表示对一篇文章进行替换，三维表示对一本书进行替换。如：[我, 爱, 你] → [wo, ai, ni]。

# 总结

where 和 gather 的功能我们都可以通过自己写代码来实现，但 where 和 gather 底层优于自己写的代码，因此速度快很多。因此能用 where 和 gather 就尽量用。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119452065)
