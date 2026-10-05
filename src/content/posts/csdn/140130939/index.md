---
title: "trainer使用 torch.utils.data 的 Dataset"
published: 2024-07-02
description: ''
image: ''
tags: ["人工智能", "深度学习", "机器学习", "自然语言处理"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# Dataset适配

在 [Transformers实战——使用Trainer类训练和评估自己的数据和模型](/posts/csdn/123990005/) 中，使用的数据集类别是`from datasets import Dataset`，但在常用的实现中，`pytorch`项目会使用`torch.utils.data` 中的数据集。

为了让`pytorch`中的`Dataset`类适配`transformers`中的`Trainer` ，需要对类别中的`def __getitem__(self, idx)` 方法进行修改，如下：

```python
    def __getitem__(self, idx):
		    # 具体实现，可以自由发挥
        text = self.texts[idx]
        label = self.labels[idx]
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            return_token_type_ids=False,
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )
        
        # 下面的返回要改成字典形式
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }
```

**简单来说就是把返回改成字典形式，且字典的键（key）需要与模型的`forward`对应。**

# DataCollator

上面的改动可以控制每**一个样本**的返回值，**但模型训练时的样本往往是一批一批**的。如果每个样本的输入形状（shape）固定不变的话，到上一步模型就能正常运行了。

但**有些时候每个样本的输入形状不一样**，如文本分类（每篇文章字数不同），就会导致训练不能正常进行。

这种情况一般有两种方法（以文本分类为例）：

1. 修改`__getitem__` ：添加一个最大长度 `max_length` 把每个文本扩展（0填充）或截取到固定长度（如512）。
2. 使用`transformes`中的`DataCollator` 类，如文本填充常用的`DataCollatorWithPadding` 。这种方式不用修改`Dataset`类的源码。

使用`DataCollator` 的样例如下：

```python
from transformers import DataCollatorWithPadding

# 这里的tokenizer变量可以传入BertTokenizer类
data_collator = DataCollatorWithPadding(tokenizer=tokenizer, return_tensors='pt')

    trainer = Trainer(
        model=model,  # the instantiated 🤗 Transformers model to be trained 需要训练的模型
        args=training_args,  # training arguments, defined above 训练参数
        train_dataset=train_dataset,  # training dataset 训练集
        eval_dataset=dev_dataset,  # evaluation dataset 测试集
        compute_metrics=compute_metrics,  # 计算指标方法
        ########
        data_collator=data_collator, # 传入DataCollator 
        ########
    )
```

这种方法可以动态地根据每一批次的最大文本长度进行补全，可以一定程度节省内存消耗。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/140130939)
