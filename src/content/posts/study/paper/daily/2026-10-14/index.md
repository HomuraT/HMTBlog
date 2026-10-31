---
title: '论文日报 2026-10-14：Text to SPARQL 的提升，要分清相对百分比与百分点'
published: 2026-10-14
updated: 2026-10-29
description: 'Text to SPARQL 的提升，要分清相对百分比与百分点。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

知识图谱问答必须同时找到实体、关系、端点与查询结构。SPARQL-LLM 的挑战赛结果值得读，但其中约 59% 的提升需要明确分母。

## 方法与问题

系统参加 TEXT2SPARQL 2026 的 DBpedia 与企业图谱任务。报告配置为 GPT-5.2、400K 上下文、温度 0、最大输出 16K tokens。这是完整系统的比较，不能隔离单个检索或提示模块的贡献。

## 实验证据

西班牙语 DBpedia F1 为 0.7810，第二名 ARUQULA v1 为 0.4904，差值 0.2906，即 29.06 个百分点；约 59% 是相对增幅。英语 DBpedia 为 0.7192 对 0.6142，增加 10.50 个百分点。系统在所报参赛方法中总体第一，但这些赛题分数不是任意企业图谱的准确率承诺。

## 我的判断

完整配置和逐数据集表格比排名更容易复用。应固定语言、模型版本、端点可用性、实体链接与执行判分口径。SPARQL 能运行仍可能语义错误，需要分别验证。

## 论文图表

![2610.13648v1 Figure 1 原始截图](./images/sparql-llm-figure1.png)

图源：Panayiotis Smeros , Vincent Emonet , Ruijie Wang , Ana-Claudia Sima , Tarcisio Mendes de Farias，《SPARQL-LLM in the TEXT2SPARQL 2026 Challenge》，2610.13648v1，Figure 1，PDF 第 3 页。[原图出处](https://arxiv.org/pdf/2610.13648v1#page=3) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。仅裁剪原页面，保留完整图表、图注和必要标签，未重绘或修改数据，不表示作者认可本解读。该图沿用 CC BY 4.0，本站页脚许可不为其增加非商业或相同方式共享限制。

## 论文来源

- [SPARQL-LLM in the TEXT2SPARQL 2026 Challenge](https://arxiv.org/abs/2610.13648v1) · 2610.13648v1，该版本公开于 2026-10-09。

文中实验结果为论文作者报告，未独立复现。
