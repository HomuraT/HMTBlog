---
title: "Transformers数据预处理：Preprocessing data"
published: 2022-03-02
description: ''
image: ''
tags: ["自然语言处理", "PyTorch", "人工智能"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 数据预处理 Preprocessing data

在transformers中，数据处理的主要工具是文本标记器`tokenizer`。我们可以使用模型对应的文本标记器类型，也可以直接使用`AutoTokenizer`自动分类。

文本标记器首先会把文本分割成单词、标点符号等，这些被分割的元素叫作`token`。然后将`token`转化为数字，使之能被转化为训练用的张量`tensor`。除此之外，一些特定的文本标记器还会加上一些模型需要的特殊标记，如BERT中的`CLS`、`SEP`。

> 注意：
如果你要使用预训练模型，你就需要使用该模型对应的文本标记器。因为对应文本标记器转化文本的方式与其模型训练时的方式一致，对应的词汇表也一致。如果文本标记器不对，会对模型预测或微调造成巨大的影响。比如，原来“我”这个词的索引是1，另一个文本标记器中“我”的索引是100，这就导致了模型接收到的数据跟你想的完全不一样。
> 

若要自动下载模型训练或微调时使用的文本标记器，可以使用`from_pretrained()`方法：

```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('bert-base-cased')
```

# 基本用法

## 预处理

transformers中的文本标记器有很多方法，但进行预处理的方法只有一个，即`__call__`：你只需要将文本直接送入文本标记器对象。如下：

```python
encoded_input = tokenizer("Hello, I'm a single sentence!")
print(encoded_input)

输出：
{'input_ids': [101, 8667, 117, 146, 112, 182, 170, 1423, 5650, 106, 102], 
'token_type_ids': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
```

此方法会返回一个字典。`input_ids`是输入文本中每个`token`的索引。之后会讲到`attention_mask`和`token_type_ids`的用途。

## 解码

除了编码文本，文本标记器也可以对索引进行解码：

```python
print(tokenizer.decode(encoded_input["input_ids"]))

输出：
[CLS] Hello, I'm a single sentence! [SEP]
```

我们可以看到，文本标记器在预处理时已经自动加上了BERT所需的特殊标记。

并不是所有模型都需要特殊标记，如过我们使用`gtp2-medium`而不是`bert-base-cased`，我们在解码时可以得到与原文本一样的结果。

在解码时，我们也可以在方法中加入参数`add_special_tokens=False`来去掉特殊的标记（有些版本是`skip_special_tokens=True`）。

## 多数据

如果你想一次处理多个文本，你可以将它们整合到数组中，一次性出入文本标记器，如下：

```python
batch_sentences = ["Hello I'm a single sentence",
                   "And another sentence",
                   "And the very very last one"]
encoded_inputs = tokenizer(batch_sentences)
print(encoded_inputs)

输出：
{'input_ids': [[101, 8667, 146, 112, 182, 170, 1423, 5650, 102],
               [101, 1262, 1330, 5650, 102],
               [101, 1262, 1103, 1304, 1304, 1314, 1141, 102]],
 'token_type_ids': [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]],
 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1]]}
```

## 填充、截断、返回特定类型

当一次性处理多条语句时，我们可能还会有如下要求：

- 将每个句子填充到批处理的最大长度
- 将每个句子截断到模型可以接收的最大长度
- 返回`tensor`类型数据

你可以使用如下操作实现所有要求：

```python
batch = tokenizer(batch_sentences, max_length=7, padding=True, truncation=True, return_tensors="pt", )
print(batch)

结果：
{'input_ids': tensor([
				[ 101, 8667,  146,  112,  182,  170,  102],
        [ 101, 1262, 1330, 5650,  102,    0,    0],
        [ 101, 1262, 1103, 1304, 1304, 1314,  102]]), 
'token_type_ids': tensor([
				[0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]]), 
'attention_mask': tensor([
				[1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1]])}
```

这次返回了一个字符串到`pytorch.tensor`类型的字典。我们现在可以根据返回结果看出`attention_mask`的用途了：它会告诉模型哪些`token`需要被注意，哪些不要管，因为一些是填充来的无意义`token`。

需要注意的是，如果使用的模型并没有与之相关的最大长度，则上面的代码在执行时会发出警告。这是没有问题的，可以直接无视，也可以加入参数`verbose=False`来阻止文本标记器抛出这些异常。 

# 处理句子对

有时可能需要将一对句子送入模型。比如，我们需要判断两个句子是否相似；或我们在使用问答模型，需要将文本和问题送入模型。对于`BERT`模型，句子对需要转化为如下形式：`[CLS] Sequence A [SEP] Sequence B [SEP]`

在使用Transformers处理句子对时，我们需要将两个句子以不同的变量传入文本标记器中（注意，并不是像之前那样整合成列表，而是两个分开的变量）。然后我们会得到一个对应的字典，如下例：

```python
encoded_input = tokenizer("How old are you?", "I'm 6 years old")
print(encoded_input)
print(tokenizer.decode(encoded_input["input_ids"]))
for i in encoded_input["input_ids"]:
    print(tokenizer.decode(i))

结果：
{'input_ids': [101, 1731, 1385, 1132, 1128, 136, 102, 146, 112, 182, 127, 1201, 1385, 102], 'token_type_ids': [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], 'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
[CLS] How old are you? [SEP] I'm 6 years old [SEP]
[ C L S ]
H o w
o l d
a r e
y o u
?
[ S E P ]
I
'
m
6
y e a r s
o l d
[ S E P ]
```

从结果我们可以看出`token_type_ids`的作用：它们告诉模型输入的那个部分属于第一个句子，那个部分属于第二个句子。需要注意的是，并不是所有模型都需要`token_tyoe_ids`。默认情况下，文本标记器只会返回与模型相关的期望输入。你可以传入一些如`return_token_type_ids`或`return_length`的参数来改变文本标记器的输出。

```python
encoded_input = tokenizer("How old are you?", "I'm 6 years old",
                        return_token_type_ids=False, 
                        return_length=True,
                        )
print(encoded_input)

输出：
{'input_ids': [101, 1731, 1385, 1132, 1128, 136, 102, 146, 112, 182, 127, 1201, 1385, 102], 'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 'length': 14}
```

同样，如果你向一次性处理多条语句，你可以分别传入两个文本列表。如下：

```python
batch_sentences = ["Hello I'm a single sentence",
                   "And another sentence",
                   "And the very very last one"]
batch_of_second_sentences = ["I'm a sentence that goes with the first sentence",
                             "And I should be encoded with the second sentence",
                             "And I go with the very last one"]
encoded_inputs = tokenizer(batch_sentences, batch_of_second_sentences)
print(encoded_inputs)

结果：
{'input_ids': [[101, 8667, 146, 112, 182, 170, 1423, 5650, 102, 146, 112, 182, 170, 5650, 1115, 2947, 1114, 1103, 1148, 5650, 102],
               [101, 1262, 1330, 5650, 102, 1262, 146, 1431, 1129, 12544, 1114, 1103, 1248, 5650, 102],
               [101, 1262, 1103, 1304, 1304, 1314, 1141, 102, 1262, 146, 1301, 1114, 1103, 1304, 1314, 1141, 102]],
'token_type_ids': [[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]}
```

我们可以通过循环解码`input_ids`列表来检查我们的输入，如下：

```python
for ids in encoded_inputs["input_ids"]:
    print(tokenizer.decode(ids))

结果：
[CLS] Hello I'm a single sentence [SEP] I'm a sentence that goes with the first sentence [SEP]
[CLS] And another sentence [SEP] And I should be encoded with the second sentence [SEP]
[CLS] And the very very last one [SEP] And I go with the very last one [SEP]
```

并且你仍然可以在编码时输入一些参数来填充或截取文本，或将其转化为特定类型，如下：

```python
batch = tokenizer(batch_sentences, batch_of_second_sentences, padding=True, truncation=True, return_tensors="pt")
```

# 一些关于填充和截断的东西

在上面已经介绍了大部分情况下适用的指令。但Transformers也提供了更多的方法，这些方法围绕三个参数`padding`、`truncation`、`max_length`展开。

- `padding`用来控制填充。它可以是布尔类型也可以是字符串类型，如下：
    - `True`或`”longest”`来将所有句子填充至序列列表中的最大长度，如果你只提供一个句子则什么也不做。
    - `“max_length”`用来将序列填充到参数`max_length`的长度，若没有提供`max_length`参数（`max_length=None`），则填充到模型能接受的最大长度。并且在你只提供了一个句子的时候也会起作用。
    - `False`或`”do_not_pad”`来设置为不填充。且这是参数的默认值。
- `truncation`用来控制截断。可以是布尔型或者字符串。
    - `True`或`“only_first”`来讲句子截断到`max_length`参数长度，若未提供`max_length`参数（`max_length=None`），则将句子截取到模型可以接受的最大长度。如果提供的数据为句子对或一批句子对，那么只会对第一个句子进行截断。
    - `“only_sceond”`将句子截断到`max_length`参数长度，若未提供`max_length`参数（`max_length=None`），则截取到模型可以接受的最大长度。当输入数据为句子对时，只会截断第二条数据。
    - `False`或`”do_not_truncate”`表示不对句子进行截取。且这是参数的默认值。
- `max_length`用来控制填充或截断的长度。可以是`整数`或`None`，默认值是模型可以接受的最大程度。如果模型没有特定的最大输入长度，则会被截断或填充到`max_length`。

## 一些用法总结

如果在下面例子中，输入的是句子对，你可以将**`truncation=True`**替换为**`STRATEGY`**，选择如下：**`['only_first', 'only_second', 'longest_first']`**。

- 不截断
    - 不填充：`**tokenizer(batch_sentences)**`
    - 填充至当前批次的最大长度：`**tokenizer(batch_sentences, padding=True)**`或 `**tokenizer(batch_sentences, padding=’longest’)**`
    - 填充到模型可接受的最大长度：`**tokenizer(batch_sentences, padding='max_length')**`
    - 填充到一个特定长度：`**tokenizer(batch_sentences, padding='max_length', max_length=42)**`
- 截断到模型输入的最大长度
    - 不填充：**`tokenizer(batch_sentences, truncation=True)`** 或**`tokenizer(batch_sentences, padding=True, truncation=STRATEGY)`**
    - 填充到当前批次的最大长度：**`tokenizer(batch_sentences, padding=True, truncation=True)`**或**`tokenizer(batch_sentences, padding=True, truncation=STRATEGY)`**
    - 填充到模型可接受的最大长度：**`tokenizer(batch_sentences, padding='max_length', truncation=True)`**或**`tokenizer(batch_sentences, padding='max_length', truncation=STRATEGY)`**
    - 填充到特定长度：做不到，因为加了`max_length`参数就无法填充截断到最大输入了。
- 截断到特定长度
    - 不填充：**`tokenizer(batch_sentences, truncation=True, max_length=42)`**
     或 **`tokenizer(batch_sentences, truncation=STRATEGY, max_length=42)`**
    - 填充到当前批次最大长度：**`tokenizer(batch_sentences, padding=True, truncation=True, max_length=42)`**
     或 **`tokenizer(batch_sentences, padding=True, truncation=STRATEGY, max_length=42)`**
    - 填充到模型可接受的最大长度：做不到
    - 填充到特定长度：**`tokenizer(batch_sentences, padding='max_length', truncation=True, max_length=42)`**
     或 **`tokenizer(batch_sentences, padding='max_length', truncation=STRATEGY, max_length=42)`**

# 预标记输入

标记器也可以接受预标记输入。这在命名实体识别（Named Entity Recognition）和词性标注（Part-Of-Speech Tagging）任务中很重要。

**需要注意的是：预标记输入并不是以及索引化的输入，只是将单词进行分割，**

若想使用预标记输入，只需将参数设置为`is_split_into_words=True`即可。例子如下：

```python
encoded_input = tokenizer(["Hello", "I'm", "a", "single", "sentence"], is_split_into_words=True)
print(encoded_input)

结果：
{'input_ids': [101, 8667, 146, 112, 182, 170, 1423, 5650, 102], 
'token_type_ids': [0, 0, 0, 0, 0, 0, 0, 0, 0], 
'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1]}

```

注意：预标记输入也会添加模型相关的特殊标记，除非将属性参数为`add_special_tokens=False`。

## 输入多个句子

预标记输入多个句子与之前的形式完全一样，你可以想下面这样编码多个句子：

```python
batch_sentences = [["Hello", "I'm", "a", "single", "sentence"],
                   ["And", "another", "sentence"],
                   ["And", "the", "very", "very", "last", "one"]]
encoded_inputs = tokenizer(batch_sentences, is_split_into_words=True)
```

## 输入句子对

也可以像这样输入句子对：

```python
batch_of_second_sentences = [["I'm", "a", "sentence", "that", "goes", "with", "the", "first", "sentence"],
                             ["And", "I", "should", "be", "encoded", "with", "the", "second", "sentence"],
                             ["And", "I", "go", "with", "the", "very", "last", "one"]]
encoded_inputs = tokenizer(batch_sentences, batch_of_second_sentences, is_split_into_words=True)
```

## 填充和截断

也可以像之前一样填充和截断：
```python
batch = tokenizer(batch_sentences,
                  batch_of_second_sentences,
                  is_split_into_words=True,
                  padding=True,
                  truncation=True,
                  return_tensors="pt")
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/123239558)
