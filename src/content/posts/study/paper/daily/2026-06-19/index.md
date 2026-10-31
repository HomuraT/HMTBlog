---
title: '论文日报 2026-06-19：语言目标与三维点运动预测'
published: 2026-06-19
updated: 2026-10-29
description: '语言目标与三维点运动预测，核对实验条件、历史版本及证据边界。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

## 重点阅读

[MolmoMotion: Forecasting Point Trajectories in 3D with Language Instruction](https://arxiv.org/abs/2606.18558v1) · v1 提交 2026-06-17 · [全文](https://arxiv.org/html/2606.18558v1) · [PDF](https://arxiv.org/pdf/2606.18558v1)

MolmoMotion 给定短暂视觉历史、目标物体的三维查询点和语言目标，预测世界坐标中的未来点轨迹。作者从 116 万条视频构造约百万条轨迹数据，以 4B Molmo2 为骨干训练自回归与流匹配版本；PointMotionBench 经人工核验，含 742 段、111 个物体类别和 61 种动作。

表 1 的 HOT3D 分组，三帧历史加文本的自回归模型平均位移误差 ADE 为 0.109 米，ObjectForesight 为 0.129 米；后者不接收语言指令，不能视为完全相同信息条件。WorldTrack 的三帧自回归 ADE 为 0.143 米；DAVIS 户外则单帧版本较佳，为 1.146 米。场景尺度和信息条件不同，不应合成一个提高百分比。

我更关注这个可检查的中间表示：先预测物体怎样动，再设计施力与控制。预训练每例只采 8 个查询点，密集轨迹需要多次前向；可变形对象与细致几何仍有不足。机器人规划和视频生成迁移收益，不等于闭环实体机器人成功率，作者也将后者列为后续工作。应把轨迹误差、时延与真实任务完成率分别测量。

**原图入口：**[Figure 6，PDF 第 8 页](https://arxiv.org/pdf/2606.18558v1#page=8)。

## 同期其他论文入口

- [Looped World Models](https://arxiv.org/abs/2606.18208v1) · 2606.18208v1，该版本提交 2026-06-16。
- [Variable-Width Transformers](https://arxiv.org/abs/2606.18246v1) · 2606.18246v1，该版本提交 2026-06-16。
- [Qwen-RobotManip Technical Report: Alignment Unlocks Scale for Robotic Manipulation Foundation Models](https://arxiv.org/abs/2606.17846v2) · 2606.17846v2，该版本提交 2026-06-17。
- [GameCraft-Bench: Can Agents Build Playable Games End-to-End in a Real Game Engine?](https://arxiv.org/abs/2606.17861v1) · 2606.17861v1，该版本提交 2026-06-16。
- [Learning from the Self-future: On-policy Self-distillation for dLLMs](https://arxiv.org/abs/2606.18195v1) · 2606.18195v1，该版本提交 2026-06-16。
- [Native Active Perception as Reasoning for Omni-Modal Understanding](https://arxiv.org/abs/2606.19341v1) · 2606.19341v1，该版本提交 2026-06-17。
