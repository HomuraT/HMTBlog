---
title: LLM Agent资料收集
published: 2026-01-21
description: ''
image: ''
tags: [LLM, Agent]
category: '论文或资源整理'
draft: false 
lang: ''
---

# Agent 综述
- [2025] Huang, Y., Li, S., Liu, M., Liu, W., Huang, S., Fan, Z., ... & Fung, Y. R. (2025). <a href="https://arxiv.org/pdf/2511.09586"><i>Environment Scaling for Interactive Agentic Experience Collection: A Survey</i></a>. arXiv preprint arXiv:2511.09586.
本文从以环境为中心的视角综述了智能体通过与环境交互进行强化学习的方法，提出了生成-执行-反馈(GEF)循环框架，系统回顾了环境扩展在任务生成、执行和反馈各阶段的代表性方法。
- [2025] Cemri, M., Pan, M. Z., Yang, S., Agrawal, L. A., Chopra, B., Tiwari, R., ... & Stoica, I. (2025). <a href="https://arxiv.org/pdf/2503.13657"><i>Why do multi-agent llm systems fail?</i></a>. arXiv preprint arXiv:2503.13657. [<a href="https://github.com/multi-agent-systems-failure-taxonomy/MAST/tree/main">Dataset</a>]
本文通过构建包含 1600+ 标注轨迹的 MAST-Data 数据集和首个多智能体系统失败分类法(MAST)，系统分析了多智能体 LLM 系统的失败模式，识别出 14 种失败类型（分为系统设计、智能体间失配、任务验证三类），并为未来 MAS 研究提供了明确路线图。
- [2025]Gao, H. A., Geng, J., Hua, W., Hu, M., Juan, X., Liu, H., ... & Wang, M. (2025). <a href="https://openreview.net/pdf?id=CTr3bovS5F"><i>A Survey of Self-Evolving Agents: On Path to Artificial Super Intelligence</i></a>. Transactions on Machine Learning Research (TMLR). [<a href="https://github.com/CharlesQ9/Self-Evolving-Agents">Code</a>]
本文对自我进化智能体（Self-Evolving Agents）进行了系统全面的综述，围绕“进化什么、何时进化、如何进化”三个核心维度构建了研究框架。文章系统回顾了智能体各组件（模型、记忆、工具、架构）的进化机制，按阶段分类了适配方法，并探讨了通往人工超智能（ASI）的自主进化路径。

# Memory Bank相关
- [2025] Ouyang, S., Yan, J., Hsu, I., Chen, Y., Jiang, K., Wang, Z., ... & Pfister, T. (2025). <a href="https://arxiv.org/pdf/2509.25140"><i>Reasoningbank: Scaling agent self-evolving with reasoning memory</i></a>. arXiv preprint arXiv:2509.25140.
本文提出 ReasoningBank 记忆框架，从智能体的成功和失败经验中提炼可泛化的推理策略，并引入记忆感知测试时扩展(MaTTS)方法，通过为每个任务分配更多计算资源生成丰富对比信号来合成高质量记忆，实现智能体的自我进化。
- [2025] Cai, Y., Cai, S., Shi, Y., Xu, Z., Chen, L., Qin, Y., ... & Sun, X. (2025). <a href="https://arxiv.org/pdf/2510.08191"><i>Training-free group relative policy optimization</i></a>. arXiv preprint arXiv:2510.08191. [<a href="https://github.com/TencentCloudADP/youtu-agent/tree/training_free_GRPO">Code</a>]
本文提出无训练的组相对策略优化(Training-Free GRPO)方法，通过将经验知识作为 token 先验学习而非参数更新，在数十个训练样本下即可显著提升 LLM 智能体在数学推理和网络搜索等任务的域外性能。
- [2025] Zhou, H., Chen, Y., Guo, S., Yan, X., Lee, K. H., Wang, Z., ... & Wang, J. (2025). <a href="https://arxiv.org/pdf/2508.16153"><i>Memento: Fine-tuning llm agents without fine-tuning llms</i></a>. arXiv preprint arXiv:2508.16153. [<a href="https://github.com/Agent-on-the-Fly/Memento">Code</a>]
本文提出 Memento 框架，通过引入记忆增强的马尔可夫决策过程 (M-MDP) 和案例选择策略，实现了无需微调底层大语言模型即可进行在线强化学习和持续自适应。通过在情境记忆中存储和重写过去经验，Memento 在 GAIA 和 DeepResearcher 等深度研究基准测试中表现出色，在保持低成本的同时显著提升了智能体的域外泛化能力。