---
title: '论文日报 2026-09-13：结构化文档检索，先定位证据再复用经验'
published: 2026-09-13
updated: 2026-10-29
description: '结构化文档检索，先定位证据再复用经验。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 把多轮探索变成可复用路径

VikingRAG 将目录结构与语义检索结合，按证据缺口进行多轮访问；再将已完成检索轨迹物化为经验边，对相似查询复用。自适应升级只在单轮证据不足时调用多轮 Agent。

## 节省的比例需要明确分母

六个真实结构化文档数据集，最大语料约 8.78M tokens。作者报告基础 VikingRAG 在保持较高准确性的条件下使用所比较方法 11.6%–51.9% 的 tokens；加入经验复用与升级策略后为 5.1%–32.5%。这些比例跨数据、对照与配置，不是一个统一延迟倍数或所有任务的保证。

实验机器为两颗 Intel Xeon 6342 与两张 NVIDIA L20。文档入库、经验构建和维护仍有成本；减少查询交互不等于完整生命周期费用同比下降。相关质量指标仍需逐数据集阅读，不能将 competitive accuracy 改写成完全无损。

## 我的判断

经验边可以节省重复探索，但旧路径遇到文档更新可能失效。应记录证据版本、升级触发条件与回退，并测新问题而非只测相似历史问题的收益。

## 原图入口

[Figure 1，原论文 PDF 第 3 页](https://arxiv.org/pdf/2609.11390v1#page=3)。

## 论文来源

- [VikingRAG: Accurate and Token-efficient Retrieval-augmented Generation over Structured Documents](https://arxiv.org/abs/2609.11390v1) · v1，公开于 2026-09-10。

## 同日阅读目录

- [VikingRAG: Accurate and Token-efficient Retrieval-augmented Generation over Structured Documents](https://arxiv.org/abs/2609.11390v1) · v1，2026-09-10。
- [WiDiff: Extracting Changes from Wikidata's Edit History](https://arxiv.org/abs/2609.08508v1) · v1，2026-09-08。
- [Thinking with Looped Flows](https://arxiv.org/abs/2609.11801v1) · v1，2026-09-10。
- [Think Before You Link: Rarity, Reasoning, and Retrieval in Multilingual Entity Linking](https://arxiv.org/abs/2609.10745v1) · v1，2026-09-09。
- [Why Does Post-Training Quantization Work?](https://arxiv.org/abs/2609.11716v1) · v1，2026-09-10。
- [MindTopo: Can Foundation Models Reason in Topological Space?](https://arxiv.org/abs/2609.11900v1) · v1，2026-09-10。
- [NCP-ArchPreview Technical Report: Moving towards Latent Space Language Models through Next Concept Prediction](https://arxiv.org/abs/2609.10715v1) · v1，2026-09-09。

文中实验结果为论文作者报告，未独立复现。
