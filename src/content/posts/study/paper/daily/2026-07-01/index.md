---
title: '论文日报 2026-07-01：数据库查询翻译回本体的反向问题'
published: 2026-07-01
updated: 2026-10-29
description: '数据库查询翻译回本体的反向问题。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Abstractions of Queries in Ontology-Based Data Access](https://arxiv.org/abs/2606.24618v1) · v1 提交 2026-06-23 · [全文](https://arxiv.org/html/2606.24618v1) · [PDF](https://arxiv.org/pdf/2606.24618v1)

OBDA 通常从本体查询生成数据库查询，反方向则问：一个已有源端服务能否在本体语言中表达相同含义？若两个源表都映射到同一本体概念，区分表来源的信息可能已经丢失；只选择其中一表的查询就未必能完美翻译。

论文采用存在规则与 certain-answer 语义，区分完备但可能多答、可靠但可能漏答，以及答案恰好一致的完美抽象。UCQ 增加受限不等式和常量标记 C 后，可以表达最小完备抽象，完美抽象若存在也可表达；C 标记来自数据源的常量，不是任意关闭开放世界假设。在相应 GLAV 映射设定中，候选完美 mapping-abstraction 的验证仍为 Π₂ᴾ-complete。论文没有训练、GPU、准确率或延迟实验，复杂度结论不代表生产系统更快。

我的判断是，mapping 评审除了查生成查询是否正确，还应查哪些重要源端服务不能被语义层准确描述。这是 KR 2025 论文的扩展报告，也在 6 月 25 日日报中出现；本篇作为专题回访，侧重已有服务的语义覆盖诊断，不把它包装成新会议成果或现成部署工具。

**原图入口**：[Table 1，PDF 第 2 页](https://arxiv.org/pdf/2606.24618v1#page=2)。

## 同期其他论文入口

- [Ontology-Guided Evidence Path Inference for Multi-hop Knowledge Graph Question Answering](https://arxiv.org/abs/2606.28076v1) · 2606.28076v1，该版本提交 2026-06-26。
- [Orca: The World is in Your Mind](https://arxiv.org/abs/2606.30534v1) · 2606.30534v1，该版本提交 2026-06-29。
- [Scaling the Horizon, Not the Parameters: Reaching Trillion-Parameter Performance with a 35B Agent](https://arxiv.org/abs/2606.30616v1) · 2606.30616v1，该版本提交 2026-06-29。
- [Diagnosing and Mitigating Context Rot in Long-horizon Search](https://arxiv.org/abs/2606.29718v1) · 2606.29718v1，该版本提交 2026-06-29。
- [OSWorld2.0: Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks](https://arxiv.org/abs/2606.29537v1) · 2606.29537v1，该版本提交 2026-06-28。
- [Understanding and Evaluating Claw-like Agent Security Through a Computer-Systems Lens](https://arxiv.org/abs/2606.30755v1) · 2606.30755v1，该版本提交 2026-06-29。
- [Demystifying the Design Space and Best Practices for Heterogeneous LLM Inference and Serving](https://arxiv.org/abs/2606.29708v1) · 2606.29708v1，该版本提交 2026-06-29。

文中实验结果为论文作者报告，未独立复现。
