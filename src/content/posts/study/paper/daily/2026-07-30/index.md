---
title: '论文日报 2026-07-30：法律图谱的语法与关系签名'
published: 2026-07-30
updated: 2026-10-29
description: '法律图谱的语法与关系签名，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[LLM-Assisted Ontology Engineering and Construction of a French Legal Knowledge Graph](https://arxiv.org/abs/2607.24551v1) · v1 提交 2026-07-27 · [全文](https://arxiv.org/html/2607.24551v1) · [PDF](https://arxiv.org/pdf/2607.24551v1)

这项法国维护法规案例先在分层样本开放抽取概念和关系，合并近义标签并诱导属性 domain/range，再用本体约束全语料抽取。结构化输出只解决格式，未必解决已知谓词该连接哪些类。

GPT-4.1 与 mistral-large-2512 采用相同提示协议、温度 0；类引导实体抽取与关系发现分别使用 4k、10k token 上下文。表 3 所列设置 JSON 有效率均为 100%，类覆盖接近 100%；Mistral 的精确关系签名符合率从未合并的 49.86% 到合并后 72.61%，OpenAI 设置为 56.94% 到 61.03%。引入未见属性的三元组均少于 20%，不少不符合来自已知谓词的新类组合。

我的判断是，实体和谓词规范化应与签名审核一起做。新组合可能是错误，也可能暴露本体缺项，不能全部丢弃或全部接纳。原文发现类型错误会传播、过度合并可能掩盖法律语义差异；这只是信息工程案例，不构成具体法规含义或合规行为建议。

**原图入口：**[Table 3，PDF 第 4 页](https://arxiv.org/pdf/2607.24551v1#page=4)。

## 同期其他论文入口

- [Wonder: Video World Model Done Better](https://arxiv.org/abs/2607.26037v1) · 2607.26037v1，该版本提交 2026-07-28。
- [RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement](https://arxiv.org/abs/2607.25886v1) · 2607.25886v1，该版本提交 2026-07-28。
- [MODUS: Decoder-Only Any-to-Any Modeling of Diverse Modalities](https://arxiv.org/abs/2607.25948v1) · 2607.25948v1，该版本提交 2026-07-28。
- [HiFi-UMI: Learning Deployable Manipulation Policies from High-Fidelity UMI Data Alone](https://arxiv.org/abs/2607.25895v1) · 2607.25895v1，该版本提交 2026-07-28。
- [Mage-VL: An Efficient Codec-Native Streaming Multimodal Foundation Model](https://arxiv.org/abs/2607.24904v1) · 2607.24904v1，该版本提交 2026-07-27。
