---
title: "虚拟知识图谱（VKG）入门"
published: 2026-09-04
description: "虚拟知识图谱的基本思路、本体与映射的三层结构、SPARQL 到 SQL 的查询处理流程，以及用 Ontop 部署第一个 SPARQL endpoint。"
image: ""
tags: ["VKG", "知识图谱"]
category: "学习记录"
draft: false
lang: "zh-CN"
---

## 问题背景

一个组织的数据很少集中在单个数据库里。若干数据集各自独立产生，分散在不同的数据源中，由不同的人或不同的组织维护。

**数据集成**（Data Integration）研究的是如何用统一的方式访问这些数据源，主要困难来自**异构性**（heterogeneity）。

### 异构性的四种形态

- **数据模型异构**（data model heterogeneity）：关系表、图、XML、JSON、CSV、纯文本，各用一套模型
- **系统异构**（system heterogeneity）：即使采用同一种数据模型，不同系统之间也不完全兼容
- **schema 异构**（schema heterogeneity）：同一件事，不同的人看法不同，设计出来的 schema 也不同
- **数据层异构**（data-level heterogeneity）：同一个实体在不同源里写法不同，比如 IBM、Int. Business Machines、International Business Machines

前两种可以靠连接器和适配器处理，属于工程问题。后两种是语义层面的分歧，工具无法自行判断两个字段是否指同一件事，需要人给出对应关系。

四种形态里 schema 异构出现得最多，它又可以细分成三类差异：表和属性的命名、表和属性的组织方式、schema 覆盖的范围和粒度。

计算机学院和数学学院各自建了人员库，三类差异同时出现：

