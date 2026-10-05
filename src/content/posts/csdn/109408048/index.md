---
title: "希尔排序"
published: 2020-10-31
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 希尔排序
## 算法思路
1. 希尔排序又称缩小增量排序，也是一种插入排序
2. 希尔排序的思路是将整个待排序记录分割成若干个子序列分别进行插入排序
3. 然后每排序一次后将增量减少再进行排序
4. 当整个序列“基本有序”时，再对全体记录进行一次排序
5. 希尔排序相较于普通插入排序，改进主要在减少元素之间交换次数上

## 算法设计
1. 第一趟排序将增量 span 设为 数组长度的一半即 len/2
2. 然后根据增量对各个子序列进行插入排序
3. 当增量为1时结束排序
4. 将增量减少一半，当增量为0时赋值为1，并重复2

## 算法实现
```c
// 判断
int sort_judgeWithMode(int num1, int num2, int mode)
{
    return mode? num1<num2:num1>num2;
}

// 希尔排序
void sort_shellSort(int *arr, int len, int mode)
{
    int span=1, tmp;

    do
    {
        span = span / 2;
        span = span>0? span: 1;

        for(int i = 0; i < span; i ++)
        {
            for(int j = i+span; j < len; j += span)
            {
                for(int k = j; k >= span; k -=span)
                {
                    if(sort_judgeWithMode(arr[k], arr[k-span], mode))
                    {
                        tmp = arr[k-span];
                        arr[k-span] = arr[k];
                        arr[k] = tmp;
                    }
                }
            }
        }

    }while(span > 1);
}
```

## 运算结果
1. 测试代码
	```c
	#define N 10

	int main()
	{
	    int arr[N] = {1,3,543,234,65,23,4,23,234,87};
	
	    printf("\n降序排列结果:");
	    sort_shellSort(arr, N, 0);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    printf("\n\n升序排列结果:");
	    sort_shellSort(arr, N, 1);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/e1f8f06431d240c17eb87d9a.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109408048)
