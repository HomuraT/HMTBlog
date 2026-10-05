---
title: "Graph of Thoughts: Solving Elaborate Problems with Large Language Models"
published: 2024-01-18
description: ''
image: ''
tags: ["自然语言处理", "人工智能", "论文笔记"]
category: "论文或资源整理"
draft: false
lang: 'zh-CN'
---

![](/images/csdn/d1fb89fea2ce934fa709700b.png)

Tags: LLM

Authors: Ales Kubicek, Hubert Niewiadomski, Joanna Gajda, Lukas Gianinazzi, Maciej Besta, Michał Podstawski, Nils Blach, Piotr Nyczyk, Robert Gerstenberger, Tomasz Lehmann, Torsten Hoefler

Created Date: January 11, 2024 9:00 PM

Finished Date: 2024/01/18

Status: Finished

organization: Cledar, ETH Zurich, Warsaw University of Technology

publisher : arXiv

year: 2023

code: https://github.com/spcl/graph-of-thoughts

paper: <https://arxiv.org/abs/2308.09687>

# 介绍

本文提出了思维图Graph of Thoughts (GoT)，是一个用于提升大语言模型提示能力的框架。与之前工作思维链（CoT）、思维树（ToT）类似，但思维图有将大语言模型产生的信息建模为图结构的能力。

文中的主要贡献如下：

1. 提出了一种新的方法来增强大语言模型通过网络进行推理的能力。
2. 设计了用于实现GoT的模块化框架。
3. 展示了几个GoT的使用案例（排序、摘要关键词计数、集合操作、文档合并），并详细说明如何使用基于图的范式来实现它们。
4. 评估GoT并展示其相对于现有技术的优势。
5. 我们提出了一种评估提示策略的新度量标准，即思维体积。

# 组件

## Prompter

将提示送入大语言模型。这个模块主要负责执行具体操作。

## Parser

从大语言模型思想中抽取信息。应该就是把所需的信息从大语言模型的输出中提取出来。

## Scoring & Validation

评估大语言模型的输出，并打分。可以由大语言模型来做，也可以由人来做。

## Controller

根据GRS结构实施特定的策略来选择输出。

# 框架图

![](/images/csdn/dd2f25d04e3480e58b900d6d.png)

# 样例

![](/images/csdn/b541bb41c52585654f11636d.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/135676669)
