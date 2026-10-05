---
title: "用邻接矩阵和邻接表创建图"
published: 2020-10-27
description: ''
image: ''
tags: ["C", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 邻接矩阵
```c
// 创建图邻接矩阵
/*
g：初始矩阵
arr：n%3=0表示起点，n%3=1表示终点，n%3=2表示权值
arrLen：表示arr的长度
haveDi：0 表示无向，非0 表示有向
*/
void graph_createAdjacencyMatrixByArrWithWeight(int **g, int* arr, int arrLen, int haveDi)
{
    for(int i = 0; i < arrLen; i += 3)
    {
        g[arr[i]][arr[i+1]] = arr[i+2];
        if(!haveDi)
        {
            g[arr[i+1]][arr[i]] = arr[i+2];
        }
    }
}

// 创建nxn的二维数组，并全部初始化为value
int** graph_createArrInValue(int n, int value)
{
    int **arr = (int **)malloc(sizeof(int *) * n);
    for(int i = 0; i < n; i ++)
    {
        arr[i] = (int *)malloc(sizeof(int) * n);
        for(int j = 0; j < n; j ++)
        {
            arr[i][j] = value;
        }
    }
    return arr;
}

// 打印矩阵
/*
g：表示邻接矩阵
n：表示结点个数
*/
void graph_print(int **g, int n, char* pattern)
{
    for(int i = 0; i < n; i ++)
    {
        for(int j = 0; j < n; j++)
        {
            printf(pattern, g[i][j]);
        }
        printf("\n");

    }
}
```

# 邻接表
```c
// 边结点
typedef struct
{
    int adjvex; // 另一个结点的索引
    struct ArcNode* nextarc; // 下一个边结点
    int value; // 权值
}ArcNode;

// 头节点
typedef struct
{
    struct ArcNode* firstarc; // 第一个边结点
}VertexNode;

// 创建边结点
ArcNode* graph_list_createArcNode(int adjvex, int value)
{
    ArcNode* node = (ArcNode*)malloc(sizeof(ArcNode));
    node->nextarc = NULL;
    node->adjvex = adjvex;
    node->value = value;
    return node;
}

// 创建头节点
VertexNode* graph_list_createVertexNode()
{
    VertexNode* node = (VertexNode* )malloc(sizeof(VertexNode));
    node->firstarc = NULL;
    return node;
}

// 创建头节点数组
VertexNode* graph_list_VerArr(int n)
{
    VertexNode** arr = (VertexNode** )malloc(sizeof(VertexNode*) * n);
    for(int i = 0; i < n; i ++)
    {
        arr[i] = graph_list_createVertexNode();
    }
    return arr;
}


// 向头节点后添加边结点
void graph_list_addArc(VertexNode* ver, ArcNode* arc)
{
    arc->nextarc = ver->firstarc;
    ver->firstarc = arc;
}

// 创建无向图邻接表
/*
vers：头节点数组
arr：n%3=0表示起点，n%3=1表示终点，n%3=2表示权值
arrLen：表示arr的长度
haveDi：0 表示无向，非0 表示有向
*/
void graph_list_createAdjacencyMatrixByArrWithWeight(VertexNode** vers, int* arr, int arrLen, int haveDi)
{
    for(int i = 0; i < arrLen; i += 3)
    {
        graph_list_addArc(vers[arr[i]], graph_list_createArcNode(arr[i+1], arr[i+2]));
        if(!haveDi)
        {
            graph_list_addArc(vers[arr[i+1]], graph_list_createArcNode(arr[i], arr[i+2]));
        }
    }
}

// 打印邻接表
void graph_list_print(VertexNode** vers, int len, char* pattern_ver, char* pattern_arc)
{
    for(int i = 0; i < len; i ++)
    {
        ArcNode* arc = vers[i]->firstarc;
        printf(pattern_ver, i);
        while(arc)
        {
            printf(pattern_arc, arc->adjvex, arc->value);
            arc = arc->nextarc;
        }
        printf("\n");
    }
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109321641)
