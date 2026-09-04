---
name: blog-post
description: 在本博客(Fuwari/Astro)中新建或编辑文章、新增独立页面与导航栏条目、或写页面特效与客户端 JS 时使用。涵盖站主的写作规范(禁用破折号、禁用「不是A而是B」句式、标题必须是名词短语、不写范围说明、书面语体、指代要点名、先讲价值再讲机制)、frontmatter 规范、目录与 URL 的对应关系、分类标签约定、图片路径规则、扩展 Markdown 语法(提示框/GitHub 卡片/剧透/数学公式/视频嵌入)、Expressive Code 代码块标记与行号约定、独立页面与导航栏的添加方式、Swup 页面转场下客户端脚本的正确初始化方式，以及发布到 blog.homura.work 的流程和常见构建失败排查。
---

# 写博客文章

本站是 Astro + Fuwari，内容源是 `src/content/posts/` 下的 Markdown。推送到 `main` 后 Cloudflare Pages 自动构建部署到 `blog.homura.work`。

## 快速开始

```bash
pnpm new-post tech/server/nginx调优   # 建文件并生成 frontmatter，支持多级目录
pnpm dev                              # 本地预览 http://localhost:4321
pnpm build                            # 推送前自检，能提前发现 frontmatter 错误
git add . && git commit -m "post: xxx" && git push origin main
```

推送后 2-4 分钟自动上线，无需任何手动部署操作。

## 文件放哪

带图片的文章用目录形式，纯文字可以用单个 `.md`：

```
src/content/posts/
├── uv-learning/index.md          # 单篇
├── tech/server/init/index.md     # 按主题分层
└── seu/20251213_xxx/
    ├── index.md
    └── images/                   # 配图跟文章放一起
```

本站现有的分层习惯：`tech/`（技术）、`study/paper/`（论文资源）、`study/`（学习记录）、`seu/`（学校事务）、`hmt/`（个人）。

**目录结构就是 URL。** `src/utils/url-utils.ts` 的 `getPostUrlBySlug` 返回 `/posts/${slug}/`，而 slug 是 `src/content/posts/` 下的完整相对路径（去掉 `index.md`）。所以：

| 文件 | URL |
|---|---|
| `posts/uv-learning/index.md` | `/posts/uv-learning/` |
| `posts/study/paper/vkg/index.md` | `/posts/study/paper/vkg/` |
| `posts/study/vkg/index.md` | `/posts/study/vkg/` |

建目录的时候顺手想一下 URL 好不好看，层级太深 URL 就长。构建后可以用 `find dist/posts -name index.html` 核对。

## Frontmatter

schema 定义在 `src/content/config.ts`，用 zod 校验，**写错会直接导致构建失败**（线上保持原样不更新）。

```yaml
---
title: 文章标题
published: 2026-09-02
description: '一句话摘要，显示在列表页'
image: ''
tags: [Linux, 服务器维护]
category: '技术笔记'
draft: false
lang: 'zh-CN'
---
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 字符串。含冒号时要加引号 |
| `published` | ✅ | 日期，必须 `2026-09-02` 格式 |
| `updated` | | 日期，可选 |
| `description` | | 列表页摘要。留空会自动截取正文开头 |
| `image` | | 封面图，见下方路径规则 |
| `tags` | | **必须是数组** `[a, b]` |
| `category` | | 单个字符串 |
| `draft` | | `true` 则线上不显示（本地 dev 仍可见） |
| `lang` | | 留空继承站点默认 `zh_CN` |

## 分类和标签的约定

**职责分工**：`category` 回答「这篇属于哪一块」，`tags` 回答「涉及什么技术」。同一个词不要既当分类又当标签。

现有分类（新文章尽量复用，别造同义词）：`技术笔记`、`学习记录`、`论文或资源整理`、`东南大学`、`HMT`

现有标签，按使用频率：

| 标签 | 说明 |
|---|---|
| `Linux`、`服务器维护` | 主力标签，服务器相关的文章基本都挂这两个 |
| `Docker`、`GitHub`、`Python`、`工具笔记` | 技术向 |
| `LLM`、`Agent`、`VKG` | 研究向 |
| `娱乐` | 个人向 |

**新建标签前先问一句：这个标签以后还会有第二篇文章吗？**

会 → 建。不会 → 别建，写进 `description` 里就行，搜索照样能搜到，不用占标签位。只出现一次的标签没有聚合作用，点进去只有一篇文章，等于标题的劣化版。

已经踩过的坑：`服务器配置` 和 `服务器维护` 是同义词，已合并到后者；`UV`、`包管理` 是标题和正文里已有的信息，作为标签属于冗余，已删除。一篇文章 2-3 个标签足够。

## ⚠️ 写作规范

这一节是站主明确提过的要求，**每条都是被退回重写过的**，写之前先过一遍。

### 1. 禁止使用破折号

`——` 和 `—` 一律不用。改成逗号、句号，或者用「即」「比如」「也就是」把话说完整。

```
✗ 更麻烦的是知识不沉淀——上一个人写的 SQL 里藏着那些约定
✓ 更麻烦的是知识不沉淀。上一个人写的 SQL 里藏着那些约定

