---
title: '论文日报 2026-06-10：图谱保留知识还是复制原文'
published: 2026-06-10
updated: 2026-10-29
description: '图谱保留知识还是复制原文，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-06-10 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方明确标记的历史版本，不混用后续修订。数值均为作者报告，本站未独立复现。

## 重点阅读

[Beyond Predefined Schemas: TRACE-KG for Context-Enriched Knowledge Graphs from Complex Documents](https://arxiv.org/abs/2604.03496v1) · v1 提交 2026-04-03 · [全文](https://arxiv.org/html/2604.03496v1) · [PDF](https://arxiv.org/pdf/2604.03496v1)

检索出的子图能够支持事实，不一定表示形成了可组合结构：把大段原文塞进节点，同样可能获得高分。TRACE-KG 将上下文、实体消歧、关系限定信息和数据驱动模式放入同一建图流程，并在评估中考虑连通性与文本泄漏。

MINE-1 实验中，系统使用相同嵌入、检索超参数及严格 LLM 判定配置，只根据检索子图判断事实是否被支持，不补外部知识。表 1 中 TRACE-KG 原始检索准确率 90.2%，低于 AutoSchemaKG 的 95.1%；泄漏指标为 1.3% 对 36.5%，最大弱连通分量占比为 88.5% 对 61.5%。

作者定义 EGU 为检索准确率、连通率与非泄漏比例的组合，表中报告值分别为 78.5% 与 37.3%。这里保留作者表值，不把组合指标视为唯一金标准；泄漏指标也不等于所有事实都已正确压缩。模型裁判、指标定义和选定文档都会影响排序。我的判断是，企业建图应同时检查回答能力、跨节点组合和原文复制程度。本文固定 4 月 3 日 v1，不将 6 月 15 日以后的修订倒灌到本日报。

![2604.03496v1 Figure 2 原始截图](./images/trace-kg-figure2.png)

原图：Mohammad Sadeq Abolhasani、Yang Ba、Yixuan He、Rong Pan，arXiv:2604.03496v1，Figure 2，PDF 第 8 页。[原始来源](https://arxiv.org/pdf/2604.03496v1#page=8) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。已裁剪完整表格或图形及必要标签，移除周围正文，内容和颜色未改动，未重绘。此材料沿用 CC BY 4.0，本站页脚许可不为其增加非商业或相同方式共享限制。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [FlashMemory-DeepSeek-V4: Lightning Index Ultra-Long Context via Lookahead Sparse Attention](https://arxiv.org/abs/2606.09079v2) · 2606.09079v2，该版本提交 2026-06-09。
- [Self-Harness: Harnesses That Improve Themselves](https://arxiv.org/abs/2606.09498v1) · 2606.09498v1，该版本提交 2026-06-08。
- [TRACE: A Unified Rollout Budget Allocation Framework for Efficient Agentic Reinforcement Learning](https://arxiv.org/abs/2606.11119v1) · 2606.11119v1，该版本提交 2026-06-09。
- [Next Forcing: Causal World Modeling with Multi-Chunk Prediction](https://arxiv.org/abs/2606.11187v1) · 2606.11187v1，该版本提交 2026-06-09。

**覆盖说明：** 本期保留 5 篇已核验公开论文入口，详读 1 篇；其余仅列目录。
