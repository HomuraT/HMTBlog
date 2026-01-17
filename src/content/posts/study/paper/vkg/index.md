---
title: VKG资料收集
published: 2026-01-17
description: ''
image: ''
tags: [VKG]
category: '论文或资源整理'
draft: false 
lang: ''
---

# VKG 基础

- [2024] Xiao, G. (2024). <a href="/papers/vkg/Xiao - Introduction to Virtual Knowledge Graphs.pdf"><i>1. Introduction to Virtual Knowledge Graphs</i></a>. University of Bergen, Norway.
- [2024] Xiao, G. (2024). <a href="/papers/vkg/Xiao - Virtual Knowledge Graphs Query Processing.pdf"><i>2. Virtual Knowledge Graphs Query Processing</i></a>. University of Bergen, Norway.
- [2019] Xiao, G., Ding, L., Cogrel, B., & Calvanese, D. (2019). <a href="https://direct.mit.edu/dint/article-pdf/1/3/201/683759/dint_a_00011.pdf"><i>Virtual knowledge graphs: An overview of systems and use cases</i></a>. Data Intelligence, 1(3), 201-223.

# VKG 构造 (VKG Generation / Mapping Generation)
- [2017] Pinkel, C., Binnig, C., Jimenez-Ruiz, E., Kharlamov, E., May, W., Nikolov, A., ... & Horrocks, I. (2017). <a href="http://www.semantic-web-journal.net/system/files/swj1439.pdf"><i>RODI: Benchmarking Relational-to-Ontology Mapping Generation Quality</i></a>. Semantic Web Journal. IOS Press.
RODI 是一个关系到本体映射生成质量的基准测试，包含科学会议、地理数据和油气勘探等领域的测试场景，通过评估系统处理关系模式和本体特性的能力以及映射在查询回答中的表现，对七个映射生成系统进行了综合评估。
- [2025] Xiao, G., Ren, L., Qi, G., Xue, H., Panfilo, M. D., & Lanti, D. (2025, August). <a href="https://www.ijcai.org/proceedings/2025/0525.pdf"><i>LLM4VKG: Leveraging large language models for virtual knowledge graph construction</i></a>. In Proceedings of the 34th International Joint Conference on Artificial Intelligence (IJCAI).
LLM4VKG 利用大语言模型自动化 VKG 构建过程，包括本体开发、模式分析和映射创建，有效解决命名歧义和匹配问题。