<style>
.hg { margin: 1.75rem 0; font-size: .875rem; line-height: 1.6; }
.hg-panel { padding: 1.3rem 1rem; border-radius: var(--radius-large); background: var(--license-block-bg); }
.hg-mono { font-family: 'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.hg-q { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; padding: .7rem 1rem; border-radius: .75rem; background: var(--btn-regular-bg); font-weight: 500; }
.hg-q b { flex: none; padding: .12rem .5rem; border-radius: .4rem; background: var(--primary); color: var(--card-bg); font-size: .75rem; font-weight: 600; }
.hg-down { padding: .3rem 0; color: var(--primary); text-align: center; font-size: 1.15rem; line-height: 1; }
.hg-srcs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.hg-src { border: 1px solid var(--line-divider); border-radius: .75rem; overflow: hidden; background: var(--card-bg); }
.hg-src > div:first-child { padding: .4rem .85rem; background: var(--btn-plain-bg-hover); font-weight: 600; }
.hg-src > pre { margin: 0; padding: .7rem .85rem; background: none; font-size: .76rem; line-height: 1.9; white-space: pre-wrap; word-break: break-word; }
.hg-src em { font-style: normal; font-weight: 600; color: var(--primary); }
.hg-diffs { margin-top: 1rem; border: 1px solid var(--line-divider); border-radius: .75rem; overflow: hidden; background: var(--card-bg); }
.hg-row { display: grid; grid-template-columns: minmax(7rem, 1.05fr) 1fr auto 1fr; align-items: center; gap: .5rem; padding: .6rem .85rem; }
.hg-row + .hg-row { border-top: 1px solid var(--line-divider); }
.hg-row > span:first-child { font-weight: 500; }
.hg-row code { padding: .12rem .4rem; border-radius: .3rem; background: var(--inline-code-bg); color: var(--inline-code-color); font-size: .78rem; }
.hg-ne { color: var(--admonitions-color-caution); font-weight: 700; text-align: center; }
.hg-foot { margin-top: 1rem; padding: .1rem 0 .1rem .85rem; border-left: 3px solid var(--primary); }
@media (max-width: 640px) {
  .hg-srcs { grid-template-columns: 1fr; }
  .hg-row { grid-template-columns: 1fr auto 1fr; gap: .35rem .5rem; }
  .hg-row > span:first-child { grid-column: 1 / -1; }
}
</style>
<div class="not-prose hg"><div class="hg-panel"><div class="hg-q"><b>全校范围</b><span>每位教师各带了哪些学生？</span></div><div class="hg-down">↓</div><div class="hg-srcs"><div class="hg-src"><div>计算机学院</div><pre class="hg-mono">person(p_id, name, <em>role</em>)
supervision(<em>student_id</em>, <em>advisor_id</em>)</pre></div><div class="hg-src"><div>数学学院</div><pre class="hg-mono">staff(sid, fullname, <em>title</em>)
student(sid, name, <em>advisor_sid</em>)</pre></div></div><div class="hg-diffs"><div class="hg-row"><span>命名</span><span>表名 <code>person</code></span><span class="hg-ne">≠</span><span>表名 <code>staff</code></span></div><div class="hg-row"><span>组织方式</span><span>师生关系是独立的 <code>supervision</code> 表</span><span class="hg-ne">≠</span><span>师生关系是 <code>student</code> 上的外键列</span></div><div class="hg-row"><span>范围与粒度</span><span><code>person</code> 含教师和学生，职称用整数 <code>role</code></span><span class="hg-ne">≠</span><span><code>staff</code> 只含教师，职称用字符串 <code>title</code></span></div></div></div><div class="hg-foot">回答这个查询需要同时访问两个库，上面三类差异都要先给出对应关系。每接入一个新学院，对应关系要重新写一遍。</div></div>

VKG 的做法是把这份对应关系从查询里抽出来，写成一份独立的映射：先在所有数据源之上定义一层统一的概念描述，再由映射逐条声明每个源的哪张表、哪个列对应哪个概念。查询只针对概念层书写，系统按映射把它翻译成各个库上的 SQL。新增一个学院时补一份该学院的映射，已有的查询不用改。

整体结构是三层：

<style>
.va { margin: 1.75rem 0; font-size: .875rem; line-height: 1.6; }
.va-panel { padding: 1.3rem 1rem; border-radius: var(--radius-large); background: var(--license-block-bg); }
.va-io { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; width: fit-content; max-width: 100%; margin: 0 auto .6rem; }
.va-io > div { display: flex; align-items: center; justify-content: center; gap: .45rem; padding: .4rem .9rem; border-radius: .6rem; background: var(--btn-regular-bg); font-weight: 500; }
.va-ar { flex: none; color: var(--primary); font-size: 1.1rem; font-weight: 700; line-height: 1; }
.va-box { width: fit-content; max-width: 100%; margin: 0 auto; padding: .7rem 1.4rem; border: 1px solid var(--line-divider); border-radius: .75rem; background: var(--card-bg); text-align: center; }
.va-box-top { border-color: var(--primary); }
.va-t { display: flex; align-items: baseline; justify-content: center; gap: .5rem; flex-wrap: wrap; font-weight: 600; }
.va-t small { font-weight: 500; font-size: .78rem; opacity: .7; }
.va-map { display: flex; align-items: center; justify-content: center; gap: .5rem; flex-wrap: wrap; padding: .55rem .5rem; text-align: center; }
.va-map b { font-weight: 600; }
.va-map small { font-size: .78rem; opacity: .7; }
.va-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: .35rem; margin-top: .5rem; }
.va-chips span { padding: .14rem .5rem; border-radius: .35rem; background: var(--inline-code-bg); color: var(--inline-code-color); font-size: .76rem; }
.va-foot { margin-top: 1rem; padding: .1rem 0 .1rem .85rem; border-left: 3px solid var(--primary); }
@media (max-width: 640px) {
  .va-io { grid-template-columns: 1fr; }
  .va-box { padding: .7rem 1rem; }
}
</style>
<div class="not-prose va"><div class="va-panel"><div class="va-io"><div><span>SPARQL 查询</span><span class="va-ar">↓</span></div><div><span class="va-ar">↑</span><span>查询结果</span></div></div><div class="va-box va-box-top"><div class="va-t">本体<small>Ontology · OWL 2 QL / RDFS</small></div></div><div class="va-map"><span class="va-ar">↕</span><b>映射</b><small>Mapping · .obda / R2RML</small></div><div class="va-box"><div class="va-t">数据源<small>Data Sources</small></div><div class="va-chips"><span>PostgreSQL</span><span>MySQL</span><span>Oracle</span><span>Trino</span><span>CSV</span><span>JSON</span><span>Excel</span></div></div></div><div class="va-foot">三层之间没有一份物化的 RDF 数据，查询在运行时翻译成 SQL，在源库上执行。</div></div>

### 工业界的同一思路：Palantir Ontology

在工业界，Palantir 的产品架构建立在 **Ontology** 这一层之上：把组织里的实体定义成对象类型（Object Type）、属性和链接类型（Link Type），再把这些定义映射到底层已经接入的数据集。分析师面对的是「航班」「机场」「延误」这些对象和它们之间的关系，而不是某个库里的某张表。

