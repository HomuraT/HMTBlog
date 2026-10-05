---
title: "最小生成树、Prim算法、Kruskal算法"
published: 2020-11-12
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---


# 最小生成树

设 $G = (V,E)$ 是一个无向连通图，生成树上各边的权值之和称为该生成树的**代价**，在G的所有生成树中，代价最小的生成树叫**最小生成树**。

## MST性质

最小生成树具有MST性质：假设 $G=(V,E)$ 是一个无向连通网，U是顶点集合V的一个非空子集。若 $(u,v)$是一条具有最小权值的边，其中$u \in U, v \in V-U$，则必存在一棵包含边 $(u,v)$ 的最小生成树。

就是说可以把图分为两个点集，两个点集之间的最小边一定在最小生成树里面。



## Prim算法

Prim算法的基本思想是：设 $G=(V,E)$ 是一个无向连通图，令 $T = (U, TE)$ 是 G 的最小生成树。T的初始状态为$U = \{v_0\}(v_0\in V),TE=\{\}$，然后重复执行下述操作：在所有$u\in U, v \in V - U$ 的中找到一条代价最小的边 $(u,v)$ 并入集合 TE ，同时 v 并入 U ，直至 U=V 为止。此时 TE 中必有 n-1 条边，则 T 就是一棵最小生成树。

也就是找一个点构成一棵最小生成子树，每次将**与树相连的包含其他结点的一条最小边和那个结点**加入生成树，直到所有结点都加入生成树。

**代码实现：**

```c
// Prim最小生成树算法
/*
g：无向图的邻接矩阵
n：结点个数

return：返回最小生成树的邻接矩阵
*/
int** graph_minimalSpanningTree_Prim(int** g, int n)
{
    // 生成一个相同大小的图
    int** g_prim = graph_createArrInValue(n, -1);
    // 记录U集合的顶点
    int* U = utils_createArr(n, 0);
    int w = -1,w_i = -1, w_j = -1;

    U[0] = 1;

    for(int k = 0; k < n-1;k ++)
    {
        w = -1;

        // 确定可选范围并找到最小边
        for(int i = 0; i < n; i ++)
        {
            // 去掉不要的行
            if(U[i] == 0) continue;

            for(int j = 0; j < n; j ++)
            {
                // 去掉不要的列
                if(U[j] == 1) continue;

                // 去掉无效边
                if(g[i][j] == -1) continue;

                // 找到可选范围内的最小边，并记录
                if(w == -1 || (w != -1 && g[i][j] < w))
                {
                    w_i = i;
                    w_j = j;
                    w = g[i][j];
                }
            }
        }

        printf("(%d,%d),%d \n", w_i, w_j, w);

        /*
        因为不能确定到底加入了哪个结点，
        但w_i,w_j中总有一个是新加入的结点
        并且另一个是已经加入过的结点，所有两个都赋值1不会有问题
        */
        U[w_i] = 1;
        U[w_j] = 1;
        g_prim[w_i][w_j] = w;
    }

    return g_prim;
}
```

**测试样例：**

![在这里插入图片描述](/images/csdn/4f932f691f37f950b149ca2d.png) 



**测试代码：**

```c
int main()
{
    int arr[27] = {0,1,34,0,5,19,0,2,46,1,4,12,5,4,26,5,2,25,5,3,25,2,3,17,3,4,38};
    int** g = graph_createArrInValue(6, -1);
    
    // 根据arr生成邻接矩阵
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, 27, 0);

    printf("原图邻接矩阵：\n");
    // 打印邻接矩阵
    graph_print(g, 6, "%2d ");
    printf("\n");
    int** g_prim = graph_minimalSpanningTree_Prim(g, 6);

    printf("最小生成树邻接矩阵：\n");
    graph_print(g_prim, 6, "%2d ");
    return 0;
}
```



**运行结果：**

![在这里插入图片描述](/images/csdn/f49a6a2f90b56a7e5542fdf8.png) 



**部分步骤图解：**（红圈是选中行，红叉是删除列，篮圈是选中边）

1. 选中 (0,5),19。此时$U=\{v_0\}$

   ![在这里插入图片描述](/images/csdn/4dbbd06bc2c27d3ffd1de427.png)

2. 选中(5,2),25。此时$U=\{v_0,v_5\}$

   ![在这里插入图片描述](/images/csdn/563b82c4708fbfdb9405a30b.png)

3. 选中(2,3),17。此时$U = \{v_0,v_5,v_2\}$

   ![在这里插入图片描述](/images/csdn/f5f4b0c64a70738db7255155.png)

