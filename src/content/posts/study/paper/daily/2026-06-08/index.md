---
title: '论文日报 2026-06-08：威胁知识图谱的动态本体发现'
published: 2026-06-08
updated: 2026-10-29
description: '威胁知识图谱的动态本体发现。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Schema-Agnostic Knowledge Graph Construction via Hybrid Ontology Discovery for Cyber Threat Intelligence](https://arxiv.org/abs/2606.01208v1) · v1 提交 2026-05-31 · [全文](https://arxiv.org/html/2606.01208v1) · [PDF](https://arxiv.org/pdf/2606.01208v1)

安全报告中的攻击者、工具、漏洞与行动链不能只压成孤立指标。ANCHOR 先抽实体关系，再动态发现本体：语义检索定位候选，低置信度时沿层级导航，最后以 SHACL 检查类型和关系约束，并保留证据句。

实验使用 CTINexus 的 149 份报告，为 UCO 和 STIX 重建类型标注。初始标签由模型集合产生，三位安全研究者交叉检查并达成共识；这不是完全独立于模型的原始人工标注。ANCHOR 与各基线统一使用本地 Qwen3.5-35B，在 NVIDIA GB10、128GB 内存工作站部署。

UCO 含 419 个类。表 III 的实体类型层级 F1 中，ANCHOR 为 0.7347，LLM4CTI 为 0.4521；指标给精确匹配 1.0 分、相邻父子错配 0.6 分、两步错配 0.3 分，不能理解成严格匹配正确率。更小的 MALOnt 上，表 IV 的关系类型 F1 为 0.5412，低于 LLM4CTI 的 0.5647，并非每项都胜出。

我的判断是，可导航、可检查的类型选择比一次性提示更适合大型本体，但收益取决于规模、层级与任务。通过 SHACL 不保证攻击事实真实，抽取遗漏和错误共指也仍会存在。本地运行减少部分外传路径，却不自动等于完整隐私保障。

**原图入口**：[Figure 2，PDF 第 5 页](https://arxiv.org/pdf/2606.01208v1#page=5)。

## 同期其他论文入口

- [Agents' Last Exam](https://arxiv.org/abs/2606.05405v1) · 2606.05405v1，该版本提交 2026-06-03。
- [OPRD: On-Policy Representation Distillation](https://arxiv.org/abs/2606.06021v2) · 2606.06021v2，该版本提交 2026-06-08。
- [Latent Reasoning with Normalizing Flows](https://arxiv.org/abs/2606.06447v1) · 2606.06447v1，该版本提交 2026-06-04。
- [World-Language-Action Model for Unified World Modeling, Language Reasoning, and Action Synthesis](https://arxiv.org/abs/2606.05979v1) · 2606.05979v1，该版本提交 2026-06-04。
- [MLEvolve: A Self-Evolving Framework for Automated Machine Learning Algorithm Discovery](https://arxiv.org/abs/2606.06473v1) · 2606.06473v1，该版本提交 2026-06-04。
- [Code2LoRA: Hypernetwork-Generated Adapters for Code Language Models under Software Evolution](https://arxiv.org/abs/2606.06492v1) · 2606.06492v1，该版本提交 2026-06-04。
- [Cosmos 3: Omnimodal World Models for Physical AI](https://arxiv.org/abs/2606.02800v2) · 2606.02800v2，该版本提交 2026-06-05。

文中实验结果为论文作者报告，未独立复现。