✗ 经典分类——schema 级还是实例级——由 Clio 项目开创
✓ 经典分类，即 schema 级还是实例级。系统性的算法由 Clio 项目开创
```

交稿前跑一遍 `grep -n "—" <文件>`，必须没有输出。

### 2. 标题必须是名词短语

不能是口语化的句子，也不能是反问。参照站内已有文章的粒度：

| 参照文章 | 它的标题 |
|---|---|
| `github-https-connection-fix` | 问题现象 / 问题原因 / 解决方案 |
| `tech/server/docker_install` | 安装前准备 / 权限配置 / 验证权限 |
| `uv-learning` | 安装 / 基本使用速查 / 常见问题 / 最佳实践 / 参考 |

外部参照：Ontop 官方文档的目录（Key concepts / Mapping Language / Materialization）也是同一路数。

实际被退回过的例子：

| 写成了 | 应该是 |
|---|---|
| 数据能用，但用不起来 | 问题背景 |
| 常规做法能走多远 | 常见方案及其局限 |
| 映射长什么样 | 映射 |
| 一条查询是怎么被执行的 | 查询处理流程 |
| 本体为什么只能用 OWL 2 QL | 本体的表达能力限制 |
| 动手：跑通一个 SPARQL endpoint | 部署 SPARQL endpoint |
| 三个值得早点知道的命令 | 其他常用命令 |
| 为什么值得花时间 | 应用现状 |
| 用在了哪些地方 | 应用现状 |
| 组里在做什么 | 相关研究工作 |
| 接下来读什么 | 延伸阅读 |

### 3. 不要写防御性的范围说明

开头不要交代「这篇是给谁看的」「读完能做到几件事」「理论细节不在这里」。正文里也不要写「这一节是全文重点」「这个例子讲清了才算说明白」。直接介绍主题本身。

```
✗ 这篇是给刚接触 VKG 的同学准备的入门材料。读完之后应该能做到三件事：……
✗ 理论细节和论文清单不在这里，在 VKG资料收集。建议先读完本文再去看那份清单。
✓ 关系数据库里的数据和知识图谱的查询方式之间隔着一层。想用图的方式提问，常规做法是……
```

### 4. 禁用句式

**「不是 A，而是 B」一律不许写。** 包括所有变体：「不只是 A，而是 B」「不仅仅是 A，而是 B」「并非 A，而是 B」「A 不是问题，B 才是」。这是靠否定制造转折的排比句式，用来充当金句，写多了每段都像在揭示什么。

直接说 B 就行。B 要是需要对照才立得住，那就把对照写成两个独立的句子。

```
✗ 不是某个人不认识某张表，而是独立演化出来的多个数据源之间没有共同语言。
✓ 独立演化出来的多个数据源之间没有共同语言。问题的规模由数据源的数量决定，跟单个 schema 的复杂度关系不大。

✗ 这不是实现偷懒，而是整个方案成立的前提。
✓ 这是整个方案成立的前提。

