---
name: blog-post
description: 在本博客(Fuwari/Astro)中新建或编辑文章、新增独立页面与导航栏条目、或写页面特效与客户端 JS 时使用。涵盖 frontmatter 规范、目录约定、分类标签约定、图片路径规则、扩展 Markdown 语法(提示框/GitHub 卡片/剧透/数学公式/视频嵌入)、Expressive Code 代码块标记、独立页面与导航栏的添加方式、Swup 页面转场下客户端脚本的正确初始化方式，以及发布到 blog.homura.work 的流程和常见构建失败排查。
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

本站现有的分层习惯：`tech/`（技术）、`study/paper/`（论文资源）、`seu/`（学校事务）、`hmt/`（个人）。**注意目录结构和 URL 无关**，路由只取文件名/目录名末段，分层纯粹是为了整理源文件。

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

基础三要素——语言、标题、行号：

````markdown
```js title="server.js" showLineNumbers
console.log('hello')
```
````

**默认行为**（配置在 `astro.config.mjs`）：自动换行开启；`shellsession` 语言不显示行号。

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

「关于」「个人简介」这类不属于博客文章的页面，走 `spec` collection。**不要放进 `src/content/posts/`**——会混进文章列表、归档和 RSS。

要求「加一个页面」时，默认理解成**导航栏多一个入口 + 一个独立页面**，不是在首页塞一个区块。

三步：

1. **内容** —— `src/content/spec/<name>.md`，不需要 frontmatter
2. **页面** —— `src/pages/<name>.astro`，照抄 `about.astro` 或 `intro.astro` 的结构
3. **导航栏** —— `src/config.ts` 的 `navBarConfig.links` 加一条：

```ts
{
    name: "个人简介",
    url: "/intro/",   // 内部链接不要带 base path，会自动加上
},
```

`LinkPreset` 枚举只是内置几个页面的快捷方式。自定义页面直接写 `{ name, url }` 即可，**不用改枚举，也不用加 i18n key**。数组顺序就是导航栏显示顺序。

页面需要客户端 JS（滚动特效、DOM 增强等）的，**别把 `<script>` 直接写在页面文件里**——Swup 跳转时它不会执行，必须走 `Layout.astro` 的统一入口，见下方 [Swup 坑一](#坑一只存在于某一页的-script客户端跳转时根本不会执行)。

### 什么时候该用 `Markdown.astro` 组件

`src/components/misc/Markdown.astro` 第 10 行写死了 `data-pagefind-body`——**用了它，该页面就会被加进搜索索引**。

| 场景 | 用不用 |
|---|---|
| 独立内容页（关于、个人简介） | ✅ 用，它们本来就该能被搜到 |
| 首页、列表页等导航性页面 | ❌ 别用，否则搜任何词都多出一条指向首页的冗余结果 |

后者若仍需渲染 markdown，直接套一样的样式类，绕开这个标记：

```
class="prose dark:prose-invert prose-base !max-w-none custom-md"
```

注意 `data-pagefind-ignore` 加在外层**没用**——只要子树里存在 `data-pagefind-body`，页面依然会被索引，只是内容为空，反而产生一条空摘要的结果。

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

Astro 把 `.astro` 里的 `<script>` **就地输出到那一页的 HTML**。而 Swup 换页时只替换 containers，`updateHead` 只管 `<head>`——两头都不沾的脚本压根不会被插进页面。

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

`<main>` 整块替换，之前绑的事件监听器和元素引用**全部失效**。所以初始化函数必须能重复执行，并挂在 `page:view` 上——上面 `loadPageEffects()` 同时解决了这个问题。

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

特征是**本地构建永远成功、Cloudflare 偶发失败**（并发时序不同）。解决办法是在依赖方顶部显式 `@import "./main.css";`，让 postcss-import 内联进来消除竞态——`src/styles/markdown.css` 顶部就是这么修的，注释写在那里。

那个 glob 是 Fuwari 处理动态图片的 workaround，**不要**改窄成只匹配图片扩展名，会导致全站样式丢失。

Cloudflare 构建失败时线上保持原样，不会挂掉。日志在 Pages 项目的部署列表里。

## 活参考

模板文章都设成了 `draft: true`——线上不显示，但 `pnpm dev` 本地照常能看（`src/utils/content-utils.ts:9` 只在 PROD 下过滤草稿）。想看某个语法的实际渲染效果，本地起 dev 打开对应文章：

| 文件 | 内容 |
|---|---|
| `src/content/posts/markdown-extended.md` | 提示框、GitHub 卡片、剧透 |
| `src/content/posts/expressive-code.md` | 代码块全部特性的实例 |
| `src/content/posts/markdown.md` | 基础 Markdown 语法 |
| `src/content/posts/video.md` | 视频嵌入 |
| `src/content/posts/guide/index.md` | Fuwari 官方说明 |

需要恢复某篇到线上，把 `draft` 改回 `false` 即可。
