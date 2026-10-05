---
title: "循环单链表和循环列表解决约瑟夫问题"
published: 2020-10-27
description: ''
image: ''
tags: ["数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# 循环单链表

```c
// 创建循环链表
SNode* createCLink(int value)
{
    SNode* cList = createSNode(value);
    cList->next = cList;
}

// 循环列表输出
void cLink_print(SNode* clink, char* pattern)
{
    SNode* p = clink;
    do
    {
        printf(pattern, p->value);
        p = p->next;
    }while(clink != p->next);
}
```



# 循环列表解决约瑟夫问题

```c
// 约瑟夫问题
// n：规定的数
SNode* JosephusProblem(SNode* cLink, int n)
{
    int i = 0;
    /*
    因为只有头指针所以先加一
    当n为1或2时会有问题，其他情况没问题
    */
    i = (i+1)%n;
    cLink = cLink->next; // 跟上面同步往后移动
    while(cLink->next != cLink)
    {
        i = (i+1)%n;
        if(i == (2*n -1 )% n)
        {
            // 删除的同时数字要加一
            deleteSNode(cLink, cLink->next);
            i = (i+1)%n;
        }
        cLink = cLink->next;
    }
    return cLink;
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109319640)
