---
title: "C语言一些常用结点和结点操作"
published: 2020-10-22
description: ''
image: ''
tags: ["C"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# C语言练习用的一些常用结点和操作
## 单列表
```c
// 单列表结点
typedef struct
{
    int value;
    struct SNode* next;
}SinglyLinkedListNode,SLLNode,SNode;

/*
value：新单列表结点的值
return：新结点，next会被赋值为空
*/
SNode* createSNode(int value)
{
    SNode* node = (SNode*)malloc(sizeof(SNode));
    node->value = value;
    node->next = NULL;
    return node;
}

/*
targetNode：要在后面加结点的结点
newNode：要加的结点
*/
void addSNodeToTheNext(SNode* targetNode, SNode* newNode)
{
    newNode->next = targetNode->next;
    targetNode->next = newNode;
}

/*
targetNode：要在后面加结点的结点
sList：要加在后面的列表
*/
void addSListToTheNext(SNode* targetNode, SNode* sList)
{
    targetNode->next = sList;
}

/*
pastNode：要删除的结点的上一个结点
return：返回删除的结点，此结点next置空
*/
SNode* deleteNextSNode(SNode* pastNode)
{
    SNode* targetNode = pastNode->next;
    pastNode->next = targetNode->next;
    targetNode->next = NULL;
    return targetNode;
}

/*
arr：要创建列表的值
len：列表的长度
*/
SNode* createList(int* arr, int len)
{
    if(len <= 0)
    {
        return NULL;
    }

    SNode* node = createSNode(arr[0]);
    SNode* head = node;

    for(int i = 1; i < len; i ++)
    {
        addSNodeToTheNext(node, createSNode(arr[i]));
        node=node->next;
    }
    return head;
}

/*
head：要输出的列表的头
pattern：输出的格式
endstr： 输出结束后要输出的字符串
*/
void printSNodes(SNode* head, char* pattern, char* endstr)
{
    while(head != NULL)
    {
        printf(pattern, head->value);
        head = head->next;
    }
    printf(endstr);
}
```
## 双列表
```c
// 双列表结点
typedef struct
{
    int value;
    struct DNode* past;
    struct DNode* next;

}DulNode,DNode;

// 创建双向链表
DNode* dNode_create(int value)
{
    DNode* node = (DNode*)malloc(sizeof(DNode));
    node->value = value;
    node->next = NULL;
    node->past = NULL;
    return node;
}

// 向Next添加一个结点
void dNode_addNext(DNode* node, DNode* newNode)
{
    newNode->past = node;
    newNode->next = node->next;
    if(node->next)
    {
        DNode* tmp = node->next;
        tmp->past = newNode;
    }
    node->next = newNode;
}

// 向Past添加一个结点
void dNode_addPast(DNode* node, DNode* newNode)
{
    newNode->next = node;
    newNode->past = node->past;
    if(node->past)
    {
        DNode* tmp = node->past;
        tmp->next = newNode;
    }
    node->past = newNode;
}

// 删除后一个结点
DNode* dNode_deleteNext(DNode* dNode)
{
    DNode* nextNode = dNode->next;
    dNode->next = nextNode->next;
    if(nextNode->next)
    {
        DNode* tmp = nextNode->next;
        tmp->past = dNode;
    }

    nextNode->next = NULL;
    nextNode->past = NULL;
    return nextNode;
}

// 删除前一个结点
DNode* dNode_deletePast(DNode* dNode)
{
    DNode* pastNode = dNode->past;
    dNode->past = pastNode->past;
    if(pastNode->past)
    {
        DNode* tmp = pastNode->past;
        tmp->next = dNode;
    }

    pastNode->next = NULL;
    pastNode->past = NULL;
    return pastNode;
}

// 输出双链表
void dNode_print(DNode* dNode, char* pattern_next, char* pattern_past)
{
    printf("next:");
    DNode* tmp = dNode;
    while(tmp)
    {
        printf(pattern_next, tmp->value);
        tmp = tmp->next;
    }
    printf("\npast:");
    tmp = dNode;
    while(tmp)
    {
        printf(pattern_past, tmp->value);
        tmp = tmp->past;
    }
}
```

## 二叉树结点
```c
// 二叉树结点
typedef struct
{
    int value;
    struct TreeNode* lchild;
    struct TreeNode* rchild;
}TreeNode;

// 创建树节点
TreeNode* createTreeNode(int value)
{
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->value = value;
    node->lchild = NULL;
    node->rchild = NULL;
}

// 添加孩子结点
void addTreeNodeChild(TreeNode* parent, TreeNode* chlid, char RorL)
{
    if(RorL == 'r')
    {
        parent->rchild = chlid;
    }
    else
    {
        parent->lchild = chlid;
    }
}

// 删除孩子结点
TreeNode* deleteTreeNodeChild(TreeNode* parent, char RorL)
{
    TreeNode* result;
    if(RorL == 'r')
    {
        result = parent->rchild;
        parent->rchild = NULL;
    }
    else
    {
        result = parent->lchild;
        parent->lchild = NULL;
    }

    return result;
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109231737)
