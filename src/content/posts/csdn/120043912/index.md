---
title: "pytorch学习16：RNN简单使用"
published: 2021-09-01
description: ''
image: ''
tags: ["PyTorch", "深度学习", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 基础参数说明

## **基础网络创建参数**

`RNN(input_size, hidden_size)`

- input_size：输入数据X的特征值的数目，可视为nlp中**词嵌入向量的维度**。
- hidden_size：隐藏层的神经元数量，即每个时刻输出向量 $h_t$ 的维度。

## **网络输入参数说明**

`rnn(input, h_0)`

- input：输入数据，一般包含三个维度(seq_len, batch, input_size)，其中 **seq_len** 表示序列长度，**batch** 表示批大小。
- h_0：初始隐状态。

## **网络输出参数**

`output, hn = rnn(input)`

- output：每个时刻的隐状态
- hn：最后一个时刻的隐状态

# 示例

**实现代码：**

```python
import torch.nn as nn
import torch
import torch.nn.functional as F
import torch.optim as optim

class Net(nn.Module):
    def __init__(self, embedding_dim, hidden_dim):
        super(Net, self).__init__()

        # 创建RNN层
        self.rnn = nn.RNN(embedding_dim, hidden_dim)

        # 三层全连接
        self.fc1 = nn.Linear(hidden_dim, 32)
        self.fc2 = nn.Linear(32, 16)
        self.fc3 = nn.Linear(16, 1)

    def forward(self, x):
        # 获取每个时刻的输出
        # hn 为最后一个时刻的输出
        _, hn = self.rnn(x)

        # 获取最后一个时刻的输出
        x = hn
        # 将 x 输出全连接
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

if __name__ == '__main__':
    # 创建模型
    net = Net(2, 3)

    # 设定优化器为 SGD
    optimizer = optim.SGD(net.parameters(), lr=0.1)
    # 损失函数为 MSE
    loss_function = nn.MSELoss()

    # 创建x和y
    # 数据可以视为：
    # 每句话长度为 20
    # 一共有 10 句话
    # 每个词的嵌入向量维度为 2
    input_ = torch.randn(20, 10, 2)
    #  假设输出全为 1
    y = torch.ones(10)

    # 前向传播
    output_ = net(input_)
    # 计算损失
    loss = loss_function(output_, y)
    # 输出反向传播前的损失
    print('loss1:', loss)

    # 反向传播
    loss.backward()
    # 梯度下降
    optimizer.step()

    # 再次前向传播并计算损失
    output_ = net(input_)
    loss_function.zero_grad()
    loss = loss_function(output_, y)
    print('loss2:', loss)
```

**输出结果：**

```python
loss1: tensor(1.5234, grad_fn=<MseLossBackward>)
loss2: tensor(0.6356, grad_fn=<MseLossBackward>)
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120043912)
