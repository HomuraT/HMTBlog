---
title: "Transformers快速入门 Quick tour"
published: 2021-10-31
description: ''
image: ''
tags: ["自然语言处理", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

先简单介绍一下Transformers库的特点。Transformers可用于下载自然语言理解（Natural Language Understanding）任务的预训练模型，如情感分析任务；也可以用于下载自然语言生成（Natural Language Generation）任务的预训练模型，如翻译任务。

# 使用pipline进行一个自然语言处理任务

使用pipline可以快速地使用一些预训练模型。

transformers提供了一些经典的自然语言任务：

1. 情感分析：分析文本是正面的还是负面的。
2. 文本生成：提供一个语句，模型将生成该语句的下一句。
3. 命名实体识别：在输入的语句中，对每个单词进行标记，来揭示该单词的含义。
4. 问答：输入一段文本及一个问题，来从文本中抽取出这个问题的答案。
5. 填补被掩盖的文本：输入一段文本，其中一些单词被 [MASK] 标记取代，模型会填补这些被掩盖的文本。
6. 摘要生成：产生一段长文本的摘要。
7. 翻译：将一种语言转换为另一种语言。
8. 特征提取：得到一段文本的tensor表示。

## 情感分析样例

**单个语句输入代码：**

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
print(classifier("We are very happy to introduce pipeline to the transformers repository."))
print(classifier("I hate you!"))
```

初次执行此代码时，会从网上下载一个默认的预训练模型（pre-training model）以及一个文本标记器（tokenizer）。标记器的作用是对文本进行处理，随后模型会对处理过后会的文本及进行预测。

**代码输出结果如下：**

```python
[{'label': 'POSITIVE', 'score': 0.9996980428695679}]
[{'label': 'NEGATIVE', 'score': 0.9987472891807556}]
```

除了单句输入，也可以将包含多个句子的列表输入模型来获得结果。

**多个语句输入：**

```python
from transformers import pipeline

sentences = [
    "I am very happy!",
    "I am not happy."
]

classifier = pipeline("sentiment-analysis")
print(classifier(sentences))
```

**输出结果如下：**

```python
[{'label': 'POSITIVE', 'score': 0.9998728632926941}, 
{'label': 'NEGATIVE', 'score': 0.9997913241386414}]
```

## 下载中意的模型

若我们在`pipline`中没有指定模型名字，则会下载任务对应的默认模型。

如上例，他会下载一个叫`“distilbert-base-uncased-finetuned-sst-2-english”`的模型。

如果我们不想使用这个模型，可以在 [https://huggingface.co/models](https://huggingface.co/models) ，这个网站上查看一些模型。并在详细页中可以试用模型并查看模型导入代码。

![请添加图片描述](/images/csdn/36383a3c2212fbf70c48c5cd.png)


# Tokenizer的使用

文本标记器是用来对文本进行预处理的工具。

标记器在使用时，会将一个句子分割成单个的`word`，这些`word`被称为`tokens`。

之后，标记器会把`tokens`转化为数字，在转化为数字后，我们就可以把它们送到模型当中。

为了实现把tokens转化为数字的功能，标记器拥有一个词表，这个词表是我们进行实例化并指明模型的时候下载的，这个标记器使用的此表与模型在预训练中使用的词表相同。

示例：

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
sentence = "We are very happy to show you the Transformers library"
inputs = tokenizer(sentence)
print(inputs)
```

输出结果：

```python
{'input_ids': [101, 2057, 2024, 2200, 3407, 2000, 2265, 2017, 1996, 19081, 3075, 102], 
'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
```

可以看到，返回的值是一个字典，里面有两个键值对。

第一个键值对"input_ids"，是对输入的句子转换成数字的结果，并且长度等于这个句子的单词数。

第二个键值对"attention_mask"，值全为1，表示让模型关注里面的所有词。

若我们想一次放入一个批次的句子，则可以输入一个句子列表。

示例：

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
sentence = [
    "We are very happy to show you the Transformers library",
    "I am not happy."
]
inputs = tokenizer(sentence)
print(inputs)
```

输出结果：

```python
{'input_ids': 
[[101, 2057, 2024, 2200, 3407, 2000, 2265, 2017, 1996, 19081, 3075, 102], 
[101, 1045, 2572, 2025, 3407, 1012, 102]], 
'attention_mask': 
[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1]]}
```

## padding

在某些情况下，我们需要对句子进行截取或补全来使模型输入一致。这是就需要用到在使用tokenizer时加入参数`padding、truncation、max_length`。

- padding：布尔型，表示是否进行填充。
- truncation：布尔型，表示是否进行截断。
- max_length：表示文本最大长度，若文本超出此长度则进行截断，若文本小于此长度则进行填充。

示例：

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
sentence = [
    "We are very happy to show you the Transformers library",
    "I am not happy."
]
inputs = tokenizer(
    sentence,
    padding=True,
    truncation=True,
    max_length=10,
    return_tensors="pt"
)
print(inputs)
```

