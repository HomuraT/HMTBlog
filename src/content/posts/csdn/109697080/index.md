---
title: "最短路径、Dijkstra算法、Floyd算法"
published: 2020-11-14
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# 最短路径

在**非网图**中，最短路径是指两个顶点之间经历的**边数最少**的路径，路径上的第一个顶点称为**源点**，最后一个顶点称为**终点**。

在**网图**中，最短路径是指两点之间经历的边上的**权值之和最少**的路径。



## Dijkstra算法

Dijkstra算法用于求单源点路径问题，问题描述如下：给定带权有向图 $G=(V,E)$ 和源点 $v \in V$，求从v到G中其余各顶点的最短路径。

迪杰斯特拉提出了一个按路径长度递增的次序产生最短路径的算法，其基本思想是：设置一个集合 S 存放已经找到最短路径的顶点，S的初始状态只包含源点 $v$，对 $v_i \in V-S$ ，假设从源点 $v,...,v_k$ ，就将 $v_k$ 加入集合 S 中，并将路径 $v,...,v_k$， $v_i$ 与原来的假设相比较，取路径长度较小者为当前最短路径。



**最短路径：**

```c
// Dijkstra最短路径
/*
g：邻接矩阵
n：顶点个数
v_start：源点

return：源点到其他点的最短路径经过的结点
*/
int** graph_shortestPath_Dijkstra(int** g, int n, int v_start)
{
    // 临时最短路进长度的数组
    int* arr_sp = utils_createArr(n, -1);
    // 存储路径
    int** arr_sp_path = utils_create2DArr(n,n,-1);

    // 初始化数组和路径
    for(int i = 0; i < n ; i ++)
    {
        // 如果可达，初始化路径
        if(i != v_start && g[v_start][i] != -1)
        {
            arr_sp_path[i][1] = i;
            arr_sp[i] = g[v_start][i];
            arr_sp_path[i][0] = v_start;
        }
    }

    // 标记源点为已经找到最短路径
    arr_sp[v_start] = 0;

    int counter = 0, k;
    while(++counter < n)
    {
        k = -1;
        // 找 未找到最短路径的最小值
        /*
        -1：表示无法抵达
        0：表示已经找到最短路径
        */
        for(int i = 0; i < n; i ++)
        {
            // 跳过不可抵达的和已经找到最短路径的点
            if(arr_sp[i] == -1 || arr_sp[i] == 0) continue;

            if(k == -1 || (k != -1 && arr_sp[i] < arr_sp[k])) k = i;
        }

        // 若不可达，跳过
        if(k == -1) continue;

        // 将 k 顶点加入集合
        for(int i = 0; i < n; i ++)
        {
            // 跳过不存在的边
            if(g[k][i] == -1) continue;
            // 跳过已经找到最短路径的边
            if(arr_sp[i] == 0) continue;

            // 若可得到更小的路径，替代之
            if(arr_sp[i] == -1 || arr_sp[k] + g[k][i] < arr_sp[i])
            {
                arr_sp[i] = arr_sp[k] + g[k][i];

                // 用新路径顶点覆盖老路径顶点
                int j = 0;
                for(; j < n; j ++)
                {
                    if(arr_sp_path[k][j] == -1) break;

                    arr_sp_path[i][j] = arr_sp_path[k][j];
                }

                // 将新顶点加入路径
                arr_sp_path[i][j] = i;
                // 在后面加上一个-1表终止
                if(j + 1 < n) arr_sp_path[i][j+1] = -1;

            }
        }

        // 记录结果并将 k 标记为已找到
        arr_sp[k] = 0;
    }

    return arr_sp_path;
}
```



**辅助函数：**

```c
// Dijkstra获得最短路径的值
/*
g：邻接矩阵
sp_path：
*/
int* graph_shortestPath_Dijkstra_getValue(int** g, int** sp_path, int n)
{
    int* sp_value = utils_createArr(n, 0);
    for(int i = 0; i < n; i ++)
    {
        for(int j = 0; j < n-1; j ++)
        {
            // 如果不可达，赋值为-1
            if(sp_path[i][0] == -1)
            {
                sp_value[i] = -1;
                break;
            }

            // 到最后一个路径结点
            if(sp_path[i][j+1] == -1) break;

            // 加上边的代价
            sp_value[i] += g[sp_path[i][j]][sp_path[i][j+1]];
        }
    }

    return sp_value;
}
```



**样例展示：**
![在这里插入图片描述](/images/csdn/dafef5379cf4103e69347e2c.png) 



**测试代码：**

```c
int main()
{
    int arr[21] = {0,1,10,0,3,30,0,4,100,1,2,50,2,4,10,3,2,20,3,4,60};
    int n = 5; // 结点个数
    int** g = graph_createArrInValue(n, -1);
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, 21, 1);

    printf("原图邻接矩阵：\n");
    graph_print(g, n, "%3d ");
    printf("\n");
    int** sp_path = graph_shortestPath_Dijkstra(g, n,0);

    printf("最短路径：\n");
    utils_print_2DArr(sp_path,n, n, "%3d");

    // 输出最短路径的值
    utils_print_arr(
        graph_shortestPath_Dijkstra_getValue(g,sp_path,n),
        0,n-1,"%3d","最短路径值：\n", "\n");

    return 0;
}
```



