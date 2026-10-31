---
title: '论文日报 2026-08-26：层级知识放进损失函数，和多加几条边不同'
published: 2026-08-26
updated: 2026-10-29
description: '层级知识放进损失函数，和多加几条边不同。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 本体层级怎样影响链接预测

这项工作把 box embedding 的语义损失接到 GNN 编码器，鼓励表示满足本体类层级。对照不仅包括不使用层级的基线，也包括将 subClassOf 直接加入图的 SC-Edges，以区分两种注入方式。

## 实验条件与数字

AIFB、CoDEx-L 与 BioKG 的编码器按数据集选择，在固定模型配置下比较，Table 3 报十次训练的均值与标准差。GNN 基线到语义损失版本的 MRR：AIFB 0.4758→0.5118，CoDEx 0.3999→0.4095，BioKG 0.7232→0.8354；对应约 7.6%、2.4%、15.5% 是相对改善，不是百分点。

作者报告 Welch 双侧检验 p<0.05，但这只覆盖所测配置。评测候选负例也有数据集差异：AIFB、CoDEx 每条事实随机采样 1,000 个负例，BioKG 使用基准给定负例，不能将跨集 MRR 当成同等难度排名。

## 我的判断

结构边与约束损失不是等价接口。落地前要检查层级覆盖、错层级的影响及参数预算，而不能把鼓励一致性误称为推理器已经证明所有预测符合本体。

## 论文图表

![2608.22981v1 Table 3 原始截图](./images/hierarchy-table3.png)

图源：Filip Kronström , Ross D. King，《Hierarchy-Aware Semantic Losses for Knowledge Graph Link Prediction》，arXiv:2608.22981v1，Table 3，PDF 第 7 页。[原图出处](https://arxiv.org/pdf/2608.22981v1#page=7) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。仅裁剪原页面，保留完整图表、图注和必要标签，未重绘或修改数据，不表示作者认可本解读。图片沿用其原许可，本站页脚许可不为它增加非商业或其他限制。

## 论文来源

- [Hierarchy-Aware Semantic Losses for Knowledge Graph Link Prediction](https://arxiv.org/abs/2608.22981v1) · v1，公开于 2026-08-24。

## 同日阅读目录

- [Hierarchy-Aware Semantic Losses for Knowledge Graph Link Prediction](https://arxiv.org/abs/2608.22981v1) · v1，2026-08-24。
- [Toward Effective and Reliable LLM Agents via Dynamic Ontology](https://arxiv.org/abs/2608.22974v1) · v1，2026-08-24。
- [Prime Agent: A Self-Improving RLM Harness](https://arxiv.org/abs/2608.23552v1) · v1，2026-08-24。
- [EchoWM: Open and Enterable Omnimodal World Models](https://arxiv.org/abs/2608.23189v1) · v1，2026-08-24。
- [SWE Refactor Bench: Can Coding Agents Complete a Long-Horizon, Whole-Repository Stack Migration?](https://arxiv.org/abs/2608.23564v1) · v1，2026-08-24。
- [UniMem: Unifying Multimodal Memory and Control for Vision-Language-Action Models](https://arxiv.org/abs/2608.22869v1) · v1，2026-08-24。
- [GeoWAM: Visual Geometry World Action Models for Autonomous Driving](https://arxiv.org/abs/2608.23486v1) · v1，2026-08-24。

文中实验结果为论文作者报告，未独立复现。
