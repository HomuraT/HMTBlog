---
title: "Transformers预训练模型使用：序列分类 Sequence Classification"
published: 2022-01-10
description: ''
image: ''
tags: ["机器学习", "自然语言处理", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

序列分类任务的工作是将文本序列归类到预设类型中，如新闻分类、情感分类等，就属于这类任务。

## 情感分类

以下是使用`pipelines`来进行情感分类的例子，具体任务是判断输入文本是消极的还是积极的。

示例：

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

result = classifier("I hate you")[0]
print(f"label: {result['label']}, with score: {round(result['score'], 4)}")

result = classifier("I love you")[0]
print(f"label: {result['label']}, with score: {round(result['score'], 4)}")
```

输出结果：

```python
label: NEGATIVE, with score: 0.9991
label: POSITIVE, with score: 0.9999
```

- 该模型会返回文本的标签，即`NEGATIVE`或`POSITIVE`，和它在这个标签上的评价分数`score`。

## 语句释义

以下是语句释义的例子，主要任务是使用一个模型来判断两个序列是否可以相互解释。过程如下：

1. 实例化一个文本标记器（tokenizer）和一个BERT模型（model），并将加载预训练的权重。
2. 用两个句子建立一个序列，其中包含特定模型的分隔符、标记类型ID和注意力掩码。这一步可以使用文本标记器自动生成。
3. 将创建好的序列送入模型，并获得分类结果。结果由两个类组成：0（表示不能释义）和1（表示可以释义）。
4. 使用softmax将其转化为分类的概率。
5. 打印结果。

示例：

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

tokenizer = AutoTokenizer.from_pretrained("bert-base-cased-finetuned-mrpc")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-cased-finetuned-mrpc")

classes = ["不能释义", "可以释义"]

sentence_0 = "I am a student coming from China."
sentence_1 = "I am a big pig."
sentence_2 = "I am a person who studies in the school"

paraphrase = tokenizer(sentence_0, sentence_2, return_tensors="pt")
not_paraphrase = tokenizer(sentence_0, sentence_1, return_tensors="pt")

paraphrase_classification = model(**paraphrase)
not_paraphrase_classification = model(**not_paraphrase)

p_result = torch.softmax(paraphrase_classification[0], dim=1)[0]
np_result = torch.softmax(not_paraphrase_classification[0], dim=1)[0]

print(sentence_0, "\n", sentence_2)
for i in range(len(classes)):
    print("{}:{:.2f}%".format(classes[i], p_result[i].item() * 100))

print(sentence_0, "\n", sentence_1)
for i in range(len(classes)):
    print("{}:{:.2f}%".format(classes[i], np_result[i].item() * 100))
```

输出结果：

```python
I am a student coming from China. 
 I am a person who studies in the school
不能释义:23.34%
可以释义:76.66%
I am a student coming from China. 
 I am a big pig.
不能释义:92.51%
可以释义:7.49%
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/122411152)
