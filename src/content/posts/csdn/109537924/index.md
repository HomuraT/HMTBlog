---
title: "折半查找"
published: 2020-11-06
description: ''
image: ''
tags: ["算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 折半查找
## 算法思维
1. 折半查找是顺序查找
2. 通过每次减少一半的待选元素来提高查找速度

## 算法设计
1. 循环执行下面操作指导待选元素数量为0
2. 对中间元素进行匹配
3. 若匹配，返回相关数据
4. 若不匹配，将待选元素数组以中间为界，缩小一半，回到 1

## 算法实现
```c
// 折半查找
/*
arr：要查找的有序数组
len：数组长度
x：要查找的元素
*/
int search_binSearch(int* arr, int len, int x)
{
    int low = 0, height = len-1;
    int m;
    while(low <= height)
    {
        m = (low+height)/2;
        if(arr[m] == x) return m;

        if(arr[m] > x)
        {
            height = m-1;
        }
        else
        {
            low = m+1;
        }
    }
    return -1;
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109537924)
