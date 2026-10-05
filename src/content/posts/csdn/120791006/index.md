---
title: "torchtext.data.utils"
published: 2021-10-15
description: ''
image: ''
tags: ["自然语言处理", "Python", "PyTorch"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# get_tokenizer(tokenizer, language='en')

功能：使用分词器对句子进行分词。

参数：

- tokenizer：分词器名称。
    
    如果传入`None`，功能相当于`simple_space_split()`，**不会分割标点符号**。
    
    如果传入`"basic_english"`，则会将字母转为小写并按空格分割，**会分割标点符号**。
    
    如果传入`可调用函数`，则会调用并返回相应结果。
    
    如果传入`分词库名称`，则会返回相应的结果，分词库有spacy、moses、toktok、revotk，subword等。
    
- language：语言名称，默认为`en`。

示例：

```python
import torchtext
from torchtext.data.utils import get_tokenizer

# 传入None
tokenizer = get_tokenizer(None)
tokens = tokenizer("You can,\t\tnow\n\ninstall TorchText using pip!!!")
print(tokens)

# 传入"basic_english"
tokenizer = get_tokenizer("basic_english")
tokens = tokenizer("You can,\t\tnow\n\ninstall TorchText using pip!!!")
print(tokens)

# 传入可调用函数
def mySplit(text:str):
    return text.split(" ")

tokenizer = get_tokenizer(mySplit)
tokens = tokenizer("You can,\t\tnow\n\ninstall TorchText using pip!!!")
print(tokens)

# 传入分词库名称
tokenizer = get_tokenizer("moses")
tokens = tokenizer("You can,\t\tnow\n\ninstall TorchText using pip!!!")
print(tokens)
```

示例结果：

```python
['You', 'can,', 'now', 'install', 'TorchText', 'using', 'pip!!!']
['you', 'can', ',', 'now', 'install', 'torchtext', 'using', 'pip', '!', '!', '!']
['You', 'can,\t\tnow\n\ninstall', 'TorchText', 'using', 'pip!!!']
['You', 'can', ',', 'now', 'install', 'TorchText', 'using', 'pip', '!', '!', '!']
```

# ngarms_iterator(token_list, ngrams)

功能：生成ngram词袋分词。

参数：

- token_list：分词结果列表。
- ngrams：词袋大小

示例：

```python
import torchtext
from torchtext.data.utils import get_tokenizer, ngrams_iterator

tokenizer = get_tokenizer("basic_english")
tokens = tokenizer("You can\t\tnow")

list(ngrams_iterator(tokens, 3))
```

示例结果：

```python
['you', 'can', 'now', 'you can', 'can now', 'you can now']
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120791006)