✗ 前者是重命名，后者才是推理。
✓ 前者是重命名，后者是推理。
```

同类要避开的还有：「与其说 A，不如说 B」「A 只是表象，B 才是本质」。

写完 `grep -nE "不是.*而是|不只是|不仅仅|并非.*而是" <文件>` 查一遍。

### 5. 语体是书面技术文档

被否掉的口语：「跨库必撞」「老实物化」「活儿全推给数据库」「让新人相信这不是纯学术玩具」「有可以接的活」「几条踩过的」「按顺序，不要跳」。

也不要往另一头跑。夸大的「至关重要」「关键转折点」「不可磨灭」「深刻」同样不行。目标是内部设计文档那种平实的陈述句。

**给术语和名字下定义时不要用「叫」。** 站主退回过「表叫 `person`」「一层叫 Ontology 的东西」「这个问题叫 schema mapping」，原话是「一般谁会这么说」「这么喜欢用动词吗」。名字本身是名词，写成名词短语，或者用「称为」「名为」「是」。

| 退回的写法 | 改法 |
|---|---|
| 表叫 `person` | 表名 `person` |
| 建立在一层叫 **Ontology** 的东西上 | 建立在 **Ontology** 这一层之上 |
| 包装成一个叫 `professor` 的视图 | 包装成视图 `professor` |
| 这个问题叫 **schema mapping** | 这个问题称为 **schema mapping** |
| 这个性质叫 **FO-rewritability** | 这个性质称为 **FO-rewritability** |
| 术语叫 relational-to-ontology mapping generation | 术语是 relational-to-ontology mapping generation |
| 1991 年的专利名字是 X，产品里叫 Universe | 1991 年的专利名为 X，产品中的实现称为 Universe |
| VKG 这个叫法比较新 | VKG 是比较新的术语 |

连带一条：**「东西」在正文里基本都能换掉**。「关系世界的东西」写成「关系模型内部的机制」，「能表达的东西受限」写成「表达能力受限」。

自检 `grep -nE "叫|东西" <文件>`，正文里应该一条不剩。

### 6. 先讲价值，再讲机制

介绍一项技术，顺序是：问题场景 → 现有方案的边界 → 这项技术的思路 → 应用现状 → 机制细节。

不要一上来就讲设计和语法。读者没被说服「这东西有用」之前，看映射文件的语法是没有耐心的。`study/vkg`（虚拟知识图谱入门）就是按这个顺序改出来的，可以直接参照它的章节安排。

### 7. 禁写清单

前面六条是站主直接退回过的。这一条是系统性补充，模式取自 `humanizer-zh` skill（依据 Wikipedia:Signs of AI writing），按中文技术写作的实际表现整理。

| 模式 | 具体表现 | 处理 |
|---|---|---|
| 夸大意义 | 标志着、体现了、是……的证明、至关重要、关键转折点、不断演变的格局、奠定基础、不可磨灭 | 陈述事实，不评价它的历史地位 |
| 句末虚假深度 | 「……，凸显了其重要性」「……，反映了更广泛的趋势」「……，确保了 X」 | 整个从句删掉 |
| 宣传性用语 | 拥有（夸张义）、充满活力、丰富的（比喻）、深刻的、开创性的、令人叹为观止 | 换成可核对的事实 |
| 模糊归因 | 专家认为、业界普遍认为、有研究表明、多个来源显示 | 给出具体出处，否则删掉这个主张 |
| 公式化挑战段 | 「尽管面临若干挑战」「尽管存在这些挑战」「未来展望」 | 写具体问题和具体进展 |
| AI 高频词 | 此外、深入探讨、强调（动词）、增强、赋能、复杂性、格局、宝贵的、值得注意的是 | 「此外」多数情况直接删，或者另起一段 |
| 系动词回避 | 「X 作为一个 Y」「X 拥有三个组件」 | 写「X 是 Y」「X 有三个组件」 |
| 三段式凑数 | 为了显得全面硬凑成三项 | 两项四项都行，按实际数量写 |
| 同义词循环 | 同一个概念轮换写成「映射」「映射规则」「对应关系」 | 术语固定，重复出现是对的 |
| 虚假范围 | 「从 X 到 Y」而 X 和 Y 不在同一个尺度上 | 直接列举 |
| 粗体滥用 | 名词短语随手加粗；段首用「**动手。**」「**综述。**」「**形式化程度。**」这种加粗短词当小标题 | 只用于术语首次出现。段首标签改成陈述句，见下方专门一条 |
| emoji 装饰 | 标题或列表项前加 🚀 💡 ✅ | 文章正文不用。skill 这类内部文档为了扫读可以留 |
| 对话残留 | 希望这对你有帮助、当然、你说得对 | 文章里不该出现 |
| 免责声明 | 截至……、根据现有资料、虽然具体细节有限 | 查清楚，或者明确写「未查到公开资料」 |
| 填充短语 | 为了实现这一目标、由于……的事实、在这个时间点、具有……的能力 | 用最短的说法 |
| 过度限定 | 可能潜在地或许会 | 一层限定就够 |
| 空洞的积极结尾 | 「前景光明」「这是重要的一步」 | 写下一步具体做什么，或者不写结尾 |

一个容易误判的情况：`- **数据模型异构**：关系表、图、XML、CSV` 这种定义列表是合法的，冒号后面提供了新信息。清单里禁的是 `- **性能：** 性能得到了提升` 这种同义反复。

**段首加粗标签，以及它的两种错误改法。** 站主两次退回过这个位置，原话是「你为什么这么喜欢这个非常短的词加粗」和「什么叫『先动手，之后读综述』？这种傻逼描述方式能不能改改」。

| 版本 | 写法 | 结果 |
|---|---|---|
| 原稿 | **动手。** 先按上一节的清单把官方教程完整走一遍 | 退回，加粗短词当伪标题 |
| 第一次改 | 先动手。按上一节的清单把官方教程完整走一遍 | 退回，把标签换成了「先……之后……」的流程旁白 |
| 定稿 | 官方教程按上一节的清单走一遍约需两三个小时 | 通过 |

改法是**让段落主语就是这一段要讲的东西**，陈述它是什么、在哪、多长时间，不要交代读者第几步该做什么。同一节里四段依次以「官方教程」「系统全景和应用场景」「查询改写的理论」「本体建模的工具」开头，顺序由排列本身表达，不需要「先」「之后」「接下来」这类词，节首那句「建议按下面的顺序推进」也一并删掉。

### 8. 指代必须能落到具体对象

站主明确要求过：「这个方法有相当多的工业部署」这种写法不行，「你直接说 VKG 不就好了」。凡是「这个 X」「它」「这条线」「这件事」，读者都要停下来回指一次，能点名就点名。

三类必须改：

| 类型 | 退回的写法 | 改后 |
|---|---|---|
| 用「这个 X」代替名字 | **这个方法**有相当多的工业部署 | **VKG** 已经有相当多的工业部署 |
| | 不用装 Java，建议先用**这个** | **Docker** 不需要在本地装 Java，入门建议优先用它 |
| 「它」跨句，最近的名词不是本意 | 都是**它的**子类（上句末尾是「一条规则」） | 都是 **`:Faculty`** 的子类 |
| | 最近**它**重新受到关注（上句主语是「主流实现」） | 最近**语义层**重新受到关注 |
| | 后者对**它**是个黑盒（隔了一个分句） | 后者对 **Ontop** 是个黑盒 |
| 同形虚指堆在一起 | 相邻两段里「这条线」「这个方向」「这条线」各指不同东西 | 至少一处展开成完整名称 |

还有一种更严重的，指代对象在语法上是错的：「写一条 SPARQL，看**它**生成了什么 SQL」，按语法「它」只能是那条查询，但生成 SQL 的是系统。这类属于事实错误，要改的是指代对象本身。

不必改的情况：紧跟列表后面的序数指代（「第三条对应」「最后一条的影响最大」）、上一句刚列举完的「两者」「前两个」「这几个缩写」、同句内的「它」。判据是读者不需要往回找。

自检：`grep -nE "这个方法|这种方法|这套东西|这件事|这条线|这个方向" <文件>` 逐条确认能不能点名；「它」和「这个」无法用 grep 判断，靠通读，重点看跨句和跨段的位置。

顺带一条：**不要自造术语**。写过「`role` 这个列在 RDF 视图里不再出现」，全文并无「RDF 视图」这个说法，而「视图」在同一篇里另有所指。术语固定，没定义过的组合不要用。

### 9. humanizer-zh 的适用边界

**只取它的检测模式，不要照做它的「个性与灵魂」一节。**

那一节主张有观点、用第一人称、变化节奏、允许一些混乱、对感受要具体。照做过一次，产出是「跨库必撞」「老实物化」「活儿全推给数据库」「让新人相信这不是纯学术玩具」，被明确退回。

本站的目标语体在第 5 条：内部设计文档那种平实的陈述句。两个方向都是坑，往 AI 味那头跑是夸大和自我说明，往 humanizer 那头跑是口语化。第 7 条的清单用来排除前者，第 5 条用来约束后者。

## 图片路径的三种写法

`image` 字段和正文里的图片都遵循同一套规则：

1. `http://` / `https://` 开头 → 外链图片
2. `/` 开头 → 找 `public/` 目录，如 `/images/hmt/xxx.png` 对应 `public/images/hmt/xxx.png`
3. 都不是 → 相对当前 markdown 文件，如 `./cover.jpg`

