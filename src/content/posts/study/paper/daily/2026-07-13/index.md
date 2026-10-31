---
title: '论文日报 2026-07-13：网页 RAG 的证据，不应在切块时失去结构'
published: 2026-07-13
updated: 2026-10-29
description: '网页 RAG 的证据，不应在切块时失去结构。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 三类结构进入同一检索图

PolyUQuest 将网页超链接、页内 DOM 层级与跨页实体关系统一为异构图。两级路由选择直接块检索、跨页遍历或多跳实体推理，使答案可以回到原网页、标题路径与相关实体。

## 实验条件与结果

PolyU 官方站点构成 4,240 页、31,086 个 DOM 块、29,119 个实体与 37,680 条关系。Table 1 的 PolyU-Web 评测为 300 个问题：PolyUQuest 的 correctness、coverage、faithfulness 分别为 0.644、0.649、0.921。这些是论文定义的答案评价指标，不是查询正确性的形式证明。

每次查询平均 2,968 tokens，LightRAG 为 29,825；但 ChunkRAG 为 2,947，因此不能概括为比所有方法都省 token。PolyUQuest 离线构建另需 17.5M tokens。关闭 DOM 块后 correctness 为 0.563，关闭跨页模式为 0.624，支持两个结构接口的作用，但仍是单站点评测。

## 我的判断

结构化引用能帮助定位错误，却不保证引用支持答案。迁移时要另测网站变化、解析失败和检索覆盖；论文中的准备部署状态也不能改写为已验证的大规模上线。

## 原图入口

[Table 1，原论文 PDF 第 4 页](https://arxiv.org/pdf/2607.08269v1#page=4)。该版本未确认开放截图转载权限，本篇仅保留原图链接。

## 论文来源

- [PolyUQuest: Verifiable Structure-Aware Web RAG over Heterogeneous Graphs](https://arxiv.org/abs/2607.08269v1) · v1，公开于 2026-07-09。

## 同日阅读目录

- [PolyUQuest: Verifiable Structure-Aware Web RAG over Heterogeneous Graphs](https://arxiv.org/abs/2607.08269v1) · v1，2026-07-09。
- [Infinity-Parser2 Technical Report](https://arxiv.org/abs/2607.07836v1) · v1，2026-07-08。
- [Playing ZendoWorld: Challenging AI Agents on Active Visual Concept Induction](https://arxiv.org/abs/2607.08233v1) · v1，2026-07-09。
- [Beware What You Autocomplete: Forensic Attribution of Backdoored Code Completions](https://arxiv.org/abs/2607.08011v1) · v1，2026-07-09。
- [APIVOT: Adaptive Planning with Interleaved Vision-Language Thoughts](https://arxiv.org/abs/2607.08024v1) · v1，2026-07-09。
- [TTHE: Test-Time Harness Evolution](https://arxiv.org/abs/2607.08124v1) · v1，2026-07-09。
- [When Implausible Tokens Get Reinforced: Tail-Aware Credit Calibration for LLM Reinforcement Learning](https://arxiv.org/abs/2607.07976v1) · v1，2026-07-08。
- [Harness VLA: Steering Frozen VLAs into Reliable Manipulation Primitives via Memory-Guided Agents](https://arxiv.org/abs/2607.08448v1) · v1，2026-07-09。

文中实验结果为论文作者报告，未独立复现。