这套设计在早期的 Gotham 平台里称为**动态本体**（dynamic ontology）。「动态」指本体可以随业务演化被重新定义和扩展，不必重做底层的数据管道。

Palantir 把这套结构做成了商业产品并部署在大规模异构数据上。区别在于 Palantir 的模型是专有的，VKG 用的是 RDF、SPARQL、OWL 这套 W3C 标准，本体带有明确的逻辑语义。

Gotham 的动态本体有公开的学术分析（[IEEE 2024](https://ieeexplore.ieee.org/document/10808897/) 的系统分析、[The Information Society 2022](https://www.tandfonline.com/doi/full/10.1080/01972243.2022.2100851) 的批判性综述），Foundry 的 Ontology 有[官方文档](https://www.palantir.com/docs/foundry/ontology/overview)。开源领域也有沿用同一架构的尝试，例如 [Semantica](https://github.com/semantica-agi/semantica)，把对象、关系、决策和溯源统一放进一张图里供智能体使用。

### 数据库与商业智能领域的对应问题

给定一个目标 schema 和一批新数据，如何把数据转换进目标里，这个问题在数据库领域称为 **schema mapping**，配套的两个子问题是 **schema matching**（找出源和目标元素之间的语义对应）和 **data exchange**（构造能真正填充目标实例的映射）。

Rahm 和 Bernstein 2001 年的[综述](https://doi.org/10.1007/s007780100057)给出了 matcher 的经典分类，即 schema 级还是实例级、元素级还是结构级。系统性的映射生成算法由 IBM 的 Clio 项目开创，[EDBT 2011 的这份 tutorial](https://openproceedings.org/2011/conf/edbt/BonifatiV11.pdf) 对这批算法有完整梳理，适合作为入口。

这一类工作现在更常见的统称是**数据准备**（data preparation），也写作 data wrangling，范围比 schema mapping 大，schema 对齐之外还包括格式转换、清洗和实体消解。Hameed 和 Naumann 的[商用工具综述](https://doi.org/10.1145/3444831.3444835)（SIGMOD Record 2020）梳理了这类工具的能力和缺口。

自动化数据准备是近几年的活跃方向。Stanford 的 [Wrangler](https://doi.org/10.1145/1978942.1979444)（CHI 2011）走交互路线，系统给出转换建议、由人确认，后来商业化为 Trifacta，2022 年被 Alteryx 收购；微软的 [Auto-Suggest](https://doi.org/10.1145/3318464.3389738)（SIGMOD 2020）走学习路线，从大量数据科学 notebook 里学习下一步该做的转换。用大模型做数据准备的工作近两年明显增多，[Can Foundation Models Wrangle Your Data?](https://www.vldb.org/pvldb/vol16/p738-narayan.pdf)（VLDB 2023）把清洗和集成的五类任务改写成 prompt，用 LLM 做 schema matching 和 entity matching 现在是常见设定，[2025 年的一篇综述](https://arxiv.org/abs/2508.01556)整理了用语言模型做表格数据准备的现状。

VKG 的映射生成是 schema mapping 的一个特例：源仍然是关系库，目标 schema 换成本体的类和属性，术语是 relational-to-ontology mapping generation。[VKG资料收集](/posts/study/paper/vkg/)里的 RODI benchmark 专门评这项任务，组里的 LLM4VKG 把 LLM 做 schema matching 的思路搬到了这个设定上。

商业智能（Business Intelligence，BI）指用报表、看板和多维分析支持业务决策的那一类系统。这个领域的对应物是**语义层**（[semantic layer](https://en.wikipedia.org/wiki/Semantic_layer)）。这个词和这套做法都来自 Business Objects，1991 年的专利名为 "relational database access system using semantically dynamic objects"，产品中的实现称为 Universe，作用是让业务人员用业务词汇取数，不必知道表名和字段名。专利名里的 "semantically dynamic objects" 和 Palantir 的 dynamic ontology 用词几乎重合。

语义层现在的主流实现是 Looker 的 LookML、dbt Semantic Layer、Cube、AtScale，以及 Databricks metric views、Snowflake semantic views 这类仓库自带的方案。最近语义层重新受到关注，原因是要给大模型提供一份一致的指标定义。

## VKG 的三个设计决策

处理异构性的通行框架是引入一个**全局 schema**（global schema），把各个数据源映射到它上面，使用者只面对全局 schema。这个框架来自数据集成领域，VKG 的特点在于框架内的三个具体选择。

三者之间存在依赖：决策三要求查询在运行时翻译，翻译的前提是映射机器可读，也就是决策一。

Ontop 官方文档的表述：

> Ontop is a Virtual Knowledge Graph system. It exposes the content of arbitrary relational databases as knowledge graphs. These graphs are virtual, which means that data remains in the data sources instead of being moved to another database.

### 决策一：声明式映射

传统数据集成用 mediator，即为每个数据源手写一段转换代码。声明式映射的优势：

- 映射是一份规范说明，阅读时不必跟随控制流
- 设计和维护的成本因此更低
- 支持增量集成，接入新数据源只需追加一组映射，已有映射不受影响
- 格式机器可读，可以参与查询优化

最后一条的影响最大。手写的转换代码对系统是黑盒，只能整体执行。声明式映射可以被系统解析，与用户查询合并后统一重写和优化，具体过程见[语义查询优化](#语义查询优化)。

### 决策二：知识图谱与本体

传统数据集成的全局 schema 是一个关系模式。VKG 把全局 schema 的数据模型换成知识图谱，图中使用的词汇由**本体**给出。换用知识图谱的理由：

- 不需要在一开始就锁定一种结构
- 更能容纳异构性
- 更能处理缺失和不完整的信息
- 加入新信息或新数据源时不需要大规模重构

第三条对应 schema 异构里的「范围与粒度」差异。关系模式要求每张表的列固定，某个源缺某个属性时需要填 NULL 或者拆表。RDF 由三元组构成，属性存在时写入对应三元组，不存在时省略，结构本身不用改。

本体承担的是 schema 的角色，类、属性、类层次都在本体里声明。它同时是一套带标准形式语义的逻辑声明，推理能力由此直接可用，不需要在应用层实现，[查询处理流程](#查询处理流程)一节给出两个例子。

### 决策三：虚拟访问

物化式的数据集成用 ETL，把数据从各个源抽取、转换、装载进一个集成存储，可能是数据仓库，也可能是一份物化的 KG。保持虚拟的理由：

- 数据留在源里，只在查询时访问
- 不需要构造和维护一份可能很大、代价很高的物化副本
- 数据因此始终与源里的最新状态一致
- 可以继续依赖已有的数据基础设施和运维经验
- 同样适合增量集成

第四条在实际项目里尤其重要，源库上多年积累的索引、分区、权限配置和调优经验都能直接复用，不必在新系统里重建一遍。另有一类场合完全排除了物化：医院的数据库不允许拷贝、企业的生产库不允许导出、合作方的数据仅开放读权限。

三个决策的代价集中在两处：映射和本体都需要人工设计，本体的表达能力还有硬性上限，后者的具体边界见[本体的表达能力限制](#本体的表达能力限制)。

## 应用现状

VKG 已经有相当多的工业部署，按领域分列如下：

- 石油勘探：Statoil（挪威国家石油）的部署（[JWS 2017](https://ora.ox.ac.uk/objects/uuid:c077fe8d-7517-4a4c-b6a1-a87f517f91d6/files/mb397af762843355a7db3173cd2bc61b5)），以及基于挪威石油管理局真实数据的 [NPD benchmark](https://bia.unibz.it/esploro/fulltext/conferenceProceeding/The-NPD-benchmark-Reality-check-for/991005773114601241?repId=12235330170001241&mId=13235268350001241&institution=39UBZ_INST)（EDBT 2015）
- 工业设备诊断：Siemens 的[流式与静态数据统一访问](https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=3199299)（JWS 2017）和[涡轮机与列车故障诊断](https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=3281719)（JWS 2019）
- 制造业：Bosch 表面贴装产线的[异构机器数据整合](http://www.ghxiao.org/publications/2020-iswc-bosch.pdf)（ISWC 2020）
- 医疗：[FHIR-Ontop-OMOP](https://www.sciencedirect.com/science/article/pii/S1532046422002064)（JBI 2022）把 OMOP 通用数据模型的关系库暴露成符合 FHIR RDF 规范的临床知识图谱；[Ontop-temporal](https://dl.acm.org/doi/pdf/10.1145/3269206.3269230)（CIKM 2018）用于 MIMIC-III 上的临床试验患者筛选
- 地理空间：[3D 城市数据](https://www.tandfonline.com/doi/pdf/10.1080/10095020.2024.2337360)（GSIS 2025）、[德国地形数据 ATKIS-DLM-KG](https://www.tandfonline.com/doi/pdf/10.1080/17538947.2025.2528703)（IJDE 2025）、[南蒂罗尔开放数据](https://github.com/dinglinfang/suedTirolOpenDataOBDA)
- 生物医学：[Bgee 基因表达数据库](https://www.sciencedirect.com/science/article/pii/S2666389921002014)（Patterns 2021），也是官方教程用的例子
- 流程挖掘：[OnProm](https://link.springer.com/content/pdf/10.1007/978-3-031-27815-0_34.pdf)（ICPM 2022）从关系库抽取对象中心事件日志

完整的文献清单和摘要见[VKG资料收集](/posts/study/paper/vkg/)。

这些案例的共同点是数据量大、schema 复杂、数据不方便搬走。三个条件同时成立时 VKG 最适用。

技术栈上没有专有依赖，RDF、SPARQL、OWL 全部是 W3C 标准，主流实现 Ontop 以 Apache-2.0 开源。

## 系统组成

三层的整体关系见[问题背景](#问题背景)一节的结构图，每一层各自使用的语言和格式如下：

| 层 | 语言与格式 | 内容 |
|---|---|---|
| 本体 | OWL 2 QL、RDFS | 类层次、属性的定义域与值域、约束 |
| 映射 | `.obda`、R2RML | 每条规则由一个 SQL 查询和一组 RDF 三元组模板组成 |
| 数据源 | PostgreSQL、MySQL、Oracle、Trino 等 | 数据始终留在这里，不复制也不迁移 |

映射是必需的，本体可选。只给映射也能跑，代价是没有推理能力。

### 术语

VKG 是比较新的术语。同一套技术在早期文献里称为 **OBDA**（Ontology-Based Data Access，基于本体的数据访问），2010 年前后的论文一律用这个词。扩展到多数据源的场合有时写作 OBDI（Integration）。这几个缩写指的是同一项技术。

## 映射

映射规定源库里的哪张表、哪个列对应本体里的哪个类、哪个属性，查询翻译完全依据它进行。Ontop 支持两种格式：W3C 标准 R2RML（Turtle 语法，机器友好但冗长），以及 Ontop 自己的 `.obda` 格式。两者可以用 `ontop mapping to-r2rml` 互转，入门阶段建议先看 `.obda`。

后面各节只用计算机学院的两张表。

```text showLineNumbers=false
person(p_id, name, role)              -- role: 1=教授, 2=副教授, 3=博士生
supervision(student_id, advisor_id)
```

`role` 用整数编码、教师对应 1 和 2、师生关系存放在 `supervision` 表里，这三条约定没有任何一处写在数据库里，查询的人必须事先知道。映射的作用是把它们写成机器可读的声明：

```text title="lab.obda"
[PrefixDeclaration]
:               http://example.org/lab#
foaf:           http://xmlns.com/foaf/0.1/
xsd:            http://www.w3.org/2001/XMLSchema#

[MappingDeclaration] @collection [[

mappingId   person-name
target      :person/{p_id} foaf:name {name}^^xsd:string .
source      SELECT p_id, name FROM person

mappingId   person-professor
target      :person/{p_id} a :Professor .
source      SELECT p_id FROM person WHERE role = 1

mappingId   person-associate-professor
target      :person/{p_id} a :AssociateProfessor .
source      SELECT p_id FROM person WHERE role = 2

mappingId   person-phd-student
target      :person/{p_id} a :PhDStudent .
source      SELECT p_id FROM person WHERE role = 3

mappingId   supervision
target      :person/{student_id} :isSupervisedBy :person/{advisor_id} .
source      SELECT student_id, advisor_id FROM supervision

]]
```

每条规则三个字段：

- `mappingId` 是标识符，内容任意，报错信息里会打印它，建议取可读的名字
- `source` 是一条任意 SQL 查询，在源库上执行
- `target` 是三元组模板，`{}` 里填 `source` 返回的列名

以 `person-professor` 为例：`source` 查出 `role = 1` 的所有 `p_id`，对每一行生成一条三元组 `:person/1 a :Professor`，其中的 IRI 由模板 `:person/{p_id}` 代入列值得到。

`role` 这个列在虚拟图里不再出现。整数编码这个实现细节被三条映射吸收，暴露出去的是 `:Professor`、`:AssociateProfessor`、`:PhDStudent` 三个类。概念层和物理存储由此分开。

同一个主语的多个谓词可以合起来写，用分号分隔（注意分号两侧都要有空格）：

```text
mappingId   person-professor
target      :person/{p_id} a :Professor ; foaf:name {name}^^xsd:string .
source      SELECT p_id, name FROM person WHERE role = 1
```

一处限制：类型标注和语言标签不能同时写。`{title}^^xsd:string@it` 是非法的，只能二选一。

## 查询处理流程

VKG 对外只接受 SPARQL 查询，实际计算发生在源库上，中间的转换分三步完成。三步里本体和映射各负责一部分：本体补充推理，映射负责翻译。

推理这部分只有本体在场时才看得出来，所以先把本体补上。前面的映射产出了 `Professor` 和 `AssociateProfessor` 两个类，概念上它们都属于教师，这一点由本体声明：

```turtle title="lab.ttl"
@prefix :     <http://example.org/lab#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

:Professor          rdfs:subClassOf :Faculty .
:AssociateProfessor rdfs:subClassOf :Faculty .

:PhDStudent rdfs:subClassOf [
    a                  owl:Restriction ;
    owl:onProperty     :isSupervisedBy ;
    owl:someValuesFrom :Faculty
] .
```

前两条是普通的子类声明。第三条读作「每个博士生都至少有一位导师，且导师是教师」，写成描述逻辑是 `PhDStudent ⊑ ∃isSupervisedBy.Faculty`。

### 处理阶段

三个阶段依次执行，本体只作用于第一步，映射只作用于第二步：

```text frame="none" showLineNumbers=false
   SPARQL 查询
        │
        │  ① rewriting     用本体把隐含的知识补进查询
        ▼
   改写后的查询（若干个析取项）
        │
        │  ② unfolding      用映射把三元组模式替换成 SQL 片段
        ▼
   SQL 查询
        │
        │  ③ SQO            消除冗余的 join、DISTINCT、UNION 分支
        ▼
   优化后的 SQL ──────▶ 源数据库执行
                            │
   查询结果 ◀────────────────┘
```

### 查询改写：类层次

第一个例子只用到子类关系。查计算机学院的所有教师：

```sparql
SELECT ?x WHERE { ?x a :Faculty . }
```

数据库里没有任何一列写着 `Faculty`，映射里也没有一条规则产出 `:Faculty`。但本体声明了 `Professor` 和 `AssociateProfessor` 都是 `:Faculty` 的子类，所以改写阶段把这个查询变成两个分支的并集：

```sparql
{ ?x a :Professor . } UNION { ?x a :AssociateProfessor . }
```

再经过展开，最终的 SQL 大致是：

```sql
SELECT p_id FROM person WHERE role = 1
UNION ALL
SELECT p_id FROM person WHERE role = 2
```

提问的人写了一个类名，系统展开成了两个分支。子类越多，一次改写覆盖的分支越多。新增一条 `:Lecturer rdfs:subClassOf :Faculty` 之后，原来的查询不用改一个字符。

### 查询改写：存在量化

第二个例子涉及存在量化。查计算机学院的教师带了哪些学生：

```sparql
SELECT ?s WHERE {
    ?s :isSupervisedBy ?a .
    ?a a :Faculty .
}
```

假设表里的数据如下：

```text frame="none" showLineNumbers=false
person                          supervision
p_id  name   role               student_id  advisor_id
1     陈立   1                  3           1
2     周敏   2
3     吴天   3
4     郑好   3
```

吴天（`p_id=3`）在 `supervision` 表里有记录，导师是教授陈立，这一行直接满足查询。郑好（`p_id=4`）也是博士生，但表里没有他的师生关系记录。

按 SQL 的语义，郑好不该出现在结果里。按本体的语义，他应该出现：本体声明了每个博士生都有一位教师作为导师，郑好是博士生，因此他有导师，只是这位导师是谁数据库里没记。

关键在于 `?a` 只出现在 WHERE 里，不在 SELECT 里。查询要的是学生，导师只作为存在性条件出现。既然本体保证这个条件成立，郑好就该被返回。

改写阶段把这层推理体现为一个额外的析取项：

```sparql
{ ?s :isSupervisedBy ?a . ?a a :Faculty . }
UNION
{ ?s a :PhDStudent . }
```

多出来的这个分支就是 **tree-witness rewriting** 的结果。tree witness 指的是那个不存在于数据、只存在于模型中的匿名个体，也就是郑好的导师。

### 映射展开

展开阶段的工作比改写机械：把查询里每一个三元组模式，替换成映射中能产出它的那些 `source` 查询，然后按查询的图结构做 join。

`?s :isSupervisedBy ?a` 只有 `supervision` 一条映射能产出，替换成 `SELECT student_id, advisor_id FROM supervision`。`?a a :Faculty` 经过改写已经变成两个分支，各自对应一条映射。三部分拼起来就是最终 SQL 的骨架。

一个三元组模式可能对应多条映射，这时展开的结果是 UNION。映射拆得越细，UNION 分支越多，这是映射设计需要考虑性能的原因之一。

### 语义查询优化

朴素展开出来的 SQL 通常很臃肿，充满自连接和 `DISTINCT`。Ontop 会利用数据库的主键、外键、唯一约束把它们消掉，比如两个子查询按主键连接同一张表时可以合并成一个。

这一步的效果取决于约束信息是否可见。源库没建约束、或者查询走的是视图，Ontop 只能按最坏情况生成 SQL。

想看实际生成的 SQL，把日志级别打开：

```bash
ONTOP_LOG_LEVEL=DEBUG ./ontop endpoint -m lab.obda -t lab.ttl -p lab.properties
```

入门阶段这个开关比读文档更直接。写一条 SPARQL，看系统生成了什么 SQL，然后改动本体或映射再看一次，几轮下来整套机制就清楚了。

## 本体的表达能力限制

VKG 系统只支持 RDFS 和 OWL 2 QL 两种本体语言。这个限制是整个方案成立的前提：所有实际计算都发生在数据库里，系统本身只做查询变换，因此必须保证「查询 + 本体」能被改写成一条等价的一阶查询，也就是 SQL。这个性质称为 **FO-rewritability**（一阶可改写性）。

析取和递归会破坏这个性质：

- 如果本体说「每个人是学生或教师」，而数据里某人的身份未知，那么「学生的数量」的答案取决于对每种可能情况的枚举，一条 SQL 表达不了
- 如果本体说 `ancestor` 是 `parent` 的传递闭包，改写会需要无界次的自连接，同样超出一阶查询的范围

OWL 2 QL 就是排除这些构造之后剩下的部分，对应描述逻辑里的 DL-Lite 家族，专门为这个用途设计。语法上有一处不对称值得记住：**存在量化在公理右侧允许限定类，左侧只允许 `owl:Thing`**。

```text frame="none" showLineNumbers=false
PhDStudent ⊑ ∃isSupervisedBy.Faculty        合法
∃isSupervisedBy.Faculty ⊑ PhDStudent        不合法
```

前者就是前面用过的那条公理。这个不对称的限制是保证可改写性的关键之一。

需要更强推理的场合超出 VKG 的适用范围，应考虑物化加完整推理机。把表达能力更强的本体近似成 OWL 2 QL 的做法见 [Beyond OWL 2 QL in OBDA: Rewritings and Approximations](https://ojs.aaai.org/index.php/AAAI/article/view/10102)（Botoeva 等，AAAI 2016）。

## 部署 SPARQL endpoint

工具用 [Ontop](https://ontop-vkg.org/)，当前版本 5.5.0（2026 年 2 月发布），Apache-2.0 许可。它是 VKG 领域使用最广的开源实现，前面提到的工业案例大多基于它。

::github{repo="ontop/ontop"}

部署步骤官方文档已经写全，按下面的顺序看：

- [Getting started](https://ontop-vkg.org/guide/getting-started.html)：整体流程，以及命令行和 Docker 镜像两条部署路线的入口
- [Command Line Interface](https://ontop-vkg.org/guide/cli.html)：`endpoint`、`materialize`、`query`、`bootstrap` 四个子命令的完整参数。`endpoint` 起服务，自带 YASGUI 查询界面；`bootstrap` 从现有数据库反向生成初版本体和映射，规则是表变成类、列变成属性、外键变成对象属性，生成结果的命名和粒度需要人工调整，适合作为起点
- [Tutorial](https://ontop-vkg.org/tutorial/)：用两所大学的 H2 数据库从零走一遍，覆盖映射设计、endpoint 部署、Python 调用、Lenses，配套仓库是 `ontop/ontop-tutorial`
- [VKG资料收集](/posts/study/paper/vkg/) 里的 BGEE、DEST、NPD 几个仓库是可以直接跑的完整例子

除了映射和本体，还需要一份连接配置（JDBC URL、账号、驱动类名）和对应数据库的 JDBC 驱动 jar。只提供映射也能启动，代价是没有推理能力。

## 相关研究工作

手写映射除了耗时，更难解决的是它要求一个同时懂业务、懂 schema、懂本体建模的人，这类人很少。这是 VKG 推广的主要障碍。

组里在做的就是映射生成的自动化。LLM4VKG（IJCAI 2025）用大模型完成本体开发、schema 分析和映射生成，重点处理命名歧义和实体匹配问题：

::github{repo="HomuraT/LLM4VKG"}

相关的还有 GeoQA 方向，用多智能体 LLM 做地理数据的自然语言问答，把 VKG 作为底层数据访问层：

::github{repo="nitpicker55555/Geo-QA-Paper"}

两个方向都有尚未解决的子问题。建议先把上面的 endpoint 跑通，再看代码。

## 延伸阅读

- 论文和仓库清单：[VKG资料收集](/posts/study/paper/vkg/)，按基础、构造、问答、应用四类整理
- 系统全景和应用场景：Xiao et al. 2019 的综述 [*Virtual knowledge graphs: An overview of systems and use cases*](https://direct.mit.edu/dint/article-pdf/1/3/201/683759/dint_a_00011.pdf)，Data Intelligence 1(3)
- 入门讲义：Xiao 2024 的 [Introduction to Virtual Knowledge Graphs](/papers/vkg/Xiao%20-%20Introduction%20to%20Virtual%20Knowledge%20Graphs.pdf) 和 [Virtual Knowledge Graphs Query Processing](/papers/vkg/Xiao%20-%20Virtual%20Knowledge%20Graphs%20Query%20Processing.pdf)
- 核心概念和映射语法：官方文档的 [Key concepts](https://ontop-vkg.org/guide/concepts.html) 和 [Ontop Mapping Language](https://ontop-vkg.org/guide/advanced/mapping-language.html)
- 映射设计的具体权衡：教程的[主键的作用](https://ontop-vkg.org/tutorial/mapping/primary-keys.html)、[外键的作用](https://ontop-vkg.org/tutorial/mapping/foreign-keys.html)、[IRI 模板的选择](https://ontop-vkg.org/tutorial/mapping/uri-templates.html)、[存在量化推理](https://ontop-vkg.org/tutorial/mapping/existential.html)，以及 Calvanese 和 Lanti 的 [Designing Virtual Knowledge Graphs](/papers/vkg/tutorial-design-vkg.pdf)（CAiSE 2024 tutorial）
- 多数据源联邦：教程的 [Federation](https://ontop-vkg.org/tutorial/federation/)，演示 Ontop 配合 [Denodo](https://ontop-vkg.org/tutorial/federation/denodo/)、[Dremio](https://ontop-vkg.org/tutorial/federation/dremio/)、[Teiid](https://ontop-vkg.org/tutorial/federation/teiid/)
- Lenses，即 Ontop 自带的视图层，支持 join、union、flatten 等操作：配置格式见文档的 [Lenses](https://ontop-vkg.org/guide/advanced/lenses.html)，用法见教程的 [Using lenses](https://ontop-vkg.org/tutorial/lenses/)
- 导出成物化图：教程的 [Materialization](https://ontop-vkg.org/tutorial/materialization/materialization.html)
- 查询改写的理论：DL-Lite 家族的原始论文 [Tractable Reasoning and Efficient Query Answering in Description Logics: The DL-Lite Family](https://doi.org/10.1007/s10817-007-9078-x)（Calvanese 等，JAR 39(3)，2007），OWL 2 QL 的语法定义见 W3C 的 [OWL 2 Profiles](https://www.w3.org/TR/owl2-profiles/#OWL_2_QL)，tree-witness rewriting 见 [Conjunctive Query Answering with OWL 2 QL](https://cdn.aaai.org/ocs/4538/4538-21816-1-PB.pdf)（Kikot、Kontchakov、Zakharyaschev，KR 2012）。这部分需要描述逻辑基础
- 建模和映射工具：Protégé 加 Ontop 插件，安装和配置见教程的 [Database and Ontop Setup](https://ontop-vkg.org/tutorial/basic/setup.html)，插件不支持 Lenses；映射设计另有商业工具 [Ontopic Studio](https://ontopic.ai/)