正文图片推荐 `![说明](./images/xxx.png)` 放在文章目录里，跟着文章走不会失联。需要控制尺寸时可以直接写 HTML：

```html
<img src="/images/xxx.png" style="height: 200px; width: auto;">
```

## 扩展语法

### 提示框

五种类型：`note` `tip` `important` `warning` `caution`

```markdown
:::note
需要读者留意的信息。
:::

:::warning[自定义标题]
标题可以自己写。
:::
```

GitHub 风格也支持，会自动转换：

```markdown
> [!TIP]
> 这样写也行。
```

### GitHub 仓库卡片

页面加载时实时拉取 GitHub API 显示仓库信息：

```markdown
::github{repo="HomuraT/HMTBlog"}
```

### 剧透（默认打码，鼠标悬停显示）

```markdown
结局是 :spoiler[主角其实早就死了]。
```

### 数学公式

KaTeX 已启用，行内 `$E = mc^2$`，块级：

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 视频嵌入

直接粘贴平台的 iframe 代码：

```html
<!-- YouTube -->
<iframe width="100%" height="468" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

<!-- Bilibili -->
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" allowfullscreen="true"></iframe>
```

## 代码块（Expressive Code）

基础三要素是语言、标题、行号：

````markdown
```js title="server.js" showLineNumbers
console.log('hello')
```
````

