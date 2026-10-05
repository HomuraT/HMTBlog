---
title: "迭代的并归排序"
published: 2020-11-02
description: ''
image: ''
tags: ["算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 迭代的并归排序
## 算法思维
1. 并归的含义是将两个或两个以上的有序序列合并成一个新的有序序列
2. 并归排序的时间复杂度为$n \log n$，需要申请与待排序序列相等的辅助空间，是一种稳定的排序方法

## 算法设计
1. 将初始待并归序列长度设为 1
2. 将两个相邻的未并归的子序列并归成一个新的有序序列
3. 循环执行2直到所有子序列并归成一个有序序列

## 算法实现
```c
// 迭代并归排序
/*
mode: 非0：升序， 0：降序
*/
void sort_mergeSort_noRecursion(int *arr, int len, int mode)
{
    int *arr_point = arr;
    int *arr_tmp = (int *)malloc(sizeof(int) * len), *tmp;
    int s_1,e_1,s_2,e_2, arr_tmp_index;
    int span = 1;

    while(span < len)
    {
        arr_tmp_index = 0;
        for(int i = 0; i < len; i += 2*span)
        {
            // 两个相邻序列的开始和结束索引
            s_1 = utils_min(i, len);
            e_1 = utils_min(s_1+span, len);
            s_2 = utils_min(e_1, len);
            e_2 = utils_min(s_2+span, len);

            // 将两个序列按顺序并入新序列
            while(s_1 < e_1 && s_2 < e_2)
                arr_tmp[arr_tmp_index++] = sort_judgeWithMode(arr[s_1], arr[s_2], mode)? arr[s_1++] : arr[s_2++];

            // 当其中一个序列全部并入，剩下的一个序列直接按顺序并入
            while(s_1 < e_1) arr_tmp[arr_tmp_index++] = arr[s_1++];
            while(s_2 < e_2) arr_tmp[arr_tmp_index++] = arr[s_2++];

        }

        // 交换两个数组的指针方便运算
        tmp = arr_tmp;
        arr_tmp = arr;
        arr = tmp;

        // 并归序列长度翻倍
        span *= 2;
    }

    // 如果当前arr的地址不是原来的地址，将有序序列赋给原来地址的数组
    if(arr != arr_point)
    {
        for(int i = 0; i < len; i ++)
        {
            arr_point[i] = arr[i];
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
	
	    printf("升序排列结果:\n");
	    utils_print_arr(arr, N, "%2d ");
	    printf("\n");
	    sort_mergeSort_noRecursion(arr, N, 1);
	
	    printf("\n\n降序排列结果:\n");
	    utils_print_arr(arr, N, "%2d ");
	    printf("\n");
	    sort_mergeSort_noRecursion(arr, N, 0);
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/64681cc30446b81c1df8f059.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109458496)
