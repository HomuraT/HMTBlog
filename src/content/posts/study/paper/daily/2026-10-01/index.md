---
title: '论文日报 2026-10-01：本体学习先把提示词变成可优化对象'
published: 2026-10-01
updated: 2026-10-29
description: '本体学习先把提示词变成可优化对象，核对指定历史论文与实验条件。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-10-01 的精选阅读**，于 2026-10-29 核对公开原文。推荐日不等于发表日，使用下方指定历史版本。实验为作者报告，本站未独立复现。

把文本转成本体，难点不只是抽名词，还要让关系和公理在逻辑上成立。APOLO 不先改权重，而是把本体学习拆成模块，让优化器依据结构化反馈修改提示词。

## 方法与问题

作者由专家维护的本体生成文本—本体配对，比较逐块抽取的 Greedy 学习器与利用已有结构的自回归学习器，再通过 DSPy 的 GEPA 优化提示。评分不仅检查实体出现，还用推理器检查公理正确性与覆盖。

## 实验证据

Table 1 的单次 DOID 实验中，Qwen3.5-27B 自回归学习器的 AxP 从 0.569 到 0.838，AxR 则从 0.690 到 0.689，基本不变。这更接近减少错误公理，不能称所有维度显著提升。论文也测植物本体 PO 与 Devstral-Small-2-24B，不同模型和指标的方向并不一致。

## 我的判断

可调试接口比一个总分更值得复用：缺实体、无依据公理、语法和一致性可分别反馈给优化器。但原评分不惩罚所有冗余公理，基础本体也可能已被预训练见过。应在未参与生成训练数据的新领域上做多随机种子验证。AxP 不是整体本体质量或下游准确率，本篇只用 9 月 28 日 v1。

## 原论文视觉证据

![2609.34540v1 Table 1 原始截图](./images/apolo-table1.png)

图源：Huu Tan Mai , Roman Kochnev , Cuong Xuan Chu , Lukas Lange , Heiko Paulheim , Daria Stepanova，《APOLO: Automatic Prompt Optimization for Ontology Learning》，arXiv:2609.34540v1，Table 1，PDF 第 5 页。[原图出处](https://arxiv.org/pdf/2609.34540v1#page=5) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 原文与核验范围

- [APOLO: Automatic Prompt Optimization for Ontology Learning](https://arxiv.org/abs/2609.34540v1) · 2609.34540v1，该版本提交 2026-09-28。

本篇深读 1 篇，仅核对上述论文及正文引用条件；未将其他候选的二手摘要算作已核验结论，也不宣称完整覆盖当天所有论文。
