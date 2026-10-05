---
title: "2. 两数相加"
published: 2021-02-04
description: ''
image: ''
tags: ["算法"]
category: "学习记录"
draft: false
lang: 'zh-CN'
---

# [2. 两数相加](https://leetcode-cn.com/problems/add-two-numbers/)

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

 

**示例 1：**

![img](/images/csdn/4f015a609d1a9410b1218362.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

**示例 2：**

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

**示例 3：**

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

 

**提示：**

- 每个链表中的节点数在范围 `[1, 100]` 内
- `0 <= Node.val <= 9`
- 题目数据保证列表表示的数字不含前导零

****

# 代码

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // 返回结果的头指针
        ListNode result = new ListNode();

        // 用来存储结果的尾结点
        ListNode p = result;

        // 表示是否有进位 1：有， 0：没有
        int flag = 0;

        // 用来存放运算中间值的变量
        int num1 = 0;
        int num2 = 0;
        int tmp = 0;
        /**
         * l1 != null || l2 != null 成立直到两个列表都遍历完
         * flag != 0 成立表示没有进位
         *
         * 当两个列表都遍历完，并且没有进位时，循环结束
         */
        while(l1 != null || l2 != null || flag != 0) {
            /**
             * [1],[1,1,1]
             * 可以看成
             * [1,0,0],[1,1,1]
             * 当其中一个列表遍历完时，所有的数用0替代
             */
            num1 = (l1 == null) ? 0 : l1.val;
            num2 = (l2 == null) ? 0 : l2.val;

            /**
             * 计算相应的和，
             * 如果超过10，进位(flag = 1)
             * 如果小于10, 不进位(flag = 0)
             * 然后把 两数之和 取个位数添加进结果列表
             */
            tmp = num1 + num2 + flag;
            flag = tmp / 10;
            tmp = tmp % 10;
            p.next = new ListNode(tmp);
            p = p.next;

            /**
             * 只有当列表不为空时，才移动指针
             * 防止空一场
             */
            if(l1 != null) l1 = l1.next;
            if(l2 != null) l2 = l2.next;
        }

        // 返回头指针之后的列表
        return result.next;
    }
}
```

---

原文链接：[CSDN](https://blog.csdn.net/qq_42464569/article/details/113664891)