**默认行为**（配置在 `astro.config.mjs`）：自动换行开启；`shellsession` 语言不显示行号，**其他语言全都显示**，包括 `bash` 和不写语言的块。

站内约定沿用这个默认值，`bash` 带行号是正常的。但**画图和贴数据不要带行号**，行号在 ASCII 图旁边纯属干扰：

````markdown
```text frame="none" showLineNumbers=false
   ┌── 本体  OWL 2 QL / RDFS
   ├── 映射  .obda / R2RML
   └── 数据源  PostgreSQL / MySQL ...
```
````

| 内容 | 写法 |
|---|---|
| 架构图、流程图 | `text frame="none" showLineNumbers=false` |
| 表结构、数据清单 | `text showLineNumbers=false` |
| 真正的代码和配置文件 | 照常，保留行号，有文件名就加 `title="x.obda"` |

`frame="none"` 去掉框体，图就不会看起来像一段代码。校验方法：构建后 `grep -o 'frame is-[a-z-]*' dist/posts/<slug>/index.html`，另外查 `<div class="ln"` 出现在哪些块里。

中文字符是双宽的，画 ASCII 图时不要做右边框对齐，会错位。用左侧竖线加缩进的样式最稳。

### 高亮标记

````markdown
```js {1, 4, 7-8}          # 按行号高亮
```js del={2} ins={3-4}    # 标红删除 / 标绿新增
```js "某段文字"            # 高亮行内指定文字
```js /ye[sp]/             # 正则匹配高亮
```js ins="新增" del="删除"  # 指定行内文字的标记类型
```
````

