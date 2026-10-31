---
title: '论文日报 2026-06-06：2 比特 KV 缓存与长推理误差'
published: 2026-06-06
updated: 2026-10-29
description: '2 比特 KV 缓存与长推理误差，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本文补录 **2026-06-06 的推荐日报清单**，于 2026-10-29 核对公开来源。推荐日期不等于论文发表日期；采用下方明确标记的历史版本，不混用后续修订。数值均为作者报告，本站未独立复现。

## 重点阅读

[KVarN: Variance-Normalized KV-Cache Quantization Mitigates Error Accumulation in Reasoning Tasks](https://arxiv.org/abs/2606.03458v1) · v1 提交 2026-06-02 · [全文](https://arxiv.org/html/2606.03458v1) · [PDF](https://arxiv.org/pdf/2606.03458v1)

长推理的 KV 缓存随生成持续增长。固定长输入上的量化检索表现良好，不代表逐 token 生成也可靠：前一步偏差可能进入后续状态。KVarN 关注 token 尺度误差，结合 Hadamard 旋转与双轴方差归一化，不需要校准数据。

表 1 在三次运行上报告均值与标准差。Phi-4-14B 的 MATH500：FP16 为 84.9±0.9%，KVarN 的 K/V 各 2 比特为 84.8±0.7%，KIVI 同名义位宽为 74.4±0.8%。AIME24 对应为 62.2±1.6%、61.7±1.7%、57.8±1.9%。这些是质量指标，不能直接推导服务吞吐提升。

算入尺度等开销后，KVarN 的有效 KV 存储为每元素 2.3 比特，不是整个系统内存缩到八分之一。边界也很清楚：Qwen3-4B 在 MATH500 从 FP16 的 82.6% 降到 79.2%，不同模型的量化敏感度不同。

我认为最有意义的是把验收对象从一次性压缩输入改成持续压缩生成状态。部署仍需测解量化和尺度处理开销、长输出质量与端到端延迟。数学测试接近基线，并不等于所有长上下文任务均可靠；平均分之外，也应记录长生成中的失败位置。

**原图入口：**[Figure 1，PDF 第 2 页](https://arxiv.org/pdf/2606.03458v1#page=2)。本次仅确认 arXiv 非独占分发许可，未确认第三方截图再发布权，未转载该图。

## 同期其他论文入口

以下只核对题名、标识符和指定历史版本，不代表逐篇全文深读。

- [Schema-Agnostic Knowledge Graph Construction via Hybrid Ontology Discovery for Cyber Threat Intelligence](https://arxiv.org/abs/2606.01208v1) · 2606.01208v1，该版本提交 2026-05-31。
- [Harness-1: Reinforcement Learning for Search Agents with State-Externalizing Harnesses](https://arxiv.org/abs/2606.02373v1) · 2606.02373v1，该版本提交 2026-06-01。
- [LongTraceRL: Learning Long-Context Reasoning from Search Agent Trajectories with Rubric Rewards](https://arxiv.org/abs/2605.31584v1) · 2605.31584v1，该版本提交 2026-05-29。
- [PaddleOCR-VL-1.6: Expanding the Frontier of Document Parsing with Under-Optimized Region Refinement and Progressive Post-Training](https://arxiv.org/abs/2606.03264v1) · 2606.03264v1，该版本提交 2026-06-02。
- [Don't Ask the LLM to Track Freshness: A Deterministic Recipe for Memory Conflict Resolution](https://arxiv.org/abs/2606.01435v1) · 2606.01435v1，该版本提交 2026-05-31。
- [World Models Meet Language Models: On the Complementarity of Concrete and Abstract Reasoning](https://arxiv.org/abs/2606.03603v1) · 2606.03603v1，该版本提交 2026-06-02。

**覆盖说明：**本期保留 7 篇已核验公开论文入口，详读 1 篇；其余仅列目录。
