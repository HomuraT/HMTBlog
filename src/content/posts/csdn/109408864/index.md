---
title: "快速排序"
published: 2020-11-02
description: ''
image: ''
tags: ["算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 快速排序
## 算法思维
1. 快速排序是对起泡排序的一种改进
2. 快速排序的基本思想是，通过一趟排序将待排序的记录分割成独立的两部分，一部分的元素均小于另一部分的元素，然后再对两部分进行快速排序，直到整个序列有序

## 算法设计
1. 用递归可以更快速、清晰地实现快速排序
2. 设两个索引变量 i 和 j，分别作为数组左、右端的索引
3. 当 i < j 时进行下面的操作
4. 从数组右边索引 j 开始往左遍历，直到找到与 i 索引顺序错误的元素，或直到 i = j
5. 如果此时 i < j，交换两个元素
6. 从数组左边索引 i 开始往右遍历，直到找到与 j 索引顺序错误的元素，或直到 i = j
7. 如果此时 i < j，交换两个元素
8. 重复 3，直到 i >= j
9. 对以 i 或 j 为界的两边子序列进行快速排序，直到整个序列有序

## 算法实现
```c
// 快速排序
/*
mode: 非0：升序， 0：降序
*/
void sort_quickSort(int *arr, int len, int mode)
{
    sort_quickSort_main(arr, 0, len-1, mode);
}

// 快速排序递归函数
void sort_quickSort_main(int *arr, int i, int j, int mode)
{
    int tmp;
    int s = i;
    int e = j;

    if(i >= j) return;

    while(i < j)
    {
        // arr[j] >= arr[i]
        while(!sort_judgeWithMode(arr[j], arr[i], mode) && (i < j))
        {
            j--;
        }

        if(i < j)
        {
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }

        while(!sort_judgeWithMode(arr[j], arr[i], mode) && (i < j))
        {
            i++;
        }

        if(i < j)
        {
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    sort_quickSort_main(arr, s, i-1, mode);
    sort_quickSort_main(arr, i+1, e, mode);
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
	    sort_quickSort(arr, N, 1);
	    utils_print_arr(arr, N, "%d ");
	
	
	    printf("\n\n降序排列结果:\n");
	    sort_quickSort(arr, N, 0);
	    utils_print_arr(arr, N, "%d ");
	
	
	    return 0;
	}
	```
2. 运行结果
	![在这里插入图片描述](/images/csdn/d49ef482d07f042a25e84cbd.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109408864)