4. 以此类推，就可以得到最小生成树

## Kruskal算法

Kruskal算法的基本思想是：设无向连通网为 $G=(V,E)$ ，令G的最小生成树为 $T=(U,TE)$ ，其初态为 $U=V，E=\{\}$ 这样T中各顶点各自构成一个连通分量。然后按照边的权值大小由小到大的顺序，依次考察边集 E 中各条边。若被考察的边的两个顶点术语 T 的两个不同的连通分量，则将此边加入到 TE 中，同时把两个连通分量连接成一个连通分量；若被考察的边的两个顶点同属于一个连通分量，则舍去此边，以免造成回路，如此下去，当 T 中连通分量数量为 1 时，此连通分量便为 G 的一棵最小生成树。

就是每次找一条没加入最小生成树的**代价最小的边**，如果这边两个顶点属于不同的连通分量，就将这个边加入最小生成树，否则找除去这条以外的最小边，直到所有顶点都在同一个连通分量。

**代码实现：**

```c
// Kruskal算法
/*
g：无向连通图邻接矩阵
n：顶点个数

return：最小生成树的邻接矩阵
*/
int** graph_minimalSpanningTree_Kruskal(int** g, int n)
{
    // 保存连通分量情况，值不为-1，且相等的顶点为同一个连通分量
    int* V_no = utils_createArr(n, -1);
    // 记录连通分量次数，初始连通分量个数是n
    int v_no_counter = n;
    // 最小生成树的邻接矩阵，也可以用来删除已经选过的边
    int** g_Kruskal = utils_create2DArr(n,n,-1);
	// 记录最小边的数据
    int w_i,w_j,w=-1;

    // 因为每次加入一条边就减少一个连通分量，所以循环 n-1 次就可以了
    while(--v_no_counter)
    {
        w = -1;
        // 选出符合条件的边
        for(int i = 0; i < n; i ++)
        {
            // 因为邻接矩阵是关于主对角线对称的，所以只需要找一半
            for(int j = i; j < n; j ++)
            {
                // 跳过不存在的边
                if(g[i][j] == -1) continue;
                // 跳过已经被选中的边
                if(g_Kruskal[i][j] != -1) continue;

                // 跳过相同分量的边
                if(V_no[i] == V_no[j] && V_no[i] != -1) continue;

                // 如果w未被赋值或当前边比w小
                if(w == -1 || (w != -1 && g[i][j] < w))
                {
                    w = g[i][j];
                    w_i = i;
                    w_j = j;
                }
            }
        }

        // 将两个连通分量连起来
        if(V_no[w_i] == -1 && V_no[w_j] == -1)
        {
            // 如果两个边都是第一次被选中
            V_no[w_i] = v_no_counter;
            V_no[w_j] = v_no_counter;
        }
        else if(V_no[w_i] != -1 && V_no[w_j] != -1)
        {
            // 两个结点都被选中过
            int w_i_no = V_no[w_i];
            int w_j_no = V_no[w_j];
            for(int i = 0; i < n; i ++)
            {
                // 将与w_j相同分量个顶点加入到w_i分量
                if(V_no[i] == w_j_no) V_no[i] = w_i_no;
            }
        }
        else
        {
            // w_i,w_i只有一个被选中过
            if(V_no[w_i] != -1) V_no[w_j] = V_no[w_j];
            else V_no[w_j] = V_no[w_i];
        }

        // 加入最小生成树邻接矩阵
        g_Kruskal[w_i][w_j] = w;
        printf("(%d,%d),%d\n", w_i, w_j, w);
    }

    return g_Kruskal;
}
```

**测试样例：**

![在这里插入图片描述](/images/csdn/4f932f691f37f950b149ca2d.png) 

**测试代码：**

```c
int main()
{
    int arr[27] = {0,1,34,0,5,19,0,2,46,1,4,12,5,4,26,5,2,25,5,3,25,2,3,17,3,4,38};
    int** g = graph_createArrInValue(6, -1);
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, 27, 0);

    printf("原图邻接矩阵：\n");
    graph_print(g, 6, "%2d ");
    printf("\n");
    int** g_prim = graph_minimalSpanningTree_Kruskal(g, 6);

    printf("最小生成树邻接矩阵：\n");
    graph_print(g_prim, 6, "%2d ");
    return 0;
}
```

**运行结果：**

![在这里插入图片描述](/images/csdn/6205dfdee53d294a1b9ae337.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109660907)
