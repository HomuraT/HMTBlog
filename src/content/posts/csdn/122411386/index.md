---
title: "Transformers预训练模型使用：翻译 Translation"
published: 2022-01-10
description: ''
image: ''
tags: ["自然语言处理", "深度学习", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

翻译是将一个语言的文本转化为另一个语言文本的任务。

翻译任务的一个比较经典的数据集是WMT English to German dataset，将英语作为输入，对应德语作为输出（自己用的时候也可以反过来）。

## 使用pipeline

可以使用如下代码快速实现：

```python
from transformers import pipeline

translator = pipeline("translation_en_to_de")
print(translator("Hugging Face is a technology company based in New York and Paris", max_length=40))
```

运行结果：

```python
[{'translation_text': 'Hugging Face ist ein Technologieunternehmen mit Sitz in New York und Paris.'}]
```

由于翻译的pipeline依赖于`PreTrainedModel.generate()`方法，因此我们可以像上面的`max_length`一样覆盖默认的方法。

## 使用模型和文本标记器

具体步骤如下：

1. 实例化文本标记器和模型。一般使用`BERT`或`T5`模型。
2. 定义一个需要翻译的文本。
3. 加上`T5`翻译的特殊前缀`translate English to German:`。
4. 使用`PreTrainedModel.generate()`方法进行翻译。

示例代码：

```python
cache_dir="./transformersModels/summarization"
"""
,cache_dir = cache_dir
"""
from transformers import AutoModelWithLMHead, AutoTokenizer

model = AutoModelWithLMHead.from_pretrained("t5-base",cache_dir = cache_dir, return_dict=True)
tokenizer = AutoTokenizer.from_pretrained("t5-base",cache_dir = cache_dir)

inputs = tokenizer.encode("translate English to German: Hugging Face is a technology company based in New York and Paris", return_tensors="pt")
outputs = model.generate(inputs, max_length=40, num_beams=4, early_stopping=True)
print(tokenizer.decode(outputs[0]))
```

运行结果：

```python
Hugging Face ist ein Technologieunternehmen mit Sitz in New York und Paris.
```

与pipeline结果一致。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/122411386)
