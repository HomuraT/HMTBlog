---
title: '论文日报 2026-07-06：协调并行采样以减少重复尝试'
published: 2026-07-06
updated: 2026-10-29
description: '协调并行采样以减少重复尝试，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[QuasiMoTTo: Quasi-Monte Carlo Test-Time Scaling](https://arxiv.org/abs/2607.01179v1) · v1 提交 2026-07-01 · [全文](https://arxiv.org/html/2607.01179v1) · [PDF](https://arxiv.org/pdf/2607.01179v1)

独立生成多条答案会重复探索同一高概率区域。QuasiMoTTo 将自回归采样写成逆 CDF 遍历，在底层随机数上使用 quasi-Monte Carlo 协调一批尝试，保持各条样本的边际分布，同时改变联合分布。样本相关后，常用独立 pass@k 估计器不再适用；论文利用 lattice 等采样结构设计无偏 bootstrap 估计。

Countdown、Maze、Sudoku 使用按任务以 50,000 个正确问答微调的 Qwen3.5-0.8B-Base，1D-ARC 直接使用 Qwen3.5-2B-Base。模型、提示、温度 1.0、top-p 0.95 固定；输出上限分别为前两任务 32 token、后两任务 280 token。lattice 采样在匹配独立采样 pass@k 时减少 25%—47% 样本。节省指采样预算，不等于服务延迟同比下降。

Maze、Sudoku 的 GRPO 实验也观察到训练效率收益，但训练输出上限等配置与上述推理实验不同，不混用其数字。我的判断是，组织一批尝试值得成为预算优化对象；接入服务仍要检查逆 CDF 数值稳定性、批处理开销和真实任务分布，不能把四类合成题直接推广为开放域 Agent 收益。

**原图入口：**[Figure 1，PDF 第 2 页](https://arxiv.org/pdf/2607.01179v1#page=2)。

## 同期其他论文入口

- [Deontic Policies for Runtime Governance of Agentic AI Systems](https://arxiv.org/abs/2606.19464v1) · 2606.19464v1，该版本提交 2026-06-17。
- [Agents-K1: Towards Agent-native Knowledge Orchestration](https://arxiv.org/abs/2606.13669v1) · 2606.13669v1，该版本提交 2026-06-11。
- [A Mathematical Introduction to Diffusion Models](https://arxiv.org/abs/2607.01693v1) · 2607.01693v1，该版本提交 2026-07-02。
- [ASPIRE: Agentic /Skills Discovery for Robotics](https://arxiv.org/abs/2607.00272v1) · 2607.00272v1，该版本提交 2026-06-30。
- [PointDiT: Pixel-Space Diffusion for Monocular Geometry Estimation](https://arxiv.org/abs/2607.02515v1) · 2607.02515v1，该版本提交 2026-07-02。
- [Measuring the Gap Between Human and LLM Research Ideas](https://arxiv.org/abs/2607.01233v1) · 2607.01233v1，该版本提交 2026-07-01。
- [Representation Distribution Matching for One-Step Visual Generation](https://arxiv.org/abs/2607.02375v1) · 2607.02375v1，该版本提交 2026-07-02。
- [Denser $\neq$ Better: Limits of On-Policy Self-Distillation for Continual Post-Training](https://arxiv.org/abs/2607.01763v1) · 2607.01763v1，该版本提交 2026-07-02。
