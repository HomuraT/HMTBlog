---
title: '论文日报 2026-07-03：分子生成的安全证据与评测边界'
published: 2026-07-03
updated: 2026-10-29
description: '分子生成的安全证据与评测边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[MolSafeEval: A Benchmark for Uncovering Safety Risks in AI-Generated Molecules](https://arxiv.org/abs/2607.00464v1) · v1 提交 2026-07-01 · [全文](https://arxiv.org/html/2607.00464v1) · [PDF](https://arxiv.org/pdf/2607.00464v1)

MolSafeEval 将分散的毒理和危害信息组织为 MolSafeKG，结合结构解析、证据检索和模型判断，覆盖无条件生成、性质优化、靶蛋白条件设计与文本条件生成。这里讨论计算安全评测，不是实验室安全认证，也不提供危险分子设计细节。当前 arXiv 摘要页注明 Findings of ACL 2026 接收；该后续状态不代表其在本篇归档日期已完成接收。

作者在 11 项安全任务、五种 LLM 上验证框架。按分子骨架切成五个不重叠子集，每轮四份建立临时知识图谱、一份测试，汇总五轮。表 2 呼吸毒性准确率中，直接使用 DeepSeek-V3 为 0.562，加入框架后为 0.847；这是特定数据划分和任务的结果，不是任意新化合物的可靠性承诺。危险等级另用 Jaccard，相似度与准确率不能混算。

我的判断是，证据来源和判断理由值得与结果一起验收。图谱覆盖、相似性检索与模型推理仍可能出错；计算预测只能形成待复核线索，不能替代专业验证。

**原图入口**：[Table 2，PDF 第 6 页](https://arxiv.org/pdf/2607.00464v1#page=6)。

## 同期其他论文入口

- [Automating Cause-Effect Specification with Knowledge Graphs and Large Language Models](https://arxiv.org/abs/2606.31614v1) · 2606.31614v1，该版本提交 2026-06-30。
- [ABot-M0.5: Unified Mobility-and-Manipulation World Action Model](https://arxiv.org/abs/2607.00678v1) · 2607.00678v1，该版本提交 2026-07-01。
- [Xiaomi-GUI-0 Technical Report](https://arxiv.org/abs/2606.31410v1) · 2606.31410v1，该版本提交 2026-06-30。
- [SWE-Together: Evaluating Coding Agents in Interactive User Sessions](https://arxiv.org/abs/2606.29957v1) · 2606.29957v1，该版本提交 2026-06-29。
- [Is One Layer Enough? Training A Single Transformer Layer Can Match Full-Parameter RL Training](https://arxiv.org/abs/2607.01232v1) · 2607.01232v1，该版本提交 2026-07-01。
- [World from Motion: Generative Dynamic Gaussian Reconstruction from Monocular Video](https://arxiv.org/abs/2607.01202v1) · 2607.01202v1，该版本提交 2026-07-01。

文中实验结果为论文作者报告，未独立复现。
