---
title: "Low-resource Personal Attribute Prediction from Conversations"
published: 2023-12-08
description: ''
image: ''
tags: ["论文笔记"]
category: "论文或资源整理"
draft: false
lang: 'zh-CN'
---


# Low-resource Personal Attribute Prediction from Conversations

Tags: Personal Attribute Prediction
Authors: Hu Chen, Jiaoyan Chen, Wei Shen, Yinan Liu
Created Date: November 27, 2023 4:08 PM
Finished Date: 2023/11/28
Status: Finished
organization: Nankai University, The University of Manchester
publisher : WWW
year: 2023
code: https://github.com/CodingPerson/PEARL

本文研究的任务是个人属性预测，旨在通过用户的对话内容，从中推断出用户的一些隐含属性，如职业或爱好。过去的相关工作通常依赖于大量的标记数据，且其效果和适用领域受到数据集的限制，且无法充分利用无标记数据。文中为了解决上述问题，提出了PEARL，可以在资源受限的情况下，仅通过未标记的对话数据来预测个人属性。

PEARL首先在Biterm Semantic Acquisition模块包括三个阶段：

1）属性值表示阶段，通过计算话语中单词的上下文化表示来理解个人属性值的语义；

2）双词集生成阶段，则侧重于识别和选择与属性值高度相关的关键词；

3）双词表示阶段，为每个双词构建针对属性的表示，以捕捉双词的语义信息

然后在Attribute Knowledge Integration模块将双词语义信息与双词主题模型（BTM）融合。通过一个迭代的基于双词语义的Gibbs抽样过程，AKI模块建立了属性值与主题之间的关联，并优化了双词-属性值相似性分数的计算。

PEARL可以在不依赖于标记的语料或外部数据的情况下表现良好，使得它能够低资源情况的也能保持良好的效果，这在实际应用中很常见，因为标记数据往往难以获取。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/134871364)
