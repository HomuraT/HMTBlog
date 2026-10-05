---
title: "链表插入排序"
published: 2020-10-31
description: ''
image: ''
tags: ["数据结构", "算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# 链表插入排序
## 算法思维
1. 将第一个元素看作一个有序序列
2. 将后面的元素按升降次序插入有序序列，一直重复直到整个序列有序

## 设计思维
1. 用带有头节点的列表 list 方便运算
2. 因为升序和降序只有判断方法不一样，所以可以设置一个mode变量表示排序方式
3. 创建一个新的链表 list_sorted 存放有序序列，按反序放置，此时有序数列的最后一个元素就是此链表的第一个元素
4. 取出一个未排序的元素，找到相应的位置并插入，重复4直到所有结点有序
5. 再按照反序把 list_sorted 中的元素插入 list中，即可得到最后结果

## 算法实现
```c
// 判断
int sort_judgeWithMode(int num1, int num2, int mode)
{
    return mode? num1<num2:num1>num2;
}


// 链表插入排序
/*
mode: 非0：升序， 0：降序
*/
void sort_straightInsertionSort_list(SNode* slist, int mode)
{
    SNode *slist_sorted = createSNode(-1);
    SNode *current, *slist_sorted_tmp, *slist_sorted_tmp_next;

    while(slist->next)
    {
        // 获得一个未排序的
        current = deleteNextSNode(slist);
        slist_sorted_tmp = slist_sorted;
        while(1)
        {
            // c语言好像不能直接用->next->value，所以设个变量
            slist_sorted_tmp_next = slist_sorted_tmp->next;
            if(slist_sorted_tmp_next == NULL ||
               sort_judgeWithMode(slist_sorted_tmp_next->value, current->value, mode))
            {
                addSNodeToTheNext(slist_sorted_tmp, current);
                break;
            }
            slist_sorted_tmp = slist_sorted_tmp_next;
        }
    }

	// 将有序链表反序插回
    while(slist_sorted->next)
    {
        addSNodeToTheNext(slist, deleteNextSNode(slist_sorted));
    }
}
```

## 运算结果
1. 测试代码
	```c
	#define N 11
	
	int main()
	{
	    int arr[N] = {-1,1,3,543,234,65,23,4,23,234,87};
	
	    SNode* slist = createList(arr,N);
	    printSNodes(slist,"%d ", "\n");
	    printf("降序：");
	    sort_straightInsertionSort_list(slist, 0);
	    printSNodes(slist,"%d ", "\n");
	    printf("升序：");
	    sort_straightInsertionSort_list(slist, 1);
	    printSNodes(slist,"%d ", "\n");
	
	    return 0;
	}
	```
2. 运算结果
	![在这里插入图片描述](/images/csdn/82a9ce9cf6338fd30ec02252.png)

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/109406998)
