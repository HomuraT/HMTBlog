---
title: '论文日报 2026-06-14：先分清大模型与图谁在帮助谁'
published: 2026-06-14
updated: 2026-10-29
description: '先分清大模型与图谁在帮助谁，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[LLMs+Graphs: Toward Graph-Native, Synergistic AI Systems](https://arxiv.org/abs/2606.11560v1) · v1 提交 2026-06-10 · [全文](https://arxiv.org/html/2606.11560v1) · [PDF](https://arxiv.org/pdf/2606.11560v1)

“LLM 加图”包含不同目标。LLMs+Graphs 是教程提案，将语言模型帮助建图、查询，与图为语言模型提供证据、约束区分开；代理还可用图表达计划、记忆与工具依赖。

全文按 LLMs for Graphs、Graphs for LLMs、知识图谱双向融合，以及图和代理的双向作用组织。证据形式是文献讨论、主题分类与教程安排，没有提出新模型并报告新对照分数。因此这里不补造 SOTA、模型规模或训练预算。下方是第 3 节的原始提纲截图，属于主题目录，并非编号实验图。

我认为最有用的问题是：希望图改善哪一步？事实依据不足，就检查检索与证据定位；查询不可执行，就检查模式、语言和验证；长任务失序，就检查状态与依赖。不同问题需要不同指标，图任务高分不直接证明代理可靠。教程适合作为阅读地图，仍需回到具体方法的原论文与消融，不能当作所有图增强方案已得到统一验证。

![2606.11560v1 Section 3 Outline（无编号图） 原始截图](./images/llms-graphs-outline.png)

原文提纲：Arijit Khan、Longxu Sun、Xin Huang，arXiv:2606.11560v1，Section 3 Outline（无编号图），PDF 第 2 页。[原始来源](https://arxiv.org/pdf/2606.11560v1#page=2) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 同期其他论文入口

- [Breaking Entropy Bounds: Accelerating RL Training via MTP with Rejection Sampling](https://arxiv.org/abs/2606.12370v1) · 2606.12370v1，该版本提交 2026-06-10。
- [Can I Buy Your KV Cache?](https://arxiv.org/abs/2606.13361v1) · 2606.13361v1，该版本提交 2026-06-11。
- [EvoArena: Tracking Memory Evolution for Robust LLM Agents in Dynamic Environments](https://arxiv.org/abs/2606.13681v1) · 2606.13681v1，该版本提交 2026-06-11。
- [Improving Robotic Generalist Policies via Flow Reversal Steering](https://arxiv.org/abs/2606.13675v2) · 2606.13675v2，该版本提交 2026-06-12。
- [RepWAM: World Action Modeling with Representation Visual-Action Tokenizers](https://arxiv.org/abs/2606.13674v2) · 2606.13674v2，该版本提交 2026-06-13。
- [Anatomy of Post-Training: Using Interpretability to Characterize Data and Shape the Learning Signal](https://arxiv.org/abs/2606.12360v2) · 2606.12360v2，该版本提交 2026-06-11。
