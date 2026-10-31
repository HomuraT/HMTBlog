---
title: '论文日报 2026-07-16：本体蒸馏的同计数与负结果边界'
published: 2026-07-16
updated: 2026-10-29
description: '本体蒸馏的同计数与负结果边界，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Ontology-Amplified Distillation and Contextuality Auditing for Sovereign Enterprise Language Models: A Combined Proof-of-Mechanism and Negative-Results Method Study](https://arxiv.org/abs/2607.11948v1) · v1 提交 2026-07-11 · [全文](https://arxiv.org/html/2607.11948v1) · [PDF](https://arxiv.org/pdf/2607.11948v1)

本研究以 47 组英文合成偏好对，在单台 Apple M5 Max 上对 Qwen3.6-27B 进行本体相关 SFT 与 DPO，再测试 40 个保留的越南语金融领域任务。学生和 GPT-5 都在 36 题达到作者的 grounded 标准；该标准与本体术语覆盖有关，不是金融结论全面正确或合规审计。

两者通过题目并不完全一致：各有两题与对方不同。相同总数只能说明观察计数一致，不能证明统计等效、学生超过教师或部署安全。原文的配对区间百分比与任务数换算存在不一致，本篇不照抄精确区间宽度，保留样本不足以排除实质差距这一限定。图 1 展示各领域计数，也不能单凭柱高宣布等效。

另一项 contextuality 审计中，修正后的 canonical Contextuality-by-Default degree 在所测 Phase 1.3 各组为零；有用信号是直接影响与构念耦合，而非残余 contextuality。我的判断是，这是机制验证和负结果，适合为更有统计效力的后续研究提问题。仍需独立数据、真实任务和安全评估；本文不提供金融决策建议。

![2607.11948v1 Figure 1 原始截图](./images/ontology-distillation-figure1.png)

原文：Thanh Luong Tuan，arXiv:2607.11948v1，Figure 1 分领域 grounded 计数，PDF 第 8 页。[原始来源](https://arxiv.org/pdf/2607.11948v1#page=8) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 同期其他论文入口

- [GRAFT: Graph-Matched Retrieval and Fusion of Tables in Data Lakes](https://arxiv.org/abs/2607.12717v1) · 2607.12717v1，该版本提交 2026-07-14。
- [FlowWAM: Optical Flow as a Unified Action Representation for World Action Models](https://arxiv.org/abs/2607.13017v1) · 2607.13017v1，该版本提交 2026-07-14。
- [Hy-Embodied-VLM-1.0: Efficient Physical-World Agents](https://arxiv.org/abs/2607.12894v1) · 2607.12894v1，该版本提交 2026-07-14。
- [Bulkhead: Automated Semantic Detection and Remediation of Container Escape Vulnerabilities](https://arxiv.org/abs/2607.12723v1) · 2607.12723v1，该版本提交 2026-07-14。
- [AgentCheck: A Reproduce-Intervene-Mitigate Workbench for LLM Agents over MCP](https://arxiv.org/abs/2607.11098v1) · 2607.11098v1，该版本提交 2026-07-13。
