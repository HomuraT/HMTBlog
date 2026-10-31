---
title: '论文日报 2026-07-31：弱到强蒸馏中的对照信号'
published: 2026-07-31
updated: 2026-10-29
description: '弱到强蒸馏中的对照信号，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Weak-to-Strong On-Policy Distillation](https://arxiv.org/abs/2607.26246v1) · v1 提交 2026-07-28 · [全文](https://arxiv.org/html/2607.26246v1) · [PDF](https://arxiv.org/pdf/2607.26246v1)

W2S-OPD 从两个较弱模型的 logit 差异提取能力方向，将其加到学生基础模型形成代理教师，再在学生自身 rollout 上做逐 token reverse KL 蒸馏。它不是直接复制弱模型，而是使用变化方向；对照可来自强化学习前后、不同规模基础模型或正确与错误提示。

Qwen3 系列实验覆盖四个数学、三个代码基准。pre-RL/post-RL 条件的正模型为经 GRPO 的 Qwen3-4B 专家，负模型为训练前初始化；单教师设置相对 OPD 的数学与代码平均相对改善为 11.4%、3.7%。这些不是百分点；数学超过领域教师也不意味着所有能力都全面胜出。不同规模基础模型的对照不额外训练教师，但学生蒸馏仍需计算。

我的判断是，将能力变化与教师原始分布分开很值得研究。复现仍须核查 tokenizer、logit 对齐、训练预算和任务分布；各类对照并不等价，当前结果不能自动推广到长程交互或所有领域知识，更不能称为免费提升。

**原图入口：**[Figure 1，PDF 第 1 页](https://arxiv.org/pdf/2607.26246v1#page=1)。

## 同期其他论文入口

- [Living-Harness Is an Interactive-Agent Evolver](https://arxiv.org/abs/2607.26598v1) · 2607.26598v1，该版本提交 2026-07-29。
- [TurboVLA: Real-Time Vision-Language-Action Model at 32 Hz on an RTX 4090 with <1 GB VRAM](https://arxiv.org/abs/2607.27205v1) · 2607.27205v1，该版本提交 2026-07-29。
- [HumanCLAW: Can Vision-Language Models Act Through a Body?](https://arxiv.org/abs/2607.27180v1) · 2607.27180v1，该版本提交 2026-07-29。
- [$π\mathbf{R}^2$: Reactive Real-time Flow Policies](https://arxiv.org/abs/2607.26055v1) · 2607.26055v1，该版本提交 2026-07-28。
