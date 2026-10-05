---
title: "二叉树遍历递归与非递归实现"
published: 2020-10-25
description: ''
image: ''
tags: ["数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# 先序遍历
```c
// 二叉树遍历
// 先序遍历
void preOrder(TreeNode* r, char* pattern)
{
    if(r == NULL)
    {
        return;
    }

    printf(pattern, r->value);
    preOrder(r->lchild,pattern);
    preOrder(r->rchild,pattern);
}

// 先序遍历非递归实现
void preOrder_noRecursion(TreeNode* r, char* pattern)
{
    TreeNode* current = r;
    TreeNode* s[100];
    int i = 0;
    s[0] = r;
    while(i != -1)
    {
        current = s[i--];
        printf("%d ", current->value);
        if(current->rchild) s[++i] = current->rchild;
        if(current->lchild) s[++i] = current->lchild;
    }
}
```
## 中序遍历
```c
// 中序遍历
void inOrder(TreeNode* r, char* pattern)
{
    if(r==NULL)
    {
        return;
    }

    inOrder(r->lchild,pattern);
    printf(pattern, r->value);
    inOrder(r->rchild,pattern);
}

// 中序遍历非递归实现
void inOrder_noRecursion(TreeNode* r, char* pattern)
{
    TreeNode* current = r;
    TreeNode* s[100];
    int i = -1;
    do
    {
        while(current) // 一直找左子树直到为空
        {
            s[++i] = current;
            current = current->lchild;
        }

		// 等于最后一个左子树或已经访问完左子树的根节点，也就是需要输出的根结点
        current = s[i--];
        printf("%d ", current->value);
        if(current->rchild) // 如果有右子树子，对右子树进行遍历
        {
            current = current->rchild;
        }
        else
        {
            /*
            如果没有右子树，将当前树置空，
            这样就在下次出栈时得到下一个需要访问的树，
            并且会跳过左子树的访问
            */
            current = NULL;
        }

    }while(i != -1 || current);
    // 当栈空但当前结点不为空时，当前树是下一个要访问的结点
}

```

## 后序遍历
```c
// 后序遍历
void postOrder(TreeNode* r, char* pattern)
{
    if(r==NULL)
    {
        return;
    }

    postOrder(r->lchild,pattern);
    postOrder(r->rchild,pattern);
    printf(pattern, r->value);
}

// 后序遍历非递归实现
void postOrder_noRecursion(TreeNode* r, char* pattern)
{
    TreeNode* current = r;
    TreeNode* past = NULL;
    TreeNode* s[100];
    int i = -1;

    // 先到最左的结点
    while(current)
    {
        s[++i] = current;
        current = current->lchild;
    }

    while(i != -1)
    {
        current = s[i--];
        // 如果上次访问过右子树或右子树为空，则输出当前值
        if(current->rchild == NULL || current->rchild == past)
        {
            printf(pattern, current->value);
            past = current;
        }
        else // 如果上次访问的是左子树
        {
            // 到右子树的最左的结点
            s[++i] = current;
            // 此时根节点必有右子树，若没有则会直接在if中输出
            current = current->rchild;
            while(current)
            {
                s[++i] = current;
                current = current->lchild;
            }
        }
    }
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109277178)
