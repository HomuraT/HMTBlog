---
title: "pytorch学习15：DataSet和DataLoader"
published: 2021-08-26
description: ''
image: ''
tags: ["PyTorch", "深度学习", "Python", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

pytorch在`torch.utils.data` 对常用数据加载进行了封装，可用很容易实现数据读取和批量加载。

# DataSet

DataSet 是 pytorch 提供的用于包装数据的抽象类。可以通过继承并实现其中的抽象方法来自定义DataSet。

自定义DataSet要继承并实现两个成员方法：

1. `__getitem__(self, idx)` ：该方法需要实现通过索引获得一条数据。
2. `__len__(self)` ：该方法需要返回数据集的长度。

# DataLoader

DataLoader提供了对DataSet的读取操作，常用参数有：

1. `batch_size` ：每个批次的大小。
2. `shuffle` ：是否对数据进行洗牌操作。
3. `num_work`：加载数据时使用几个子进程。

# 示例

在样例中，生成了$[0, 400)$的整数的序列，并将其转换为 $[100, 2, 2]$ 的矩阵。

**示例代码：**

```python
from torch.utils.data import Dataset
import torch

class MyDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        return self.data[index]

if __name__ == '__main__':
    # 创建数据
    data = torch.range(0, 399)
    data = data.view(100, 2, 2)
    # 创建自己的DataSet
    ds = MyDataset(data)
    # 输出数据信息
    print('数据集长度：', len(ds))
    print('ds[0]: ', ds[0])

    # DataLoader提供了DataSet的读取操作
    dl = torch.utils.data.DataLoader(
        ds, batch_size=2, shuffle=True, num_workers=0
    )

    # 获取一批数据，即前2个数据
    itDl = iter(dl)
    print('next(itDl): ', next(itDl))
```

**输出结果：**

```python
数据集长度： 100
ds[0]:  tensor([[0., 1.],
        [2., 3.]])
next(itDl):  tensor([[[276., 277.],
         [278., 279.]],

        [[284., 285.],
         [286., 287.]]])
```

从结果可以看出，DataLoader对数据进行了洗牌，并以每批次2个数据输出。

**注意：**

这里的`MyDataSet` 仅做了简单实现，并不一定只能传入数据，也可以传入文件路径等，然后对数据进行读取并保存。

**如：**

```python
#定义一个数据集
class BulldozerDataset(Dataset):
    """ 数据集演示 """
    def __init__(self, csv_file):
        """实现初始化方法，在初始化的时候将数据读载入"""
        self.df=pd.read_csv(csv_file)
    def __len__(self):
        '''
        返回df的长度
        '''
        return len(self.df)
    def __getitem__(self, idx):
        '''
        根据 idx 返回一行数据
        '''
        return self.df.iloc[idx].SalePrice
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/119940136)
