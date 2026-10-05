---
title: "二叉树创建"
published: 2020-10-23
description: ''
image: ''
tags: ["数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 二叉树创建
```c
// 通过数组创建二叉树，0表示没有结点
TreeNode* createTreeByArr(int* arr, int len)
{

    TreeNode* root= createTreeNode(arr[0]);
    createTreeByArr_main(arr, len, 1, root ,'l');
    createTreeByArr_main(arr, len, 2, root ,'r');
    return root;
}

// 递归创建二叉树
void createTreeByArr_main(int* arr,int len , int i, TreeNode* parent, char RorL)
{
    if(i >= len || arr[i]==0)
    {
        // 越界了或没有结点
        return;
    }

    TreeNode* node = createTreeNode(arr[i]);

    if(RorL == 'r')
    {
        parent->rchild = node;
    }
    else
    {
        parent->lchild = node;
    }
    createTreeByArr_main(arr, len, 2*(i+1)-1, node, 'l');
    createTreeByArr_main(arr, len, 2*(i+1), node, 'r');
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109251113)
