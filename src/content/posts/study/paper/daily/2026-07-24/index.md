---
title: '论文日报 2026-07-24：用逻辑约束减少重复抽取调用'
published: 2026-07-24
updated: 2026-10-29
description: '用逻辑约束减少重复抽取调用，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-07-24 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[Logic-Guided Data Extraction with Answer Set Programming and Large Language Models](https://arxiv.org/abs/2607.19365v1) · v1 提交 2026-06-08 · [全文](https://arxiv.org/html/2607.19365v1) · [PDF](https://arxiv.org/pdf/2607.19365v1)

Logic-Guided Data Extraction 让 LLM 提候选事实，ASP 负责验证、推导、冲突检查和下一步控制。当前事实若已排除某个谓词，就不必继续询问；能由逻辑推出的信息也不必重复抽取。缓存利用增量事实集上合取查询的单调性，进一步减少求解器工作。

理论等价性依赖 oracle 与规则等假设，并非证明现实语言模型永不出错。表 1 的 LNRS 构造谜题中，70B 配置从逐项基线 3,072 次 oracle 调用降至 LGX 的 864 次，与事后过滤基线同为 F1=0.963；120B 同样从 3,072 到 864，F1=0.947。图布局基准 G 的收益不同，不能将这组调用节省当作跨任务、跨模型的端到端加速比。

我的判断是，应先把可靠领域约束编成可执行控制知识，再决定询问模型什么。但 ASP 检查的是形式化规则下的候选一致性，不是自然语言事实的真实性；规则来源和抽取证据仍需审核。下方引用结果表 1，而非容易误认为系统架构的图布局示例。

![2607.19365v1 Table 1 原始截图](./images/logic-extraction-table1.png)

原文：Mario Alviano、Lorenzo Grillo、Nicola Leone、Fabrizio Lo Scudo，arXiv:2607.19365v1，Table 1 结果表，PDF 第 12 页。[原始来源](https://arxiv.org/pdf/2607.19365v1#page=12) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。仅裁剪页面，保留完整原图、图注及必要标签，未重绘或修改内容。该材料沿用 CC BY-SA 4.0，此裁剪材料按相同 CC BY-SA 4.0 许可使用，本站页脚许可不为其增加非商业限制。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [The Mechanism Matters: When Knowledge Graphs Help Reinforcement Learning](https://arxiv.org/abs/2607.19616v1) · 2607.19616v1，该版本提交 2026-07-21。
- [PerfAgent: Profiler-Guided Iterative Refinement for Repository-Level Code Optimization](https://arxiv.org/abs/2607.19653v1) · 2607.19653v1，该版本提交 2026-07-22。
- [Robots Acquire Manipulation Skills in Seconds from a Single Human Video](https://arxiv.org/abs/2607.20033v1) · 2607.20033v1，该版本提交 2026-07-22。
- [CrackedPDFs: A Controlled Benchmark for Hidden Prompt Injection in PDFs](https://arxiv.org/abs/2607.19396v1) · 2607.19396v1，该版本提交 2026-07-03。
- [Context Matters: Improving the Practical Reliability of LLM-Based Unit Test Generation](https://arxiv.org/abs/2607.19682v1) · 2607.19682v1，该版本提交 2026-07-22。

**覆盖说明：** 本期保留 6 篇已核验公开论文入口，详读 1 篇，其余仅列目录。
