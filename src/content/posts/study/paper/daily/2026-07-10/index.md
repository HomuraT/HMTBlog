---
title: '论文日报 2026-07-10：可进入训练的仿真世界生成'
published: 2026-07-10
updated: 2026-10-29
description: '可进入训练的仿真世界生成，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-07-10 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[EmbodiedGen V2: An Agentic, Simulation-Ready 3D World Engine for Embodied AI](https://arxiv.org/abs/2607.07459v1) · v1 提交 2026-07-08 · [全文](https://arxiv.org/html/2607.07459v1) · [PDF](https://arxiv.org/pdf/2607.07459v1)

EmbodiedGen V2 将资产、可交互 affordance、任务场景和跨模拟器接口连成可编辑流水线。机器人需要几何、尺度、物理稳定性和任务约束同时成立；漂亮场景图本身不等于可进入策略训练的环境。

v1 表 4 在单张 RTX 4090 上，完全在线顺序生成 150 个交互世界，每世界平均 5.19 个交互资产，总耗时 47.7±5.4 分钟；背景资产平均 25.5±3.5 分钟，是主要开销。人工按语义一致、空间关系、尺度、物理稳定和机器人可执行性检查，83.3% 的最终环境无需修改即可用于下游仿真。这是包含生成—验证—重试流程的最终可用率，不等于所有阶段首次就成功。

下游闭环章节汇总另一项策略学习研究，不能将该研究成功率直接当成生成器自身的控制能力。我的判断是，环境质量应以能否加载、执行与支持训练验收，仍要记录几何缺陷、尺度不匹配和初始摆放问题。离线资产复用可能节省时间，但不能省略上述完整在线成本，也不能忽略剩余未接受环境。

**原图入口：**[Figure 1，PDF 第 1 页](https://arxiv.org/pdf/2607.07459v1#page=1)。原文标记 arXiv non-exclusive distribution license；未确认第三方截图再发布许可，本次未转载该图。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [Single-Rollout Asynchronous Optimization for Agentic Reinforcement Learning](https://arxiv.org/abs/2607.07508v1) · 2607.07508v1，该版本提交 2026-07-08。
- [Infinite Worlds with Versatile Interactions](https://arxiv.org/abs/2607.07534v1) · 2607.07534v1，该版本提交 2026-07-08。
- [Scaling Mixture-of-Experts Video Pretraining for Embodied Intelligence](https://arxiv.org/abs/2607.07675v1) · 2607.07675v1，该版本提交 2026-07-08。

**覆盖说明：** 本期保留 4 篇已核验公开论文入口，详读 1 篇，其余仅列目录。
