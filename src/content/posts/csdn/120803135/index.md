---
title: "torchtext.vocab"
published: 2021-10-16
description: ''
image: ''
tags: ["Python", "PyTorch", "自然语言处理", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# class Vocab

功能：用于创建字典和应用字典

函数：

- `__contains__(token: str) → bool`
    
    功能：用于判断传入的词语是否存在于词典中。
    
    参数：
    
    - token：字符串。需要判断的词语。
    
    返回值：布尔值。传入单词是否在词典中
    
- `__getitem__(token: str) → int`
    
    功能：获得传入单词在词典中的索引。
    
    参数：
    
    - token：字符串。需要获得索引的词语。
    
    返回值：整型。对应的索引。
    
- `__init__(vocab)`
    
    功能：构造函数，创建`Vocab`实例。
    
    参数：
    
    - vocab：词典对象。
    
    注意：一般不通过构造函数创建`vocab`对象。
    
- `__len__() → int`
    
    功能：获得词典的长度。
    
    返回值：整型。词典长度。
    
- `__prepare_scriptable__()`
    
    返回值：一个叫`JITable Vocab`的对象。
    
    注意：这个方法用途我还没弄明白，返回的对象可以直接当`Vocab`对象使用。
    
- `append_token(token: str) → None`
    
    功能：插入新的词。
    
    参数：
    
    - token：字符串。需要插入词典的新词。
- `forward(tokens: List[str]) → List[int]`
    
    功能：调用`lookup_indices`函数，即将词列表映射为字典索引。
    
    参数：
    
    - tokens：字符串列表。需要映射为索引的词列表。
    
    返回值：整型列表。映射后的列表。
    
- `get_default_index() → Optional[int]`
    
    功能：返回默认索引，即未登录词的索引值。
    
    返回值：若设定，返回相应的索引。否则返回`None`。
    
- `get_itos() → List[str]`
    
    功能：获得记录在词典中的词列表。
    
    返回值：字符串列表。被记录的词的列表，在列表中按索引升序顺序排列。
    
- `get_stoi() → Dict[str, int]`
    
    功能：获得字典的`dict`对象。
    
    返回值：字典。key为登录词，value为其对应索引。
    
- `insert_token(token: str, index: int) → None`
    
    功能：在字典的指定位置插入新词。
    
    参数：
    
    - token：字符串。要插入的新词。
    - index：整型。插入的位置。
- `lookup_indices(tokens: List[str]) → List[int]`
    
    功能：将词语列表映射为索引列表。
    
    参数：
    
    - tokens：字符串列表。需要映射为索引的词列表。
    
    返回值：整型列表。映射后的列表。
    
- `lookup_token(index: int) → str`
    
    功能：获得索引位置的词语。
    
    参数：
    
    - index：整型。想要获得的词的索引。
    
    返回值：字符串。对应的词。
    
- `lookup_tokens(indices: List[int]) → List[str]`
    
    功能：将索引列表映射为词列表。
    
    参数：
    
    - indices：整型列表。需要映射为此列表的索引列表。
    
    返回值：字符串列表。映射后的词列表。
    
- `set_default_index(index: Optional[int]) → None`
    
    功能：设置默认索引，即未登录词的索引。
    
    参数：
    
    - index：整型。默认的索引。也可以传入`None`。

示例：

```python
from torchtext.vocab import Vocab, vocab
from collections import Counter, OrderedDict

counter = Counter(["a", "b", "b", "b", "c", "c"])
sorted_by_freq_tuples = sorted(counter.items(), key=lambda x:x[1], reverse=True)

ordered_dict = OrderedDict(sorted_by_freq_tuples)

v1 = vocab(ordered_dict)
# get_itos() → List[str]
print(v1.get_itos())

# get_stoi() → Dict[str, int]
print(v1.get_stoi())

# insert_token(token: str, index: int) → None
v1.insert_token("d", 1)
print(v1.get_stoi())

# lookup_indices(tokens: List[str]) → List[int]
print(v1.lookup_indices(["a", "a", "b", "c", "d"]))

# lookup_token(index: int) → str
print(v1.lookup_token(0))

# lookup_tokens(indices: List[int]) → List[str]
print(v1.lookup_tokens([2, 2, 0, 1, 3]))

# lookup_token(index: int) → str
print(v1.lookup_token(0))
```

示例结果：

```python
['b', 'c', 'a']
{'b': 0, 'c': 1, 'a': 2}
{'b': 0, 'd': 1, 'c': 2, 'a': 3}
[3, 3, 0, 2, 1]
b
['c', 'c', 'b', 'd', 'a']
b
```

# vocab(ordered_dict: Dict, min_freq: int = 1) → torchtext.vocab.Vocab

功能：

创建`Vocab`对象的工厂方法。

注意：在构建vocab对象时，将会参照传入的`dict`在构建时的键值对顺序。因此单词是否按照词频排序对用户来说很重要，推荐用`ordered_dict`来构建词典。

参数：

- ordered_dirt：字典。用于构建词典的字典，类型一般为`OrderedDict[str, int]`。
- min_freq：整型，默认为`1`。表示词典接受的最小词频，词频表示为`ordered_dirt`的值。

返回值：对应的`Vocab`对象

示例：

```python
from torchtext.vocab import Vocab, vocab
from collections import Counter, OrderedDict

counter = Counter(["a", "b", "b", "b", "c", "c"])
sorted_by_freq_tuples = sorted(counter.items(), key=lambda x:x[1], reverse=True)
sorted_by_freq_tuples

ordered_dict = OrderedDict(sorted_by_freq_tuples)
ordered_dict

v1 = vocab(ordered_dict,  min_freq=2)
print(v1.get_stoi())

tokens = ["e", "d","d","d", "c", "b", "a"]
v2 = vocab(OrderedDict([(token, 1) for token in tokens]))
unk_token = "<unk>"
default_index = -1
if unk_token not in v2: v2.insert_token(unk_token, 0)
print(v2.get_stoi())
```

示例结果：

```python
{'b': 0, 'c': 1}
{'<unk>': 0, 'e': 1, 'd': 2, 'c': 3, 'b': 4, 'a': 5}
```

# build_vocab_from_iterator(iterator: Iterable, min_freq: int = 1, specials: Optional[List[str]] = None, special_first: bool = True) → torchtext.vocab.Vocab

功能：用迭代器来生成`Vocab`对象。

参数：

- iterator：迭代器。用于创建词典的`yield`或`词语迭代器`。
- min_freq：整型，默认`1`。最小词频，创建时会忽略小于最小词频的词语。
- specials：字符串列表，默认`None`。一些需要加入词典的特殊符号，加入顺序与列表中顺序一致。
- special_first：布尔，默认`True`。表示是否将`specials`中的符号插在词典最前面。

返回值：对应的`Vocab`对象

示例：

```python
from torchtext.vocab import build_vocab_from_iterator

tokens = ["e", "d","d","d", "c", "b", "b", "a"]
vocab = build_vocab_from_iterator(tokens, min_freq=2, specials=["<unk>", "<eos>"],  special_first=False)
print(vocab.get_itos())
```

示例结果：

```python
['d', 'b', '<unk>', '<eos>']
```

# class Vectors

功能：存储词的嵌入向量。

函数：

- `__init__(name, cache=None, url=None, unk_init=None, max_vectors=None)`
    
    功能：构造函数。
    
    参数：
    
    - name：字符串。词嵌入向量文件的路径。
    - cache：字符串，默认`None`。缓存向量目录。
    - url：字符串，默认`None`。下载词嵌入向量的链接。
    - unk_init：函数。用于初始化未登录词。默认情况下，会以全零向量初始化未登录词。可以传入一个**参数为一个Tensor、返回值为相同阶数Tensor的函数**来处理未登录词。
    - max_vectors：整型。用于限制预训练词向量的个数。由于大多数预训练词向量都按词频降序排列，因此如内存不足等情况下可以限制一下词典大小。
- `get_vecs_by_tokens(tokens, lower_case_backup=False)`
    
    功能：将单词变为词嵌入向量。
    
    参数：
    
    - tokens：字符串列表。需要转换为词向量的词列表。
    - lower_case_backup：布尔，默认`False`。是否将单词变为小写再获取词向量。如果为`False`，所有词都会用输入的大小写来查询词向量。如果为`True`，会先按照原有的大小写查找词向量，若找不到，则会转为小写再查找词向量。
    
    返回值：词嵌入向量`Tensor`列表。
    

示例：

```python
from torchtext.vocab import build_vocab_from_iterator,GloVe,Vectors

vec = Vectors(".vector_cache/glove.6B.50d.txt")
print("hi:", vec["hi"])

examples = ["ChIP", "chip"]
ret = vec.get_vecs_by_tokens(examples, lower_case_backup=True)

print("\n".join(["{}:{}".format(examples[i], ret[i]) for i in range(len(examples))]))
```

示例结果：

```python
hi: tensor([-0.5431,  0.3443,  0.2713,  1.0487, -1.1642, -1.2722,  0.3578, -0.5653,
        -0.2988,  0.8518,  0.5222, -0.0020, -0.4643,  0.0336,  0.0484,  0.7876,
         0.0760,  0.5158,  0.3478,  0.5380,  0.2830, -0.1313, -0.0738,  0.4261,
         0.0310, -0.5503, -0.9979, -0.2895,  0.3052, -1.1194,  1.2957,  0.9117,
         0.3222,  0.9341, -0.3415, -0.6271, -0.0922,  0.5090,  0.2920, -0.2012,
         0.1961, -0.4588,  1.1099, -0.6874,  1.5724, -0.1045,  0.2359, -0.5659,
         0.4368,  0.9809])
ChIP:tensor([-0.7710, -1.1697,  1.5195,  0.8371,  0.7419, -0.2185, -0.7212, -0.9400,
        -0.0113,  0.5485,  0.4040, -0.1846, -0.4630,  0.2620, -0.6464,  0.3599,
        -0.8610, -0.3869, -0.0271, -1.0254,  0.3280, -0.7500, -0.6859, -0.6912,
         0.3429, -0.6660, -0.2910, -0.6104,  0.3322, -0.4252,  2.4573, -0.8748,
         0.4891,  1.2888,  0.5780, -0.5509, -0.2263,  0.8127,  0.7048, -0.5498,
         0.3620, -0.2171, -0.2991,  0.2917,  1.2260,  0.2446,  1.2133, -0.0967,
         0.0474,  0.1971])
chip:tensor([-0.7710, -1.1697,  1.5195,  0.8371,  0.7419, -0.2185, -0.7212, -0.9400,
        -0.0113,  0.5485,  0.4040, -0.1846, -0.4630,  0.2620, -0.6464,  0.3599,
        -0.8610, -0.3869, -0.0271, -1.0254,  0.3280, -0.7500, -0.6859, -0.6912,
         0.3429, -0.6660, -0.2910, -0.6104,  0.3322, -0.4252,  2.4573, -0.8748,
         0.4891,  1.2888,  0.5780, -0.5509, -0.2263,  0.8127,  0.7048, -0.5498,
         0.3620, -0.2171, -0.2991,  0.2917,  1.2260,  0.2446,  1.2133, -0.0967,
         0.0474,  0.1971])
```

注意：

- 数据下载地址：[http://nlp.stanford.edu/data/glove.6B.zip](http://nlp.stanford.edu/data/glove.6B.zip)
- 设置了`lower_case_backup=True`后可以看见“ChIP”和“chip”的词嵌入向量是一样的。

# 预训练词向量

## GloVe

`torchtext.vocab.GloVe(name='840B', dim=300, **kwargs)`

## FastText

`torchtext.vocab.FastText(language='en', **kwargs)`

## CharNGram

`torchtext.vocab.CharNGram(**kwargs)`

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/120803135)
