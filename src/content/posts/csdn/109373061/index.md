---
title: "直接插入排序"
published: 2020-10-31
description: ''
image: ''
tags: ["算法", "数据结构", "C"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 直接插入排序
## 算法思路
1. 将第一个记录看成有序的子序列
2. 从第二个记录起逐个进行插入，从而得到一个新的有序子序列，直到整个数列有序

## 设计思维
1. 因为正序和倒序只有比较方式不同，其他操作均相同，所以可以加入一个mode参数表示升序还是降序
2. 当找到插入位置时，需要把插入位置后面的元素全部向后移动，再插入相应位置
3. 当没找到插入位置时，要把全部元素向后移动，再插入第一位

## 算法实现
```c
// 判断
int sort_judgeWithMode(int* arr, int i, int j, int mode)
{
    return mode? arr[j]<arr[i]:arr[j]>arr[i];
}

// 直接插入排序
/*
mode: 非0：升序， 0：降序
*/
void sort_straightInsertionSort(int* arr, int len, int mode)
{
    int tmp;
    for(int i = 1; i < len; i ++)
    {
        for(int j = i-1; j >= -1; j --)
        {
            /*
            如果有匹配成功的数，插入即可
            如果没有匹配成功的数，那这个数就需要插入在最前面，此时j=-1
            并且插入方法与匹配成功一致
            */
            if(j == -1 || sort_judgeWithMode(arr, i, j, mode))
            {
                tmp = arr[i];
                // 移动需要移动的元素
                for(int k = i; k > j; k--)
                {
                    arr[k] = arr[k-1];
                }
                arr[j+1] = tmp;
                break;
            }
        }
    }
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
	    sort_straightInsertionSort(arr, N, 0);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    printf("\n\n升序排列结果:");
	    sort_straightInsertionSort(arr, N, 1);
	    for(int i = 0; i < N; i ++) printf("%3d ", arr[i]);
	
	    return 0;
	}
	```
2. 运行结果
	 ![在这里插入图片描述](/images/csdn/927abc123f9a2c168f4f42f3.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109373061)
