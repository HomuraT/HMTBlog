---
title: "基数排序-最低位优先法"
published: 2020-11-04
description: ''
image: ''
tags: ["算法", "数据结构"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 基数排序-最低位优先法
## 算法思维
1. 基数排序是一种非比较型的排序，其原理是把数字按位数分割，然后对每一位进行分配和收集
2. 最低位优先法就是从数字的最低为开始，依次分配和收集
3. 最低位优先法相较于最高位优先法，最低位优先法不需要分子序列

## 算法设计
1. 确定数字最高位数
2. 对每个数字的每一位从低位到高位进行下面操作
3. 先按照位数大小进行分配，然后按照排列顺序进行收集，根据分配收集的特性，可以用队列来实现

## 算法实现
```c
// 基数排序，最高位优先法
/*
len_number：数字最长位数
*/
void sort_radixSort_MSD(int* arr, int len, int len_number, int mode)
{
    // 创建头指针
    SNode* arr_list = createSNode(-1);
    addSListToTheNext(arr_list, createList(arr, len));

    // 记录头地址
    SNode* arr_list_head = arr_list;
    SNode* node_tmp;

    // 初始化关键码数组
    Queue** digit_arr[10];
    for(int i = 0; i < 10; i ++) digit_arr[i] = createQueue();

    // 用来截取关键码
    int flag = 1;
    int flag_tmp = 1;

    // 存放关键码
    int digit_tmp;
    while(flag_tmp++ <= len_number)
    {
        // 将数字按关键码排好
        while(arr_list->next)
        {
            node_tmp = deleteNextSNode(arr_list);
            digit_tmp = node_tmp->value / flag % 10;
            queue_push(digit_arr[digit_tmp], node_tmp);
        }

        // 按顺序从关键码数组中取出数据
        for(int i = 0; i < 10; i ++)
        {
            while(node_tmp = queue_pop(digit_arr[mode? i : (9 - i)]))
            {
                addSNodeToTheNext(arr_list, node_tmp);
                arr_list = arr_list->next;
            }
        }

        // 把地址重新赋值
        arr_list = arr_list_head;
        flag *= 10;
    }

    // 把相应的值赋给数组
    for(int i = 0; i < len; i ++)
    {
        arr[i] = deleteNextSNode(arr_list)->value;
    }
}
```

## 运算结果
1. 测试代码
	```c
	#define N 10

	int main()
	{
	    int arr[N] = {278,109,63,930,589,184,505,269,8,83};
	
	    sort_radixSort_MSD(arr, N, 3, 1);
	    utils_print_arr(arr,0, N-1, "%2d ","升序排列结果:\n", "\n\n");
	
	    sort_radixSort_MSD(arr, N, 3, 0);
	    utils_print_arr(arr,0, N-1, "%2d ", "降序排列结果:\n", "\n");
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/2e7b24a6cea01445ac0b4ef6.png)

## 其他
![最低位优先法动态图](/images/csdn/a185eac8828e16b2f2d1402d.png)
[图片来源](https://www.runoob.com/w3cnote/radix-sort.html)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109499370)
