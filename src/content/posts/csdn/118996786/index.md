---
title: "pytorch学习02：手写数字识别"
published: 2021-07-22
description: ''
image: ''
tags: ["深度学习", "Python", "PyTorch", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 描述

手写数字识别是一个深度学习中的经典案例，pytorch也提供了简单的 **MNIST数据集（手写数字数据集）** 加载方法，很适合初学者尝试。

本次在各种教程的帮助下，实现了手写数字识别。

# 介绍

## Utils

实现了一些方便处理数据和展示数据的方法。

## 加载数据

使用pytorch自带的方法加载数据集，并作一定的数据处理，如更改数据格式和正则化。

## 创建网络

本次使用的网络的结构为三层全连接层，其中前两层的激活函数为 $Relu$，最后一层的激活函数为 $Softmax$。

## 训练

训练使用的优化器为 $Adam$ ，学习率设置为 $0.01$，损失函数为 $mse（均方差）$。对于损失函数，其实本来想用交叉熵，但由于刚学所以不太会用pytorch。

# 实现代码

```python
import torch
from matplotlib import pyplot as plt

# 如果不加则会出现如下错误，且不会显示图片
# Error #15: Initializing libiomp5md.dll...
import os
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
#

# Utils
def plot_curve(data):
    '''
    绘制曲线

    :param data: 数据
    :return: 无
    '''

    fig = plt.figure()
    plt.plot(range(len(data)), data, color="blue")
    plt.legend(["value"], loc="upper right")
    plt.xlabel("step")
    plt.ylabel("value")
    plt.show()

def plot_image(img, label, name):
    '''
    画图片

    :param img:
    :param label:
    :param name:
    :return:
    '''

    fig = plt.figure()
    for i in range(6):
        plt.subplot(2, 3, i + 1)
        plt.tight_layout()
        plt.imshow(img[i][0] * 0.3081 + 0.1307,
                   cmap="gray",
                   interpolation="none")
        plt.title("{}:{}".format(name, label[i].item()))
        plt.xticks([])
        plt.yticks([])
    plt.show()

def one_hot(label, depth=10):
    '''
    独热码转换，将标签转化为独热码

    :param label: 标签
    :param depth: 独热码的维度
    :return: 与标签相对的独热码
    '''

    out = torch.zeros(label.size(0), depth)
    idx = torch.LongTensor(label).view(-1, 1)
    out.scatter_(dim=1, index=idx, value=1)
    return out

# end Utils

# code
from torch import nn
from torch.nn import functional as F
from torch import optim

import torchvision

# 1 加载数据
def load_data():
    '''
    加载MNIST数据

    :return: 训练集加载器, 测试集加载器
    '''
    batch_size = 512

    ## 1.1 加载MNIST训练集
    train_loader = torch.utils.data.DataLoader(
        torchvision.datasets.MNIST(
            "mnist.data",  # 数据存放路径
            train=True,  # 是否为训练集
            download=True,  # 若没有，是否下载数据
            transform=torchvision.transforms.Compose([  # 对导入数据进行一些修改操作
                torchvision.transforms.ToTensor(),  # 将原来的numpy格式转化为torch中的Tensor格式
                torchvision.transforms.Normalize(  # 对数据进行正则化，使数据在 0 附近均匀分布，原数据是0~1
                    (0.1307,), (0.3081,)
                )
            ])
        ),
        batch_size=batch_size,  # 每次加载的图片数
        shuffle=True  # 是否将数据打散
    )

    ## 1.2 加载测试集
    test_loader = torch.utils.data.DataLoader(
        torchvision.datasets.MNIST(
            "mnist.data",  # 数据存放路径
            train=False,  # 是否为训练集
            download=True,  # 若没有，是否下载数据
            transform=torchvision.transforms.Compose([  # 对导入数据进行一些修改操作
                torchvision.transforms.ToTensor(),  # 将原来的numpy格式转化为torch中的Tensor格式
                torchvision.transforms.Normalize(  # 对数据进行正则化，使数据在 0 附近均匀分布，原数据是0~1
                    (0.1307,), (0.3081,)
                )
            ])
        ),
        batch_size=batch_size,  # 每次加载的图片数
        shuffle=False  # 是否将数据打散
    )

    return train_loader, test_loader

# 2 创建网络
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()

        # 第一层
        # 输入图片大小为28*28， 输出维度为256
        self.fc1 = nn.Linear(28 * 28, 256)

        # 第二层
        # 输入为上一层的维度256，输出维度为64
        self.fc2 = nn.Linear(256, 64)

        # 第三层
        # 输入为上一层输出64， 输出维度为10，因为需要进行10分类
        self.fc3 = nn.Linear(64, 10)

    def forward(self, x):
        # x:[batch_size, 1, 28, 28]
        # h1 = relu(xw1+b1)
        x = F.relu(self.fc1(x))

        # h2 = relu(h1w2+b2)
        x = F.relu(self.fc2(x))

        # h3 = h2w3+b3
        x = F.softmax(self.fc3(x))

        return x

# 3 开始训练
if __name__ == "__main__":
    # 加载数据
    train_loader, test_loader = load_data()

    # 实例化模型
    net = Net()

    # 设置优化器
    # net.parameters 会返回 [w1, b1, w2, b2, w3, b3]
    optimizer = optim.Adam(net.parameters(),
                           lr=0.01
                           )

    # 记录训练过程中的loss
    train_loss = []

    # 开始训练
    for epoch in range(3):
        for batch_idx, (x, y) in enumerate(train_loader):
            # x: [batch_size, 1, 28, 28]
            # y: [512]
            # 打平数据
            # [b, 1, 28, 28] => [b, 28*28]
            x = x.view(x.size(0), 28 * 28)

            # out: [batch_size, 10]
            out = net(x)

            # 将y变为独热向量
            y_onehot = one_hot(y)

            # loss = mse(out, y_onehot)
            loss = F.mse_loss(out, y_onehot)

            # 清除上次计算的梯度
            optimizer.zero_grad()

            # 计算梯度
            loss.backward()

            # 更新梯度，w' = w - lr * grad
            optimizer.step()

            # 记录loss
            train_loss.append(loss.item())

            if batch_idx % 10 == 0:
                print(epoch, batch_idx, loss.item())
    # 得到了较好的[w1, b1. w2. b2. w3. b3]

    # 输出loss变化曲线
    plot_curve(train_loss)

    # 查看模型在测试集上的效果并计算准确率
    total_correct = 0
    for x, y in test_loader:
        x = x.view(x.size(0), 28 * 28)
        out = net(x)

        # 获得正确预测的数量
        pred = out.argmax(dim=1)
        correct = pred.eq(y).sum().item()
        total_correct += correct

    total_num = len(test_loader.dataset)
    acc = total_correct / total_num

    # 打印模型在测试集上的准确度
    print("test acc:", acc)

    # 查看预测结果
    x, y = next(iter(test_loader))
    out = net(x.view(x.size(0), 28 * 28))
    pred = out.argmax(dim=1)
    plot_image(x, pred, "test")
```

# 结果展示：

**loss变化图：**

![请添加图片描述](/images/csdn/213030de6fe1a6bd828fb127.png)


**测试实例图：**

![请添加图片描述](/images/csdn/a5fa09bc2f5444e1b84e4522.png)


**部分训练过程和测试集准确率：**

![请添加图片描述](/images/csdn/810035b0a87c97675b20f9cf.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/118996786)
