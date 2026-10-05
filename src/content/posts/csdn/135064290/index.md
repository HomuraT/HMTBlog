---
title: "LARGE LANGUAGE MODELS ARE HUMAN-LEVEL PROMPT ENGINEERS"
published: 2023-12-18
description: ''
image: ''
tags: ["论文笔记"]
category: "论文或资源整理"
draft: false
lang: 'zh-CN'
---

![](/images/csdn/576e2af4673d08a2b1b121db.png)

Tags: LLM  
Authors: Andrei Ioan Muresanu, Harris Chan, Jimmy Ba, Keiran Paster, Silviu Pitis, Yongchao Zhou, Ziwen Han  
Created Date: October 31, 2023 10:53 AM  
Status: Reading  
organization: University of Toronto, University of Waterloo, Vector Institute  
publisher : ICLR  
year: 2023  
code: [automatic_prompt_engineer](https://github.com/keirp/automatic_prompt_engineer)

paper: https://sites.google.com/view/automatic-prompt-engineer

# 介绍

在大模型时代，提示的作用非常巨大，一个好的提示可以在任务中表现出极好的性能。但通常来说最有效的提示是由人手工制作的，需要耗费大量的人工开销。因此本文就尝试让大语言模型自动生提示本并优化提示。

# 整体框架

![](/images/csdn/df96b9df87a6de0a3415f4c9.png)

整体流程如下：

1. 利用大语言模型，根据数据集中的输入和输出，构造多个提示。
2. 对每个提示进行打分。
3. 筛选性能较好的提示，让大语言模型根据筛选结果生成相近的提示
4. 选择最优的提示。

## 不同生成模板

为了适应不同的需求，作者还设计了三种不同的模板

![](/images/csdn/efa7b5d1d102b4cc24a3cba8.png)

## 迭代生成

为了更好地搜索优质提示，作者根据当前得分较好的提示进行重新生成。

![](/images/csdn/9c326e42cf714de7a13a29b1.png)

# 实验结果

![](/images/csdn/b02c1f488bf24157e40d06b9.png)

Greedy表示只生成一个提示，不进行筛选。

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/135064290)
