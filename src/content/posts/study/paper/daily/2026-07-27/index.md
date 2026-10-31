---
title: '论文日报 2026-07-27：学术检索的完整工具调用证据'
published: 2026-07-27
updated: 2026-10-29
description: '学术检索的完整工具调用证据，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[AISE-Bench: A Full-Cycle Curated Benchmark for Information Seeking on Academic Knowledge Graphs](https://arxiv.org/abs/2607.20498v1) · v1 提交 2026-06-16 · [全文](https://arxiv.org/html/2607.20498v1) · [PDF](https://arxiv.org/pdf/2607.20498v1)

学术检索可能需要先找作者、查机构、汇总主题，再给出支持结论的来源。AISE-Bench 提供 1,133 个问答对、问题分类、完整 API 执行轨迹、验证参数与带参考链接答案，分别评答案、引用、规划和执行，而非只看最后一句文字。

十四种受评方法里，PLAY2PROMPT 配合 Gemini-3-Pro 的正确性评分为 61.04%、完整性为 60.9%。这是模型裁判的连续质量评分，不是逐题人工确认的二元成功率。作者用人工比较筛选与人类偏好较一致的裁判再汇总，但仍不能消除模型评判偏差。数据含 250 个双重复核和 883 个单次复核样本，也不应混称全部双人审定。

我的判断是，应把每次工具调用与最终声明连起来：参数从何而来、哪个返回值支持哪个句子。API 步骤大致走通，参数填写仍可能出错；基准聚焦特定学术图谱与接口，不能直接外推为所有网页研究助手排名。

**原图入口：**[Figure 1，PDF 第 3 页](https://arxiv.org/pdf/2607.20498v1#page=3)。

## 同期其他论文入口

- [EvoSQL: Memory-Augmented Critic-Generator Co-Evolution for Text-to-SQL](https://arxiv.org/abs/2607.20489v1) · 2607.20489v1，该版本提交 2026-06-04。
- [JAXBench: Benchmarking Autonomous TPU Kernel Optimization](https://arxiv.org/abs/2607.20466v1) · 2607.20466v1，该版本提交 2026-05-19。
- [InferenceBench: A Benchmark for Open-Ended LLM Inference Optimization by AI Agents](https://arxiv.org/abs/2607.20468v1) · 2607.20468v1，该版本提交 2026-05-20。
- [Robust Critics: Defending LLMs Against Multi-Turn Attacks](https://arxiv.org/abs/2607.20472v1) · 2607.20472v1，该版本提交 2026-05-24。
- [Demonstrating GenDB: Instance-Optimized and Customized Query Processing Code Generation via LLM Agents](https://arxiv.org/abs/2607.20630v1) · 2607.20630v1，该版本提交 2026-07-22。
