---
title: '论文日报 2026-10-23：企业分析 Agent 需要可更新的业务知识层'
published: 2026-10-23
updated: 2026-10-29
description: '企业分析 Agent 需要可更新的业务知识层，核对原文结果、条件与证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

数据库 schema 未必能解释业务指标、分析前提或哪些请求不成立。AgentOnto 将数据库、业务文档和示例任务组织为显式本体，让分析过程使用并更新业务知识。

## 方法与问题

流程包括本体构建、指导分析、吸收已确认反馈，以及用自生成分析任务改善本体的准备阶段。评价要求分析判断正确；需要执行时，返回结果也必须正确，不能只看 SQL 能否运行。

## 实验证据

WDI 的 282 个请求中正确处理 223 个，为 79.1%；AQS 的 324 个请求中正确处理 311 个，为 96.0%。两领域准确率的宏平均为 87.5%，DIN-SQL 为 55.0%。宏平均不是把 606 个请求合并计算的微平均，更不是任意企业任务成功率。

## 我的判断

显式业务层可以保留反馈确认与修订影响，但迁移仍依赖文档质量、指标歧义和更新权限。本文按 2026 年 arXiv 预印本讨论：PDF 的 KDD 2027 模板与未填 DOI 不能证明会议录用。

## 原论文视觉证据

![2610.23317v1 Table 1 原始截图](./images/agentonto-table1.png)

图源：Dayan Pan , Bincheng Zuo , Xiaojian Wang , Daogang Zhang , Jingyuan Wang，《AgentOnto: Ontology-Guided LLM Agents for Enterprise Data Analytics》，2610.23317v1，Table 1，PDF 第 6 页。[原图出处](https://arxiv.org/pdf/2610.23317v1#page=6) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 论文来源

- [AgentOnto: Ontology-Guided LLM Agents for Enterprise Data Analytics](https://arxiv.org/abs/2610.23317v1) · 2610.23317v1。
- 版本公开日期：2026-10-16。

## 本期其他论文

### FrontierCS 2：在研究仓库里补回被删除的贡献

FrontierCS 2 从论文和作者代码出发，删除核心贡献，让 Agent 在可运行研究仓库中探索并提交补丁。开发集提供反馈，但评估器、最终留出测试和人工参考实现保持私有；48 个开放任务跨 13 个计算机领域，考察持续研发而非单次写程序。

12 个 Agent 的比较中，最强系统通过 58% 的运行，仍有 16 项任务无人通过。论文强调综合分超过参考并不一定算通过，因为某些指标或负载仍不达标；保留多维门槛，才能避免平均收益掩盖关键退化。

[FrontierCS 2: A Benchmark for Computer Science R&D](https://arxiv.org/abs/2610.29932v1) · 2610.29932v1。

### 中训练数据和学习率日程应共同选择

这项工作把“先预训练数据、最后全切中训练数据”视为数据混合日程的一种特例，在总计算和高价值 MT token 预算固定时比较不同安排。关键发现是，单独改变学习率日程，就可能反转哪一种数据日程更好。

持续衰减学习率时，较早混入 MT 数据优于全放最后；恒定学习率下，结论可以相反。消融与理论模型因此支持在引入 MT 数据之后再安排衰减，而不是独立选数据比例与优化器。这里优化的是指定训练设置的最终 MT loss，不等于所有下游能力都同步改善。

[Data Schedules and Learning Rate Schedules Should Be Designed Together](https://arxiv.org/abs/2610.29348v1) · 2610.29348v1。

### LocaLeJEPA：让防塌缩正则适应表示几何

LocaLeJEPA 从流形视角重写 LeJEPA 的熵最大化性质，并用局部欧式分布匹配正则 LocaLeReg 实现训练。它希望摆脱全局各向同性高斯对欧式空间的依赖，使 JEPA 能配合双曲表示、等变网络等几何先验。

ImageNet-1K 上的多种骨干实验比较线性、k-NN 分类及下游任务，既包括非欧式也包括普通 ViT。结果支持局部几何约束的价值，但表示分类收益并非所有生成、控制任务的收益；几何先验和数据结构是否匹配仍是选择依据。

[LocaLeJEPA: Maximum Entropy Representations under Geometric Priors](https://arxiv.org/abs/2610.28458v1) · 2610.28458v1。

### AW-0：代码、未来视频和动作共同建模

Agentic World Action Models 的 AW-0 用 mixture-of-transformers 将代码、未来视频和机器人动作作为三个耦合生成流。代码专家输出参数化技能与控制逻辑，一方面组织多步预测，另一方面把重复行为保存成可供后续执行的程序技能。

自动整理管线为人类与机器人轨迹标注对齐程序，并归并技能库；RoboTwin 2.0 和真实双臂实验比较 VLA、WAM 基线。收益来自规划、预测与执行的整体连接，程序可复用仍依赖感知和物理预测正确，不能只凭代码形式就推断技能已跨场景泛化。

[Agentic World Action Models](https://arxiv.org/abs/2610.30136v1) · 2610.30136v1。
