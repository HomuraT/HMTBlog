---
title: '论文日报 2026-05-11：长程推理训练与多目标蒸馏'
published: 2026-05-11
updated: 2026-10-29
description: '长程推理训练与多目标蒸馏，核对历史版本、实验设置与证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-05-11 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于提交或发表日期，以下固定引用 **v1**；实验数值为作者报告，本站未独立复现。

## ScaleLogic

v1 首次提交 2026-05-07 · [Can RL Teach Long-Horizon Reasoning to LLMs? Expressiveness Is Key](https://arxiv.org/abs/2605.06638v1) · [PDF](https://arxiv.org/pdf/2605.06638v1)

ScaleLogic 独立控制证明深度与逻辑表达能力。主实验对非思考 Qwen3-4B 做 RL，每个配置独立训练，以 1,000 条留出验证题达到 90% Pass@1 所需步数衡量训练代价。

观察区间内，步数随深度近似满足幂律，指数由仅蕴含逻辑的 1.04 增至加入量化后的 2.60，各拟合 R² 大于 0.99。下游八基准采用 Avg@8，平均增益最高 10.66 个百分点。这是受控训练中的经验规律，不是所有真实推理问题的复杂度定理。原图可在论文 Figure 1 查看；本站未转载该图。

## Flow-OPD

v1 首次提交 2026-05-08 · [Flow-OPD: On-Policy Distillation for Flow Matching Models](https://arxiv.org/abs/2605.08063v1) · [PDF](https://arxiv.org/pdf/2605.08063v1)

Flow-OPD 先以单一奖励训练专门教师，再在学生自己的采样轨迹上按任务路由教师监督，并用 Manifold Anchor Regularization 约束美感退化。

基于 Stable Diffusion 3.5 Medium，作者报告 GenEval 从 63 到 92，OCR 准确率从 59 到 94。组合目标的收益需按各自测试与量纲阅读；这不表示图像质量的所有维度都同幅改善，也不能将“超过教师”的特定结果推广到任意任务。

## HumanNet

v1 首次提交 2026-05-07 · [HumanNet: Scaling Human-centric Video Learning to One Million Hours](https://arxiv.org/abs/2605.06747v1) · [PDF](https://arxiv.org/pdf/2605.06747v1)

HumanNet 提供一百万小时、包含第一和第三人称的人类活动视频资源，并组织动作、交互、身体相关标注。规模与实际验证用量应分开。

初步 VLA 对照只使用其中 1,000 小时第一人称视频继续训练 Qwen 视觉语言模型，在固定验证数据上胜过用 100 小时 Magic Cobot 机器人数据的条件。两种数据时长不等，这不是等数据或等算力下的一般替代关系；资源规模也不等于全部百万小时都已完成下游验证。

## 同期其他论文入口

以下仅核对公开 v1 的题名、日期和链接，未逐篇复核全部实验。

- [Ontology-Compliant Knowledge Graphs](https://arxiv.org/abs/2603.21188v1) · v1 首次提交 2026-03-22。
- [HGNet: Scalable Foundation Model for Automated Knowledge Graph Generation from Scientific Literature](https://arxiv.org/abs/2603.23136v1) · v1 首次提交 2026-03-24。
- [LLMs Improving LLMs: Agentic Discovery for Test-Time Scaling](https://arxiv.org/abs/2605.08083v1) · v1 首次提交 2026-05-08。
- [Normalizing Trajectory Models](https://arxiv.org/abs/2605.08078v1) · v1 首次提交 2026-05-08。
- [ReActor: Reinforcement Learning for Physics-Aware Motion Retargeting](https://arxiv.org/abs/2605.06593v1) · v1 首次提交 2026-05-07。

**覆盖说明：**本期保留 8 篇已核验公开论文入口，详读其中 3 篇，其余仅列阅读链接。

**配图说明：**ScaleLogic 的公开页面仅标示 arXiv 非独占分发许可，本站未确认图像开放复用许可，因此保留原论文入口，未转载图像。
