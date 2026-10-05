---
title: "图的广度优先搜索"
published: 2020-10-29
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 图的广度优先搜索
## 算法描述
1. 找到一个**未被访问过的结点**$v_0$，并访问
2. 依次访问$v_0$每一个**未被访问过的相邻节点**，并对每个符合条件的**相邻**结点重复2，直到所有**已被访问过的结点**的所有**相邻结点**都被访问到
3. 若还有**未被访问过的结点**，重复1直到所有结点都被访问

## 设计思维
1. 先给所有结点编号，再创建一个相应大小的数组来存储每个结点的访问信息，数组的索引就是对应结点的编号，当结点未被访问时对应的值为1，当访问结点时将对应值置为0
2. 根据访问顺序，要当所有距离$v_0$近的结点都被访问完时才访问更远的结点，所有可以用队列来获取下一个需要访问的结点。每当访问完当前结点，就把该节点**所有未被访问过的相邻结点**入队列，并获取队列访问队列中的下一个结点
3. 图可以用邻接矩阵来存储，方便取相邻结点

## 算法实现
```c

// 图的广度优先遍历
/*
vers：结点数组
len：结点个数
*/
void graph_list_BFS_queue(VertexNode** vers, int len, char* pattern)
{
    int vs_find[len]; // 记录结点是否被访问过
    VertexNode** vs_queue = (VertexNode** )malloc(sizeof(VertexNode* ) * len); // 用来实现队列

    for(int i = 0; i < len; i ++)
    {
        vs_find[i] = 1;
        vs_queue[i] = NULL;
    }

    int f=0,r=0;// 循环队列的头和尾指针
    VertexNode* current = NULL;

    while(1)
    {
        if(current == NULL)
        {
            for(int i = 0; i < len; i ++)
            {
                if(vs_find[i]) // 找到一个未被访问的结点并访问
                {
                    current = vers[i];
                    printf(pattern, current->value); // 访问当前结点
                    vs_find[i] = 0;
                    break;
                }
            }

            if(current == NULL) return; // 没有未被访问过的结点
        }

        ArcNode* arc =NULL;
        while(current)
        {
            arc = current->firstarc;
            while(arc) // 访问所有未被访问的相邻结点，并入队列
            {
                if(vs_find[arc->adjvex])
                {
                    vs_queue[r] = vers[arc->adjvex];
                    r = (r+1)%len;
                    vs_find[arc->adjvex] = 0;
                    printf(pattern, vers[arc->adjvex]->value);

                }
                arc = arc->nextarc;
            }

            if(f==r) // 队列为空，所有当前连通分量的结点都访问完了
            {
                current = NULL;
            }
            else
            {
                // 取出下一个需要访问的结点
                current = vs_queue[f];
                f = (f+1)%len;
            }
        }
    }

}
```

## 运算结果
1. 测试代码
	```c
	int main()
	{
	    int arr[18] = {0,1,1,0,2,1,0,3,1,1,2,1,2,3,1,2,4,1};
	    VertexNode** vers = graph_list_VerArr(5);
	    graph_list_createAdjacencyMatrixByArrWithWeight(vers, arr, 18, 0);
	    printf("邻接矩阵如下:\n");
	    graph_list_print(vers, 5, "%d号结点 :", "-> %d");
	
	    printf("\n广度优先搜索如下:\n");
	    graph_list_BFS_queue(vers, 5, "%d ");
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/05a25c765ec3bbe0f2c2824d.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109368229)
