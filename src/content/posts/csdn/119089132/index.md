---
title: "pytorch学习04：Tensor的创建"
published: 2021-07-25
description: ''
image: ''
tags: ["Python", "深度学习", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# **用 numpy 创建 tensor：**

```python
import numpy as np
import torch

a_np = np.array([2,3.3])
a_tensor = torch.from_numpy(a_np)
print("a_tensor: ", a_tensor)
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-alJFh91d-1627223223967)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f00cdf47-ac8a-4088-a3ba-09b209669f00/Untitled.png)\]](/images/csdn/39096cf7fc15ab323ac7ac4a.png)


# **用 list 创建 tensor**

```python
import torch

a_list = [2,3.3]
a_torch = torch.tensor(a_list)
print("a_torch: ", a_torch)
print("a_torch.dtype: ", a_torch.dtype)
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-alyWwX3d-1627223223970)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ee8b79d7-b15a-4158-8ce3-e72525a984a1/Untitled.png)\]](/images/csdn/340c6cb014fe7c72b5413808.png)


# **Tensor与tensor**

```python
import torch

data = [1,2.1]

print("Tensor(data):\n", torch.Tensor(data))
print("Tensor(2,3):\n", torch.Tensor(2,3))
print("tensor(data):\n", torch.tensor(data))
try:
    print("tensor(2,3):\n", torch.tensor(2,3))
except TypeError as e:
    print("tensor(2,3)代码运行报错")
    print(e)
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-DVIpX0nd-1627223223971)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/45c92f39-eefc-4aa4-812a-7fde886abfa4/Untitled.png)\]](/images/csdn/563ddc1f3f062e8f055aabcf.png)


- tensor只能转换数值数据，不能输入shape数据
- Tensor既能转换数值数据，也能输入shape数据

# **未初始化**

```python
import torch

print("torch.empty([2,3]):\n", torch.empty([2,3]))
print("torch.empty(2,3):\n", torch.empty(2,3))
# 这里等价于 torch.tensor([1,2])
print("torch.FloatTensor([2,3]):\n", torch.FloatTensor([2,3]))
print("torch.FloatTensor(2,3):\n", torch.FloatTensor(2,3))
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-dEeHJTMq-1627223223973)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/46d56877-e30a-4481-887a-834d3ea6859c/Untitled.png)\]](/images/csdn/a362d78676dbe68973e42095.png)


- 在创建张量后，要记得初始化，不然可能会对之后运算造成严重影响。

# **设置默认类型**

