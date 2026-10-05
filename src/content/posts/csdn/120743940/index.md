---
title: "pytorch学习21：Fashion MNIST实例"
published: 2021-10-13
description: ''
image: ''
tags: ["PyTorch", "深度学习", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 介绍

Fashion MNIST数据集 是kaggle上提供的一个图像分类入门级的数据集，其中包含10个类别的70000个灰度图像。如图所示，这些图片显示的是每件衣服的低分辨率(28×28像素)

数据集的下载和介绍：[地址](https://www.kaggle.com/zalando-research/fashionmnist/)

# 步骤

1. 载入数据
    
    使用pandas载入文件中的数据
    
2. 预处理数据
    
    将数据划分为X、Y
    
    并创建相应的DataLoader方便使用
    
3. 创建网络
    
    使用三层CNN网络
    
4. 定义超参、损失函数和优化器
    
    损失函数选择交叉熵
    
    优化器选择Adam
    
5. 开始训练
6. 测试结果

# 全部代码

```python
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import Dataset, DataLoader

import torch
import torch.nn as nn
from torch.utils.tensorboard import SummaryWriter

# 创建自定义Dataset
class MNISTDataset(Dataset):
    def __init__(self, X, Y):
        self.x = X
        self.y = Y

    def __getitem__(self, idx):
        return (self.x[idx], self.y[idx])

    def __len__(self):
        return len(self.y)

# 创建模型
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=5, padding=2),
            nn.BatchNorm2d(16),
            nn.ReLU()  # 16, 28, 28
        )
        self.pool1 = nn.MaxPool2d(2)  # 16, 14, 14
        self.layer2 = nn.Sequential(
            nn.Conv2d(16, 32, kernel_size=3),
            nn.BatchNorm2d(32),
            nn.ReLU()  # 32, 12, 12
        )
        self.layer3 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3),
            nn.BatchNorm2d(64),
            nn.ReLU()  # 64, 10, 10
        )
        self.pool2 = nn.MaxPool2d(2)  # 64, 5, 5
        self.fc = nn.Linear(5 * 5 * 64, 10)

    def forward(self, x):
        x = self.layer1(x)
        x = self.pool1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.pool2(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

def getDaraset():
    '''
    获得训练集和测试集的Dataset

    :return: trainDataset, testDataset
    '''
    # 获取数据
    train_df = pd.read_csv("./data/archive/fashion-mnist_train.csv")
    test_df = pd.read_csv("./data/archive/fashion-mnist_train.csv")

    # 划分训练集X和Y
    train_Y = train_df["label"]
    Y_label = LabelEncoder()
    train_Y = Y_label.fit_transform(train_Y)

    train_X = train_df.drop(columns="label").values
    # 将数据变为1,28,28
    train_X = train_X.reshape(-1, 1, 28, 28)

    # 划分测试集X和Y
    test_Y = test_df["label"]
    test_Y = Y_label.fit_transform(test_Y)

    test_X = test_df.drop(columns="label").values
    test_X = test_X.reshape(-1, 1, 28, 28)

    trainDataset = MNISTDataset(train_X, train_Y)
    testDataset = MNISTDataset(test_X, test_Y)
    return trainDataset, testDataset

def train(model, optimizer, criterion, DEVICE, trainLoader, epochs):
    # 训练
    losses = []
    for epoch in range(epochs):
        model.train()
        for i, (x, y) in enumerate(trainLoader):
            x = x.float().to(DEVICE)
            y = y.long().to(DEVICE)

            optimizer.zero_grad()
            outputs = model(x)
            loss = criterion(outputs, y)

            loss.backward()
            optimizer.step()

            losses.append(loss.data.item())
            if (i + 1) % 10 == 0:
                print("epoch {}/{} iter{}/{} loss = {}".format(
                    epoch + 1,
                    epochs,
                    i + 1,
                    len(trainLoader),
                    loss.data.item())
                )

    train_writer = SummaryWriter("runs/MNF_train")
    for i, loss in enumerate(losses):
        train_writer.add_scalar("mnf_loss", loss, global_step=i)
    train_writer.close()
    print("finish")

def test(model, testLoader, DEVICE):
    # 测试
    correct = 0
    total = 0
    model.eval()

    for i, (x, y) in enumerate(testLoader):
        x = x.float().to(DEVICE)
        y = y.long().to(DEVICE)
        outputs = model(x)
        pred = torch.argmax(outputs, dim=1)
        total += len(y)
        correct += (pred == y).sum()

    print("acc: {:2f}%".format((correct / total * 100).item()))

def start():
    # 设置超参数
    lr = 0.01
    epochs = 2
    batch_size = 1024

    DEVICE = torch.device("cpu")
    if torch.cuda.is_available():
        DEVICE = torch.device("gpu")

    # 创建模型
    model = CNN()
		# 获得数据
    trainDataset, testDataset = getDaraset()
    # 创建DataLoader
    trainLoader = DataLoader(trainDataset, batch_size=batch_size, shuffle=True)
    testLoader = DataLoader(testDataset, batch_size=batch_size, shuffle=False)

    # 定义损失函数
    criterion = nn.CrossEntropyLoss()
    # 定义优化器
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    # 开始训练
    train(model, optimizer, criterion, DEVICE, trainLoader, epochs)
    # 测试
    test(model, testLoader, DEVICE)

if __name__ == "__main__":
    start()
```

# 控制台输出结果

```python
epoch 1/2 iter10/59 loss = 2.063721179962158
epoch 1/2 iter20/59 loss = 0.8701536655426025
epoch 1/2 iter30/59 loss = 0.6749212145805359
epoch 1/2 iter40/59 loss = 0.5576784014701843
epoch 1/2 iter50/59 loss = 0.4953959584236145
epoch 2/2 iter10/59 loss = 0.47231945395469666
epoch 2/2 iter20/59 loss = 0.477151483297348
epoch 2/2 iter30/59 loss = 0.40640050172805786
epoch 2/2 iter40/59 loss = 0.3907008469104767
epoch 2/2 iter50/59 loss = 0.3715599775314331
finish
acc: 86.351669%
```

# 损失变化曲线

![请添加图片描述](/images/csdn/34417e3d1ee7f934d6c7b3b1.png)


# 网络结构图

![请添加图片描述](/images/csdn/01424867a68ce1f71b0b41e6.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120743940)
