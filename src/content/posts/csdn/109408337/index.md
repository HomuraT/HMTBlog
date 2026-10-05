---
title: "起泡排序"
published: 2020-10-31
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 起泡排序
## 算法思维
1. 起泡排序是一种简单的交换排序
2. 起泡排序是从头到尾循环比较两个相邻元素，如果顺序错误就会交换这两个元素，直到序列有序

## 算法设计
1. 设置一个参数 count 用来记录每次循环交换的次数
2. 将 count 赋值为 0
3. 用循环依次比较每两个相邻元素的值，如果顺序错误，则交换并这两个元素，并将 count 加 1
4. 循环完成后，如果 count 值仍为 0，说明序列有序，否则重复2

## 算法实现
```c
// 判断
int sort_judgeWithMode(int num1, int num2, int mode)
{
    return mode? num1<num2:num1>num2;
}

// 起泡排序
/*
mode: 非0：升序， 0：降序
*/
void sort_bubbleSort(int* arr, int len, int mode)
{
    int count_exchange, tmp;
    do
    {
        count_exchange = 0;
        for(int i = 1; i < len; i ++)
        {
            if(sort_judgeWithMode(arr[i], arr[i-1], mode))
            {
                tmp = arr[i];
                arr[i] = arr[i-1];
                arr[i-1] = tmp;
                count_exchange++;
            }
        }
    }while(count_exchange);
}
```

## 运行结果
1. 测试代码
	```c
	#define N 10

	int main()
	{
	    int arr[N] = {1,3,543,234,65,23,4,23,234,87};
	
	    printf("\n降序排列结果:");
	    sort_bubbleSort(arr, N, 0);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    printf("\n\n升序排列结果:");
	    sort_bubbleSort(arr, N, 1);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    return 0;
	}
	```
2. 运行结果
	![在这里插入图片描述](/images/csdn/574ca106e6253e7e1b3c4d99.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109408337)
