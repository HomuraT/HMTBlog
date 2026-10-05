---
title: "torchtext.data.functional"
published: 2021-10-15
description: ''
image: ''
tags: ["Python", "工具", "自然语言处理", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# custom_replace(replace_pattern)

功能：用于按规则对文本进行替换。

参数：

- replace_pattern：替换规则列表，可使用正则表达式。

样例：

```python
from torchtext.data.functional import custom_replace

custom_replace_transform = custom_replace([(r'[Se]', '#'), (r'\s+', '_')])
list_a = ["Sentencepiece encode  aS  pieces", "exampleS to   try!"]
print(list(custom_replace_transform(list_a)))
```

样例结果：

```python
['##nt#nc#pi#c#_#ncod#_a#_pi#c#s', '#xampl##_to_try!']
```

# simple_space_split(iterator)

功能：按照空白字符切割文本，包括**空格、制表符、换行**等。

参数：

- iterator：迭代器。需要分割的文本。

样例：

```python
from torchtext.data.functional import simple_space_split

list_a = ["Sentencepiece\t\t\tencode as\n pieces", "example to try!"]
print(list(simple_space_split(list_a)))
```

样例结果：

```python
[['Sentencepiece', 'encode', 'as', 'pieces'], ['example', 'to', 'try!']]
```

注意：只是单纯的按空白字符分割，**标点符号会跟单词连在一起**。

# numericalize_tokens_from_iterator(vocab, iterator, removed_tokens=None)

功能：将**文本列表**根据**字典**映射为**索引的迭代器**。

参数：

- vocab：单词与索引的对应字典。
- iterator：文本迭代器。需要转换为索引的文本。
- removed_tokens：需要忽略的单词列表，默认None。若不为None，则列表中的单词在索引化时会被删除。

样例：

```python
from torchtext.data.functional import simple_space_split, numericalize_tokens_from_iterator

vocab = {
    "Sentencepiece":0,
    "encode":1,
    "as":2,
    "pieces":3
}

sentences = [
    "Sentencepiece encode as as as",
    "pieces pieces encode"
]

ids_iter = numericalize_tokens_from_iterator(
    vocab=vocab,
    iterator=simple_space_split(sentences),
)

for ids in ids_iter:
    print([num for num in ids])
    
ids_iter = numericalize_tokens_from_iterator(
    vocab=vocab,
    iterator=simple_space_split(sentences),
    removed_tokens=["encode"]
)

for ids in ids_iter:
    print([num for num in ids])
```

样例结果：

```python
[0, 1, 2, 2, 2]
[3, 3, 1]
[0, 2, 2, 2]
[3, 3]
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120790997)
