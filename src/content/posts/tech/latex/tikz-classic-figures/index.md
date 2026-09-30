---
title: "TikZ 科学配图图册：18 个 classic 示例"
published: 2026-09-30
description: "18 张 classic 科学配图总览：曲线、分布、热图与组合布局，以及 Python 计算和 TikZ 排版的复用入口。"
image: ""
tags: ["LaTeX", "Python", "工具笔记"]
category: "技术笔记"
draft: false
lang: "zh-CN"
---

<div class="figure-banner">

![晓美焰在手稿旁绘制曲线，背景有紫色坐标图](./images/homura.png)

</div>

## Skill 简介

[`tikz-paper-figure`](https://github.com/HomuraT/tikz-paper-figure) 是面向论文作者的 TikZ/pgfplots 配图 Skill，适合需要可编辑 TeX 图源、统一字体配色，并希望让代码助手参与绘图和修改的场景。TikZ 负责绘制图形，pgfplots 提供数据坐标轴；Skill 将选图、排版、编译和看图检查整理成可复用的工作流程。

仓库包含给助手读取的 `SKILL.md`、选图与排版参考、`.sty` 样式包、带 TeX/PDF/PNG 的示例，以及环境检查和构建脚本。可以将它安装到 Claude Code，也可以直接复制模板、在本地编译，独立于助手使用。本文使用 v0.2.2 的文件版本。

`tikz-paper-figure` 的 classic 扩展收录了 18 个科学数据图示例。DejaVu Sans 字体、tab10 配色、四边框与图例样式统一放进 `classicfig.sty`，便于给已有 Python 图补充风格接近的 TikZ 配图。

## 图册总览

<div class="figure-gallery">

![18 个 classic 科学配图示例总览，全部使用合成或演示数据，包括曲线、分布、场图和组合面板](./images/gallery.png)

</div>

*总览用于选图型；点击图片可放大。所有数值均为演示数据，XRD 中的 3.5% 是模拟设定。*

| 分类 | 数量 | 可复用的结构 |
|---|---:|---|
| 曲线与散点 | 5 | 光谱、动力学、双轴与瀑布线 |
| 分布 | 3 | 分布形状、样本点与统计摘要并置 |
| 类别与场 | 5 | 类别比较、热图与等高线 |
| 组合布局 | 5 | 插图、断轴、边际分布与多面板 |

每张图的 TeX、PDF 和 PNG 位于[示例目录](https://github.com/HomuraT/tikz-paper-figure/tree/694c0be/skills/tikz-paper-figure/assets/examples/classic)。先按结构挑选接近的模板，再替换数据、坐标轴和标注，比从空白画布逐项配置更方便。

## 共同能力

样式包统一字体、线宽、标记点、网格和图例，也提供区间底色、文字描边与组合图辅助组件。相同对象在不同面板中保持同色，图例和统计框的位置仍需结合数据安排。

classic 是本项目的名称，取用了 Matplotlib 2 以后默认外观的若干特征。Matplotlib 自身的 `plt.style.use('classic')` 恢复的是 1.x 风格，参见[官方样式变更说明](https://matplotlib.org/2.0.0/users/dflt_style_changes.html)。原有 `plotfig.sty` 则采用 Source Sans Pro 与固定语义配色，两套样式适合不同的论文配图语境。

数据计算与版面安排分开处理：NumPy 计算拟合、残差、核密度和箱线统计；pgfplots 绘制数据、文字与面板。较长序列写入 `.dat` 文件，部分短坐标、拟合参数和统计量仍需从脚本输出手工粘贴到 TeX。数据变化后，应一并核对参数框和文字，现有流程没有自动同步所有数值。

## 获取与开始使用

先安装 Git、Python 3.9+ 和 TeX Live 2023+（或 MiKTeX），将 `latexmk`、`pdflatex`、Poppler 的 `pdfinfo` 与 `pdftoppm` 加入 PATH。classic 示例需要 `standalone`、TikZ、pgfplots 1.18+、DejaVu 字体、`mathastext` 和 `contour`。NumPy 只在重新计算示例数据时需要；已有校准示例可以直接编译。等高线示例另需 LuaLaTeX。

下面从[项目仓库](https://github.com/HomuraT/tikz-paper-figure)获取代码，并固定到本文使用的版本。命令在 Bash 或 PowerShell 中逐行执行；若 Python 命令名为 `python3`，将后两行的 `python` 相应替换。

```bash
git clone https://github.com/HomuraT/tikz-paper-figure.git
git -C tikz-paper-figure checkout 694c0be
cd tikz-paper-figure/skills/tikz-paper-figure
python scripts/check_env.py
python scripts/build_figure.py assets/examples/classic/calibration.tex --png-dir previews
```

环境检查会列出工具和宏包是否可用，缺失项应先补齐。构建脚本通过 `latexmk` 编译，在示例目录生成 `calibration.pdf`，将 300 dpi 预览保存为 `previews/calibration.png`，并打印页面尺寸和宽度检查结果。打开 PNG 检查文字、图例与数据，再把 PDF 用于论文。脚本会自动设置样式包搜索路径，因此上述命令无须先将 `.sty` 安装到 TeX 系统目录。

若需要 Claude Code 调用，将下载仓库中的整个 `skills/tikz-paper-figure` 文件夹复制到论文项目的 `.claude/skills/tikz-paper-figure/`，先创建缺少的父目录。随后可请求：“使用 tikz-paper-figure，把这份 CSV 画成 classic 风格的校准曲线，保留可编辑源码，并编译 PDF 和 PNG。”同时提供数据、轴名和目标栏宽。该安装入口来自[仓库说明](https://github.com/HomuraT/tikz-paper-figure/blob/694c0be/README.zh-CN.md)。

开始自己的图时，将选中的 `.tex`、`assets/classicfig.sty` 和所需的 `data/` 文件复制到论文的 `figures/` 目录，保持相对路径，再用同一构建脚本编译新 `.tex`。在论文中加载 `graphicx`，通过 `\includegraphics{figures/图名.pdf}` 引入按目标尺寸设计的 PDF。组件选项见 [classic 使用说明](https://github.com/HomuraT/tikz-paper-figure/blob/694c0be/skills/tikz-paper-figure/references/classic.md)。

默认单图坐标轴为 7.4 × 4.7 cm，最终 PDF 还包含标签与外边距。按论文栏宽检查文字大小、图例遮挡、误差条定义和统计参数来源；页面宽度检查无法代替人工审图。仓库提供现成渲染产物，agent 对照验收任务尚未记录运行结果。

本次扩展对应提交 [`352094e`](https://github.com/HomuraT/tikz-paper-figure/commit/352094e)。通用流程见[论文配图规范](/posts/tech/latex/tikz-paper-figure/)，关系图模板见 [ontology 图册](/posts/tech/latex/tikz-ontology-diagrams/)。