运行结果：

```python
{'input_ids': 
[[101, 2057, 2024, 2200, 3407, 2000, 2265, 2017, 1996, 102], 
[101, 1045, 2572, 2025, 3407, 1012, 102, 0, 0, 0]], 
'attention_mask': 
[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 0, 0, 0]]}
```

可以看出所有的输入长度都变为了10，且对于长度小于`max_length`的句子会在后面进行0填充，且`attention_mask`中也将填充位置设置为0，表示不需要注意这些词。

注意：从运行结果可以看到，两个句子前后都分别填充了一个索引为`101`和`102`的标记，这是任务中的特殊标记，在这个`tokenizer`中表示`[CLS]`和`[SEP]`。

# Model使用

当你的输入文本被`tokenizer`预处理后，你就可以将其送入模型了。因为它以及包括了需要输入的所有信息。

需要注意的是，当你使用`pytorch`模型时，你不能直接将`input`s输入，而是需要使用`**`进行变量解包。

示例：

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
sentence = [
    "We are very happy to show you the Transformers library",
    "I am not happy."
]
inputs = tokenizer(
    sentence,
    padding=True,
    truncation=True,
    max_length=10,
    return_tensors="pt"
)

pt_output = model(**inputs)
print(pt_output)
```

运行结果：

```python
(tensor([[-4.2644,  4.6002],
         [ 4.7293, -3.7452]], grad_fn=<AddmmBackward0>),)
```

- 注意：
    
    `return_tensors="pt“`，不能少，要不会报错。
    
    在transformers中，所有输出都是元组（可能有多个，也可能只有一个元素）。在这个样例中，我们得到的最终输出就是只有以一个元素的元组。
    
    所有transformers模型（无论是Pytorch，还是Tensorflow）返回的结果都是**最后的激活函数之前产生的结果（如softmax）**，因为最终激活函数往往与损失函数融合。
    

## 使用softmax让结果更”顺眼”

上例中输出的结果绝对值都是大于1的，跟我们以前预测的结果不太像，此时我们可以将其应用到softmax上，代码如下：

```python
import torch.nn.functional as F
pt_predictions = F.softmax(pt_output[0], dim=-1)
print(pt_predictions)
```

结果如下：

```python
tensor([[1.4128e-04, 9.9986e-01],
        [9.9979e-01, 2.0870e-04]], grad_fn=<SoftmaxBackward0>)
```

这样的结果就舒服多了。

## 加入labels参数可以得到loss

除此之外，如果我们知道分类的标签，也可以将其输入到模型中，会得到形如`(loss, outputs)`这样的元组，示例如下：

```python
import torch
# 假定消极为0，积极为1 
pt_outputs = model(**inputs, labels = torch.tensor([1, 0]))
print(pt_outputs)
```

结果如下：

```python
(tensor(0.0002, grad_fn=<NllLossBackward0>),
 tensor([[-4.2644,  4.6002],
         [ 4.7293, -3.7452]], grad_fn=<AddmmBackward0>))
```

## 下载的预训练模型也可以正常训练

这些预训练模型除了可以用来预测之外，也可以用来训练，因为这些模型的底层是基于`torch.nn.Module`或`tf.keras.Model`实现的。当然，Transformers库也贴心地准备了`Tranier`和`TFTrainer`类来帮助训练，可用来进行分布式训练、混合进度等任务。这些类之后会介绍，这里先提一下。

## 保存和加载模型

当你微调完模型后，你可以使用如下方式保存你的`tokenizer`和`model`：

