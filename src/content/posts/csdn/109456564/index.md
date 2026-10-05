---
title: "堆排序"
published: 2020-11-02
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 堆排序
## 算法思维
1. 堆排序也是一种选择排序，每次选出无序序列中一个最大或最小的元素并放到有序序列中去
2. 因为堆排序是从后往前放的，所以升序要用大根堆，降序要用小根堆
3. 堆排序在最坏的情况下时间复杂度也是$O(n \log n)$，并且只需要一个辅助空间

## 算法设计
1. 创建变量 i ，表示未排序序列的末尾
2. 从未排序序列末尾开始，把未排序序列视作完全二叉树，从右往左，从下往上遍历每个非叶子节点，并对结构混乱（节点与其孩子比较，不是最大或最小）的结点进行调整（与最大或最小的孩子进行交换）
3. 然后把推顶的元素与无序序列最后一个元素交换
4. 未排序序列长度 i 减 1，重复2，直到整个序列有序

## 算法实现
```c
// 堆排序
/*
mode: 非0：升序， 0：降序
*/
void sort_heapSort(int *arr, int len, int mode)
{
    int i = len - 1;
    int heap, judge_index;

    while(i > 0)
    {
        // 从最后一个结点开始
        for(int j = i; j > 0; j -=2)
        {
            // 找到双亲
            heap = (j - 1) / 2;

            // 找到要到堆顶的元素
            if( (2*heap)+2 <= i )
            {
                // 如果有两个孩子节点
                // 这里不能确定j是第一个孩子还是第二个孩子，所以直接用 heap 来当参数
                judge_index = sort_judgeWithMode(arr[2*heap + 1], arr[2*heap + 2], mode) ? 2*heap + 2 : 2*heap + 1;
                judge_index = sort_judgeWithMode(arr[heap], arr[judge_index], mode)? judge_index : heap;
            }
            else
            {
                // 因为堆是完全二叉树，所以只有一个孩子必是左孩子
                judge_index = sort_judgeWithMode(arr[heap], arr[j], mode)? j: heap;
            }
            utils_exchange(arr, heap, judge_index);
        }

        // 堆顶元素放到未排序元素的最后
        utils_exchange(arr, i, 0);

        // 结点个数减1
        i--;
    }
}
```

## 运算结果
1. 测试代码
	```c
	#define N 8

	int main()
	{
	    int arr[N] = {49,38,65,97,76,13,27,49};
	
	    printf("升序排列结果:\n");
	    sort_heapSort(arr, N, 1);
	    utils_print_arr(arr, N, "%d ");
		
	    printf("\n\n降序排列结果:\n");
	    sort_heapSort(arr, N, 0);
	    utils_print_arr(arr, N, "%d ");
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/4203b3d6714525a36cdf53a6.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109456564)
