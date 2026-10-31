---
title: '论文日报 2026-06-25：源查询抽象到本体语言的表达边界'
published: 2026-06-25
updated: 2026-10-29
description: '源查询抽象到本体语言的表达边界，核对历史版本、结果条件及证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-06-25 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方指定历史版本，不混入后续修订。实验数据为作者报告，本站未独立复现。理论论文不补造实验指标。

## 重点阅读

[Abstractions of Queries in Ontology-Based Data Access](https://arxiv.org/abs/2606.24618v1) · v1 提交 2026-06-23 · [全文](https://arxiv.org/html/2606.24618v1) · [PDF](https://arxiv.org/pdf/2606.24618v1)

OBDA 通常将本体查询下推到数据源，这篇论文反过来研究源查询怎样抽象为本体查询。完美抽象要求确定答案恰好一致，但未必存在；最小完备抽象尽量少引入多余答案，最大可靠抽象则在不误报的前提下尽量找全。作者将 UCQ 扩展为带受限不等式和常量标记 C 的语言；C 区分源端常量与未知对象，不是任意关闭开放世界假设。

这是理论研究，没有准确率或吞吐实验。在映射抽象的 GLAV 设置中，映射规则的 frontier（体与头共享变量）大小有界时，判断完美抽象存在性为 Π₂ᴾ-complete；一般情形给出 Co-NExpTime 上界。候选是否完美的验证仍为 Π₂ᴾ-complete。复杂度类不增加不代表现实计算便宜，表 1 讨论的映射条件也不能直接推广为任意本体规则。

最大可靠抽象与数据交换的 maximum recovery 建立联系，FO 可重写本体下还可进一步构造，但一般存在性和构造并未全部解决。我的判断是，工程上先要明确完备、可靠与精确的语义目标是否能表达，再选择改写器。本文是 KR 2025 论文的 2026 年扩展报告，不能当作当年新系统部署性能证明。

**原图入口：**[Table 1，PDF 第 2 页](https://arxiv.org/pdf/2606.24618v1#page=2)。原文标记 CC BY-NC-SA 4.0；本站用途与非商业限制的适用关系未确认，本次未转载该图。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [Qwen-AgentWorld: Language World Models for General Agents](https://arxiv.org/abs/2606.24597v1) · 2606.24597v1，该版本提交 2026-06-23。
- [OpenThoughts-Agent: Data Recipes for Agentic Models](https://arxiv.org/abs/2606.24855v1) · 2606.24855v1，该版本提交 2026-06-23。
- [NatureBench: Can Coding Agents Match the Published SOTA of Nature-Family Papers?](https://arxiv.org/abs/2606.24530v1) · 2606.24530v1，该版本提交 2026-06-23。
- [Agent-as-a-Router: Agentic Model Routing for Coding Tasks](https://arxiv.org/abs/2606.22902v2) · 2606.22902v2，该版本提交 2026-06-24。
- [InSight: Self-Guided Skill Acquisition via Steerable VLAs](https://arxiv.org/abs/2606.24884v1) · 2606.24884v1，该版本提交 2026-06-23。
- [HoloAgent-0: A Unified Embodied Agent Framework with 3D Spatial Memory](https://arxiv.org/abs/2606.23565v1) · 2606.23565v1，该版本提交 2026-06-22。
- [DiffusionBench: On Holistic Evaluation of Diffusion Transformers](https://arxiv.org/abs/2606.24888v1) · 2606.24888v1，该版本提交 2026-06-23。

**覆盖说明：** 本期保留 8 篇已核验公开论文入口，详读 1 篇，其余仅列目录。

待核验线索：[RML Meets LLMs: More Structure, Fewer Errors（候选题名）](https://openreview.net/forum?id=oWt34iSOKK)。原站此前验证页阻断核对，未独立确认题名与标识符对应，未继续尝试访问，不计入已核验数量。