```python
import torch

print(torch.tensor([1,2.3]).type())
torch.set_default_tensor_type(torch.DoubleTensor)
print(torch.tensor([1,2.3]).type())
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-yFxTBsKv-1627223223975)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/32c315b3-f8ff-46d2-a66e-a87efd373903/Untitled.png)\]](/images/csdn/814e0f98db611e9ac6bfa51c.png)


# **数据初始化1，均匀分布**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}".format(tname, t))
    print("{}平均值:{}\n".format(tname, t.sum() / t.numel()))

# rand函数会随机产生[0, 1)的均匀分布数值
a = torch.rand(3, 3)
showMsg(a, "rand")

# 根据输入的shape生成一个[0,1)均匀分布矩阵
a_like = torch.rand_like(a)
showMsg(a_like, "a_like")

# 输入最小值 min，最大值 max 和矩阵阶数 shape
# 生成符合均匀分布的范围为[min, max)的整形矩阵
a_int = torch.randint(1, 10, [3, 3])
showMsg(a_int, "a_int")

a_int_like = torch.randint_like(a_int, 1, 10)
showMsg(a_int_like, "a_int_like")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-9RzSTfY3-1627223223976)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8dac0f82-861d-48d9-9fd3-cfcd3d7884f4/Untitled.png)\]](/images/csdn/00880b6eafd109ec67aa868f.png)


# **数据初始化2，正态分布**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}".format(tname, t))
    mean = t.sum() / t.numel()
    print("{}平均值:{}".format(tname, mean))
    print("{}方差:{}\n".format(tname, ((t - mean) ** 2).sum() / t.numel() ))

# 生成N(0,1)的标准正态分布
showMsg(torch.randn(300,300), "标准正态分布")

'''
生成符合一定条件的正态分布矩阵
torch.normal(mean, standard_Deviation, shape)
mean: 均值
standard_Deviation: 标准差
shape: 生成矩阵的阶数
'''
a = torch.normal(1, 10 ,(300, 300))
showMsg(a, "正态分布")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-cuOJjzIx-1627223223977)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e631db4e-1cf9-4c2f-aee9-3fd2db9c11ff/Untitled.png)\]](/images/csdn/a876c22ff039eeea5472e35f.png)



# **统一初始化**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

showMsg(torch.full([2, 3], 0), "full0")
showMsg(torch.full([3, 3], 1), "full1")
showMsg(torch.full([], 2), "full2")
showMsg(torch.full([1], 3), "full3")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-nqFox7bj-1627223223977)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5e29a12-d5ab-4358-bbb2-ed8f86749f7d/Untitled.png)\]](/images/csdn/99bfdd0b8bafd979312762c0.png)


# **创建序列1，按步长创建**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

# 生成[0, 10)的等差数列，默认步长为1
showMsg(torch.arange(0, 10), "arange0-10")
showMsg(torch.arange(0, 10,2), "arange0-10,step=2")

# 生成[0, 10]的等差数列，默认步长为1
showMsg(torch.range(0, 10), "range0-10")
showMsg(torch.range(0, 10, 2), "range0-10,step=2")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-8FbsdTZB-1627223223978)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dc228da5-2cc7-406b-94a4-f7e168c1a59b/Untitled.png)\]](/images/csdn/eb8c7244e34e6e9259d33f7c.png)


- ***注：torch.range在使用时会报警告UserWarning，不建议使用，尽量用arange。***

# **创建序列2，按数量创建**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

# 生成[0, 10]的等差数列，默认个数为100
showMsg(torch.linspace(0, 10), "linspace默认数量")
showMsg(torch.linspace(0, 10, steps=4), "linspace, steps=4")

# 生成[0, 10]的等差数列L1，然后以L1为幂进行运算，并返回运算结果
# 默认底为 10，生成数量为100
# 下面代码的结果等价于[10^0, 10^0.1010, ... , 10^1]
showMsg(torch.logspace(0, 1), "logspace")

# [2^0, 2^0.33, 2^0.66, 2^1]
showMsg(torch.logspace(0, 1, base=2, steps=4), "logspace,base=2, steps=4")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-DedeaYWx-1627223223978)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c3888cf9-9535-43ff-904b-a73c1861e56c/20210725220738.png)\]](/images/csdn/631e0604ab8c9923488aab87.png)

- ***注意：使用时不指定数量会报警告UserWarnig，尽量指定生成数量steps。***

# **创建全1矩阵、全0矩阵**

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

a = torch.ones(3, 3)
showMsg(a, "全1矩阵")
showMsg(torch.ones_like(a), "全1矩阵_like")
showMsg(torch.zeros(3, 3), "全0矩阵")
showMsg(torch.zeros_like(a), "全0矩阵_like")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-cJ9ndvjI-1627223223979)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/125e0d73-5746-4d9a-801d-dd400d2cd75a/Untitled.png)\]](/images/csdn/c4a33b7b81302ad04103f040.png)



# 创建单位矩阵

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

showMsg(torch.eye(3,3), "单位矩阵1")
showMsg(torch.eye(3,4), "单位矩阵2")
showMsg(torch.eye(3), "单位矩阵3")
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-1yT2gAWC-1627223223979)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/647269cb-fb28-4482-b8cb-6c293ffbdaed/Untitled.png)\]](/images/csdn/b555eb4efd26f13c4800264d.png)




# 随机打乱

```python
import torch

def showMsg(t, tname):
    print("{}:\n{}\n".format(tname, t))

# 生成[0, 10)的整数序列并打散
# 可用此来打散索引
showMsg(torch.randperm(10), "randperm")

# 简单使用例子
math_scores = [
    ["张三", 90],
    ["李四", 85]
]

english_scores = [
    ["张三", 80],
    ["李四", 90]
]

idx = torch.randperm(2)
print("姓名\t数学\t英语")
for i in idx:
    print("{}\t{}\t{}".format(math_scores[i][0], math_scores[i][1], english_scores[i][1]))
```

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-49RzJwGL-1627223223981)(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b0aa5265-c14d-4198-aae9-babab68a873f/Untitled.png)\]](/images/csdn/08178cdf188a570b6b85a448.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119089132)
