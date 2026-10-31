---
title: '论文日报 2026-06-03：知识图谱抽取之后的选择性纠错'
published: 2026-06-03
updated: 2026-10-29
description: '知识图谱抽取之后的选择性纠错。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Better Later Than Sooner: Neuro-Symbolic Knowledge Graph Construction via Ontology-grounded Post-extraction Correction](https://arxiv.org/abs/2605.29168v1) · v1 提交 2026-05-27 · [全文](https://arxiv.org/html/2605.29168v1) · [PDF](https://arxiv.org/pdf/2605.29168v1)

大型本体放进每次抽取提示会挤占上下文，每抽一条就检查又增加重复调用。OAK+MEND 改变顺序：先开放抽取，再把实体类型和谓词映射到本体，以符号约束找出违反定义域、值域等要求的事实，只让模型修复这些问题。

选择性纠错的价值在于将错误显式化。主客体颠倒、关系映射错误、类型过宽需要不同动作；修复时还提供源文本，并允许在缺少文本依据时不采取动作。实验采用 HotpotQA 与 MuSiQue 各 1,000 条子集及同一 Wikidata 本体片段，不是对所有领域图谱的保证。

表 1 的 HotpotQA、Qwen3-30B-A3B 条件下，OAK 的三元组本体有效率为 63.4%，加入 MEND 后为 96.8%；限定信息有效率由 33.6% 到 91.5%。加权成本从 16.3M 到 26.8M，仍低于 Wikontic 的 45.3M。该量使用输入与输出 1:4 的相对权重，并以输出 token 等价单位归一化（输入权重 1/4、输出权重 1），不是原始 token 总数或实际美元账单。

本体一致性只能说明满足这些结构约束，不能证明事实符合原文。我的判断是，先记录、再验证提供了实用流水线，但仍需独立验收事实忠实度和下游问答质量，不能把 96.8% 当作一般知识正确率。

**原图入口**：[Figure 1，PDF 第 1 页](https://arxiv.org/pdf/2605.29168v1#page=1)。

## 同期其他论文入口

- [Tacit Knowledge Extraction via Logic Augmented Generation and Active Inference](https://arxiv.org/abs/2605.07639v1) · 2605.07639v1，该版本提交 2026-05-08。
- [Qwen-VLA: Unifying Vision-Language-Action Modeling across Tasks, Environments, and Robot Embodiments](https://arxiv.org/abs/2605.30280v2) · 2605.30280v2，该版本提交 2026-06-01。
- [Representation Forcing for Bottleneck-Free Unified Multimodal Models](https://arxiv.org/abs/2605.31604v2) · 2605.31604v2，该版本提交 2026-06-03。
- [Why Larger Models Learn More: Effects of Capacity, Interference, and Rare-Task Retention](https://arxiv.org/abs/2605.29548v2) · 2605.29548v2，该版本提交 2026-06-01。
- [LongTraceRL: Learning Long-Context Reasoning from Search Agent Trajectories with Rubric Rewards](https://arxiv.org/abs/2605.31584v1) · 2605.31584v1，该版本提交 2026-05-29。
- [Mellum2 Technical Report](https://arxiv.org/abs/2605.31268v1) · 2605.31268v1，该版本提交 2026-05-29。

文中实验结果为论文作者报告，未独立复现。
