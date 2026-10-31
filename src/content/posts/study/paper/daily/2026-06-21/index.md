---
title: '论文日报 2026-06-21：长时对话先存对原子事实'
published: 2026-06-21
updated: 2026-10-29
description: '长时对话先存对原子事实，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-06-21 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方明确标记的历史版本，不混用后续修订。数值均为作者报告，本站未独立复现。

## 重点阅读

[AtomMem: Building Simple and Effective Memory System for LLM Agents via Atomic Facts](https://arxiv.org/abs/2606.19847v1) · v1 提交 2026-06-18 · [全文](https://arxiv.org/html/2606.19847v1) · [PDF](https://arxiv.org/pdf/2606.19847v1)

AtomMem 先将对话拆成附带参与者、时间和语义的自足原子事实，再组织为事件和随时间演变的用户画像，经实体、事件与时间连边进行关联回忆。目标是保留可追溯事实，而非反复覆盖一段粗摘要。

LoCoMo 平均约 35 会话、600 多轮。实验统一 GPT-4o-mini 回答骨干、all-minilm-L6-v2 向量和 top-10 检索，事实抽取器则另以 Qwen3-14B 做 LoRA 微调。表 1 多跳 F1 为 42.50，MEM0 为 36.02；时间 F1 为 62.78，LightMem 为 47.41。开放域模型评审分数为 64.58，MEM0 为 54.17；裁判为 deepseek-v4-pro，不能当作人工准确率。

平铺事实消融的多跳 F1 已从原始对话基线 20.97 到 37.03。其总 API token 约 72.3 万，完整系统约 2,135.7 万，复杂层级版本并非最省成本。我的判断是，先检查抽取、时间有效性与纠错，再决定是否增加图式检索。抽取、事件合并和画像更新都可能放大底层错误；当前证据限于文本基准，不能直接说明真实用户记忆可靠。

![2606.19847v1 Figure 1 原始截图](./images/atommem-figure1.png)

原图：Yanyu Yao、Shangze Li、Zhi Zheng、Hui Zheng、Qi Liu、Tong Xu、Enhong Chen，arXiv:2606.19847v1，Figure 1，PDF 第 2 页。[原始来源](https://arxiv.org/pdf/2606.19847v1#page=2) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [S-Agent: Spatial Tool-Use Elicits Reasoning for Spatial Intelligence](https://arxiv.org/abs/2606.20515v1) · 2606.20515v1，该版本提交 2026-06-18。
- [MemoryWAM: Efficient World Action Modeling with Persistent Memory](https://arxiv.org/abs/2606.20562v1) · 2606.20562v1，该版本提交 2026-06-18。
- [HumanScale: Egocentric Human Video Can Outperform Real-Robot Data for Embodied Pretraining](https://arxiv.org/abs/2606.20521v1) · 2606.20521v1，该版本提交 2026-06-18。
- [How Transparent is DiffusionGemma?](https://arxiv.org/abs/2606.20560v1) · 2606.20560v1，该版本提交 2026-06-18。
- [Rethinking Shrinkage Bias in LLM FP4 Pretraining: Geometric Origin, Systemic Impact, and UFP4 Recipe](https://arxiv.org/abs/2606.20381v1) · 2606.20381v1，该版本提交 2026-06-18。
- [Connect the Dots: Training LLMs for Long-Lifecycle Agents with Cross-Domain Generalization Via Reinforcement Learning](https://arxiv.org/abs/2606.20002v1) · 2606.20002v1，该版本提交 2026-06-18。

**覆盖说明：** 本期保留 7 篇已核验公开论文入口，详读 1 篇；其余仅列目录。
