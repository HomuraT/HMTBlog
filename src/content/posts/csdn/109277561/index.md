---
title: "链表栈和队列的实现"
published: 2020-10-25
description: ''
image: ''
tags: ["数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 链表栈和队列
## 栈
```c
#include "nodes.h"
// 链表栈
/*
带头指针，头指针的值表示栈的深度
*/
// 链表栈
/*
带头指针，头指针的值表示栈的深度
*/
SNode* createStack()
{
    return createSNode(0);
}

// 入栈
void stack_push(SNode* shead, SNode* value)
{
    addSNodeToTheNext(shead, value);
    shead->value++;
}

// 出栈
SNode* stack_pop(SNode* shead)
{
    if(shead->value == 0)
    {
        return NULL;
    }

    shead->value--;
    return deleteSNode(shead, shead->next);
}

// 获得栈的深度
int stack_getLen(SNode* shead)
{
    return shead->value;
}

```

## 队列
```c
#include "nodes.h"
// 链式队列，f是头指针，r是尾指针
typedef struct
{
    struct SNode* f;
    struct SNode* r;
}Queue;

// 获得队列长度
int queue_getLen(Queue* q)
{
    SNode* f = q->f;
    return f->value;
}

/*
头指针的值表示队列的长度
*/
Queue* createQueue()
{
    Queue* q = (Queue* )malloc(sizeof(Queue));
    q->f = createSNode(0);
    q->r = q->f;
    return q;
}

// 入队列
void queue_push(Queue* q, SNode* newNode)
{
    SNode* f = q->f;
    f->value++; // 队列长度加1

    // 在尾指针后面添加一个结点，并让尾指针往后移
    addSNodeToTheNext(q->r, newNode);
    q->r = newNode;
}

// 出队列
SNode* queue_pop(Queue* q)
{
    if(queue_getLen(q) == 0) // 出队列前队列长度为0
    {
        return NULL;
    }

    SNode* f = q->f;
    f->value--;

    SNode* result = deleteSNode(f, f->next);

    if(queue_getLen(q)==0) // 出队列后队列长度为0
    {
        q->r = q->f;
    }

    return result;
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109277561)
