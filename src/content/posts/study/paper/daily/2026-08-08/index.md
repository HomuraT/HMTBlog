---
title: '论文日报 2026-08-08：本体互操作、模态协同与自蒸馏'
published: 2026-08-08
updated: 2026-10-31
description: '本期六项研究介绍本体对齐评测、多模态预训练、无标注自蒸馏、逐轮信用、全身动作模型与终端任务合成。'
image: ''
tags: [LLM, Agent, 自蒸馏, 训练数据]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本期六项研究介绍本体对齐评测、多模态预训练、无标注自蒸馏、逐轮信用、全身动作模型与终端任务合成。

## 1. DISO-OAEI：对齐系统的共识也需要人工检查

这项工作整理六十多个公开防务与国家安全相关本体，构造八项 OAEI 匹配任务。参考映射由多个系统家族的共识加上部分系统独有映射组成，再经人工审核形成 silver standard，避免只保留所有系统都会发现的简单对应。

Table 6 中，至少两个系统家族同意的映射，人工确认正确的比例在 JC3IEDM-Brick 为 67%、JC3IEDM-Facility 为 94%。投票不能直接代替真值；系统独有映射也可能正确。现阶段人工验证主要由作者完成，更广泛专家评审与标注者一致性分析仍待开展，参考集质量与覆盖率应持续更新。

[Improving Interoperability among Defence and National Security Ontologies: Analysis and Evaluation Tasks](https://arxiv.org/abs/2608.05867v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2608.05867v1#page=5)。

## 2. 多模态预训练的物理学：共享参数既能协同，也会竞争

研究用合成数据和真实数据分别改变任务复杂度、模态加入时间与 Transformer 参数共享方式，考察语言、视觉理解和生成之间的知识流。共享注意力与归一化、为不同模态保留独立 FFN，是缓解容量竞争的一条路线。

固定一千亿 token、语言和视觉各半的低复杂度受控实验中，完全共享参数相对单模态基线的文本 PPL 增加 0.272，分离 FFN 则降低 0.211；视觉扩散损失也从退化变为改善。这是特定合成分布上的消融，不是所有实际数据的通则。真实视觉分布可能损害语言困惑度，较早统一训练的收益也需连同配方与计算预算评估。

[Towards Physics of Multimodal Pretraining: Knowledge Flow, Modality Synergy, Early Unification, and Recipes](https://arxiv.org/abs/2608.05000v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2608.05000v1#page=6)。

## 3. u-OPSD

模型自蒸馏 · [On-Policy Self-Distillation without Any Supervision v1](https://arxiv.org/abs/2608.06296v1) · [全文](https://arxiv.org/html/2608.06296v1)

### 方法与原图

u-OPSD 从同一模型的多条回答中投票形成伪答案，再把以共识解答为条件的教师分布蒸馏给学生。训练仅使用 OpenThoughts 的 30,000 道题目子集，不读取金标准解答；模型仍依赖已有预训练能力。

![u-OPSD v1 Figure 2，多数票产生伪答案，教师条件分布在学生分歧轨迹上提供逐 token 蒸馏信号。](./images/uopsd-figure2.png)

*图 1｜Yijiang Li、Bingyang Wang、Yijun Liang、Yunjie Tian、Di Fu、Nuno Vasconcelos，[v1 Figure 2，PDF 第 4 页](https://arxiv.org/pdf/2608.06296v1#page=4)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

### 结果与评测口径

| 非思考模式，五项数学评测平均分 | 基础模型 | u-OPSD | 差值 |
|---|---:|---:|---:|
| Qwen3-4B | 40.96 | 49.49 | +8.53 个百分点 |
| Qwen3-8B | 43.57 | 54.31 | +10.74 个百分点 |

条件包括 LoRA rank 64、150 步训练，每 25 步评估并报告最佳检查点。AIME24、AIME25、HMMT25 使用 avg@12，MATH500、AMC23 使用 avg@4，表中不能解释为统一的单次作答通过率。[实验设置与 Table 1](https://arxiv.org/html/2608.06296v1#S4)。

共识也可能一致地出错。附录还报告，在 8 张 80GB 级 GPU 上，一次 u-OPSD 运行约 9 小时，监督 OPSD 约 3.5 小时；减少标注并不等于减少算力。

## 4. AgentOPSD：将教师差异积累为逐轮信用

AgentOPSD 将教师与学生的 token 对数概率差聚合为回合证据，在 log-odds 空间递归更新信念，再按相邻状态的变化分配信用。它不额外训练 critic 或增加 rollout，训练期技能提示提供的特权信息在推理时移除。

相同骨干、数据和预算下，Qwen2.5-7B 在 ALFWorld 的成功率为 89.1%，GRPO 为 81.2%；WebShop 成功率为 79.7%，虽高于 GRPO 的 72.6%，仍低于 SDAR 的 82.8%。Search-QA 的平均准确率又是另一指标。递归信用改善部分长程决策，但教师差异并非天然正确的因果贡献估计。

[AgentOPSD: Recursive Self-Distillation for Agentic Reinforcement Learning](https://arxiv.org/abs/2608.05987v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2608.05987v1#page=1)。

## 5. ω-0：在潜在空间共同预测全身动作与未来观察

ω-0 直接预测可交给全身控制器的动作潜变量，并以紧凑未来观察嵌入提供预测目标，不必先生成完整未来视频。控制器仿真重放将人类或公开运动先验对齐到机器人，全身移动、姿态调整与物体操作在同一策略中协调。

十一项真机家务任务、每方法每任务十次试验中，第一视角版本成功率为 79.1%，多视角版本为 81.8%，ψ-0 为 44.5%。另加 ω-HOME 预训练后分别是 80.4%、82.4%，属于另一组配置。每任务样本较少，成功率、四十一项子目标总分与失败前任务进度也不能混用；结果依赖特定机器人与控制器。

[$\omega$-0: A Latent Predictive World Action Model for Concurrent Humanoid Loco-Manipulation](https://arxiv.org/abs/2608.06375v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2608.06375v1#page=1)。

## 6. RST

终端任务合成 · [Recursive Synthesis for Long-Horizon Terminal Tasks v1](https://arxiv.org/abs/2608.05466v1) · [全文](https://arxiv.org/html/2608.05466v1)

RST 从验证过的种子任务出发，扩展参考解答，同步修改题意与验证器，并在新沙箱中检查后继续递归。15 轮生成 37,484 个任务，作者估算每题成本约 0.05 美元。

| Qwen3.5-27B，非思考模式 | 基础模型 | Agentic PPO 后 |
|---|---:|---:|
| Terminal-Bench 2 | 41.20 | 49.44 |
| Terminal-Bench Hard | 22.67 | 32.00 |
| LHTB | 18.10 | 22.07 |

[Table 4](https://arxiv.org/pdf/2608.05466v1#page=14) 为三次独立评测的均值；LHTB 使用平均部分得分。原文的 20.00%、41.16%、21.93% 是相对增幅，不能当成百分点。通过自建验证器只能说明通过了这些检查，外部基准与人工抽查仍然必要。
