---
title: '论文日报 2026-07-16：语义蒸馏、表格结构与故障验证'
published: 2026-07-16
updated: 2026-10-31
description: '本期六项研究介绍本体蒸馏、数据湖表格检索、光流动作表示、具身视觉语言模型、容器边界修复和工具故障测试。'
image: ''
tags: [LLM, 知识图谱, 论文笔记]
category: '论文或资源整理'
draft: false
lang: 'zh-CN'
---

本期六项研究介绍本体蒸馏、数据湖表格检索、光流动作表示、具身视觉语言模型、容器边界修复和工具故障测试。

## 1. 本体蒸馏：同计数结果与负结果审计

[Ontology-Amplified Distillation and Contextuality Auditing for Sovereign Enterprise Language Models: A Combined Proof-of-Mechanism and Negative-Results Method Study](https://arxiv.org/abs/2607.11948v1) · v1 提交 2026-07-11 · [全文](https://arxiv.org/html/2607.11948v1) · [PDF](https://arxiv.org/pdf/2607.11948v1)

本研究以 47 组英文合成偏好对，在单台 Apple M5 Max 上对 Qwen3.6-27B 进行本体相关 SFT 与 DPO，再测试 40 个保留的越南语金融领域任务。学生和 GPT-5 都在 36 题达到作者的 grounded 标准；该标准与本体术语覆盖有关，不是金融结论全面正确或合规审计。

两者通过题目并不完全一致：各有两题与对方不同。相同总数只能说明观察计数一致，不能证明统计等效、学生超过教师或部署安全。原文的配对区间百分比与任务数换算存在不一致，本篇不照抄精确区间宽度，保留样本不足以排除实质差距这一限定。图 1 展示各领域计数，也不能单凭柱高宣布等效。

另一项 contextuality 审计中，修正后的 canonical Contextuality-by-Default degree 在所测 Phase 1.3 各组为零；有用信号是直接影响与构念耦合，而非残余 contextuality。我的判断是，这是机制验证和负结果，适合为更有统计效力的后续研究提问题。仍需独立数据、真实任务和安全评估。

![2607.11948v1 Figure 1 原始截图](./images/ontology-distillation-figure1.png)

原文：Thanh Luong Tuan，arXiv:2607.11948v1，Figure 1 分领域 grounded 计数，PDF 第 8 页。[原始来源](https://arxiv.org/pdf/2607.11948v1#page=8) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。裁剪自原文。

## 2. GRAFT：按证据能否连接来检索数据湖表格

GRAFT 将查询意图图与含 join、union 关系的数据湖图匹配。IGMS 的 log-determinant 奖励共同衡量语义相关、结构兼容与证据多样性，再用自生成轨迹训练价值函数，引导候选子图搜索；可达性与谓词约束先削减搜索范围。

![GRAFT: Graph-Matched Retrieval and Fusion of Tables in Data Lakes Figure 2](./images/paper-260712717-figure2.png)

*图｜Ji, Daomin 等，[Figure 2（PDF 第 3 页）](https://arxiv.org/pdf/2607.12717v1#page=3)，[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

Spider 数据湖、十表预算下，检索 F1 为 0.668，JAR 为 0.624；充分性为 0.700 对 0.640。每查询 3.5 秒，JAR 为 22.4 秒，但独立稠密检索只需 0.4 秒。结构证据更完整需要额外开销；每套问答仅一百个查询，检索充分性也不是最终 SQL 或自然语言答案的正确率。

![GRAFT: Graph-Matched Retrieval and Fusion of Tables in Data Lakes Table 2](./images/paper-260712717-table2.png)

*图｜Ji, Daomin 等，[Table 2（PDF 第 10 页）](https://arxiv.org/pdf/2607.12717v1#page=10)，[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

[GRAFT: Graph-Matched Retrieval and Fusion of Tables in Data Lakes](https://arxiv.org/abs/2607.12717v1) · v1。

## 3. FlowWAM：用光流连接视频预测与动作解码

FlowWAM 以光流作为视频原生动作表示，将 RGB 和位移流放进共享预训练视频生成器的双流扩散框架。策略模式从预测光流解码关节动作，世界模型模式则用目标光流控制未来视频；没有动作标签的人类视频也可提取光流参与预训练。

RoboTwin 五十任务、每任务一百次 rollout 中，有预训练的 Clean/Random 成功率为 92.94%、92.14%，无该预训练为 82.40%、80.80%。WorldArena 的轨迹准确度为 64.26，对照 GigaWorld-1 为 54.27，但输入条件和预训练协议不同。光流改善运动接口，却仍依赖动作解码和视觉估计，不能把仿真高分当成任意实机的可靠控制。

[FlowWAM: Optical Flow as a Unified Action Representation for World Action Models](https://arxiv.org/abs/2607.13017v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2607.13017v1#page=2)。

## 4. Hy-Embodied-VLM：按行动相关能力组织训练

Hy-Embodied-VLM-1.0 将数据按行动状态理解、转移推理和连续适应三层组织，连接约 30B 总参数、3B 激活的语言骨干与视觉编码器。目标不止识别场景，还包括空间指向、轨迹、过程顺序与带历史的导航决策。

三十八项基准的平均分为 65.6，Qwen3.6-A3B 为 61.2，前代 MoT-2B 为 57.2，即分别高 4.4、8.4 个百分点。RGB-D 的 MP3D 零样本导航中，共享几何和记忆模块下成功率为 38.3%，Qwen3.6 为 36.1%。静态能力均分混合多种任务，导航也受外部空间模块支持，不能将均分直接理解为机器人任务成功率。

[Hy-Embodied-VLM-1.0: Efficient Physical-World Agents](https://arxiv.org/abs/2607.12894v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2607.12894v1#page=1)。

## 5. Bulkhead：把容器边界检查与实际使用绑定起来

Bulkhead 从已知容器路径漏洞提炼语义模式，定位跨主机—容器调用链，再结合语言模型分析和受控运行验证寻找缺失检查。修复先通过仓库编译，再以固定攻击者能力和安全不变量做模型检查，拒绝看似合法却仍允许检查后路径变化的补丁。

九项新发现中，八项完成运行验证，补丁均阻止对应 PoC 并保留测试覆盖的正常路径；另一项因上游函数已消失而无法重建。模型检查还发现三项历史修复过度禁止正常边界内符号链接。通过有限抽象和具体测试并不保证所有路径安全，防御验收需要同时看对象绑定、竞态边界和兼容性。

[Bulkhead: Automated Semantic Detection and Remediation of Container Escape Vulnerabilities](https://arxiv.org/abs/2607.12723v1) · v1。

[Figure 1（原文）](https://arxiv.org/pdf/2607.12723v1#page=6)。

## 6. AgentCheck：用同一故障比较修复前后的行为

AgentCheck 把 MCP 工具响应变成可控干预点，先记录正常运行，再重放并注入超时、旧数据、矛盾与工具污染等十二类故障。调用一致时沿用缓存，轨迹分叉后恢复真实工具；确定性通过检查与解释性模型标签分开报告。

![AgentCheck: A Reproduce-Intervene-Mitigate Workbench for LLM Agents over MCP Figure 1](./images/paper-260711098-figure1.png)

*图｜Mazumder, Aritra 等，[Figure 1（PDF 第 2 页）](https://arxiv.org/pdf/2607.11098v1#page=2)，[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

一百二十场景中，最强配置通过 105 项，最弱通过 77 项。重试可把最弱模型的超时处理从 3/10 提到 10/10，但旧数据仍约 3–4/10，说明恢复连接和识别错误信息需要不同修复。模型标签另用人工标注检验，故障传播标签可能过报，不能把其比例直接当作真实安全失效率。

![AgentCheck: A Reproduce-Intervene-Mitigate Workbench for LLM Agents over MCP Figure 3](./images/paper-260711098-figure3.png)

*图｜Mazumder, Aritra 等，[Figure 3（PDF 第 5 页）](https://arxiv.org/pdf/2607.11098v1#page=5)，[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)。裁剪自原文。*

[AgentCheck: A Reproduce-Intervene-Mitigate Workbench for LLM Agents over MCP](https://arxiv.org/abs/2607.11098v1) · v1。
