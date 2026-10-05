---
title: "Code Synonyms Do Matter: Multiple Synonyms Matching Network for Automatic ICD Coding"
published: 2024-01-11
description: ''
image: ''
tags: ["论文笔记"]
category: "论文或资源整理"
draft: false
lang: 'zh-CN'
---

![](/images/csdn/873d3158fe10b1f7081b67dd.png)

Tags: Diagnosis Prediction

Authors: Chuanqi Tan, Songfang Huang, Zheng Yuan

Created Date: January 10, 2024 2:48 PM

Status: Reading

organization: Alibaba Group, Tsinghua University

publisher : ACL

year: 2022

code: https://github.com/ganjinzero/icd-msmn

paper: https://aclanthology.org/2022.acl-short.91.pdf

# 介绍

过去的工作通常使用标签注意力来匹配相关的文本片段。本文认为编码的同义词能提供更加丰富的信息，因为电子病历中的表达方式通常与ICD编码的描述不一致。因此作者将ICD编码与UMLS中的概念进行了对齐，并收集了一些同义词。

文中样例：编码244.9的icd描述为“Unspecified hypothyroidism “，但在电子病历中通常与”low t4“和“subthyroidism”相关。

# 方法

## 代码同义词

作者首先将ICD编码与UMLS中的医学概念进行对齐，然后从UMLS中选择相应的英文词汇的同义词，这些同义词具有相同的概念唯一标识符（CUIs），并通过去除连字符和“NOS”（Not Otherwise Specified）一词添加附加的同义词。

这里有个超参M，表示每个ICD编码有M个描述（包括原始描述）

## 编码

文中表示使用诸如BERT等预训练模型对提升最终性能没啥帮助，因此使用多层双向LSTM。

![](/images/csdn/4a21dab8e30ff36ad63a8507.png)

其中N为单词个数。

对于每个编码的同义词，作者使用相同编码器加上一个最大池化层来获取表示：

![](/images/csdn/166f0730569cc03fe3abe205.png)

## 多同义词注意力（Multi-synonyms Attention）

为了增加文本与同义词的交互，作者提出了一种多同义词注意力。

首先设置超参M，即有M个同义词，将表示H分成M份：

![](/images/csdn/4483e461b8f8528bc3de26f1.png)

其中：

![](/images/csdn/c76254275162a4e1e7687335.png)

然后，将qj与Hj对应起来，求注意力得分αlj（l表示某个标签，j表示第j个同义词，α的维度为Nx1）。

再使用最大池化球的当前标签的特征（code-wise text representations）vl：

![](/images/csdn/d8378f6564ff2114cb64413a.png)

## 分类器

用同义词特征的最大池化作为编码表示，然后计算最终得分

![](/images/csdn/eb926df6af8653479ed386de.png)

# 实验结果

![](/images/csdn/12424589fd59c4cb3e6926ef.png)

![](/images/csdn/ff771667f639fff22d75541a.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/135529218)
