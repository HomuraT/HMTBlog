---
title: '论文日报 2026-04-29：像素接口、三维约束与跨天 Agent 评测'
published: 2026-04-29
updated: 2026-10-29
description: 'Tuna-2 的像素嵌入、World-R1 的几何反馈，以及 ClawMark 对部分得分与完整完成的区分。'
image: ''
tags: [LLM, Agent, 多模态]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

从像素直接学习、在视频生成中加入三维反馈、让工作环境跨天变化，分别检验了模型接口和评测协议中的不同假设。

本文补录 **2026 年 4 月 29 日的推荐日报清单**，于 10 月 29 日核对公开来源。推荐日期不等于论文提交或发表日期，以下固定引用 **v1**。数字为作者报告，本站未独立复现。

## Tuna-2

多模态理解与生成 · v1 首次提交 2026-04-27 · [Tuna-2: Pixel Embeddings Beat Vision Encoders for Multimodal Understanding and Generation](https://arxiv.org/abs/2604.24763v1) · [全文](https://arxiv.org/html/2604.24763v1)

Tuna-2 通过简单图像 patch 嵌入处理视觉输入，让理解和生成共享像素空间训练路径，去掉独立的 VAE 或表征编码器。作者观察到，编码器版本早期收敛较快，无编码器设计在扩展训练规模后取得更强的细粒度理解表现。

该结论依赖论文中的模型、数据和训练规模，不能据此推断所有预训练视觉编码器都没有价值。

## World-R1

视频三维一致性 · v1 首次提交 2026-04-27 · [World-R1: Reinforcing 3D Constraints for Text-to-Video Generation](https://arxiv.org/abs/2604.24764v1) · [全文](https://arxiv.org/html/2604.24764v1)

World-R1 保持基础视频模型架构，以预训练三维模型和视觉语言模型提供反馈，通过 Flow-GRPO 系列优化方法约束几何一致性，并用周期性解耦训练平衡静态结构与动态流畅度。

作者报告几何一致性改善并保留视觉质量。奖励模型偏好的三维结构与真实物理规律仍是不同的验证对象，长期世界状态也需要另行检验。

## ClawMark

跨天工作智能体评测 · v1 首次提交 2026-04-26 · [ClawMark: A Living-World Benchmark for Multi-Turn, Multi-Day, Multimodal Coworker Agents](https://arxiv.org/abs/2604.23781v1) · [全文](https://arxiv.org/html/2604.23781v1)

基准包含 13 类专业情境、100 项任务，覆盖文件、邮件、日历、知识库和表格五个有状态沙箱服务。1,537 个确定性检查器检查执行后的状态，评分不使用模型裁判。

![ClawMark v1 Figure 1，左侧对比加权得分与严格任务成功率，右侧展示100项任务的13类情境分布。](./images/clawmark-figure1.png)

*图 1｜Fanqing Meng、Lingxiao Du、Zijian Wu 等，[v1 Figure 1，PDF 第 3 页](https://arxiv.org/pdf/2604.23781v1#page=3)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

七个系统在统一 OpenClaw harness 下按单次运行协议比较。最高加权分 75.8 来自 Claude Sonnet 4.6；最高严格任务成功率 20.0% 来自 Claude Opus 4.6，两项并非同一模型的成绩。

环境首次外生更新后表现下降，说明部分完成与跨天可靠性需要分别衡量。严格成功要求通过该任务全部检查器，不能用较高的部分加权分替代。[协议与结果见原文第 5 节](https://arxiv.org/html/2604.23781v1#S5)。

## 其他公开研究入口

以下仅核对历史 v1 题名、提交日期与链接，未复核全部实验。

- [Kwai Summary Attention Technical Report](https://arxiv.org/abs/2604.24432v1) · v1 首次提交 2026-04-27。
- [SFT-then-RL Outperforms Mixed-Policy Methods for LLM Reasoning](https://arxiv.org/abs/2604.23747v1) · v1 首次提交 2026-04-26。
- [MMEB-V3: Measuring the Performance Gaps of Omni-Modality Embedding Models](https://arxiv.org/abs/2604.23321v1) · v1 首次提交 2026-04-25。

本期共六篇入口，展开其中三篇。
