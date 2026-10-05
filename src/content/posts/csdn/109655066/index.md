---
title: "哈夫曼树及哈夫曼编码、哈夫曼算法"
published: 2020-11-12
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 哈夫曼树及哈夫曼编码、哈夫曼算法

## 哈夫曼树相关概念

哈夫曼树也称**最优二叉树**在实际中有着广泛的应用。下面有几个相关概念。

### 叶子结点的权值

叶子节点的权值是对叶子结点赋予一个有意义的数值量。

### 二叉树带权路径长度

设二叉树具有n个带权的叶子结点，从根结点到各个叶子结点的路径长度与相应叶子结点权值的乘积之和叫做二叉树的带权路径长度，记为：$WLP = \sum\limits^n_{k=1}w_kl_k$，其中，$w_k$为第k个叶子结点的权值，$l_k$为从根节点到第k个叶子结点的路径长度。如下图，其带权路径长度为：$WPL = 2\times 2 + 4 \times 2 + 5 \times 2 + 3 \times 2 = 28$

![在这里插入图片描述](/images/csdn/9bb08a3791e3cb652deca7b6.png)

### 哈夫曼树

给定一组具有确定权值的叶子结点，可以构造出不同的二叉树，将其中**带权路径长度最小（WPL）**的二叉树称为**哈夫曼树**。因为哈夫曼树只有度为0和2的结点，所以当**叶子结点**有 **n** 个时，**非叶子节点**有 **n-1**个。



## 哈夫曼编码

如果一组编码中任何编码都不是其他任何一个编码的前缀，我们称这组编码为**前缀编码**。前缀编码可以保证被解码时不会有多种可能性。哈夫曼树可用于构造最短的不等长编码方案。对字符的词频构造一棵哈夫曼树，规定哈夫曼树的左分支代表0，右分支代表1，则从根节点到每个叶子节点所经过的路径组成的0和1的序列便为该叶子结点的对应字符编码，称为**哈夫曼编码**。



## 哈夫曼算法

用 $n \times 4$ 的二维数组代表哈夫曼树，四列分别表示①整棵树的权值，②双亲结点的下标③、左孩子结点的下标，，④右孩子结点的下标，$n = 2 \times 叶子结点个数 -1$ 。

**构建哈夫曼树：**

```c
// 创建哈夫曼树，用二维数组表示
/*
arr：叶子结点
len：叶子结点的个数

return：一个二维数组，
有2len - 1 行，4列，其中四个列分别表示
①整棵树的权值，②双亲结点的下标
③左孩子结点的下标，，④右孩子结点的下标
*/
int** huffmanTree(int* arr, int len)
{
    // 创建哈夫曼树数组并初始化为-1
    int** hft = utils_create2DArr(2*len-1, 4, -1);

    for(int i = 0; i < len; i ++)
    {
        // 把叶子节点的权值加入哈夫曼树
        hft[i][0] = arr[i];
    }


    // 如果只有一个结点，直接返回
    if(len == 1) return hft;

    // 最小的两个数，其中m[0] <= m[1]
    int m[2] = {-1, -1};
    // 最小两个元素的下标
    int index[2] = {-1, -1};

    for(int i = len; i < 2*len-1; i ++)
    {
        // 找两个最小的没有双亲的结点
        for(int j = 0; j < i; j ++)
        {
            // 跳过有双亲的结点
            if(hft[j][1] >= 0) continue;

            // 当m中有-1时，优先赋值
            if(m[0] == -1)
            {
                m[0] = hft[j][0];
                index[0] = j;
                continue;
            }

            if(m[1] == -1)
            {
                m[1] = hft[j][0];
                index[1] = j;
                continue;
            }

            if(hft[j][0] < m[1])
            {
                m[1] = hft[j][0];
                index[1] = j;
            }

            if(m[0] > m[1])
            {
                // 确保m[0] <= m[1]
                utils_exchange(m, 0, 1);
                utils_exchange(index, 0, 1);
            }
        }

        // 将两个子树的权值相加赋给双亲结点
        hft[i][0] = m[0]+m[1];

        // 设置双亲的孩子结点
        hft[i][2] = index[0];
        hft[i][3] = index[1];

        // 设置孩子结点的双亲
        hft[index[0]][1] = i;
        hft[index[1]][1] = i;

        // 重置最小结点数组
        m[0] = -1;
        m[1] = -1;
    }

    return hft;
}
```



**计算WPL算法实现：**

```c
// 计算带权路径长度
/*
hft：哈夫曼树二维维数组
len：叶子结点个数
printProcess：是否打印过程，非0，打印；0，不打印
*/
int huffmanTree_WPL(int** hft, int len, int printProcess)
{
    int WPL = 0;
    int l = 0; // 叶子节点的路径长度
    int index = 0; // 用来计算路径长度的变量

    for(int i = 0; i < len; i ++)
    {
        l = 0;
        index = hft[i][1];
        while(index != -1)
        {
            l++;
            index = hft[index][1];
        }


        if(printProcess)
        {
            if(i == len-1) printf(" %d X %d = ", hft[i][0], l);
            else printf(" %d X %d + ", hft[i][0], l);
        }
        WPL += l * hft[i][0];
    }

    if(printProcess)
    {
        printf(" %d ", WPL);
    }

    return WPL;
}
```



**样例测试：**

对于{A,B,C,D,E}，使用频率分别为{35,25,15,15,10}

```c
#define N 5

int main()
{
    int arr[N] = {35,25,15,15,10};
    int** hft = huffmanTree(arr, N);
    printf("哈夫曼树：\n");
    utils_print_2DArr(hft, N*2-1,4,"%3d");

    printf("\nWPL:");
    huffmanTree_WPL(hft, N, 1);
    return 0;
}
```



**测试结果：**

![在这里插入图片描述](/images/csdn/a7800df1caf95609ea091161.png) 



**哈夫曼树和哈夫曼编码为：**

<img src="/images/csdn/b2a5eab2dc73d60c03cfb802.png" alt="在这里插入图片描述" style="zoom:30%;" />

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109655066)
