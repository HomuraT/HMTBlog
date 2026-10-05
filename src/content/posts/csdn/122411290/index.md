---
title: "Transformers预训练模型使用：语言建模 Language Modeling"
published: 2022-01-10
description: ''
image: ''
tags: ["自然语言处理", "PyTorch", "人工智能", "深度学习"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

语言建模是一个将模型拟合到一个语料库的任务，这个语料库可以是特定领域，也可以是通用领域。所有主流的、基于transformer的模型（**跟这个包transformers不是一个东西**）都使用了语言建模的变体任务进行训练。如BERT，使用掩码语言建模（masked language modeling），GPT-2是用的是因果语言建模（causal language modeling）。

除了用于预训练，预原建模在迁移模型领域时也很有用。比如将一个在超大语料库中训练完成的预训练模型微调到一个新数据集上。

## 掩码语言建模 **Masked Language Modeling**

掩码语言建模的任务是：提供一个包含特殊标记[MASK]（即掩码）的序列，然后让模型去预测掩码位置本来的词语。如提供“我[MASK]你”，预测[MASK]位置的词语，如“爱”、“喜欢”或“恨”等。这个任务会允许模型同时关注[MASK]左右的上下文信息（有些任务只允许观察一侧上下文信息）。

这种训练会为下游任务创建一个结实的基础，比如需要识别双向双下文的问答任务（如SQuAD数据集）。

### 使用pipline

当然，你可以使用pipline很快的应用这类模型。

示例代码：

```python
from transformers import pipeline
from pprint import pprint

nlp = pipeline("fill-mask")
pprint(nlp(f"HuggingFace is creating a {nlp.tokenizer.mask_token} that the community uses to solve NLP tasks."))
```

输出结果：

```python
[{'score': 0.1792745739221573,
  'sequence': '<s>HuggingFace is creating a tool that the community uses to '
              'solve NLP tasks.</s>',
  'token': 3944,
  'token_str': 'tool'},
 {'score': 0.11349421739578247,
  'sequence': '<s>HuggingFace is creating a framework that the community uses '
              'to solve NLP tasks.</s>',
  'token': 7208,
  'token_str': 'framework'},
 {'score': 0.05243554711341858,
  'sequence': '<s>HuggingFace is creating a library that the community uses to '
              'solve NLP tasks.</s>',
  'token': 5560,
  'token_str': 'library'},
 {'score': 0.03493533283472061,
  'sequence': '<s>HuggingFace is creating a database that the community uses '
              'to solve NLP tasks.</s>',
  'token': 8503,
  'token_str': 'database'},
 {'score': 0.02860250137746334,
  'sequence': '<s>HuggingFace is creating a prototype that the community uses '
              'to solve NLP tasks.</s>',
  'token': 17715,
  'token_str': 'prototype'}]
```

### 使用模型和文本标记器

你也可以使用模型和文本标记器来实现上述功能，步骤如下：

1. 实例化一个DistilBERT模型和对应文本标记器。
2. 创建一个序列，并用`tokenizer.mask_token`替换掉你想要预测的单词。
3. 编码序列并找到`[MASK]`的位置。
4. 将序列输入模型，并获得预测结果。返回结果是一个维度为$[1, 句子分词数,词典大小]$的Tensor，表示词典中每一个词在每一个位置出现的得分。模型会给予合适的词更高的分数。
5. 使用`Pytorch`中的`topk`方法获得分数最高的若干个词的索引。
6. 用得到的索引表示的词替换`[MASK]`标记即可得到结果。

示例代码：

```python
from transformers import AutoModelWithLMHead, AutoTokenizer
import torch
import random

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-cased", cache_dir="./transformersModels/MLM")
model = AutoModelWithLMHead.from_pretrained("distilbert-base-cased", cache_dir="./transformersModels/MLM", return_dict=True)

sequence = f"Using them instead of the large versions would help {tokenizer.mask_token} our carbon footprint."

# 将sequence转化为词典索引
input = tokenizer.encode(sequence, return_tensors="pt")

# 获取[MASK]坐标
mask_token_index = torch.argmax(input == tokenizer.convert_tokens_to_ids(tokenizer.mask_token))

token_logits = model(input).logits
mask_token_logits = token_logits[0, mask_token_index, :]

top_5_tokens = torch.topk(mask_token_logits, 5, dim=0).indices

for token in top_5_tokens:
    print(sequence.replace(tokenizer.mask_token, tokenizer.decode([token])))
```

输出结果：

```python
Using them instead of the large versions would help reduce our carbon footprint.
Using them instead of the large versions would help increase our carbon footprint.
Using them instead of the large versions would help decrease our carbon footprint.
Using them instead of the large versions would help improve our carbon footprint.
Using them instead of the large versions would help offset our carbon footprint.
```

当然也可以用来预测多个`[MASK]`，示例代码如下：

```python
from transformers import AutoModelWithLMHead, AutoTokenizer
import torch
import random

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-cased", cache_dir="./transformersModels/MLM")
model = AutoModelWithLMHead.from_pretrained("distilbert-base-cased", cache_dir="./transformersModels/MLM", return_dict=True)

# {tokenizer.mask_token}
# Last year, I went to the countryside to get my internship, my duty was to be a teacher, teaching the middle school students English. 

sequence = f"Last year, I went to the countryside to get my {tokenizer.mask_token}, my duty was to be a teacher, teaching the middle {tokenizer.mask_token} students English. "

# 将sequence转化为词典索引
input = tokenizer.encode(sequence, return_tensors="pt")

# 获取[MASK]坐标
mask_token_index = (input == tokenizer.convert_tokens_to_ids(tokenizer.mask_token))

token_logits = model(input).logits
mask_token_logits = token_logits[0, mask_token_index[0], :]

top_5_tokens = []
for mask_token_logit in mask_token_logits:
    top_5_tokens.append(torch.topk(mask_token_logit, 5, dim=0).indices)

"""
由于预测结果可以相互组合，因此有多种结果
这里只输出 n 种结果
每次从 top_5_token 种随机抽取一个词
"""
n = 2
for i in range(n):
    seq = sequence
    for top_5_token in top_5_tokens:
        random_token = random.choice(top_5_token)
        seq = seq.replace(tokenizer.mask_token, tokenizer.decode([random_token]), 1)
    print(seq)
```

输出结果：

```python
Last year, I went to the countryside to get my education, my duty was to be a teacher, teaching the middle age students English. 
Last year, I went to the countryside to get my education, my duty was to be a teacher, teaching the middle class students English.
```

## 因果语言建模 **Causal Language Modeling**

因果语言建模是一个预测给定文本之后词语的任务。在这个任务中，模型只会注意左边的上下文信息。这种特性非常适合类似于文本生成的任务。

通常情况下，下一个词语是通过将之前的文本输入模型获得的最后一个隐状态（hidden state）来预测。

例子如下：

```python
from transformers import AutoModelWithLMHead, AutoTokenizer, top_k_top_p_filtering
import torch
from torch.nn import functional as F

tokenizer = AutoTokenizer.from_pretrained("gpt2", cache_dir="./transformersModels/CLM")
model = AutoModelWithLMHead.from_pretrained("gpt2", cache_dir="./transformersModels/CLM", return_dict=True)

sequence = f"I am Student"

input_ids = tokenizer.encode(sequence, return_tensors="pt")

# get logits of last hidden state
next_token_logits = model(input_ids).logits[:, -1, :]

# filter
filtered_next_token_logits = top_k_top_p_filtering(next_token_logits, top_k=50, top_p=1.0)

# sample
probs = F.softmax(filtered_next_token_logits, dim=-1)

"""
torch.multinomial把输入的值看作是索引的权重，然后进行随机取样
"""
next_token = torch.multinomial(probs, num_samples=1)

generated = torch.cat([input_ids, next_token], dim=-1)

resulting_string = tokenizer.decode(generated.tolist()[0])

print(resulting_string)
```

输出结果：

```python
I am Student of
```

- 注意：
    
    `top_k_top_p_filtering`方法基于论文**[The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751)。**
    
    你也可以删除这一行代码，直接将 `next_token_logits` 送入`softmax`。
    

## 文本生成 **Text Generation**

文本生成任务（又名开方式文本生成）的目标是根据给定的文本生成一段上下文相关的文本。下面的例子会展示如何使用GPT-2来生成文本。

### 使用pipeline

在默认情况下，所有使用pipeline创建的模型都应用了Top-K采样。

代码如下：

```python
from transformers import pipeline

text_generator = pipeline("text-generation")
print(text_generator("As far as I am concerned, I will", max_length=50, do_sample=False))
```

输出结果如图：

```python
[{'generated_text': 'As far as I am concerned, I will be the first to admit that I am not a fan of the idea of a "free market." I think that the idea of a free market is a bit of a stretch. I think that the idea'}]
```

模型生成了一段总计50个token的文本（标点和单词都算），这个文本与开头“*As far as I am concerned, I will”有关。*

### 使用模型和文本标记器

下面的文本生成使用了`XLNet`模型和其对应的文本标记器。

示例代码：

```python
cache_dir="./transformersModels/text-generation"
"""
,cache_dir = cache_dir
"""
from transformers import AutoModelWithLMHead, AutoTokenizer

model = AutoModelWithLMHead.from_pretrained("xlnet-base-cased",cache_dir = cache_dir, return_dict=True)
tokenizer = AutoTokenizer.from_pretrained("xlnet-base-cased",cache_dir = cache_dir)

# Padding text helps XLNet with short prompts - proposed by Aman Rusia in https://github.com/rusiaaman/XLNet-gen#methodology
# 补充描述可以帮助模型生成更好的文本
PADDING_TEXT = """In 1991, the remains of Russian Tsar Nicholas II and his family
(except for Alexei and Maria) are discovered.
The voice of Nicholas's young son, Tsarevich Alexei Nikolaevich, narrates the
remainder of the story. 1883 Western Siberia,
a young Grigori Rasputin is asked by his father and a group of men to perform magic.
Rasputin has a vision and denounces one of the men as a horse thief. Although his
father initially slaps him for making such an accusation, Rasputin watches as the
man is chased outside and beaten. Twenty years later, Rasputin sees a vision of
the Virgin Mary, prompting him to become a priest. Rasputin quickly becomes famous,
with people, even a bishop, begging for his blessing. <eod> </s> <eos>"""

# 生成文本的提示词
prompt = "Today the weather is really nice and I am planning on "

inputs = tokenizer.encode(PADDING_TEXT + prompt, add_special_tokens=False, return_tensors="pt")

prompt_length = len(tokenizer.decode(inputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True))
# 其中的 max_length 是 补充描述+提示词+生成文本 的最大长度
# 输出也包括了 补充描述+提示词+生成文本 的tokens
outputs = model.generate(inputs, max_length=250, do_sample=True, top_p=0.95, top_k=60)

print("完整输出：", tokenizer.decode(outputs[0]))

# 仅获取提示词和生成的文本
generated = prompt + tokenizer.decode(outputs[0])[prompt_length:]
print("提示词+生成文本：",generated)
```

输出结果：

```python
完整输出： In 1991, the remains of Russian Tsar Nicholas II and his family (except for Alexei and Maria) are discovered. The voice of Nicholas's young son, Tsarevich Alexei Nikolaevich, narrates the remainder of the story. 1883 Western Siberia, a young Grigori Rasputin is asked by his father and a group of men to perform magic. Rasputin has a vision and denounces one of the men as a horse thief. Although his father initially slaps him for making such an accusation, Rasputin watches as the man is chased outside and beaten. Twenty years later, Rasputin sees a vision of the Virgin Mary, prompting him to become a priest. Rasputin quickly becomes famous, with people, even a bishop, begging for his blessing.<eod></s> <eos>Today the weather is really nice and I am planning on baking for the whole week. I know that the day of the next will be a "great day." That day is Friday 1 July (10 days ago), so I will go back to the week. I think I’ll get some sleep in on Sunday at 6:30 am. If I can get some sleep that night, I’ll
提示词+生成文本： Today the weather is really nice and I am planning on anning on baking for the whole week. I know that the day of the next will be a "great day." That day is Friday 1 July (10 days ago), so I will go back to the week. I think I’ll get some sleep in on Sunday at 6:30 am. If I can get some sleep that night, I’ll
```

现在文本生成能使用的模型有GPT2, OpenAi-GPT, CTRL, XLNet, Transfo-XL 和 Reformer，在pytorch和tensorflow中都有实现。从上面例子可以知道，XLNet和Transfo通常需要补充描述才能正常工作，可以把`PADDING_TEXT` 删了再看看效果。GPT2在开方式结尾的文本生成任务中是一个较好的选择，因为它是在百万个网页数据上训练的因果语言模型。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/122411290)
