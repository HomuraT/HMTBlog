---
title: '论文日报 2026-08-31：文本能重建通路层级，不等于完成生物推理'
published: 2026-08-31
updated: 2026-10-29
description: '文本能重建通路层级，不等于完成生物推理，核对历史原文、实验条件与证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-08-31 的精选阅读**，于 2026-10-29 核对公开原文。归档日不是发表日；本文固定使用下列 v1，不混入后续修订。数字为作者报告，本站未独立复现。

## 专家描述是否携带层级信息

这项 Reactome 研究从 Homo sapiens 的通路和反应描述出发，用 SPECTER2 表示文本，再通过修改的凝聚聚类与图重构，建立 Semantic Hierarchy，与专家整理的 Reactome Hierarchy 比较。

## 测量的是全局拓扑相似

数据基于 Reactome V95（2025 年 12 月）。作者报告 SH 与 RH 的 Laplacian Spectral Distance 为 0.085，全部重连的 SH 对照为 0.224；bootstrap 检验 p<0.005。平均度约为 2.00 对 2.09，密度都约 0.00011。

这些衡量全局谱和拓扑结构，不是逐边生物关系正确率，更不是临床预测准确率。文本来自已被专家组织的同一知识库，因此重建实验与从独立新文献发现未知机制是不同任务。

## 我的判断

值得追问的是哪些关系能由描述恢复、哪些只能依赖实验与专家知识。应增加局部边验证和外部数据对照，防止全局相似掩盖重要子通路错误。本文不把结构接近视作生物因果证明。

## 原图入口

[Figure 1，原论文 PDF 第 5 页](https://arxiv.org/pdf/2608.28178v1#page=5)。该版本未确认开放截图转载权限，本篇仅保留原图链接。

## 深读原文与范围

- [Expert Knowledge & Machine Understanding: Bridging Reactome's Ontology with LLM Semantic Embeddings](https://arxiv.org/abs/2608.28178v1) · v1，公开于 2026-08-28。

本篇深读上述 1 篇；以下是同日公开阅读入口，仅核对标题、版本日期和来源，未逐篇核验实验。

## 同日阅读目录

- [Expert Knowledge & Machine Understanding: Bridging Reactome's Ontology with LLM Semantic Embeddings](https://arxiv.org/abs/2608.28178v1) · v1，2026-08-28。
- [Self-OPD: On-Policy Distillation for Flow Matching Models without Teacher](https://arxiv.org/abs/2608.26872v1) · v1，2026-08-27。
- [SwarmWorld: Stigmergic technological evolution in societies of language-model agents](https://arxiv.org/abs/2608.26081v1) · v1，2026-08-26。
- [Locate Anything in Videos: Rethinking Efficient Generative Spatio-Temporal Video Grounding](https://arxiv.org/abs/2608.28192v1) · v1，2026-08-28。
- [Beyond Flat Netlist: Hierarchical Graph Representation Learning for Scalable Analysis of Sequential Circuits](https://arxiv.org/abs/2608.28188v1) · v1，2026-08-28。