# VKG 应用
- [2015] Lanti, D., Rezk, M. I., Xiao, G., & Calvanese, D. (2015). <a href="https://bia.unibz.it/esploro/fulltext/conferenceProceeding/The-NPD-benchmark-Reality-check-for/991005773114601241?repId=12235330170001241&mId=13235268350001241&institution=39UBZ_INST"><i>The NPD benchmark: Reality check for OBDA systems</i></a>. In Advances in database technology-EDBT 2015: 18th International Conference on Extending Database Technology, Brussels, Belgium, March 23-27, 2015, proceedings (pp. 617-628). University of Konstanz, University Library.
NPD 基准测试基于挪威石油管理局（NPD）的真实石油工业数据，专门针对 OBDA 系统的性能评估需求设计，提供可扩展的数据集生成技术，用于验证 OBDA 系统在工业环境中的实际表现。
- [2016] Brüggemann, S., Bereta, K., Xiao, G., & Koubarakis, M. (2016, May). <a href="https://pdfs.semanticscholar.org/4940/66c67a23d04661825e68f249b9038725d518.pdf"><i>Ontology-based data access for maritime security</i></a>. In European Semantic Web Conference (pp. 741-757). Cham: Springer International Publishing.
VKG 在海事安全领域的应用，通过本体数据访问技术整合实时和静态船舶数据，用于异常行为检测和可疑船只追踪。
- [2016] Calvanese, D., Liuzzo, P., Mosca, A., Remesal, J., Rezk, M., & Rull, G. (2016). <a href="https://www.researchgate.net/profile/Alessandro-Mosca/publication/295844702_Ontology-based_data_integration_in_EPNet_Production_and_distribution_of_food_during_the_Roman_Empire/links/60675063a6fdccad3f69775d/Ontology-based-data-integration-in-EPNet-Production-and-distribution-of-food-during-the-Roman-Empire.pdf"><i>Ontology-based data integration in EPNet: Production and distribution of food during the Roman Empire</i></a>. Engineering Applications of Artificial Intelligence, 51, 212-229.
VKG 在历史研究领域的应用，通过本体数据访问技术整合罗马帝国时期食品生产和商业贸易的分散数据源，为学者提供统一的概念视图和访问入口。
- [2017] Kharlamov, E., Hovland, D., Skjæveland, M. G., Bilidas, D., Jiménez-Ruiz, E., Xiao, G., ... & Waaler, A. (2017). <a href="https://ora.ox.ac.uk/objects/uuid:c077fe8d-7517-4a4c-b6a1-a87f517f91d6/files/mb397af762843355a7db3173cd2bc61b5"><i>Ontology based data access in Statoil</i></a>. Journal of Web Semantics, 44, 3-36.
VKG 在石油工业的应用，在挪威国家石油公司（Statoil）部署 OBDA 系统，通过半自动生成本体和映射、优化查询处理以及为工程师提供友好的查询构建界面，解决数据密集型企业的数据访问挑战。
- [2017] Kharlamov, E., Mailis, T., Mehdi, G., Neuenstadt, C., Özçep, Ö., Roshchin, M., ... & Waaler, A. (2017). <a href="https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=3199299"><i>Semantic access to streaming and static data at Siemens</i></a>. Journal of Web Semantics, 44, 54-74.
VKG 在西门子能源的应用，通过 Optique 平台实现对流式和静态数据的统一语义访问，包括本体和映射自动生成（BootOX）、流式查询语言（STARQL）、高性能后端（ExaStream）以及可视化查询构建界面（OptiqueVQS）。
- [2018] Güzel Kalayci, E., Xiao, G., Ryzhikov, V., Kalayci, T. E., & Calvanese, D. (2018, October). <a href="https://dl.acm.org/doi/pdf/10.1145/3269206.3269230"><i>Ontop-temporal: a tool for ontology-based query answering over temporal data</i></a>. In Proceedings of the 27th ACM International Conference on Information and Knowledge Management (pp. 1927-1930).
VKG 在医疗时序数据中的应用，Ontop-temporal 扩展支持时间戳日志数据查询，通过有效时间映射和基于度量时态逻辑的规则，应用于 MIMIC-III 重症监护数据集，用于临床试验患者筛选。
- [2019] Kharlamov, E., Mehdi, G., Savković, O., Xiao, G., Kalaycı, E. G., & Roshchin, M. (2019). <a href="https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=3281719"><i>Semantically-enhanced rule-based diagnostics for industrial Internet of Things: The SDRL language and case study for Siemens trains and turbines</i></a>. Journal of web semantics, 56, 11-29.
VKG 在工业物联网诊断中的应用，提出语义诊断规则语言（SDRL），通过本体中介传感器信号和诊断规则，简化规则编写和维护，应用于西门子列车和涡轮机的故障诊断。 
- [2020] Chaves-Fraga, D., Priyatna, F., Cimmino, A., Toledo, J., Ruckhaus, E., & Corcho, O. (2020). <a href="https://www.sciencedirect.com/science/article/pii/S1570826820300354"><i>GTFS-Madrid-Bench: A benchmark for virtual knowledge graph access in the transport domain</i></a>. Journal of Web Semantics, 65, 100596.
GTFS-Madrid-Bench 是一个 VKG 访问引擎的综合基准测试，基于马德里地铁 GTFS 数据，涵盖多种数据格式（CSV、JSON、SQL、XML）和 SPARQL 1.1 查询特性，用于评估不同 OBDI 引擎的查询能力、性能和可扩展性。
- [2020] Kalaycı, E. G., Grangel González, I., Lösch, F., Xiao, G., ul-Mehdi, A., Kharlamov, E., & Calvanese, D. (2020, November). <a href="http://www.ghxiao.org/publications/2020-iswc-bosch.pdf"><i>Semantic integration of Bosch manufacturing data using virtual knowledge graphs</i></a>. In International Semantic Web Conference (pp. 464-481). Cham: Springer International Publishing.
VKG 在博世制造业的应用，通过 SIB 框架语义集成表面贴装工艺（SMT）流水线的异构机器数据，开发 SMT 本体和映射，支持产品质量分析任务的 SPARQL 查询。
- [2021] Calvanese, D., Lanti, D., De Farias, T. M., Mosca, A., & Xiao, G. (2021). <a href="https://www.sciencedirect.com/science/article/pii/S2666389921002014"><i>Accessing scientific data through knowledge graphs with Ontop</i></a>. Patterns, 2(10).
VKG 在科学数据访问中的应用教程，展示如何使用 Ontop 系统通过本体提供的概念视图访问关系数据库中的遗留数据，并整合来自不同异构生物医学资源的领域知识，使用户无需了解底层存储细节即可获得更丰富的查询结果。
- [2022] Xiao, G., Pfaff, E., Prud'hommeaux, E., Booth, D., Sharma, D. K., Huo, N., ... & Jiang, G. (2022). <a href="https://www.sciencedirect.com/science/article/pii/S1532046422002064"><i>FHIR-Ontop-OMOP: Building clinical knowledge graphs in FHIR RDF with the OMOP Common data Model</i></a>. Journal of biomedical informatics, 134, 104201.
VKG 在临床数据标准化中的应用，FHIR-Ontop-OMOP 系统将基于 OMOP CDM 的关系数据库暴露为符合 FHIR RDF 规范的虚拟临床知识图谱，实现 FHIR 与 OMOP CDM 的互操作性，为可解释的医疗 AI 应用提供语义基础。
- [2022] Xiong, J., Xiao, G., Kalayci, T. E., Montali, M., Gu, Z., & Calvanese, D. (2022, October). <a href="https://link.springer.com/content/pdf/10.1007/978-3-031-27815-0_34.pdf"><i>A virtual knowledge graph based approach for object-centric event logs extraction</i></a>. In International Conference on Process Mining (pp. 466-478). Cham: Springer Nature Switzerland.
VKG 在流程挖掘中的应用，通过 OnProm 系统利用 VKG 方法从关系数据库中提取对象中心事件日志（OCEL），解决传统 XES 格式的收敛和发散问题，支持一个事件关联多个对象，实现可扩展的 OCEL 日志提取。
- [2025] Ding, L., Xiao, G., Pano, A., Fumagalli, M., Chen, D., Feng, Y., ... & Meng, L. (2025). <a href="https://www.tandfonline.com/doi/pdf/10.1080/10095020.2024.2337360"><i>Integrating 3D city data through knowledge graphs</i></a>. Geo-Spatial Information Science, 28(2), 780-799.
VKG 在 3D 城市数据集成中的应用，通过 CityGML-KG 框架将 3DCityDB 中的 CityGML 数据暴露为知识图谱，弥合 CityGML 语义与关系数据库模式的差距，并支持与 OpenStreetMap 等其他空间数据源的集成查询。
- [2025] Xiao, G., Sathalingam, D., Pano, A., Feng, Y., & Ding, L. (2025). <a href="https://www.tandfonline.com/doi/pdf/10.1080/17538947.2025.2528703"><i>ATKIS-DLM-KG: a unified knowledge graph framework for integrating and querying fragmented topographic-cartographic data in the German digital landscape model</i></a>. International Journal of Digital Earth, 18(1), 2528703.
VKG 在德国地形数据集成中的应用，通过 ATKIS-DLM-KG 框架将 ATKIS 数字景观模型（DLM）中按主题和几何类型分散的 Shapefile 数据集成为统一的知识图谱，支持跨主题的语义查询和关联分析。

# VKG 公开资源

::github{repo="ontop/ontop"}
:::note
最先进的VKG系统Ontop，官网为[https://ontop-vkg.org/](https://ontop-vkg.org/)
:::