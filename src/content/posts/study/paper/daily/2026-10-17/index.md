---
title: '论文日报 2026-10-17：训练 Agent 不只奖励成功，也要教它安全退回'
published: 2026-10-17
updated: 2026-10-29
description: '训练 Agent 不只奖励成功，也要教它安全退回，核对原文结果、条件与证据边界。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

如果奖励只分成功与失败，模型可能在没有把握时继续猜。GracefulRL 将结果按成功、fallback、错误排序，研究如何保留解题能力并减少危险错误。

## 方法与问题

它改变训练优化结构，而非在推理时额外加裁判。直接给 fallback 中间奖励，普通策略梯度仍可能塌缩为永远退回；GracefulRL 调整优化动力学，寻找成功与错误之间更有用的权衡。

## 实验证据

SafeMaze 要求到达目标，无法完成时返回安全位置。Figure 3 中 GRPO/RLOO 可塌缩为总去安全格；GracefulRL 在所测设置下获得更好的成功—错误前沿。Figure 4 另测数学弃答。这些任务没有一个可跨任务引用的统一准确率增幅，本文不从曲线估读百分比。

## 我的判断

系统必须先定义可执行、可验证的 fallback：不执行、请求人工、回滚或保留草稿。特定奖励下的行为改善，不证明真实数据库或生产代码部署已经安全。

## 原图入口

[Figure 3，原论文 PDF 第 6 页](https://arxiv.org/pdf/2610.20401v1#page=6)。

## 论文来源

- [Training Language Models to Fail Gracefully](https://arxiv.org/abs/2610.20401v1) · 2610.20401v1。
- 版本公开日期：2026-10-14。
