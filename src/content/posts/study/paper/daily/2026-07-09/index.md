---
title: '论文日报 2026-07-09：多跳图推理与答案生成的解耦'
published: 2026-07-09
updated: 2026-10-29
description: '多跳图推理与答案生成的解耦，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-07-09 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[RSF-GLLM: Bridging the Semantic Gap in Multi-Hop Knowledge Graph QA via Recurrent Soft-Flow and Decoupled LLM Generation](https://arxiv.org/abs/2607.06527v1) · v1 提交 2026-07-07 · [全文](https://arxiv.org/html/2607.06527v1) · [PDF](https://arxiv.org/pdf/2607.06527v1)

多跳问答的桥接节点可能与问题用词并不相似。RSF-GLLM 用 Recurrent Soft-Flow 做可微遍历，以 GRU 更新查询状态并动态门控传播相关性，再将抽出的路径文本交给 LLM；路径搜索与答案生成因此可以分别优化。

实验使用实体已预链接到 Freebase 的 WebQSP、CWQ，分别抽取 2-hop、4-hop BFS 子图，以 Qwen3-8B 读出，单张 NVIDIA A100 运行。表 1 的 Hit@1/F1：WebQSP 为 90.45/79.15，CWQ 为 67.39/61.87。原文指出 19.3% 的 CWQ 测试问题金答案不在抽取子图内；多数基线数字来自原论文，并非同栈完整重跑，不能把表中差值包装成严格等条件的速度排名。

我的判断是，若子图已缺答案，再强的表达模型也没有真实路径可用。工程验收应同时报告检索覆盖、最终答案和调用成本，另测实体链接错误，而不只看预链接数据上的总体分数。当前 arXiv 页面注明 ICML 2026 接收，此状态为回填时核对，不推定推荐当日已公布；本站未独立复现。

**原图入口：**[Figure 1，PDF 第 3 页](https://arxiv.org/pdf/2607.06527v1#page=3)。原文标记 CC BY-NC-SA 4.0；本站用途与非商业限制的适用关系未确认，本次未转载该图。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [Integrating knowledge graphs and multilingual scholarly corpora for domain-adaptive LLMs in SSH](https://arxiv.org/abs/2607.05956v1) · 2607.05956v1，该版本提交 2026-07-07。
- [DSpark: Confidence-Scheduled Speculative Decoding with Semi-Autoregressive Generation](https://arxiv.org/abs/2607.05147v1) · 2607.05147v1，该版本提交 2026-07-06。
- [Vision as Unified Multimodal Generation](https://arxiv.org/abs/2607.06560v1) · 2607.06560v1，该版本提交 2026-07-07。
- [From Foundation to Application: Improving VLA Models in Practice](https://arxiv.org/abs/2607.06403v1) · 2607.06403v1，该版本提交 2026-07-07。
- [Spider 2.0-AIFunc: Extending Real-World Text-to-SQL to AI-Native SQL Workflows](https://arxiv.org/abs/2607.06229v1) · 2607.06229v1，该版本提交 2026-07-07。
- [Demonstrating TOFFEE: A Learned System for Synthesizing Data Agent Trajectories at Scale](https://arxiv.org/abs/2607.06233v1) · 2607.06233v1，该版本提交 2026-07-07。
- [Doomed from the Start: Early Abort of LLM Agent Episodes via a Recall-Controlled Probe Cascade](https://arxiv.org/abs/2607.06503v1) · 2607.06503v1，该版本提交 2026-07-07。
- [A Definition and Roadmap for World Models](https://arxiv.org/abs/2607.06401v1) · 2607.06401v1，该版本提交 2026-07-07。

**覆盖说明：** 本期保留 9 篇已核验公开论文入口，详读 1 篇，其余仅列目录。
