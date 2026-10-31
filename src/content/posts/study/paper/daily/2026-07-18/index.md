---
title: '论文日报 2026-07-18：让模式约束进入查询工具接口'
published: 2026-07-18
updated: 2026-10-29
description: '让模式约束进入查询工具接口，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-07-18 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[SAGA: Schema-Aware Grounding for Agentic Text-to-SPARQL Generation](https://arxiv.org/abs/2607.14494v1) · v1 提交 2026-07-16 · [全文](https://arxiv.org/html/2607.14494v1) · [PDF](https://arxiv.org/pdf/2607.14494v1)

SAGA 将 schema 检查前移到属性探索工具。系统维护实体、变量和期待答案的类型状态，按 domain/range 过滤已知不兼容属性；信息缺失时仍保留候选，并结合局部执行证据。未知不等于不成立，这是一种保守接口设计，不是声称模型已经学会完整本体推理。

实验涵盖 Wikidata、Freebase 九组设置。主要比较固定本地 vLLM 的 gpt-oss-120B、贪心解码、温度 0、每响应上限 2,048 token，另测 LLaMA-3.1-70B。六个 Wikidata 基准相对 SPINACH 的 F1 提高 2.4—20.3 个百分点；九组总体 F1 最高、八组 EM 最高，均限定于这些设置。LC-QuAD 的提升主要来自 Boolean 问题，factoid F1 反而低 1.0 点，不能写成所有题型都改善。

原文还报告空结果和交互预算；四个报告预算的数据集里，并非每个都减少动作数。我的判断是，本体可以通过候选空间帮助查询构建，但 KBQA 成绩不等于完整 OBDA/VKG 系统正确性。生产环境仍需单独检查模式缺项、冲突和知识库变化。下图为原始流程示例，裁剪材料保留 CC BY-SA 4.0。

![2607.14494v1 Figure 1 原始截图](./images/saga-figure1.png)

原文：Yiming Zhang、Koji Tsuda，arXiv:2607.14494v1，Figure 1，PDF 第 3 页。[原始来源](https://arxiv.org/pdf/2607.14494v1#page=3) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。仅裁剪页面，保留完整原图、图注及必要标签，未重绘或修改内容。该材料沿用 CC BY-SA 4.0，此裁剪材料按相同 CC BY-SA 4.0 许可使用，本站页脚许可不为其增加非商业限制。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning](https://arxiv.org/abs/2607.14777v1) · 2607.14777v1，该版本提交 2026-07-16。
- [VideoChat3: Fully Open Video MLLM for Efficient and Generalist Video Understanding](https://arxiv.org/abs/2607.14935v1) · 2607.14935v1，该版本提交 2026-07-16。
- [RoboTTT: Context Scaling for Robot Policies](https://arxiv.org/abs/2607.15275v1) · 2607.15275v1，该版本提交 2026-07-16。
- [SearchOS-V1: Towards Robust Open-Domain Information-Seeking Agent Collaboration](https://arxiv.org/abs/2607.15257v1) · 2607.15257v1，该版本提交 2026-07-16。
- [Beyond Success Rate: Cost-Aware Evaluation of Offensive and Defensive Security Agents](https://arxiv.org/abs/2607.15263v1) · 2607.15263v1，该版本提交 2026-07-16。

**覆盖说明：** 本期保留 6 篇已核验公开论文入口，详读 1 篇，其余仅列目录。
