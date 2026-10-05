---
title: "平衡二叉树——AVL树"
published: 2020-11-08
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 平衡二叉树
## 平衡二叉树的定义
平衡二叉树是一棵空的二叉排序树，或者是具有下列性质的二叉排序树
1. 根节点的左子树和右子树的深度最多相差1
2. 根节点的左子树和右子树也是平衡二叉树

## 平衡因子
结点的平衡因子是该节点左子树和右子树的深度之差，如下图，每个结点里所注的数字是该节点的平衡因子
![在这里插入图片描述](/images/csdn/4e3cc5c69c881fa7e314461d.png)
## 最小不平衡子树
最小不平衡子树是指在平衡二叉树的构造过程中，以距离插入结点最近的、且平衡因子绝对值大于1的结点为根的子树。

# 平衡化旋转
## LL型
![LL型](/images/csdn/e1c874c12f685e6caf97cc2a.png)
## RR型
![RR](/images/csdn/bd46c9b257659e9831a06f2a.png)
## LR型
![LR](/images/csdn/d3ef435824595a2b8c1a0dc5.png)
## RL
![RL](/images/csdn/1c1b54756560c962c54adb51.png)

# 平衡树创建例子
按{20，35，40，15，30，25，38}创建平衡树
![在这里插入图片描述](/images/csdn/3fd587bcddcf579e4969d034.png)
![在这里插入图片描述](/images/csdn/54b43eab1f9805f33e2c49de.png)
![在这里插入图片描述](/images/csdn/fc58980f017c09200c40400b.png)
![在这里插入图片描述](/images/csdn/3a692676f3cb5f2d32047815.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109563717)
