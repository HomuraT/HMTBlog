---
title: "Transformers训练和微调：Training and Fine-tuning"
published: 2022-03-28
description: ''
image: ''
tags: ["自然语言处理", "机器学习", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


Transformers种的模型类旨在兼容`Pytorch`和`Tensorflow2`，并且可以无缝地在其中使用。本节，会展示如何使用标准的训练工具从头开始训练或微调一个模型。此外，也会展示如何使用`Trainer()`类来处理复杂的训练过程。

# 使用PyTorch来微调

## 自定义任务模型

在Transformers中，不以`TF`开头的模型类是Pytorch模型，这意味着你可以使用它们像`Pytorch`模型一样进行推理和优化。

以使用序列分类数据在BERT上微调为例。当我们使用`from_pretrained()`实例化一个模型时，会使用模型的配置文件和预训练权重来初始化模型。此外，`Transformers`还包括一些特定任务的最终层或“头”，当没有指定预训练模型时，这些层会随机初始化。

例如，我们使用`BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=123)`来实例化模型时，会生实例化一个BERT模型，其中编码器（encoder）的权重使用的是`bert-base-uncased`的权重，编码器的尾部会生成一个输出维度为123的序列分类头。

模型的默认模式是`eval`，可以使用`train()`方法来让其变为训练模式。如下

```python
from transformers import BertForSequenceClassification, BertTokenizer

cache_dir="./transformersModels/bert-base-uncased/"

model = BertForSequenceClassification.from_pretrained('bert-base-uncased', return_dict=True, cache_dir=cache_dir, num_labels=123)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased',cache_dir = cache_dir)

sentence_0 = "I am a student coming from China."
sentence_1 = "I am a big pig."

paraphrase = tokenizer(sentence_0, sentence_2, return_tensors="pt")
paraphrase_classification = model(**paraphrase)

print(paraphrase_classification.logits.shape)

输出结果：
torch.Size([1, 123])
```

可以看见，我们定义了一个类别为123的序列分类部件，`BERT`模型的输出维度就变为了123。

这相当实用，因为我们可以使用这种方式很容易地使用自己的数据集训练一个带预训练`BERT`模型的分类器。

## 优化器

训练模型时，我们可以使用`Pytorch`自带的优化器`(optimizer)`，也可以使用`Transformers`提供的`AdamW()`优化器，它实现了梯度偏差校正和权重衰减。使用方式如下：

```python
from transformers import AdamW
optimizer = AdamW(model.parameters(), lr=1e-5)
```

这个优化器允许我们使用在不同参数上使用不同的超参。比如，我们可以将权重衰减应用于除了偏执和标准化层之外的所有层：

```python
no_decay = ['bias', 'LayerNorm.weight']
optimizer_grouped_parameters = [
    {'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)], 'weight_decay': 0.01},
    {'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)], 'weight_decay': 0.0}
]
optimizer = AdamW(optimizer_grouped_parameters, lr=1e-5)
```

- 注意这里的`p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)`
    
    等价于：`[p for (n, p) in model.named_parameters() if any((nd in n) for nd in no_decay)]`
    
    获取所有名字中带有`no_decay`中字符串的层参数。
    

## 输入数据处理

现在，我们可以开始使用文本标记器的`__call__()`方法开始简单的训练。这个方法会返回一个`BatchEncoding()`实例，这个实例会带有我们需要送入模型的所有参数。使用方式如下：

```python
from transformers import BertTokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
text_batch = ["I love Pixar.", "I don't care for Pixar."]
encoding = tokenizer(text_batch, return_tensors='pt', padding=True, truncation=True)
print(encoding)

输出结果：
{
'input_ids': tensor([
	[101, 1045, 2293, 14255, 18684, 2099, 1012, 102, 0, 0, 0, 0],
    [101, 1045, 2123, 1005, 1056, 2729, 2005, 14255, 18684, 2099, 1012,102]]), 'token_type_ids': tensor([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]), 
'attention_mask': tensor([
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]])
}
```

## Transformers反向传播与更新权重

当我们调用一个有`labels`参数的分类模型时，返回值的第一个元素是预测标签与真实标签之间的交叉熵损失。设置了优化器后，我们就可以开始反向传播和更新权重了，使用方法如下：

```python
labels = torch.tensor([1,0]).unsqueeze(0)
# 前向传播
outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
print(outputs)

# 反向传播 更新参数
loss = outputs.loss
loss.backward()
optimizer.step()

# 再次前向传播
outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
print(outputs)

输出结果：
SequenceClassifierOutput(
loss=tensor(1.9612, grad_fn=<NllLossBackward0>), 
logits=tensor([
	[ 0.1571, -0.0282, -0.0397, -0.5927, -0.2522,  0.0949, -0.2221,  0.9734, -0.2586, -0.1108],
    [ 0.8391, -0.3072, -0.2152, -0.4167, -0.4537, -0.1042,  0.0551,  0.5247, -0.1334,  0.0016]], grad_fn=<AddmmBackward0>), hidden_states=None, attentions=None)

SequenceClassifierOutput(
loss=tensor(1.9418, grad_fn=<NllLossBackward0>), 
logits=tensor([
	[ 0.3620, -0.0736, -0.0513, -0.4937, -0.2682, -0.0020, -0.1564,  0.9971, -0.1784, -0.0906],
	[ 0.9842, -0.3823, -0.1416, -0.4498, -0.4379, -0.0918,  0.1795,  0.3830, -0.1157,  0.0037]], grad_fn=<AddmmBackward0>), hidden_states=None, attentions=None)
```

## 自己计算损失并更新权重

此外，你也可以自己使用结果logits来计算，使用方法如下：

```python
from torch.nn import functional as F
labels = torch.tensor([1,0])
outputs = model(input_ids, attention_mask=attention_mask)
loss = F.cross_entropy(outputs.logits, labels)
loss.backward()
optimizer.step()
```

当然，我们可以使用`to('cuda')`方法来使用GPU训练，跟使用Pytorch一样。

## 学习率调整工具

Transformers还提供了一些调整学习率的工具。如下，我们可以设置一个调整器，用它来设置预热学习率然后在训练结束时线性衰减到0。设置方式如下：

```python
from transformers import get_linear_schedule_with_warmup
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps, num_train_steps)
```

在使用调整器时，需要在`optimizer.step()`后面调用`scheduler.step()`，如下：

```python
loss.backward()
optimizer.step()
scheduler.step()
```

## 冻结参数

有时候，我们想要冻结预训练模型的参数，只优化分类器（或之类的组件）的参数，只需要将编码器的`requires_grad`设置为`False`就行了，在Transformes中，可以使用`base_model`属性获取所有特定任务的子模型：

```python
for param in model.base_model.parameters():
    param.requires_grad = False
```

## Transformers建议

Transformers强烈建议使用`Trainer()`，会在之后介绍这个类，它可以很方便地处理训练过程中地动态部分，有混合精度训练和简单`tensorboard`日志等功能。

# Trainer

Transformers提供了简单但功能齐全的训练和评估接口，即`Trainer()`和`TFTrainer()`。你可以使用这个类来训练、微调和评估任何的Transformers模型，且这个类含有很多的训练选项以及日志记录、梯度累积和混合精度训练等内置功能。使用方式如下：

```python
from transformers import BertForSequenceClassification, Trainer, TrainingArguments
cache_dir="./transformersModels/bert-base-uncased/"

model = BertForSequenceClassification.from_pretrained('bert-base-uncased', return_dict=True, cache_dir=cache_dir, num_labels=10)

training_args = TrainingArguments(
    output_dir='./results',          # output directory 结果输出地址
    num_train_epochs=3,              # total # of training epochs 训练总批次
    per_device_train_batch_size=16,  # batch size per device during training 训练批大小
    per_device_eval_batch_size=64,   # batch size for evaluation 评估批大小
    warmup_steps=500,                # number of warmup steps for learning rate scheduler 预热学习率调整器步数
    weight_decay=0.01,               # strength of weight decay 权重衰减强度（正则项权重）
    logging_dir='./logs',            # directory for storing logs 日志存储位置
)

trainer = Trainer(
    model=model,                         # the instantiated 🤗 Transformers model to be trained 需要训练的模型
    args=training_args,                  # training arguments, defined above 训练参数
    train_dataset=train_dataset,         # training dataset 训练集
    eval_dataset=eval_dataset,           # evaluation dataset 测试集
    # data_collator=data_collator,         # 数据整理器
    # compute_metrics=compute_metrics      # 计算指标方法
)
```

定义完成后，就可以使用`trainer.train()`来训练模型，使用`trainer.evaluate()`来评估模型。不仅如此，你也可以用这种方式来训练自己的模型，不过有一个要求，就是**前向传播`forward`的返回值必须是你想要优化的损失**。

`Trainer()`使用一个内置的默认方法整理批次并做好输入模型的准备。如果想要自定以这个过程，你可以在实例化`Trainer`对象时将自己**整理数据集并返回一批数据的方法**作为`data_collator`参数传入。

此外，`Trainer`对象还允许自定义计算度量指标的方法（正确率，召回率，F1），只需要将计算指标的方法作为`compute_metrics`参数传入即可。如下:

```python
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }
```

最后，如果你想要在`Tensorboard`上查看包括度量指标在内的任何结果，只需要在`training_args`中`logging_dir`指定的路径启动Tensorboard即可。

# 额外资源

• [A lightweight colab demo](https://colab.research.google.com/drive/1-JIJlao4dI-Ilww_NnTc0rxtp-ymgDgM?usp=sharing) 是一个用 `Trainer` 在`IMDb`数据集上进行情感分类任务的例子。

• [🤗 Transformers Examples](https://github.com/huggingface/transformers/tree/master/examples) 包含了在 GLUE、SQuAD和几个其他任务上的训练和微调。

• [How to train a language model](https://colab.research.google.com/github/huggingface/blog/blob/master/notebooks/01_how_to_train.ipynb)是一个使用`Trainer` 训练掩码语言模型的例子。

• [🤗 Transformers Notebooks](https://huggingface.co/transformers/v3.4.0/notebooks.html) 包含了将Transformers应用于各种任务上的例子。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/123808680)
