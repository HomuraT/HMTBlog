---
title: "pytorch学习18：模型微调Fine tuning和固定层向量导出hook"
published: 2021-09-29
description: ''
image: ''
tags: ["PyTorch", "深度学习", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# 微调的概念

当我们在进行特定任务时，时常会出现训练数据不够的情况，若从头开始训练一个模型，往往效果较差。为了解决这个问题，我们可以找一个别人已经训练好的现成模型，换成自己的数据，调整一下参数，再训练一遍，这个操作就是微调（fine-tune）

## 为什么要微调

1. 对于数据集很小的情况，从头开始训练具有千万参数的大型神经网络是是不现实的。越大的模型对数据量的要求越大，且容易产生过拟合。这是如果我们仍然想使用大型神经网络来训练数据，就需要微调已经训练好的模型。
2. 微调可以降低训练成本。如果使用导出特征向量的方法进行迁移学习，后期训练的成本很低，用CPU也可以快速训练。
3. 前人已经训练好的模型一般会比自己搭建的模型好用，没必要重新搭建模型。

# 如何微调

不同的领域微调的方法不一样，下面会介绍几个说法。

对于图片来说，我们CNN的前几层学习到的都是低级的特征，比如，点、线、面，这些低级的特征对于任何图片来说都是可以抽象出来的，所以我们将他作为通用数据，只微调这些低级特征组合起来的高级特征即可，例如，这些点、线、面，组成的是圆还是椭圆，还是正方形，这些代表的含义是我们需要后面训练出来的。

对于语音来说，每个单词表达的意思都是一样的，只不过发音或者是单词的拼写不一样，比如 苹果，apple，apfel（德语），都表示的是同一个东西，只不过发音和单词不一样，但是他具体代表的含义是一样的，就是高级特征是相同的，所以我们只要微调低级的特征就可以了。

## 注意事项

1. 若新数据集和原始数据集类似，那么可以直接微调最有一个FC层或重新制定一个新的分类器。
2. 若新数据集与原始数据集相差较大，可以从模型中部开始训练，微调最后几层。
3. 若新数据集与原始数据集相差较大，且上面方法不可行，则可以将预训练模型作为新模型的初始化数据，重新训练模型。
4. 新数据集需要与元数据集维度相同，比如CNN中输入的图片大小要相同，才不会导致报错。
5. 对于不同的层可以设置不同的学习率，一般情况下学习率要设置得比使用原数据训练时的学习率小（一般小10倍），这样可以保证原模型不会扭曲过快。也可以使用原来的学习率，这样收敛较快。

# 微调实例

使用官方训练好的resnet50来参加kaggle上面的 [dog breed](https://www.kaggle.com/c/dog-breed-identification) 狗的种类识别来做一个简单微调实例。

**步骤如下：**

1. 获取狗的分类并根据分类进行编号
2. 自定义DataSet，方便获取数据
3. 设定一些超参
4. 定义训练数据和验证数据的图像变换规则
5. 生成数据集
6. 使用官方的dataloader载入数据
7. 开始配置网络
8. 准备训练和测试函数
9. 开始训练

```python
import pandas as pd
import os
import time

import torch
from torch import nn
from torchvision import datasets, models, transforms
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import StratifiedShuffleSplit

### 1、获取狗的分类并根据分类进行编号
DATA_ROOT = "data/dog_breed"
all_labels_df = pd.read_csv(os.path.join(DATA_ROOT, 'labels.csv'))
breeds = all_labels_df.breed.unique()

# 这里定义了两个字典，分别以种类名和id作为对应
breed2idx = dict((breed, idx) for idx, breed in enumerate(breeds))
idx2breed = dict((idx, breed) for idx, breed in enumerate(breeds))

# 将种类编号添加到列表中
all_labels_df['label_idx'] = [breed2idx[b] for b in all_labels_df.breed]

### 2、自定义DataSet，方便获取数据
class DogDataSet(Dataset):
    def __init__(self, labels_df, img_path, transform=None):
        self.labels_df = labels_df
        self.img_path = img_path
        self.transform = transform

    def __len__(self):
        return self.labels_df.shape[0]

    def __getitem__(self, idx):
        image_name = os.path.join(self.img_path, self.labels_df.id[idx]) + '.jpg'
        img = Image.open(image_name)
        label = self.labels_df.label_idx[idx]

        if self.transform:
            img = self.transform(img)

        return img, label

### 3、设定一些超参
hyps = {
    "IMG_SIZE": 224,  # resnet50的输入是224，所以需要将图片统一大小
    "BATCH_SIZE": 256,  # 这个批次大小需要占用4.6-5g的显存，如果不够的化可以改下批次，如果内存超过10G可以改为512
    "IMG_MEAN": [0.485, 0.456, 0.406],
    "IMG_STD": [0.229, 0.224, 0.225],
    "CUDA": torch.cuda.is_available(),
    "DEVICE": torch.device("cuda" if torch.cuda.is_available() else "cpu")
}

### 4、定义训练数据和验证数据的图像变换规则
train_transforms = transforms.Compose([
    transforms.Resize(hyps["IMG_SIZE"]),
    transforms.RandomResizedCrop(hyps["IMG_SIZE"]),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(30),
    transforms.ToTensor(),
    transforms.Normalize(hyps["IMG_MEAN"], hyps["IMG_STD"])
])

val_transforms = transforms.Compose([
    transforms.Resize(hyps["IMG_SIZE"]),
    transforms.CenterCrop(hyps["IMG_SIZE"]),
    transforms.ToTensor(),
    transforms.Normalize(hyps["IMG_MEAN"], hyps["IMG_STD"])
])

### 5、生成数据集
datasets_names = ["train", "valid"]
stratified_split = StratifiedShuffleSplit(n_splits=1, test_size=0.1, random_state=0)
train_split_idx, val_split_idx = next(iter(stratified_split.split(all_labels_df.id, all_labels_df.breed)))
train_df = all_labels_df.iloc[train_split_idx].reset_index()
val_df = all_labels_df.iloc[val_split_idx].reset_index()

# 为了更快看到结果，只使用100个数据
train_df = train_df[:90]
val_df = val_df[:10]

print("训练集数量：", len(train_df))
print("验证集数量：", len(val_df))

### 6、使用官方的dataloader载入数据
image_transforms = {
    "train": train_transforms,
    "valid": val_transforms
}

train_dataset = DogDataSet(
    train_df,
    os.path.join(DATA_ROOT, "train"),
    transform=image_transforms["train"]
)

val_dataset = DogDataSet(
    val_df,
    os.path.join(DATA_ROOT, "train"),
    transform=image_transforms["valid"]
)

image_dataset = {
    "train": train_dataset,
    "valid": val_dataset
}

image_loader = {
    x: DataLoader(
        image_dataset[x],
        batch_size=hyps["BATCH_SIZE"],
        shuffle=True,
        num_workers=0
    ) for x in datasets_names
}

dataset_sizes = {
    x: len(image_dataset[x]) for x in datasets_names
}

### 7、开始配置网络，由于ImageNet是识别1000个物体，我们的狗的分类是120个
### 因此需要对模型的最后一层进行微调，将输出从1000改成120

'''
下载官方的预训练模型，
并且将所有参数层进行冻结
'''
model_ft = models.resnet50(pretrained=True)
for param in model_ft.parameters():
    param.requires_grad = False

# 打印全连接层信息
print(model_ft.fc)
# 获取到fc层的输入
num_fc_ftr = model_ft.fc.in_features
# 定义一个新fc层
model_ft.fc = nn.Linear(num_fc_ftr, len(breeds))
# 放到设备中
model_ft = model_ft.to(hyps["DEVICE"])
# 打印新的模型的fc层
print(model_ft.fc)

### 8、准备训练和测试函数
# 设置训练参数
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam([
    {"params": model_ft.fc.parameters()}
], lr=0.01)  # 给新的fc层指定学习率

# 定义训练函数
def train(model, device, train_loader, epoch):
    model.train()
    for batch_idx, data in enumerate(train_loader):
        x, y = data
        x = x.to(device)
        y = y.to(device)
        optimizer.zero_grad()
        y_hat = model(x)
        loss = criterion(y_hat, y)
        loss.backward()
        optimizer.step()
    print("Train Epoch:{}\t Loss:{:.6f}".format(epoch, loss.item()))

# 定义测试函数
def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for i, data in enumerate(test_loader):
            x, y = data
            x = x.to(device)
            y = y.to(device)
            y_hat = model(x)
            test_loss += criterion(y_hat, y).item()
            y_pred = y_hat.max(1, keepdim=True)[1]
            correct += y_pred.eq(y.view_as(y_pred)).sum().item()
    test_loss /= len(test_loader.dataset)
    print("Test set: Average loss: {:.4f}".format(test_loss))
    print("Accuracy: {}/{}({:.0f}%)".format(
        correct,
        len(test_loader.dataset),
        100 * correct / len(test_loader.dataset))
    )

### 9、开始训练
start_time = time.time()
for epoch in range(1, 10):
    train(model=model_ft, device=hyps["DEVICE"], train_loader=image_loader["train"], epoch=epoch)
    test(model=model_ft, device=hyps["DEVICE"], test_loader=image_loader["train"])
end_time = time.time()
print("训练和测试运行总时间：", end_time - start_time)
```

```python
训练集数量： 90
验证集数量： 10
Linear(in_features=2048, out_features=1000, bias=True)
Linear(in_features=2048, out_features=120, bias=True)
Train Epoch:1	 Loss:4.852541
Test set: Average loss: 0.0587
Accuracy: 8/90(9%)
Train Epoch:2	 Loss:5.330395
Test set: Average loss: 0.0590
Accuracy: 14/90(16%)
Train Epoch:3	 Loss:5.285418
Test set: Average loss: 0.0612
Accuracy: 24/90(27%)
Train Epoch:4	 Loss:5.473721
Test set: Average loss: 0.0646
Accuracy: 25/90(28%)
Train Epoch:5	 Loss:5.354596
Test set: Average loss: 0.0554
Accuracy: 31/90(34%)
Train Epoch:6	 Loss:5.442605
Test set: Average loss: 0.0551
Accuracy: 30/90(33%)
Train Epoch:7	 Loss:4.990680
Test set: Average loss: 0.0427
Accuracy: 50/90(56%)
Train Epoch:8	 Loss:4.028876
Test set: Average loss: 0.0406
Accuracy: 52/90(58%)
Train Epoch:9	 Loss:3.824669
Test set: Average loss: 0.0419
Accuracy: 48/90(53%)
训练和测试运行总时间： 157.51129245758057

进程已结束，退出代码为 0
```

**注意：**

为了能快速看到效果，我在这里只使用了90个数据，且使用了原数据进行测试。若想要使用全部数据，且用验证集测试模型，只需删除和修改相应代码即可。

## 固定层向量导出

上面的方法有一个缺陷，除了最后修改的一层，前面每一层在同一样本的输出都是一样的，因此浪费了很多计算资源。因此我们可以将不进行反向传播或者不更新网络权重参数的计算结果保存下来，这样我们以后使用的时候就可以直接将结果输出到新的网络层，省去了大量的计算时间。且有时仅需要CPU就能快速完成训练。

下面是一个样例，使用了pytorch中的hook方法，将最后FC层的输入记录了下来，并直接用于前向传播和训练。

```python
import pandas as pd
import os
import time

import torch
from torch import nn
from torchvision import datasets, models, transforms
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import StratifiedShuffleSplit

### 1、获取狗的分类并根据分类进行编号
DATA_ROOT = "data/dog_breed"
all_labels_df = pd.read_csv(os.path.join(DATA_ROOT, 'labels.csv'))
breeds = all_labels_df.breed.unique()

# 这里定义了两个字典，分别以种类名和id作为对应
breed2idx = dict((breed, idx) for idx, breed in enumerate(breeds))
idx2breed = dict((idx, breed) for idx, breed in enumerate(breeds))

# 将种类编号添加到列表中
all_labels_df['label_idx'] = [breed2idx[b] for b in all_labels_df.breed]

### 2、自定义DataSet，方便获取数据
class DogDataSet(Dataset):
    def __init__(self, labels_df, img_path, transform=None):
        self.labels_df = labels_df
        self.img_path = img_path
        self.transform = transform

    def __len__(self):
        return self.labels_df.shape[0]

    def __getitem__(self, idx):
        image_name = os.path.join(self.img_path, self.labels_df.id[idx]) + '.jpg'
        img = Image.open(image_name)
        label = self.labels_df.label_idx[idx]

        if self.transform:
            img = self.transform(img)

        return img, label

### 3、设定一些超参
hyps = {
    "IMG_SIZE": 224,  # resnet50的输入是224，所以需要将图片统一大小
    "BATCH_SIZE": 256,  # 这个批次大小需要占用4.6-5g的显存，如果不够的化可以改下批次，如果内存超过10G可以改为512
    "IMG_MEAN": [0.485, 0.456, 0.406],
    "IMG_STD": [0.229, 0.224, 0.225],
    "CUDA": torch.cuda.is_available(),
    "DEVICE": torch.device("cuda" if torch.cuda.is_available() else "cpu")
}

### 4、定义训练数据和验证数据的图像变换规则
train_transforms = transforms.Compose([
    transforms.Resize(hyps["IMG_SIZE"]),
    transforms.RandomResizedCrop(hyps["IMG_SIZE"]),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(30),
    transforms.ToTensor(),
    transforms.Normalize(hyps["IMG_MEAN"], hyps["IMG_STD"])
])

val_transforms = transforms.Compose([
    transforms.Resize(hyps["IMG_SIZE"]),
    transforms.CenterCrop(hyps["IMG_SIZE"]),
    transforms.ToTensor(),
    transforms.Normalize(hyps["IMG_MEAN"], hyps["IMG_STD"])
])

### 4、生成数据集
datasets_names = ["train", "valid"]
stratified_split = StratifiedShuffleSplit(n_splits=1, test_size=0.1, random_state=0)
train_split_idx, val_split_idx = next(iter(stratified_split.split(all_labels_df.id, all_labels_df.breed)))
train_df = all_labels_df.iloc[train_split_idx].reset_index()
val_df = all_labels_df.iloc[val_split_idx].reset_index()

# 为了更快看到结果，只使用100个数据
train_df = train_df[:90]
val_df = val_df[:10]

print("训练集数量：", len(train_df))
print("验证集数量：", len(val_df))

### 5、使用官方的dataloader载入数据
image_transforms = {
    "train": train_transforms,
    "valid": val_transforms
}

train_dataset = DogDataSet(
    train_df,
    os.path.join(DATA_ROOT, "train"),
    transform=image_transforms["train"]
)

val_dataset = DogDataSet(
    val_df,
    os.path.join(DATA_ROOT, "train"),
    transform=image_transforms["valid"]
)

image_dataset = {
    "train": train_dataset,
    "valid": val_dataset
}

image_loader = {
    x: DataLoader(
        image_dataset[x],
        batch_size=hyps["BATCH_SIZE"],
        shuffle=True,
        num_workers=0
    ) for x in datasets_names
}

dataset_sizes = {
    x: len(image_dataset[x]) for x in datasets_names
}

### 6、开始配置网络，由于ImageNet是识别1000个物体，我们的狗的分类是120个
### 因此需要对模型的最后一层进行微调，将输出从1000改成120

'''
下载官方的预训练模型，
并且将所有参数层进行冻结
'''
model_ft = models.resnet50(pretrained=True)
for param in model_ft.parameters():
    param.requires_grad = False

# 打印全连接层信息
print(model_ft.fc)
# 获取到fc层的输入
num_fc_ftr = model_ft.fc.in_features
# 定义一个新fc层
model_ft.fc = nn.Linear(num_fc_ftr, len(breeds))
# 放到设备中
model_ft = model_ft.to(hyps["DEVICE"])
# 打印新的模型的fc层
print(model_ft.fc)

### 7、训练
# 设置训练参数
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam([
    {"params": model_ft.fc.parameters()}
], lr=0.01)  # 给新的fc层指定学习率

# 定义训练函数
def train(y_hat, y, epoch):
    optimizer.zero_grad()
    loss = criterion(y_hat, y)
    loss.backward()
    optimizer.step()
    print("Train Epoch:{}\t Loss:{:.6f}".format(epoch, loss.item()))

# 定义测试函数
def test(y_hat, y, ):
    test_loss = 0
    correct = 0
    test_loss += criterion(y_hat, y).item()
    y_pred = y_hat.max(1, keepdim=True)[1]
    correct += y_pred.eq(y.view_as(y_pred)).sum().item()
    test_loss /= y.shape[0]
    print("Test set: Average loss: {:.4f}".format(test_loss))
    print("Accuracy: {}/{}({:.0f}%)".format(
        correct,
        y.shape[0],
        100 * correct / y.shape[0])
    )

# 存放所有的输出
in_list = []

def hook(module, input, output):
    # input 是一个tuple，代表每一个输入项
    # 这里我们只有一项，所以直接获取

    # 需要全部参数信息可以使用这个打印
    # for val in input:
    #     print("input val:", val)

    for i in range(input[0].size(0)):
        in_list.append(input[0][i].cpu().numpy())

# 在相应的层注册hook函数，保证函数能正常工作
model_ft.fc.register_forward_hook(hook)

# 保存fc层输入数据
in_list = []
with torch.no_grad():
    for batch_idx, data in enumerate(image_loader["train"]):
        x, y = data
        x = x.to(hyps["DEVICE"])
        y = y.to(hyps["DEVICE"])
        y_hat = model_ft(x)
avgpool_output = torch.tensor(in_list)

# 开始训练
start_time = time.time()
for epoch in range(1, 10):
    y_hat = model_ft.fc(avgpool_output)
    train(y_hat, y, epoch)
    test(y_hat, y)
end_time = time.time()
print("训练和测试运行总时间：", end_time - start_time)
```

```python
训练集数量： 90
验证集数量： 10
Linear(in_features=2048, out_features=1000, bias=True)
Linear(in_features=2048, out_features=120, bias=True)
Train Epoch:1	 Loss:4.901811
Test set: Average loss: 0.0545
Accuracy: 0/90(0%)
Train Epoch:2	 Loss:3.896190
Test set: Average loss: 0.0433
Accuracy: 8/90(9%)
Train Epoch:3	 Loss:3.244060
Test set: Average loss: 0.0360
Accuracy: 40/90(44%)
Train Epoch:4	 Loss:2.896842
Test set: Average loss: 0.0322
Accuracy: 47/90(52%)
Train Epoch:5	 Loss:2.154058
Test set: Average loss: 0.0239
Accuracy: 52/90(58%)
Train Epoch:6	 Loss:1.155868
Test set: Average loss: 0.0128
Accuracy: 67/90(74%)
Train Epoch:7	 Loss:0.720364
Test set: Average loss: 0.0080
Accuracy: 80/90(89%)
Train Epoch:8	 Loss:0.768238
Test set: Average loss: 0.0085
Accuracy: 76/90(84%)
Train Epoch:9	 Loss:0.770737
Test set: Average loss: 0.0086
Accuracy: 72/90(80%)
训练和测试运行总时间： 0.01994800567626953

进程已结束，退出代码为 0
```

# 结论

微调是一个对算力低的个人或组织相当友好的技术，可以使用前人已经训练好的模型进行改进，无需重新训练整个模型。本篇文章的代码都是在同一台电脑上、使用CPU进行的，可以看出使用了固定层向量导出方法后，训练速度大幅度提升，可以用仅CPU快速完成训练。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120544127)