带说明标签的高亮：

````markdown
```js {"这里填值:":5-6} ins={"然后加上这段:":10-12}
```
````

### diff

````markdown
```diff lang="js"
  function foo() {
-   console.log('旧代码')
+   console.log('新代码')
  }
```
````

用 `diff lang="js"` 可以同时保留 JS 语法高亮和 diff 标记。

### 折叠长代码

````markdown
```js collapse={1-5, 12-14}
```
````

把样板代码折起来，读者点击展开。

### 框体类型

````markdown
```bash                    # 自动渲染成终端窗口
```js title="a.js"         # 有 title 渲染成编辑器标签
```sh frame="none"         # 去掉框体
```ps frame="code"         # 强制用编辑器框而非终端框
```
````

### 换行控制

````markdown
```js wrap=false           # 关闭自动换行，改为横向滚动
```js wrap preserveIndent=false
```
````

## 新增独立页面（非文章）

「关于」「个人简介」这类不属于博客文章的页面，走 `spec` collection。**不要放进 `src/content/posts/`**，会混进文章列表、归档和 RSS。

要求「加一个页面」时，默认理解成**导航栏多一个入口 + 一个独立页面**，不是在首页塞一个区块。

三步：

1. **内容**：`src/content/spec/<name>.md`，不需要 frontmatter
2. **页面**：`src/pages/<name>.astro`，照抄 `about.astro` 或 `intro.astro` 的结构
3. **导航栏**：`src/config.ts` 的 `navBarConfig.links` 加一条：

```ts
{
    name: "个人简介",
    url: "/intro/",   // 内部链接不要带 base path，会自动加上
},
```

`LinkPreset` 枚举只是内置几个页面的快捷方式。自定义页面直接写 `{ name, url }` 即可，**不用改枚举，也不用加 i18n key**。数组顺序就是导航栏显示顺序。

