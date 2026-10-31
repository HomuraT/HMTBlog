---
title: '论文日报 2026-10-20：本体匹配不是上下文越多越好'
published: 2026-10-20
updated: 2026-10-29
description: '本体匹配不是上下文越多越好，核对原文结果、条件与证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

复杂本体匹配要识别逻辑表达式之间的对应，而非只计算标签相似度。VERSO 只用 schema，通过 PageRank 模块化与本体文本化缩小输入范围。

## 版本时间边界

本文讨论 OM 2026 workshop PDF。研讨会于 2026-10-25 举行，论文首次公开时间尚未确认；10 月 20 日是本篇阅读归档日期。

## 方法与实验

Qwen3-14B 推理、Qwen3-Embedding-8B 候选生成，在 OAEI Complex 的 Conference、GeoLink、Hydrography、Taxon 上比较 PageRank/PPR、邻域深度与三种文本化方式。Conference 加 PPR 后召回率 0.362→0.438，精确率 0.334→0.238。仅聚合 Conference、GeoLink、Taxon 时，依赖实例的 CANARD F1 为 0.329，VERSO 最佳配置为 0.293。更少输入前提不代表所有指标更强。

## 我的判断

过长上下文与 Lost in the Middle 是作者解释精度下降的假说，缺少直接因果验证。应按任务选择小而保留 IRI 的上下文，测量额外上下文究竟干扰了哪些对应。

## 原论文视觉证据

![VERSO Figures 5–8 原始截图](./images/verso-figures5-8.png)

图源：Igor Nascimento, Rinaldo Lima, Cassia Trojahn，《Combining PageRank Modularization and Ontology Verbalization for LLM-Based Complex Ontology Matching》，OM 2026 workshop PDF，Figures 5–8，PDF 第 11 页。[原图出处](https://om.ontologymatching.org/2026/papers/om2026-LTpaper6.pdf#page=11) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 论文来源

- [Combining PageRank Modularization and Ontology Verbalization for LLM-Based Complex Ontology Matching](https://om.ontologymatching.org/2026/papers/om2026-LTpaper6.pdf) · OM 2026 workshop PDF。
- 版本公开日期：未独立确认；仅确认 OM 2026 研讨会于 2026-10-25 举行。
