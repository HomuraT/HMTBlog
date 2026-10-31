---
title: '论文日报 2026-04-25：自博弈、缓存遗忘与科学推理'
published: 2026-04-25
updated: 2026-10-29
description: '自博弈题目质量、推理缓存预算与科学智能体的证据使用，并保留核验后的历史阅读入口。'
image: ''
tags: [LLM, Agent, 科学推理]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

持续提供有效挑战、减少推理工作记忆、审查科学推理过程，是三种不同的能力。本期分别讨论自博弈、缓存管理和科学智能体，并保留能够核对的其他研究入口。

## SGS

自博弈训练 · v1 首次提交 2026-04-22 · [Scaling Self-Play with Self-Guidance](https://arxiv.org/abs/2604.20209v1) · [全文](https://arxiv.org/html/2604.20209v1)

Self-Guided Self-Play 增加 Guide 角色，对合成子问题的自然程度及其对未解决目标的帮助评分，以抑制出题者靠畸形难题获取奖励。作者在 Lean4 形式化证明中报告，不到 80 轮便超过最强 RL 基线的拟合渐近解题率。

7B 模型经过 200 轮训练后，累计解决的问题数超过 671B 模型的 pass@4 结果。这是长时间自博弈与固定采样预算的比较，不能解释为同等计算成本下的小模型普遍胜过大模型。[实验与比较口径见第 4 节](https://arxiv.org/html/2604.20209v1#S4)。

## Neural Garbage Collection

推理记忆管理 · v1 首次提交 2026-04-20 · [Neural Garbage Collection: Learning to Forget while Learning to Reason](https://arxiv.org/abs/2604.18002v1) · [全文](https://arxiv.org/html/2604.18002v1)

NGC 让模型间歇选择淘汰的 KV cache 条目，再在剩余记忆上继续推理。推理 token 与淘汰决策共同作为强化学习动作，训练信号来自最终任务结果。

在 Countdown、AMC、AIME 上，作者报告峰值缓存压缩约 2–3 倍时仍维持接近全缓存上界的准确率，并优于所比较的淘汰基线。该结果支持受限任务中的学习式记忆管理，无法保证任意长上下文服务都能无损压缩。[实验见第 5 节](https://arxiv.org/html/2604.18002v1#S5)。

## 科学智能体会利用证据吗

科学推理评测 · v1 首次提交 2026-04-20 · [AI scientists produce results without reasoning scientifically](https://arxiv.org/abs/2604.18805v1) · [全文](https://arxiv.org/html/2604.18805v1)

该研究覆盖八类科学领域与超过 25,000 次运行，将最终分数与过程行为分别检查。测试包含三个基础模型及 ReAct、结构化工具调用两种框架，任务从工作流执行延伸至假设检验。

![科学推理论文 v1 Figure 1，区分模型、框架与环境，按认知要求组织八个科学领域，并保留操作图例。](./images/scientists-figure1.png)

*图 1｜Martiño Ríos-García 等，[v1 Figure 1，PDF 第 4 页](https://arxiv.org/pdf/2604.18805v1#page=4)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

按作者的轨迹标注规则，68% 的轨迹出现取得证据后未使用的行为，26% 出现反驳推动的信念修正。过程分析包括模型辅助标注，比例依赖其操作定义，不能当作对所有科研工具的永久判断。结果提示，最终产物验收需要与证据使用、假设更新的审查配合。[分析见原文结果部分](https://arxiv.org/html/2604.18805v1)。

## 专题短评

- **LOM** · v1 首次提交 2026-03-11。[Unifying Ontology Construction and Semantic Alignment for Deterministic Enterprise Reasoning at Scale](https://arxiv.org/abs/2604.09608v1) 连接本体构建、语义对齐与图推理。摘要报告 LOM-4B 本体补全准确率为 88.8%；推理得分在摘要与正文中出现 94% 和 95% 两种表述，统计口径尚未一致核验，本文不列统一推理分数，也不外推企业数据治理的一般水平。
- **Vision Banana** · v1 首次提交 2026-04-22。[Image Generators are Generalist Vision Learners](https://arxiv.org/abs/2604.20329v1) 将分割、深度等输出编码成 RGB 图像，以指令微调探索生成式视觉预训练的理解能力。具体比较仍需分别核对数据集、零样本条件与专用模型。

## 其他公开研究入口

- [GrandCode: Achieving Grandmaster Level in Competitive Programming via Agentic Reinforcement Learning](https://arxiv.org/abs/2604.02721v1) · v1 首次提交 2026-04-03。
- [ClawBench: Can AI Agents Complete Everyday Online Tasks?](https://arxiv.org/abs/2604.08523v1) · v1 首次提交 2026-04-09。
- [Video-MME-v2: Towards the Next Stage in Benchmarks for Comprehensive Video Understanding](https://arxiv.org/abs/2604.05015v1) · v1 首次提交 2026-04-06。
- [WildDet3D: Scaling Promptable 3D Detection in the Wild](https://arxiv.org/abs/2604.08626v1) · v1 首次提交 2026-04-09。
- [CARLA-Air: Fly Drones Inside a CARLA World -- A Unified Infrastructure for Air-Ground Embodied Intelligence](https://arxiv.org/abs/2603.28032v1) · v1 首次提交 2026-03-30。
- [AgentSPEX: An Agent SPecification and EXecution Language](https://arxiv.org/abs/2604.13346v1) · v1 首次提交 2026-04-14。
- [GameWorld: Towards Standardized and Verifiable Evaluation of Multimodal Game Agents](https://arxiv.org/abs/2604.07429v1) · v1 首次提交 2026-04-08。
- [No Data, No Optimization: A Lightweight Method To Disrupt Neural Networks With Sign-Flips](https://arxiv.org/abs/2502.07408v1) · v1 首次提交 2025-02-11。
- [Hyperloop Transformers](https://arxiv.org/abs/2604.21254v1) · v1 首次提交 2026-04-23。
- [Evaluation-driven Scaling for Scientific Discovery](https://arxiv.org/abs/2604.19341v1) · v1 首次提交 2026-04-21。
- [WorldMark: A Unified Benchmark Suite for Interactive Video World Models](https://arxiv.org/abs/2604.21686v1) · v1 首次提交 2026-04-23。
- [Agent-World: Scaling Real-World Environment Synthesis for Evolving General Agent Intelligence](https://arxiv.org/abs/2604.18292v1) · v1 首次提交 2026-04-20。
- [Qwen3.5-Omni Technical Report](https://arxiv.org/abs/2604.15804v1) · v1 首次提交 2026-04-17。
- [DataMosaic: Explainable and Verifiable Multi-Modal Data Analytics through Extract-Reason-Verify](https://arxiv.org/abs/2504.10036v1) · v1 首次提交 2025-04-14。
- [Fast-dLLM: Training-free Acceleration of Diffusion LLM by Enabling KV Cache and Parallel Decoding](https://arxiv.org/abs/2505.22618v1) · v1 首次提交 2025-05-28。

- [DeepSeek-V4 Preview 官方发布说明](https://deepseek.com/en/news/v4-preview/) · 页面标注 2026-04-24。本期保留官方预览入口，不把后续 arXiv 存档伪写成 4 月 25 日已经发表的论文。
