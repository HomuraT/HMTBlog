---
title: "Transformers预训练模型使用：命名实体识别 Named Entity Recognition"
published: 2022-01-10
description: ''
image: ''
tags: ["自然语言处理", "机器学习", "人工智能", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

命名实体识别的任务是对每一个token都进行分类。比如，识别这个token是不是一个人名、组织名或地名。命名实体识别的一个数据集是CoNLL-2003，这个数据集完全契合这个任务。

## 使用pipeline

下面是一个使用pipeline实现命名实体识别的样例。首先，要定义9中标签分类：

1. O：不是命名实体。
2. B-MIS：其他类命名实体的开始标记。
3. I-MIS：其他类命名实体的中间标记。
4. B-PER：人名的开始标记。
5. I-PER：人名的中间标记。
6. B-ORG：组织名的开始标记。
7. I-ORG：组织名的中间标记。
8. B-LOC：地名的开始标记。
9. I-LOC：地名的中间标记。

代码示例：

```python
from transformers import pipeline

nlp = pipeline("ner")

sequence = "Hugging Face Inc. is a company based in New York City. Its headquarters are in DUMBO, therefore very close to the Manhattan Bridge which is visible from the window."
print(nlp(sequence))
```

运行结果：

```python
[
    {'word': 'Hu', 'score': 0.9995632767677307, 'entity': 'I-ORG'},
    {'word': '##gging', 'score': 0.9915938973426819, 'entity': 'I-ORG'},
    {'word': 'Face', 'score': 0.9982671737670898, 'entity': 'I-ORG'},
    {'word': 'Inc', 'score': 0.9994403719902039, 'entity': 'I-ORG'},
    {'word': 'New', 'score': 0.9994346499443054, 'entity': 'I-LOC'},
    {'word': 'York', 'score': 0.9993270635604858, 'entity': 'I-LOC'},
    {'word': 'City', 'score': 0.9993864893913269, 'entity': 'I-LOC'},
    {'word': 'D', 'score': 0.9825621843338013, 'entity': 'I-LOC'},
    {'word': '##UM', 'score': 0.936983048915863, 'entity': 'I-LOC'},
    {'word': '##BO', 'score': 0.8987102508544922, 'entity': 'I-LOC'},
    {'word': 'Manhattan', 'score': 0.9758241176605225, 'entity': 'I-LOC'},
    {'word': 'Bridge', 'score': 0.990249514579773, 'entity': 'I-LOC'}
]
```

## 使用模型和文本标记器

过程如下：

1. 实例化预训练模型和对应文本标记器。需要一个BERT模型。
2. 定义模型训练时的标签列表。
3. 定义一个有已知名命实体的序列，如“纽约市”。
4. 分割单词用于模型预测。这里可以使用一个小技巧，先对序列编码再解码，我们就可以得到一个包含特殊标记的字符串，如BERT中的“<CLS>”。
5. 将序列编码为索引数组。（特殊标记会自动添加，不需要手动添加）
6. 将数据输入模型获得的结果来进行标签预测。获得的结果是9个分类的概率分布。一般是使用最高概率的那个标签最为最终预测结果。
7. 将每个标记与其预测标签一起打印出来。

示例代码

```python
cache_dir="./transformersModels/ner"
"""
,cache_dir = cache_dir
"""
from transformers import AutoModelForTokenClassification, AutoTokenizer
import torch
model = AutoModelForTokenClassification.from_pretrained("dbmdz/bert-large-cased-finetuned-conll03-english",cache_dir = cache_dir, return_dict=True)
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased",cache_dir = cache_dir)

label_list = [
    "O",       # Outside of a named entity
    "B-MISC",  # Beginning of a miscellaneous entity right after another miscellaneous entity
    "I-MISC",  # Miscellaneous entity
    "B-PER",   # Beginning of a person's name right after another person's name
    "I-PER",   # Person's name
    "B-ORG",   # Beginning of an organisation right after another organisation
    "I-ORG",   # Organisation
    "B-LOC",   # Beginning of a location right after another location
    "I-LOC"    # Location
]

sequence = "Hugging Face Inc. is a company based in New York City. Its headquarters are in DUMBO, therefore very" \
           "close to the Manhattan Bridge."

# Bit of a hack to get the tokens with the special tokens
tokens = tokenizer.tokenize(tokenizer.decode(tokenizer.encode(sequence)))
inputs = tokenizer.encode(sequence, return_tensors="pt")

outputs = model(inputs).logits
predictions = torch.argmax(outputs, dim=2)

for token, prediction in zip(tokens, predictions[0].numpy()):
    print(token, label_list[prediction])
```

输出结果：

```python
[CLS] O
Hu I-ORG
##gging I-ORG
Face I-ORG
Inc I-ORG
. O
is O
a O
company O
based O
in O
New I-LOC
York I-LOC
City I-LOC
. O
Its O
headquarters O
are O
in O
D I-LOC
##UM I-LOC
##BO I-LOC
, O
therefore O
very O
##c O
##lose O
to O
the O
Manhattan I-LOC
Bridge I-LOC
. O
[SEP] O
```

整理结果可以得到最终预测实体：

```python
ORG:Hugging Face Inc
LOC:New York City
LOC:DUMBO
LOC:Manhattan Bridge
```

与pipline不同，这里并不会自动整合实体并删除“O”分类，需要自己写代码实现。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/122411325)
