---
title: '论文日报 2026-10-12：事件类型归纳，不能只靠动词长得像'
published: 2026-10-12
updated: 2026-10-29
description: '事件类型归纳，不能只靠动词长得像。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

同一动词可以描述不同事件，不同动词也可能表达同类事件。CLUE 同时保留谓词中心视角与句子语义，再通过对比学习聚类、命名和标注事件类型。

## 方法与问题

流程提取谓词—宾语对，组合两种事件表示，用对比损失区分邻居，最后让语言模型为簇命名。聚类结构与命名阶段使用的标签信息应分开考察。

## 实验证据

Table 2 的 MAVEN 句子级 micro-F1 中，CLUE-GPT-J 为 0.180，CEO 为 0.150；CLUE-ICL-gold 为 0.320。但后者使用 GPT-4 Turbo 与金标签命名示例，不能当作严格零标签条件下的公平增益。论文也在 ACE 与 RAMS 报告 F1、ARI，并单独评估命名质量；这些指标不是同一种能力。

## 我的判断

双视角表示对新领域事件本体有启发，但合理的簇不等于稳定的下游分析。应先核对命名阶段标注量，再检查领域迁移、低频事件与簇粒度，避免将标签提示的作用误归为无监督聚类收益。

## 论文图表

![2610.12580v1 Table 2 原始截图](./images/clue-table2.png)

图源：Pratik Maitra , Lauren Kwon , Qi Li，《CLUE: A Contrastive Learning Framework for Unsupervised Event Type Induction and Annotation》，2610.12580v1，Table 2，PDF 第 7 页。[原图出处](https://arxiv.org/pdf/2610.12580v1#page=7) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。仅裁剪原页面，保留完整图表、图注和必要标签，未重绘或修改数据，不表示作者认可本解读。该图沿用 CC BY 4.0，本站页脚许可不为其增加非商业或相同方式共享限制。

## 论文来源

- [CLUE: A Contrastive Learning Framework for Unsupervised Event Type Induction and Annotation](https://arxiv.org/abs/2610.12580v1) · 2610.12580v1，该版本公开于 2026-10-08。

文中实验结果为论文作者报告，未独立复现。
