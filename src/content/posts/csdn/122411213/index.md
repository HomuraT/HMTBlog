---
title: "Transformers预训练模型使用：抽取式问答 Extractive Question Answering"
published: 2022-01-10
description: ''
image: ''
tags: ["自然语言处理", "深度学习", "机器学习", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

### 使用pipeline

抽取式问答的任务是给定一个文本和一个问题，需要从文本中抽取出问题的回答。有个叫`SQuAD`的数据集可以完全适用于这个任务。

以下是一个使用`pipline`来实现抽取式问答的样例，会用到一个基于SQuAD数据集微调后的模型：

示例代码：

```python
from transformers import pipeline

nlp = pipeline("question-answering")

context = r"""
Last year, I went to the countryside to get my internship, my duty was to be a teacher, teaching the middle school students English. 
"""

result = nlp(question="When did I go to countryside to teach someone?", context=context)
print(f"Answer: '{result['answer']}', score: {round(result['score'], 4)}, start: {result['start']}, end: {result['end']}")

result = nlp(question="What is my occupation?", context=context)
print(f"Answer: '{result['answer']}', score: {round(result['score'], 4)}, start: {result['start']}, end: {result['end']}")

result = nlp(question="What subject does I teach?", context=context)
print(f"Answer: '{result['answer']}', score: {round(result['score'], 4)}, start: {result['start']}, end: {result['end']}")
```

输出结果：

```python
Answer: 'Last year,', score: 0.9787, start: 1, end: 11
Answer: 'teacher,', score: 0.9525, start: 80, end: 88
Answer: 'English.', score: 0.9585, start: 125, end: 134
```

### 使用模型和文本标记器

除了使用pipeline快速构建，我们也可以使用一个模型和一个文本标记器来实现问答。具体步骤如下：

1. 实例化一个预训练的BERT模型和对应文本标记器。
2. 提供一段文本和几个问题。
3. 将问题放入迭代器，并利用当前模型的token索引和注意力掩码将文本和问题序列化。
4. 将这些序列送入模型并获得输出，输出包含两部分`start_logits`和 `end_logits` ，前者表示每个token作为答案开始的分数，后者表示每个token作为答案结束的分数。
5. 利用softmax可获得每个token作为开始或结束的可能性。
6. 获得答案的开始和结束，并将其转变为字符串，即文本答案。
7. 输出结果

示例代码：

```python
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch

tokenizer = AutoTokenizer.from_pretrained("bert-large-uncased-whole-word-masking-finetuned-squad", cache_dir="./transformersModels/question-answering")
model = AutoModelForQuestionAnswering.from_pretrained("bert-large-uncased-whole-word-masking-finetuned-squad", cache_dir="./transformersModels/question-answering", return_dict=True)

text = r"""
Last year, I went to the countryside to get my internship, my duty was to be a teacher, teaching the middle school students English. 
"""

questions = [
    "When did I go to countryside to teach someone?",
    "What is my occupation?",
    "What subject does I teach?",
]

for question in questions:
    inputs = tokenizer(question, text, add_special_tokens=True, return_tensors="pt")
    input_ids = inputs["input_ids"].tolist()[0]
    text_tokens = tokenizer.convert_ids_to_tokens(input_ids)
    outputs = model(**inputs)
    answer_start_scores = outputs["start_logits"]
    answer_end_scores = outputs["end_logits"]
    answer_start = torch.argmax(
        answer_start_scores
    )  # 获得最可能是答案开始的token的下标
    answer_end = torch.argmax(answer_end_scores) + 1  # 获得最可能是答案结束的token的下标
    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))
    print(f"Question: {question}")
    print(f"Answer: {answer}")
    print()
```

输出结果：

```python
Question: When did I go to countryside to teach someone?
Answer: last year

Question: What is my occupation?
Answer: teacher

Question: What subject does I teach?
Answer: english
```

- 注意
    
    这里的`tokenizer`会将问题和文本都进行序列化，并在两头和中间插入特殊字符，序列化后的文本真实值类似于`[CLS] what subject does i teach ? [SEP] last year , i went to the countryside to get my internship , my duty was to be a teacher , teaching the middle school students english . [SEP]` 其中`[CLS]`和`[SEP]`是BERT中的特殊符号。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/122411213)
