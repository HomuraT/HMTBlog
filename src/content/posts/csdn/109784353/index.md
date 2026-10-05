---
title: "AOE网与关键路径、关键路径算法"
published: 2020-11-18
description: ''
image: ''
tags: ["算法", "C", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# AOE网与关键路径

在一个表示工程的带权有向图中，用顶点表示事件，用有向边表示活动，边上的权值表示活动持续的时间，称这样的有向图为边表示活动的网，简称 **AOE网**(activity on edge network)。AOE网中没有入边的顶点称为**源点**，没有出边的顶点称为**终点**。AOE网具有以下两个性质：

1. 只有在进入某顶点的各种活动都已经结束，该顶点表示的事件才能发生。
2. 只有在某顶点所代表的事件发生后，从该顶点出发的活动才能开始。

如果用AOE网络来表示一项工程，那么，仅仅考虑各个活动之间的优先关系还不够，更多的是关心整个工程完成的最短时间是多少；那些活动延期将会影响整个工程的进度，而加速这些活动是否会提高整个工程的效率。

由于AOE网中的某些活动能够同时进行，故完成整个工程所必须花费的时间应该为始点到终点的最大路径长度（这里的路径长度是指该路径上的各个活动所持续的时间之和）。具有最大路径长度的路径称为**关键路径**，关键路径上的活动称为**关键活动**。关键路径长度是整个工程所需的最短工期。也就是说，要缩短整个工期，必须加快关键活动的进度。

# 关键路径算法

想要找到关键路径，需要计算四组数据，①事件的最早发生时间，②事件的最晚发生时间，③活动$a_i$的最早开始时间，④活动$a_i$的最晚结束时间。当存在 $a_i的最在开始时间 = a_i最晚结束时间$ 时，$a_i$就包含在关键路径里面。

## 事件最早发生时间 ve[k]

ve[k] 是指源点到顶点 $v_k$ 的最大路径长度，这和长度决定了所有顶点从 $v_k$ 出发的活动可以开始的最早时间。具AOE网的性质，只有进入 $v_k$ 的所有活动 $<v_j, v_k>$ 都结束时， $v_k$ 代表的事件才能发生，而活动 $<v_j, v_k>$ 的最早结束时间为 $ve[j] + len<v_j, v_k>$。所计算的最早发生时间的方法如下：

$\begin{cases}ve[0]=0\\ve[k] = max\{ve[j] + len<v_j,v_k>\}\end{cases}$ 

也就是计算从源点到这个顶点的最长路径，跟最短路径算法思路一样。

**局部代码：**

```c
// 事件最早发生时间
int* ve = utils_createArr(n,0);
// 把源点入队列
queue_push(v_queue, createSNode(0));
while(queue_getLen(v_queue))
{
    v = queue_pop(v_queue)->value;
    for(int i = 0; i < n; i ++)
    {
        if(g[v][i] != -1)
        {
            queue_push(v_queue, createSNode(i));
            // 当存在比现存时间更晚时，替换
            if(ve[v] + g[v][i] > ve[i] )
            {
                ve[i] = ve[v] + g[v][i];
            }
        }
    }
}
```

## 事件的最迟发生时间 vl[k]

vl[k] 是指在不推迟整个工期的前提下，事件 $v_k$ 允许的最晚发生时间。有向边 $<v_k,v_j>$ 代表从 $v_k$ 出发的活动，为了不拖延整个工期， $v_k$ 发生的最迟事件必须保证不推迟从事件 $v_k$ 出发的活动 $<v_k, v_j>$  的终点 $v_j$ 的最迟时间 vl [ j ] 。vl [ k ] 的计算方法如下：

$\begin{cases}vl[n-1]=ve[n-1]\\vk[k]=min\{vl[j]-len<v_k,v_j>\}\end{cases}$

也就是 $当前顶点的最迟发生时间=终点的最早发生时间-当前顶点到终点的最长路径$

**局部代码：**

```c
// 事件最迟发生的时间
// 把初值赋为最大的时间，方便比较
int* vl = utils_createArr(n, ve[v]);
// 终点的最早结束时间等于最迟发生时间
vl[v] = ve[v];

// 把终点入队列，经过 上面运算，v指向AOE网终点
queue_push(v_queue, createSNode(v));
while(queue_getLen(v_queue))
{
    v = queue_pop(v_queue)->value;
    for(int i = 0; i < n; i ++)
    {
        if(g[i][v] != -1)
        {
            queue_push(v_queue, createSNode(i));
            // 当存在比现存时间更早时，替换
            if(vl[v] - g[i][v] < vl[i])
            {
                vl[i] = vl[v] - g[i][v];
            }
        }
    }
}
```

## 活动 $a_i$ 的最早开始时间 ee[i]

若活动 $a_i$ 由有向边 $<v_k, v_j>$ 表示，根据AOE网的性质，只有事件 $v_k$ 发生了，活动 $a_i$ 才能开始。也就是说，活动 $a_i$ 的最早开始时间等于事件 $v_k$ 的最早发生事件。因此有：

$ee[i] = ve[k]$

**局部代码：**

```c
/*
活动 ai 最早发生时间，i为从开始结点算起
从编号较低的结点到编号较高的结点
从指向编号较低的结点到指向编号较高的结点
*/
int* ee = utils_createArr(es, 0);
int* v_flag = utils_createArr(n, 1);
int ee_i = 0;

queue_push(v_queue, createSNode(0));
while(queue_getLen(v_queue))
{
    v = queue_pop(v_queue)->value;
    for(int i = 0; i < n; i ++)
    {
        if(g[v][i] != -1)
        {
            ee[ee_i++] = ve[v];
            if(v_flag[i])
            {
                queue_push(v_queue, createSNode(i));
                v_flag[i] = 0;
            }
        }
    }
}
```

## 活动 $a_i$ 的最晚开始时间 el[i]

el [ i ] 是指在不推迟整个工期的前提下，活动 $a_i$ 必须开始的最晚时间。若 $a_i$ 由有向边 $<v_k, v_j>$ 表示，则 $a_i$ 的最晚开始时间要保证事件 $v_j$ 的最迟延后时间不能后拖。因此有：

$el[i] = vl[j] - len<v_k, v_j>$

**局部代码：**

```c
/*
活动 ai 最迟发生时间
*/
int* el = utils_createArr(es, 0);
int el_i = 0;

v_flag = utils_createArr(n, 1);
queue_push(v_queue, createSNode(0));

while(queue_getLen(v_queue))
{
    v = queue_pop(v_queue)->value;
    for(int i = 0; i < n; i ++)
    {
        if(g[v][i] != -1)
        {
            el[el_i++] = vl[i] - g[v][i];
            if(v_flag[i])
            {
                queue_push(v_queue, createSNode(i));
                v_flag[i] = 0;
            }
        }
    }

}
```

## 完整代码实现和测试结果

**完整代码：**

```c
// 关键路径
/*
g：邻接矩阵
n：顶点个数
es：边的个数

return：返回关键路径邻接矩阵
*/
int** graph_criticalPath(int** g, int n, int es)
{

    // 队列
    Queue* v_queue = createQueue();
    // 用来记录顶点下标的变量
    int v;

    // 事件最早发生时间
    int* ve = utils_createArr(n,0);
    // 把源点入队列
    queue_push(v_queue, createSNode(0));
    while(queue_getLen(v_queue))
    {
        v = queue_pop(v_queue)->value;
        for(int i = 0; i < n; i ++)
        {
            if(g[v][i] != -1)
            {
                queue_push(v_queue, createSNode(i));
                // 当存在比现存时间更晚时，替换
                if(ve[v] + g[v][i] > ve[i] )
                {
                    ve[i] = ve[v] + g[v][i];
                }
            }
        }
    }

    // 事件最迟发生的时间
    // 把初值赋为最大的时间，方便比较
    int* vl = utils_createArr(n, ve[v]);
    // 终点的最早结束时间等于最迟发生时间
    vl[v] = ve[v];

    // 把终点入队列，经过 上面运算，v指向AOE网终点
    queue_push(v_queue, createSNode(v));
    while(queue_getLen(v_queue))
    {
        v = queue_pop(v_queue)->value;
        for(int i = 0; i < n; i ++)
        {
            if(g[i][v] != -1)
            {
                queue_push(v_queue, createSNode(i));
                // 当存在比现存时间更早时，替换
                if(vl[v] - g[i][v] < vl[i])
                {
                    vl[i] = vl[v] - g[i][v];
                }
            }
        }
    }

    /*
    活动 ai 最早发生时间，i为从开始结点算起
    从编号较低的结点到编号较高的结点
    从指向编号较低的结点到指向编号较高的结点
    */
    int* ee = utils_createArr(es, 0);
    int* v_flag = utils_createArr(n, 1);
    int ee_i = 0;

    queue_push(v_queue, createSNode(0));
    while(queue_getLen(v_queue))
    {
        v = queue_pop(v_queue)->value;
        for(int i = 0; i < n; i ++)
        {
            if(g[v][i] != -1)
            {
                ee[ee_i++] = ve[v];
                if(v_flag[i])
                {
                    queue_push(v_queue, createSNode(i));
                    v_flag[i] = 0;
                }
            }
        }
    }


    /*
    活动 ai 最迟发生时间
    */
    int* el = utils_createArr(es, 0);
    int el_i = 0;

    v_flag = utils_createArr(n, 1);
    queue_push(v_queue, createSNode(0));

    while(queue_getLen(v_queue))
    {
        v = queue_pop(v_queue)->value;
        for(int i = 0; i < n; i ++)
        {
            if(g[v][i] != -1)
            {
                el[el_i++] = vl[i] - g[v][i];
                if(v_flag[i])
                {
                    queue_push(v_queue, createSNode(i));
                    v_flag[i] = 0;
                }
            }
        }

    }

    // 创建一个没有边的邻接矩阵
    int** g_cp = utils_create2DArr(n,n,-1);
    // 记录已经计算边数，用来计算是否为关键路径
    int cp_i = 0;
    for(int i = 0; i < n; i ++)
    {
        for(int j = 0; j < n; j ++)
        {
            if(g[i][j] != -1)
            {
                if(el[cp_i] - ee[cp_i] == 0)
                {
                    // 当活动最早发生时间=最晚发生时间，此活动在关键路径上
                    g_cp[i][j] = g[i][j];
                }
                cp_i++;
            }
        }
    }

    return g_cp;
}
```

**测试样例：**
![在这里插入图片描述](/images/csdn/98ee2de74b61514a6fc7dafb.png) 

**测试代码：**

```c
#define N 9
#define M 33

int main()
{
    // 边数组，i%3=0 表示起点；i%3=1 表示终点；i%3=2 表示权值
    int arr[M] = {0,1,6,0,2,4,0,3,5,1,4,1,2,4,1,3,5,2,4,6,9,4,7,7,5,7,4,6,8,2,7,8,4};
    int** g = graph_createArrInValue(N, -1);
    // 创建相关邻接矩阵
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, M, 1);

    printf("原图邻接矩阵：\n");
    graph_print(g, N, "%3d ");

    int** g_cp = graph_criticalPath(g,N,M/3);
    printf("关键路径邻接矩阵：\n");
    graph_print(g_cp, N, "%3d ");
    return 0;
}
```

**运行结果：** 

![在这里插入图片描述](/images/csdn/e19e50d292e60c6c5611ae2e.png) 

**关键路径展示：**
![在这里插入图片描述](/images/csdn/a6e1aabe7c1c4c0397756180.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109784353)
