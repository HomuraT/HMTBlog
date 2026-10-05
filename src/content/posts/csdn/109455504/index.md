---
title: "直接选择排序"
published: 2020-11-02
description: ''
image: ''
tags: ["算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 直接选择排序
## 算法思维
1. 直接插入排序是一种非常简单、容易写的排序
2. 在没有排好序的序列中，每次选择一个最大或最小的元素，加入有序序列，直到整个序列有序

## 算法设计
1. 创建索引变量 i ，i 的初值为0；
2. 创建数值变量current，表示当前为止最大或最小的元素
3. 创建索引变量flag，表示current值所对应的索引
4. 从包括 i 的子序列开始，往后遍历
5. 若找到可替换current值的元素，替换并将flag置为当前循环的索引
6. i 加 1，并重复4，直到最后一个元素

## 算法实现
```c
// 直接选择排序
void sort_selectionSort(int *arr, int len, int mode)
{
    int current, flag;
    for(int i = 0; i < len; i ++)
    {
        current = arr[i];
        flag = i;
        for(int j = i; j < len; j ++)
        {
            if(sort_judgeWithMode(arr[j], current, mode))
            {
                current = arr[j];
                flag = j;
            }
        }
        // 交换两个数的值
        utils_exchange(arr, i, flag);
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
	    sort_selectionSort(arr, N, 1);
	    utils_print_arr(arr, N, "%d ");
	
	
	    printf("\n\n降序排列结果:\n");
	    sort_selectionSort(arr, N, 0);
	    utils_print_arr(arr, N, "%d ");
	
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/250f1d3c84ff051b775cef5c.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109455504)
