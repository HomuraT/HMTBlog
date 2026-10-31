---
title: '论文日报 2026-05-06：可执行语义约束与对齐泛化'
published: 2026-05-06
updated: 2026-10-29
description: '可执行语义约束与对齐泛化，核对历史版本、实验条件与公开原图。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## Ontology-to-tools

v1 首次提交 2026-02-03 · [Ontology-to-tools compilation for executable semantic constraint enforcement in LLM agents](https://arxiv.org/abs/2602.03439v1) · [PDF](https://arxiv.org/pdf/2602.03439v1)

在 The World Avatar 中，作者将本体规范编译为可执行工具接口，让智能体通过接口创建、修改知识图谱实例，并在抽取、检查与修复的循环中执行约束。

金属有机多面体合成文献示例提供了概念验证。它不能证明跨领域的完整正确性：本体本身是否完整、工具是否准确实现约束，以及失败如何处理，仍是工程责任。

## MSM

v1 首次提交 2026-05-03 · [Model Spec Midtraining: Improving How Alignment Training Generalizes](https://arxiv.org/abs/2605.02087v1) · [PDF](https://arxiv.org/pdf/2605.02087v1)

Model Spec Midtraining 在预训练与对齐微调之间加入讨论行为规范的合成文档，研究相同示范在不同先验规范下怎样泛化。图 1 的奶酪偏好是机制示意，不能当作后文安全实验的结果图。

在涉及自我保留与目标维护的特定测试中，Qwen3-32B 的错位率从 54% 降到 7%，后者对应 MSM 加对齐微调（AFT）；deliberative alignment 比较为 14%。不能把 7% 写成仅做中间训练的结果，也不能据此声称所有部署风险已经消除。

![2605.02087v1 Figure 1：MSM 原图](./images/msm-figure1.png)

原图：Chloe Li、Sara Price、Samuel Marks、Jon Kutasov，arXiv:2605.02087v1，Figure 1，第 2 页。[论文来源](https://arxiv.org/pdf/2605.02087v1#page=2) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## ProgramBench

v1 首次提交 2026-05-05 · [ProgramBench: Can Language Models Rebuild Programs From Scratch?](https://arxiv.org/abs/2605.03546v1) · [PDF](https://arxiv.org/pdf/2605.03546v1)

基准只提供参考可执行程序及文档，让智能体重建行为一致的代码库与构建脚本；原始实现与隐藏测试不可见，任务环境禁止联网。端到端检查由基于模糊测试生成的行为用例完成。

200 项任务从小型命令行工具延伸到 FFmpeg、SQLite 和 PHP。九个模型均未完整解决任何任务，最佳模型也只在 3% 的任务上通过 95% 的测试。零完整通过不等于毫无进展，但显示局部修复能力不足以代表完整项目重建能力；有限测试也不是程序全规格。

## 同期其他论文入口

- [OpenSeeker-v2: Pushing the Limits of Search Agents with Informative and High-Difficulty Trajectories](https://arxiv.org/abs/2605.04036v1) · v1 首次提交 2026-05-05。
- [RLDX-1 Technical Report](https://arxiv.org/abs/2605.03269v1) · v1 首次提交 2026-05-05。
- [A Benchmark for Interactive World Models with a Unified Action Generation Framework](https://arxiv.org/abs/2605.03941v1) · v1 首次提交 2026-05-05。
- [RoboAlign-R1: Distilled Multimodal Reward Alignment for Robot Video World Models](https://arxiv.org/abs/2605.03821v1) · v1 首次提交 2026-05-05。