**运行结果：**
![在这里插入图片描述](/images/csdn/ef761f3a949d7e40c33a9b89.png)    



**参数变化图表：**
![在这里插入图片描述](/images/csdn/bd65e3c28ed7412e57334a02.png)



## Floyd算法

Floyd算法用于每一对顶点之间的最短路径问题，问题描述如下：给定带权有向图 $G=(V,E)$ ，对任意顶点 $v_i$ 到顶点 $v_j(i \not= j)$，求顶点 $v_i$ 到顶点 $v_j$ 的最短路径。

解决这个问题的一个办法是：每次以一个顶点为源点，调用 Dijkstra 算法 n 次，便可求得每一对顶点之间得最短路径，显然，时间复杂度为 $O(n^3)$ 。弗洛伊德提出了求每一对顶点之间的最短路径算法——Floyd算法，其时间复杂度也是 $O(n^3)$ ，但形式上要简单一些。

Floyd算法的基本思想：假设从 $v_i$ 到 $v_j$ 的弧（若从 $v_i$ 到 $v_j$ 的弧不存在，则将弧的权值看作 $\infin $ ）是最短路径，然后进行 n 次试探。首先比较 $v_i,v_j$ 和 $v_i,v_0,v_j$ 的路径长度，取长度较短者作为从 $v_i$ 到 $v_j$ 中间顶点的编号不大于0的最短路径。在路径上再增加一个帝国点 $v_1$ 将 $v_i,...,v_1,...,v_j$ 和已经得到的从  $v_i$ 到 $v_j$ 中间顶点的路径。以此类推，在一般情况下，若 $v_i,...,v_k$ 和 $v_k,...,v_j$ 分别是从 $v_i$ 到 $v_k$ 和 从 $v_k$ 到 $v_j$ 的中间顶点编号不大于 $k-1$ 的最短路径，则将 $v_i,...,v_k,...,v_j$ 和已经得到的从 $v_i$ 到 $v_j$ 中间结点的编号不大于 $k-1$ 的最短路径相比较，取长度较短者为从 $v_i$ 到 $v_j$ 中间顶点不大于 $k$  的最短路径。经过 $n$ 次比较后，最后求得的必是从 $v_i$ 到 $v_j$ 的最短路径。

就是假设有 $k$ 个顶点，编号为 $0\sim k-1$，以邻接矩阵为初始矩阵（到自身的路径要设为0），从编号为0的结点开始，一直到编号为 $k-1$ 的结点。设加入的结点编号为 $k$，要计算最短路径的结点为 $i$ 到 $j$ ，若存在 $i \rightarrow j < i \rightarrow k + k \rightarrow j$，则替换，否则不管。当把所有结点都加入的时候最短路径就计算完成了。

**代码实现：**

```c
// Floyd最短路径
/*
g：图的邻接矩阵
n：顶点个数

return：每个点的邻接矩阵
*/
int** graph_shortestPath_Floyd(int** g, int n)
{
    // 创建二维数组存储弗洛伊德最短路径
    int** sp_Floyd = utils_create2DArr(n,n,-1);

    // 初始化最短路径矩阵
    for(int i = 0; i < n; i ++)
    {
        for(int j = 0; j < n; j ++)
        {
            // 到自身距离设为 0
            if(i == j) sp_Floyd[i][j] = 0;
            else sp_Floyd[i][j] = g[i][j];
        }
    }

    for(int k = 0; k < n; k ++)
    {
        // 每次加入编号为 k 的结点
        for(int i = 0; i < n; i ++)
        {
            for(int j = 0; j < n; j ++)
            {
                // 当跟 k 没有路径时，跳过
                if(sp_Floyd[i][k] == -1 || sp_Floyd[k][j] == -1) continue;

                // 当不存在路径或当前最短路径大于新路径时，替换
                if(sp_Floyd[i][j] == -1 || 
                   sp_Floyd[i][j] > sp_Floyd[i][k] + sp_Floyd[k][j])
                {
                    sp_Floyd[i][j] = sp_Floyd[i][k] + sp_Floyd[k][j];
                }
            }
        }
    }

    return sp_Floyd;
}
```

 **测试样例：**

![在这里插入图片描述](/images/csdn/0fab91586af1f652d0a0cd05.png)

**测试代码：**

```c
int main()
{
    int arr[15] = {0,1,4,0,2,11,1,0,6,1,2,2,2,0,3};
    int n = 3; // 结点个数
    int** g = graph_createArrInValue(n, -1);
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, 15, 1);

    printf("原图邻接矩阵：\n");
    graph_print(g, n, "%3d ");
    printf("\n");
    int** sp_path = graph_shortestPath_Floyd(g, n);

    printf("最短路径：\n");
    utils_print_2DArr(sp_path,n, n, "%3d");

    return 0;
}
```

**运行结果：**

![在这里插入图片描述](/images/csdn/50fcc845431630611575210f.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109697080)
