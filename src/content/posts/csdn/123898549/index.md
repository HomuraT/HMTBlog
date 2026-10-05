---
title: "Transformers实战——使用本地数据进行AclImdb情感分类"
published: 2022-04-01
description: ''
image: ''
tags: ["自然语言处理", "深度学习", "人工智能", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

本文使用 [https://huggingface.co/models](https://huggingface.co/models) 中的`bert-base-uncased`预训练模型和[aclImdb数据集](http://ai.stanford.edu/~amaas/data/sentiment/)进行实战。

# 部分库版本

1. transformers==4.17.0
2. torch==1.11.0
3. datasets==2.0.0

# 数据介绍

AclImdb – v1 Dataset 是用于二进制情绪分类的大型电影评论数据集，其涵盖比基准数据集更多的数据，其中有 25,000 条电影评论用于训练，25,000 条用于测试，还有其他未经标记的数据可供使用。

本次只使用里面的训练数据和测试数据，使用的结构如下：

```python
|- test
|-- neg
|-- pos
|- train
|-- neg
|-- pos
```

# 数据预处理

要想使用Trainer进行训练，需要将数据调整到一定的规范，以下展示使用预训练模型对应的文本标记器（`tokenizer`）和`datasets库`处理原始数据。

## 导入必要库

```python
from datasets import Dataset
from transformers import BertTokenizer
import os
```

## 载入AclImdb数据，并转化为datasets.Dataset

```python
# 载入原始数据
def load_data(base_path):
    paths = os.listdir(base_path)
    result = []
    for path in paths:
        with open(os.path.join(base_path, path), 'r', encoding='utf-8') as f:
            result.append(f.readline())
    return result

# 读入数据并转化为datasets.Dataset
def get_dataset(base_path):
		# 为了展示方便，这里只取前3个数据，真实使用需要删掉切片操作
    pos_data = load_data(os.path.join(base_path, 'pos'))[:3]
    neg_data = load_data(os.path.join(base_path, 'neg'))[:3]
    
		# 列表合并
    texts = pos_data + neg_data
		# 生成标签，其中使用 '1.' 和 '0.' 是因为需要转化为浮点数，要不然模型训练时会报错
    labels = [[1., 0.]]*len(pos_data) + [[0., 1.]] * len(neg_data)
    dataset = Dataset.from_dict({'texts':texts, 'labels':labels})
    return dataset

# 加载数据
train_dataset = get_dataset('../data/aclImdb/train/')
test_dataset = get_dataset('../data/aclImdb/test/')
```

此时输出`train_dataset`可以查看其结构：

```python
print(train_dataset)

输出结果
Dataset({
    features: ['texts', 'labels'],
    num_rows: 6
})
```

可以看到，包含了`texts`和`labels`，有`6`行数据。

通过字典的方式可以查看其中的元素：

```python
print(train_dataset['labels'])

输出结果：
[[1.0, 0.0], [1.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 1.0], [0.0, 1.0]]
```

通过`.features`可以查看特征：

```python
print(train_dataset.features)

输出结果：
{
'texts': Value(dtype='string', id=None), 
'labels': Sequence(feature=Value(dtype='float64', id=None), length=-1, id=None)
}
```

## 载入文本标记器

```python
# cache_dir是预训练模型的地址
cache_dir="../transformersModels/bert-base-uncased/"
tokenizer = BertTokenizer.from_pretrained(cache_dir)
```

- 注意
    
    这个路径的模型要自己下载，不能是`transformer`包下的，要不会报错。
    

## 将数据转化为模型可以接受的格式

```python
# 设置最大长度
MAX_LENGTH = 512

# 使用文本标记器对texts进行编码
train_dataset = train_dataset.map(lambda e: tokenizer(e['texts'], truncation=True, padding='max_length', max_length=MAX_LENGTH), batched=True)
test_dataset = test_dataset.map(lambda e: tokenizer(e['texts'], truncation=True, padding='max_length', max_length=MAX_LENGTH), batched=True)
```

运行完后，数据集会包含训练模型所需要的所有参数：

```python
print(print(train_dataset.features))

输出结果：
{
'texts': Value(dtype='string', id=None),
 'labels': Sequence(feature=Value(dtype='float64', id=None), length=-1, id=None),
 'input_ids': Sequence(feature=Value(dtype='int32', id=None), length=-1, id=None),
 'token_type_ids': Sequence(feature=Value(dtype='int8', id=None), length=-1, id=None),
 'attention_mask': Sequence(feature=Value(dtype='int8', id=None), length=-1, id=None)
}
```

## 保存处理好的数据到本地

在数据量大的时候，处理数据需要很长的时间，为了不每次都重新处理数据，可以将数据先存到本地

```python
train_dataset.save_to_disk('./data/train_dataset')
test_dataset.save_to_disk('./data/test_dataset')
```

# 训练模型

## 导入必要库

```python
from transformers import BertForSequenceClassification, BertTokenizer, Trainer, TrainingArguments, BertConfig
import torch
from datasets import Dataset
import json
import os
# 设定使用的GPU编号，也可以不设置，但trainer会默认使用多GPU
os.environ["CUDA_VISIBLE_DEVICES"] = "1"
```

## 载入网络并设置自定义尾部

```python
# 将num_labels设置为2，因为我们训练的任务为2分类
model = BertForSequenceClassification.from_pretrained('../transformersModels/bert-base-uncased/', num_labels=2)
```

## 加载处理好的数据

```python
train_dataset = Dataset.load_from_disk('./data/train_dataset/')
test_dataset = Dataset.load_from_disk('./data/test_dataset/')
```

## 冻结BERT参数

```python
for param in model.base_model.parameters():
    param.requires_grad = False
```

因为BERT是预训练模型，因此可以不再进行权重更新，只对尾部的分类器进行优化。与此同时，这个设置也会减少训练时使用的时间和显存。

## 创建trainer

```python
# 训练超参配置
training_args = TrainingArguments(
    output_dir='./my_results',          # output directory 结果输出地址
    num_train_epochs=10,              # total # of training epochs 训练总批次
    per_device_train_batch_size=128,  # batch size per device during training 训练批大小
    per_device_eval_batch_size=128,   # batch size for evaluation 评估批大小
    logging_dir='./my_logs',            # directory for storing logs 日志存储位置
)

# 创建Trainer
trainer = Trainer(
    model=model.to('cuda'),              # the instantiated 🤗 Transformers model to be trained 需要训练的模型
    args=training_args,                  # training arguments, defined above 训练参数
    train_dataset=train_dataset,         # training dataset 训练集
    eval_dataset=test_dataset,           # evaluation dataset 测试集
)
```

## 训练、评估和保存模型

```python
# 开始训练
trainer.train()

# 开始评估模型
trainer.evaluate()

# 保存模型 会保存到配置的output_dir处
trainer.save_model()
```

保存模型会生成三个文件：

```python
# 模型配置文件
config.json

# 模型数据文件
pytorch-model.bin

# 训练配置文件
training_args.bin
```

## 查看日志

使用`tensorboard`查看配置的`logging_dir`即可看到训练时的日志。

# 加载模型

```python
output_config_file = './my_results/config.json'
output_model_file = './my_results/pytorch_model.bin'

config = BertConfig.from_json_file(output_config_file)
model = BertForSequenceClassification(config)
state_dict = torch.load(output_model_file)
model.load_state_dict(state_dict)
```

载入成功后会显示：

```python
<All keys matched successfully>
```

这个model就可以跟普通的pytorch模型一样使用了

如下：

```python
cache_dir="../transformersModels/bert-base-uncased/"
tokenizer = BertTokenizer.from_pretrained(cache_dir)
data = tokenizer(['This is a good movie', 'This is a bad movie'], max_length=512, truncation=True, padding='max_length', return_tensors="pt")
print(model(**data))

输出结果：
SequenceClassifierOutput(
loss=None, logits=tensor([
[-0.2951,  0.5463],
[-0.4638,  0.6353]], 
grad_fn=<AddmmBackward0>), 
hidden_states=None, 
attentions=None)
```

由于只用3条数据训练了10轮，因此结果很差，正常训练结果可以变好了。

# 完整代码

## 处理数据

```python
from datasets import Dataset
from transformers import BertTokenizer
import os

def load_data(base_path):
    paths = os.listdir(base_path)
    result = []
    for path in paths:
        with open(os.path.join(base_path, path), 'r', encoding='utf-8') as f:
            result.append(f.readline())
    return result

def get_dataset(base_path):
    pos_data = load_data(os.path.join(base_path, 'pos'))
    neg_data = load_data(os.path.join(base_path, 'neg'))
    
    texts = pos_data + neg_data
    labels = [[1., 0.]]*len(pos_data) + [[0., 1.]] * len(neg_data)
    dataset = Dataset.from_dict({'texts':texts, 'labels':labels})
    return dataset

# 加载数据

train_dataset = get_dataset('../data/aclImdb/train/')
test_dataset = get_dataset('../data/aclImdb/test/')

# 处理数据
cache_dir="../transformersModels/bert-base-uncased/"
tokenizer = BertTokenizer.from_pretrained(cache_dir)

MAX_LENGTH = 512
train_dataset = train_dataset.map(lambda e: tokenizer(e['texts'], truncation=True, padding='max_length', max_length=MAX_LENGTH), batched=True)
test_dataset = test_dataset.map(lambda e: tokenizer(e['texts'], truncation=True, padding='max_length', max_length=MAX_LENGTH), batched=True)

# 保存数据
train_dataset.save_to_disk('./data/train_dataset')
test_dataset.save_to_disk('./data/test_dataset')
```

## 训练模型

```python
from transformers import BertForSequenceClassification, BertTokenizer, Trainer, TrainingArguments, BertConfig
import torch
from datasets import Dataset
import json
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "1"

# 加载模型
model = BertForSequenceClassification.from_pretrained('../transformersModels/bert-base-uncased/', num_labels=2)

# 加载数据
train_dataset = Dataset.load_from_disk('./data/train_dataset/')
test_dataset = Dataset.load_from_disk('./data/test_dataset/')

# 冻结bert参数
for param in model.base_model.parameters():
    param.requires_grad = False

# 创建trianer
training_args = TrainingArguments(
    output_dir='./my_results',          # output directory 结果输出地址
    num_train_epochs=10,              # total # of training epochs 训练总批次
    per_device_train_batch_size=128,  # batch size per device during training 训练批大小
    per_device_eval_batch_size=128,   # batch size for evaluation 评估批大小
    logging_dir='./my_logs',            # directory for storing logs 日志存储位置
)

trainer = Trainer(
    model=model.to('cuda'),              # the instantiated 🤗 Transformers model to be trained 需要训练的模型
    args=training_args,                  # training arguments, defined above 训练参数
    train_dataset=train_dataset,         # training dataset 训练集
    eval_dataset=test_dataset,           # evaluation dataset 测试集
)

# 训练和保存
trainer.train()
trainer.save_model()
```

## 载入模型

```python
output_config_file = './my_results/config.json'
output_model_file = './my_results/pytorch_model.bin'

config = BertConfig.from_json_file(output_config_file)
model = BertForSequenceClassification(config)
state_dict = torch.load(output_model_file)
model.load_state_dict(state_dict)
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/123898549)
