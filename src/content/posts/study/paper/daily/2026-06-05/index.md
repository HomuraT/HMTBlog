---
title: '论文日报 2026-06-05：图 token 的显著性与因果贡献'
published: 2026-06-05
updated: 2026-10-29
description: '图 token 的显著性与因果贡献，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[When Graph Tokens Sink: A Mechanistic Analysis of Graph Language Models](https://arxiv.org/abs/2606.03712v1) · v1 提交 2026-06-02 · [全文](https://arxiv.org/html/2606.03712v1) · [PDF](https://arxiv.org/pdf/2606.03712v1)

图语言模型把节点与邻域编码成 token，再交给语言模型。隐藏状态中的巨大激活究竟是信息载体，还是计算副产品？When Graph Tokens Sink 使用删除、交换、移动 token 的受控干预，追问显著对象是否真的影响任务。实际下载的 v1 PDF 与公开摘要页均使用完整题名，本文以该版本为准。

主实验覆盖 LLaGA、TEA-GLM，在 Cora、ogbn-Arxiv、PubMed 上分析节点分类与链接预测。激活阈值为 15；LLaGA 每数据集 500 个测试样本，TEA-GLM 为 300 个；推断采用贪心解码、固定种子 42。表 1 的 LLaGA/Cora 节点分类基线为 88.40，删除激活最高的两个 sink token 后为 88.00；随机删除两个非 sink token 为 80.48±2.47，后者是 15 个随机种子的均值和标准差。

这说明在被测设置中，激活最显著的 token 并非删除后损害最大的对象；LLaGA 的突出 sink 还常对应填充 token。结论不能改写成图结构没有用，也不能从两个架构推导所有图模型的机制。

我的阅读判断是，颜色鲜明的激活图需要删除对照才能支撑信息利用的解释。性能差异还受采样、输入模板及干预位置影响，论文也没有提供通用修复方案。做知识图谱增强系统时，应把可视化与受控任务验收配对使用。

**原图入口：**[Figure 1，PDF 第 2 页](https://arxiv.org/pdf/2606.03712v1#page=2)。

## 同期其他论文入口

- [OpenSearch-VL: An Open Recipe for Frontier Multimodal Search Agents](https://arxiv.org/abs/2605.05185v1) · 2605.05185v1，该版本提交 2026-05-06。
- [SkillOS: Learning Skill Curation for Self-Evolving Agents](https://arxiv.org/abs/2605.06614v1) · 2605.06614v1，该版本提交 2026-05-07。
- [UniPool: A Globally Shared Expert Pool for Mixture-of-Experts](https://arxiv.org/abs/2605.06665v1) · 2605.06665v1，该版本提交 2026-05-07。
- [BAMI: Training-Free Bias Mitigation in GUI Grounding](https://arxiv.org/abs/2605.06664v1) · 2605.06664v1，该版本提交 2026-05-07。
- [Where Do Deep-Research Agents Go Wrong? Span-Level Error Localization in Agent Trajectories](https://arxiv.org/abs/2606.02060v2) · 2606.02060v2，该版本提交 2026-06-02。
