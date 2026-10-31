---
title: '论文日报 2026-06-23：神经概率逻辑的单世界反事实'
published: 2026-06-23
updated: 2026-10-29
description: '神经概率逻辑的单世界反事实，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[DeepSWIP: Quotient-WMC Counterfactuals for Neural Probabilistic Logic Programs](https://arxiv.org/abs/2606.20526v2) · v2 提交 2026-06-19 · [全文](https://arxiv.org/html/2606.20526v2) · [PDF](https://arxiv.org/pdf/2606.20526v2)

反事实不等于条件概率。DeepSWIP 对固定输入先将神经谓词概率实体化为 ProbLog 选择，再通过单世界干预规则改写，以加权模型计数的分子分母之比求答案，避免复制完整事实世界与反事实世界。精确性相对于学得且实体化的因果模型成立，依赖有限 grounding 与唯一受支持模型等条件。

MPI3D-toy 使用 8,368 张训练图、2,000 张测试图。500 张评估图、六种形状干预、四类查询组成 12,000 次调用，DeepSWIP 与 DeepTwin 100% 一致；平均每次 3.57 对 7.65 毫秒，即 2.14 倍。这是一致性实现检查，不是模型因果正确性的外部证明。形状准确率为 0.889，非干预谓词仍传入误差，can_stack、risky_on_shelf 的 RMSE 分别为 0.058、0.082。

图 1 展示另一个 SUMO 实验：二元政策随机分配、已知处理概率 0.5，AIPW 可减轻总体均值与平均处理效应偏差。它不是任意个体反事实的通用校正。我的判断是，符号推断精确与神经概率校准必须分开；现实应用仍要检查因果结构、稀有证据分母稳定性和复杂规则成本。本文固定 v2，不混入后续修订。

![2606.20526v2 Figure 1 原始截图](./images/deepswip-figure1.png)

原图：Saimun Habib、Vaishak Belle、Fengxiang He，arXiv:2606.20526v2，Figure 1，PDF 第 10 页。[原始来源](https://arxiv.org/pdf/2606.20526v2#page=10) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 同期其他论文入口

- [How Transparent is DiffusionGemma?](https://arxiv.org/abs/2606.20560v1) · 2606.20560v1，该版本提交 2026-06-18。
- [LedgerAgent: Structured State for Policy-Adherent Tool-Calling Agents](https://arxiv.org/abs/2606.20529v1) · 2606.20529v1，该版本提交 2026-06-18。
- [Sovereign Execution Broker: Enforcing Certificate-Bound Authority in Agentic Control Planes](https://arxiv.org/abs/2606.20520v2) · 2606.20520v2，该版本提交 2026-06-19。
- [Current World Models Lack a Persistent State Core](https://arxiv.org/abs/2606.20545v1) · 2606.20545v1，该版本提交 2026-06-18。
- [TimeProVe: Propose, then Verify for Efficient Long Video Temporal Reasoning in Activities of Daily Living](https://arxiv.org/abs/2606.20561v1) · 2606.20561v1，该版本提交 2026-06-18。
- [Thinking in Boxes: 3D Editing in Real Images Made Easy](https://arxiv.org/abs/2606.20556v1) · 2606.20556v1，该版本提交 2026-06-18。
