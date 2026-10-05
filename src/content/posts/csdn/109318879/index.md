---
title: "不用栈的二叉树中序遍历"
published: 2020-10-27
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 不用栈的二叉树中序遍历
```c
// 中序遍历非栈非递归
void inOrder_noRecursion_noStack(TreeNode* r, char* pattern)
{
    TreeNode* current = r;
    while(current)
    {
        if(current->lchild == NULL)
        {
            // 当前节点没有左孩子，所以是应该访问的结点
            printf(pattern, current->value);
            current = current->rchild;
        }
        else
        {
            TreeNode* past = current->lchild;
            // past一直到最右下
            while(past->rchild != NULL && past->rchild != current)
                past = past->rchild;

            if(past->rchild == NULL)
            {
                // 此时current是past的后继结点，建立链接方便下次找到后继节点
                past->rchild = current;
                current = current->lchild;
            }
            else
            {
                /*
                此时past的右孩子指向后继节点，所以是第二次访问
                代表当前结点的左子树已经访问完毕，所以访问当前结点
                然后把指针移到后继或者右子树，并消除多余链接
                */
                printf(pattern, current->value);
                past->rchild = NULL;
                current = current->rchild;
            }
        }
    }
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109318879)
