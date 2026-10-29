---
title: '论文日报 2026-06-28：同源图谱与文本检索评测材料'
published: 2026-06-28
updated: 2026-10-29
description: '同源图谱与文本检索评测材料，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-06-28 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[All Relations Lead to Rome: Automated Knowledge Graph Creation and Question Generation](https://arxiv.org/abs/2606.22645v1) · v1 提交 2026-06-21 · [全文](https://arxiv.org/html/2606.22645v1) · [PDF](https://arxiv.org/pdf/2606.22645v1)

图检索与向量检索常用不同资料，难以公平比较。All Relations Lead to Rome 将同一罗马史文档切块，使用轻量本体抽实体和关系，并为文本块、实体生成向量；问答则从可追溯事实和支撑文本生成，再改写为不同人物口吻。符号结构、文本证据和向量索引因此可以在同源材料上比较。

数据包含 19,374 个实体、16,069 个文本块、25,304 条关系和 8,400 组问答。尤其要区分：6,000 组落在知识库中，另 2,400 组涉及库中没有的实体或事实，用于检验无答案情形的错误召回。这些是数据规模，不是模型准确率。原文尚未提供多个 RAG 系统的同条件性能排名，后续比较是计划中的研究。

自动抽取仍可能漏实体、错连关系；同题可能存在多个合理支撑事实，严格单答案评分也会误判。我的判断是，这份历史领域材料适合检验图过滤、向量搜索与混合召回，但使用前应人工抽查实体—关系—支撑块链条，并选择允许多答案、面向召回的指标。要宣称混合检索更好，仍需补真实对照，不能以图谱规模代替效果证据。

**原图入口：**[Figure 1，PDF 第 1 页](https://arxiv.org/pdf/2606.22645v1#page=1)。原文标记 arXiv non-exclusive distribution license；未确认第三方截图再发布许可，本次未转载该图。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [ThermoLLM: Thermodynamics-Aware HVAC Control with Spatial-Semantic Knowledge Graph](https://arxiv.org/abs/2606.22911v1) · 2606.22911v1，该版本提交 2026-06-22。
- [Hallucination in World Models is Predictable and Preventable](https://arxiv.org/abs/2606.27326v1) · 2606.27326v1，该版本提交 2026-06-25。
- [LA4VLA: Learning to Act without Seeing via Language-Action Pretraining](https://arxiv.org/abs/2606.27295v2) · 2606.27295v2，该版本提交 2026-06-26。
- [ViQ: Text-Aligned Visual Quantized Representations at Any Resolution](https://arxiv.org/abs/2606.27313v1) · 2606.27313v1，该版本提交 2026-06-25。
- [Reinforcement Learning without Ground-Truth Solutions can Improve LLMs](https://arxiv.org/abs/2606.27369v1) · 2606.27369v1，该版本提交 2026-06-25。
- [PhysiFormer: Learning to Simulate Mechanics in World Space](https://arxiv.org/abs/2606.27364v1) · 2606.27364v1，该版本提交 2026-06-25。
- [World Action Models Enable Continual Imitation Learning with Recurrent Generative Replays](https://arxiv.org/abs/2606.27374v1) · 2606.27374v1，该版本提交 2026-06-25。

**覆盖说明：** 本期保留 8 篇已核验公开论文入口，详读 1 篇，其余仅列目录。
