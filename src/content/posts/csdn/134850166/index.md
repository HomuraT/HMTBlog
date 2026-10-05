---
title: "Iterative Entity Alignment via Knowledge Embeddings"
published: 2023-12-07
description: ''
image: ''
tags: ["自然语言处理", "论文笔记"]
category: "论文或资源整理"
draft: false
lang: 'zh-CN'
---

# Iterative Entity Alignment via Knowledge Embeddings

Tags: Entity Alignment
Authors: Hao Zhou, Maosong Sun, Ruobing Xie, Zhiyuan Liu
Created Date: December 6, 2023 3:39 PM
Finished Date: 2023/12/07
Status: Reading
organization: Jiangsu Normal University, Tsinghua University
publisher : IJCAI
year: 2017
code: https://github.com/thunlp/IEAJKE

# 介绍

本文的任务是实体对齐，目的是将两个知识图谱的实体和关系进行对齐（假设范围相同）。

之前的方法往往依赖于实体的外部知识库，比如维基百科，因此需要花费大量的资源来手动构造特征以完成对齐。

本文提出了一个基于联合知识嵌入的方法。根据少量的已对齐实体，将不同知识图谱的实体和关系编码到同一个低纬度语义空间。

# 方法

流程主要包括三部分：1）知识嵌入，2）联合嵌入，3）迭代对齐

1）知识嵌入：使用KGE的方法TransE和PTransE来学习嵌入

2）联合嵌入：

学习一个特殊嵌入作为知识图谱的迁移特征

Translation-based Model


![在这里插入图片描述](/images/csdn/2ae247e588fc9e9d0b37f275.png)

Linear Transformation Model

![在这里插入图片描述](/images/csdn/e6591cd37390310ac9d87de8.png)




Parameter Sharing Model
![在这里插入图片描述](/images/csdn/93151879be50a5fbf3c0b0dc.png)



文章中最终采用的是Parameter Sharing Model这种方式，因为其简单高效。

3）迭代对齐

前两个步骤，可以将不同知识图谱的实体映射到同一个语义空间。

作者提出了两个对齐方式

**Hard Alignment**

![在这里插入图片描述](/images/csdn/ff94e15c5895896877d560f7.png)
![在这里插入图片描述](/images/csdn/9fbb2cdfbdcea09d3247dfec.png)



直接计算两个实体的距离，然后使用一个阈值判断是否为同一个实体

但这个方法不太灵活，因此作者还提出了Soft Alignment

**Soft Alignment**
![在这里插入图片描述](/images/csdn/ecb7e6dcf4fa4ebf06e2e8cb.png)

![在这里插入图片描述](/images/csdn/1a5faa5081c53a53d6c0f738.png)




其中R(e1, e2)表示是同一个实体的可信度

U表示三元组的损失函数

H(e1, e2)表示两个实体替换的可能性（将两个实体替换并计算周边损失，越小越可能）

IS表示Soft Alignment的最终得分，同时也是一个损失函数

最后会把IS和阈值做对比，小于阈值就预测为相同实体

整体损失

![在这里插入图片描述](/images/csdn/b9238c192573a0032931cd26.png)


K为知识嵌入损失，J为联合嵌入损失，I为对齐损失

需要注意的是，如果联合嵌入使用 Parameter Sharing Model方式，则J恒等于0；如果迭代对齐使用 Hard Alignment 的方式，则I恒等于0。

# 实验

![在这里插入图片描述](/images/csdn/0a0bb67bcb1717441f69ade8.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/134850166)
