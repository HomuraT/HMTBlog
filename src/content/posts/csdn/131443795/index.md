---
title: "PyTorch Lightning基础入门"
published: 2023-06-28
description: ''
image: ''
tags: ["PyTorch", "人工智能", "Python"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# Lightning in 15 minutes

[Lightning in 15 minutes — PyTorch Lightning 2.0.4 documentation](https://lightning.ai/docs/pytorch/stable/starter/introduction.html)

# 安装 **PyTorch Lightning**

`pip install lightning`

`conda install lightning -c conda-forge`

# 定义一个**LightningModule**

`LightningModule`可以让`pytorch`的`nn.Module`可以整合一些训练过程（也可以有验证和测试）。

如下是一个手写数字识别自动编码器（autoencoder）的样例：

```python
import os
import torch
from torch import optim, nn, utils
from torchvision.datasets import MNIST
from torchvision.transforms import ToTensor
import lightning.pytorch as pl

'''
定义两个模型，编码器和解码器，这个是pytorch的模型对象
'''
encoder = nn.Sequential(nn.Linear(28 * 28, 64), nn.ReLU(), nn.Linear(64, 3))
decoder = nn.Sequential(nn.Linear(3, 64), nn.ReLU(), nn.Linear(64, 28 * 28))

# 定义LightningModule
class LitAutoEncoder(pl.LightningModule):
    def __init__(self, encoder, decoder):
        super().__init__()
        self.encoder = encoder
        self.decoder = decoder

    def training_step(self, batch, batch_idx):
        # 训练步骤
        # 这个跟 forward 不相关
        x, y = batch
        x = x.view(x.size(0), -1)
        z = self.encoder(x)
        x_hat = self.decoder(z)
        loss = nn.functional.mse_loss(x_hat, x)
        # 存储日志（需要安装Tensorboard）
        self.log("train_loss", loss)
        return loss

    def configure_optimizers(self):
				# 优化器
        optimizer = optim.Adam(self.parameters(), lr=1e-3)
        return optimizer

# 初始化自动编码器
autoencoder = LitAutoEncoder(encoder, decoder)
```

# 定义数据集

`Lightning`支持所有可迭代的数据集形式（`DataLoader`，`numpy`，以及其他）。

```python
# setup 
datadataset=MNIST(os.getcwd(),download=True,transform=ToTensor())
train_loader=utils.data.DataLoader(dataset)
```

# 训练模型

`Lightning`的`Trainer`对象可以整合`LightningModule`与不同数据集，并扩展了一些工程所需方法。

```python
# 训练模型
trainer = pl.Trainer(limit_train_batches=100, max_epochs=10)
trainer.fit(model=autoencoder, train_dataloaders=train_loader)
```

`Trainer`对象也实现了很多常用的过程：

1. `Epoch`和`batch`迭代。
2. **`optimizer.step()`, `loss.backward()`, `optimizer.zero_grad()`**
3. 验证过程中的**`model.eval()`。**
4. [模型存储和载入](https://lightning.ai/docs/pytorch/stable/common/checkpointing.html)
5. [Tensorboard](https://lightning.ai/docs/pytorch/stable/visualize/loggers.html)
6. [多GPU](https://lightning.ai/docs/pytorch/stable/accelerators/gpu.html)
7. [TPU](https://lightning.ai/docs/pytorch/stable/accelerators/tpu.html)
8. [半精度混合](https://lightning.ai/docs/pytorch/stable/advanced/speed.html#speed-amp)

【注意】：在jupyter下，多卡训练可能会报错，可以试试直接用`python`代码。

# 使用模型

训练完模型后，可以导出到 onnx、torchscript 并将其投入生产，或者只是加载权重并运行预测。

```python
# 载入模型
checkpoint = "./lightning_logs/version_0/checkpoints/epoch=0-step=100.ckpt"
autoencoder = LitAutoEncoder.load_from_checkpoint(checkpoint, encoder=encoder, decoder=decoder)

# 选择训练好的编码器
encoder = autoencoder.encoder
encoder.eval()

# 编码图片
fake_image_batch = torch.randn(8, 28 * 28).to(next(encoder.parameters()).device)
embeddings = encoder(fake_image_batch)
print("⚡" * 20, "\nPredictions (4 image embeddings):\n", embeddings, "\n", "⚡" * 20)
```

# 训练可视化

如果安装了`Tensorboard`，可以用它来观察实验过程。

```python
tensorboard --logdir .
```

# 额外训练设置

```python
# 4gpu训练
trainer = Trainer(
    devices=4,
    accelerator="gpu",
 )

# train 1TB+ parameter models with Deepspeed/fsdp
# 使用 Deepspeed 训练大模型
trainer = Trainer(
    devices=4,
    accelerator="gpu",
    strategy="deepspeed_stage_2",
    precision=16
 )

# 20+ helpful flags for rapid idea iteration
# 有助于快速迭代的一些设置
trainer = Trainer(
    max_epochs=10,
    min_epochs=5,
    overfit_batches=1
 )

# access the latest state of the art techniques
# 获取最新的技术
trainer = Trainer(callbacks=[StochasticWeightAveraging(...)])
```

# 一些灵活设置

## 定制训练循环

![https://img1.imgtp.com/2023/06/28/GOfzfhZ0.png](/images/csdn/e3af2e63352ce41380bb25a1.png)

`LightningModule`中设置了20多种断点（[HOOK](https://lightning.ai/docs/pytorch/stable/common/lightning_module.html#lightning-hooks)），可以用来定制训练过程：

```python
class LitAutoEncoder(pl.LightningModule):
    def backward(self, loss):
        loss.backward()
```

## 扩展Trainer

![https://img1.imgtp.com/2023/06/28/PhzDKj0U.png](/images/csdn/1e124ca3836d791fbeb6f636.png)

在上面这个代码种，对模型的存储进行了一些设置。这些设置可以在`pl.Callback`对象中实现，并导入`Trainer`对象。

![https://img1.imgtp.com/2023/06/28/4lU9PREN.png](/images/csdn/b62de1fb2d434ca0da0529b6.png)

用如下方式可以导入`Trainer`:

```python
trainer = Trainer(callbacks=[AWSCheckpoints()])
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/131443795)
