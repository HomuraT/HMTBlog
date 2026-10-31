---
title: '论文日报 2026-06-26：模糊量词怎样成为知识图谱查询'
published: 2026-06-26
updated: 2026-10-29
description: '模糊量词怎样成为知识图谱查询。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[Fuzzy Quantification over OWL Ontologies and Knowledge Graphs](https://arxiv.org/abs/2606.25778v1) · v1 提交 2026-06-24 · [全文](https://arxiv.org/html/2606.25778v1) · [PDF](https://arxiv.org/pdf/2606.25778v1)

“少数比赛射门效率高”同时含模糊属性与量词。论文区分清晰对象集上的 Type I 与两个模糊集合关系的 Type II 查询，并覆盖 OWL、本身带模糊度的本体与 RDFS 图谱。Java 原型 Q2S2 通过 OWLAPI、HermiT 或 Jena/SPARQL 获取实例，再计算 [0,1] 真值；不同量化方法可以给不同答案。

实验包含 Premierleague 的 11,859 个个体、2,130,363 条逻辑公理，以及 DBpedia 的 27,567 个城市。表 1 的 Q1 中，GD 真值为 0.056，Zadeh 为 0；预处理 20,160 毫秒，GD 首次查询 5,515 毫秒、第二次 145 毫秒。DBpedia 的 Type II Q4 中，两方法真值为 0.029 与 0.052；预处理 47 毫秒，GD 两次为 1,407、1,417 毫秒。测试机是 Windows 7 64 位、i7-8550U 1.8GHz、16GB RAM 笔记本，数字只是指定原型和查询的开销示例。

这使日常模糊措辞成为可讨论的显式语义，但论文没有证明哪个量化方法最符合人类判断，也没有跨领域检索准确率排名。我会要求同时公布模糊集定义、缺失属性和离群值处理、量化方法，再解释真值；一个小数不会自动让答案客观。

**原图入口**：[Figure 3，PDF 第 23 页](https://arxiv.org/pdf/2606.25778v1#page=23)。

## 同期其他论文入口

- [Project Auto-World: Towards Automated Benchmarking of Neural Relational Reasoners](https://arxiv.org/abs/2606.24965v1) · 2606.24965v1，该版本提交 2026-06-23。
- [Autodata: An agentic data scientist to create high quality synthetic data](https://arxiv.org/abs/2606.25996v2) · 2606.25996v2，该版本提交 2026-06-25。
- [Wan-Streamer v0.1: End-to-end Real-time Interactive Foundation Models](https://arxiv.org/abs/2606.25041v2) · 2606.25041v2，该版本提交 2026-06-25。
- [Are We Ready For An Agent-Native Memory System?](https://arxiv.org/abs/2606.24775v1) · 2606.24775v1，该版本提交 2026-06-23。
- [You Don't Need to Run Every Eval](https://arxiv.org/abs/2606.24020v1) · 2606.24020v1，该版本提交 2026-06-22。
- [Model Forensics: Investigating Whether Concerning Behavior Reflects Misalignment](https://arxiv.org/abs/2606.26071v2) · 2606.26071v2，该版本提交 2026-06-25。
- [Helpful or Harmful? Evaluating LLM-Assisted Vulnerability Patching via a Human Study](https://arxiv.org/abs/2606.25973v1) · 2606.25973v1，该版本提交 2026-06-24。

文中实验结果为论文作者报告，未独立复现。
