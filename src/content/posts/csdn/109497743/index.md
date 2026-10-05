---
title: "递归的归并排序"
published: 2020-11-04
description: ''
image: ''
tags: ["算法", "数据结构", "C"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 递归的归并排序
## 算法思维
1. 利用递归的特性，先将当前序列的子序列并归，再并归当前序列

## 算法设计
1. 递归结束条件，当前序列的长度为1
2. 并归前一个子序列
3. 归并后一个子序列
4. 对当前序列进行并归

## 算法实现
```c
// 递归归并排序算法
void sort_mergeSort(int* arr, int len, int mode)
{
    int* arr_tmp = (int* )malloc(sizeof(int) * len);
    sort_mergeSort_main(arr, arr_tmp, 0, len-1, mode);
}

// 递归并归的执行函数
void sort_mergeSort_main(int* arr, int* arr_tmp, int s, int e, int mode)
{

    if(s == e) // 如果只有一个元素，直接赋值
    {
        arr_tmp[s] = arr[s];
    }
    else
    {
        int m = (s+e)/2;
        // 先并归前后两个子序列
        sort_mergeSort_main(arr, arr_tmp, s, m, mode);
        sort_mergeSort_main(arr, arr_tmp, m+1, e, mode);

        // 将两个子序列进行并归
        int s_1 = s, e_1 = m+1, s_2 = m+1, e_2 = e+1;
        int k = s;

        while(s_1 < e_1 && s_2 < e_2)
        {
            arr[k++] = sort_judgeWithMode(arr_tmp[s_1], arr_tmp[s_2], mode)? arr_tmp[s_1++]: arr_tmp[s_2++];
        }
        while(s_1 < e_1) arr[k++] = arr_tmp[s_1++];
        while(s_2 < e_2) arr[k++] = arr_tmp[s_2++];

        // 将并归好的序列赋给原地址
        for(int i = s; i <= e; i ++)
        {
            arr_tmp[i] = arr[i];
        }

    }
}
```

## 运算结果
1. 测试代码
	```c
	#define N 7

	int main()
	{
	    int arr[N] = {49,38,65,97,76,13,27};
	
	    sort_mergeSort(arr, N, 1);
	    utils_print_arr(arr,0, N-1, "%2d ","升序排列结果:\n", "\n\n");
	
	    sort_mergeSort(arr, N, 0);
	    utils_print_arr(arr,0, N-1, "%2d ", "降序排列结果:\n", "\n");
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/58ae2ac8411fa4c44d1bd017.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109497743)