```python
tokenizer.save_pretrained(save_directory)
model.save_pretrained(save_directory)
```

在你想加载保存在本地的模型时（注意不是网上下的），你可以使用`from_pretrained()`函数。需要注意的是，此时里面需要传入的参数是**文件的本地路径**而不是**模型名称**。

此外，transformers还有一个很coooooooooool的特性，就是你可以很简单地在Pytorch和Tensorflow之间切换，因为任何通过transformers保存的模型都可以直接在Pytorch和Tensorflow中导入。如果你想要在PyTorch中导入一个Tensorflow下的模型，你只需要如下操作（从PyTorch到Tensorflow只需切换相应的类就行了）：

```python
# Tensorflow下导入Pytorch的模型
tokenizer = AutoTokenizer.from_pretrained(save_directory)
model = TFAutoModel.from_pretrained(save_directory, from_pt=True)

# Pytorch下导入Tensorflow的模型
tokenizer = AutoTokenizer.from_pretrained(save_directory)
model = AutoModel.from_pretrained(save_directory, from_tf=True)

# 如果是相同环境，则 from_xx 参数不需要加
```

## 获得隐含层权重和注意力权重

如果你想获得所有隐含层权重和注意力权重，你需要进行如下操作：

```python
pt_outputs = model(**inputs, output_hidden_states=True, output_attentions=True)
all_hidden_states, all_attentions = pt_outputs[-2:]
```

# 关于代码

`AutoModel` 和 `AutoTonkenizer` 类是我们使用预训练模型的捷径。在这背后，transformers库为每个类型的模型提供了一个模型类，因此只要你需要，你可以很容易的找到代码并进行修改。

以上面的例子来说，这个模型的名字叫做`“distilbert-base-uncased-finetuned-sst-2-english”`，其构造架构为`DustilBERT`。对应的模型类为`AutoModelForSequenceClassification`（若在TensorFlow环境下，则为`TFAutoModelForSequenceClassification`）。你可以在文档中了解这个模型的详细信息，也可以浏览其源代码。

你若不想使用自动加载，也可以用如下这种方式导入相同的模型：

```python
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = DistilBertForSequenceClassification.from_pretrained(model_name)
tokenizer = DistilBertTokenizer.from_pretrained(model_name)
```

# 自定义模型

如果你想要改变模型的结构，你可以自定义配置类。每个模型架构都有它自己的配置，如之前的`DistilBERT`，它的配置类为`DistilBertConfig`。你可以在里面自定义任意的特征维度、随机失活比例等。需要注意，如果你对模型的核心进行了修改，如修改了其中的隐含层的大小，那么你就不能再使用预训练模型了，你必须从头开始训练这个模型。但你仍然可以通过配置实例化模型，只是没有训练好的权重。

如下例，我们使用预定义的`DistilBERT`词汇表，和使用配置类随机初始化一个自定义的模型：

```python
from transformers import DistilBertConfig, DistilBertTokenizer, DistilBertForSequenceClassification
config = DistilBertConfig(n_heads=8, dim=512, hidden_dim=4*512)
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertForSequenceClassification(config)
```

- 由于使用了预定义的`Tokenizer`，因此使用方法`from_pretrained`。
- 由于改变了模型的结构，不能加载预训练模型，因此使用`config`实例化。

对于不修改模型核心的操作，如修改标签的个数，我们仍然可以使用预训练模型。如下，我们使用预训练模型创建一个用于10个分类的分类器。可以使用除了`labels`数量外，其他全为默认的配置类；也可以直接写在`from_pretrained`里面，它会自己修改默认的配置类。代码如下：

```python
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
model_name = "distilbert-base-uncased"
model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=10)
tokenizer = DistilBertTokenizer.from_pretrained(model_name)

sentence = [
    "I am happly"
]

inputs = tokenizer(
    sentence,
    return_tensors="pt"
)

print(model(**inputs))
```

运行结果：

```python
(tensor([[-0.0141, -0.1514,  0.0542,  0.0729,  0.1489, -0.1813,  0.0564, -0.0404,
          -0.0721,  0.0494]], grad_fn=<AddmmBackward0>),)
```

可见，变成了10分类。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/121071756)
