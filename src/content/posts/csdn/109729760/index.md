---
title: "AOV网与拓扑排序、拓扑排序算法"
published: 2020-11-16
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# AOV网与拓扑排序

## AOV网

在一个表示工程的有向图中，用顶点表示活动，用弧表示活动之间的优先关系，称这样的有向图为顶点表示活动的网，简称 **AOV网**(activity on vertex network)。

AOV网中的弧表示了活动之间存在的某种制约关系。在AOV网中不能出现**回路**，否则意味着某活动的开始要以自己的完成为先决条件，显然，这是荒谬的。因此判断AOV网所代表的工程是否能顺利进行，即判断它是否存在回路。而测试AOV是否存在回路的方法，就是对AOV网进行拓扑排序。

## 拓扑排序

设 $G=(V,E)$ 是一个有向图，$V$中的顶点序列$v_0,v_1,...,v_{n-1}$称为一个**拓扑序列**，当且仅当满足下列条件：若顶点从 $v_i$ 到 $v_j$ 有一条路径，则在顶点序列中 $v_i$ 必须在 $v_j$ 之前。对一个有向图构造**拓扑序列**的过程称为**拓扑排序**。

# 拓扑排序算法

## 算法思想

1. 找到没有入度的结点，输出并将相关边删除
2. 重复1，直到没有入度为 0 的顶点
3. 若全部顶点都被输出，则说明没有环路，否则说明有环路



## 算法设计

1. 为了防止每次遍历所有顶点，可以用栈来存储，每次只找出栈的顶点的边指向的顶点。
2. 遍历一次邻接矩阵，计算所有顶点的入度
3. 遍历一次顶点，把入度为 0 的顶点入栈
4. 获得栈顶顶点，输出并减少相关顶点的入度，当入度减少为 0 时，将该顶点入栈
5. 循环 4 直到栈空



## 算法实现

**代码实现：**

```c
// 拓扑排序
/*
g：图的邻接矩阵
n：顶点个数

return：拓扑序列
*/
int* graph_topSort(int** g, int n)
{
    // 存储每个结点的入度
    int* g_in = utils_createArr(n, 0);

    int count_in;
    for(int i = 0; i < n; i ++)
    {
        count_in = 0;
        for(int j = 0; j < n; j ++)
        {
            // 每一列边的个数表示顶点的入度
            if(g[j][i] != -1) count_in++;
        }
        g_in[i] = count_in;
    }

    // 创建栈
    SNode* ts_stack = createStack();

    int i_tmp;
    // 记录拓扑序列顺序的数组
    int* ts_seq = utils_createArr(n,-1);
    // 记录拓扑序列数组中元素的个数
    int ts_seq_i = 0;

    // 将入度为0的顶点入栈
    for(int i = 0; i < n; i ++)
    {
        if(g_in[i] == 0)
        {
            // 将初始入度为 0 的顶点入栈
            stack_push(ts_stack, createSNode(i));
        }
    }

    // 当栈为空时，退出循环
    while(stack_getLen(ts_stack))
    {
        i_tmp = stack_pop(ts_stack)->value;

        for(int i = 0; i < n; i ++)
        {
            // i_tmp 删除所有边相关的入度
            if(g[i_tmp][i] != -1)
            {
                g_in[i]--;
                // 当有个顶点的入度因为去掉当前边而变为0时，将其入栈
                if(g_in[i] == 0)
                    stack_push(ts_stack, createSNode(i));
            }
        }

        // 记录拓扑序列
        ts_seq[ts_seq_i++] = i_tmp;
    }

    // 当拓扑序列没有排满时，说明有回路
    if(ts_seq_i < n)
    {
        printf("有回路\n");
        // 返回空
        return NULL;
    }
    return ts_seq;
}
```

**测试样例：**

![在这里插入图片描述](/images/csdn/ee217384c8f42330792781e9.png) 

**测试代码：**

```c
int main()
{
    // 边数组，i%3=0 表示起点；i%3=1 表示终点；i%3=2 表示权值
    int arr[27] = {1,0,1,1,3,1,2,0,1,2,3,1,3,0,1,4,2,1,4,3,1,4,5,1,3,5,1,0,1,1};
    int n = 6; // 结点个数
    char vs[6] = {'A','B','C','D','E','F'};
    int** g = graph_createArrInValue(n, -1);
    // 创建相关邻接矩阵
    graph_createAdjacencyMatrixByArrWithWeight(g,arr, 27, 1);

    printf("原图邻接矩阵：\n");
    graph_print(g, n, "%3d ");
    printf("\n");
    int* ts = graph_topSort(g, n);

    printf("拓扑序列：");
    for(int i = 0; i < n; i ++)
        printf("%c ", vs[ts[i]]);

    return 0;
}
```

**运算结果：**

![在这里插入图片描述](/images/csdn/ab5c024f7dd5cc99d3a7fd07.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109729760)
