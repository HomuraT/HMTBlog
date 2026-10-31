---
title: '论文日报 2026-07-25：规则与本体的非循环支持语义'
published: 2026-07-25
updated: 2026-10-29
description: '规则与本体的非循环支持语义，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[A New Well-Supported Semantics for Description Logic Programs](https://arxiv.org/abs/2607.21203v1) · v1 提交 2026-07-23 · [全文](https://arxiv.org/html/2607.21203v1) · [PDF](https://arxiv.org/pdf/2607.21203v1)

描述逻辑程序将规则与本体查询连接，但一个答案不能仅靠自己循环支撑。本文提出更严格的 bound 语义，用不动点算子和 reduct 转换刻画非循环支持；总体答案集合受到更严格限制，并识别新旧语义等价的一类受限程序。

复杂度分析假定本体词汇有限、蕴含关系可在多项式时间计算。在此条件下，新语义的一致性问题为 NP-complete，相比既有 well-supported 语义一般情形的 Σ₂ᴾ-complete 更低。改变了接受哪些答案，不能将复杂度类比较宣传为保留所有旧结果的生产推理器加速；NP-complete 也不代表大实例容易。

这是理论研究，没有新模型训练、GPU、吞吐或准确率实验。我的判断是，规则接到本体前，应先明确“支持”的含义以及希望保留、排除哪些结论，再谈快慢。原文无编号原图，本篇不生成替代示意图。

**视觉材料说明：** 指定版本未发现编号原图，本篇不补造图片；理论定义与证明见上方原文链接。

## 同期其他论文入口

- [SANA-Video 2.0: Hybrid Linear Attention with Attention Residuals for Efficient Video Generation](https://arxiv.org/abs/2607.21553v1) · 2607.21553v1，该版本提交 2026-07-23。
- [AREX: Towards a Recursively Self-Improving Agent for Deep Research](https://arxiv.org/abs/2607.21461v1) · 2607.21461v1，该版本提交 2026-07-23。
- [Visual Contrastive Self-Distillation](https://arxiv.org/abs/2607.21556v1) · 2607.21556v1，该版本提交 2026-07-23。
- [Skillware: A Software Ontology and Engineering Lifecycle for Persistent Behavioral Artifacts](https://arxiv.org/abs/2607.18970v1) · 2607.18970v1，该版本提交 2026-07-21。
- [Hilbert Operator for Progressive Encoding (HOPE): A Mathematical Framework for Deconstructing Learned Representations in Deep Networks](https://arxiv.org/abs/2607.21366v1) · 2607.21366v1，该版本提交 2026-07-23。