页面需要客户端 JS（滚动特效、DOM 增强等）的，**别把 `<script>` 直接写在页面文件里**，Swup 跳转时它不会执行，必须走 `Layout.astro` 的统一入口，见下方 [Swup 坑一](#坑一只存在于某一页的-script客户端跳转时根本不会执行)。

### 什么时候该用 `Markdown.astro` 组件

`src/components/misc/Markdown.astro` 第 10 行写死了 `data-pagefind-body`，**用了它，该页面就会被加进搜索索引**。

| 场景 | 用不用 |
|---|---|
| 独立内容页（关于、个人简介） | ✅ 用，它们本来就该能被搜到 |
| 首页、列表页等导航性页面 | ❌ 别用，否则搜任何词都多出一条指向首页的冗余结果 |

后者若仍需渲染 markdown，直接套一样的样式类，绕开这个标记：

```
class="prose dark:prose-invert prose-base !max-w-none custom-md"
```

注意 `data-pagefind-ignore` 加在外层**没用**，只要子树里存在 `data-pagefind-body`，页面依然会被索引，只是内容为空，反而产生一条空摘要的结果。

自检方法：`pnpm build` 后看 `Indexed N pages`，N 应等于「已发布文章数 + 独立内容页数」。莫名多一页，基本就是这里。

## 页面特效与客户端 JS

三个层次，按需要的复杂度选：

| 层次 | 用在哪 | 说明 |
|---|---|---|
| Markdown 里直接写 HTML | `.md` 正文 | 没配 sanitizer，原样放行。`<br>`、`<iframe>`、行内 `<style>` 都能用 |
| `.astro` 组件/页面 | `src/pages/`、`src/components/` | 纯 HTML + scoped `<style>` + `<script>`，主力手段 |
| Svelte 5 岛屿 | 需要状态和交互 | `client:load` / `client:visible` 挂载 |

Svelte 现成例子：`ArchivePanel.svelte`、`Search.svelte`、`LightDarkSwitch.svelte`、`DisplaySettings.svelte`。

配色用主题的 CSS 变量（`var(--primary)`、`var(--radius-large)`、`var(--link-underline)`），会自动跟随用户在侧栏调的色相和明暗模式。写死颜色在暗色模式下会翻车。

### ⚠️ Swup：本项目做特效最容易翻车的地方

站点开了 Swup 页面转场，`astro.config.mjs` 里配置了：

```js
containers: ["main", "#toc"],
globalInstance: true,
```

**站内跳转不会重新加载页面**，Swup 只把 `<main>` 和 `#toc` 的 DOM 整块替换掉。这带来**两个独立的坑**，都不报错，很容易只修了第二个就以为搞定了。

#### 坑一：只存在于某一页的 `<script>`，客户端跳转时根本不会执行

Astro 把 `.astro` 里的 `<script>` **就地输出到那一页的 HTML**。而 Swup 换页时只替换 containers，`updateHead` 只管 `<head>`，两头都不沾的脚本压根不会被插进页面。

特别注意：`<style>` / `<script>` 写在 `</MainGridLayout>` **之后**（这是很自然的写法），产出的 HTML 里它们会落在 `</body></html>` **后面**。整页加载时浏览器容错解析照样执行，所以本地刷新一看「没问题」。

> **表现：从别的页面点进去没特效，按 F5 刷新就有了。** 这是这个坑的标志性症状，见到就直接往这查。

确诊（不要靠猜，量一下位置）：

```bash
pnpm build
python3 - <<'EOF'
h = open('dist/intro/index.html', encoding='utf-8').read()
print("</head>        :", h.find('</head>'))
print("<main>         :", h.find('<main id="swup-container"'), "->", h.find('</main>'))
print("</body></html> :", h.find('</body></html>'))
print("你的脚本       :", h.find('getElementById("intro-root")'))   # 换成脚本里的特征字符串
EOF
```

脚本偏移量不在 `<main>` 区间内、也不在 `</head>` 之前，就是它。

**正确写法：特效单独成模块，由 `Layout.astro` 按需动态 import。** `Layout.astro` 的 `<script>` 每个页面都有、一直活着，是唯一可靠的入口。

```ts
// src/scripts/intro-fx.ts
export function initIntroEffects(): void {
  const root = document.getElementById('intro-root')
  if (!root) return          // 幂等：不在这一页直接返回，可重复调用
  // ...特效逻辑
}
```

```js
// src/layouts/Layout.astro 的 <script> 里
async function loadPageEffects() {
  if (document.getElementById('intro-root')) {
    const { initIntroEffects } = await import('../scripts/intro-fx')
    initIntroEffects()
  }
}

function init() { /* ...原有内容... */ loadPageEffects() }   // 首次加载
init()

// setup() 里的 page:view 钩子中再调一次                     // 后续每次跳转
window.swup.hooks.on('page:view', () => { /* ... */ loadPageEffects() })
```

动态 import 会被打成独立 chunk，**别的页面不会下载**，所以不用心疼把它挂在全局入口上。

不要试图把 `<script>` 塞进 `<main>` 里赌 Swup 会执行容器内的脚本：那取决于 `replaceContent` 里 `cloneNode(true)` 对 script "already started" 标志的处理（`swup/src/modules/replaceContent.ts`），版本之间不保证；而且就算执行了，每次进页面都会新建一份模块作用域、重复注册 `page:view` 监听，越攒越多。

#### 坑二：跳走再回来，DOM 已经被换掉

`<main>` 整块替换，之前绑的事件监听器和元素引用**全部失效**。所以初始化函数必须能重复执行，并挂在 `page:view` 上。上面 `loadPageEffects()` 同时解决了这个问题。

如果脚本本来就每页都要跑（不是页面特效），直接写在 `Layout.astro` 里，用项目自己的写法（`src/layouts/Layout.astro` 的 `setup()`）：

```js
const setup = () => {
  init();                                    // 立即执行一次
  window.swup.hooks.on('page:view', init);   // 之后每次跳转再执行
};

// swup 可能尚未就绪，两种情况都要覆盖
if (window?.swup?.hooks) {
  setup();
} else {
  document.addEventListener('swup:enable', setup);
}
```

`page:view` 是「新页面 DOM 已就位」的时机。其他可用钩子：`content:replace`、`visit:start`、`visit:end`、`link:click`，Layout.astro 里都有实际用例。

#### CSS 不受影响

Astro 总是把 `<style>` 抽成 `<head>` 里的 `<link rel="stylesheet">`，而且当前构建会把各页面的样式表**链到所有页面**上。所以样式没有上述问题，只有 `<script>` 有。

真实案例：`src/pages/intro.astro` + `src/scripts/intro-fx.ts` + `Layout.astro` 的 `loadPageEffects()` 就是按这个结构修出来的，可直接照抄。

### 其他

- Astro 的 `<script>` 默认被 Vite 打包成 ES module 并 defer。要引 CDN 外链或需要立即执行，加 `is:inline`。
- 动画库正常 `pnpm add` 即可（GSAP、Motion One 等），Astro 会打包。
- **静态资源一律放 `public/`，别放 `src/`。**`src/components/misc/ImageWrapper.astro:32` 有个 `import.meta.glob("../../**")`，会把 `src/` 下每个文件都拉进模块图，见下方构建失败排查。

## 发布流程

1. 写完本地 `pnpm dev` 看效果
2. **`pnpm build` 自检**（重要，能挡掉 90% 的构建失败）
3. `git push origin main`
4. Cloudflare Pages 自动构建，2-4 分钟上线

推非 `main` 分支会生成独立预览 URL，不影响线上。部署列表里任何历史版本都能一键回滚。

## 构建失败排查

按出现频率排序：

| 症状 | 原因 |
|---|---|
| zod 校验报错 | `published` 日期格式不对，或写成了 `2026/09/02` |
| zod 校验报错 | `tags` 写成了 `tags: linux` 而不是 `tags: [linux]` |
| YAML 解析报错 | `title` 里有冒号但没加引号 |
| 构建成功但图片 404 | 混淆了 `/` 开头（public）和 `./` 开头（相对文件）两种路径 |
| 搜索框搜不到东西 | 构建命令漏了 pagefind，必须跑 `pnpm build` 而不是 `astro build` |
| 第一次进页面没特效、刷新一下就有 | 页面自己的 `<script>` 在 Swup 跳转时没被执行，见上方 Swup 坑一 |
| 特效跳转后失效但不报错 | 没在 `swup` 的 `page:view` 上重新初始化，见上方 Swup 坑二 |
| `The 'xxx' class does not exist` | Tailwind `@apply` 自定义类的竞态，见下 |

最后一条已经踩过一次：`ImageWrapper.astro:32` 的 `import.meta.glob("../../**")` 会把 `src/` 下每个 CSS 各自作为独立 PostCSS 入口并发处理，完成顺序不确定。若某个文件先于定义 `@layer components` 的 `main.css` 处理完，`@apply` 就会找不到类。

特征是**本地构建永远成功、Cloudflare 偶发失败**（并发时序不同）。解决办法是在依赖方顶部显式 `@import "./main.css";`，让 postcss-import 内联进来消除竞态，`src/styles/markdown.css` 顶部就是这么修的，注释写在那里。

那个 glob 是 Fuwari 处理动态图片的 workaround，**不要**改窄成只匹配图片扩展名，会导致全站样式丢失。

Cloudflare 构建失败时线上保持原样，不会挂掉。日志在 Pages 项目的部署列表里。

## 活参考

模板文章都设成了 `draft: true`，线上不显示，但 `pnpm dev` 本地照常能看（`src/utils/content-utils.ts:9` 只在 PROD 下过滤草稿）。想看某个语法的实际渲染效果，本地起 dev 打开对应文章：

| 文件 | 内容 |
|---|---|
| `src/content/posts/markdown-extended.md` | 提示框、GitHub 卡片、剧透 |
| `src/content/posts/expressive-code.md` | 代码块全部特性的实例 |
| `src/content/posts/markdown.md` | 基础 Markdown 语法 |
| `src/content/posts/video.md` | 视频嵌入 |
| `src/content/posts/guide/index.md` | Fuwari 官方说明 |

需要恢复某篇到线上，把 `draft` 改回 `false` 即可。
