---
title: '论文日报 2026-10-21：本体对齐集成，不是把所有答案投票就结束'
published: 2026-10-21
updated: 2026-10-29
description: '本体对齐集成，不是把所有答案投票就结束，核对原文结果、条件与证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

字符串、图嵌入和 LLM 的错误各有特点。OntoAligner-Ensemble 将输出接入可配置融合与选择流程，研究互补是否实际改善精召平衡。

## 版本时间边界

本文讨论 OM 2026 workshop PDF。研讨会于 2026-10-25 举行，论文首次公开时间尚未确认；10 月 21 日是本篇阅读归档日期。

## 方法与实验

系统支持加权投票、倒数排名融合、Condorcet、Borda，再筛选融合候选。五个 OAEI 赛道八个任务中，Table 2 的 Fish–Zooplankton：LLM 集成 F1 为 96.5，GPT-5.4-Nano 单系统为 93.3；Mouse–Human 的 Matcha 基线 94.1，却高于 LLM 集成 91.6。CEON–MatOnto 也由原基线保持最高 F1。表内 P/R/F1 为百分制，不能称集成总是最好。

## 我的判断

应按错误重叠选成员，而非只增加模型数量。部分基线直接取官方 OAEI 报告，并非同环境重跑；讨论成本与效果时要保留来源差异。软件 Apache 2.0 不等于论文截图许可，配图使用论文明确的 CC BY 4.0。

## 原论文视觉证据

![Ensemble Table 2 原始截图](./images/ensemble-table2.png)

图源：Hamed Babaei Giglou, Sören Auer, Peio Popov, Mahsa Sanaei, Jennifer D’Souza，《OntoAligner-Ensemble: Voting-Based Fusion across Heterogeneous Ontology Alignment Techniques》，OM 2026 workshop PDF，Table 2，PDF 第 8 页。[原图出处](https://om.ontologymatching.org/2026/papers/om2026-LTpaper8.pdf#page=8) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 论文来源

- [OntoAligner-Ensemble: Voting-Based Fusion across Heterogeneous Ontology Alignment Techniques](https://om.ontologymatching.org/2026/papers/om2026-LTpaper8.pdf) · OM 2026 workshop PDF。
- 版本公开日期：未独立确认；仅确认 OM 2026 研讨会于 2026-10-25 举行。
