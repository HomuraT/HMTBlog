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

<div class="figure-aside">

![AI 生成的晓美焰主题插画，角色旁有抽象科学曲线，作为图册点缀而非实验结果](./images/homura.png)

</div>

*晓美焰主题插画由 AI 生成；画面中的曲线仅作装饰。*

## 快速使用

在 skill 目录中检查环境并构建选中的示例：

```bash
python scripts/check_env.py
python scripts/build_figure.py assets/examples/classic/calibration.tex --png-dir previews
```

复用时保留示例所需的 `.dat` 相对路径，并在自己的工作副本中修改数据。classic 使用 DejaVu 字体、`mathastext` 和 `contour`；等高线示例 `contour.tex` 的文件头指定 LuaLaTeX。完整选项见 [classic 使用说明](https://github.com/HomuraT/tikz-paper-figure/blob/694c0be/skills/tikz-paper-figure/references/classic.md)。

默认单图坐标轴为 7.4 × 4.7 cm，最终 PDF 还包含标签与外边距。按论文栏宽检查文字大小、图例遮挡、误差条定义和统计参数来源；页面宽度检查无法代替人工审图。仓库提供现成渲染产物，agent 对照验收任务尚未记录运行结果。

本次扩展对应提交 [`352094e`](https://github.com/HomuraT/tikz-paper-figure/commit/352094e)。通用流程见[论文配图规范](/posts/tech/latex/tikz-paper-figure/)，关系图模板见 [ontology 图册](/posts/tech/latex/tikz-ontology-diagrams/)。
