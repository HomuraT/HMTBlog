---
title: '论文日报 2026-06-24：事件本体扩展需要概念中间层'
published: 2026-06-24
updated: 2026-10-29
description: '事件本体扩展需要概念中间层，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Event Ontology Expansion via LLM-Based Conceptualization](https://arxiv.org/abs/2606.21048v1) · v1 提交 2026-06-19 · [全文](https://arxiv.org/html/2606.21048v1) · [PDF](https://arxiv.org/pdf/2606.21048v1)

ConceptE 先让语言模型根据句子与触发词产生事件概念名和解释，再联合编码概念与原触发词，进行聚类、定向父子挂接和新类型命名。它尝试区分句子表面相似与事件概念相同，避免公司语境相近就把 launch 与 merge 混为一类。

ACE、ERE 以最常见 10 类为已知类，MAVEN 使用 20 已知、40 未知类。编码器为 BERT-base-uncased，概念化和命名用 Qwen3-32B。事件聚类 BCubed-F1：ACE 为 83.25%，HALTON 为 75.06%；MAVEN 为 51.72% 对 39.35%，差 12.37 个百分点。ACE 金标准聚类下的 Taxo-F1 为 51.16%，HALTON 为 44.68%；换成系统预测聚类，ConceptE 为 43.48%。上游错误会传到本体位置。

我认为概念中间层给维护者提供了可审查对象，但描述由模型生成，偏见或幻觉也会被后续聚类、挂接和命名继承。论文为单次运行，缺少多种子波动；开放领域还需要人工检查概念边界和父子关系。下方 Wikontic 是另列的 EACL 2026 正式阅读入口，不是当天新发表；OpenReview 候选链接未独立核验。

**原图入口：**[Figure 2，PDF 第 3 页](https://arxiv.org/pdf/2606.21048v1#page=3)。

## 同期其他论文入口

- [Extracting Semantics: LLM-Guided Automatic Population of Robot Ontology from URDF](https://arxiv.org/abs/2606.17073v1) · 2606.17073v1，该版本提交 2026-06-10。
- [Tmax: A simple recipe for terminal agents](https://arxiv.org/abs/2606.23321v1) · 2606.23321v1，该版本提交 2026-06-22。
- [CLI-Universe: Towards Verifiable Task Synthesis Engine for Terminal Agents](https://arxiv.org/abs/2606.22883v1) · 2606.22883v1，该版本提交 2026-06-22。
- [Unlimited OCR Works](https://arxiv.org/abs/2606.23050v1) · 2606.23050v1，该版本提交 2026-06-22。
- [VIMPO: Value-Implicit Policy Optimization for LLMs](https://arxiv.org/abs/2606.20008v1) · 2606.20008v1，该版本提交 2026-06-18。
- [Tapered Language Models](https://arxiv.org/abs/2606.23670v1) · 2606.23670v1，该版本提交 2026-06-22。
- [MAS-PromptBench: When Does Prompt Optimization Improve Multi-Agent LLM Systems?](https://arxiv.org/abs/2606.23664v1) · 2606.23664v1，该版本提交 2026-06-22。

另列正式阅读入口：[Wikontic: Constructing Wikidata-Aligned, Ontology-Aware Knowledge Graphs with Large Language Models](https://aclanthology.org/2026.eacl-long.388/)，EACL 2026，2026 年 3 月，8304–8319 页。

待核验线索：[ParallelKernelBench: Can LLMs Write Fast Multi-GPU Kernels?（候选题名）](https://openreview.net/pdf/b1f965d99dc4c0341f70248f27b0e3dc29ce4f51.pdf)。题名与链接对应关系尚未确认。
