---
title: '论文日报 2026-05-11：图谱层级、长程推理与生成轨迹'
published: 2026-05-11
updated: 2026-10-31
description: '本期八项研究把科学知识图谱、长程推理、测试时搜索、生成蒸馏与动作重定向放在一起，关注结构设计怎样影响信息保留和下游效果。'
image: ''
tags: [LLM, Agent, 知识图谱]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本期八项研究把科学知识图谱、长程推理、测试时搜索、生成蒸馏与动作重定向放在一起，关注结构设计怎样影响信息保留和下游效果。

## 1. Ontology-Compliant KG：让图内和跨图匹配共享语义约束

这项工作区分知识图谱内部与自身本体的一致，以及不同图谱之间的语义对应。方法先保留实际被图谱使用的本体部分，做多层术语匹配，再把匹配结果作为跨图嵌入的连接，并提出基于模式的一致性检查。

建筑领域案例中，逐步放宽匹配层级使图内匹配率从 46.15% 提到 92.31%，算法报告的置信分却从 100% 降到 78.33%。跨图示例的 DeepWalk top-1 搜索从 0.03% 到 25.86%，Struc2Vec 则原本已有 96.88%。这些局部结果说明匹配范围、置信规则和嵌入方法需要一起检查，置信分不能当作经过校准的真实正确率。

[Ontology-Compliant Knowledge Graphs](https://arxiv.org/abs/2603.21188v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2603.21188v1#page=2)。

## 2. HGNet：把科学实体的多词边界和层级关系一起建模

HGNet 的第一阶段 Z-NERD 用语义分解与多尺度注意力识别较长的科学实体；第二阶段按父子和同级关系传递信息，再用层级损失抑制环与捷径，用连续抽象轴组织不同概念层次。配套 SPHERE 基准覆盖计算机、物理、生物与材料领域。

在物理和生物训练、向计算机和材料迁移的零样本关系测试中，HGNet 的整体 Rel+ F1 为 62.60、70.62，HGERE 为 29.81、37.97。这里比较的是指定跨领域划分中的关系抽取，不能据此推断任意新学科的完整知识图谱质量；实体识别、关系判断和全图约束仍需分别验收。

[HGNet: Scalable Foundation Model for Automated Knowledge Graph Generation from Scientific Literature](https://arxiv.org/abs/2603.23136v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2603.23136v1#page=15)。

## 3. Flow-OPD

v1 首次提交 2026-05-08 · [Flow-OPD: On-Policy Distillation for Flow Matching Models](https://arxiv.org/abs/2605.08063v1) · [PDF](https://arxiv.org/pdf/2605.08063v1)

Flow-OPD 先以单一奖励训练专门教师，再在学生自己的采样轨迹上按任务路由教师监督，并用 Manifold Anchor Regularization 约束美感退化。

基于 Stable Diffusion 3.5 Medium，作者报告 GenEval 从 63 到 92，OCR 准确率从 59 到 94。组合目标的收益需按各自测试与量纲阅读；这不表示图像质量的所有维度都同幅改善，也不能将“超过教师”的特定结果推广到任意任务。

## 4. HumanNet

v1 首次提交 2026-05-07 · [HumanNet: Scaling Human-centric Video Learning to One Million Hours](https://arxiv.org/abs/2605.06747v1) · [PDF](https://arxiv.org/pdf/2605.06747v1)

HumanNet 提供一百万小时、包含第一和第三人称的人类活动视频资源，并组织动作、交互、身体相关标注。规模与实际验证用量应分开。

初步 VLA 对照只使用其中 1,000 小时第一人称视频继续训练 Qwen 视觉语言模型，在固定验证数据上胜过用 100 小时 Magic Cobot 机器人数据的条件。两种数据时长不等，这不是等数据或等算力下的一般替代关系；资源规模也不等于全部百万小时都已完成下游验证。

## 5. ScaleLogic

v1 首次提交 2026-05-07 · [Can RL Teach Long-Horizon Reasoning to LLMs? Expressiveness Is Key](https://arxiv.org/abs/2605.06638v1) · [PDF](https://arxiv.org/pdf/2605.06638v1)

ScaleLogic 独立控制证明深度与逻辑表达能力。主实验对非思考 Qwen3-4B 做 RL，每个配置独立训练，以 1,000 条留出验证题达到 90% Pass@1 所需步数衡量训练代价。

观察区间内，步数随深度近似满足幂律，指数由仅蕴含逻辑的 1.04 增至加入量化后的 2.60，各拟合 R² 大于 0.99。下游八基准采用 Avg@8，平均增益最高 10.66 个百分点。这是受控训练中的经验规律，不是所有真实推理问题的复杂度定理。原图可在论文 Figure 1 查看；本站未转载该图。

## 6. AutoTTS：在可回放环境里搜索推理预算分配

AutoTTS 把测试时扩展写成控制器：决定何时分支、继续推理、探测、剪枝或停止。搜索先使用已收集的推理轨迹与探针信号，低成本回放候选控制器，再根据细粒度执行反馈修正策略，避免每次提案都重新调用完整模型。

Qwen3-1.7B 在留出的 AIME25 与 HMMT25 上，β=0.5 的控制器平均准确率为 38.6%，总 token 指标为 343.5k；自适应自洽 ASC 为 34.3%、593.6k。但在 Qwen3-8B 上，同一 β 设置为 61.1%，低于 ASC 的 62.8%。因此应比较准确率—预算曲线，而不是把一个控制器配置称为所有模型的最佳方案。

[LLMs Improving LLMs: Agentic Discovery for Test-Time Scaling](https://arxiv.org/abs/2605.08083v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2605.08083v1#page=1)。

## 7. NTM：用条件归一化流表示较大的生成步长

Normalizing Trajectory Models 不再把每一步反向生成都近似成微小的高斯去噪，而用条件归一化流表示较大的转移。浅层可逆模块与跨轨迹的深预测器共同训练，既可从零开始，也能从已有 flow-matching 模型初始化；轨迹分数还可用来训练轻量去噪器。

四步文生图中，从零训练的 256×256 模型在 GenEval 为 0.82、DPG-Bench 为 79.64；微调的 512×512 模型分别为 0.76、83.38，两个配置各有所长。保留的是生成轨迹的精确似然，不能直接等同最终图像边缘分布的精确似然；步数、分辨率与训练来源也应一起比较。

[Normalizing Trajectory Models](https://arxiv.org/abs/2605.08078v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2605.08078v1#page=1)。

## 8. ReActor：让动作重定向与物理跟踪共同优化

ReActor 用双层优化同时调整人体到机器人动作的重定向参数，以及强化学习跟踪策略。上层通过近似梯度修正参考动作，下层在物理仿真中训练跟踪，只需稀疏的语义刚体对应，不必把不适合机器人形态的原动作强行保留下来。

在过滤后的 AMASS 数据上，Unitree G1 的下游跟踪成功率为 97.45%，OmniRetarget 为 95.51%；Lima 上为 95.07% 对 79.85%。评估从随机帧开始运行五秒，以不触发训练终止条件为成功，并有真实 Lima 与四足重定向展示。跨形态差距较大时仍需要更细的奖励设置，运动学误差小也不能单独保证实机可行。

[ReActor: Reinforcement Learning for Physics-Aware Motion Retargeting](https://arxiv.org/abs/2605.06593v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2605.06593v1#page=1)。
