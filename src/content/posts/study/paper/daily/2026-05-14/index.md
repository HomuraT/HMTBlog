---
title: '论文日报 2026-05-14：机器人重规划与吸引子推理'
published: 2026-05-14
updated: 2026-10-29
description: '机器人重规划与吸引子推理，核对历史版本、实验设置与证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## Realtime-VLA FLASH

v1 首次提交 2026-05-13 · [Realtime-VLA FLASH: Speculative Inference Framework for Diffusion-based VLAs](https://arxiv.org/abs/2605.13778v1) · [PDF](https://arxiv.org/pdf/2605.13778v1)

轻量草稿模型提出动作块，主模型并行验证一致前缀，必要时按任务阶段回退到完整推理。线上推理使用单张 RTX 4090D、动作块 50、每执行 12 个动作重规划；LIBERO 四套任务各含 10 任务，每任务 50 次。

表 1 的 3.04 倍来自 **FLASH 加 Triton 优化**：任务平均延迟 58.0 毫秒降至 19.1 毫秒，平均成功率 94.1% 到 93.8%。仅 FLASH 为 34.9 毫秒、1.66 倍，不能把组合收益全部归于草稿验证。最快单轮 7.8 毫秒也不同于任务平均。作者另做真实传送带分拣实验。

## δ-mem

v1 首次提交 2026-05-12 · [$δ$-mem: Efficient Online Memory for Large Language Models](https://arxiv.org/abs/2605.12357v1) · [PDF](https://arxiv.org/pdf/2605.12357v1)

δ-mem 在冻结的全注意力主干旁加入固定大小联想记忆，用 delta 规则更新状态，再以低秩修正影响注意力。主比较使用相同 Qwen3-4B-Instruct，LoCoMo 排除对抗问题类。

作者报告仅 8×8 在线状态即可将平均分提高到主干的 1.10 倍、最强非 δ-mem 记忆基线的 1.15 倍；MemoryAgentBench 和 LoCoMo 分别为主干的 1.31、1.20 倍。这些是相对分数倍数，不能改写为同量的绝对准确率增加，且不代表所有历史信息均被无损保存。

## Attractor Models

v1 首次提交 2026-05-12 · [Solve the Loop: Attractor Models for Language and Reasoning](https://arxiv.org/abs/2605.12466v1) · [PDF](https://arxiv.org/pdf/2605.12466v1)

语言建模设置中，主干先提出输出嵌入，吸引子模块求解固定点，并以隐式梯度训练；推理迭代按收敛调整。表 1 中，770M 模型在 Lambada 困惑度与 Core 平均分上优于用两倍 token 训练的 1.3B Transformer，但并非所有列都更好：验证困惑度和 Core-Ext 仍有差距。

另一个小模型推理设置使用每任务约 1,000 个训练样本，27M 模型在 Sudoku-Extreme、Maze-Hard 达到 91.4%、93.1%。该设置采用完整网格输出及深监督，内部结构与语言建模设置不同；不能概括为小模型已经全面超过通用大模型。

![2605.12466v1 Figure 1：Attractor Models 原图](./images/attractor-figure1.png)

原图：Jacob Fein-Ashley、Paria Rashidinejad，arXiv:2605.12466v1，Figure 1，第 1 页。[论文来源](https://arxiv.org/pdf/2605.12466v1#page=1) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 同期其他论文入口

- [A Benchmark for Gap and Overlap Analysis as a Test of KG Task Readiness](https://arxiv.org/abs/2604.10853v1) · v1 首次提交 2026-04-12。
- [AnyFlow: Any-Step Video Diffusion Model with On-Policy Flow Map Distillation](https://arxiv.org/abs/2605.13724v1) · v1 首次提交 2026-05-13。
- [The Many Faces of On-Policy Distillation: Pitfalls, Mechanisms, and Fixes](https://arxiv.org/abs/2605.11182v1) · v1 首次提交 2026-05-11。
- [World Action Models: The Next Frontier in Embodied AI](https://arxiv.org/abs/2605.12090v1) · v1 首次提交 2026-05-12。
